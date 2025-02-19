export const defaultPlanId = "free"

export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "Basic feautures",
    price: "$0",
    priceIntervalName: "per month",
    stripe_price_id: null,
    features: ["Custom Pet Profile", "Sell Digital Products", "Sell Coaching Calls", "Create Lead Magnets", "YouTube-Sync Block", "TikTok-Sync Block", "Contact Form Block", "Send Email Broadcasts", "Publish Blog Posts" , "3rd Party Integrations"],
  },
  {
    id: "pro",
    name: "Pro",
    description:
      "Keeping your pet safe",
    price: "$3",
    priceIntervalName: "per month",
    stripe_price_id: "price_1QtTFlLBnoPY6LhHDhi5RHec",
    stripe_product_id: "prod_Rn3MnwGlTocSXo",
    features: [
      "Custom Domains",
      "Sell Digital Products",
      "Sell Coaching Calls",
      "Create Lead Magnets",
      "YouTube-Sync Block",
      "TikTok-Sync Block",
      "Contact Form Block",
      "Send Email Broadcasts",
      "Publish Blog Posts",
      "3rd Party Integrations",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "All of our features",
    price: "$6",
    priceIntervalName: "per month",
    stripe_price_id: "price_1QtTGALBnoPY6LhHn47rrmrq",
    stripe_product_id: "prod_Rn3MYiuz8JjnAD",
    features: [
      "Invite Team Members",
      "Remove Zaap Branding",
      "Create Discount Codes",
      "1-on-1 Coaching",
      "+ Everything in Pro",
    ],
  },
]
