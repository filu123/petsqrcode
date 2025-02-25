<script lang="ts">
  import DashboardHeader from "$lib/components/DashboardHeader.svelte"
  import DashboardSidebar from "$lib/components/DashboardSidebar.svelte"
  import { userStore } from "$lib/stores/userStore"
  import { petStore } from "$lib/stores/petStore"
  import { selectedPetStore } from "$lib/stores/selectedPetStore"
  import { onMount } from "svelte"

  let { data, children } = $props()

  onMount(async () => {
    // Make sure pets are loaded
    if (!$petStore.hasPets) {
      await petStore.loadUserPets()

      // Select first pet if none selected
      if ($petStore.pets.length > 0) {
        selectedPetStore.selectFirstPetIfNoneSelected()
      }
    }
  })
</script>

<!-- New feature announcement banner -->
<div
  class="bg-[#72CC50] text-white py-3 px-4 flex items-center justify-center relative"
>
  <div class="flex items-center gap-2">
    <span>✨ We've just launched a new feature! Check out the</span>
    <a href="/dashboard" class="underline font-medium">new dashboard</a>
    <span>.</span>
  </div>
  <button class="absolute right-4 text-white">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M15 5L5 15M5 5L15 15"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</div>

<div class="flex min-h-screen bg-[#F9FAFB]">
  <!-- Sidebar -->
  <DashboardSidebar user={data.user} />

  <!-- Main Content -->
  <div class="flex-1 flex flex-col">
    <!-- Header -->
    <DashboardHeader />

    <!-- Content Area -->
    <div class="flex-1 overflow-auto p-6">
      {@render children?.()}
    </div>
  </div>
</div>
