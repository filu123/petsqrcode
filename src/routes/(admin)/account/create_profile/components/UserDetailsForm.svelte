<script lang="ts">
  interface Props {
    firstName: string
    lastName: string
    homePhone: string
    mobilePhone: string
    email: string
    country: string
    address: string
    nextStep: () => void
    onUpdate: (details: {
      firstName: string
      lastName: string
      homePhone: string
      mobilePhone: string
      email: string
      country: string
      address: string
    }) => void
  }

  let {
    firstName,
    lastName,
    homePhone,
    mobilePhone,
    email,
    country,
    address,
    nextStep,
    onUpdate,
  } = $props<Props>()

  let currentSubstep = $state(1)

  let errors = $state({
    firstName: "",
    lastName: "",
    mobilePhone: "",
    email: "",
    country: "",
    address: "",
  })

  const validateSubstep1 = () => {
    let isValid = true
    errors = {
      firstName: "",
      lastName: "",
      mobilePhone: "",
      email: "",
      country: "",
      address: "",
    }

    if (!firstName.trim()) {
      errors.firstName = "First name is required"
      isValid = false
    }

    if (!lastName.trim()) {
      errors.lastName = "Last name is required"
      isValid = false
    }

    if (!mobilePhone.trim()) {
      errors.mobilePhone = "Mobile phone is required"
      isValid = false
    }

    if (!email.trim()) {
      errors.email = "Email is required"
      isValid = false
    } else if (!email.includes("@")) {
      errors.email = "Please enter a valid email"
      isValid = false
    }

    return isValid
  }

  const validateSubstep2 = () => {
    let isValid = true
    errors = {
      firstName: "",
      lastName: "",
      mobilePhone: "",
      email: "",
      country: "",
      address: "",
    }

    if (!country) {
      errors.country = "Country is required"
      isValid = false
    }

    if (!address.trim()) {
      errors.address = "Address is required"
      isValid = false
    }

    return isValid
  }

  const goToNextSubstep = () => {
    if (currentSubstep === 1 && !validateSubstep1()) {
      return
    }
    if (currentSubstep === 2 && !validateSubstep2()) {
      return
    }

    onUpdate({
      firstName,
      lastName,
      homePhone,
      mobilePhone,
      email,
      country,
      address,
    })
    currentSubstep++
  }

  const goToPreviousSubstep = () => {
    currentSubstep--
  }

  const handleFinalContinue = () => {
    if (!validateSubstep2()) {
      return
    }

    onUpdate({
      firstName,
      lastName,
      homePhone,
      mobilePhone,
      email,
      country,
      address,
    })
    nextStep()
  }
</script>

