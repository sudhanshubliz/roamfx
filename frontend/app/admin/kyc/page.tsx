import { PageTemplate } from "@/components/page-template";

export default function Page() {
  return <PageTemplate title="KYC Review" description="Admin KYC queue with compliance-safe metadata review." items={["Pending documents", "Rejected with reason", "Verified", "Audit trail"]} allow={["PLATFORM_ADMIN"]} />;
}
