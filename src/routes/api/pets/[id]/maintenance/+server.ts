import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { petService } from '$lib/services/petService';
import { getSupabaseClient } from '$lib/services/api';
import type { Database } from '../../../../../DatabaseDefinitions';

type PetMaintenance = Database['public']['Tables']['pet_maintenance']['Row'];
type PetMaintenanceInsert = Database['public']['Tables']['pet_maintenance']['Insert'];
type PetMaintenanceUpdate = Database['public']['Tables']['pet_maintenance']['Update'];

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
      .from('pet_maintenance')
      .select('*')
      .eq('pet_id', petId)
      .order('start_date', { ascending: false });
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    return json(data);
  } catch (error) {
    console.error('Error fetching pet maintenance:', error);
    return json({ error: 'Failed to fetch pet maintenance' }, { status: 500 });
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
    
    const maintenanceData = await request.json() as PetMaintenanceInsert;
    
    // Validate required fields
    if (!maintenanceData.name || !maintenanceData.frequency || !maintenanceData.start_date) {
      return json({ 
        error: 'Missing required fields',
        requiredFields: ['name', 'frequency', 'start_date']
      }, { status: 400 });
    }
    
    // Validate frequency (optional, but good to ensure data consistency)
    const validFrequencies = ['daily', 'weekly', 'monthly', 'bimonthly', 'quarterly', 'biannually', 'annually'];
    if (!validFrequencies.includes(maintenanceData.frequency)) {
      return json({ 
        error: 'Invalid frequency value',
        validValues: validFrequencies
      }, { status: 400 });
    }
    
    // Set pet_id to the current pet
    maintenanceData.pet_id = petId;
    
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('pet_maintenance')
      .insert([{
        ...maintenanceData,
        is_public: maintenanceData.is_public ?? true, // Default to public
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    return json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating pet maintenance:', error);
    return json({ error: 'Failed to create pet maintenance' }, { status: 500 });
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
    
    const { maintenanceId, ...maintenanceData } = await request.json() as PetMaintenanceUpdate & { maintenanceId: string };
    
    if (!maintenanceId) {
      return json({ error: 'Maintenance ID is required' }, { status: 400 });
    }
    
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('pet_maintenance')
      .update({
        ...maintenanceData,
        updated_at: new Date().toISOString()
      })
      .eq('id', maintenanceId)
      .eq('pet_id', petId) // Ensure we're only updating maintenance for this pet
      .select()
      .single();
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    return json(data);
  } catch (error) {
    console.error('Error updating pet maintenance:', error);
    return json({ error: 'Failed to update pet maintenance' }, { status: 500 });
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
    
    const { maintenanceId } = await request.json() as { maintenanceId: string };
    
    if (!maintenanceId) {
      return json({ error: 'Maintenance ID is required' }, { status: 400 });
    }
    
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('pet_maintenance')
      .delete()
      .eq('id', maintenanceId)
      .eq('pet_id', petId); // Ensure we're only deleting maintenance for this pet
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting pet maintenance:', error);
    return json({ error: 'Failed to delete pet maintenance' }, { status: 500 });
  }
};