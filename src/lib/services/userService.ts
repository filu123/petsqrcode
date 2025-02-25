// src/lib/services/userService.ts
import { getSupabaseClient, formatResponse, type ApiResponse } from './api';
import type { Database } from '../../DatabaseDefinitions';
import type { User } from '@supabase/supabase-js';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const userService = {
  /**
   * Get the profile for the current user
   */
  async getCurrentUserProfile(): Promise<ApiResponse<Profile>> {
    try {
      const supabase = getSupabaseClient();
      
      // First get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return formatResponse(undefined, userError || new Error('No authenticated user found'));
      }
      
      return this.getUserProfile(user.id);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Get a user's profile by user ID
   */
  async getUserProfile(userId: string): Promise<ApiResponse<Profile>> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      return formatResponse(data, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Update a user's profile
   */
  async updateUserProfile(userId: string, profile: ProfileUpdate): Promise<ApiResponse<Profile>> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      return formatResponse(data, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Toggle email subscription status
   */
  async toggleEmailSubscription(userId: string): Promise<ApiResponse<{ unsubscribed: boolean }>> {
    try {
      const supabase = getSupabaseClient();
      
      // Get current subscription status
      const { data: currentProfile, error: getError } = await supabase
        .from('profiles')
        .select('unsubscribed')
        .eq('id', userId)
        .single();
      
      if (getError) {
        return formatResponse(undefined, getError);
      }
      
      const newStatus = !currentProfile?.unsubscribed;
      
      // Update subscription status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          unsubscribed: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (updateError) {
        return formatResponse(undefined, updateError);
      }
      
      return formatResponse({ unsubscribed: newStatus });
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Update user email
   */
  async updateEmail(newEmail: string): Promise<ApiResponse<void>> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      
      if (error) {
        return formatResponse(undefined, error);
      }
      
      // Note: Email isn't actually changed until the user confirms via email link
      return formatResponse(undefined);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<ApiResponse<void>> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        return formatResponse(undefined, error);
      }
      
      return formatResponse(undefined);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Verify current password is correct
   */
  async verifyPassword(email: string, password: string): Promise<ApiResponse<boolean>> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return formatResponse(false, error);
      }
      
      return formatResponse(true);
    } catch (error) {
      return formatResponse(false, error);
    }
  },

  /**
   * Get user account completion status
   */
  async getUserAccountStatus(userId: string): Promise<ApiResponse<{
    isComplete: boolean;
    missingFields: string[];
  }>> {
    try {
      const { data: profile, error } = await this.getUserProfile(userId);
      
      if (error) {
        return formatResponse(undefined, error);
      }
      
      if (!profile) {
        return formatResponse({
          isComplete: false,
          missingFields: ['profile']
        });
      }
      
      // Check for required fields
      const missingFields: string[] = [];
      
      if (!profile.first_name) missingFields.push('first_name');
      if (!profile.last_name) missingFields.push('last_name');
      if (!profile.mobile_phone) missingFields.push('mobile_phone');
      if (!profile.email) missingFields.push('email');
      if (!profile.country) missingFields.push('country');
      if (!profile.address) missingFields.push('address');
      
      // Check if profile has completed onboarding
      if (profile.has_completed_onboarding) {
        return formatResponse({
          isComplete: true,
          missingFields: []
        });
      }
      
      return formatResponse({
        isComplete: missingFields.length === 0,
        missingFields
      });
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Set user onboarding as complete
   */
  async completeUserOnboarding(userId: string): Promise<ApiResponse<void>> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('profiles')
        .update({ 
          has_completed_onboarding: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        return formatResponse(undefined, error);
      }
      
      return formatResponse(undefined);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Upload a profile avatar
   */
  async uploadUserAvatar(userId: string, file: File): Promise<ApiResponse<string>> {
    try {
      const supabase = getSupabaseClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update the user profile with the new avatar URL
      await this.updateUserProfile(userId, { avatar_url: publicUrl });

      return formatResponse(publicUrl);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Get account deletion reasons (for analytics)
   */
  async recordAccountDeletion(userId: string, reason: string): Promise<ApiResponse<void>> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('account_deletions')
        .insert([{
          user_id: userId,
          reason,
          deleted_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }]);
      
      if (error) {
        return formatResponse(undefined, error);
      }
      
      return formatResponse(undefined);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<ApiResponse<void>> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return formatResponse(undefined, error);
      }
      
      return formatResponse(undefined);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Check if user has any pets
   */
  async checkUserHasPets(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('pets')
        .select('id')
        .eq('profile_id', userId)
        .limit(1);
      
      if (error) {
        return formatResponse(undefined, error);
      }
      
      return formatResponse(data && data.length > 0);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Get analytics data about the user's account
   */
  async getUserAnalytics(userId: string): Promise<ApiResponse<{
    petCount: number;
    linkedQrCodesCount: number;
    accountCreatedAt: string | null;
    lastLogin: string | null;
  }>> {
    try {
      const supabase = getSupabaseClient();
      
      // Get pet count
      const { data: pets, error: petsError } = await supabase
        .from('pets')
        .select('id')
        .eq('profile_id', userId);
      
      if (petsError) {
        return formatResponse(undefined, petsError);
      }
      
      // Get linked QR codes count
      const { data: qrCodes, error: qrError } = await supabase
        .from('qr_codes')
        .select('id')
        .in('pet_id', pets?.map(pet => pet.id) || []);
      
      if (qrError) {
        return formatResponse(undefined, qrError);
      }
      
      // Get user auth data
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        return formatResponse(undefined, userError);
      }
      
      return formatResponse({
        petCount: pets?.length || 0,
        linkedQrCodesCount: qrCodes?.length || 0,
        accountCreatedAt: user?.created_at || null,
        lastLogin: user?.last_sign_in_at || null
      });
    } catch (error) {
      return formatResponse(undefined, error);
    }
  }
};