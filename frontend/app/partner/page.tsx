import type React from "react";
import { AlertTriangle, CheckCircle2, Clock3, FileCheck2, IndianRupee, PackageCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ComplianceBanner } from "@/components/compliance-banner";
import { RoleGuard } from "@/components/role-guard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const requests = [
  { ref: "RFX-10482", traveller: "Aarav Mehta", pair: "USD/INR", amount: "$1,200", status: "PENDING_KYC", mode: "Pickup", lock: "18m" },
  { ref: "RFX-10479", traveller: "Nisha Rao", pair: "EUR/INR", amount: "€850", status: "PARTNER_REVIEW", mode: "Store visit", lock: "26m" },
  { ref: "RFX-10477", traveller: "Kabir S", pair: "AED/INR", amount: "د.إ2,400", status: "CONFIRMED", mode: "Delivery", lock: "Locked" }
];

const kyc = [
  { traveller: "Aarav Mehta", document: "Passport + PAN", booking: "RFX-10482", age: "12m", risk: "Threshold" },
  { traveller: "Mira Shah", document: "Flight ticket", booking: "RFX-10461", age: "44m", risk: "Travel proof" }
];

const rates = [
  { pair: "USD/INR", sell: 83.95, mid: 83.5, inventory: "50,000 USD", deviation: 0.54 },
  { pair: "EUR/INR", sell: 90.15, mid: 89.8, inventory: "30,000 EUR", deviation: 0.39 },
  { pair: "THB/INR", sell: 2.62, mid: 2.3, inventory: "90,000 THB", deviation: 13.91 }
];

const workflow = ["PENDING_KYC", "RATE_LOCKED", "PARTNER_REVIEW", "CONFIRMED", "READY_FOR_PICKUP", "COMPLETED"];

