<script lang="ts">
  let { previewUrl, uploadError, onFileSelect } = $props<{
    previewUrl: string | null
    uploadError: string | null
    onFileSelect: (file: File) => void // Accept a callback instead of dispatching an event
  }>()

  const handleFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (file) {
      onFileSelect(file) // Call the prop function instead of dispatching an event
    }
  }
</script>

<div class="mb-8">
  <label class="block text-[#6B7280] mb-2">Pet Profile Photo (optional)</label>
  <div class="flex items-center gap-4">
    <div class="w-16 h-16 rounded-full bg-gray-100 overflow-hidden">
      {#if previewUrl}
        <img
          src={previewUrl}
          alt="Pet profile preview"
          class="w-full h-full object-cover"
        />
      {:else}
        <div class="w-full h-full bg-gray-200 flex items-center justify-center">
          <svg
            class="w-8 h-8 text-gray-400"
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
    <div class="flex flex-col gap-2">
      <label class="btn btn-outline gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"
          />
          <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
        </svg>
        Upload New
        <input
          type="file"
          accept="image/*"
          class="hidden"
          onchange={handleFileSelect}
        />
      </label>
      {#if uploadError}
        <p class="text-red-500 text-sm">{uploadError}</p>
      {/if}
      <p class="text-xs text-gray-500">Maximum file size: 2MB</p>
    </div>
  </div>
</div>
