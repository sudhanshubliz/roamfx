"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Clock3, FileCheck2, IndianRupee, PackageCheck, ShieldCheck, XCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ComplianceBanner } from "@/components/compliance-banner";
import { RoleGuard } from "@/components/role-guard";
import { api, type Booking } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const timeline = ["RATE_LOCKED", "KYC_PENDING", "PARTNER_REVIEW", "CONFIRMED", "READY_FOR_PICKUP", "COMPLETED"];

export default function Page() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Booking[]>("/api/bookings/my")
      .then(setBookings)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load bookings"))
      .finally(() => setLoading(false));
  }, []);

  const active = useMemo(() => bookings[0], [bookings]);

  return <AppShell>
    <RoleGuard allow={["TRAVELLER"]}>
      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6">
        <section>
          <Badge variant="secondary"><ShieldCheck data-icon="inline-start" /> Traveller workspace</Badge>
          <h1 className="mt-3 text-3xl font-semibold">My bookings</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">Track rate locks, KYC actions, partner review, cancellation outcomes, and pickup or delivery readiness.</p>
        </section>
        <ComplianceBanner />

        {loading ? <Card><CardContent className="p-6 text-muted-foreground">Loading your secure booking timeline...</CardContent></Card> : null}
        {error ? <Alert className="border-destructive/40"><XCircle data-icon="inline-start" /><AlertTitle>Bookings could not load</AlertTitle><AlertDescription>{error}</AlertDescription></Alert> : null}
        {!loading && !error && bookings.length === 0 ? <Card><CardContent className="p-6 text-muted-foreground">No bookings yet. Compare rates and reserve with a verified partner when you are ready.</CardContent></Card> : null}

        {active ? <Card>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2">{active.bookingReference} <StatusBadge status={active.status} /></CardTitle>
            <CardDescription>{active.partner.businessName} · {active.sourceCurrency}/{active.targetCurrency}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-3 md:grid-cols-4">
              <Metric icon={<Clock3 />} label="Rate locked until" value={new Date(active.rateLockExpiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
              <Metric icon={<IndianRupee />} label="Total payable" value={`₹${active.totalPayable.toLocaleString("en-IN")}`} />
              <Metric icon={<FileCheck2 />} label="KYC status" value={active.status === "KYC_PENDING" ? "Action needed" : "In progress"} />
              <Metric icon={<PackageCheck />} label="Settlement" value={active.settlementState ?? "NOT_REQUIRED"} />
            </div>
            <div className="rounded-lg border p-4">
              <h2 className="font-semibold">Booking timeline</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-6">
                {timeline.map((step, index) => {
                  const reached = timeline.indexOf(active.status) >= index || active.status === "KYC_PENDING" && step === "KYC_PENDING";
                  return <div key={step} className={`rounded-lg border p-3 text-sm ${reached ? "border-teal-600 bg-teal-50" : "bg-muted/30 text-muted-foreground"}`}>
                    <div className="font-medium">{step.replaceAll("_", " ")}</div>
                    <div className="mt-1 text-xs">{reached ? "Reached" : "Upcoming"}</div>
                  </div>;
                })}
              </div>
            </div>
            <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-3">
              <Breakdown label="FX amount" value={active.targetAmountEstimate} />
              <Breakdown label="Spread" value={active.spreadAmount} />
              <Breakdown label="Service fee + tax" value={(active.serviceFee ?? 0) + (active.taxes ?? 0)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">Download receipt</Button>
              <Button variant="outline">Upload KYC document</Button>
              <Button variant="destructive">Cancel before confirmation</Button>
            </div>
          </CardContent>
        </Card> : null}

        <section className="grid gap-3">
          {bookings.map((booking) => <Card key={booking.id}>
            <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">{booking.bookingReference}</div>
                <div className="text-sm text-muted-foreground">{booking.partner.businessName} · {booking.bookingType.replaceAll("_", " ")}</div>
              </div>
              <StatusBadge status={booking.status} />
            </CardContent>
          </Card>)}
        </section>
      </main>
    </RoleGuard>
  </AppShell>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-lg border p-3">{icon}<div className="mt-2 text-xs text-muted-foreground">{label}</div><div className="font-semibold">{value}</div></div>;
}

function Breakdown({ label, value }: { label: string; value?: number }) {
  return <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-semibold">₹{Number(value ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div></div>;
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  if (status === "KYC_PENDING") return <Badge variant="outline">KYC pending</Badge>;
  if (status === "CONFIRMED") return <Badge variant="secondary">Confirmed</Badge>;
  if (status === "CANCELLED" || status === "EXPIRED") return <Badge variant="destructive">{status.toLowerCase()}</Badge>;
  return <Badge>{status.replaceAll("_", " ")}</Badge>;
}
