"use client";

import { useState } from "react";
import { ArrowRight, Banknote, Clock3, ShieldCheck, Store, Truck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ComplianceBanner } from "@/components/compliance-banner";
import { api, demoPartners, type Booking, type QuoteBreakdown } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function Page() {
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState(500);
  const [mode, setMode] = useState("STORE_VISIT");
  const [quote, setQuote] = useState<QuoteBreakdown | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getQuote() {
    setLoading(true); setError(""); setBooking(null);
    try {
      const next = await api<QuoteBreakdown>("/api/bookings/quote", {
        method: "POST",
        body: JSON.stringify({
          partnerId: demoPartners[0].id,
          bookingType: "SELL_LEFTOVER_FOREX",
          sourceCurrency: currency,
          targetCurrency: "INR",
          sourceAmount: amount,
          paymentMode: "BANK_TRANSFER",
          fulfilmentMode: mode
        })
      });
      setQuote(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate sell-back quote");
    } finally {
      setLoading(false);
    }
  }

  async function reserveSellBack() {
    setLoading(true); setError("");
    try {
      const created = await api<Booking>("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          partnerId: demoPartners[0].id,
          bookingType: "SELL_LEFTOVER_FOREX",
          sourceCurrency: currency,
          targetCurrency: "INR",
          sourceAmount: amount,
          paymentMode: "BANK_TRANSFER",
          fulfilmentMode: mode,
          purposeOfTravel: "Leftover currency buyback",
          idempotencyKey: `sellback-${currency}-${amount}-${mode}`
        })
      });
      setBooking(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reserve sell-back request");
    } finally {
      setLoading(false);
    }
  }

  return <AppShell>
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex flex-col gap-5">
        <div>
          <Badge variant="secondary"><ShieldCheck data-icon="inline-start" /> Compliance-safe buyback</Badge>
          <h1 className="mt-3 text-3xl font-semibold">Sell leftover currency</h1>
          <p className="mt-2 text-muted-foreground">Declare leftover travel cash and route it to a verified authorised partner. RoamFX never enables user-to-user cash meetups.</p>
        </div>
        <ComplianceBanner />
        <Card>
          <CardHeader>
            <CardTitle>Get a sell-back quote</CardTitle>
            <CardDescription>Quote includes partner fee, tax, payout ETA, and KYC requirement.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">Currency<Select value={currency} onChange={(event) => setCurrency(event.target.value)}><option>USD</option><option>EUR</option><option>GBP</option><option>AED</option><option>SGD</option></Select></label>
              <label className="grid gap-1 text-sm font-medium">Amount<Input value={amount} inputMode="numeric" onChange={(event) => setAmount(Number(event.target.value.replace(/\D/g, "")) || 0)} /></label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button onClick={() => setMode("STORE_VISIT")} className={`rounded-lg border p-4 text-left ${mode === "STORE_VISIT" ? "border-teal-700 bg-teal-50" : ""}`}><Store className="mb-2" /> Store visit<div className="text-sm text-muted-foreground">Fastest review and payout</div></button>
              <button onClick={() => setMode("PICKUP")} className={`rounded-lg border p-4 text-left ${mode === "PICKUP" ? "border-teal-700 bg-teal-50" : ""}`}><Truck className="mb-2" /> Pickup request<div className="text-sm text-muted-foreground">Partner confirms availability</div></button>
            </div>
            <Button onClick={getQuote} disabled={loading || amount <= 0}>{loading ? "Checking..." : "Generate authorised partner quote"} <ArrowRight data-icon="inline-end" /></Button>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-5">
        {error ? <Alert className="border-destructive/40"><AlertTitle>Sell-back unavailable</AlertTitle><AlertDescription>{error}</AlertDescription></Alert> : null}
        {quote ? <Card>
          <CardHeader>
            <CardTitle>Estimated payout</CardTitle>
            <CardDescription>{demoPartners[0].businessName} · final acceptance after partner review and KYC.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-lg bg-teal-50 p-5">
              <div className="text-sm text-muted-foreground">Payout to bank account</div>
              <div className="mt-2 text-3xl font-semibold">₹{quote.payoutAmount.toLocaleString("en-IN")}</div>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Clock3 size={16} /> ETA {new Date(quote.payoutEta).toLocaleDateString()}</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Mini label="Partner buy rate" value={`₹${quote.lockedRate}`} />
              <Mini label="Fee + tax" value={`₹${(quote.serviceFee + quote.taxes + quote.fulfilmentFee).toLocaleString("en-IN")}`} />
              <Mini label="KYC" value={quote.kycRequired ? "Required" : "Not required"} />
            </div>
            <Alert><Banknote data-icon="inline-start" /><AlertTitle>No P2P exchange</AlertTitle><AlertDescription>{quote.complianceNotice}</AlertDescription></Alert>
            <Button onClick={reserveSellBack} disabled={loading}>Reserve sell-back request</Button>
          </CardContent>
        </Card> : <Card><CardContent className="p-6 text-muted-foreground">Generate a quote to see payout, partner fee, KYC status, and settlement ETA.</CardContent></Card>}

        {booking ? <Alert className="border-emerald-300 bg-emerald-50"><ShieldCheck data-icon="inline-start" /><AlertTitle>Sell-back request reserved</AlertTitle><AlertDescription>{booking.bookingReference} is now {booking.status.replaceAll("_", " ")} with settlement state {booking.settlementState}. Complete this only through the verified partner.</AlertDescription></Alert> : null}
      </section>
    </main>
  </AppShell>;
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 font-semibold">{value}</div></div>;
}
