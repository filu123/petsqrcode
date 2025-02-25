import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, depends }) => {
  depends("dashboard:pets");
  
  const { user, supabase } = locals;
  
  if (!user) {
    return {
      pets: []
    };
  }
  
  // Fetch user's pets
  const { data: pets } = await supabase
    .from('pets')
    .select('*')
    .eq('profile_id', user.id);
  
  // Fetch maintenance for user's pets
  let maintenance = [];
  if (pets && pets.length > 0) {
    const petIds = pets.map(pet => pet.id);
    const { data: maintenanceData } = await supabase
      .from('pet_maintenance')
      .select('*')
      .in('pet_id', petIds);
      
    maintenance = maintenanceData || [];
  }
  
  return {
    pets: pets || [],
    maintenance
  };
};