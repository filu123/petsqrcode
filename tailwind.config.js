/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography"
import daisyui from "daisyui"

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [typography, daisyui],
  daisyui: {
    themes: [
      // {
      //   customtheme: {
      //     primary: "#72CC50",
      //     "primary-content": "#fefbf6",
      //     secondary: "#c7b9f8",
      //     neutral: "#98A2B3",
      //     "neutral-content": "#fefbf6",
      //     accent: "#079455",
      //     "accent-content": "#180042",
      //     "accent-bg": "#DCFAE6",
      //     "base-content": "#180042",
      //     "base-100": "#fefbf6",
      //     "base-200": "#faedd6",
      //     success: "#37d399",
      //     black: "#101828",
      //     disabled: "#F2F4F7",
      //     error: "#f77272",
      //   },
      // },
      // You can keep your existing themes here
      {
        saasstartertheme: {
     

          primary: "#72CC50",
          "primary-content": "#F9FAFB",
          secondary: "#079455",
          "secondary-content": "#F2F4F7",
          accent: "#067647",
          "accent-content": "#FAEDD6",
          neutral: "#475467",
          "neutral-content": "#F9FAFB",
          "base-100": "#F9FAFB",
          "base-200": "#EAECF0",
          "base-300": "#F2F4F7",
          info: "#667085",
          success: "#ABEFC6",
          warning: "#DCFAE6",
          error: "#101828",
          "error-content": "#F77272",
          third: "#344054"
        },
      },
    ],
  },
}
