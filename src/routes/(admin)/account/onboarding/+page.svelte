<script lang="ts">
  import { applyAction, enhance } from "$app/forms"
  import type { SubmitFunction } from "@sveltejs/kit"
  import "../../../../app.css"
  import ProgressBar from "./components/ProgressBar.svelte"
  import PetDetailsForm from "./components/PetDetailsForm.svelte"
  import Welcome from "./components/Welcome.svelte"
  import { onMount } from "svelte"

  interface Pet {
    name?: string
    second_name?: string
    date_of_birth?: string
    gender?: string
    pet_type?: string
    temperament?: string
    food?: string
    favourite_treats?: string
    allergies?: string
    breed?: string
    bio?: string
    avatar_url?: string
  }

  let { data } = $props<{
    data: {
      profile: any
      user: any
      supabase: any
    }
  }>()

  let { user, profile, supabase } = data

  let loading = $state(false)
  let currentStep = $state(0)

  // Pet details form data
  let petName = $state("")
  let petSecondName = $state("")
  let dateOfBirth = $state("")
  let gender = $state("")
  let petType = $state("")
  let temperament = $state("")
  let food = $state("")
  let favouriteTreats = $state("")
  let allergies = $state("")
  let breed = $state("")
  let bio = $state("")
  let petAvatarUrl = $state("")

  let isProfileCompleted = $state(false)

  onMount(async () => {
    if (!user?.id) return

    // Check if the user has any pets
    const { data: petsData } = await supabase
      .from("pets")
      .select("id")
      .eq("profile_id", user.id)

    if (petsData && petsData.length > 0) {
      // If user already has pets, redirect to dashboard
      window.location.href = "/dashboard"
    }
  })

  const startOnboarding = () => {
    currentStep = 1
  }

  const handleSubmit: SubmitFunction = () => {
    loading = true
    return async ({ result }) => {
      if (result.type === "success") {
        isProfileCompleted = true
        currentStep = 3 // Move to welcome step
      } else if (result.type === "error") {
        console.error("Form submission error:", result)
      } else if (result.type === "failure") {
        console.error("Form validation failed:", result)
      }
      loading = false
    }
  }

  const goToDashboard = async () => {
    window.location.href = "/dashboard"
  }
</script>

<svelte:head>
  <title>{currentStep === 0 ? "Welcome to Paaws" : "Add Your First Pet"}</title>
</svelte:head>

<div class="flex flex-col min-h-screen">
  {#if currentStep > 0}
    <div class="w-full max-w-4xl mx-auto px-6 mt-8">
      <ProgressBar {currentStep} />
    </div>
  {/if}

  <div class="flex-grow flex justify-center w-full">
    {#if currentStep === 0}
      <Welcome onGetStarted={startOnboarding} />
    {:else if currentStep === 3}
      <div class="w-full max-w-2xl px-6 text-center">
        <div class="mb-8">
          <div class="flex justify-center gap-2 mb-6">
            <div
              class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <span class="text-2xl font-bold text-primary"
                >{petName.charAt(0).toUpperCase()}</span
              >
            </div>
          </div>
          <h1 class="text-4xl font-bold mb-4">Hooray!</h1>
          <p class="text-xl mb-2">You made it.</p>
          <p class="text-gray-600 max-w-xl mx-auto mb-8">
            Welcome to Paaws, we're so excited to have you and {petName} as part
            of our community and platform.
          </p>
          <p class="text-gray-600 max-w-xl mx-auto mb-8">
            Our platform is free and comes with some basic features for your pet
            profile. We also have paid plans to give you even more features to
            make having a pet that little bit easier.
          </p>
          <button
            class="btn btn-primary rounded-full px-8"
            onclick={goToDashboard}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    {:else}
      <div class="w-full max-w-2xl px-6 pt-6">
        <PetDetailsForm
          {petName}
          {petSecondName}
          {dateOfBirth}
          {gender}
          {petType}
          {temperament}
          {food}
          {favouriteTreats}
          {allergies}
          {breed}
          {bio}
          avatarUrl={petAvatarUrl}
          userProfile={profile}
          {loading}
          {handleSubmit}
          onPrevious={() => (currentStep = 0)}
        />
      </div>
    {/if}
  </div>

  <div class="text-sm text-slate-800 mt-8 mb-4 text-center">
    You are logged in as {user?.email}.<br />
    <a class="underline" href="/dashboard/sign_out">Sign out</a>
  </div>
</div>
