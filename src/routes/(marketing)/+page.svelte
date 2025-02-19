<script lang="ts">
  import { WebsiteName } from "./../../config"
  import { enhance } from "$app/forms"

  let email = ""
  let message = ""
  let isError = false
  let loading = false

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    loading = true
    message = ""

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        isError = true
        message = data.error || "Failed to join waitlist"
      } else {
        isError = false
        message = "Thank you for joining our waitlist!"
        email = ""
      }
    } catch (error) {
      isError = true
      message = "An error occurred. Please try again."
    } finally {
      loading = false
    }
  }
</script>

<svelte:head>
  <title>{WebsiteName}</title>
  <meta
    name="description"
    content="Join our waitlist and get a FREE QR tag when we launch"
  />
</svelte:head>

<div class=" min-h-screen bg-white">
  <!-- Header -->
  <header class="py-4 px-6 text-center">
    <h1 class="text-2xl font-bold">PAAWS</h1>
  </header>

  <!-- Main Content -->
  <main class="container max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
    <div
      class="flex flex-col lg:flex-row items-center justify-between gap-12 py-12"
    >
      <!-- Left Column -->
      <div class="w-full lg:w-1/2 space-y-6 max-w-[480px]">
        <h2
          class="text-4xl md:text-5xl lg:text-5xl font-bold leading-[44px] lg:leading-[60px]"
        >
          Join our waitlist, get a FREE QR tag when we launch.
        </h2>
        <p class="text-lg md:text-xl text-gray-600 max-w-xl !leading-[30px]">
          Paaws in the first advanced pet tracking software with a built in
          customisable profile and dashboard. Join our waitlist for spring 2025
          and receive a free QR tag once we launch.
        </p>

        <!-- Email Form -->
        <form
          on:submit={handleSubmit}
          class="flex flex-col sm:flex-row gap-4 max-w-md"
        >
          <input
            type="email"
            bind:value={email}
            required
            placeholder="Enter your email"
            class="flex-grow px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-green-500"
          />
          <button
            type="submit"
            disabled={loading}
            class="bg-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Joining..." : "Join Us"}
          </button>
        </form>

        {#if message}
          <p
            class={`mt-4 text-sm ${isError ? "text-red-500" : "text-green-500"}`}
          >
            {message}
          </p>
        {/if}
      </div>

      <!-- Right Column - Replace with SVG Image -->
      <div class="w-full lg:w-1/2">
        <div class=" rounded-3xl p-6">
          <img
            src="/images/Content.png"
            alt="Paaws App Interface Preview"
            class="w-full h-auto max-w-[600px] mx-auto"
          />
        </div>
      </div>
      <!-- Rest of the code stays the same -->
    </div>
  </main>

  <!-- Footer -->
  <footer class="py-8 px-6 mx-auto container max-w-[1280px]">
    <div class="">
      <div class="flex justify-between items-center">
        <div class="flex gap-6">
          <a href="#" class="text-gray-600 hover:text-gray-900">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
              />
            </svg>
          </a>
          <a href="#" class="text-gray-600 hover:text-gray-900">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
              />
            </svg>
          </a>
          <a href="#" class="text-gray-600 hover:text-gray-900">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2.224c3.004 0 3.36.012 4.548.066 1.096.05 1.692.233 2.088.386.526.204.9.45 1.294.844.394.394.64.768.844 1.294.153.396.336.992.386 2.088.054 1.188.066 1.544.066 4.548s-.012 3.36-.066 4.548c-.05 1.096-.233 1.692-.386 2.088-.204.526-.45.9-.844 1.294-.394.394-.768.64-1.294.844-.396.153-.992.336-2.088.386-1.188.054-1.544.066-4.548.066s-3.36-.012-4.548-.066c-1.096-.05-1.692-.233-2.088-.386-.526-.204-.9-.45-1.294-.844-.394-.394-.64-.768-.844-1.294-.153-.396-.336-.992-.386-2.088-.054-1.188-.066-1.544-.066-4.548s.012-3.36.066-4.548c.05-1.096.233-1.692.386-2.088.204-.526.45-.9.844-1.294.394-.394.768-.64 1.294-.844.396-.153.992-.336 2.088-.386 1.188-.054 1.544-.066 4.548-.066zm0-2.224c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
              />
            </svg>
          </a>
        </div>
        <div class="text-sm text-gray-500">
          © 2025 Paaws. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
</div>
