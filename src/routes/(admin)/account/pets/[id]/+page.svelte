<script lang="ts">
  import { format } from "date-fns"
  import { page } from "$app/stores"

  let { data } = $props()
  let { pet } = data

  const formattedDOB = format(new Date(pet.date_of_birth), "MMMM do, yyyy")

  // Filter public contacts and limit to 2
  const publicContacts = $derived(
    pet.pet_contacts
      ?.filter((contact) => contact.is_public)
      .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
      .slice(0, 2) || [],
  )

  // Get public veterinarian if available
  const publicVeterinarian = $derived(
    pet.pet_veterinarian?.length > 0 && pet.pet_veterinarian[0].is_public
      ? pet.pet_veterinarian[0]
      : null,
  )

  // Get upcoming maintenance events
  const upcomingEvents = $derived(
    pet.pet_maintenance
      ?.filter((maintenance) => maintenance.is_public)
      .map((maintenance) => ({
        title: maintenance.name,
        status: `Due ${getMaintenanceStatus(maintenance.start_date, maintenance.frequency)}`,
        type: "maintenance",
      })) || [],
  )

  function getMaintenanceStatus(startDate: string, frequency: string) {
    const date = new Date(startDate)
    // Add basic formatting logic here
    return format(date, "do MMMM")
  }
</script>

<svelte:head>
  <title>{pet.name}'s Profile - Paaws</title>
</svelte:head>

