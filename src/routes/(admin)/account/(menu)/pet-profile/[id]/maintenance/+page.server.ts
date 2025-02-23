import { error } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
  const { data: maintenance, error: maintenanceError } = await supabase
    .from("pet_maintenance")
    .select("*")
    .eq("pet_id", params.id)
    .order('created_at', { ascending: false })

  if (maintenanceError) {
    throw error(500, "Failed to load maintenance records")
  }

  return {
    maintenance: maintenance || []
  }
}

export const actions = {
  addMaintenance: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    
    const maintenanceData = {
      pet_id: params.id,
      name: formData.get('name')?.toString(),
      frequency: formData.get('frequency')?.toString(),
      start_date: formData.get('start_date')?.toString(),
      is_public: formData.get('is_public') === 'on',
    }

    const { error: insertError } = await supabase
      .from("pet_maintenance")
      .insert(maintenanceData)

    if (insertError) {
      return { success: false, error: insertError.message }
    }

    // Fetch updated maintenance records
    const { data: maintenance } = await supabase
      .from("pet_maintenance")
      .select("*")
      .eq("pet_id", params.id)
      .order('created_at', { ascending: false })

    return {
      success: true,
      maintenance
    }
  },

  deleteMaintenance: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    const maintenanceId = formData.get('maintenance_id')?.toString()

    if (!maintenanceId) {
      return { success: false, error: "Maintenance ID is required" }
    }

    const { error: deleteError } = await supabase
      .from("pet_maintenance")
      .delete()
      .eq("id", maintenanceId)
      .eq("pet_id", params.id)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    // Fetch updated maintenance records
    const { data: maintenance } = await supabase
      .from("pet_maintenance")
      .select("*")
      .eq("pet_id", params.id)
      .order('created_at', { ascending: false })

    return {
      success: true,
      maintenance
    }
  },

  updateVisibility: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    const hideDetails = formData.get('hideDetails') === 'true'

    // First, update all maintenance records for this pet
    const { error: updateError } = await supabase
      .from("pet_maintenance")
      .update({ is_public: !hideDetails })
      .eq("pet_id", params.id)

    if (updateError) {
      console.error('Error updating visibility:', updateError)
      return { success: false, error: updateError.message }
    }

    // Then fetch the updated records
    const { data: maintenance, error: fetchError } = await supabase
      .from("pet_maintenance")
      .select("*")
      .eq("pet_id", params.id)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching updated maintenance:', fetchError)
      return { success: false, error: fetchError.message }
    }

    return {
      success: true,
      maintenance
    }
  }

} satisfies Actions