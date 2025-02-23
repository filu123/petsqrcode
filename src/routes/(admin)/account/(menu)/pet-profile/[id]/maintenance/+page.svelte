<script lang="ts">
  import { enhance } from "$app/forms"
  import { getContext } from "svelte"

  interface PetContext {
    get: () => any
    set: (pet: any) => void
  }

  let { data } = $props()
  let maintenance = $state(data.maintenance || [])
  let isSaving = $state(false)
  let showSuccess = $state(false)
  let showAddForm = $state(false)

  let areAllHidden = $derived(
    maintenance.length > 0 && maintenance.every((item) => !item.is_public),
  )

  const { get: getSelectedPet } = getContext<PetContext>("selectedPet")
  let pet = $state(getSelectedPet())

  const frequencies = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "1_month", label: "1 Month" },
    { value: "3_months", label: "3 Months" },
    { value: "6_months", label: "6 Months" },
    { value: "year", label: "Year" },
  ]

  function toggleAddForm() {
    showAddForm = !showAddForm
  }

  const handleSubmit = () => {
    return async ({ result }: { result: any }) => {
      isSaving = true
      if (result.success) {
        maintenance = result.maintenance
        showSuccess = true
        showAddForm = false
        setTimeout(() => {
          showSuccess = false
        }, 3000)
      }
      isSaving = false
    }
  }

  const handleVisibilityToggle = () => {
    return async ({ result }: { result: any }) => {
      if (result.success) {
        maintenance = result.maintenance
        showSuccess = true
        setTimeout(() => {
          showSuccess = false
        }, 3000)
      }
    }
  }
</script>

<div>
  <div class="border-b pb-6 flex justify-between items-center">
    <div>
      <h1 class="text-xl text-[#344054] mb-1 font-bold">Maintenance</h1>
      <p class="text-[#475467] text-sm">
        You can track your pets medication, treatment and any maintenance you
        need, for example, worming, tick and flea treatments, or something as
        simple as needing their claws cutting or a groom.
      </p>
    </div>
    <button class="btn btn-primary" on:click={toggleAddForm}>
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
        Add New Entry
      {/if}
    </button>
  </div>

  <div class="space-y-6 mt-6">
    <!-- Toggle for public visibility -->
    <div class="flex items-center gap-3">
      <form
        method="POST"
        action="?/updateVisibility"
        use:enhance={handleVisibilityToggle}
      >
        <div class="form-control">
          <label class="label cursor-pointer gap-3">
            <input
              type="checkbox"
              class="toggle toggle-success"
              checked={areAllHidden}
              on:change={(e) => {
                const form = e.currentTarget.closest("form") as HTMLFormElement
                const formData = new FormData(form)
                formData.set("hideDetails", (!areAllHidden).toString())
                fetch("?/updateVisibility", {
                  method: "POST",
                  body: formData,
                })
                  .then((res) => res.json())
                  .then((result) => {
                    if (result.success) {
                      maintenance = result.maintenance
                      showSuccess = true
                      setTimeout(() => {
                        showSuccess = false
                      }, 3000)
                    }
                  })
              }}
            />
            <span class="label-text"
              >Hide these details from my pet profile</span
            >
          </label>
        </div>
      </form>
    </div>

    <!-- Maintenance List -->
    {#if maintenance.length > 0}
      {#each maintenance as item}
        <div class="bg-white p-6 rounded-xl border">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold">{item.name}</h3>
              <p class="text-gray-600">Every {item.frequency}</p>
              <p class="text-gray-600">
                Starting from {new Date(item.start_date).toLocaleDateString()}
              </p>
            </div>
            <form
              method="POST"
              action="?/deleteMaintenance"
              use:enhance={handleSubmit}
            >
              <input type="hidden" name="maintenance_id" value={item.id} />
              <button type="submit" class="btn btn-ghost btn-sm text-error">
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
            </form>
          </div>
        </div>
      {/each}
    {:else}
      <div class="text-center py-12 bg-base-200 rounded-xl">
        <h3 class="text-lg font-semibold text-gray-600">
          No maintenance records added yet
        </h3>
        <p class="text-gray-500">
          Add your first maintenance record to get started
        </p>
      </div>
    {/if}

    <!-- Add Maintenance Form -->
    {#if showAddForm}
      <form
        method="POST"
        action="?/addMaintenance"
        use:enhance={handleSubmit}
        class="bg-white p-6 rounded-xl border space-y-4"
      >
        <h3 class="font-semibold text-lg">Add New Maintenance</h3>

        <div class="">
          <div class="md:flex gap-4">
            <div>
              <label class="label">
                <span class="label-text font-medium">What*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Flea & tick treatment"
                class="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label class="label">
                <span class="label-text font-medium">Every*</span>
              </label>
              <select
                name="frequency"
                class="select select-bordered w-full"
                required
              >
                <option value="">Select frequency</option>
                {#each frequencies as frequency}
                  <option value={frequency.value}>{frequency.label}</option>
                {/each}
              </select>
            </div>
            <div>
              <label class="label">
                <span class="label-text font-medium">Starting*</span>
              </label>
              <input
                type="date"
                name="start_date"
                class="input input-bordered w-full"
                required
              />
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button
            type="submit"
            class="btn btn-primary w-full"
            disabled={isSaving}
          >
            {#if isSaving}
              <span class="loading loading-spinner"></span>
              Adding Maintenance...
            {:else}
              Add Maintenance
            {/if}
          </button>
        </div>
      </form>
    {/if}

    {#if showSuccess}
      <div class="toast toast-end">
        <div class="alert alert-success">
          <span>Maintenance added successfully!</span>
        </div>
      </div>
    {/if}
  </div>
</div>
