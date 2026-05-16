import { PageTemplate } from "@/components/page-template";

export default function Page() {
  return <PageTemplate title="My Emails" description="Travel pack email history and notification placeholder from Roam AI." items={["Travel pack", "Booking confirmation", "KYC reminder"]} allow={["TRAVELLER", "PLATFORM_ADMIN"]} />;
}
