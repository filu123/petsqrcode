import { fail, redirect } from "@sveltejs/kit"
import { sendAdminEmail, sendUserEmail } from "$lib/mailer"
import { WebsiteBaseUrl } from "../../../../config"
import { createClient } from '@supabase/supabase-js'
import { petActions } from './petActions.server';

 // Get pets for the current user
export const actions = {
  toggleEmailSubscription: async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()

    if (!session) {
      redirect(303, "/login")
    }

    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("unsubscribed")
      .eq("id", session.user.id)
      .single()

    const newUnsubscribedStatus = !currentProfile?.unsubscribed

    const { error } = await supabase
      .from("profiles")
      .update({ unsubscribed: newUnsubscribedStatus })
      .eq("id", session.user.id)

    if (error) {
      console.error("Error updating subscription status", error)
      return fail(500, { message: "Failed to update subscription status" })
    }

    return {
      unsubscribed: newUnsubscribedStatus,
    }
  },
  updateEmail: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      redirect(303, "/login")
    }

    const formData = await request.formData()
    const email = formData.get("email") as string

    let validationError
    if (!email || email === "") {
      validationError = "An email address is required"
    }
    // Dead simple check -- there's no standard here (which is followed),
    // and lots of errors will be missed until we actually email to verify, so
    // just do that
    else if (!email.includes("@")) {
      validationError = "A valid email address is required"
    }
    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields: ["email"],
        email,
      })
    }

    // Supabase does not change the email until the user verifies both
    // if 'Secure email change' is enabled in the Supabase dashboard
    const { error } = await supabase.auth.updateUser({ email: email })

    if (error) {
      console.error("Error updating email", error)
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        email,
      })
    }

    return {
      email,
    }
  },
  updatePassword: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session, user, amr } = await safeGetSession()
    if (!session) {
      redirect(303, "/login")
    }

    const formData = await request.formData()
    const newPassword1 = formData.get("newPassword1") as string
    const newPassword2 = formData.get("newPassword2") as string
    const currentPassword = formData.get("currentPassword") as string

    // Can check if we're a "password recovery" session by checking session amr
    // let currentPassword take priority if provided (user can use either form)
    const recoveryAmr = amr?.find((x) => x.method === "recovery")
    const isRecoverySession = recoveryAmr && !currentPassword

    // if this is password recovery session, check timestamp of recovery session
    if (isRecoverySession) {
      const timeSinceLogin = Date.now() - recoveryAmr.timestamp * 1000
      if (timeSinceLogin > 1000 * 60 * 15) {
        // 15 mins in milliseconds
        return fail(400, {
          errorMessage:
            'Recovery code expired. Please log out, then use "Forgot Password" on the sign in page to reset your password. Codes are valid for 15 minutes.',
          errorFields: [],
          newPassword1,
          newPassword2,
          currentPassword: "",
        })
      }
    }

    let validationError
    const errorFields = []
    if (!newPassword1) {
      validationError = "You must type a new password"
      errorFields.push("newPassword1")
    }
    if (!newPassword2) {
      validationError = "You must type the new password twice"
      errorFields.push("newPassword2")
    }
    if (newPassword1.length < 6) {
      validationError = "The new password must be at least 6 charaters long"
      errorFields.push("newPassword1")
    }
    if (newPassword1.length > 72) {
      validationError = "The new password can be at most 72 charaters long"
      errorFields.push("newPassword1")
    }
    if (newPassword1 != newPassword2) {
      validationError = "The passwords don't match"
      errorFields.push("newPassword1")
      errorFields.push("newPassword2")
    }
    if (!currentPassword && !isRecoverySession) {
      validationError =
        "You must include your current password. If you forgot it, sign out then use 'forgot password' on the sign in page."
      errorFields.push("currentPassword")
    }
    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields: [...new Set(errorFields)], // unique values
        newPassword1,
        newPassword2,
        currentPassword,
      })
    }

    // Check current password is correct before updating, but only if they didn't log in with "recover" link
    // Note: to make this truly enforced you need to contact supabase. See: https://www.reddit.com/r/Supabase/comments/12iw7o1/updating_password_in_supabase_seems_insecure/
    // However, having the UI accessible route still verify password is still helpful, and needed once you get the setting above enabled
    if (!isRecoverySession) {
      const { error } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      })
      if (error) {
        // The user was logged out because of bad password. Redirect to error page explaining.
        redirect(303, "/login/current_password_error")
      }
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword1,
    })
    if (error) {
      console.error("Error updating password", error)
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        newPassword1,
        newPassword2,
        currentPassword,
      })
    }

    return {
      newPassword1,
      newPassword2,
      currentPassword,
    }
  },
  deleteAccount: async ({
    request,
    locals: { supabase, supabaseServiceRole, safeGetSession },
  }) => {
    const { session, user } = await safeGetSession()
    if (!session || !user?.id) {
      redirect(303, "/login")
    }

    const formData = await request.formData()
    const currentPassword = formData.get("currentPassword") as string

    if (!currentPassword) {
      return fail(400, {
        errorMessage:
          "You must provide your current password to delete your account. If you forgot it, sign out then use 'forgot password' on the sign in page.",
        errorFields: ["currentPassword"],
        currentPassword,
      })
    }

    // Check current password is correct before deleting account
    const { error: pwError } = await supabase.auth.signInWithPassword({
      email: user?.email || "",
      password: currentPassword,
    })
    if (pwError) {
      // The user was logged out because of bad password. Redirect to error page explaining.
      redirect(303, "/login/current_password_error")
    }

    const { error } = await supabaseServiceRole.auth.admin.deleteUser(
      user.id,
      true,
    )
    if (error) {
      console.error("Error deleting user", error)
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        currentPassword,
      })
    }

    await supabase.auth.signOut()
    redirect(303, "/")
  },
  updateProfile: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session, user } = await safeGetSession()
    if (!session || !user?.id) {
      redirect(303, "/login")
    }
    
    const formData = await request.formData()
  

    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const homePhone = formData.get("homePhone") as string
    const mobilePhone = formData.get("mobilePhone") as string
    const email = formData.get("email") as string
    const country = formData.get("country") as string
    const address = formData.get("address") as string
    

    // Pet details
    const petName = formData.get("petName") as string
    const petSecondName = formData.get("petSecondName") as string
    const dateOfBirth = formData.get("dateOfBirth") as string
    const gender = formData.get("gender") as string
    const petType = formData.get("petType") as string
    const temperament = formData.get("temperament") as string
    const food = formData.get("food") as string
    const favouriteTreats = formData.get("favouriteTreats") as string
    const allergies = formData.get("allergies") as string
    const breed = formData.get("breed") as string
    const bio = formData.get("bio") as string
    const avatarFile = formData.get("avatar") as File
    
    let avatarUrl = null
    let validationError
    const errorFields = []

    const pets = []
    let i = 0
    while (formData.has(`pets[${i}].petName`)) {
      const pet = {
        petName: formData.get(`pets[${i}].petName`),
        petSecondName: formData.get(`pets[${i}].petSecondName`),
        dateOfBirth: formData.get(`pets[${i}].dateOfBirth`),
        gender: formData.get(`pets[${i}].gender`),
        petType: formData.get(`pets[${i}].petType`),
        temperament: formData.get(`pets[${i}].temperament`),
        food: formData.get(`pets[${i}].food`),
        favouriteTreats: formData.get(`pets[${i}].favouriteTreats`),
        allergies: formData.get(`pets[${i}].allergies`),
        breed: formData.get(`pets[${i}].breed`),
        bio: formData.get(`pets[${i}].bio`),
        avatarUrl: formData.get(`pets[${i}].avatarUrl`)
      }
      pets.push(pet)
      i++
    }

    // Validate at least one pet
    if (pets.length === 0) {
      return fail(400, {
        errorMessage: "At least one pet is required",
        errorFields: ["petName"],
      })
    }

    // Validate each pet
    for (const pet of pets) {
      if (!pet.petName || !pet.dateOfBirth || !pet.gender || !pet.petType ) {
        return fail(400, {
          errorMessage: "Please fill in all required pet fields",
          errorFields: ["petName", "dateOfBirth", "gender", "petType", "breed"],
        })
      }
    }
    // Validate profile fields
    if (!firstName) {
      validationError = "First name is required"
      errorFields.push("firstName")
    }
    if (!lastName) {
      validationError = "Last name is required"
      errorFields.push("lastName")
    }
    if (!mobilePhone) {
      validationError = "Mobile phone is required"
      errorFields.push("mobilePhone")
    }
    if (!email) {
      validationError = "Email is required"
      errorFields.push("email")
    }
    if (!country) {
      validationError = "Country is required"
      errorFields.push("country")
    }
    if (!address) {
      validationError = "Address is required"
      errorFields.push("address")
    }
    
   
    if (avatarFile && avatarFile.size > 0) {
      // Upload to Supabase Storage
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('pet-avatars')
        .upload(filePath, avatarFile)

      if (uploadError) {
        console.error("Error uploading avatar", uploadError)
        return fail(500, {
          errorMessage: "Error uploading pet avatar. Please try again."
        })
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('pet-avatars')
        .getPublicUrl(filePath)

      avatarUrl = publicUrl
    }

    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields,
        firstName,
        lastName,
        homePhone,
        mobilePhone,
        email,
        country,
        address
      })
    }
    // Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        home_phone: homePhone,
        mobile_phone: mobilePhone,
        email: email,
        country: country,
        address: address,
        updated_at: new Date(),
       
      })
      .select()
    if (profileError) {
      console.error("Error updating profile", profileError)
      return fail(500, {
        errorMessage: "Error updating profile. Please try again."
      })
    }

    
    for (const pet of pets) {
      const { error: petError } = await supabase
        .from("pets")
        .insert({
          profile_id: user.id,
          name: pet.petName,
          second_name: pet.petSecondName,
          date_of_birth: pet.dateOfBirth,
          gender: pet.gender,
          pet_type: pet.petType,
          temperament: pet.temperament,
          food: pet.food,
          favourite_treats: pet.favouriteTreats,
          allergies: pet.allergies,
          breed: pet.breed,
          bio: pet.bio,
          avatar_url: pet.avatarUrl,
          created_at: new Date(),
          updated_at: new Date(),
        })

      if (petError) {
        console.error("Error creating pet", petError)
        return fail(500, {
          errorMessage: "Error creating pet. Please try again."
        })
      }
    }

    // Send welcome email only for the first pet
    await sendUserEmail({
      user: session.user,
      subject: "Welcome to PetsQRCode!",
      from_email: "no-reply@petsqrcode.com",
      template_name: "welcome_email",
      template_properties: {
        firstName: firstName,
        petName: pets[0].petName,
        WebsiteBaseUrl: WebsiteBaseUrl,
      },
    })

    return {
      success: true
    }
  },
  addPet: petActions.addPet,
  deletePet: petActions.deletePet
}
