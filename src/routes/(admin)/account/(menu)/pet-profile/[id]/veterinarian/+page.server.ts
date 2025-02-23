import { error } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
  const { data: veterinarian, error: vetError } = await supabase
    .from("pet_veterinarian")
    .select("*")
    .eq("pet_id", params.id)
    .single()

  if (vetError && vetError.code !== 'PGRST116') { // PGRST116 is "not found" error
    throw error(500, "Failed to load veterinarian details")
  }

  return {
    veterinarian: veterinarian || null
  }
}

export const actions = {
  upsertVeterinarian: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    
    const veterinarianData = {
      pet_id: params.id,
      country: formData.get('country')?.toString(),
      address: formData.get('address')?.toString(),
      email: formData.get('email')?.toString(),
      phone_number: formData.get('phone_number')?.toString(),
      is_public: formData.get('is_public') === 'on',
    }

    // Check if veterinarian exists
    const { data: existing } = await supabase
      .from("pet_veterinarian")
      .select("id")
      .eq("pet_id", params.id)
      .single()

    let result
    if (existing) {
      // Update
      result = await supabase
        .from("pet_veterinarian")
        .update(veterinarianData)
        .eq("id", existing.id)
        .select()
        .single()
    } else {
      // Insert
      result = await supabase
        .from("pet_veterinarian")
        .insert(veterinarianData)
        .select()
        .single()
    }

    if (result.error) {
      return { success: false, error: result.error.message }
    }

    return {
      success: true,
      veterinarian: result.data
    }
  }
} satisfies Actions