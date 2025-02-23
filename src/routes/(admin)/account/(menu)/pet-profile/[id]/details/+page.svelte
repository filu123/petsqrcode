<script lang="ts">
  import { enhance } from "$app/forms"
  import { goto } from "$app/navigation"
  import PetProfile from "$lib/components/PetProfile.svelte"
  import { getContext } from "svelte"

  interface PetContext {
    get: () => any
    set: (pet: any) => void
  }

  let { data } = $props()

  const { get: getSelectedPet, set: setSelectedPet } =
    getContext<PetContext>("selectedPet")
  let pet = $state(data.pet)

  // Change from derived to state
  let previewUrl = $state(pet?.avatar_url || "/images/Section.png")
  let files: FileList
  $effect(() => {
    pet = data.pet
    setSelectedPet(data.pet)
  })
  // Update when pet changes
  $effect(() => {
    previewUrl = pet?.avatar_url || "/images/Section.png"
  })

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
      const file = input.files[0]
      previewUrl = URL.createObjectURL(file)
    }
  }

  let isSaving = $state(false)
  let showSuccess = $state(false)

  const handleSubmit = () => {
    return async ({ result }: { result: any }) => {
      isSaving = true
      if (result.success && result.pet) {
        setSelectedPet(result.pet)
        showSuccess = true
        setTimeout(() => {
          showSuccess = false
        }, 3000) // Hide after 3 seconds

        // Refresh the page after successful submission
        window.location.reload()
      }
      isSaving = false
    }
  }
</script>

<div class="">
  <!-- Left Column - Edit Form -->
  <div class="border-b pb-6">
    <h1 class="text-xl text-[#344054] mb-1 font-bold">Pet Details</h1>
    <p class="text-[#475467] text-sm">
      You can easily add all the details of your pet here.
    </p>
  </div>
  <div class="space-y-6">
    <form
      method="POST"
      action="?/updatePet"
      use:enhance={handleSubmit}
      class="space-y-2"
    >
      <input type="hidden" name="id" value={pet.id} />
      <div>
        <label class="label">
          <span class="label-text text-sm text-[#344054] font-medium"
            >Profile Photo</span
          >
        </label>
        <div class="flex items-center gap-4">
          <div class="avatar">
            <div class="w-20 h-20 rounded-full">
              <img src={previewUrl} alt={pet?.name} />
            </div>
          </div>
          <div class="flex gap-4 w-full">
            <label class="btn btn-outline gap-2 normal-case">
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload New
              <input
                type="file"
                accept="image/*"
                class="hidden"
                onchange={handleFileSelect}
              />
            </label>
            <div class="pt-0 ml-auto">
              <button
                type="submit"
                class="btn btn-primary w-fit"
                disabled={isSaving}
              >
                {#if isSaving}
                  <span class="loading loading-spinner"></span>
                  Saving...
                {:else}
                  Save Changes
                {/if}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pet Names -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">
            <span class="label-text font-medium">Pet First Name*</span>
          </label>
          <input
            type="text"
            name="name"
            class="input bg-white input-bordered w-full"
            value={pet?.name}
            required
          />
        </div>
        <div>
          <label class="label">
            <span class="label-text font-medium">Pet Second Name</span>
          </label>
          <input
            type="text"
            name="second_name"
            class="input bg-white input-bordered w-full"
            value={pet?.second_name}
          />
        </div>
      </div>

      <!-- Profile URL -->
      <!-- <div>
        <label class="label">
          <span class="label-text font-medium">Profile URL</span>
        </label>
        <div class="join w-full">
          <span class="join-item input input-bordered bg-base-200"
            >Paaws.bio/</span
          >
          <input
            type="text"
            class="join-item bg-white input input-bordered w-full bg-base-200"
            value={pet?.name || pet?.name?.toLowerCase()}
            readonly
          />
        </div>
      </div> -->

      <!-- Pet Bio -->
      <div>
        <label class="label">
          <span class="label-text font-medium">Pet Bio</span>
        </label>
        <textarea
          name="bio"
          class="textarea bg-white textarea-bordered w-full h-32"
          value={pet?.bio}
       ></textarea>
      </div>

      <!-- Basic Info -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">
            <span class="label-text font-medium">Date of Birth</span>
          </label>
          <input
            type="date"
            name="date_of_birth"
            class="input bg-white input-bordered w-full"
            value={pet?.date_of_birth}
          />
        </div>
        <div>
          <label class="label">
            <span class="label-text font-medium">Gender</span>
          </label>
          <select
            name="gender"
            class="select bg-white select-bordered w-full"
            value={pet?.gender}
          >
            <option value="Boy">Boy</option>
            <option value="Girl">Girl</option>
          </select>
        </div>
      </div>

      <!-- Pet Type and Breed -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">
            <span class="label-text font-medium">Type of Pet</span>
          </label>
          <select
            name="type"
            class="select bg-white select-bordered w-full"
            value={pet?.pet_type}
          >
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
          </select>
        </div>
        <div>
          <label class="label">
            <span class="label-text font-medium">Breed</span>
          </label>
          <input
            type="text"
            name="breed"
            class="input bg-white input-bordered w-full"
            value={pet?.breed}
          />
        </div>
      </div>

      <!-- Additional Info -->
      <div class=" grid grid-cols-2 gap-4">
        <div>
          <label class="label">
            <span class="label-text font-medium">Temperament</span>
          </label>
          <input
            type="text"
            name="temperament"
            class="input bg-white input-bordered w-full"
            value={pet?.temperament}
          />
        </div>
        <div>
          <label class="label">
            <span class="label-text font-medium">Allergies</span>
          </label>
          <input
            placeholder="Type allergies here..."
            type="text"
            name="allergies"
            class="input bg-white input-bordered w-full"
            value={pet?.allergies}
          />
        </div>
      </div>

      <!-- Food Preferences -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">
            <span class="label-text font-medium">Favourite Food Brand</span>
          </label>
          <input
            placeholder="e.g. Bakers"
            type="text"
            name="food"
            class="input bg-white input-bordered w-full"
            value={pet?.food}
          />
        </div>
        <div>
          <label class="label">
            <span class="label-text font-medium">Favourite Treats</span>
          </label>
          <input
            placeholder="e.g. Bakers Bacon Swirls"
            type="text"
            name="favourite_treats"
            class="input bg-white input-bordered w-full"
            value={pet?.favourite_treats}
          />
        </div>
      </div>
      {#if showSuccess}
        <div class="toast toast-end">
          <div class="alert alert-success">
            <span>Changes saved successfully!</span>
          </div>
        </div>
      {/if}
      <!-- Submit Button -->
    </form>
  </div>

  <!-- Right Column - Preview -->
</div>
