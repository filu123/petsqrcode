import { writable, derived, get } from 'svelte/store';
import { getSupabaseClient } from '$lib/services/api';
import type { Database } from '../../DatabaseDefinitions';
import type { User } from '@supabase/supabase-js';
import type { Profile } from './index';

// Create the store state
const createUserStore = () => {
  const user = writable<User | null>(null);
  const profile = writable<Profile | null>(null);
  const isLoading = writable(false);
  const error = writable<string | null>(null);
  const isAuthenticated = writable(false);

  // Define derived store for user's full name
  const userFullName = derived(profile, $profile => {
    return $profile ? `${$profile.first_name} ${$profile.last_name}`.trim() : '';
  });

  // Define derived store for whether the user has completed onboarding
  const hasCompletedOnboarding = derived(profile, $profile => {
    return $profile?.has_completed_onboarding || false;
  });

  // Initialize the store
  async function initialize() {
    isLoading.set(true);
    error.set(null);
    
    try {
      const supabase = getSupabaseClient();
      
      // Get the current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        error.set(userError.message);
        isAuthenticated.set(false);
        return;
      }
      
      user.set(currentUser);
      isAuthenticated.set(!!currentUser);
      
      // If we have a user, get their profile
      if (currentUser) {
        await loadUserProfile();
      }
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'An unknown error occurred');
      isAuthenticated.set(false);
    } finally {
      isLoading.set(false);
    }
  }

  // Load user profile
  async function loadUserProfile() {
    const currentUser = get(user);
    if (!currentUser) {
      error.set('No user is logged in');
      return;
    }
    
    isLoading.set(true);
    error.set(null);
    
    try {
      const supabase = getSupabaseClient();
      
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      
      if (profileError) {
        error.set(profileError.message);
        return;
      }
      
      profile.set(data);
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      isLoading.set(false);
    }
  }

  // Update user profile
  async function updateProfile(profileData: Partial<Profile>) {
    const currentUser = get(user);
    if (!currentUser) {
      error.set('No user is logged in');
      return null;
    }
    
    isLoading.set(true);
    error.set(null);
    
    try {
      const supabase = getSupabaseClient();
      
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id)
        .select()
        .single();
      
      if (updateError) {
        error.set(updateError.message);
        return null;
      }
      
      profile.set(data);
      return data;
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      isLoading.set(false);
    }
  }

  // Sign out the user
  async function signOut() {
    isLoading.set(true);
    error.set(null);
    
    try {
      const supabase = getSupabaseClient();
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        error.set(signOutError.message);
        return false;
      }
      
      user.set(null);
      profile.set(null);
      isAuthenticated.set(false);
      return true;
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      isLoading.set(false);
    }
  }

  // Update user email
  async function updateEmail(newEmail: string) {
    isLoading.set(true);
    error.set(null);
    
    try {
      const supabase = getSupabaseClient();
      const { error: updateError } = await supabase.auth.updateUser({ email: newEmail });
      
      if (updateError) {
        error.set(updateError.message);
        return false;
      }
      
      return true;
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      isLoading.set(false);
    }
  }

  // Update user password
  async function updatePassword(newPassword: string) {
    isLoading.set(true);
    error.set(null);
    
    try {
      const supabase = getSupabaseClient();
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      
      if (updateError) {
        error.set(updateError.message);
        return false;
      }
      
      return true;
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      isLoading.set(false);
    }
  }

  // Listen for auth state changes
  function setupAuthListener() {
    const supabase = getSupabaseClient();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          user.set(session.user);
          isAuthenticated.set(true);
          await loadUserProfile();
        } else if (event === 'SIGNED_OUT') {
          user.set(null);
          profile.set(null);
          isAuthenticated.set(false);
        } else if (event === 'USER_UPDATED' && session?.user) {
          user.set(session.user);
          await loadUserProfile();
        }
      }
    );
    
    // Return the unsubscribe function
    return () => {
      subscription.unsubscribe();
    };
  }

  return {
    // State
    user,
    profile,
    isLoading,
    error,
    isAuthenticated,
    userFullName,
    hasCompletedOnboarding,
    
    // Actions
    initialize,
    loadUserProfile,
    updateProfile,
    signOut,
    updateEmail,
    updatePassword,
    setupAuthListener
  };
};

// Create and export the store instance
export const userStore = createUserStore();