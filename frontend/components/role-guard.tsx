"use client";
import * as React from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Role = "TRAVELLER" | "PARTNER_ADMIN" | "PLATFORM_ADMIN";

export function RoleGuard({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
  const [role, setRole] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setRole(localStorage.getItem("roamfx_role"));
    setReady(true);
  }, []);
  if (!ready) {
    return <div className="rounded-lg border p-6 text-sm text-muted-foreground">Loading secure workspace...</div>;
  }
  if (!role || !allow.includes(role as Role)) {
    return <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShieldAlert /> Access controlled</CardTitle>
        <CardDescription>This workspace is role protected. Login with the correct demo account to continue.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">Allowed roles: {allow.join(", ")}</p>
        <Button asChild><Link href="/login">Go to login</Link></Button>
      </CardContent>
    </Card>;
  }
  return <>{children}</>;
}
