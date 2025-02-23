<script lang="ts">
  import { applyAction, enhance } from "$app/forms"
  import type { SubmitFunction } from "@sveltejs/kit"
  import "../../../../app.css"
  import ProgressBar from "./components/ProgressBar.svelte"
  import UserDetailsForm from "./components/UserDetailsForm.svelte"
  import PetDetailsForm from "./components/PetDetailsForm.svelte"
  import Welcome from "./components/Welcome.svelte"
  import Header from "./components/Header.svelte"
  import { onMount } from "svelte"
  import type { SupabaseClient } from "@supabase/supabase-js"

  interface User {
    email: string
    id: string // Add id to User interface
  }

  interface Profile {
    first_name?: string
    last_name?: string
    home_phone?: string
    mobile_phone?: string
    email?: string
    country?: string
    address?: string
  }

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

  interface Props {
    data: {
      user: User
      profile: Profile
      supabase: SupabaseClient
    }
    form: FormAccountUpdateResult
  }

  let { data, form }: Props = $props()
  let { user, profile, supabase } = data

  let loading = $state(false)
  let currentStep = $state(0)

  let firstName = $state(profile?.first_name ?? "")
  let lastName = $state(profile?.last_name ?? "")
  let homePhone = $state(profile?.home_phone ?? "")
  let mobilePhone = $state(profile?.mobile_phone ?? "")
  let email = $state(profile?.email ?? user?.email ?? "")
  let country = $state(profile?.country ?? "")
  let address = $state(profile?.address ?? "")

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

    // Using supabase from data props
    const { data: profileData } = await supabase
      .from("profiles")
      .select(`has_completed_onboarding`)
      .eq("id", user.id)
      .single()

    if (profileData?.has_completed_onboarding) {
      window.location.href = "/account"
    }
  })

  const startOnboarding = () => {
    currentStep = 1
  }

  const nextStep = () => {
    currentStep = 2
  }

  const prevStep = () => {
    currentStep = currentStep - 1
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

  const handleUserDetailsUpdate = (details: {
    firstName: string
    lastName: string
    homePhone: string
    mobilePhone: string
    email: string
    country: string
    address: string
  }) => {
    firstName = details.firstName
    lastName = details.lastName
    homePhone = details.homePhone
    mobilePhone = details.mobilePhone
    email = details.email
    country = details.country
    address = details.address
  }

  const goToDashboard = async () => {
    if (!user?.id) return

    // Using supabase from data props
    const { error } = await supabase
      .from("profiles")
      .update({ has_completed_onboarding: true })
      .eq("id", user.id)

    if (error) {
      console.error("Error updating profile:", error)
      return
    }

    window.location.href = "/account"
  }
</script>

<svelte:head>
  <title>{currentStep === 0 ? "Welcome to Paaws" : "Create Profile"}</title>
</svelte:head>

<div class="flex flex-col min-h-screen">
  <Header />
  {#if currentStep > 0}
    <div class="w-full max-w-4xl mx-auto px-6 mt-8">
      <ProgressBar {currentStep} currentSubstep={1} />
    </div>
  {/if}

  <div class="flex-grow flex justify-center w-full">
    {#if currentStep === 0}
      <Welcome onGetStarted={startOnboarding} />
    {:else if currentStep === 3}
      <div class="w-full max-w-2xl px-6 text-center">
        <div class="mb-8">
          <div class="flex justify-center gap-2 mb-6">
            <!-- Pet avatars from the form -->

            <img src="#" alt="#" class="w-16 h-16 rounded-full object-cover" />
          </div>
          <h1 class="text-4xl font-bold mb-4">Hooray!</h1>
          <p class="text-xl mb-2">You made it.</p>
          <p class="text-gray-600 max-w-xl mx-auto mb-8">
            Welcome to Paaws, we're so excited to have you and your pets as part
            of our community and platform.
          </p>
          <p class="text-gray-600 max-w-xl mx-auto mb-8">
            Just to let you know that our platform is free and comes with some
            basic features for your pet profile, however we do have paid plans
            to give you even more features to make having a pet that little bit
            easier.
          </p>
          <button
            class="btn btn-primary rounded-full px-8"
            onclick={goToDashboard}
          >
            Jump to Dashboard
          </button>
        </div>
      </div>
    {:else}
      <div class="w-full max-w-2xl px-6">
        {#if currentStep === 1}
          <UserDetailsForm
            {firstName}
            {lastName}
            {homePhone}
            {mobilePhone}
            {email}
            {country}
            {address}
            {nextStep}
            onUpdate={handleUserDetailsUpdate}
          />
        {:else}
          <PetDetailsForm
            petDetails={{
              petName,
              petSecondName,
              dateOfBirth,
              gender,
              petType,
              temperament,
              food,
              favouriteTreats,
              allergies,
              breed,
              bio,
              avatarUrl: petAvatarUrl,
            }}
            userDetails={{
              firstName,
              lastName,
              homePhone,
              mobilePhone,
              email,
              country,
              address,
            }}
            {form}
            {loading}
            {handleSubmit}
            {prevStep}
          />
        {/if}
      </div>
    {/if}
  </div>

  <div class="text-sm text-slate-800 mt-8 mb-4 text-center">
    You are logged in as {user?.email}.<br />
    <a class="underline" href="/account/sign_out">Sign out</a>
  </div>
</div>
