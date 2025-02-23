<script lang="ts">
  import { page } from "$app/stores"

  let referralLink = "https://app.Pawws.bio/create-url-refer-dawws"

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(referralLink)
      // You can add a toast notification here if you want
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }
</script>

<div class="">
  <div class="mb-8">
    <h2 class="text-2xl font-semibold text-[#101828] mb-2">
      Give a free Pawws tag to a friend.
    </h2>
    <p class="text-[#475467]">
      Send them your referral link so they can claim their free tag.
    </p>
  </div>

  <div class="mt-6 flex items-center">
    <label class="mr-10 text-sm text-[#475467] mb-2 block"
      >Your unique link</label
    >
    <div class="flex gap-2">
      <input
        type="text"
        readonly
        value={referralLink}
        class="input input-bordered flex-1 bg-white text-[#101828]"
      />
      <button
        on:click={copyToClipboard}
        class="btn btn-success text-white gap-2"
      >
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Copy URL
      </button>
    </div>
  </div>
</div>
