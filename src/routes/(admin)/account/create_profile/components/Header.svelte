<script lang="ts">
  import { page } from "$app/stores"
</script>

<header class="border-b">
  <div class="container mx-auto px-4 py-4">
    <div class="flex items-center justify-between">
      <a href="/" class="text-2xl font-bold">PAAWS</a>
      
      <div class="flex items-center gap-4">
        <a href="/account/sign_out" class="hidden sm:inline-block">
          <button class="btn btn-outline btn-sm">Sign Out</button>
        </a>
        <button class="btn btn-primary btn-sm">
          <span class="hidden sm:inline">Swap To Mobile</span>
          <span class="sm:hidden">Mobile</span>
        </button>
      </div>
    </div>
  </div>
</header>