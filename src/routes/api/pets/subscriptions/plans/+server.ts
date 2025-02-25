import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { subscriptionService } from '$lib/services/subscriptionService';

export const GET: RequestHandler = async () => {
  try {
    const response = await subscriptionService.getSubscriptionPlans();
    
    if (response.error) {
      return json({ error: response.error }, { status: 400 });
    }
    
    return json(response.data);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return json({ error: 'Failed to fetch subscription plans' }, { status: 500 });
  }
};