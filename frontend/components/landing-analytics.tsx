"use client";
import * as React from "react";
import { trackEvent } from "@/lib/analytics";

export function LandingAnalytics() {
  React.useEffect(() => {
    trackEvent("landing_viewed", { page: "home" });
  }, []);
  return null;
}