<div class="w-full max-w-2xl mx-auto mt-8">
  {#if currentSubstep === 1}
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-[#14181F] mb-4">Your Details</h1>
      <p class="text-gray-600 max-w-xl mx-auto">
        It's important that this information is correct as we will use this as
        your pets contact information if your pet ever goes missing. We
        recommend that you double check it.
      </p>
    </div>

    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="form-control">
          <label class="label">
            <span class="label-text text-[#6B7280]">First Name*</span>
          </label>
          <input
            type="text"
            bind:value={firstName}
            class="input input-bordered w-full bg-white {errors.firstName
              ? 'border-red-500'
              : ''}"
            placeholder="Enter first name"
          />
          {#if errors.firstName}
            <label class="label">
              <span class="label-text-alt text-red-500">{errors.firstName}</span
              >
            </label>
          {/if}
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text text-[#6B7280]">Second Name*</span>
          </label>
          <input
            type="text"
            bind:value={lastName}
            class="input input-bordered w-full bg-white {errors.lastName
              ? 'border-red-500'
              : ''}"
            placeholder="Enter second name"
          />
          {#if errors.lastName}
            <label class="label">
              <span class="label-text-alt text-red-500">{errors.lastName}</span>
            </label>
          {/if}
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="form-control">
          <label class="label">
            <span class="label-text text-[#6B7280]"
              >Home Phone Number (optional)</span
            >
          </label>
          <input
            type="tel"
            bind:value={homePhone}
            class="input input-bordered w-full bg-white"
            placeholder="Enter home phone number"
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text text-[#6B7280]">Mobile Number*</span>
          </label>
          <div class="flex gap-2">
            <select class="select select-bordered w-24 bg-white">
              <option>UK</option>
            </select>
            <input
              type="tel"
              bind:value={mobilePhone}
              class="input input-bordered w-full bg-white {errors.lastName
                ? 'border-red-500'
                : ''}"
              placeholder="Enter mobile number"
            />
          </div>
          {#if errors.mobilePhone}
            <label class="label">
              <span class="label-text-alt text-red-500"
                >{errors.mobilePhone}</span
              >
            </label>
          {/if}
        </div>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text text-[#6B7280]">Your Email*</span>
        </label>
        <input
          type="email"
          bind:value={email}
          class="input input-bordered w-full bg-white"
          placeholder="Enter your email"
        />
      </div>

      <div class="mt-8">
        <button
          class="btn btn-primary w-full md:w-auto md:min-w-[200px] mx-auto block rounded-full"
          on:click={goToNextSubstep}
        >
          Continue
        </button>
      </div>
    </div>
  {:else if currentSubstep === 2}
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-[#14181F] mb-4">Your Address</h1>
      <p class="text-gray-600 max-w-xl mx-auto">
        If you have more than one address, please enter the address where you
        spend most of your time.
      </p>
    </div>

    <div class="space-y-6">
      <div class="form-control">
        <label class="label">
          <span class="label-text text-[#6B7280]">Country*</span>
        </label>
        <select
          bind:value={country}
          class="select select-bordered w-full bg-white"
        >
          <option value="">Select country</option>
          <option value="United Kingdom">United Kingdom</option>
        </select>
        <label class="label">
          <span class="label-text-alt text-gray-500"
            >This is a hint text to help user.</span
          >
        </label>
        {#if errors.country}
          <label class="label">
            <span class="label-text-alt text-red-500">{errors.country}</span>
          </label>
        {/if}
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text text-[#6B7280]">Start typing address</span>
        </label>
        <input
          type="text"
          bind:value={address}
          class="input input-bordered w-full bg-white {errors.lastName
            ? 'border-red-500'
            : ''}"
          placeholder="Start typing address..."
        />
        {#if errors.address}
          <label class="label">
            <span class="label-text-alt text-red-500">{errors.address}</span>
          </label>
        {/if}
      </div>

      <div class="flex justify-between mt-8">
        <button
          class="btn btn-outline rounded-full px-8"
          on:click={goToPreviousSubstep}
        >
          Back
        </button>
        <button
          class="btn btn-primary rounded-full px-8"
          on:click={goToNextSubstep}
        >
          Continue
        </button>
      </div>
    </div>
  {:else}
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-[#14181F] mb-4">Your Address</h1>
      <p class="text-gray-600 max-w-xl mx-auto">
        If you have more than one address, please enter the address where you
        spend most of your time.
      </p>
    </div>

    <div class="bg-white rounded-lg border p-6 mb-8">
      <h3 class="text-lg font-medium mb-2">Selected Address</h3>
      <p class="text-gray-600">{address}</p>
      <p class="text-gray-600">{country}</p>
      <button
        class="text-primary hover:text-primary-dark mt-2"
        on:click={() => (currentSubstep = 2)}
      >
        Edit
      </button>
    </div>

    <div class="flex justify-between">
      <button
        class="btn btn-outline rounded-full px-8"
        on:click={goToPreviousSubstep}
      >
        Back
      </button>
      <button
        class="btn btn-primary rounded-full px-8"
        on:click={handleFinalContinue}
      >
        Continue
      </button>
    </div>
  {/if}
</div>
