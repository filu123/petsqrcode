<script lang="ts">
  import type { Pet } from "../types"

  let { pets, onEdit, onDelete, onAddNew, onContinue } = $props<{
    pets: Pet[]
    onEdit: (index: number) => void
    onDelete: (index: number) => void
    onAddNew: () => void
    onContinue: () => void
  }>()
</script>

<div class="text-center mb-12">
  <h1 class="text-4xl font-bold text-[#14181F] mb-4">Your Pets</h1>
  <p class="text-gray-600 max-w-xl mx-auto">
    Congrats on adding a pet. You can easily add more pets or continue.
  </p>
</div>

{#each pets as pet, i}
  <div class="bg-white rounded-lg border p-6 mb-4">
    <!-- Pet card content -->
    <div class="flex items-center gap-4">
      {#if pet.avatarUrl}
        <img
          src={pet.avatarUrl}
          alt={pet.petName}
          class="w-16 h-16 rounded-full object-cover"
        />
      {:else}
        <!-- Default avatar SVG -->
      {/if}
      <div class="flex-1">
        <h3 class="text-lg font-medium">{pet.petName} {pet.petSecondName}</h3>
        <p class="text-gray-600">{pet.petType}</p>
      </div>
      <div class="flex gap-2">
        <button
          class="text-primary hover:text-primary-dark"
          onclick={() => onEdit("edit", i)}
        >
          Edit
        </button>
        <button
          class="text-red-500 hover:text-red-700"
          onclick={() => onDelete("delete", i)}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
{/each}

<button
  class="btn btn-outline gap-2 w-full mb-8"
  onclick={() => onAddNew("addNew")}
>
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
