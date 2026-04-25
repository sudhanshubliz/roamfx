import type React from "react";
import { AlertTriangle, Building2, ClipboardCheck, FileWarning, ListFilter, Settings, ShieldCheck, Users, WalletCards } from "lucide-react";
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

const auditLogs = [
  { time: "10:42", actor: "admin@roamfx.app", action: "PARTNER_VERIFICATION_VERIFIED", target: "Delhi Forex Hub" },
  { time: "10:18", actor: "partner@roamfx.app", action: "RATE_UPDATED", target: "USD/INR" },
  { time: "09:55", actor: "admin@roamfx.app", action: "KYC_DOCUMENT_VERIFIED", target: "RFX-10482" },
  { time: "09:20", actor: "partner@roamfx.app", action: "BOOKING_STATUS_CHANGED", target: "RFX-10479" }
];

const pendingPartners = [
  { name: "Bengaluru Global Forex", type: "TRAVEL_FOREX_PARTNER", city: "Bengaluru", age: "2d", status: "PENDING" },
  { name: "Jaipur Safe Money", type: "FFMC", city: "Jaipur", age: "5h", status: "PENDING" }
];

const suspiciousRates = [
  { partner: "Delhi Forex Hub", pair: "THB/INR", sell: 2.62, mid: 2.3, deviation: "13.91%" },
  { partner: "Mumbai Travel Money", pair: "JPY/INR", sell: 0.61, mid: 0.55, deviation: "10.91%" }
];

