<script lang="ts">
  import type { Pet } from "../types"
  import PetPhotoUpload from "./PetPhotoUpload.svelte"

  let {
    petDetails,
    previewUrl,
    uploadError,
    prevStep,
    onContinue,
    onFileSelect,
  } = $props<{
    petDetails: Pet
    previewUrl: string | null
    uploadError: string | null
    prevStep: () => void
    onContinue: () => void
    onFileSelect: (file: File) => void
  }>()

  const handleFileSelect = (event: CustomEvent<File>) => {
    onFileSelect(event.detail)
  }
</script>

<div class="text-center mb-12">
  <h1 class="text-4xl font-bold text-[#14181F] mb-4">Your Pets</h1>
  <p class="text-gray-600 max-w-xl mx-auto">
    Let's get your first pet details added. You can add more pets after you've
    completed the first one.
  </p>
</div>

<form class="space-y-6">
  <PetPhotoUpload {previewUrl} {uploadError} onFileSelect={handleFileSelect} />

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="form-control">
      <label class="label">
        <span class="label-text text-[#6B7280]">Pet Name*</span>
      </label>
      <input
        type="text"
        bind:value={petDetails.petName}
        class="input input-bordered w-full bg-white"
        placeholder="Enter first name"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text text-[#6B7280]">Pet Second Name (Optional)</span
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
        class="input input-bordered w-full bg-white"
        placeholder="Select a date"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text text-[#6B7280]">Gender*</span>
      </label>
      <select
        bind:value={petDetails.gender}
        class="select select-bordered w-full bg-white"
      >
        <option value="">Pick an option</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text text-[#6B7280]">Type of Pet*</span>
      </label>
      <select
        bind:value={petDetails.petType}
        class="select select-bordered w-full bg-white"
      >
        <option value="">Select pet type</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text text-[#6B7280]">Temperament*</span>
      </label>
      <select
        bind:value={petDetails.temperament}
        class="select select-bordered w-full bg-white"
      >
        <option value="">Select type of pet</option>
        <option value="friendly">Friendly</option>
        <option value="shy">Shy</option>
        <option value="aggressive">Aggressive</option>
      </select>
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
      on:click={prevStep}
    >
      Back
    </button>
    <button
      type="button"
      class="btn btn-primary rounded-full px-8"
      on:click={onContinue}
    >
      Continue
    </button>
  </div>
</form>
