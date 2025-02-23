import { error } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: users, error: usersError } = await supabase
    .from("pet_users")
    .select("*")
    .order("role", { ascending: false })

  if (usersError) {
    throw error(500, "Failed to load users")
  }

  // Transform the data
  const transformedUsers = users.map(user => ({
    id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    initials: `${user.first_name[0]}${user.last_name[0]}`.toUpperCase(),
    role: user.role,
    email: user.email
  }))

  return {
    users: transformedUsers,
    inviteCount: users.filter(u => u.role !== 'Primary Owner').length,
    petName: "Poppy" // Replace with actual pet name from context
  }
}

export const actions = {
  inviteUser: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email')?.toString()

    if (!email) {
      return { success: false, error: "Email is required" }
    }

    // Add your invite logic here
    // ...

    return { success: true }
  },

  removeUser: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const userId = formData.get('userId')?.toString()

    if (!userId) {
      return { success: false, error: "User ID is required" }
    }

    // Add your remove user logic here
    // ...

    return { success: true }
  }
} satisfies Actions