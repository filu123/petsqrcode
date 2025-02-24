<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import ReferralBanner from "./components/ReferralBanner.svelte"
  import MaintenanceCard from "./components/MaintenanceCard.svelte"
  import { enhance } from "$app/forms"

  export let data

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("home")

  let selectedPet = getContext("selectedPet")?.get()

  function handleGetStarted() {
    // Add your referral logic here
    console.log("Get started clicked")
  }
</script>

<svelte:head>
  <title>Dashboard - Paaws</title>
</svelte:head>

<div class="space-y-8">
  <h1 class="text-2xl font-bold">Dashboard</h1>

  {#if selectedPet}
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Upcoming for {selectedPet.name}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each data.maintenanceItems as item}
          <form method="POST" action="?/markComplete" use:enhance>
            <input type="hidden" name="maintenanceId" value={item.id} />
            <MaintenanceCard
              title={item.name}
              dueDate={item.due_date}
              frequency={item.frequency}
              isOverdue={new Date(item.due_date) < new Date()}
            />
          </form>
        {/each}
      </div>
    </div>
  {/if}

  <div
    class="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-5xl"
  >
    <ReferralBanner onGetStarted={handleGetStarted} />
  </div>
</div>
