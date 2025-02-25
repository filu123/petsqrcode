<script lang="ts">
  import "../app.css"
  import { navigating, page } from "$app/stores"
  import { expoOut } from "svelte/easing"
  import { slide } from "svelte/transition"
  import { onMount, onDestroy } from "svelte"
  import { userStore } from "$lib/stores/userStore"

  let { data, children } = $props()

  // Set up auth listener on mount
  let unsubscribe: Function | null = null

  onMount(() => {
    unsubscribe = userStore.setupAuthListener()
  })

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe()
    }
  })
</script>

{#if $navigating}
  <div
    class="fixed w-full top-0 right-0 left-0 h-1 z-50 bg-primary"
    in:slide={{ delay: 100, duration: 12000, axis: "x", easing: expoOut }}
  ></div>
{/if}
{@render children?.()}
