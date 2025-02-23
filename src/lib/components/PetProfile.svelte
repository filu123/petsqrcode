<script lang="ts">
  import { format } from "date-fns"

  let { pet, isPreview = false } = $props()

  let formattedDOB = $derived(
    pet.date_of_birth
      ? format(new Date(pet.date_of_birth), "MMMM do, yyyy")
      : null,
  )

  // Filter public contacts and limit to 2
  let publicContacts = $derived(
    pet.pet_contacts
      ?.filter((contact) => contact.is_public)
      .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
      .slice(0, 2) || [],
  )

  // Get public veterinarian if available
  let publicVeterinarian = $derived(
    pet.pet_veterinarian?.length > 0 && pet.pet_veterinarian[0].is_public
      ? pet.pet_veterinarian[0]
      : null,
  )
  console.log(pet)
  // Get upcoming maintenance events
  let upcomingEvents = $derived(
    pet.pet_maintenance
      ?.filter((maintenance) => maintenance.is_public)
      .map((maintenance) => ({
        title: maintenance.name,
        status: `Due ${format(new Date(maintenance.start_date), "do MMMM")}`,
        type: "maintenance",
      })) || [],
  )
</script>

<div class="bg-[#7DD959] h-40" />

<div class="px-4 -mt-16">
  <!-- Profile Section -->
  <div class="flex flex-col gap-4">
    <div
      class="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white"
    >
      <img
        src={pet.avatar_url || "/images/Section.png"}
        alt={pet.name}
        class="w-full h-full object-cover"
      />
    </div>
    <div>
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold">{pet.name}</h1>
        <span class="badge badge-success text-xs">Dog</span>
      </div>
      <p class="text-gray-600 mt-1">
        If I am lost, please share my location or contact my owner.
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2">
      <button class="btn btn-outline flex-1 normal-case rounded-full">
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
      <button
        class="btn btn-success flex-1 normal-case rounded-full text-white"
      >
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

  <!-- Info Sections -->
  <div class="space-y-6 mt-8">
    <div>
      <h2 class="text-sm text-gray-500">Where I live</h2>
      <p class="text-gray-700">
        {pet.profiles?.address ||
          "22 Example Avenue, Islington, London, Greater London, N1 2LY"}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-x-8">
      <div>
        <h2 class="text-sm text-gray-500">I'm a</h2>
        <p class="text-gray-700">{pet.gender || "Girl"}</p>
      </div>
      <div>
        <h2 class="text-sm text-gray-500">Breed</h2>
        <p class="text-gray-700">{pet.breed || "Dachshund"}</p>
      </div>
    </div>

    <div>
      <h2 class="text-sm text-gray-500">Allergies</h2>
      <p class="text-gray-700">{pet.allergies || "Nuts, dairy"}</p>
    </div>

    <div>
      <h2 class="text-sm text-gray-500">Temperament</h2>
      <p class="text-gray-700">
        {pet.temperament || "Loves dogs, loves humans"}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-x-8">
      <div>
        <h2 class="text-sm text-gray-500">Favourite Food Brand</h2>
        <p class="text-gray-700">{pet.food || "Bakers"}</p>
      </div>
      <div>
        <h2 class="text-sm text-gray-500">Favourite Treats</h2>
        <p class="text-gray-700">
          {pet.favourite_treats || "Bakers Bacon Swirls"}
        </p>
      </div>
    </div>

    <div class="py-6 border-b border-t">
      <h2 class="text-sm text-gray-500">Bio</h2>
      <p class="text-gray-700">
        {pet.bio ||
          "Poppy is a fluffy bundle of joy with a heart as big as her curls! She loves belly rubs, zoomies in the park, and sneaking extra treats when no one's looking. Whether she's showing off her fancy Dachshund strut or snuggling up for a cozy nap, Poppy brings endless love and laughter 🐾✨"}
      </p>
    </div>

    {#if upcomingEvents.length > 0}
      <div class="pb-6 border-b">
        <h2 class="text-sm text-gray-500">Upcoming for {pet.name}</h2>
        <div class="space-y-2 mt-2">
          {#each upcomingEvents as event}
            <div>
              <p class="text-gray-500 text-sm">{event.status}</p>
              <p class="text-gray-700">{event.title}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if publicVeterinarian}
      <div class="pb-10">
        <h2 class="text-sm text-gray-500">{pet.name}'s Registered Vets</h2>
        <div class="mt-2 space-y-1">
          <p class="text-gray-700">{publicVeterinarian.address}</p>
          <p class="text-gray-700">{publicVeterinarian.phone_number}</p>
          <p class="text-gray-700">{publicVeterinarian.email}</p>
        </div>
      </div>
    {/if}
  </div>

  <!-- Contacts Section -->
  {#if publicContacts.length > 0}
    <div class="pb-10">
      <h2 class="text-sm text-gray-500">More contacts for {pet.name}</h2>
      <div class="mt-2 space-y-4">
        {#each publicContacts as contact}
          <div>
            <div class="flex items-center gap-2">
              <p class="text-gray-700 font-medium">{contact.full_name}</p>
              {#if contact.is_primary}
                <span
                  class="text-xs text-[#039855] bg-[#ECFDF3] px-2 py-0.5 rounded-full"
                >
                  Primary Contact
                </span>
              {/if}
            </div>
            <div class="space-y-1 mt-1">
              <p class="text-gray-700">{contact.address}</p>
              <p class="text-gray-700">{contact.phone_number}</p>
              <p class="text-gray-700">{contact.email}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Maintenance Events -->
</div>
