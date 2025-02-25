import { getSupabaseClient, formatResponse, type ApiResponse } from './api';
import type { Database } from '../../DatabaseDefinitions';

// This would be your QR code table structure
interface QRCode {
  id: string;
  code: string;
  pet_id?: string;
  is_active: boolean;
  created_at: string;
  linked_at?: string;
}

export const qrService = {
  /**
   * Look up a QR code by its unique code
   */
  async getQRByCode(code: string): Promise<ApiResponse<QRCode>> {
    try {
      const supabase = getSupabaseClient();
      
      // This assumes you have a qr_codes table
      // You'll need to create this table in your Supabase database
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('code', code)
        .single();

      return formatResponse(data, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Get all QR codes linked to a specific pet
   */
  async getQRCodesForPet(petId: string): Promise<ApiResponse<QRCode[]>> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('pet_id', petId);

      return formatResponse(data || [], error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Get all QR codes for the current user
   */
  async getUserQRCodes(): Promise<ApiResponse<QRCode[]>> {
    try {
      const supabase = getSupabaseClient();
      
      // First get the user's profile ID
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }
      
      // Then get all the user's pets
      const { data: pets, error: petsError } = await supabase
        .from('pets')
        .select('id')
        .eq('profile_id', userData.user.id);
      
      if (petsError) {
        throw petsError;
      }
      
      // If the user has no pets, return empty array
      if (!pets || pets.length === 0) {
        return formatResponse([]);
      }
      
      // Get all QR codes linked to any of the user's pets
      const petIds = pets.map(pet => pet.id);
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .in('pet_id', petIds);
      
      return formatResponse(data || [], error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Link a QR code to a pet
   */
  async linkQRCodeToPet(code: string, petId: string): Promise<ApiResponse<QRCode>> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('qr_codes')
        .update({
          pet_id: petId,
          linked_at: new Date().toISOString()
        })
        .eq('code', code)
        .select()
        .single();

      return formatResponse(data, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Unlink a QR code from a pet
   */
  async unlinkQRCode(code: string): Promise<ApiResponse<QRCode>> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('qr_codes')
        .update({
          pet_id: null,
          linked_at: null
        })
        .eq('code', code)
        .select()
        .single();

      return formatResponse(data, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Generate a QR code URL for a pet profile
   */
  async getPetQRCodeURL(petId: string): Promise<string> {
    // Get the base URL from environment or config
    const baseUrl = window.location.origin;
    return `${baseUrl}/p/${petId}`;
  },

  /**
   * Get a redirect URL for a QR code
   */
  getQRCodeRedirectURL(code: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/qr/${code}`;
  }
};