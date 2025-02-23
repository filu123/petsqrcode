import { error } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals: { supabase }, params }) => {
  if (!params.id) {
    return { pet: null }
  }

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
      ),
      pet_veterinarian!pet_id (*),
      pet_contacts!pet_id (*),
      pet_maintenance!pet_id (*)
    `)
    .eq("id", params.id)
    .single()

  if (petError) {
    console.error("Error fetching pet:", petError)
    throw error(404, "Pet not found")
  }

  return {
    pet: {
      ...pet,
      pet_veterinarian: pet.pet_veterinarian || [],
      pet_contacts: pet.pet_contacts || [],
      pet_maintenance: pet.pet_maintenance || []
    }
  }
}