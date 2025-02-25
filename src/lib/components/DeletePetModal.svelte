<script lang="ts">
  import { enhance } from "$app/forms"

  let {
    isOpen = $bindable(),
    petId = $bindable(),
    petName = $bindable(),
  } = $props()
  let loading = $state(false)

  function closeModal() {
    isOpen = false
  }

  const handleSubmit = () => {
    loading = true
    return async ({ result }) => {
      loading = false
      if (result.type === "success") {
        closeModal()
      }
    }
  }
</script>

{#if isOpen}
  <div class="modal modal-open">
    <div class="modal-box">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold">Delete Pet Profile</h3>
        <button class="btn btn-ghost btn-sm btn-circle" onclick={closeModal}
          >✕</button
        >
      </div>

      <form
        method="POST"
        action="/dashboard/api?/deletePet"
        use:enhance={handleSubmit}
      >
        <input type="hidden" name="petId" value={petId} />

        <div class="space-y-4">
          <p class="text-gray-600">
            Are you sure you want to delete {petName}'s profile? This action
            cannot be undone.
          </p>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Please type "{petName}" to confirm</span>
            </label>
            <input
              type="text"
              class="input input-bordered"
              name="confirmName"
              required
              pattern={petName}
              title={`Please type "${petName}" to confirm deletion`}
            />
          </div>
        </div>

        <div class="modal-action">
          <button type="button" class="btn" onclick={closeModal}>Cancel</button>
          <button type="submit" class="btn btn-error" disabled={loading}>
            {loading ? "Deleting..." : "Delete Pet"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
