<script lang="ts">
  interface Props {
    children?: import("svelte").Snippet
  }

  let { children }: Props = $props()
  let isEurope = $state(false)
  try {
    isEurope = Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone.startsWith("Europe/")
  } catch (e) {
    /* continue */
  }
</script>

<div
  class="text-center content-center items-center justify-center mx-auto max-w-[1280px] min-h-[70vh] pb-12 flex container"
>
  <div class="flex flex-col w-full">
    {@render children?.()}
  </div>
</div>
