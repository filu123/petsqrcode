import { getSupabaseClient } from '$lib/services/api';
import type { Database } from '../../DatabaseDefinitions';
import type { User } from '@supabase/supabase-js';

type Profile = Database['public']['Tables']['profiles']['Row'];

// State
let user = $state<User | null>(null);
let profile = $state<Profile | null>(null);
let isLoading = $state(false);
let error = $state<string | null>(null);
let isAuthenticated = $state(false);

// Initialize the store
async function initialize() {
  isLoading = true;
  error = null;
  
  try {
    const supabase = getSupabaseClient();
    
    // Get the current user
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      error = userError.message;
      isAuthenticated = false;
      return;
    }
    
    user = currentUser;
    isAuthenticated = !!currentUser;
    
    // If we have a user, get their profile
    if (currentUser) {
      await loadUserProfile();
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    isAuthenticated = false;
  } finally {
    isLoading = false;
  }
}

// Load user profile
async function loadUserProfile() {
  if (!user) {
    error = 'No user is logged in';
    return;
  }
  
  isLoading = true;
  error = null;
  
  try {
    const supabase = getSupabaseClient();
    
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      error = profileError.message;
      return;
    }
    
    profile = data;
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
  } finally {
    isLoading = false;
  }
}

// Update user profile
async function updateProfile(profileData: Partial<Profile>) {
  if (!user) {
    error = 'No user is logged in';
    return null;
  }
  
  isLoading = true;
  error = null;
  
  try {
    const supabase = getSupabaseClient();
    
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();
    
    if (updateError) {
      error = updateError.message;
      return null;
    }
    
    profile = data;
    return data;
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    return null;
  } finally {
    isLoading = false;
  }
}

// Sign out the user
async function signOut() {
  isLoading = true;
  error = null;
  
  try {
    const supabase = getSupabaseClient();
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      error = signOutError.message;
      return false;
    }
    
    user = null;
    profile = null;
    isAuthenticated = false;
    return true;
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    return false;
  } finally {
    isLoading = false;
  }
}

// Update user email
async function updateEmail(newEmail: string) {
  isLoading = true;
  error = null;
  
  try {
    const supabase = getSupabaseClient();
    const { error: updateError } = await supabase.auth.updateUser({ email: newEmail });
    
    if (updateError) {
      error = updateError.message;
      return false;
    }
    
    return true;
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    return false;
  } finally {
    isLoading = false;
  }
}

// Update user password
async function updatePassword(newPassword: string) {
  isLoading = true;
  error = null;
  
  try {
    const supabase = getSupabaseClient();
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    
    if (updateError) {
      error = updateError.message;
      return false;
    }
    
    return true;
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    return false;
  } finally {
    isLoading = false;
  }
}

// Listen for auth state changes
function setupAuthListener() {
  const supabase = getSupabaseClient();
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        user = session.user;
        isAuthenticated = true;
        await loadUserProfile();
      } else if (event === 'SIGNED_OUT') {
        user = null;
        profile = null;
        isAuthenticated = false;
      } else if (event === 'USER_UPDATED' && session?.user) {
        user = session.user;
        await loadUserProfile();
      }
    }
  );
  
  // Return the unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
}

// Export the store
export const userStore = {
  // State
  get user() { return user; },
  get profile() { return profile; },
  get isLoading() { return isLoading; },
  get error() { return error; },
  get isAuthenticated() { return isAuthenticated; },
  
  // Actions
  initialize,
  loadUserProfile,
  updateProfile,
  signOut,
  updateEmail,
  updatePassword,
  setupAuthListener,
  
  // Derived state
  get hasCompletedOnboarding() { return profile?.has_completed_onboarding || false; },
  get userFullName() { 
    return profile ? `${profile.first_name} ${profile.last_name}`.trim() : ''; 
  }
};