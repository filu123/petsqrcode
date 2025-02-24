import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals: { supabase }, params, parent }) => {
  const { pets } = await parent()
  
  // Verify pet exists and belongs to user
  const pet = pets.find(p => p.id === params.petId)
  if (!pet) {
    throw error(404, "Pet not found")
  }

  // Get pet's maintenance items
  const { data: maintenanceItems } = await supabase
    .from("pet_maintenance")
    .select("*")
    .eq("pet_id", params.petId)

  // Get other pet-specific data you need for the dashboard
  // ... 

  return {
    pet,
    maintenanceItems: maintenanceItems || []
  }
}