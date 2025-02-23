import { error } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
  const { data: pet, error: petError } = await supabase
    .from("pets")
    .select(`
      *,
      profiles: profiles (
        first_name,
        last_name,
        mobile_phone,
        email,
        country,
        address
      )
    `)
    .eq("id", params.id)
    .single()

  if (petError || !pet) {
    throw error(404, "Pet not found")
  }

  return {
    pet
  }
}

export const actions = {
  updatePet: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const id = formData.get('id')?.toString()
    
    if (!id) {
      return { success: false, error: "Pet ID is required" }
    }

    // Filter out empty values and undefined
    const petData = Object.fromEntries(
      Object.entries({
        name: formData.get('name')?.toString(),
        second_name: formData.get('second_name')?.toString(),
        bio: formData.get('bio')?.toString(),
        date_of_birth: formData.get('date_of_birth')?.toString(),
        gender: formData.get('gender')?.toString(),
        pet_type: formData.get('type')?.toString(), // Changed from type to pet_type
        breed: formData.get('breed')?.toString(),
        temperament: formData.get('temperament')?.toString(),
        allergies: formData.get('allergies')?.toString(),
        food: formData.get('food')?.toString(),
        favourite_treats: formData.get('favourite_treats')?.toString(),
      }).filter(([_, value]) => value !== undefined && value !== '')
    )

    const { data: updatedPet, error: updateError } = await supabase
      .from("pets")
      .update(petData)
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return {
      success: true,
      pet: updatedPet
    }
  }
} satisfies Actions