export default function Page() {
  return <AppShell>
    <RoleGuard allow={["PARTNER_ADMIN"]}>
      <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6">
        <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <Badge variant="secondary" className="w-fit"><ShieldCheck data-icon="inline-start" /> Partner workspace</Badge>
            <h1 className="text-3xl font-semibold md:text-4xl">Partner dashboard</h1>
            <p className="max-w-3xl text-muted-foreground">Manage today’s forex requests, KYC metadata, rate cards, inventory, and fulfilment workflow through authorised partner operations.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input placeholder="Search booking or traveller" />
            <Select defaultValue="today"><option value="today">Today</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option></Select>
          </div>
        </section>

        <ComplianceBanner />
        <Alert className="border-destructive/40 bg-card">
          <AlertTriangle data-icon="inline-start" />
          <AlertTitle>Suspicious rate warning</AlertTitle>
          <AlertDescription>THB/INR sell rate deviates 13.91% from mock mid-market. Review markup and fee visibility before publishing.</AlertDescription>
        </Alert>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric title="Today’s requests" value="18" detail="7 awaiting partner action" icon={<Clock3 />} />
          <Metric title="Pending KYC" value="6" detail="2 above threshold" icon={<FileCheck2 />} />
          <Metric title="Inventory value" value="₹42.8L" detail="Across 7 currencies" icon={<PackageCheck />} />
          <Metric title="Commission today" value="₹18,420" detail="₹3,200 pending settlement" icon={<IndianRupee />} />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Today’s booking requests</CardTitle>
              <CardDescription>Rate locks, fulfilment mode, and next partner action.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table><TableHeader><TableRow><TableHead>Reference</TableHead><TableHead>Traveller</TableHead><TableHead>Pair</TableHead><TableHead>Status</TableHead><TableHead>Lock</TableHead></TableRow></TableHeader><TableBody>
                {requests.map(row => <TableRow key={row.ref}><TableCell className="font-medium">{row.ref}</TableCell><TableCell>{row.traveller}<div className="text-xs text-muted-foreground">{row.mode}</div></TableCell><TableCell>{row.pair}<div className="text-xs text-muted-foreground">{row.amount}</div></TableCell><TableCell><StatusBadge status={row.status} /></TableCell><TableCell>{row.lock}</TableCell></TableRow>)}
              </TableBody></Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking status workflow</CardTitle>
              <CardDescription>Operational handoff from KYC to completion.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {workflow.map((step, index) => <div key={step} className="flex items-center gap-3 rounded-lg border p-3"><span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm text-primary-foreground">{index + 1}</span><div className="min-w-0"><div className="truncate text-sm font-medium">{step.replaceAll("_", " ")}</div><div className="text-xs text-muted-foreground">{index < 3 ? "Partner action required" : "Fulfilment tracking"}</div></div></div>)}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Pending KYC reviews</CardTitle><CardDescription>Document metadata only; avoid logging sensitive raw data.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-3">
              {kyc.map(item => <div key={item.booking} className="rounded-lg border p-3"><div className="flex items-center justify-between gap-2"><div className="font-medium">{item.traveller}</div><Badge variant="outline">{item.age}</Badge></div><div className="mt-1 text-sm text-muted-foreground">{item.document} · {item.booking}</div><div className="mt-3 flex gap-2"><Button size="sm"><CheckCircle2 data-icon="inline-start" /> Approve</Button><Button size="sm" variant="outline">Request more</Button></div></div>)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Rate update panel</CardTitle><CardDescription>Publish rates with mid-market deviation checks.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3"><Input defaultValue="USD" /><Input defaultValue="INR" /><Input defaultValue="83.95" /><Input defaultValue="249" /></div>
              <Button><RefreshCw data-icon="inline-start" /> Update rate card</Button>
              <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">Rates above configured deviation threshold should be reviewed before customer visibility.</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Revenue and commission</CardTitle><CardDescription>Demo settlement summary.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="h-40 rounded-lg border bg-accent/40 p-4"><div className="text-sm font-medium">Chart placeholder</div><div className="mt-8 flex h-20 items-end gap-2">{[32, 54, 44, 70, 62, 86, 76].map((h, i) => <div key={i} className="flex-1 rounded-t bg-primary/70" style={{ height: `${h}%` }} />)}</div></div>
              <div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-lg border p-3"><div className="text-muted-foreground">Gross volume</div><div className="text-lg font-semibold">₹18.6L</div></div><div className="rounded-lg border p-3"><div className="text-muted-foreground">Commission</div><div className="text-lg font-semibold">₹42.4K</div></div></div>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader><CardTitle>Currency inventory</CardTitle><CardDescription>Availability, rates, and suspicious deviation monitor.</CardDescription></CardHeader>
          <CardContent>
            <Table><TableHeader><TableRow><TableHead>Pair</TableHead><TableHead>Sell</TableHead><TableHead>Mid-market</TableHead><TableHead>Inventory</TableHead><TableHead>Deviation</TableHead></TableRow></TableHeader><TableBody>
              {rates.map(rate => <TableRow key={rate.pair}><TableCell className="font-medium">{rate.pair}</TableCell><TableCell>{rate.sell}</TableCell><TableCell>{rate.mid}</TableCell><TableCell>{rate.inventory}</TableCell><TableCell>{rate.deviation > 8 ? <Badge variant="destructive">{rate.deviation}% suspicious</Badge> : <Badge variant="secondary">{rate.deviation}% fair band</Badge>}</TableCell></TableRow>)}
            </TableBody></Table>
          </CardContent>
        </Card>
      </main>
    </RoleGuard>
  </AppShell>;
}

function Metric({ title, value, detail, icon }: { title: string; value: string; detail: string; icon: React.ReactNode }) {
  return <Card><CardHeader className="pb-2"><CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">{title}{icon}</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{value}</div><p className="mt-1 text-xs text-muted-foreground">{detail}</p></CardContent></Card>;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "CONFIRMED") return <Badge variant="secondary">Confirmed</Badge>;
  if (status === "PENDING_KYC") return <Badge variant="outline">Pending KYC</Badge>;
  return <Badge>{status.replaceAll("_", " ")}</Badge>;
}
