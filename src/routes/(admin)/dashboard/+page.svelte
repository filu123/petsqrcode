<script lang="ts">
  import { selectedPetStore } from "$lib/stores/selectedPetStore"
  import { onMount } from "svelte"

  // Get the store from the selectedPetStore object
  const selectedPetStore_selectedPet = selectedPetStore.selectedPet

  // Sample data for demonstration
  const tasks = [
    {
      title: "Link your QR code",
      description: "Link your pets QR code so that it links to their profile.",
      action: "Mark as Complete",
    },
    {
      title: "Complete Profile",
      description: "Go to profile page and add more details for your pet.",
      action: "Mark as Complete",
    },
    {
      title: "Add Pet Contacts",
      description:
        "Add more contacts for your pet to add another level of security.",
      action: "Mark as Complete",
    },
  ]

  const maintenanceTasks = [
    {
      title: "Tick and Flee Treatment",
      status: "Due 3 days ago.",
      frequency: "Every month",
      action: "Mark as Complete",
    },
    {
      title: "Worming",
      status: "Due on the 17th January 2025.",
      frequency: "Every month",
      action: "Mark as Complete",
    },
    {
      title: "Groomers",
      status: "Due on the 25th January 2025.",
      frequency: "Every 2 months",
      action: "Mark as Complete",
    },
  ]
</script>

<div class="max-w-5xl mx-auto">
  <!-- Pet Header Section -->
  {#if $selectedPetStore_selectedPet}
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <div class="avatar">
          <div class="w-16 h-16 rounded-full">
            <img
              src={$selectedPetStore_selectedPet.avatar_url ||
                "/images/Section.png"}
              alt={$selectedPetStore_selectedPet.name}
            />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-semibold">
              {$selectedPetStore_selectedPet.name}
              {$selectedPetStore_selectedPet.second_name || ""}
            </h1>
            <span class="badge badge-primary text-xs py-1 px-2">Pro Plan</span>
          </div>
          <p class="text-sm text-gray-500">
            Pawws.bio/{$selectedPetStore_selectedPet.name.toLowerCase()}
          </p>
        </div>
      </div>
      <button class="btn btn-success text-white rounded-full px-6"
        >View Profile</button
      >
    </div>
  {/if}

  <!-- Upcoming Tasks Section -->
  <h2 class="text-xl font-semibold mt-8 mb-4">
    Upcoming for {$selectedPetStore_selectedPet?.name || "Your Pet"}
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    {#each tasks as task}
      <div class="bg-[#FFFCF5] rounded-lg p-5 border border-[#FEDF89]">
        <h3 class="font-medium mb-2">{task.title}</h3>
        <p class="text-sm text-gray-600 mb-4">{task.description}</p>
        <button class="btn btn-sm btn-outline rounded-md">{task.action}</button>
      </div>
    {/each}
  </div>

  <!-- Maintenance Section -->
  <h2 class="text-xl font-semibold mt-8 mb-4">
    Upcoming for {$selectedPetStore_selectedPet?.name || "Your Pet"}
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    {#each maintenanceTasks as task}
      <div class="bg-white rounded-lg p-5 border border-gray-200">
        <h3 class="font-medium mb-1">{task.title}</h3>
        <p class="text-sm text-red-500 mb-1">{task.status}</p>
        <p class="text-sm text-gray-600 mb-4">{task.frequency}</p>
        <button class="btn btn-sm btn-outline rounded-md">{task.action}</button>
      </div>
    {/each}
  </div>

  <!-- Share Section -->
  <div class="bg-[#72CC50] text-white rounded-lg p-6 mt-8">
    <h2 class="text-xl font-semibold mb-2">
      Share Pawws with a somebody you know...
    </h2>
    <p class="mb-4">Refer other pet owners and give them a free tag.</p>
    <button class="btn bg-white text-[#72CC50] hover:bg-gray-100 border-none"
      >Get started</button
    >
  </div>
</div>
