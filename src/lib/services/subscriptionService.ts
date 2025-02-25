import { getSupabaseClient, formatResponse, type ApiResponse } from './api';
import type { Database } from '../../DatabaseDefinitions';

// Subscription plan types
export type PlanType = 'free' | 'pro' | 'ultra';

// This would be your subscription table structure
interface PetSubscription {
  id: string;
  pet_id: string;
  plan_type: PlanType;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export const subscriptionService = {
  /**
   * Get a subscription for a specific pet
   */
  async getPetSubscription(petId: string): Promise<ApiResponse<PetSubscription>> {
    try {
      const supabase = getSupabaseClient();
      
      // This assumes you have a pet_subscriptions table
      // You'll need to create this table in your Supabase database
      const { data, error } = await supabase
        .from('pet_subscriptions')
        .select('*')
        .eq('pet_id', petId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return formatResponse(data, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Get all subscriptions for the current user's pets
   */
  async getUserPetSubscriptions(): Promise<ApiResponse<{pet: Database['public']['Tables']['pets']['Row'], subscription: PetSubscription}[]>> {
    try {
      const supabase = getSupabaseClient();
      
      // First get the user's profile ID
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }
      
      // Then get all the user's pets with their subscriptions
      const { data, error } = await supabase
        .from('pets')
        .select(`
          *,
          pet_subscriptions:pet_subscriptions(*)
        `)
        .eq('profile_id', userData.user.id);
      
      if (error) {
        throw error;
      }
      
      // Format the response to be more usable
      const formattedData = data.map(pet => {
        return {
          pet: {
            id: pet.id,
            name: pet.name,
            second_name: pet.second_name,
            avatar_url: pet.avatar_url,
            profile_id: pet.profile_id
          },
          subscription: pet.pet_subscriptions && pet.pet_subscriptions.length > 0 
            ? pet.pet_subscriptions[0] 
            : null
        };
      });
      
      return formatResponse(formattedData);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Create or update a subscription for a pet
   */
  async updatePetSubscription(
    petId: string, 
    subscriptionData: Partial<PetSubscription>
  ): Promise<ApiResponse<PetSubscription>> {
    try {
      const supabase = getSupabaseClient();
      
      // Check if subscription exists
      const { data: existingData } = await supabase
        .from('pet_subscriptions')
        .select('id')
        .eq('pet_id', petId)
        .limit(1)
        .single();
      
      let data, error;
      
      if (existingData) {
        // Update existing subscription
        ({ data, error } = await supabase
          .from('pet_subscriptions')
          .update({
            ...subscriptionData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id)
          .select()
          .single());
      } else {
        // Create new subscription
        ({ data, error } = await supabase
          .from('pet_subscriptions')
          .insert([{
            pet_id: petId,
            plan_type: 'free', // Default to free plan
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            cancel_at_period_end: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...subscriptionData
          }])
          .select()
          .single());
      }

      return formatResponse(data, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Cancel a subscription at the end of the billing period
   */
  async cancelSubscription(petId: string): Promise<ApiResponse<PetSubscription>> {
    try {
      const supabase = getSupabaseClient();
      
      const { data, error } = await supabase
        .from('pet_subscriptions')
        .update({
          cancel_at_period_end: true,
          updated_at: new Date().toISOString()
        })
        .eq('pet_id', petId)
        .select()
        .single();

      return formatResponse(data, error);
    } catch (error) {
      return formatResponse(undefined, error);
    }
  },

  /**
   * Get available subscription plans
   */
  async getSubscriptionPlans(): Promise<ApiResponse<{id: string, name: string, price: number, features: string[]}[]>> {
    // This could fetch from API or use static data
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: [
          'Basic pet profile',
          'Single contact',
          'Public pet page'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 4.99,
        features: [
          'Advanced pet profile',
          'Multiple contacts',
          'Maintenance reminders',
          'Veterinarian details',
          'QR code integration'
        ]
      },
      {
        id: 'ultra',
        name: 'Ultra',
        price: 9.99,
        features: [
          'All Pro features',
          'Premium pet page design',
          'Lost pet alerts',
          'Medical record storage',
          'Multiple pet discount',
          'Priority support'
        ]
      }
    ];
    
    return formatResponse(plans);
  }
};