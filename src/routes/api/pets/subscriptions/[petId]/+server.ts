import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { subscriptionService } from '$lib/services/subscriptionService';
import { petService } from '$lib/services/petService';

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

  const petId = params.petId;
  
  try {
    // Verify the pet belongs to the user
    if (!await checkPetOwnership(locals, petId)) {
      return json({ error: 'Pet not found or access denied' }, { status: 404 });
    }
    
    const response = await subscriptionService.getPetSubscription(petId);
    
    if (response.error) {
      return json({ error: response.error }, { status: 400 });
    }
    
    return json(response.data);
  } catch (error) {
    console.error('Error fetching pet subscription:', error);
    return json({ error: 'Failed to fetch pet subscription' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ params, request, locals }) => {
  // Check if user is authenticated
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const petId = params.petId;
  
  try {
    // Verify the pet belongs to the user
    if (!await checkPetOwnership(locals, petId)) {
      return json({ error: 'Pet not found or access denied' }, { status: 404 });
    }
    
    const { planType } = await request.json() as { planType: string };
    
    if (!planType) {
      return json({ 
        error: 'Missing required fields',
        requiredFields: ['planType']
      }, { status: 400 });
    }
    
    // Validate plan type
    if (!['free', 'pro', 'ultra'].includes(planType)) {
      return json({ 
        error: 'Invalid plan type',
        validValues: ['free', 'pro', 'ultra']
      }, { status: 400 });
    }
    
    // For paid plans, you'd handle Stripe checkout here
    // For demo purposes, we'll just update the subscription directly
    
    const response = await subscriptionService.updatePetSubscription(petId, {
      plan_type: planType,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      cancel_at_period_end: false
    });
    
    if (response.error) {
      return json({ error: response.error }, { status: 400 });
    }
    
    return json(response.data, { status: 201 });
  } catch (error) {
    console.error('Error creating pet subscription:', error);
    return json({ error: 'Failed to create pet subscription' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  // Check if user is authenticated
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const petId = params.petId;
  
  try {
    // Verify the pet belongs to the user
    if (!await checkPetOwnership(locals, petId)) {
      return json({ error: 'Pet not found or access denied' }, { status: 404 });
    }
    
    const subscriptionData = await request.json();
    
    // Update the subscription
    const response = await subscriptionService.updatePetSubscription(petId, {
      ...subscriptionData,
    });
    
    if (response.error) {
      return json({ error: response.error }, { status: 400 });
    }
    
    return json(response.data);
  } catch (error) {
    console.error('Error updating pet subscription:', error);
    return json({ error: 'Failed to update pet subscription' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  // Check if user is authenticated
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const petId = params.petId;
  
  try {
    // Verify the pet belongs to the user
    if (!await checkPetOwnership(locals, petId)) {
      return json({ error: 'Pet not found or access denied' }, { status: 404 });
    }
    
    // Cancel the subscription (set to cancel at period end)
    const response = await subscriptionService.cancelSubscription(petId);
    
    if (response.error) {
      return json({ error: response.error }, { status: 400 });
    }
    
    return json(response.data);
  } catch (error) {
    console.error('Error canceling pet subscription:', error);
    return json({ error: 'Failed to cancel pet subscription' }, { status: 500 });
  }
};