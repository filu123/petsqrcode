import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { petService } from '$lib/services/petService';
import { getSupabaseClient } from '$lib/services/api';
import type { Database } from '../../../../../DatabaseDefinitions';

type PetContact = Database['public']['Tables']['pet_contacts']['Row'];
type PetContactInsert = Database['public']['Tables']['pet_contacts']['Insert'];
type PetContactUpdate = Database['public']['Tables']['pet_contacts']['Update'];

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
      .from('pet_contacts')
      .select('*')
      .eq('pet_id', petId)
      .order('is_primary', { ascending: false });
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    return json(data);
  } catch (error) {
    console.error('Error fetching pet contacts:', error);
    return json({ error: 'Failed to fetch pet contacts' }, { status: 500 });
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
    
    const contactData = await request.json() as PetContactInsert;
    
    // Validate required fields
    if (!contactData.full_name || !contactData.address || !contactData.email || !contactData.phone_number) {
      return json({ 
        error: 'Missing required fields',
        requiredFields: ['full_name', 'address', 'email', 'phone_number']
      }, { status: 400 });
    }
    
    // Set pet_id to the current pet
    contactData.pet_id = petId;
    
    const supabase = getSupabaseClient();
    
    // If this is a primary contact, update any existing primary contacts to non-primary
    if (contactData.is_primary) {
      await supabase
        .from('pet_contacts')
        .update({ is_primary: false })
        .eq('pet_id', petId)
        .eq('is_primary', true);
    }
    
    const { data, error } = await supabase
      .from('pet_contacts')
      .insert([{
        ...contactData,
        is_primary: contactData.is_primary ?? false,
        is_public: contactData.is_public ?? true,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    return json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating pet contact:', error);
    return json({ error: 'Failed to create pet contact' }, { status: 500 });
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
    
    const { contactId, ...contactData } = await request.json() as PetContactUpdate & { contactId: string };
    
    if (!contactId) {
      return json({ error: 'Contact ID is required' }, { status: 400 });
    }
    
    const supabase = getSupabaseClient();
    
    // If this is being set as primary, update any existing primary contacts to non-primary
    if (contactData.is_primary) {
      await supabase
        .from('pet_contacts')
        .update({ is_primary: false })
        .eq('pet_id', petId)
        .eq('is_primary', true)
        .neq('id', contactId);
    }
    
    const { data, error } = await supabase
      .from('pet_contacts')
      .update({
        ...contactData,
        updated_at: new Date().toISOString()
      })
      .eq('id', contactId)
      .eq('pet_id', petId) // Ensure we're only updating contacts for this pet
      .select()
      .single();
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    return json(data);
  } catch (error) {
    console.error('Error updating pet contact:', error);
    return json({ error: 'Failed to update pet contact' }, { status: 500 });
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
    
    const { contactId } = await request.json() as { contactId: string };
    
    if (!contactId) {
      return json({ error: 'Contact ID is required' }, { status: 400 });
    }
    
    // Check if this is the last contact - might want to prevent deletion
    const supabase = getSupabaseClient();
    const { data: contacts } = await supabase
      .from('pet_contacts')
      .select('id')
      .eq('pet_id', petId);
    
    if (contacts && contacts.length === 1 && contacts[0].id === contactId) {
      return json({ 
        error: 'Cannot delete the only contact for this pet',
        message: 'Each pet must have at least one contact'
      }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('pet_contacts')
      .delete()
      .eq('id', contactId)
      .eq('pet_id', petId); // Ensure we're only deleting contacts for this pet
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    // If the deleted contact was primary, make another contact primary
    const { data: primaryContact } = await supabase
      .from('pet_contacts')
      .select('id')
      .eq('pet_id', petId)
      .eq('is_primary', true)
      .single();
      
    if (!primaryContact) {
      // No primary contact, set the first available contact as primary
      const { data: firstContact } = await supabase
        .from('pet_contacts')
        .select('id')
        .eq('pet_id', petId)
        .limit(1)
        .single();
        
      if (firstContact) {
        await supabase
          .from('pet_contacts')
          .update({ is_primary: true })
          .eq('id', firstContact.id);
      }
    }
    
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting pet contact:', error);
    return json({ error: 'Failed to delete pet contact' }, { status: 500 });
  }
};