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
  const { session, user } = await load_helper(data?.session || null, supabase)
  
  // Remove the redirect logic from here since it's now handled in hooks.server.ts
  
  // Get the user profile if authenticated
  let profile = null
  let pets = []
  
  if (session && user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select(`*`)
      .eq("id", user.id)
      .single()
    
    profile = profileData

    const { data: petsData } = await supabase
      .from("pets")
      .select(`*`)
      .eq("profile_id", user.id)
    
    pets = petsData || []
  }

  // Initialize stores in browser
  if (isBrowser() && session && user) {
    userStore.initialize()
    
    if (profile && _hasFullProfile(profile)) {
      petStore.loadUserPets()
      
      if (pets && pets.length > 0) {
        selectedPetStore.selectFirstPetIfNoneSelected()
      }
    }
  }

  return {
    supabase,
    session,
    profile,
    user,
    pets,
    amr: null, // You can add this back if needed
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


