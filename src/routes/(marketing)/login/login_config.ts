import { ThemeSupa } from "@supabase/auth-ui-shared"
import type { Provider } from "@supabase/supabase-js"

export const oauthProviders = ["github"] as Provider[]

// Customize the appearance
export const sharedAppearance = {
  theme: ThemeSupa,
  variables: {
    default: {
      colors: {
        brand: "oklch(var(--p))",
        brandAccent: "oklch(var(--ac))",
        inputText: "oklch(var(--n))",
        brandButtonText: "oklch(var(--pc))",
        messageText: "oklch(var(--b))",
        dividerBackground: "oklch(var(--n))",
        inputLabelText: "oklch(var(--n))",
        defaultButtonText: "oklch(var(--n))",
        anchorTextColor: "oklch(var(--p))",
      },
      fontSizes: {
        baseInputSize: "16px",
      },
      borderWidths: {
        buttonBorderWidth: '1px',
        inputBorderWidth: '1px',
      },
      radii: {
        borderRadiusButton: '0.5rem',
        buttonBorderRadius: '0.5rem',
        inputBorderRadius: '0.5rem',
      },
      space: {
        inputPadding: '0.75rem 1rem',
        buttonPadding: '0.75rem 1rem',
      },
    },
  },
  className: {
    button: "authBtn",
    // Add a class for social buttons to remove the bottom border
    socialButton: "authSocialBtn",
  },
}