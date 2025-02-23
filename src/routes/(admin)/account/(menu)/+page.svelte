<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("home")
</script>

<svelte:head>
  <title>Dashboard - Paaws</title>
</svelte:head>

<div class="space-y-6">
  <h1 class="text-2xl font-bold">Dashboard</h1>
  <!-- Add your dashboard content here -->
</div>
