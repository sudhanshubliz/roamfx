import { PageTemplate } from "@/components/page-template";

export default function Page() {
  return <PageTemplate title="Integration Plan" description="Provider roadmap for forex partners, flights, payments, email, WhatsApp and analytics." items={["Forex partner API", "Flight supplier API", "Payment abstraction", "Notifications"]} allow={["PLATFORM_ADMIN"]} />;
}
