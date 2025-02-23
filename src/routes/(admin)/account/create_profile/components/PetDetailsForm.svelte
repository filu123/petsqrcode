<script lang="ts">
  import { enhance } from "$app/forms"
  import { createEventDispatcher } from "svelte"

  interface UserDetails {
    firstName: string
    lastName: string
    homePhone: string
    mobilePhone: string
    email: string
    country: string
    address: string
  }

  type Pet = {
    petName: string
    petSecondName: string
    dateOfBirth: string
    gender: string
    petType: string
    temperament: string
    food?: string // Made optional
    favouriteTreats?: string // Made optional
    allergies?: string // Made optional
    breed?: string // Made optional
    bio?: string // Made optional
    avatarUrl?: string | null // Made optional
  }

  interface Props {
    petDetails: Pet // Update to use the Pet type
    userDetails: UserDetails // Add this new property
    form: FormAccountUpdateResult
    loading: boolean
    handleSubmit: any
    prevStep: () => void
  }

  let { petDetails, userDetails, form, loading, handleSubmit, prevStep } =
    $props<Props>()

  let currentSubstep = $state(1)
  let pets = $state<Pet[]>([])
  let avatarFile: File | null = null
  let previewUrl: string | null = null
  let uploadError: string | null = null

  let errors = $state({
    petName: "",
    dateOfBirth: "",
    gender: "",
    petType: "",
    temperament: "",
  })

  const validatePetDetails = () => {
    let isValid = true
    errors = {
      petName: "",
      dateOfBirth: "",
      gender: "",
      petType: "",
      temperament: "",
    }

    if (!petDetails.petName?.trim()) {
      errors.petName = "Pet name is required"
      isValid = false
    }

    if (!petDetails.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required"
      isValid = false
    }

    if (!petDetails.gender) {
      errors.gender = "Gender is required"
      isValid = false
    }

    if (!petDetails.petType) {
      errors.petType = "Pet type is required"
      isValid = false
    }

    if (!petDetails.temperament) {
      errors.temperament = "Temperament is required"
      isValid = false
    }

    return isValid
  }

  const handleFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        uploadError = "File size must be less than 2MB"
        return
      }

      if (!file.type.startsWith("image/")) {
        uploadError = "Only image files are allowed"
        return
      }

      avatarFile = file
      previewUrl = URL.createObjectURL(file)
      uploadError = null
    }
  }

  const goToNextSubstep = () => {
    if (!validatePetDetails()) {
      return
    }

    pets = [
      ...pets,
      {
        ...petDetails,
        avatarUrl: previewUrl,
      },
    ]
    currentSubstep = 2
  }

  const goToPreviousSubstep = () => {
    currentSubstep = 1
  }

  const handleEdit = (index: number) => {
    const pet = pets[index]
    Object.assign(petDetails, pet)
    previewUrl = pet.avatarUrl ?? null
    pets = pets.filter((_, i) => i !== index)
    currentSubstep = 1
  }

  const handleDelete = (index: number) => {
    pets = pets.filter((_, i) => i !== index)
  }

  const addNewPet = () => {
    Object.keys(petDetails).forEach((key) => {
      petDetails[key as keyof typeof petDetails] = ""
    })
    previewUrl = null
    currentSubstep = 1
  }

  const enhanceSubmit = (event: Event) => {
    const form = event.target as HTMLFormElement
    return handleSubmit()
  }
</script>

