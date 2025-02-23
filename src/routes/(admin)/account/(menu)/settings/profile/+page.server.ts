import { error, fail, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
  const { session } = await safeGetSession()
  if (!session) {
    redirect(303, "/login")
  }

  return {
    user: session.user
  }
}

export const actions = {
  deleteAccount: async ({ request, locals: { supabase, supabaseServiceRole, safeGetSession } }) => {
    const { session, user } = await safeGetSession()
    if (!session || !user?.id) {
      redirect(303, "/login")
    }

    const formData = await request.formData()
    const currentPassword = formData.get("currentPassword") as string
    const reason = formData.get("reason") as string

    if (!currentPassword) {
      return fail(400, { error: "Password is required" })
    }

    if (!reason) {
      return fail(400, { error: "Please select a reason" })
    }

    // Verify password
    const { error: pwError } = await supabase.auth.signInWithPassword({
      email: user.email || "",
      password: currentPassword
    })

    if (pwError) {
      return fail(400, { error: "Invalid password" })
    }

    // Log the deletion reason first
    await supabase.from("account_deletions").insert({
      user_id: user.id,
      reason: reason,
      deleted_at: new Date()
    })

    try {
      // First get all user's pets
      const { data: userPets } = await supabase
        .from("pets")
        .select("id")
        .eq("profile_id", user.id);

      if (userPets && userPets.length > 0) {
        const petIds = userPets.map(pet => pet.id);
        
        // Delete pet-related data first
        await supabase.from("pet_maintenance").delete().in("pet_id", petIds);
        await supabase.from("pet_veterinarian").delete().in("pet_id", petIds);
        await supabase.from("pet_contacts").delete().in("pet_id", petIds);
        
        // Then delete pets
        await supabase.from("pets").delete().eq("profile_id", user.id);
      }

      // Delete stripe customer data
      await supabase.from("stripe_customers").delete().eq("user_id", user.id);
      
      // Delete profile
      await supabase.from("profiles").delete().eq("id", user.id);

      // Finally delete the user from auth
      const { error: deleteError } = await supabaseServiceRole.auth.admin.deleteUser(
        user.id,
        true // This flag ensures cascading delete
      );

      if (deleteError) {
        throw new Error("Failed to delete auth user");
      }

      // Sign out the user
      await supabase.auth.signOut()
      
      redirect(303, "/")
    } catch (error) {
      console.error("Error deleting account:", error)
      return fail(500, { error: "Failed to delete account. Please try again." })
    }
  }
} satisfies Actions