import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { subscriptionService } from '$lib/services/subscriptionService';
import { petService } from '$lib/services/petService';
import { getSupabaseClient } from '$lib/services/api';
import type { Database } from '../../../DatabaseDefinitions';

// Helper to check if user owns the pet
async function checkPetOwnership(locals: App.Locals, petId: string): Promise<boolean> {
  const { user } = await locals.safeGetSession();
  if (!user) return false;
  
  const { data: pet } = await petService.getPetById(petId);
  return pet?.profile_id === user.id;
}

export const GET: RequestHandler = async ({ locals, url }) => {
  // Check if user is authenticated
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if we're getting a specific pet's subscription
  const petId = url.searchParams.get('petId');
  
  try {
    if (petId) {
      // Verify the pet belongs to the user
      if (!await checkPetOwnership(locals, petId)) {
        return json({ error: 'Pet not found or access denied' }, { status: 404 });
      }
      
      const response = await subscriptionService.getPetSubscription(petId);
      
      if (response.error) {
        return json({ error: response.error }, { status: 400 });
      }
      
      return json(response.data);
    } else {
      // Get all subscriptions for user's pets
      const response = await subscriptionService.getUserPetSubscriptions();
      
      if (response.error) {
        return json({ error: response.error }, { status: 400 });
      }
      
      return json(response.data);
    }
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  // Check if user is authenticated
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { petId, planType } = await request.json() as { petId: string, planType: string };
    
    if (!petId || !planType) {
      return json({ 
        error: 'Missing required fields',
        requiredFields: ['petId', 'planType']
      }, { status: 400 });
    }
    
    // Verify the pet belongs to the user
    if (!await checkPetOwnership(locals, petId)) {
      return json({ error: 'Pet not found or access denied' }, { status: 404 });
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
    console.error('Error creating subscription:', error);
    return json({ error: 'Failed to create subscription' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request, locals }) => {
  // Check if user is authenticated
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { subscriptionId, ...subscriptionData } = await request.json() as { 
      subscriptionId: string,
      [key: string]: any
    };
    
    if (!subscriptionId) {
      return json({ error: 'Subscription ID is required' }, { status: 400 });
    }
    
    // Verify the subscription belongs to one of the user's pets
    const supabase = getSupabaseClient();
    const { data: subscription } = await supabase
      .from('pet_subscriptions')
      .select('pet_id')
      .eq('id', subscriptionId)
      .single();
      
    if (!subscription) {
      return json({ error: 'Subscription not found' }, { status: 404 });
    }
    
    if (!await checkPetOwnership(locals, subscription.pet_id)) {
      return json({ error: 'Subscription not found or access denied' }, { status: 404 });
    }
    
    // Update the subscription (in a real app, you'd sync with Stripe)
    const { data, error } = await supabase
      .from('pet_subscriptions')
      .update({
        ...subscriptionData,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .select()
      .single();
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    return json(data);
  } catch (error) {
    console.error('Error updating subscription:', error);
    return json({ error: 'Failed to update subscription' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
  // Check if user is authenticated
  const { user } = await locals.safeGetSession();
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscriptionId = url.searchParams.get('id');
  
  if (!subscriptionId) {
    return json({ error: 'Subscription ID is required' }, { status: 400 });
  }
  
  try {
    // Verify the subscription belongs to one of the user's pets
    const supabase = getSupabaseClient();
    const { data: subscription } = await supabase
      .from('pet_subscriptions')
      .select('pet_id')
      .eq('id', subscriptionId)
      .single();
      
    if (!subscription) {
      return json({ error: 'Subscription not found' }, { status: 404 });
    }
    
    if (!await checkPetOwnership(locals, subscription.pet_id)) {
      return json({ error: 'Subscription not found or access denied' }, { status: 404 });
    }
    
    // In a real app, you'd cancel the subscription in Stripe first
    // Here we're just setting it to cancel at period end
    const response = await subscriptionService.cancelSubscription(subscription.pet_id);
    
    if (response.error) {
      return json({ error: response.error }, { status: 400 });
    }
    
    return json(response.data);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
};