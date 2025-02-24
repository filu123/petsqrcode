<script lang="ts">
  export let onGetStarted = () => {}
</script>

<div class="bg-[#67B044] text-white p-14">
  <div class="flex items-center mx-auto text-left space-y-4">
    <div>
      <h2 class="text-2xl font-bold">
        Share Pawws with a somebody you know...
      </h2>
      <p class="text-md text-[#CDFFBA] font-bold mt-2">
        Refer other pet owners and give them a free tag.
      </p>
    </div>
    <button
      class="ml-auto btn btn-ghost bg-white/20 hover:bg-white/30 text-white rounded-full px-8"
      onclick={onGetStarted}
    >
      Get started
    </button>
  </div>
</div>
