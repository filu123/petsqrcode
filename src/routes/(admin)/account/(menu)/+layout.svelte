<script lang="ts">
  import "../../../../app.css"
  import { writable } from "svelte/store"
  import { setContext } from "svelte"
  import { WebsiteName } from "../../../../config"
  import DashboardHeader from "$lib/components/DashboardHeader.svelte"
  import { selectedPetStore } from "$lib/stores/selectedPet"
  import { goto } from "$app/navigation"

  interface Props {
    data: {
      pets: any[] // Add proper type for pets
    }
    children?: import("svelte").Snippet
  }

  let { data, children }: Props = $props()
  let selectedPet = $state(data.pets?.[0])

  let openDropdownId = $state<string | null>(null)

  function toggleDropdown(petId: string, event: Event) {
    event.stopPropagation()
    openDropdownId = openDropdownId === petId ? null : petId
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (openDropdownId) {
      const target = event.target as HTMLElement
      if (!target.closest(".dropdown-menu")) {
        openDropdownId = null
      }
    }
  }

  // Make selectedPet available to child components
  setContext("selectedPet", {
    get: () => selectedPet,
    set: (pet: any) => (selectedPet = pet),
  })

  function selectPet(pet: any) {
    selectedPet = pet
    // Get the current path segments
    const pathSegments = window.location.pathname.split("/")
    const currentTab = pathSegments[pathSegments.length - 1]
    // Preserve the current tab when switching pets
    const targetPath = [
      "details",
      "contacts",
      "maintenance",
      "veterinarian",
    ].includes(currentTab)
      ? `/account/pet-profile/${pet.id}/${currentTab}`
      : `/account/pet-profile/${pet.id}/details`

    goto(targetPath, {
      invalidateAll: true,
    })
    const dropdownButton = document.querySelector(".dropdown") as HTMLElement
    dropdownButton?.blur()
  }

  const adminSectionStore = writable("")
  setContext("adminSection", adminSectionStore)
  let adminSection: string | undefined = $state()
  adminSectionStore.subscribe((value) => {
    adminSection = value
  })

  function closeDrawer(): void {
    const adminDrawer = document.getElementById(
      "admin-drawer",
    ) as HTMLInputElement
    adminDrawer.checked = false
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="h-fit">
  <DashboardHeader></DashboardHeader>
  <div class="drawer lg:drawer-open">
    <input id="admin-drawer" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content">
      <div class="navbar bg-base-100 lg:hidden">
        <div class="flex-1">
          <a class="btn btn-ghost normal-case text-xl" href="/">{WebsiteName}</a
          >
        </div>
        <div class="flex-none">
          <label for="admin-drawer" class="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
        </div>
      </div>

      <div class="container px-6 lg:px-8 py-3 lg:py-6">
        {@render children?.()}
      </div>
    </div>

    <div class="drawer-side mt-2">
      <label for="admin-drawer" class="drawer-overlay" />
      <div class="w-72 min-h-full lg:border-r border-base-200 flex flex-col">
        <!-- Pet Selection Section -->

        <!-- Navigation Menu -->
        <div class="flex-1 p-4">
          <p class="text-sm font-bold text-[#344054] mb-4">Manage</p>
          <ul class="menu menu-md gap-1">
            <li>
              <a
                href="/account"
                class={adminSection === "home"
                  ? "border rounded-lg text-[#344054] text-base font-semibold"
                  : "text-[#344054] text-base font-semibold"}
                on:click={closeDrawer}
              >
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 16H14M9.0177 1.764L2.23539 7.03912C1.78202 7.39175 1.55534 7.56806 1.39203 7.78886C1.24737 7.98444 1.1396 8.20478 1.07403 8.43905C1 8.70352 1 8.9907 1 9.56505V16.8C1 17.9201 1 18.4801 1.21799 18.908C1.40973 19.2843 1.71569 19.5903 2.09202 19.782C2.51984 20 3.07989 20 4.2 20H15.8C16.9201 20 17.4802 20 17.908 19.782C18.2843 19.5903 18.5903 19.2843 18.782 18.908C19 18.4801 19 17.9201 19 16.8V9.56505C19 8.9907 19 8.70352 18.926 8.43905C18.8604 8.20478 18.7526 7.98444 18.608 7.78886C18.4447 7.56806 18.218 7.39175 17.7646 7.03913L10.9823 1.764C10.631 1.49075 10.4553 1.35412 10.2613 1.3016C10.0902 1.25526 9.9098 1.25526 9.73865 1.3016C9.54468 1.35412 9.36902 1.49075 9.0177 1.764Z"
                    stroke="#667085"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/account/pet-profile/{selectedPet?.id}/details"
                class={adminSection === "pet_profile"
                  ? "border rounded-lg text-[#344054] text-base font-semibold"
                  : "text-[#344054] text-base font-semibold"}
                on:click={closeDrawer}
              >
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3.99998H5.8C4.11984 3.99998 3.27976 3.99998 2.63803 4.32696C2.07354 4.61458 1.6146 5.07353 1.32698 5.63801C1 6.27975 1 7.11983 1 8.79998V17.2C1 18.8801 1 19.7202 1.32698 20.362C1.6146 20.9264 2.07354 21.3854 2.63803 21.673C3.27976 22 4.11984 22 5.8 22H14.2C15.8802 22 16.7202 22 17.362 21.673C17.9265 21.3854 18.3854 20.9264 18.673 20.362C19 19.7202 19 18.8801 19 17.2V13M6.99997 16H8.67452C9.1637 16 9.40829 16 9.63846 15.9447C9.84254 15.8957 10.0376 15.8149 10.2166 15.7053C10.4184 15.5816 10.5914 15.4086 10.9373 15.0627L20.5 5.49998C21.3284 4.67156 21.3284 3.32841 20.5 2.49998C19.6716 1.67156 18.3284 1.67155 17.5 2.49998L7.93723 12.0627C7.59133 12.4086 7.41838 12.5816 7.29469 12.7834C7.18504 12.9624 7.10423 13.1574 7.05523 13.3615C6.99997 13.5917 6.99997 13.8363 6.99997 14.3255V16Z"
                    stroke="#667085"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Pet Profile
              </a>
            </li>
            <li>
              <a
                href="/account/qr-tags"
                class={adminSection === "qr_tags"
                  ? "border rounded-lg text-[#344054] text-base font-semibold"
                  : "text-[#344054] text-base font-semibold"}
                on:click={closeDrawer}
              >
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 11H10V16M1.01 11H1M6.01 16H6M10.01 20H10M19.01 11H19M1 16H2.5M13.5 11H15.5M1 20H6M10 1V7M15.6 20H17.4C17.9601 20 18.2401 20 18.454 19.891C18.6422 19.7951 18.7951 19.6422 18.891 19.454C19 19.2401 19 18.9601 19 18.4V16.6C19 16.0399 19 15.7599 18.891 15.546C18.7951 15.3578 18.6422 15.2049 18.454 15.109C18.2401 15 17.9601 15 17.4 15H15.6C15.0399 15 14.7599 15 14.546 15.109C14.3578 15.2049 14.2049 15.3578 14.109 15.546C14 15.7599 14 16.0399 14 16.6V18.4C14 18.9601 14 19.2401 14.109 19.454C14.2049 19.6422 14.3578 19.7951 14.546 19.891C14.7599 20 15.0399 20 15.6 20ZM15.6 7H17.4C17.9601 7 18.2401 7 18.454 6.89101C18.6422 6.79513 18.7951 6.64215 18.891 6.45399C19 6.24008 19 5.96005 19 5.4V3.6C19 3.03995 19 2.75992 18.891 2.54601C18.7951 2.35785 18.6422 2.20487 18.454 2.10899C18.2401 2 17.9601 2 17.4 2H15.6C15.0399 2 14.7599 2 14.546 2.10899C14.3578 2.20487 14.2049 2.35785 14.109 2.54601C14 2.75992 14 3.03995 14 3.6V5.4C14 5.96005 14 6.24008 14.109 6.45399C14.2049 6.64215 14.3578 6.79513 14.546 6.89101C14.7599 7 15.0399 7 15.6 7ZM2.6 7H4.4C4.96005 7 5.24008 7 5.45399 6.89101C5.64215 6.79513 5.79513 6.64215 5.89101 6.45399C6 6.24008 6 5.96005 6 5.4V3.6C6 3.03995 6 2.75992 5.89101 2.54601C5.79513 2.35785 5.64215 2.20487 5.45399 2.10899C5.24008 2 4.96005 2 4.4 2H2.6C2.03995 2 1.75992 2 1.54601 2.10899C1.35785 2.20487 1.20487 2.35785 1.10899 2.54601C1 2.75992 1 3.03995 1 3.6V5.4C1 5.96005 1 6.24008 1.10899 6.45399C1.20487 6.64215 1.35785 6.79513 1.54601 6.89101C1.75992 7 2.03995 7 2.6 7Z"
                    stroke="#667085"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Linked QR Tags
              </a>
            </li>
          </ul>
        </div>

        <!-- Upgrade Plan Button -->
        <!-- pet selection-->
        <div class="pb-0 border-t mx-4 pt-6 border-base-200">
          <div class="dropdown dropdown-top w-full bg-base-100 rounded-2xl p-3">
            <div
              tabindex="0"
              role="button"
              class="flex items-center gap-3 w-full cursor-pointer"
            >
              <div class="avatar">
                <div class="w-12 h-12 rounded-full">
                  <img
                    src={selectedPet?.avatar_url || "/images/Section.png"}
                    alt={selectedPet?.name}
                  />
                </div>
              </div>
              <div class="flex-1">
                <p class="font-medium">
                  {selectedPet?.name}
                  {selectedPet?.second_name}
                </p>
                <p class="text-xs text-gray-500">
                  Paaws.bio/{selectedPet?.username ||
                    selectedPet?.name?.toLowerCase()}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <ul
              tabindex="0"
              class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full mb-2"
            >
              {#each data.pets as pet}
                <li class="relative">
                  <div
                    class="flex items-center justify-between w-full p-2 hover:bg-base-200 rounded-lg"
                  >
                    <button
                      class="flex items-center gap-3"
                      on:click={() => {
                        selectPet(pet)
                        goto(`/account/pet-profile/${pet.id}/details`)
                      }}
                    >
                      <div class="avatar">
                        <div class="w-8 h-8 rounded-full">
                          <img
                            src={pet.avatar_url || "/images/Section.png"}
                            alt={pet.name}
                          />
                        </div>
                      </div>
                      <span>{pet.name}</span>
                    </button>
                    <div class="dropdown dropdown-end">
                      <button
                        tabindex="0"
                        class="btn btn-ghost btn-xs btn-circle dropdown-menu"
                        on:click={(e) => toggleDropdown(pet.id, e)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                      {#if openDropdownId === pet.id}
                        <ul
                          class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
                        >
                          <li>
                            <a
                              href="/account/pet-profile/{pet.id}/edit"
                              class="text-sm"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </a>
                          </li>
                          <li>
                            <button
                              class="text-error text-sm"
                              on:click={() => {
                                /* Add delete handler */
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </li>
                        </ul>
                      {/if}
                    </div>
                  </div>
                </li>
              {/each}
              <li>
                <a
                  href="/account/add-pet"
                  class="flex items-center gap-2 text-primary hover:bg-base-200 rounded-lg"
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
                  Add New Pet
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="p-4 pb-0">
          <button
            class="btn btn-success bg-primary w-full text-white rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clip-rule="evenodd"
              />
            </svg>
            Upgrade Plan
          </button>
        </div>

        <!-- Pet Settings -->
        <div class="p-4 pl-6">
          <a
            href="/account/settings/pets-plan"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>
            Pet Settings
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
