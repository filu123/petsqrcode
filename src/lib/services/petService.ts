import { getSupabaseClient, formatResponse, type ApiResponse } from './api';
import type { Database } from '../../DatabaseDefinitions';

// Type definitions
type Pet = Database['public']['Tables']['pets']['Row'];
type PetInsert = Database['public']['Tables']['pets']['Insert'];
type PetUpdate = Database['public']['Tables']['pets']['Update'];

type PetWithRelations = Pet & {
  pet_contacts?: Database['public']['Tables']['pet_contacts']['Row'][];
  pet_maintenance?: Database['public']['Tables']['pet_maintenance']['Row'][];
  pet_veterinarian?: Database['public']['Tables']['pet_veterinarian']['Row'][];
};

// Pet service
export const petService = {
  /**
   * Get all pets for the current user
   */
  async getUserPets(): Promise<ApiResponse<Pet[]>> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('name');

      return formatResponse(data || [], error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Get a specific pet by ID with related data
   */
  async getPetById(id: string, includeRelations = false): Promise<ApiResponse<PetWithRelations>> {
    try {
      const supabase = getSupabaseClient();
      
      let query = supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single();
      
      if (includeRelations) {
        query = supabase
          .from('pets')
          .select(`
            *,
            pet_contacts(*),
            pet_maintenance(*),
            pet_veterinarian(*)
          `)
          .eq('id', id)
          .single();
      }
      
      const { data, error } = await query;
      return formatResponse(data, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Create a new pet
   */
  async createPet(pet: PetInsert): Promise<ApiResponse<Pet>> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('pets')
        .insert([{
          ...pet,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      return formatResponse(data, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Update an existing pet
   */
  async updatePet(id: string, pet: PetUpdate): Promise<ApiResponse<Pet>> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('pets')
        .update({
          ...pet,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      return formatResponse(data, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Delete a pet
   */
  async deletePet(id: string): Promise<ApiResponse<void>> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', id);

      return formatResponse(undefined, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Upload a pet avatar
   */
  async uploadPetAvatar(petId: string, file: File): Promise<ApiResponse<string>> {
    try {
      const supabase = getSupabaseClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${petId}-${Date.now()}.${fileExt}`;
      const filePath = `pet-avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pet-avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('pet-avatars')
        .getPublicUrl(filePath);

      // Update the pet with the new avatar URL
      await this.updatePet(petId, { avatar_url: publicUrl });

      return formatResponse(publicUrl);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  // Pet Contacts Management
  async getPetContacts(petId: string): Promise<ApiResponse<Database['public']['Tables']['pet_contacts']['Row'][]>> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('pet_contacts')
        .select('*')
        .eq('pet_id', petId)
        .order('is_primary', { ascending: false });

      return formatResponse(data || [], error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  async addPetContact(contact: Database['public']['Tables']['pet_contacts']['Insert']): Promise<ApiResponse<Database['public']['Tables']['pet_contacts']['Row']>> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('pet_contacts')
        .insert([{
          ...contact,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      return formatResponse(data, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  async updatePetContact(
    id: string, 
    contact: Database['public']['Tables']['pet_contacts']['Update']
  ): Promise<ApiResponse<Database['public']['Tables']['pet_contacts']['Row']>> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('pet_contacts')
        .update({
          ...contact,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      return formatResponse(data, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  async deletePetContact(id: string): Promise<ApiResponse<void>> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('pet_contacts')
        .delete()
        .eq('id', id);

      return formatResponse(undefined, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  }
};