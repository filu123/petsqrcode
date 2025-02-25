import { fail, redirect } from "@sveltejs/kit"
import { sendAdminEmail, sendUserEmail } from "$lib/mailer"
import { WebsiteBaseUrl } from "../../../../config"
import { petService } from "$lib/services/petService"
import type { Database } from "../../../../DatabaseDefinitions"

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

    // Validation
    let validationError
    if (!email || email === "") {
      validationError = "An email address is required"
    } else if (!email.includes("@")) {
      validationError = "A valid email address is required"
    }
    
    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields: ["email"],
        email,
      })
    }

    const { error } = await supabase.auth.updateUser({ email: email })

    if (error) {
      console.error("Error updating email", error)
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        email,
      })
    }

    return { email }
  },
  
  updatePassword: async ({ request, locals: { supabase, safeGetSession } }) => {
    // This action requires access to supabase.auth directly
    // Keep the existing implementation
    const { session, user, amr } = await safeGetSession()
    if (!session) {
      redirect(303, "/login")
    }

    // Rest of your existing code...
    const formData = await request.formData()
    const newPassword1 = formData.get("newPassword1") as string
    const newPassword2 = formData.get("newPassword2") as string
    const currentPassword = formData.get("currentPassword") as string

    // Keep your existing validation and password update logic
    // ...

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
    // This action requires admin privileges, keep as is
    const { session, user } = await safeGetSession()
    if (!session || !user?.id) {
      redirect(303, "/login")
    }

    // Keep your existing code...
    // ...

    await supabase.auth.signOut()
    redirect(303, "/")
  },
  
  updateProfile: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session, user } = await safeGetSession()
    if (!session || !user?.id) {
      redirect(303, "/login")
    }
    
    const formData = await request.formData()
    
    // Process profile fields
    const profileData = {
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      home_phone: formData.get("homePhone") as string,
      mobile_phone: formData.get("mobilePhone") as string,
      email: formData.get("email") as string,
      country: formData.get("country") as string,
      address: formData.get("address") as string,
      updated_at: new Date()
    };
    
    // Validate profile fields
    const profileValidation = validateProfileData(profileData);
    if (profileValidation.error) {
      return fail(400, {
        errorMessage: profileValidation.error,
        errorFields: profileValidation.fields,
        ...profileData
      });
    }
    
    // Process pet data
    const pets = [];
    let i = 0;
    while (formData.has(`pets[${i}].petName`)) {
      const pet = {
        profile_id: user.id,
        name: formData.get(`pets[${i}].petName`) as string,
        second_name: formData.get(`pets[${i}].petSecondName`) as string,
        date_of_birth: formData.get(`pets[${i}].dateOfBirth`) as string,
        gender: formData.get(`pets[${i}].gender`) as string,
        pet_type: formData.get(`pets[${i}].petType`) as string,
        temperament: formData.get(`pets[${i}].temperament`) as string,
        food: formData.get(`pets[${i}].food`) as string,
        favourite_treats: formData.get(`pets[${i}].favouriteTreats`) as string,
        allergies: formData.get(`pets[${i}].allergies`) as string,
        breed: formData.get(`pets[${i}].breed`) as string,
        bio: formData.get(`pets[${i}].bio`) as string,
        avatar_url: formData.get(`pets[${i}].avatarUrl`) as string,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      pets.push(pet);
      i++;
    }
    
    // Validate pets
    if (pets.length === 0) {
      return fail(400, {
        errorMessage: "At least one pet is required",
        errorFields: ["petName"],
      });
    }
    
    for (const pet of pets) {
      if (!pet.name || !pet.date_of_birth || !pet.gender || !pet.pet_type) {
        return fail(400, {
          errorMessage: "Please fill in all required pet fields",
          errorFields: ["petName", "dateOfBirth", "gender", "petType", "breed"],
        });
      }
    }
    
    // Handle avatar upload
    const avatarFile = formData.get("avatar") as File;
    if (avatarFile && avatarFile.size > 0) {
      try {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('pet-avatars')
          .upload(filePath, avatarFile);

        if (uploadError) {
          return fail(500, {
            errorMessage: "Error uploading pet avatar. Please try again."
          });
        }

        const { data: { publicUrl } } = supabase
          .storage
          .from('pet-avatars')
          .getPublicUrl(filePath);

        // Assign avatar to the first pet if no specific pet is targeted
        if (pets[0]) {
          pets[0].avatar_url = publicUrl;
        }
      } catch (error) {
        console.error("Error processing avatar", error);
        return fail(500, {
          errorMessage: "Error processing avatar. Please try again."
        });
      }
    }
    
    // Update profile
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...profileData
        })
        .select();
        
      if (profileError) {
        throw profileError;
      }
    } catch (error) {
      console.error("Error updating profile", error);
      return fail(500, {
        errorMessage: "Error updating profile. Please try again."
      });
    }
    
    // Create pets
    for (const pet of pets) {
      try {
        const { error: petError } = await supabase
          .from("pets")
          .insert(pet);

        if (petError) {
          throw petError;
        }
      } catch (error) {
        console.error("Error creating pet", error);
        return fail(500, {
          errorMessage: "Error creating pet. Please try again."
        });
      }
    }
    
    // Send welcome email for the first pet
    await sendUserEmail({
      user: session.user,
      subject: "Welcome to PetsQRCode!",
      from_email: "no-reply@petsqrcode.com",
      template_name: "welcome_email",
      template_properties: {
        firstName: profileData.first_name,
        petName: pets[0]?.name || "your pet",
        WebsiteBaseUrl: WebsiteBaseUrl,
      },
    });

    return { success: true };
  },
  
  addPet: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session, user } = await safeGetSession();
    if (!session || !user?.id) {
      redirect(303, "/login");
    }
    
    const formData = await request.formData();
    
    // Create pet object from form data
    const petData = {
      profile_id: user.id,
      name: formData.get("name") as string,
      second_name: formData.get("second_name") as string || null,
      date_of_birth: formData.get("date_of_birth") as string,
      gender: formData.get("gender") as string,
      pet_type: formData.get("pet_type") as string,
      temperament: formData.get("temperament") as string || null,
      food: formData.get("food") as string || null,
      favourite_treats: formData.get("favourite_treats") as string || null,
      allergies: formData.get("allergies") as string || null,
      breed: formData.get("breed") as string,
      bio: formData.get("bio") as string || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Validate required fields
    if (!petData.name || !petData.date_of_birth || !petData.gender || 
        !petData.pet_type || !petData.breed) {
      return fail(400, {
        errorMessage: "Missing required fields",
        requiredFields: ["name", "date_of_birth", "gender", "pet_type", "breed"]
      });
    }
    
    // Handle avatar upload
    const avatarFile = formData.get("avatar") as File;
    if (avatarFile && avatarFile.size > 0) {
      try {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('pet-avatars')
          .upload(filePath, avatarFile);

        if (uploadError) {
          return fail(500, {
            errorMessage: "Error uploading pet avatar. Please try again."
          });
        }

        const { data: { publicUrl } } = supabase
          .storage
          .from('pet-avatars')
          .getPublicUrl(filePath);

        petData.avatar_url = publicUrl;
      } catch (error) {
        console.error("Error processing avatar", error);
        return fail(500, {
          errorMessage: "Error processing avatar. Please try again."
        });
      }
    }
    
    // Create pet
    try {
      const response = await petService.createPet(petData);
      
      if (response.error) {
        return fail(500, {
          errorMessage: response.error.message || "Failed to create pet"
        });
      }
      
      return { success: true, pet: response.data };
    } catch (error) {
      console.error("Error creating pet", error);
      return fail(500, {
        errorMessage: "Error creating pet. Please try again."
      });
    }
  },
  
  deletePet: async ({ request, locals: { safeGetSession } }) => {
    const { session, user } = await safeGetSession();
    if (!session || !user?.id) {
      redirect(303, "/login");
    }
    
    const formData = await request.formData();
    const petId = formData.get("petId") as string;
    
    if (!petId) {
      return fail(400, {
        errorMessage: "Pet ID is required"
      });
    }
    
    try {
      const response = await petService.deletePet(petId);
      
      if (response.error) {
        return fail(500, {
          errorMessage: response.error.message || "Failed to delete pet"
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting pet", error);
      return fail(500, {
        errorMessage: "Error deleting pet. Please try again."
      });
    }
  }
};

// Helper function for profile validation
function validateProfileData(profileData: Partial<Database['public']['Tables']['profiles']['Update']>) {
  const errorFields = [];
  
  if (!profileData.first_name) {
    errorFields.push("firstName");
  }
  
  if (!profileData.last_name) {
    errorFields.push("lastName");
  }
  
  if (!profileData.mobile_phone) {
    errorFields.push("mobilePhone");
  }
  
  if (!profileData.email) {
    errorFields.push("email");
  }
  
  if (!profileData.country) {
    errorFields.push("country");
  }
  
  if (!profileData.address) {
    errorFields.push("address");
  }
  
  if (errorFields.length > 0) {
    return {
      error: `${errorFields.map(f => f.replace(/([A-Z])/g, ' $1').trim()).join(', ')} ${errorFields.length > 1 ? 'are' : 'is'} required`,
      fields: errorFields
    };
  }
  
  return { error: null, fields: [] };
}