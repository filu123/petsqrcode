<script lang="ts">
  import { enhance } from "$app/forms"
  import type { Database } from "../../DatabaseDefinitions"

  let { isOpen = $bindable() } = $props()
  let loading = $state(false)

  type Pet = Database["public"]["Tables"]["pets"]["Insert"]

  let formData = $state<Partial<Pet>>({
    name: "",
    second_name: "",
    date_of_birth: "",
    gender: "",
    pet_type: "",
    temperament: "",
    food: "",
    favourite_treats: "",
    allergies: "",
    breed: "",
    bio: "",
  })

  let avatarFile: File | null = $state(null)
  let previewUrl: string | null = $state(null)

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      avatarFile = input.files[0]
      previewUrl = URL.createObjectURL(input.files[0])
    }
  }

  function closeModal() {
    isOpen = false
    formData = {
      name: "",
      second_name: "",
      date_of_birth: "",
      gender: "",
      pet_type: "",
      temperament: "",
      food: "",
      favourite_treats: "",
      allergies: "",
      breed: "",
      bio: "",
    }
    avatarFile = null
    previewUrl = null
  }

  const handleSubmit = () => {
    loading = true
    return async ({ result }) => {
      loading = false
      if (result.type === "success") {
        closeModal()
      }
    }
  }
</script>

{#if isOpen}
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold">Add New Pet</h3>
        <button class="btn btn-ghost btn-sm btn-circle" onclick={closeModal}
          >✕</button
        >
      </div>

      <form
        method="POST"
        action="/account/api?/addPet"
        use:enhance={handleSubmit}
        enctype="multipart/form-data"
      >
        <div class="grid grid-cols-2 gap-x-4 gap-y-2">
          <!-- Avatar Upload -->
          <div class="col-span-2 flex justify-center mb-4">
            <div class="avatar">
              <div
                class="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
              >
                <label class="cursor-pointer">
                  <img
                    src={previewUrl || "/images/Section.png"}
                    alt="Pet avatar"
                    class="w-full h-full object-cover"
                  />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    class="hidden"
                    onchange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <!-- Basic Information -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Pet Name*</span>
            </label>
            <input
              type="text"
              name="name"
              class="input input-bordered"
              bind:value={formData.name}
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Second Name</span>
            </label>
            <input
              type="text"
              name="second_name"
              class="input input-bordered"
              bind:value={formData.second_name}
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Date of Birth*</span>
            </label>
            <input
              type="date"
              name="date_of_birth"
              class="input input-bordered"
              bind:value={formData.date_of_birth}
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Gender*</span>
            </label>
            <select
              name="gender"
              class="select select-bordered"
              bind:value={formData.gender}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Pet Type*</span>
            </label>
            <select
              name="pet_type"
              class="select select-bordered"
              bind:value={formData.pet_type}
              required
            >
              <option value="">Select type</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Breed*</span>
            </label>
            <input
              type="text"
              name="breed"
              class="input input-bordered"
              bind:value={formData.breed}
              required
            />
          </div>

          <!-- Additional Information -->
          <div class="form-control col-span-2">
            <label class="label">
              <span class="label-text">Temperament</span>
            </label>
            <input
              type="text"
              name="temperament"
              class="input input-bordered"
              bind:value={formData.temperament}
            />
          </div>

          <div class="form-control col-span-2">
            <label class="label">
              <span class="label-text">Food Preferences</span>
            </label>
            <input
              type="text"
              name="food"
              class="input input-bordered"
              bind:value={formData.food}
            />
          </div>

          <div class="form-control col-span-2">
            <label class="label">
              <span class="label-text">Favourite Treats</span>
            </label>
            <input
              type="text"
              name="favourite_treats"
              class="input input-bordered"
              bind:value={formData.favourite_treats}
            />
          </div>

          <div class="form-control col-span-2">
            <label class="label">
              <span class="label-text">Allergies</span>
            </label>
            <input
              type="text"
              name="allergies"
              class="input input-bordered"
              bind:value={formData.allergies}
            />
          </div>

          <div class="form-control col-span-2">
            <label class="label">
              <span class="label-text">Bio</span>
            </label>
            <textarea
              name="bio"
              class="textarea textarea-bordered h-24"
              bind:value={formData.bio}
            ></textarea>
          </div>
        </div>

        <div class="modal-action">
          <button type="button" class="btn" onclick={closeModal}>Cancel</button>
          <button type="submit" class="btn btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add Pet"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
