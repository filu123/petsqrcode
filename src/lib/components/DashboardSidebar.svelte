<script lang="ts">
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"
  import { petStore } from "$lib/stores/petStore"
  import { selectedPetStore } from "$lib/stores/selectedPetStore"

  let { user } = $props()

  const currentPath = $derived($page.url.pathname)

  // Access the actual stores from the store objects
  const petStore_pets = petStore.pets
  const selectedPetStore_selectedPetId = selectedPetStore.selectedPetId

  // Subscribe to the values using $ prefix
  const pets = $derived($petStore_pets)
  const selectedPetId = $derived($selectedPetStore_selectedPetId)

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
    {
      path: "/dashboard/pet-profile",
      label: "Pet Profile",
      icon: "pet-profile",
    },
    {
      path: "/dashboard/linked-qr-tags",
      label: "Linked QR Tags",
      icon: "qr-tags",
    },
  ]

  function handlePetSelect(petId: string) {
    selectedPetStore.selectPet(petId, true)
  }
</script>

<div class="w-64 bg-[#F9FAFB] border-r border-[#E4E7EC] h-screen flex flex-col">
  <!-- Collapsible toggle button -->
  <div class="flex justify-end p-2">
    <button class="p-2 text-gray-500 hover:text-gray-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  </div>

  <!-- Navigation Menu -->
  <div class="px-6 py-2">
    <h2 class="text-sm font-medium text-[#344054] mb-4">Manage</h2>
    <nav class="space-y-1">
      {#each navItems as item}
        <a
          href={item.path}
          class="flex items-center py-2 px-3 rounded-lg {currentPath ===
          item.path
            ? 'bg-white shadow-sm'
            : 'hover:bg-white'}"
        >
          {#if item.icon === "dashboard"}
            <div class="w-6 h-6 mr-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                  stroke="#344054"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16.28 13.61C15.15 14.74 13.53 15.09 12.1 14.64L9.51001 17.22C9.33001 17.41 8.96001 17.53 8.69001 17.49L7.49001 17.33C7.09001 17.28 6.73001 16.9 6.67001 16.51L6.51001 15.31C6.47001 15.05 6.60001 14.68 6.78001 14.49L9.36001 11.91C8.92001 10.48 9.26001 8.86001 10.39 7.73001C12.01 6.11001 14.65 6.11001 16.28 7.73001C17.9 9.34001 17.9 11.98 16.28 13.61Z"
                  stroke="#344054"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10.45 16.28L9.59998 15.42"
                  stroke="#344054"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13.3945 10.7H13.4035"
                  stroke="#344054"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          {:else if item.icon === "pet-profile"}
            <div class="w-6 h-6 mr-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  stroke="#344054"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                  stroke="#344054"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          {:else if item.icon === "qr-tags"}
            <div class="w-6 h-6 mr-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.42004 20.6C7.22004 20.6 6.22004 20.16 5.42004 19.36C4.60004 18.56 4.18004 17.58 4.18004 16.4V15.7H6.00004V16.4C6.00004 17.04 6.20004 17.58 6.62004 18C7.04004 18.42 7.56004 18.62 8.20004 18.62H9.40004C10.0201 18.62 10.54 18.42 10.96 18C11.4 17.58 11.6 17.04 11.6 16.4V15.7C11.6 15.06 11.4 14.52 10.96 14.1C10.54 13.68 10.0201 13.48 9.40004 13.48H6.00004V6H13.4V3.4H4.18004V1.42H13.4C13.9601 1.42 14.42 1.62 14.78 2C15.16 2.36 15.36 2.8 15.36 3.4V6C15.36 6.56 15.16 7.06 14.78 7.42C14.42 7.76 13.9601 7.96 13.4 7.96H8.00004V11.52H9.40004C10.6 11.52 11.6 11.96 12.42 12.76C13.22 13.56 13.64 14.56 13.64 15.7V16.4C13.64 17.58 13.22 18.56 12.42 19.36C11.6 20.16 10.6 20.6 9.40004 20.6H8.42004Z"
                  fill="#344054"
                />
                <path d="M19.82 20.6H17.86V7.86H19.82V20.6Z" fill="#344054" />
              </svg>
            </div>
          {/if}
          <span class="text-sm font-medium text-[#344054]">{item.label}</span>
        </a>
      {/each}
    </nav>
  </div>

  <!-- Pet Selector -->
  {#if pets && pets.length > 0}
    <div class="px-6 mt-6">
      <div class="relative">
        {#each pets as pet}
          <button
            class="flex items-center w-full py-2 px-3 rounded-lg {selectedPetId ===
            pet.id
              ? 'bg-white shadow-sm'
              : 'hover:bg-white'}"
            on:click={() => handlePetSelect(pet.id)}
          >
            <div class="avatar mr-3">
              <div class="w-10 h-10 rounded-full">
                <img
                  src={pet.avatar_url || "/images/Section.png"}
                  alt={pet.name}
                />
              </div>
            </div>
            <div class="flex flex-col items-start">
              <span class="text-sm font-medium"
                >{pet.name} {pet.second_name || ""}</span
              >
              <span class="text-xs text-gray-500"
                >{pet.profile_url ||
                  `Pawws.bio/${pet.name.toLowerCase()}`}</span
              >
            </div>
            {#if selectedPetId === pet.id}
              <div class="ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8.00001 11.3333C7.20001 11.3333 6.40668 11.1333 5.7 10.7333L2.66668 12.1667C2.29335 12.3333 1.9 12.1 1.86668 11.7333C1.86668 11.6333 1.86668 11.5667 1.90001 11.4667L2.53335 9.33333C1.76668 8.4 1.36668 7.23333 1.46668 6C1.66668 3.06667 4.10001 0.733333 7.06668 0.666667C10.8 0.566667 13.9333 3.7 13.9333 7.43333C13.9333 9.53333 12.8667 11.3667 11.1333 12.4667C10.2 12.0667 9.10001 11.3333 8.00001 11.3333Z"
                    fill="#7DD959"
                  />
                </svg>
              </div>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Upgrade Plan Button -->
  <div class="px-6 mt-auto mb-4">
    <button
      class="btn btn-success w-full flex items-center justify-center gap-2 text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M9.99984 1.66675L12.5748 7.09175L18.3332 7.83341L14.1665 12.0751L15.1498 18.3334L9.99984 15.3459L4.84984 18.3334L5.83317 12.0751L1.6665 7.83341L7.42484 7.09175L9.99984 1.66675Z"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Upgrade Plan
    </button>
  </div>

  <!-- Pet Settings Button -->
  <div class="px-6 mb-6">
    <a
      href="/dashboard/pet-settings"
      class="flex items-center py-2 px-3 rounded-lg hover:bg-white"
    >
      <div class="w-6 h-6 mr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke="#344054"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"
            stroke="#344054"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <span class="text-sm font-medium text-[#344054]">Pet Settings</span>
    </a>
  </div>
</div>
