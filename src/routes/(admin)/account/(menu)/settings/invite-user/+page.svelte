<script lang="ts">
  import { enhance } from "$app/forms"
  import { page } from "$app/stores"

  let { data } = $props()
  let showInviteForm = $state(false)

  function toggleInviteForm() {
    showInviteForm = !showInviteForm
  }
</script>

<div class="max-w-4xl">
  <div class="flex justify-between items-start mb-6">
    <div>
      <h2 class="text-2xl font-semibold text-[#101828] mb-2">
        Invite Family and Friends
      </h2>
      <p class="text-[#475467]">
        You can invite family and friends to manage and view {data.petName}'s
        profile.
        {#if data.inviteCount}
          You have invite {data.inviteCount}/1 of your plans users. Please
          <a
            href="/account/settings/pets-plan"
            class="text-success hover:underline">upgrade</a
          > to invite more.
        {/if}
      </p>
    </div>

    <button class="btn btn-success text-white" on:click={toggleInviteForm}>
      <svg
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5V19M5 12H19"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Invite New User
    </button>
  </div>

  {#if showInviteForm}
    <div class="card bg-base-100 shadow-sm border mb-8">
      <div class="card-body">
        <h3 class="card-title text-lg mb-4">Invite New User</h3>
        <form
          method="POST"
          action="?/inviteUser"
          use:enhance
          class="space-y-4 max-w-md"
        >
          <div class="form-control w-full">
            <label class="label" for="email">
              <span class="label-text">Email address</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              class="input input-bordered w-full"
              placeholder="Enter their email"
            />
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="btn btn-ghost"
              on:click={toggleInviteForm}
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-success text-white">
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Users List -->
  <div class="card bg-base-100 shadow-sm border">
    <div class="card-body p-0">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr class="bg-base-200/50">
              <th>User</th>
              <th class="text-right">Role</th>
            </tr>
          </thead>
          <tbody>
            {#each data.users as user}
              <tr class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar placeholder">
                      <div
                        class="bg-neutral text-neutral-content rounded-full w-8"
                      >
                        <span class="text-xs">{user.initials}</span>
                      </div>
                    </div>
                    <div>
                      <div class="font-medium">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td class="text-right">
                  <div class="flex items-center justify-end gap-2">
                    <span
                      class="badge {user.role === 'Primary Owner'
                        ? 'badge-neutral'
                        : user.role === 'Pending Invitation'
                          ? 'badge-warning'
                          : 'badge-ghost'}"
                    >
                      {user.role}
                    </span>
                    {#if user.role !== "Primary Owner"}
                      <form
                        method="POST"
                        action="?/removeUser"
                        use:enhance
                        class="ml-2"
                      >
                        <input type="hidden" name="userId" value={user.id} />
                        <button
                          type="submit"
                          class="btn btn-ghost btn-sm btn-square text-error"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </form>
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
