import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { petService } from '$lib/services/petService';
import { getSupabaseClient } from '$lib/services/api';
import type { Database } from '../../../../../DatabaseDefinitions';

type PetVeterinarian = Database['public']['Tables']['pet_veterinarian']['Row'];
type PetVeterinarianInsert = Database['public']['Tables']['pet_veterinarian']['Insert'];
type PetVeterinarianUpdate = Database['public']['Tables']['pet_veterinarian']['Update'];

// Helper to check if user owns the pet
async function checkPetOwnership(locals: App.Locals, petId: string): Promise<boolean> {
  const { user } = await locals.safeGetSession();
  if (!user) return false;
  
  const { data: pet } = await petService.getPetById(petId);
  return pet?.profile_id === user.id;
}

export const GET: RequestHandler = async ({ params, locals }) => {
  // Check if user is authenticated
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const petId = params.id;
  
  try {
    // Verify the pet belongs to the user
    if (!await checkPetOwnership(locals, petId)) {
      return json({ error: 'Pet not found or access denied' }, { status: 404 });
    }
    
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('pet_veterinarian')
      .select('*')
      .eq('pet_id', petId);
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    return json(data);
  } catch (error) {
    console.error('Error fetching pet veterinarian:', error);
    return json({ error: 'Failed to fetch pet veterinarian' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ params, request, locals }) => {
  // Check if user is authenticated
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const petId = params.id;
  
  try {
    // Verify the pet belongs to the user
    if (!await checkPetOwnership(locals, petId)) {
      return json({ error: 'Pet not found or access denied' }, { status: 404 });
    }
    
    const vetData = await request.json() as PetVeterinarianInsert;
    
    // Validate required fields
    if (!vetData.country || !vetData.address || !vetData.email || !vetData.phone_number) {
      return json({ 
        error: 'Missing required fields',
        requiredFields: ['country', 'address', 'email', 'phone_number']
      }, { status: 400 });
    }
    
    // Set pet_id to the current pet
    vetData.pet_id = petId;
    
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('pet_veterinarian')
      .insert([{
        ...vetData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    return json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating pet veterinarian:', error);
    return json({ error: 'Failed to create pet veterinarian' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  // Check if user is authenticated
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const petId = params.id;
  
  try {
    // Verify the pet belongs to the user
    if (!await checkPetOwnership(locals, petId)) {
      return json({ error: 'Pet not found or access denied' }, { status: 404 });
    }
    
    const { vetId, ...vetData } = await request.json() as PetVeterinarianUpdate & { vetId: string };
    
    if (!vetId) {
      return json({ error: 'Veterinarian ID is required' }, { status: 400 });
    }
    
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('pet_veterinarian')
      .update({
        ...vetData,
        updated_at: new Date().toISOString()
      })
      .eq('id', vetId)
      .eq('pet_id', petId) // Ensure we're only updating vets for this pet
      .select()
      .single();
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    return json(data);
  } catch (error) {
    console.error('Error updating pet veterinarian:', error);
    return json({ error: 'Failed to update pet veterinarian' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params, request, locals }) => {
  // Check if user is authenticated
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const petId = params.id;
  
  try {
    // Verify the pet belongs to the user
    if (!await checkPetOwnership(locals, petId)) {
      return json({ error: 'Pet not found or access denied' }, { status: 404 });
    }
    
    const { vetId } = await request.json() as { vetId: string };
    
    if (!vetId) {
      return json({ error: 'Veterinarian ID is required' }, { status: 400 });
    }
    
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('pet_veterinarian')
      .delete()
      .eq('id', vetId)
      .eq('pet_id', petId); // Ensure we're only deleting vets for this pet
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting pet veterinarian:', error);
    return json({ error: 'Failed to delete pet veterinarian' }, { status: 500 });
  }
};