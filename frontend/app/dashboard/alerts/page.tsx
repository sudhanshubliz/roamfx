import { PageTemplate } from "@/components/page-template";

export default function Page() {
  return <PageTemplate title="Rate Alerts" description="Saved currency alerts, flight fare alerts and travel money reminders." items={["USD alert", "EUR alert", "Fare drop alert"]} allow={["TRAVELLER", "PLATFORM_ADMIN"]} />;
}