<div class="w-full max-w-2xl mx-auto mt-8">
  {#if currentSubstep === 1}
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-[#14181F] mb-4">Your Pets</h1>
      <p class="text-gray-600 max-w-xl mx-auto">
        Let's get your first pet details added. You can add more pets after
        you've completed the first one.
      </p>
    </div>

    <form class="space-y-6">
      <div class="mb-8">
        <label class="block text-[#6B7280] mb-2"
          >Pet Profile Photo (optional)</label
        >
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-gray-100 overflow-hidden">
            {#if previewUrl}
              <img
                src={previewUrl}
                alt="Pet profile preview"
                class="w-full h-full object-cover"
              />
            {:else}
              <div
                class="w-full h-full bg-gray-200 flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            {/if}
          </div>
          <div class="flex flex-col gap-2">
            <label class="btn btn-outline gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"
                />
                <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
              </svg>
              Upload New
              <input
                type="file"
                accept="image/*"
                class="hidden"
                onchange={handleFileSelect}
              />
            </label>
            {#if uploadError}
              <p class="text-red-500 text-sm">{uploadError}</p>
            {/if}
            <p class="text-xs text-gray-500">Maximum file size: 2MB</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="form-control">
          <label class="label">
            <span class="label-text text-[#6B7280]">Pet Name*</span>
          </label>
          <input
            type="text"
            bind:value={petDetails.petName}
            class="input input-bordered w-full bg-white {errors.petName
              ? 'border-red-500'
              : ''}"
            placeholder="Enter pet name"
          />
          {#if errors.petName}
            <label class="label">
              <span class="label-text-alt text-red-500">{errors.petName}</span>
            </label>
          {/if}
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text text-[#6B7280]"
              >Pet Second Name (Optional)</span
            >
          </label>
          <input
            type="text"
            bind:value={petDetails.petSecondName}
            class="input input-bordered w-full bg-white"
            placeholder="Enter second name"
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text text-[#6B7280]">Date of Birth*</span>
          </label>
          <input
            type="date"
            bind:value={petDetails.dateOfBirth}
            class="input input-bordered w-full bg-white {errors.dateOfBirth
              ? 'border-red-500'
              : ''}"
          />
          {#if errors.dateOfBirth}
            <label class="label">
              <span class="label-text-alt text-red-500"
                >{errors.dateOfBirth}</span
              >
            </label>
          {/if}
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text text-[#6B7280]">Gender*</span>
          </label>
          <select
            bind:value={petDetails.gender}
            class="select select-bordered w-full bg-white {errors.gender
              ? 'border-red-500'
              : ''}"
          >
            <option value="">Pick an option</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {#if errors.gender}
            <label class="label">
              <span class="label-text-alt text-red-500">{errors.gender}</span>
            </label>
          {/if}
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text text-[#6B7280]">Type of Pet*</span>
          </label>
          <select
            bind:value={petDetails.petType}
            class="select select-bordered w-full bg-white {errors.petType
              ? 'border-red-500'
              : ''}"
          >
            <option value="">Select pet type</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="other">Other</option>
          </select>
          {#if errors.petType}
            <label class="label">
              <span class="label-text-alt text-red-500">{errors.petType}</span>
            </label>
          {/if}
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text text-[#6B7280]">Temperament*</span>
          </label>
          <select
            bind:value={petDetails.temperament}
            class="select select-bordered w-full bg-white {errors.temperament
              ? 'border-red-500'
              : ''}"
          >
            <option value="">Select type of pet</option>
            <option value="friendly">Friendly</option>
            <option value="shy">Shy</option>
            <option value="aggressive">Aggressive</option>
          </select>
          {#if errors.temperament}
            <label class="label">
              <span class="label-text-alt text-red-500"
                >{errors.temperament}</span
              >
            </label>
          {/if}
          <label class="label">
            <span class="label-text-alt text-gray-500"
              >We ask this incase somebody finds your pet.</span
            >
          </label>
        </div>
      </div>

      <div class="flex justify-between mt-8">
        <button
          type="button"
          class="btn btn-outline rounded-full px-8"
          onclick={prevStep}
        >
          Back
        </button>
        <button
          type="button"
          class="btn btn-primary rounded-full px-8"
          onclick={goToNextSubstep}
        >
          Continue
        </button>
      </div>
    </form>
  {:else}
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-[#14181F] mb-4">Your Pets</h1>
      <p class="text-gray-600 max-w-xl mx-auto">
        Congrats on adding a pet. You can easily add more pets or continue.
      </p>
    </div>

    {#each pets as pet, i}
      <div class="bg-white rounded-lg border p-6 mb-4">
        <div class="flex items-center gap-4">
          {#if pet.avatarUrl}
            <img
              src={pet.avatarUrl}
              alt={pet.petName}
              class="w-16 h-16 rounded-full object-cover"
            />
          {:else}
            <div
              class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          {/if}
          <div class="flex-1">
            <h3 class="text-lg font-medium">
              {pet.petName}
              {pet.petSecondName}
            </h3>
            <p class="text-gray-600">{pet.petType}</p>
          </div>
          <div class="flex gap-2">
            <button
              class="text-primary hover:text-primary-dark"
              onclick={() => handleEdit(i)}
            >
              Edit
            </button>
            <button
              class="text-red-500 hover:text-red-700"
              onclick={() => handleDelete(i)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    {/each}

    <button class="btn btn-outline gap-2 w-full mb-8" onclick={addNewPet}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
          clip-rule="evenodd"
        />
      </svg>
      Add additional pet
    </button>

    <form
      method="POST"
      action="/account/api?/updateProfile"
      use:enhance={enhanceSubmit}
    >
      <!-- Add user details hidden inputs -->
      <input type="hidden" name="firstName" value={userDetails.firstName} />
      <input type="hidden" name="lastName" value={userDetails.lastName} />
      <input type="hidden" name="homePhone" value={userDetails.homePhone} />
      <input type="hidden" name="mobilePhone" value={userDetails.mobilePhone} />
      <input type="hidden" name="email" value={userDetails.email} />
      <input type="hidden" name="country" value={userDetails.country} />
      <input type="hidden" name="address" value={userDetails.address} />

      {#each pets as pet, i}
        <input type="hidden" name={`pets[${i}].petName`} value={pet.petName} />
        <input
          type="hidden"
          name={`pets[${i}].petSecondName`}
          value={pet.petSecondName}
        />
        <input
          type="hidden"
          name={`pets[${i}].dateOfBirth`}
          value={pet.dateOfBirth}
        />
        <input type="hidden" name={`pets[${i}].gender`} value={pet.gender} />
        <input type="hidden" name={`pets[${i}].petType`} value={pet.petType} />
        <input
          type="hidden"
          name={`pets[${i}].temperament`}
          value={pet.temperament}
        />
        <input type="hidden" name={`pets[${i}].food`} value={pet.food} />
        <input
          type="hidden"
          name={`pets[${i}].favouriteTreats`}
          value={pet.favouriteTreats}
        />
        <input
          type="hidden"
          name={`pets[${i}].allergies`}
          value={pet.allergies}
        />
        <input type="hidden" name={`pets[${i}].breed`} value={pet.breed} />
        <input type="hidden" name={`pets[${i}].bio`} value={pet.bio} />
        <input
          type="hidden"
          name={`pets[${i}].avatarUrl`}
          value={pet.avatarUrl || ""}
        />
      {/each}

      <div class="flex justify-between">
        <button
          type="button"
          class="btn btn-outline rounded-full px-8"
          onclick={goToPreviousSubstep}
        >
          Back
        </button>
        <button
          type="submit"
          class="btn btn-primary rounded-full px-8"
          disabled={loading || pets.length === 0}
        >
          Continue
        </button>
      </div>
    </form>
  {/if}
</div>
