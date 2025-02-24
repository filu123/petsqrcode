import { fail, redirect } from "@sveltejs/kit"
import { sendAdminEmail, sendUserEmail } from "$lib/mailer"
import { WebsiteBaseUrl } from "../../../../config"
import { createClient } from '@supabase/supabase-js'

 // Get pets for the current user
 

export const petActions = {

  addPet: async ({ request, locals: { supabase, safeGetSession } }) => {

    const { session, user } = await safeGetSession()

    if (!safeGetSession) {
      throw redirect(303, "/login")
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const second_name = formData.get("second_name") as string
    const date_of_birth = formData.get("date_of_birth") as string
    const gender = formData.get("gender") as string
    const pet_type = formData.get("pet_type") as string
    const breed = formData.get("breed") as string
    const temperament = formData.get("temperament") as string
    const food = formData.get("food") as string
    const favourite_treats = formData.get("favourite_treats") as string
    const allergies = formData.get("allergies") as string
    const bio = formData.get("bio") as string
    const avatar = formData.get("avatar") as File

    let avatar_url = null

    // Upload avatar if provided
    if (avatar && avatar.size > 0) {
      const fileExt = avatar.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('pet-avatars')
        .upload(filePath, avatar)

      if (uploadError) {
        return fail(500, { error: "Error uploading avatar" })
      }

      const { data: { publicUrl } } = supabase.storage
        .from('pet-avatars')
        .getPublicUrl(filePath)

      avatar_url = publicUrl
    }

    // Insert new pet
    const { error } = await supabase.from("pets").insert({
      profile_id: user.id,
      name,
      second_name,
      date_of_birth,
      gender,
      pet_type,
      breed,
      temperament,
      food,
      favourite_treats,
      allergies,
      bio,
      avatar_url,
      created_at: new Date().toISOString()
    })

    if (error) {
      return fail(500, { error: "Error creating pet" })
    }

    return { success: true }
  },
  deletePet: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session, user } = await safeGetSession()

    if (!session) {
      throw redirect(303, "/login")
    }

    const formData = await request.formData()
    const petId = formData.get("petId") as string
    const confirmName = formData.get("confirmName") as string

    // Verify pet ownership
    const { data: pet } = await supabase
      .from("pets")
      .select("name, profile_id")
      .eq("id", petId)
      .single()

    if (!pet || pet.profile_id !== user.id) {
      return fail(403, { error: "Unauthorized" })
    }

    if (confirmName !== pet.name) {
      return fail(400, { error: "Confirmation name doesn't match" })
    }

    // Delete pet's avatar from storage if it exists
    const { data: petWithAvatar } = await supabase
      .from("pets")
      .select("avatar_url")
      .eq("id", petId)
      .single()

    if (petWithAvatar?.avatar_url) {
      const avatarPath = petWithAvatar.avatar_url.split("/").pop()
      if (avatarPath) {
        await supabase.storage
          .from("pet-avatars")
          .remove([`${user.id}/${avatarPath}`])
      }
    }

    // Delete all related records first
    await supabase.from("pet_maintenance").delete().eq("pet_id", petId)
    await supabase.from("pet_veterinarian").delete().eq("pet_id", petId)
    await supabase.from("pet_contacts").delete().eq("pet_id", petId)

    // Finally delete the pet
    const { error } = await supabase
      .from("pets")
      .delete()
      .eq("id", petId)

    if (error) {
      return fail(500, { error: "Failed to delete pet" })
    }

    return { success: true }
  }
}
