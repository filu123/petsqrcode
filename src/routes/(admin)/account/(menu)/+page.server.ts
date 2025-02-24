import { redirect } from "@sveltejs/kit"

import type { PageServerLoad } from './$types';
import { calculateNextDueDate } from '$lib/utils/maintenance';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
  const { pets } = await parent();
  const selectedPet = pets?.[0];

  if (!selectedPet) {
    return {
      maintenanceItems: []
    };
  }
  
  const { data: maintenanceItems } = await supabase
    .from('pet_maintenance')
    .select('*')
    .eq('pet_id', selectedPet.id);

  // Calculate next due dates and sort by closest due date
  const processedItems = maintenanceItems?.map(item => {
    const dueDate = calculateNextDueDate(item.start_date, item.frequency);
    return {
      ...item,
      due_date: dueDate.toISOString()
    };
  }).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()) || [];

  return {
    maintenanceItems: processedItems
  };
};

export const actions = {
  signout: async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (session) {
      await supabase.auth.signOut()
      redirect(303, "/")
    }
  },
  markComplete: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const maintenanceId = formData.get('maintenanceId') as string;

    const { data: maintenance } = await supabase
      .from('pet_maintenance')
      .select('frequency, start_date')
      .eq('id', maintenanceId)
      .single();

    if (maintenance) {
      const newStartDate = new Date().toISOString();
      await supabase
        .from('pet_maintenance')
        .update({ start_date: newStartDate })
        .eq('id', maintenanceId);
    }

    return { success: true };
  }
};