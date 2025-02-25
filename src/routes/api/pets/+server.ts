import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { petService } from '$lib/services/petService';
import type { Database } from '../../../DatabaseDefinitions';

type PetInsert = Database['public']['Tables']['pets']['Insert'];

export const GET: RequestHandler = async ({ locals, url }) => {
  // Check if user is authenticated
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await petService.getUserPets();
    
    if (response.error) {
      return json({ error: response.error }, { status: 400 });
    }
    
    return json(response.data);
  } catch (error) {
    console.error('Error fetching pets:', error);
    return json({ error: 'Failed to fetch pets' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  // Check if user is authenticated
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const petData = await request.json() as PetInsert;
    
    // Validate required fields
    if (!petData.name || !petData.date_of_birth || !petData.gender || !petData.pet_type || !petData.breed) {
      return json({ 
        error: 'Missing required fields',
        requiredFields: ['name', 'date_of_birth', 'gender', 'pet_type', 'breed']
      }, { status: 400 });
    }
    
    // Set profile_id to current user's ID
    petData.profile_id = user.id;
    
    const response = await petService.createPet(petData);
    
    if (response.error) {
      return json({ error: response.error }, { status: 400 });
    }
    
    return json(response.data, { status: 201 });
  } catch (error) {
    console.error('Error creating pet:', error);
    return json({ error: 'Failed to create pet' }, { status: 500 });
  }
};