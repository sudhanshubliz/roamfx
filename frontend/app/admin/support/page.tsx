import { PageTemplate } from "@/components/page-template";

export default function Page() {
  return <PageTemplate title="Support Desk" description="Support tickets, callback queue and partner escalation view." items={["Callbacks", "WhatsApp handoff", "Partner escalation", "SLA"]} allow={["PLATFORM_ADMIN"]} />;
}
