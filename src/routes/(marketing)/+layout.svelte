<script lang="ts">
  import { WebsiteName } from "./../../config"
  import "../../app.css"

  interface Props {
    children?: import("svelte").Snippet
  }

  let { children }: Props = $props()
</script>

<div class="navbar bg-base-100 mx-auto">
  <div class="flex">
    <a class="btn btn-ghost normal-case text-xl font-bold" href="/">PAAWS</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1 hidden sm:flex font-bold text-lg">
      <li class="md:mx-2"><a href="/blog">Home</a></li>
      <li class="md:mx-2"><a href="/pricing">Products</a></li>
      <li class="md:mx-2"><a href="/account">Resources</a></li>
      <li class="md:mx-2"><a href="/account">Pricing</a></li>
    </ul>
    <div class="dropdown dropdown-end sm:hidden">
      <!-- svelte-ignore a11y_label_has_associated_control -->
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <label tabindex="0" class="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
          /></svg
        >
      </label>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <ul
        tabindex="0"
        class="menu menu-lg dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 font-bold"
      >
        <li><a href="/blog">Blog</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/account">Account</a></li>
        <li><a href="/search">Search</a></li>
        <li>
          <a
            href="https://github.com/CriticalMoments/CMSaasStarter"
            class="border border-primary">★ us on Github</a
          >
        </li>
      </ul>
    </div>
  </div>

  <div class="flex gap-4 ml-auto px-[1.2rem]">
    <button class="text-neutral font-[600] text-md"
      ><a href="/login/sign_in">Log in</a></button
    >
    <button
      class="text-white bg-primary px-4 py-3 rounded-full font-[600] text-md"
    >
      <a href="/login/sign_up">Sign up</a></button
    >
  </div>
</div>

<div class="">
  {@render children?.()}
</div>

<!-- Spacer grows so the footer can be at bottom on short pages -->
<div class="flex-grow"></div>
<div class="">
  <div class="border-t max-w-[1000px] mx-auto"></div>
  <footer
    class="footer p-10 gap-x-48 lg:gap-x-64 xl:gap-x-96 place-content-center text-base"
  >
    <nav>
      <span class="footer-title opacity-80">Explore</span>
      <a class="link link-hover mb-1" href="/">Overview</a>
      <a class="link link-hover my-1" href="/pricing">Pricing</a>
      <a class="link link-hover my-1" href="/blog">Blog</a>
      <a class="link link-hover my-1" href="/contact_us">Contact Us</a>
      <a
        class="link link-hover my-1"
        href="https://github.com/CriticalMoments/CMSaasStarter">Github</a
      >
    </nav>
    <aside>
      <span class="footer-title opacity-80">Sponsor</span>
      <a class="max-w-[260px]" href="https://getkiln.ai">
        <div class="font-bold text-3xl mb-1">Kiln AI</div>
        <div class="font-medium mb-3">Build High Quality AI Products</div>
        <div class="font-light">
          Use advanced AI tactics, and collaborate with your team. Free apps for
          Mac and Windows.
        </div>
        <div class="link text-sm font-bold mt-2">Learn More</div>
      </a>
    </aside>
  </footer>
</div>
