import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { petService } from '$lib/services/petService';
import type { Database } from '../../../../DatabaseDefinitions';

type PetUpdate = Database['public']['Tables']['pets']['Update'];

// Helper to check if user owns the pet
async function checkPetOwnership(locals: App.Locals, petId: string): Promise<boolean> {
  const { user } = await locals.safeGetSession();
  if (!user) return false;
  
  const { data: pet } = await petService.getPetById(petId);
  return pet?.profile_id === user.id;
}

export const GET: RequestHandler = async ({ params, url, locals }) => {
  // Check if user is authenticated
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const petId = params.id;
  const includeRelations = url.searchParams.get('includeRelations') === 'true';
  
  try {
    // Verify the pet belongs to the user
    if (!await checkPetOwnership(locals, petId)) {
      return json({ error: 'Pet not found or access denied' }, { status: 404 });
    }
    
    const response = await petService.getPetById(petId, includeRelations);
    
    if (response.error) {
      return json({ error: response.error }, { status: 400 });
    }
    
    return json(response.data);
  } catch (error) {
    console.error('Error fetching pet:', error);
    return json({ error: 'Failed to fetch pet' }, { status: 500 });
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
    
    const petData = await request.json() as PetUpdate;
    const response = await petService.updatePet(petId, petData);
    
    if (response.error) {
      return json({ error: response.error }, { status: 400 });
    }
    
    return json(response.data);
  } catch (error) {
    console.error('Error updating pet:', error);
    return json({ error: 'Failed to update pet' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
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
    
    const response = await petService.deletePet(petId);
    
    if (response.error) {
      return json({ error: response.error }, { status: 400 });
    }
    
    return json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting pet:', error);
    return json({ error: 'Failed to delete pet' }, { status: 500 });
  }
};