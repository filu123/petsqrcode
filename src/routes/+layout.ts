import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public"
import {
  createBrowserClient,
  createServerClient,
  isBrowser,
} from "@supabase/ssr"
import { redirect } from "@sveltejs/kit"
import type { Database } from "../DatabaseDefinitions"
import { CreateProfileStep } from "../config"
import { load_helper } from "$lib/load_helpers"
import { userStore } from "$lib/stores/userStore"
import { petStore } from "$lib/stores/petStore"
import { selectedPetStore } from "$lib/stores/selectedPetStore"

export const load = async ({ fetch, data = {}, depends, url }) => {
  depends("supabase:auth")

  // Safely access cookies with default empty array
  const cookies = data?.cookies || []

  const supabase = isBrowser()
    ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
      })
    : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
        cookies: {
          getAll() {
            return cookies
          },
        },
      })

  // Pass null as default session if data.session is undefined
  const { session, user } = await load_helper(data?.session || null, supabase)
  
  // Non-authenticated routes - allow access to public routes
  if (!session || !user) {
    // Only redirect to login for protected routes
    if (url.pathname.startsWith('/dashboard') || 
        url.pathname.startsWith('/api/')) {
      redirect(303, "/login")
    }
    
    return {
      supabase,
      session: null,
      profile: null,
      user: null,
      pets: [],
      amr: null,
    }
  }

  // Get the user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select(`*`)
    .eq("id", user.id)
    .single()

  // Get the user's pets
  const { data: pets } = await supabase
    .from("pets")
    .select(`*`)
    .eq("profile_id", user.id)

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

  // Check for incomplete profile
  const createProfilePath = "/dashboard/create_profile"
  const signOutPath = "/dashboard/sign_out"
  if (
    !profile ||
    !_hasFullProfile(profile) &&
    url.pathname !== createProfilePath &&
    url.pathname !== signOutPath &&
    CreateProfileStep
  ) {
    redirect(303, createProfilePath)
  }

  // Initialize stores in browser
  if (isBrowser()) {
    // Initialize user store with loaded data
    userStore.initialize();
    
    // Load pets if profile is complete
    if (profile && _hasFullProfile(profile)) {
      petStore.loadUserPets();
      
      // Select first pet if none selected
      if (pets && pets.length > 0) {
        selectedPetStore.selectFirstPetIfNoneSelected();
      }
    }
  }

  return {
    supabase,
    session,
    profile,
    user,
    pets: pets || [],
    amr: aal?.currentAuthenticationMethods,
  }
}

// Same as before
export const _hasFullProfile = (
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null,
) => {
  if (!profile) {
    return false
  }

  if (profile.has_completed_onboarding) {
    return true
  }

  // Required fields check
  const requiredFields = [
    'first_name',
    'last_name',
    'mobile_phone',
    'email',
    'country',
    'address'
  ]

  return requiredFields.every(field => profile[field as keyof typeof profile])
}