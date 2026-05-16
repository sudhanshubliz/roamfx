import { PageTemplate } from "@/components/page-template";

export default function Page() {
  return <PageTemplate title="My Trips" description="Trip planner and reminders surface imported from the Lovable roadmap." items={["Dubai trip pack", "Flight reminders", "Forex checklist"]} allow={["TRAVELLER", "PLATFORM_ADMIN"]} />;
}
