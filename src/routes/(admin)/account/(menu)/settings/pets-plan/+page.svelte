<script lang="ts">
  import PricingModule from "../../../../../(marketing)/pricing/pricing_module.svelte"
  import {
    pricingPlans,
    defaultPlanId,
  } from "../../../../../(marketing)/pricing/pricing_plans"

  let { data } = $props()

  let currentPlanId = data.currentPlanId ?? defaultPlanId
  let currentPlanName = pricingPlans.find(
    (x) => x.id === data.currentPlanId,
  )?.name

  let billingInterval = $state("year") // or 'month'
</script>

<div class=" mx-auto">
  <div class="mb-1">
    <h2 class="text-2xl font-semibold text-[#101828] mb-2">Select Plan</h2>
  </div>

  <div class="flex justify-end mb-6">
    <div class="join bg-base-200 p-1 rounded-lg">
      <button
        class="join-item px-4 py-2 rounded-md {billingInterval === 'year'
          ? 'bg-white'
          : ''}"
        on:click={() => (billingInterval = "year")}
      >
        Annual <span class="badge badge-sm badge-error text-white ml-2"
          >Save 10%</span
        >
      </button>
      <button
        class="join-item px-4 py-2 rounded-md {billingInterval === 'month'
          ? 'bg-white'
          : ''}"
        on:click={() => (billingInterval = "month")}
      >
        Monthly
      </button>
    </div>
  </div>

  <PricingModule callToAction="Select Plan" {currentPlanId} center={false} />
</div>
