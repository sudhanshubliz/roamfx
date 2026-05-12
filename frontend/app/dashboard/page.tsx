"use client";

import type React from "react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, CalendarClock, CheckCircle2, Clock3, FileCheck2, MapPin, ReceiptText, Repeat2, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ComplianceBanner } from "@/components/compliance-banner";
import { RoleGuard } from "@/components/role-guard";
import { api, demoPartners, type Booking, type QuoteBreakdown, type RateView } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const statusSteps = ["PENDING_KYC", "RATE_LOCKED", "PARTNER_REVIEW", "CONFIRMED", "READY_FOR_PICKUP", "COMPLETED"];

export default function Page() {
  const [city, setCity] = useState("Delhi");
  const [currency, setCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1000);
  const [fulfilmentMode, setFulfilmentMode] = useState("PICKUP");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [selectedPartnerId, setSelectedPartnerId] = useState(demoPartners[0].id);
  const [quote, setQuote] = useState<QuoteBreakdown | null>(null);
  const [created, setCreated] = useState<Booking | null>(null);
  const [actionError, setActionError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const rates = useQuery({
    queryKey: ["dashboard-rates", currency],
    queryFn: () => api<RateView[]>(`/api/rates/search?sourceCurrency=${currency}&targetCurrency=INR&sort=best-rate`)
  });
  const bookings = useQuery({
    queryKey: ["dashboard-bookings"],
    queryFn: () => api<Booking[]>("/api/bookings/my")
  });

  const selectedRate = useMemo(() => rates.data?.find((item) => item.partnerId === selectedPartnerId) ?? rates.data?.[0], [rates.data, selectedPartnerId]);
  const activeBooking = created ?? bookings.data?.[0];
  const lockMinutes = quote ? Math.max(0, Math.round((new Date(quote.rateLockExpiresAt).getTime() - Date.now()) / 60000)) : null;

  async function requestQuote() {
    setSubmitting(true);
    setActionError("");
    setCreated(null);
    try {
      const partnerId = selectedRate?.partnerId ?? selectedPartnerId;
      const next = await api<QuoteBreakdown>("/api/bookings/quote", {
        method: "POST",
        body: JSON.stringify({
          partnerId,
          bookingType: "BUY_FOREX",
          sourceCurrency: currency,
          targetCurrency: "INR",
          sourceAmount: amount,
          paymentMode,
          fulfilmentMode
        })
      });
      setSelectedPartnerId(partnerId);
      setQuote(next);
      trackEvent("quote_returned", { currency, city, cashAllowed: next.cashAllowed, kycRequired: next.kycRequired });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not generate quote");
    } finally {
      setSubmitting(false);
    }
  }

  async function lockRate() {
    if (!quote) return;
    setSubmitting(true);
    setActionError("");
    try {
      const booking = await api<Booking>("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          partnerId: selectedRate?.partnerId ?? selectedPartnerId,
          bookingType: "BUY_FOREX",
          sourceCurrency: currency,
          targetCurrency: "INR",
          sourceAmount: amount,
          paymentMode,
          fulfilmentMode,
          travelCountry: city,
          purposeOfTravel: "Private travel",
          idempotencyKey: `traveller-${currency}-${amount}-${selectedRate?.partnerId ?? selectedPartnerId}`
        })
      });
      setCreated(booking);
      trackEvent("rate_locked", { bookingReference: booking.bookingReference, currency });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not lock rate");
    } finally {
      setSubmitting(false);
    }
  }

  return <AppShell>
    <RoleGuard allow={["TRAVELLER"]}>
      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 xl:grid-cols-[1fr_0.72fr]">
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Badge variant="secondary" className="w-fit"><ShieldCheck data-icon="inline-start" /> Traveller command centre</Badge>
            <h1 className="text-3xl font-semibold md:text-4xl">Plan, compare, lock, and track travel forex.</h1>
            <p className="max-w-3xl text-muted-foreground">A compliance-safe journey for buying forex and selling leftovers through verified authorised partners only.</p>
          </div>
          <ComplianceBanner />

          <Card>
            <CardHeader>
              <CardTitle>Quote-to-book workspace</CardTitle>
              <CardDescription>Choose route, compare verified partners, see the full price breakdown, then lock a short rate window.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-5">
                <label className="grid gap-1 text-sm font-medium md:col-span-2">City or trip region<Input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Delhi, Mumbai, Bengaluru" /></label>
                <label className="grid gap-1 text-sm font-medium">Currency<Select value={currency} onChange={(event) => setCurrency(event.target.value)}>{["USD","EUR","GBP","AED","SGD","THB","JPY"].map((item) => <option key={item}>{item}</option>)}</Select></label>
                <label className="grid gap-1 text-sm font-medium">Amount<Input inputMode="numeric" value={amount} onChange={(event) => setAmount(Number(event.target.value.replace(/\D/g, "")) || 0)} /></label>
                <label className="grid gap-1 text-sm font-medium">Payment<Select value={paymentMode} onChange={(event) => setPaymentMode(event.target.value)}><option>UPI</option><option>CARD</option><option>BANK_TRANSFER</option><option>CASH</option></Select></label>
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <div className="grid gap-3 sm:grid-cols-3">
                  {["PICKUP", "STORE_VISIT", "DELIVERY"].map((mode) => <button key={mode} onClick={() => setFulfilmentMode(mode)} className={`rounded-lg border p-3 text-left text-sm ${fulfilmentMode === mode ? "border-teal-700 bg-teal-50" : "bg-card"}`}>
                    <div className="font-medium">{mode.replace("_", " ")}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{mode === "DELIVERY" ? "Adds fulfilment fee" : "Partner confirms slot"}</div>
                  </button>)}
                </div>
                <Button onClick={requestQuote} disabled={submitting || amount <= 0}>{submitting ? "Checking..." : "Generate quote"} <ArrowRight data-icon="inline-end" /></Button>
              </div>

              {rates.isLoading ? <div className="rounded-lg border p-4 text-sm text-muted-foreground">Loading verified partner rates...</div> : null}
              {rates.error ? <Alert className="border-destructive/40"><AlertCircle data-icon="inline-start" /><AlertTitle>Rates unavailable</AlertTitle><AlertDescription>Could not load partner rates. Demo fallback may be disabled.</AlertDescription></Alert> : null}
              {rates.data?.length ? <div className="grid gap-3 md:grid-cols-3">
                {rates.data.slice(0, 3).map((rate) => <button key={rate.id} onClick={() => setSelectedPartnerId(rate.partnerId)} className={`rounded-lg border p-4 text-left ${selectedPartnerId === rate.partnerId ? "border-teal-700 bg-teal-50" : "bg-card"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold">{rate.partnerName}</div>
                    <Badge variant={rate.suspicious ? "destructive" : "secondary"}>{rate.suspicious ? "Review rate" : "Fair band"}</Badge>
                  </div>
                  <div className="mt-3 text-2xl font-semibold">₹{Number(rate.sellRate).toFixed(2)}</div>
                  <div className="mt-1 text-sm text-muted-foreground">Fee ₹{Number(rate.serviceFee).toFixed(0)} · {rate.freshness}</div>
                </button>)}
              </div> : null}
            </CardContent>
          </Card>

          {quote ? <Card>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2">Price breakdown <Badge variant={quote.cashAllowed ? "secondary" : "destructive"}>{quote.cashAllowed ? "Cash rule OK" : "Cash blocked"}</Badge></CardTitle>
              <CardDescription>{quote.complianceNotice}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-4">
                <Mini label="FX amount" value={`₹${quote.fxAmount.toLocaleString("en-IN")}`} />
                <Mini label="Spread + markup" value={`₹${(quote.spreadAmount + quote.markupAmount).toLocaleString("en-IN")}`} />
                <Mini label="Fees + tax" value={`₹${(quote.serviceFee + quote.taxes + quote.fulfilmentFee).toLocaleString("en-IN")}`} />
                <Mini label="Total payable" value={`₹${quote.totalPayable.toLocaleString("en-IN")}`} strong />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
                <div>
                  <div className="font-medium">Rate lock preview</div>
                  <div className="text-sm text-muted-foreground">Expires in about {lockMinutes} minutes. KYC {quote.kycRequired ? "is required" : "may not be required"}.</div>
                </div>
                <Button onClick={lockRate} disabled={submitting || !quote.cashAllowed}>{quote.cashAllowed ? "Lock rate with partner" : "Select non-cash payment"}</Button>
              </div>
            </CardContent>
          </Card> : null}

          {actionError ? <Alert className="border-destructive/40"><AlertCircle data-icon="inline-start" /><AlertTitle>Action needed</AlertTitle><AlertDescription>{actionError}</AlertDescription></Alert> : null}
          {created ? <Alert className="border-emerald-300 bg-emerald-50"><CheckCircle2 data-icon="inline-start" /><AlertTitle>Booking created</AlertTitle><AlertDescription>{created.bookingReference} is {created.status.replaceAll("_", " ")}. Upload KYC metadata if requested and wait for partner confirmation.</AlertDescription></Alert> : null}
        </section>

        <aside className="flex flex-col gap-5">
          <Card>
            <CardHeader><CardTitle>Active booking tracker</CardTitle><CardDescription>Timeline and next action for your latest booking.</CardDescription></CardHeader>
            <CardContent className="grid gap-3">
              {bookings.isLoading ? <div className="rounded-lg border p-4 text-sm text-muted-foreground">Loading bookings...</div> : null}
              {!bookings.isLoading && !activeBooking ? <div className="rounded-lg border p-4 text-sm text-muted-foreground">No bookings yet. Generate a quote to start.</div> : null}
              {activeBooking ? <>
                <div className="rounded-lg border p-4">
                  <div className="font-semibold">{activeBooking.bookingReference}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{activeBooking.partner.businessName} · ₹{activeBooking.totalPayable.toLocaleString("en-IN")}</div>
                </div>
                <div className="grid gap-2">
                  {statusSteps.map((step) => <div key={step} className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${activeBooking.status === step ? "border-teal-700 bg-teal-50" : "bg-card"}`}>
                    <span className="grid size-7 place-items-center rounded-full bg-muted"><Clock3 size={15} /></span>
                    <span>{step.replaceAll("_", " ")}</span>
                  </div>)}
                </div>
              </> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Traveller shortcuts</CardTitle><CardDescription>Repeat and prepare common travel-money tasks.</CardDescription></CardHeader>
            <CardContent className="grid gap-2">
              <Shortcut href="/documents" icon={<FileCheck2 />} title="Upload KYC metadata" />
              <Shortcut href="/sell-leftover" icon={<Repeat2 />} title="Sell leftover currency" />
              <Shortcut href="/planner" icon={<Sparkles />} title="AI travel money plan" />
              <Shortcut href="/profile" icon={<UserRound />} title="Saved travellers" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Trip reminders</CardTitle><CardDescription>Demo reminders that become notification jobs later.</CardDescription></CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <Reminder icon={<CalendarClock />} title="Europe trip" detail="Lock EUR 5-7 days before departure." />
              <Reminder icon={<MapPin />} title="Airport warning" detail="Avoid emergency airport exchange except small top-ups." />
              <Reminder icon={<ReceiptText />} title="Receipts" detail="Keep partner invoice and KYC proof for travel records." />
            </CardContent>
          </Card>
        </aside>
      </main>
    </RoleGuard>
  </AppShell>;
}

function Mini({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">{label}</div><div className={`mt-1 ${strong ? "text-xl font-semibold" : "font-semibold"}`}>{value}</div></div>;
}

function Shortcut({ href, icon, title }: { href: string; icon: React.ReactNode; title: string }) {
  return <Button asChild variant="outline" className="justify-start"><Link href={href}>{icon}{title}</Link></Button>;
}

function Reminder({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return <div className="flex gap-3 rounded-lg border p-3">{icon}<div><div className="font-medium">{title}</div><div className="text-muted-foreground">{detail}</div></div></div>;
}
