<script lang="ts">
  import SettingsModule from "../settings_module.svelte"
  import { enhance } from "$app/forms"
  import type { SubmitFunction } from "@sveltejs/kit"

  let showDeleteModal = $state(false)
  let deleteReason = $state("")
  let currentPassword = $state("")
  let loading = $state(false)

  const deleteReasons = [
    "No longer need the service",
    "Found a better alternative",
    "Too expensive",
    "Not satisfied with features",
    "Technical issues",
    "Other",
  ]

  function toggleDeleteModal() {
    showDeleteModal = !showDeleteModal
    if (!showDeleteModal) {
      deleteReason = ""
      currentPassword = ""
    }
  }

  const handleDelete: SubmitFunction = () => {
    loading = true
    return async ({ result }) => {
      loading = false
      if (result.type === "success") {
        showDeleteModal = false
      }
    }
  }
</script>

<div class="max-w-3xl">
  <div class="mb-8">
    <h2 class="text-2xl font-semibold text-[#101828] mb-2">Delete Account</h2>
    <p class="text-[#475467]">
      Deleting your account will also terminate all of your projects and their
      subscriptions.
    </p>
  </div>

  <!-- Delete Account Button -->
  <button class="btn btn-error btn-outline" onclick={toggleDeleteModal}>
    Delete Account
  </button>

  <!-- Delete Modal -->
  {#if showDeleteModal}
    <div class="modal modal-open">
      <div class="modal-box max-w-md">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="p-2 bg-error/10 rounded-full">
              <svg class="w-6 h-6 text-error" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 10V17M10 10V17M6 6V17.8C6 18.9201 6 19.4802 6.21799 19.908C6.40973 20.2843 6.71569 20.5903 7.09202 20.782C7.51984 21 8.07989 21 9.2 21H14.8C15.9201 21 16.4802 21 16.908 20.782C17.2843 20.5903 17.5903 20.2843 17.782 19.908C18 19.4802 18 18.9201 18 17.8V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60218 8.15224 4.23463C8.35523 3.74458 8.74458 3.35523 9.23463 3.15224C9.60218 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6448 3.74458 15.8478 4.23463C16 4.60218 16 5.06812 16 6M16 6H18M18 6H20"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Delete Profile</h3>
          </div>
          <button
            class="btn btn-ghost btn-sm btn-circle"
            onclick={toggleDeleteModal}
          >
            ✕
          </button>
        </div>

        <p class="text-sm text-gray-600 mb-6">
          Only the select profile will be deleted. Once deleted, this action
          cannot be undone and your billing will be terminated. Are you sure you
          want to continue?
        </p>

        <form
          method="POST"
          action="?/deleteAccount"
          use:enhance={handleDelete}
          class="space-y-4"
        >
          <!-- Reason Dropdown -->
          <div class="form-control w-full">
            <label class="label" for="reason">
              <span class="label-text text-gray-600"
                >Reason for deleting account</span
              >
            </label>
            <select
              class="select select-bordered w-full"
              bind:value={deleteReason}
              name="reason"
              required
            >
              <option value="">Select a reason</option>
              {#each deleteReasons as reason}
                <option value={reason}>{reason}</option>
              {/each}
            </select>
          </div>

          <!-- Password Input -->
          <div class="form-control w-full">
            <label class="label" for="currentPassword">
              <span class="label-text text-gray-600">Enter password</span>
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              class="input input-bordered w-full"
              bind:value={currentPassword}
              placeholder="Current Password"
              required
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              class="btn btn-ghost"
              onclick={toggleDeleteModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-error"
              disabled={loading || !deleteReason || !currentPassword}
            >
              {#if loading}
                <span class="loading loading-spinner"></span>
              {:else}
                Delete
              {/if}
            </button>
          </div>
        </form>
      </div>
      <div class="modal-backdrop" onclick={toggleDeleteModal}></div>
    </div>
  {/if}
</div>
