<script lang="ts">
  import { page } from "$app/stores"
  import PetProfile from "$lib/components/PetProfile.svelte"
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import { onMount } from "svelte"

  interface PetContext {
    get: () => any
    set: (pet: any) => void
  }

  let { data } = $props()
  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("pet_profile")

  const { get: getSelectedPet, set: setSelectedPet } =
    getContext<PetContext>("selectedPet")
  let selectedPet = $state(getSelectedPet())

  // Update selected pet when URL param changes
  $effect(() => {
    if (data.pet && (!selectedPet || selectedPet.id !== data.pet.id)) {
      setSelectedPet(data.pet)
      selectedPet = data.pet
    }
  })

  // Get the current pet ID from the URL
  let currentPetId = $derived($page.params.id)

  const tabs = $derived([
    {
      id: "details",
      label: "Pet Details",
      href: `/account/pet-profile/${currentPetId}/details`,
      title: "Pet Profile",
    },
    {
      id: "contacts",
      label: "Contacts",
      href: `/account/pet-profile/${currentPetId}/contacts`,
      title: "Contacts",
    },
    {
      id: "maintenance",
      label: "Maintenance",
      href: `/account/pet-profile/${currentPetId}/maintenance`,
      title: "Maintenance",
    },
    {
      id: "veterinarian",
      label: "Veterinarian",
      href: `/account/pet-profile/${currentPetId}/veterinarian`,
      title: "Veterinarian",
    },
  ])

  let currentTab = $derived(
    tabs.find((tab) => $page.url.pathname.includes(tab.id)) || tabs[0],
  )

  function copyProfileUrl() {
    navigator.clipboard.writeText(
      `Paaws.bio/${selectedPet?.name?.toLowerCase()}`,
    )
  }
</script>

<!-- Rest of the template remains the same -->

<div class="container mx-auto px-4 py-6">
  <!-- Header Section -->
  <div class="md:flex justify-between items-center mb-8">
    <h1 class="text-2xl font-semibold text-[#101828]">
      {currentTab.title}
    </h1>
    <div class="flex items-center gap-4">
      <button class="btn btn-ghost btn-sm normal-case gap-2">
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
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        Customize Page
      </button>
      <div class="join">
        <div class="join-item bg-base-200 px-3 py-1 text-sm">
          Paaws.bio/{selectedPet?.name?.toLowerCase()}
        </div>
        <button
          class="btn btn-ghost btn-sm join-item"
          on:click={copyProfileUrl}
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
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy
        </button>
      </div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="flex gap-1 bg-base-200 p-1 rounded-xl mb-6 w-fit">
    {#each tabs as tab}
      <a
        href={tab.href}
        class="px-4 py-2 rounded-full {$page.url.pathname.includes(tab.id)
          ? 'bg-white text-[#344054] font-medium'
          : 'text-gray-500 hover:bg-white/50'}"
      >
        {tab.label}
      </a>
    {/each}
  </div>

  <!-- Content Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
    <!-- Left Column - Dynamic Form Content -->
    <div class="space-y-6">
      <slot />
    </div>

    <!-- Right Column - Preview (Fixed) -->
    <div class="bg-white rounded-lg sticky top-8">
      <h2 class="text-lg font-semibold p-4 bg-white sticky top-0 z-10 border-b">
        Preview
      </h2>
      <div
        class="border-2 border-base-300 rounded-lg h-[calc(71vh-8rem)] overflow-auto"
      >
        <PetProfile pet={selectedPet} isPreview={true} />
      </div>
    </div>
  </div>
</div>
