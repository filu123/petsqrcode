<script lang="ts">
  export let onGetStarted: () => void
</script>

<div
  class="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl mx-auto p-6 md:gap-36"
>
  <div class="flex-1 space-y-6 text-center max-w-[360px] lg:text-left">
    <h1 class="text-3xl lg:text-4xl font-bold">Welcome to Paaws!</h1>
    <p class="text-gray-600 text-base lg:text-lg leading-relaxed">
      Paaws is the leading platform to track all of your pets in one central
      hub. We connect owners with their pets by making them trackable, so if
      they end up going walkies, we can reunite you back to them. We create a
      hub where owners can monitor their medication, vaccinations and much more.
    </p>
    <button
      class="btn btn-primary btn-lg w-full lg:w-auto"
      onclick={onGetStarted}
    >
      Let's Get Started
    </button>
  </div>

  <div class="flex-1">
    <div class="rounded-3xl overflow-hidden">
      <img
        src="/images/Section.png"
        alt="Happy pet"
        class="w-full h-auto mx-auto"
      />
    </div>
  </div>
</div>
