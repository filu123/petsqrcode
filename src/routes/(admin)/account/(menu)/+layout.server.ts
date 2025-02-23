import { redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw redirect(303, "/login")
  }

  // Get pets for the current user
  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("profile_id", session.user.id)

  return {
    pets: pets || []
  }
}