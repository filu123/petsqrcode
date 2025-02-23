<script lang="ts">
  import { enhance } from "$app/forms"
  import { getContext } from "svelte"

  interface PetContext {
    get: () => any
    set: (pet: any) => void
  }

  let { data } = $props()
  let contacts = $state(data.contacts || [])
  let isSaving = $state(false)
  let showSuccess = $state(false)

  const { get: getSelectedPet } = getContext<PetContext>("selectedPet")
  let pet = $state(getSelectedPet())

  let editingContact = $state<any>(null)
  let showDeleteModal = $state(false)
  let contactToDelete = $state<any>(null)

  function startEdit(contact: any) {
    editingContact = { ...contact }
  }

  function cancelEdit() {
    editingContact = null
  }

  function confirmDelete(contact: any) {
    contactToDelete = contact
    showDeleteModal = true
  }

  function cancelDelete() {
    contactToDelete = null
    showDeleteModal = false
  }

  let showAddForm = $state(false)

  function toggleAddForm() {
    showAddForm = !showAddForm
  }

  const handleSubmit = () => {
    return async ({ result }: { result: any }) => {
      isSaving = true
      if (result.success) {
        contacts = result.contacts
        showSuccess = true
        showAddForm = false // Hide form after successful submission
        setTimeout(() => {
          showSuccess = false
        }, 3000)
      }
      isSaving = false
    }
  }

  async function setPrimaryContact(contactId: string) {
    const form = new FormData()
    form.append("contact_id", contactId)

    const response = await fetch(`?/setPrimary`, {
      method: "POST",
      body: form,
    })
    const result = await response.json()

    if (result.success) {
      contacts = result.contacts
    }
  }
</script>

<div>
  <div class="border-b pb-6 flex justify-between items-center">
    <div>
      <h1 class="text-xl text-[#344054] mb-1 font-bold">Contacts</h1>
      <p class="text-[#475467] text-sm">
        We recommend adding multiple contacts (this might be family or friends)
        for your pet incase we are unable to reach your primary contact.
      </p>
    </div>
    <button class="btn btn-primary" onclick={toggleAddForm}>
      {#if showAddForm}
        Cancel
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add New Contact
      {/if}
    </button>
  </div>

  <div class="space-y-6 mt-6">
    {#if contacts.length > 0}
      {#each contacts as contact}
        {#if editingContact?.id === contact.id}
          <form
            method="POST"
            action="?/updateContact"
            use:enhance={handleSubmit}
            class="bg-white p-6 rounded-xl border space-y-4"
          >
            <input type="hidden" name="contact_id" value={contact.id} />

            <div>
              <label class="label">
                <span class="label-text font-medium">Full Name*</span>
              </label>
              <input
                type="text"
                name="full_name"
                class="input input-bordered w-full"
                value={editingContact.full_name}
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">
                  <span class="label-text font-medium">Email*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  class="input input-bordered w-full"
                  value={editingContact.email}
                  required
                />
              </div>
              <div>
                <label class="label">
                  <span class="label-text font-medium">Phone Number*</span>
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  class="input input-bordered w-full"
                  value={editingContact.phone_number}
                  required
                />
              </div>
            </div>

            <div>
              <label class="label">
                <span class="label-text font-medium">Address*</span>
              </label>
              <input
                type="text"
                name="address"
                class="input input-bordered w-full"
                value={editingContact.address}
                required
              />
            </div>

            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_public"
                class="checkbox"
                checked={editingContact.is_public}
              />
              <span class="text-sm text-gray-600">Make this contact public</span
              >
            </div>

            <div class="flex justify-end gap-2 pt-4">
              <button type="button" class="btn btn-ghost" onclick={cancelEdit}>
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" disabled={isSaving}>
                {#if isSaving}
                  <span class="loading loading-spinner"></span>
                  Saving...
                {:else}
                  Save Changes
                {/if}
              </button>
            </div>
          </form>
        {:else}
          <div class="bg-white p-6 rounded-xl border">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold">{contact.full_name}</h3>
                <p class="text-gray-600">{contact.email}</p>
                <p class="text-gray-600">{contact.phone_number}</p>
                <p class="text-gray-600">{contact.address}</p>
              </div>
              <div class="flex gap-2">
                {#if !contact.is_primary}
                  <button
                    class="btn btn-outline btn-sm"
                    onclick={() => setPrimaryContact(contact.id)}
                  >
                    Set as Primary
                  </button>
                {:else}
                  <span class="badge badge-success">Primary Contact</span>
                {/if}
                <button
                  class="btn btn-ghost btn-sm"
                  onclick={() => startEdit(contact)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <button
                  class="btn btn-ghost btn-sm text-error"
                  onclick={() => confirmDelete(contact)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        {/if}
      {/each}
    {:else}
      <div class="text-center py-12 bg-base-200 rounded-xl">
        <h3 class="text-lg font-semibold text-gray-600">
          No contacts added yet
        </h3>
        <p class="text-gray-500">Add your first contact to get started</p>
      </div>
    {/if}

    <!-- Add Contact Form - Only shown when showAddForm is true -->
    {#if showAddForm}
      <form
        method="POST"
        action="?/addContact"
        use:enhance={handleSubmit}
        class="bg-white p-6 rounded-xl border space-y-4"
      >
        <h3 class="font-semibold text-lg">Add New Contact</h3>

        <div>
          <label class="label">
            <span class="label-text font-medium">Full Name*</span>
          </label>
          <input
            type="text"
            name="full_name"
            class="input input-bordered w-full"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">
              <span class="label-text font-medium">Email*</span>
            </label>
            <input
              type="email"
              name="email"
              class="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label class="label">
              <span class="label-text font-medium">Phone Number*</span>
            </label>
            <input
              type="tel"
              name="phone_number"
              class="input input-bordered w-full"
              required
            />
          </div>
        </div>

        <div>
          <label class="label">
            <span class="label-text font-medium">Address*</span>
          </label>
          <input
            type="text"
            name="address"
            class="input input-bordered w-full"
            required
          />
        </div>

        <div class="flex items-center gap-2 mt-2">
          <input type="checkbox" name="is_public" class="checkbox" checked />
          <span class="text-sm text-gray-600">Make this contact public</span>
        </div>

        <div class="pt-4">
          <button
            type="submit"
            class="btn btn-primary w-full"
            disabled={isSaving}
          >
            {#if isSaving}
              <span class="loading loading-spinner"></span>
              Adding Contact...
            {:else}
              Add Contact
            {/if}
          </button>
        </div>
      </form>
    {/if}

    {#if showSuccess}
      <div class="toast toast-end">
        <div class="alert alert-success">
          <span>Contact added successfully!</span>
        </div>
      </div>
    {/if}
  </div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteModal}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Delete Contact</h3>
      <p class="py-4">
        Are you sure you want to delete {contactToDelete?.full_name}? This
        action cannot be undone.
      </p>
      <div class="modal-action">
        <form method="POST" action="?/deleteContact" use:enhance={handleSubmit}>
          <input type="hidden" name="contact_id" value={contactToDelete?.id} />
          <button type="button" class="btn btn-ghost" onclick={cancelDelete}
            >Cancel</button
          >
          <button type="submit" class="btn btn-error">Delete</button>
        </form>
      </div>
    </div>
  </div>
{/if}
