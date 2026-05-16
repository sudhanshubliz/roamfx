import { PageTemplate } from "@/components/page-template";

export default function Page() {
  return <PageTemplate title="Coupons" description="Traveller coupons and offer wallet for RoamFX beta campaigns." items={["ROAMFIRST", "STUDENTFX", "FLIGHTFX", "AIRPORTSAVE"]} allow={["TRAVELLER", "PLATFORM_ADMIN"]} />;
}
