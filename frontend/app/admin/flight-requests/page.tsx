import { PageTemplate } from "@/components/page-template";

export default function Page() {
  return <PageTemplate title="Flight Requests" description="Prototype admin queue for AI flight deal reservations and supplier handoff." items={["Reservation requests", "Fare hold SLA", "Supplier status", "Bundle attach rate"]} allow={["PLATFORM_ADMIN"]} />;
}
