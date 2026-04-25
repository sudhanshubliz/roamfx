import { AppShell } from "@/components/app-shell";
import { ComplianceBanner } from "@/components/compliance-banner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoleGuard } from "@/components/role-guard";

type Role = "TRAVELLER" | "PARTNER_ADMIN" | "PLATFORM_ADMIN";

export function PageTemplate({ title, description, items, allow }: { title: string; description: string; items: string[]; allow?: Role[] }) {
  const content = <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6"><div className="flex flex-col gap-2"><Badge variant="secondary" className="w-fit">RoamFX MVP</Badge><h1 className="text-3xl font-semibold md:text-4xl">{title}</h1><p className="max-w-3xl text-muted-foreground">{description}</p></div><ComplianceBanner /><div className="grid gap-4 md:grid-cols-3">{items.map(item => <Card key={item}><CardHeader><CardTitle className="text-base">{item}</CardTitle><CardDescription>Production API-backed surface with loading, empty, and role-aware states planned into the MVP.</CardDescription></CardHeader><CardContent className="text-sm text-muted-foreground">Includes guarded access, clear empty-state language, and backend-aligned compliance copy.</CardContent></Card>)}</div></main>;
  return <AppShell>{allow ? <RoleGuard allow={allow}>{content}</RoleGuard> : content}</AppShell>;
}
