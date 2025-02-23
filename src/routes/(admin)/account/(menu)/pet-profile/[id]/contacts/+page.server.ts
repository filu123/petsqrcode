import { error } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
  // Get pet contacts
  const { data: contacts, error: contactsError } = await supabase
    .from("pet_contacts")
    .select("*")
    .eq("pet_id", params.id)
    .order('is_primary', { ascending: false })

  if (contactsError) {
    throw error(500, "Failed to load contacts")
  }

  return {
    contacts: contacts || []
  }
}

export const actions = {
  addContact: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    
    const contactData = {
      pet_id: params.id,
      full_name: formData.get('full_name')?.toString(),
      email: formData.get('email')?.toString(),
      phone_number: formData.get('phone_number')?.toString(),
      address: formData.get('address')?.toString(),
      is_public: formData.get('is_public') === 'on',
    }

    const { error: insertError } = await supabase
      .from("pet_contacts")
      .insert(contactData)

    if (insertError) {
      return { success: false, error: insertError.message }
    }

    // Fetch updated contacts
    const { data: contacts } = await supabase
      .from("pet_contacts")
      .select("*")
      .eq("pet_id", params.id)
      .order('is_primary', { ascending: false })

    return {
      success: true,
      contacts
    }
  },

  updateContact: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    const contactId = formData.get('contact_id')?.toString()
    
    if (!contactId) {
      return { success: false, error: "Contact ID is required" }
    }

    const contactData = {
      full_name: formData.get('full_name')?.toString(),
      email: formData.get('email')?.toString(),
      phone_number: formData.get('phone_number')?.toString(),
      address: formData.get('address')?.toString(),
      is_public: formData.get('is_public') === 'on',
    }

    const { error: updateError } = await supabase
      .from("pet_contacts")
      .update(contactData)
      .eq("id", contactId)
      .eq("pet_id", params.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // Fetch updated contacts
    const { data: contacts } = await supabase
      .from("pet_contacts")
      .select("*")
      .eq("pet_id", params.id)
      .order('is_primary', { ascending: false })

    return {
      success: true,
      contacts
    }
  },

  deleteContact: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    const contactId = formData.get('contact_id')?.toString()

    if (!contactId) {
      return { success: false, error: "Contact ID is required" }
    }

    const { error: deleteError } = await supabase
      .from("pet_contacts")
      .delete()
      .eq("id", contactId)
      .eq("pet_id", params.id)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    // Fetch updated contacts
    const { data: contacts } = await supabase
      .from("pet_contacts")
      .select("*")
      .eq("pet_id", params.id)
      .order('is_primary', { ascending: false })

    return {
      success: true,
      contacts
    }
  },

  setPrimary: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    const contactId = formData.get('contact_id')?.toString()

    if (!contactId) {
      return { success: false, error: "Contact ID is required" }
    }

    const { error: updateError } = await supabase
      .from("pet_contacts")
      .update({ is_primary: true })
      .eq("id", contactId)
      .eq("pet_id", params.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // Fetch updated contacts
    const { data: contacts } = await supabase
      .from("pet_contacts")
      .select("*")
      .eq("pet_id", params.id)
      .order('is_primary', { ascending: false })

    return {
      success: true,
      contacts
    }
  }
} satisfies Actions