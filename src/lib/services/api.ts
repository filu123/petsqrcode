import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../DatabaseDefinitions';

// Create a singleton Supabase client
let supabaseInstance: SupabaseClient<Database> | null = null;

/**
 * Get the Supabase client instance
 */
export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(
      PUBLIC_SUPABASE_URL,
      PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return supabaseInstance;
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (error: any): { message: string; details?: any } => {
  console.error('API Error:', error);
  
  // Format the error message for the client
  if (error.message) {
    return {
      message: error.message,
      details: error.details || error
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    details: error
  };
};

/**
 * Generic type for API responses
 */
export type ApiResponse<T> = {
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
};

/**
 * Standardize response format
 */
export const formatResponse = <T>(data?: T, error?: any): ApiResponse<T> => {
  if (error) {
    return { error: handleApiError(error) };
  }
  return { data };
};