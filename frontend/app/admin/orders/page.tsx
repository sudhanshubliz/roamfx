import { PageTemplate } from "@/components/page-template";

export default function Page() {
  return <PageTemplate title="Admin Orders" description="Operational order queue for forex, card, send-money and bundle requests." items={["New requests", "KYC review", "Partner SLA", "Settlement state"]} allow={["PLATFORM_ADMIN"]} />;
}