<div class="min-h-screen">
  <!-- Hero Section -->
  <div class="bg-gradient-to-r from-primary to-primary-focus h-64 relative">
    <div class="container mx-auto px-4">
      <div class="absolute -bottom-20 flex items-end gap-6">
        <div
          class="w-32 h-32 rounded-full border-4 border-primary overflow-hidden bg-white"
        >
          {#if pet.avatar_url}
            <img
              src={pet.avatar_url}
              alt={pet.name}
              class="w-full h-full object-cover"
            />
          {:else}
            <div
              class="w-full h-full bg-gray-200 flex items-center justify-center"
            >
              <svg
                class="w-12 h-12 text-gray-400"
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
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-error leading-[38px]">
            {pet.name}
            {pet.second_name || ""}
          </h1>
          <p class="text-error mt-1">
            If I am lost, please share my location or contact my owner.
          </p>
        </div>
        <div class="flex gap-2 self-end">
          <button class="btn rounded-full btn-outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Call Owner
          </button>
          <button class="btn rounded-full btn-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Share Location
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container mx-auto px-4">
    <!-- First Row -->
    <div
      class="grid grid-cols-1 border-[#EAECF0] pt-[32px] border-t md:grid-cols-3 gap-12 mt-[118px] mb-12"
    >
      <!-- Bio -->
      <div>
        <h2 class="text-sm text-info mb-1">Bio</h2>
        <p class="text-error">
          {pet.bio ||
            `Poppy is a fluffy bundle of joy with a heart as big as her curls! She loves belly rubs, zoomies in the park, and sneaking extra treats when no one's looking. Whether she's showing off her fancy Dachshund strut or snuggling up for a cozy nap, Poppy brings endless love and laughter 🐾`}
        </p>
      </div>

      <!-- Details -->
      <div class="space-y-6">
        <div>
          <h2 class="text-sm text-info mb-1">Where I live</h2>
          <p class="text-error">
            {pet.profiles.address}, {pet.profiles.country}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <h2 class="text-sm text-info mb-1">I'm a</h2>
            <p class="text-error">{pet.gender || "Girl"}</p>
          </div>
          <div>
            <h2 class="text-sm text-info mb-1">Breed</h2>
            <p class="text-error">{pet.breed || "No breed selected"}</p>
          </div>
        </div>

        <div>
          <h2 class="text-sm text-info mb-1">Allergies</h2>
          <p class="text-error">{pet.allergies || "None"}</p>
        </div>

        <div>
          <h2 class="text-sm text-info mb-1">Temperament</h2>
          <p class="text-error">
            {pet.temperament || "Loves dogs, loves humans"}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <h2 class="text-sm text-info mb-1">Food Brand</h2>
            <p class="text-error">{pet.food || "Bakers"}</p>
          </div>
          <div>
            <h2 class="text-sm text-info mb-1">Treats</h2>
            <p class="text-error">
              {pet.favourite_treats || "Bakers Bacon Swirls"}
            </p>
          </div>
        </div>
      </div>

      <!-- Upcoming -->
      <div>
        <h2 class="text-sm text-info mb-4">Upcoming for {pet.name}</h2>
        <div class="space-y-4">
          {#each upcomingEvents as event}
            <div class="grid justify-between items-center">
              <span class="text-sm text-info mb-1">{event.status}</span>
              <span class="text-error">{event.title}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Vets Section -->
    <!-- Vets Section -->
    <div class="mb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-14">
        <!-- Vets Section -->
        {#if publicVeterinarian}
          <div class="col-span-1">
            <h2 class="text-sm text-info mb-6">{pet.name}'s Registered Vets</h2>
            <div class="bg-white p-6 rounded-xl border border-base-200 mb-4">
              <div class="space-y-1">
                <p class="text-sm text-error font-medium">
                  {publicVeterinarian.address}
                </p>
                <p class="text-sm text-error">
                  {publicVeterinarian.phone_number}
                </p>
                <p class="text-sm text-error">{publicVeterinarian.email}</p>
              </div>
            </div>
          </div>
        {/if}

        <!-- Contacts Section -->
        {#if publicContacts.length > 0}
          <div class="">
            <h2 class="text-sm text-info mb-6">More contacts for {pet.name}</h2>
            <div class="flex gap-4">
              {#each publicContacts as contact}
                <div
                  class="bg-white p-6 rounded-xl border border-base-200 mb-4"
                >
                  <h3 class="text-[#344054] font-bold text-sm mb-2">
                    {contact.full_name}
                    {#if contact.is_primary}
                      <div
                        class="text-xs text-[#039855] bg-[#ECFDF3] px-2 py-0.5 rounded-full inline-block mt-1"
                      >
                        Primary Contact
                      </div>
                    {/if}
                  </h3>
                  <div class="space-y-1">
                    <p class="text-sm text-error font-medium">
                      {contact.address}
                    </p>
                    <p class="text-sm text-error">{contact.phone_number}</p>
                    <p class="text-sm text-error">{contact.email}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Photos Section -->
    <div class="mb-12">
      <h2 class="text-lg font-semibold mb-6">More photos of {pet.name}</h2>
      <div class="relative">
        <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {#each Array(5) as _, i}
            <img
              src="/images/Section.png"
              alt="{pet.name}'s photo"
              class="w-64 h-64 object-cover rounded-lg flex-none"
            />
          {/each}
        </div>
        <div class="flex justify-between mt-4">
          <button class="btn btn-circle btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button class="btn btn-circle btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-white py-8 mt-12">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <div class="flex items-center space-x-4 mb-4 md:mb-0">
          <img src="/images/madewithtag.png" alt="Paaws" class="h-8" />
        </div>
        <div class="flex space-x-6">
          <a href="#" class="text-sm text-gray-600 hover:text-gray-900"
            >Join {pet.name} on Paaws</a
          >
          <a href="#" class="text-sm text-gray-600 hover:text-gray-900"
            >Visit Paaws</a
          >
          <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Help</a>
        </div>
      </div>
      <div
        class="border-t pt-8 flex flex-col md:flex-row justify-between items-center"
      >
        <p class="text-sm text-error mb-4 md:mb-0">
          © 2024 Paaws. All rights reserved.
        </p>
        <div class="flex space-x-6">
          <a href="#" class="text-sm text-error hover:text-gray-900">Terms</a>
          <a href="#" class="text-sm text-error hover:text-gray-900">Privacy</a>
          <a href="#" class="text-sm text-error hover:text-gray-900">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</div>
