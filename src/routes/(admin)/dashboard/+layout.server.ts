// src/routes/dashboard/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
  const { user, session, supabase } = locals;
  
  // Double-check authentication
  if (!session || !user) {
    redirect(303, '/login');
  }
  
  // Preload pets for faster initial render 
  const { data: pets } = await supabase
    .from('pets')
    .select('*')
    .eq('profile_id', user.id);
    
  // Preload profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return {
    // These will be available in data props before client-side stores initialize
    initialPets: pets || [],
    initialProfile: profile || null
  };
};