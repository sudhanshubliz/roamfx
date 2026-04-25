import { AppShell } from "@/components/app-shell";
import { RateComparison } from "@/components/rate-comparison";
import { ComplianceBanner } from "@/components/compliance-banner";
export default function Page() { return <AppShell><main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6"><ComplianceBanner /><RateComparison /></main></AppShell>; }
