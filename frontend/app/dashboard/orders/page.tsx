import { PageTemplate } from "@/components/page-template";

export default function Page() {
  return <PageTemplate title="My Orders" description="Traveller order history from the Lovable UI: forex, card, remittance and bundle requests." items={["Active orders", "KYC status", "Receipts and settlement"]} allow={["TRAVELLER", "PLATFORM_ADMIN"]} />;
}
