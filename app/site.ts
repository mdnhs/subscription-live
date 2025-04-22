export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  websiteName: "UpEasy",
  websiteLogo: "/logo/upeasy-logo.svg",
  websiteTagline: "Experience the Next Generation of Subscriptions with us",
  paymentMethods: [
    { id: "bkash", name: "bKash", icon: "📱" },
    { id: "nagad", name: "Nagad", icon: "💰" },
  ],
};