export default function Page() {
  return <AppShell>
    <RoleGuard allow={["PLATFORM_ADMIN"]}>
      <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6">
        <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-2">
            <Badge variant="secondary" className="w-fit"><ShieldCheck data-icon="inline-start" /> Platform control room</Badge>
            <h1 className="text-3xl font-semibold md:text-4xl">Admin dashboard</h1>
            <p className="max-w-3xl text-muted-foreground">Monitor users, authorised partners, bookings, KYC metadata, community safety, suspicious rates, settings, and audit trails.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_160px_auto]">
            <Input placeholder="Search users, partners, bookings" />
            <Select defaultValue="24h"><option value="24h">Last 24h</option><option value="7d">Last 7d</option><option value="30d">Last 30d</option></Select>
            <Button variant="outline"><ListFilter data-icon="inline-start" /> Filters</Button>
          </div>
        </section>

        <ComplianceBanner />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric title="Total users" value="1,284" detail="+42 this week" icon={<Users />} />
          <Metric title="Verified partners" value="42" detail="8 cities covered" icon={<Building2 />} />
          <Metric title="Pending verification" value="7" detail="2 require license review" icon={<ClipboardCheck />} />
          <Metric title="Booking volume" value="₹1.8Cr" detail="312 bookings this month" icon={<WalletCards />} />
          <Metric title="Pending KYC docs" value="19" detail="5 above threshold" icon={<FileWarning />} />
          <Metric title="Flagged posts" value="4" detail="Community moderation queue" icon={<AlertTriangle />} />
          <Metric title="Suspicious rates" value="2" detail="Deviation above 8%" icon={<AlertTriangle />} />
          <Metric title="Audit events" value="86" detail="Last 24 hours" icon={<ShieldCheck />} />
        </section>

        <Card>
          <CardHeader><CardTitle>Beta waitlist</CardTitle><CardDescription>Public beta interest by use case and city.</CardDescription></CardHeader>
          <CardContent>
            <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>City</TableHead><TableHead>Destination</TableHead><TableHead>Interest</TableHead></TableRow></TableHeader><TableBody>
              {[
                ["Riya Kapoor", "Delhi", "Singapore", "BUY_FOREX"],
                ["TravelMint LLP", "Mumbai", "Partner onboarding", "PARTNER_LISTING"],
                ["Vikram S", "Bengaluru", "Dubai", "SELL_LEFTOVER"]
              ].map(([name, city, destination, interest]) => <TableRow key={name}><TableCell className="font-medium">{name}</TableCell><TableCell>{city}</TableCell><TableCell>{destination}</TableCell><TableCell><Badge variant="outline">{interest}</Badge></TableCell></TableRow>)}
            </TableBody></Table>
          </CardContent>
        </Card>

        <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <Card>
            <CardHeader><CardTitle>Platform activity</CardTitle><CardDescription>Booking and verification trend placeholder.</CardDescription></CardHeader>
            <CardContent>
              <div className="h-64 rounded-lg border bg-accent/40 p-4">
                <div className="flex items-center justify-between"><div className="text-sm font-medium">Chart placeholder</div><Badge variant="outline">Bookings · KYC · Partners</Badge></div>
                <div className="mt-10 grid h-36 grid-cols-12 items-end gap-2">{[38, 54, 48, 72, 66, 80, 58, 90, 76, 88, 70, 96].map((h, i) => <div key={i} className="rounded-t bg-primary/70" style={{ height: `${h}%` }} />)}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Platform settings</CardTitle><CardDescription>Operational controls for compliance thresholds and rate monitoring.</CardDescription></CardHeader>
            <CardContent className="grid gap-3">
              <Setting label="Rate lock window" value="30 minutes" />
              <Setting label="Cash payment threshold" value="₹50,000" />
              <Setting label="Suspicious rate deviation" value="8%" />
              <Setting label="AI advisor provider" value="mock" />
              <Button><Settings data-icon="inline-start" /> Save settings</Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Partner verification workflow</CardTitle><CardDescription>Review authorised entity details before public visibility.</CardDescription></CardHeader>
            <CardContent>
              <Table><TableHeader><TableRow><TableHead>Partner</TableHead><TableHead>License</TableHead><TableHead>City</TableHead><TableHead>Age</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>
                {pendingPartners.map(partner => <TableRow key={partner.name}><TableCell className="font-medium">{partner.name}</TableCell><TableCell>{partner.type}</TableCell><TableCell>{partner.city}</TableCell><TableCell>{partner.age}</TableCell><TableCell><div className="flex gap-2"><Button size="sm">Verify</Button><Button size="sm" variant="outline">Reject</Button></div></TableCell></TableRow>)}
              </TableBody></Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Suspicious rates</CardTitle><CardDescription>Rates deviating from mock mid-market beyond configured threshold.</CardDescription></CardHeader>
            <CardContent>
              <Table><TableHeader><TableRow><TableHead>Partner</TableHead><TableHead>Pair</TableHead><TableHead>Sell</TableHead><TableHead>Mid</TableHead><TableHead>Deviation</TableHead></TableRow></TableHeader><TableBody>
                {suspiciousRates.map(rate => <TableRow key={`${rate.partner}-${rate.pair}`}><TableCell className="font-medium">{rate.partner}</TableCell><TableCell>{rate.pair}</TableCell><TableCell>{rate.sell}</TableCell><TableCell>{rate.mid}</TableCell><TableCell><Badge variant="destructive">{rate.deviation}</Badge></TableCell></TableRow>)}
              </TableBody></Table>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader><CardTitle>Audit log viewer</CardTitle><CardDescription>Sensitive admin and partner actions.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="grid gap-2 sm:grid-cols-[1fr_150px]"><Input placeholder="Search audit logs" /><Select defaultValue="all"><option value="all">All actions</option><option value="partner">Partner</option><option value="kyc">KYC</option><option value="rate">Rate</option></Select></div>
              <Table><TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Actor</TableHead><TableHead>Action</TableHead><TableHead>Target</TableHead></TableRow></TableHeader><TableBody>
                {auditLogs.map(log => <TableRow key={`${log.time}-${log.action}`}><TableCell>{log.time}</TableCell><TableCell>{log.actor}</TableCell><TableCell><Badge variant="outline">{log.action}</Badge></TableCell><TableCell>{log.target}</TableCell></TableRow>)}
              </TableBody></Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Community safety queue</CardTitle><CardDescription>Flagged posts and unsafe exchange language review.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-3">
              {["Potential user-to-user exchange wording", "Suspicious dealer recommendation", "Airport fee complaint", "Duplicate rate alert"].map((item, index) => <div key={item} className="flex items-center justify-between gap-3 rounded-lg border p-3"><div><div className="font-medium">{item}</div><div className="text-sm text-muted-foreground">Flagged {index + 1}h ago</div></div><Badge variant={index < 2 ? "destructive" : "outline"}>{index < 2 ? "Review" : "Info"}</Badge></div>)}
            </CardContent>
          </Card>
        </section>
      </main>
    </RoleGuard>
  </AppShell>;
}

function Metric({ title, value, detail, icon }: { title: string; value: string; detail: string; icon: React.ReactNode }) {
  return <Card><CardHeader className="pb-2"><CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">{title}{icon}</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{value}</div><p className="mt-1 text-xs text-muted-foreground">{detail}</p></CardContent></Card>;
}

function Setting({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-lg border p-3"><div className="text-sm text-muted-foreground">{label}</div><div className="font-medium">{value}</div></div>;
}
