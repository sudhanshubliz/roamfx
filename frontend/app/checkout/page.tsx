import { SmartCheckout } from "@/components/smart-checkout";
import type { ServiceType } from "@/lib/lovable-platform";

export default function Page({ searchParams }: { searchParams?: { service?: string } }) {
  const allowed = ["buy", "sell", "card", "send", "student", "bundle"];
  const service = allowed.includes(searchParams?.service ?? "") ? searchParams?.service as ServiceType : "buy";
  return <SmartCheckout initialService={service} />;
}
