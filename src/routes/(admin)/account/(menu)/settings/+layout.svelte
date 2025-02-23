<script lang="ts">
  import { page } from "$app/stores"

  let tabs = $derived([
    {
      id: "pets-plan",
      label: "Pets Plan",
      icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.5 16.5L19.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M9 14.5L9 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M4.5 12.5L4.5 6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M14.5 18.5L14.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`,
      href: "/account/settings/pets-plan",
    },
    {
      id: "invite-user",
      label: "Invite User",
      icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M19 21V15M16 18H22M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
      href: "/account/settings/invite-user",
    },
    {
      id: "billing",
      label: "Billing",
      icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 10H2M22 11V8.2C22 7.0799 22 6.51984 21.782 6.09202C21.5903 5.71569 21.2843 5.40973 20.908 5.21799C20.4802 5 19.9201 5 18.8 5H5.2C4.0799 5 3.51984 5 3.09202 5.21799C2.71569 5.40973 2.40973 5.71569 2.21799 6.09202C2 6.51984 2 7.0799 2 8.2V15.8C2 16.9201 2 17.4802 2.21799 17.908C2.40973 18.2843 2.71569 18.5903 3.09202 18.782C3.51984 19 4.07989 19 5.2 19H18.8C19.9201 19 20.4802 19 20.908 18.782C21.2843 18.5903 21.5903 18.2843 21.782 17.908C22 17.4802 22 16.9201 22 15.8V11ZM6 15H10V17H6V15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
      href: "/account/billing/manage",
      target: "_blank",
    },
    {
      id: "refer",
      label: "Refer a Friend",
      icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 18L18 20L22 16M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
      href: "/account/settings/refer",
    },
    {
      id: "profile",
      label: "Manage Profile",
      icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C8.8299 15 6.01077 16.5306 4.21597 18.906C3.82968 19.4172 3.63653 19.6728 3.64285 20.0183C3.64773 20.2852 3.81533 20.6219 4.02534 20.7867C4.29716 21 4.67384 21 5.4272 21H18.5728C19.3262 21 19.7028 21 19.9747 20.7867C20.1847 20.6219 20.3523 20.2852 20.3571 20.0183C20.3635 19.6728 20.1703 19.4172 19.784 18.906C17.9892 16.5306 15.1701 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
      href: "/account/settings/profile",
    },
  ])

  let currentTab = $derived(
    tabs.find((tab) => $page.url.pathname.includes(tab.id)) || tabs[0],
  )
</script>

<div class="container mx-auto px-4 py-6">
  <!-- Header -->
  <div class="flex items-center gap-4 mb-8">
    <h1 class="text-2xl font-semibold text-[#101828]">Settings</h1>
  </div>

  <!-- Navigation Tabs -->
  <div class="flex gap-1 bg-base-200 p-1 rounded-xl mb-6 w-fit">
    {#each tabs as tab}
      <a
        href={tab.href}
        class="flex items-center gap-2 px-4 py-2 rounded-full {$page.url.pathname.includes(
          tab.id,
        )
          ? 'bg-white text-[#344054] font-medium'
          : 'text-gray-500 hover:bg-white/50'}"
      >
        {@html tab.icon}
        {tab.label}
      </a>
    {/each}
  </div>

  <!-- Content -->
  <div class="mt-6">
    <slot />
  </div>
</div>
