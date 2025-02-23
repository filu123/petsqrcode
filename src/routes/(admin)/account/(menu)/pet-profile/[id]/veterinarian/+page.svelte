<script lang="ts">
  import { enhance } from "$app/forms"
  import { getContext } from "svelte"

  interface PetContext {
    get: () => any
    set: (pet: any) => void
  }

  let { data } = $props()
  let veterinarian = $state(data.veterinarian)
  let isSaving = $state(false)
  let showSuccess = $state(false)
  let isEditing = $state(!veterinarian)

  const { get: getSelectedPet } = getContext<PetContext>("selectedPet")
  let pet = $state(getSelectedPet())

  function startEdit() {
    isEditing = true
  }

  function cancelEdit() {
    if (!veterinarian) {
      isEditing = true // Keep form open if no veterinarian exists
    } else {
      isEditing = false
    }
  }

  const handleSubmit = () => {
    return async ({ result }: { result: any }) => {
      isSaving = true
      if (result.success) {
        veterinarian = result.veterinarian
        showSuccess = true
        isEditing = false
        setTimeout(() => {
          showSuccess = false
        }, 3000)
      }
      isSaving = false
    }
  }
</script>

<div>
  <div class="border-b pb-6">
    <h1 class="text-xl text-[#344054] mb-1 font-bold">Veterinarian Details</h1>
    <p class="text-[#475467] text-sm">
      You can add your registered veterinarian here to keep track of where they
      are registered.
    </p>
  </div>

  <div class="space-y-6 mt-6">
    <!-- Toggle for public visibility -->
    <!-- <div class="flex items-center gap-3">
      <div class="form-control">
        <label class="label cursor-pointer gap-3">
          <input
            type="checkbox"
            class="toggle toggle-success"
            checked={!veterinarian?.is_public}
          />
          <span class="label-text">Hide these details from my pet profile</span>
        </label>
      </div>
    </div> -->

    {#if !isEditing && veterinarian}
      <div class="bg-white p-6 rounded-xl border">
        <div class="flex justify-between items-start">
          <div class="space-y-2">
            <p class="text-gray-600">{veterinarian.address}</p>
            <p class="text-gray-600">{veterinarian.country}</p>
            <p class="text-gray-600">{veterinarian.phone_number}</p>
            <p class="text-gray-600">{veterinarian.email}</p>
          </div>
          <button class="btn btn-ghost btn-sm" on:click={startEdit}>
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
            Change Veterinarian Details
          </button>
        </div>
      </div>
    {:else}
      <form
        method="POST"
        action="?/upsertVeterinarian"
        use:enhance={handleSubmit}
        class="bg-white p-6 rounded-xl border space-y-4"
      >
        <div>
          <label class="label">
            <span class="label-text font-medium">Veterinarian Country*</span>
          </label>
          <select
            name="country"
            class="select select-bordered w-full"
            required
            value={veterinarian?.country}
          >
            <option value="">Select country</option>
            <option value="United Kingdom">United Kingdom</option>
            <!-- Add more countries as needed -->
          </select>
        </div>

        <div>
          <label class="label">
            <span class="label-text font-medium">Address*</span>
          </label>
          <input
            type="text"
            name="address"
            placeholder="Start typing address..."
            class="input input-bordered w-full"
            value={veterinarian?.address}
            required
          />
        </div>

        <div>
          <label class="label">
            <span class="label-text font-medium">Veterinarian Email*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@company.com"
            class="input input-bordered w-full"
            value={veterinarian?.email}
            required
          />
        </div>

        <div>
          <label class="label">
            <span class="label-text font-medium"
              >Veterinarian Phone Number*</span
            >
          </label>
          <div class="join w-full">
            <select class="select select-bordered join-item w-[100px]">
              <option>UK</option>
              <!-- Add more country codes as needed -->
            </select>
            <input
              type="tel"
              name="phone_number"
              placeholder="Enter phone number"
              class="input input-bordered join-item flex-1"
              value={veterinarian?.phone_number}
              required
            />
          </div>
        </div>

        <!-- <div class="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="is_public"
            class="checkbox"
            checked={veterinarian?.is_public ?? true}
          />
          <span class="text-sm text-gray-600">Make these details public</span>
        </div> -->

        <div class="flex justify-end gap-2 pt-4">
          {#if veterinarian}
            <button type="button" class="btn btn-ghost" on:click={cancelEdit}>
              Cancel
            </button>
          {/if}
          <button type="submit" class="btn btn-primary" disabled={isSaving}>
            {#if isSaving}
              <span class="loading loading-spinner"></span>
              Saving...
            {:else}
              Save Details
            {/if}
          </button>
        </div>
      </form>
    {/if}

    {#if showSuccess}
      <div class="toast toast-end">
        <div class="alert alert-success">
          <span>Veterinarian details saved successfully!</span>
        </div>
      </div>
    {/if}
  </div>
</div>
