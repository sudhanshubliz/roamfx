import type React from "react";
import { LovableSiteShell } from "@/components/lovable-shell";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <LovableSiteShell>{children}</LovableSiteShell>;
}
