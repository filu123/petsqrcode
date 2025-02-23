<script lang="ts">
  export let currentStep: number
  export let currentSubstep: number = 1
</script>

<div class="w-full max-w-2xl mx-auto mb-12">
  <div class="flex justify-between mb-4 relative">
    <!-- Connecting lines -->
    <div
      class="absolute top-6 left-[calc(5.666%_+_24px)] right-[calc(3.6%_+_24px)] h-[2px] bg-gray-200"
    >
      <!-- First section line -->
      <div
        class="absolute left-0 h-full bg-primary transition-all duration-300"
        style="width: {currentStep > 1
          ? '0%'
          : currentStep === 1
            ? currentSubstep === 1
              ? '0%'
              : currentSubstep === 2
                ? '0%'
                : '0%'
            : '0%'}"
     ></div>
    </div>

    <div class="flex flex-col items-center gap-2 z-10">
      <div
        class="w-12 h-12 border shadow-sm border-base-20 rounded-xl bg-white flex items-center justify-center {currentStep >=
        1
          ? 'bg-primary/10'
          : 'bg-gray-100'}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 {currentStep >= 1 ? 'text-primary' : 'text-gray-400'}"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <span
        class="text-sm font-medium {currentStep >= 1
          ? 'text-primary'
          : 'text-gray-500'}">Your Details</span
      >
    </div>

    <div class="flex flex-col items-center gap-2 z-10">
      <div
        class="w-12 h-12 border shadow-sm border-base-20 rounded-xl bg-white flex items-center justify-center {currentStep >=
        2
          ? 'bg-primary/10'
          : 'bg-gray-100'}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 {currentStep >= 2 ? 'text-primary' : 'text-gray-400'}"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>
      <span
        class="text-sm font-medium {currentStep >= 2
          ? 'text-primary'
          : 'text-gray-500'}">Pet Details</span
      >
    </div>

    <div class="flex flex-col items-center gap-2 z-10">
      <div
        class="w-12 h-12 border shadow-sm border-base-20 rounded-xl bg-white flex items-center justify-center {currentStep >=
        3
          ? 'bg-primary/10'
          : 'bg-gray-100'}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 {currentStep >= 3 ? 'text-primary' : 'text-gray-400'}"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <span
        class="text-sm font-medium {currentStep >= 3
          ? 'text-primary'
          : 'text-gray-500'}">Finish</span
      >
    </div>
  </div>
</div>
