<script lang="ts">
  import { pricingPlans } from "./pricing_plans"

  interface Props {
    highlightedPlanId?: string
    callToAction: string
    currentPlanId?: string
    center?: boolean
    billingInterval?: "year" | "month"
  }

  let {
    highlightedPlanId = "",
    callToAction,
    currentPlanId = "",
    center = true,
    billingInterval = "month",
  }: Props = $props()
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  {#each pricingPlans as plan}
    <div
      class="card bg-white border {plan.popular
        ? 'border-primary'
        : 'border-gray-200'} shadow-sm"
    >
      <div class="card-body p-6">
        <!-- Plan Header -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="flex items-center gap-2">
              <span style="color: {plan.color}" class="text-xl font-semibold">
                {plan.name.split(" ")[0]}
              </span>
              <span class="text-xl font-normal">plan</span>
            </h3>
            {#if plan.popular}
              <span class="badge badge-success badge-sm mt-1">Popular</span>
            {/if}
          </div>
        </div>

        <!-- Price -->
        <div class="mb-6">
          <div class="flex items-baseline">
            <span class="text-4xl font-bold">
              {billingInterval === "year"
                ? plan.yearlyPrice
                : plan.monthlyPrice}
            </span>
            <span class="text-gray-500 ml-1">per month</span>
          </div>
        </div>

        <!-- Action Button -->
        {#if plan.id === currentPlanId}
          <div class="btn btn-outline no-animation w-full mb-6 cursor-default">
            Current Plan
          </div>
        {:else if currentPlanId === "pro" && plan.id === "ultra"}
          <a
            href={"/dashboard/billing/manage"}
            class="btn btn-primary text-white w-full mb-6"
          >
            Upgrade
          </a>
        {:else if currentPlanId === "pro" && plan.id === "free"}
          <a
            href={"/dashboard/billing/manage"}
            class="btn btn-outline w-full mb-6"
          >
            Downgrade
          </a>
        {:else if currentPlanId === "ultra"}
          <a
            href={"/dashboard/billing/manage"}
            class="btn btn-outline w-full mb-6"
          >
            Downgrade
          </a>
        {:else if currentPlanId === "free" && (plan.id === "pro" || plan.id === "ultra")}
          <a
            href={"/dashboard/subscribe/" + plan.stripe_price_id}
            class="btn btn-primary text-white w-full mb-6"
          >
            {plan.id === "ultra" ? "Upgrade to Ultra" : "Upgrade to Pro"}
          </a>
        {/if}

        <!-- Features -->
        <div>
          <p class="text-sm text-gray-600 mb-4">
            {plan.id === "free"
              ? "Some basics to get started:"
              : plan.id === "pro"
                ? "Everything in free plan plus:"
                : "Everything in pro plan plus:"}
          </p>
          <ul class="space-y-3">
            {#each plan.features as feature}
              <li class="flex gap-2 items-start">
                <svg
                  class="w-5 h-5 text-success flex-shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                  />
                </svg>
                <span class="text-gray-600 text-sm">{feature}</span>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  {/each}
</div>
