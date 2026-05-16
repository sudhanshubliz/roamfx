import { PageTemplate } from "@/components/page-template";

export default function Page() {
  return <PageTemplate title="Roam AI Leads" description="Lead inbox for travel pack emails, callbacks, WhatsApp handoffs and conversion analysis." items={["Callback leads", "Email packs", "WhatsApp handoffs", "AI intent"]} allow={["PLATFORM_ADMIN"]} />;
}
