export const defaultPlanId = "free"

export const pricingPlans = [
  {
    id: "free",
    name: "Basic",
    color: "#0EA5E9", // Blue
    description: "Some basics to get started",
    monthlyPrice: "Free",
    yearlyPrice: "Free",
    priceIntervalName: "per month",
    stripe_price_id: null,
    popular: false,
    features: [
      "Custom pet profile",
      "Track pet details",
      "Pet maintenance",
      "Vet details",
      "Owner contact details"
    ],
  },
  {
    id: "pro",
    name: "Pro",
    color: "#22C55E", // Green
    description: "Everything in free plan plus",
    monthlyPrice: "$3",
    yearlyPrice: "$2.70",
    priceIntervalName: "per month",
    stripe_price_id: "price_1QtTFlLBnoPY6LhHDhi5RHec",
    stripe_product_id: "prod_Rn3MnwGlTocSXo",
    popular: true,
    features: [
      "Register pet QR code",
      "Receive pets location",
      "Scan for profile",
      "Invite 1 user"
    ],
  },
  {
    id: "ultra",
    name: "Ultra",
    color: "#EF4444", // Red
    description: "Everything in pro plan plus",
    monthlyPrice: "$6",
    yearlyPrice: "$5.40",
    priceIntervalName: "per month",
    stripe_price_id: "price_1QtTGALBnoPY6LhHn47rrmrq",
    stripe_product_id: "prod_Rn3MYiuz8JjnAD",
    popular: false,
    features: [
      "Use own QR code",
      "Invite unlimited users",
      "Pawws will"
    ],
  },
]