<script lang="ts">
  import { page } from "$app/stores"
</script>

<div
  class="flex justify-between items-center py-4 px-6 border-b border-base-200"
>
  <div class="flex items-center gap-2">
    <div class="text-md font-bold text-black">PAWWS</div>
  </div>
  <div class="flex items-center gap-3">
    <button class="btn btn-outline rounded-full normal-case">
      Request Feature
    </button>
    <button class="btn btn-ghost btn-circle">
      <div class="indicator">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M18.7544 10.2051C18.7544 14.6744 15.1425 18.2863 10.6732 18.2863C6.20386 18.2863 2.59192 14.6744 2.59192 10.2051C2.59192 5.73575 6.20386 2.12381 10.6732 2.12381C15.1425 2.12381 18.7544 5.73575 18.7544 10.2051Z"
            stroke="#667085"
            stroke-width="1.5"
          />
          <path
            d="M16.5156 16.0474L21.4274 20.9592"
            stroke="#667085"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </button>
    <button class="btn btn-ghost btn-circle">
      <div class="indicator">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6.5 11C6.5 7.70017 9.14903 5 12.3896 5C15.6301 5 18.2792 7.70017 18.2792 11V12.5C18.2792 13.3284 18.9507 14 19.7792 14H20.5M6.5 11V12.5C6.5 13.3284 5.82843 14 5 14H4.27924M12.3896 5C12.3896 5 13.5 2.5 12.3896 2"
            stroke="#667085"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M13.4947 19.0002C13.4947 19.8286 12.823 20.5002 11.9947 20.5002H8.49466C7.66624 20.5002 6.99466 19.8286 6.99466 19.0002V18.0002C6.99466 17.1717 7.66624 16.5002 8.49466 16.5002H11.9947C12.823 16.5002 13.4947 17.1717 13.4947 18.0002V19.0002Z"
            stroke="#667085"
            stroke-width="1.5"
          />
          <path
            d="M17.9947 19.0002C17.9947 19.8286 17.323 20.5002 16.4947 20.5002H14.9947C14.1662 20.5002 13.4947 19.8286 13.4947 19.0002V18.0002C13.4947 17.1717 14.1662 16.5002 14.9947 16.5002H16.4947C17.323 16.5002 17.9947 17.1717 17.9947 18.0002V19.0002Z"
            stroke="#667085"
            stroke-width="1.5"
          />
        </svg>
      </div>
    </button>
    <button class="btn btn-ghost btn-circle">
      <div class="avatar">
        <div class="w-8 rounded-full">
          <img src="/images/Section.png" alt="User avatar" />
        </div>
      </div>
    </button>
  </div>
</div>
