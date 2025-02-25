<script lang="ts">
  import { petStore } from "$lib/stores/petStore"
  import { selectedPetStore } from "$lib/stores/selectedPetStore"
  import { userStore } from "$lib/stores/userStore"
  import { onMount } from "svelte"
  import DashboardHeader from "$lib/components/DashboardHeader.svelte"

  let { data, children } = $props()

  onMount(async () => {
    // Load pets if not already loaded
    if (!petStore.hasPets) {
      await petStore.loadUserPets()
    }
  })

  function handlePetSelect(petId: string) {
    selectedPetStore.selectPet(petId, true)
  }
</script>

<div class="flex flex-col min-h-screen bg-[#F9FAFB]">
  <!-- Header -->
  <DashboardHeader />

  <div class="flex flex-1">
    <!-- Sidebar -->
    <div class="w-64 bg-white border-r border-base-200 min-h-screen">
      <div class="p-4">
        <h2 class="text-sm font-medium text-gray-500">Manage</h2>
        <nav class="mt-2 space-y-1">
          <a
            href="/dashboard"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-base-200 {$page
              ?.url.pathname === '/dashboard'
              ? 'bg-base-200 text-primary'
              : 'text-gray-700'}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
              />
            </svg>
            Dashboard
          </a>

          <!-- Pet Selector - Show if user has pets -->
          {#if petStore.hasPets}
            <div class="mt-4">
              <h2 class="text-sm font-medium text-gray-500 px-4 mb-2">
                My Pets
              </h2>
              <div class="space-y-1">
                {#each petStore.pets as pet}
                  <button
                    class="flex items-center px-4 py-2 text-sm font-medium rounded-lg w-full text-left hover:bg-base-200 {selectedPetStore.selectedPetId ===
                    pet.id
                      ? 'bg-base-200 text-primary'
                      : 'text-gray-700'}"
                    on:click={() => handlePetSelect(pet.id)}
                  >
                    <div
                      class="w-8 h-8 rounded-full overflow-hidden mr-3 bg-base-200 flex-shrink-0"
                    >
                      {#if pet.avatar_url}
                        <img
                          src={pet.avatar_url}
                          alt={pet.name}
                          class="w-full h-full object-cover"
                        />
                      {:else}
                        <div
                          class="w-full h-full flex items-center justify-center text-gray-400"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                      {/if}
                    </div>
                    <div class="flex-1 truncate">{pet.name}</div>
                  </button>
                {/each}

                <a
                  href="/dashboard/pets/add-pet"
                  class="flex items-center px-4 py-2 text-sm font-medium text-primary rounded-lg hover:bg-base-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Add New Pet
                </a>
              </div>
            </div>
          {/if}

          <a
            href="/dashboard/linked-qr-tags"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-base-200 {$page?.url.pathname.includes(
              '/linked-qr-tags',
            )
              ? 'bg-base-200 text-primary'
              : 'text-gray-700'}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z"
                clip-rule="evenodd"
              />
              <path
                d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z"
              />
            </svg>
            Linked QR Tags
          </a>
        </nav>
      </div>

      <!-- User profile section at bottom of sidebar -->
      <div class="absolute bottom-0 w-64 p-4 border-t">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-base-200 overflow-hidden mr-3">
            {#if data.profile?.avatar_url}
              <img
                src={data.profile.avatar_url}
                alt="Profile"
                class="w-full h-full object-cover"
              />
            {:else}
              <div
                class="w-full h-full flex items-center justify-center text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            {/if}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {userStore.userFullName || "User"}
            </p>
            <a
              href="/dashboard/settings"
              class="text-xs text-gray-500 hover:text-primary"
            >
              Settings
            </a>
          </div>
          <button
            class="ml-2 text-gray-400 hover:text-gray-500"
            on:click={() => userStore.signOut()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 p-8">
      {@render children?.()}
    </div>
  </div>
</div>
