import { PageTemplate } from "@/components/page-template";

export default function Page() {
  return <PageTemplate title="Coupon Management" description="Campaign controls for beta launch offers and bundle discounts." items={["Create coupon", "Usage limits", "Service eligibility", "Audit log"]} allow={["PLATFORM_ADMIN"]} />;
}
