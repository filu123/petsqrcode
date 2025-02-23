import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
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
      pet_veterinarian!pet_veterinarian_pet_id_fkey (
        country,
        address,
        email,
        phone_number,
        is_public
      ),
      pet_contacts!pet_contacts_pet_id_fkey (
        full_name,
        address,
        email,
        phone_number,
        is_primary,
        is_public
      ),
      pet_maintenance!pet_maintenance_pet_id_fkey (
        name,
        frequency,
        start_date,
        is_public
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