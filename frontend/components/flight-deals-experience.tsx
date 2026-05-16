"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeftRight, Calendar, Plane, Search, Sparkles, Tag, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { LovablePageHero } from "@/components/lovable-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { flightDeals, type FlightDeal } from "@/lib/lovable-platform";

const predictionCopy: Record<FlightDeal["prediction"], string> = {
  buy_now: "Book now",
  wait: "Wait 3 days",
  may_rise: "Price may rise",
  may_drop: "Price may drop"
};

export function FlightDealsExperience() {
  const [searched, setSearched] = useState(false);
  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("DXB");
  const [selected, setSelected] = useState<FlightDeal | null>(null);
  const results = useMemo(() => flightDeals.map((flight) => ({ ...flight, fromCode: from || flight.fromCode, toCode: to || flight.toCode })), [from, to]);

  return <AppShell>
    <LovablePageHero eyebrow="Flights" title="Smart flight deals with AI price prediction" subtitle="Book now or wait. Roam AI analyses demo price trends to suggest the best timing, then nudges travellers to bundle forex safely through verified partners." />
    <section className="mx-auto max-w-7xl px-4 py-8">
      <Card className="rounded-2xl shadow-card">
        <CardContent className="p-4 md:p-6">
          <div className="mb-4 flex gap-2">
            <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Round trip</button>
            <button className="rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-muted-foreground">One-way</button>
          </div>
          <div className="grid gap-3 md:grid-cols-12">
            <Field className="md:col-span-3" label="From" icon={<Plane className="h-4 w-4 text-muted-foreground" />} value={from} onChange={setFrom} />
            <div className="flex items-end justify-center md:col-span-1"><ArrowLeftRight className="mb-3 h-5 w-5 text-muted-foreground" /></div>
            <Field className="md:col-span-3" label="To" icon={<Plane className="h-4 w-4 rotate-90 text-muted-foreground" />} value={to} onChange={setTo} />
            <Field className="md:col-span-2" label="Departure" icon={<Calendar className="h-4 w-4 text-muted-foreground" />} type="date" />
            <Field className="md:col-span-2" label="Return" icon={<Calendar className="h-4 w-4 text-muted-foreground" />} type="date" />
            <Field className="md:col-span-1" label="Pax" icon={<Users className="h-4 w-4 text-muted-foreground" />} type="number" value="1" />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" /> Flexible dates (+/- 3 days)</label>
            <Button size="lg" className="bg-gradient-hero" onClick={() => setSearched(true)}><Search className="h-4 w-4" /> Search flights</Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {!searched ? <div className="rounded-2xl border border-dashed p-10 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">Search to see mock flight deals with AI price prediction.</p>
          </div> : results.map((flight) => <FlightCard key={flight.id} flight={flight} onSelect={setSelected} />)}
        </div>
        <div className="space-y-4">
          <Card className="rounded-2xl shadow-card">
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold">AI price intelligence</h2>
              <p className="mt-2 text-sm text-muted-foreground">{selected ? `${predictionCopy[selected.prediction]} with ${selected.predictionConfidence}% confidence.` : "Select a flight to see price prediction."}</p>
              <div className="mt-4 rounded-xl bg-primary/10 p-4 text-sm text-primary">Cheapest nearby date could save Rs 1,850.</div>
            </CardContent>
          </Card>
          <FeatureList title="Hopper-style features" items={["Price Freeze", "Fare Drop Alert", "Flexible Date Savings", "Refundable Upgrade"]} />
          <FeatureList title="Skyscanner-style features" items={["Explore Everywhere", "Cheapest Month", "Nearby Airports", "Flexible Date Calendar"]} />
        </div>
      </div>

      {selected ? <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-4 rounded-xl bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary">Selected</div>
            <div className="font-semibold">{selected.airline} {selected.fromCode} to {selected.toCode} • Rs {selected.price.toLocaleString("en-IN")}</div>
          </div>
          <Button className="bg-gradient-hero">Reserve flight</Button>
        </div>
        <Card className="rounded-2xl border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">Bundle with verified partner forex</h3>
              <p className="mt-1 text-sm text-muted-foreground">Use coupon FLIGHTFX and continue to smart checkout for flight + forex planning.</p>
            </div>
            <Button asChild className="bg-gradient-hero"><a href="/checkout?service=bundle">Bundle & checkout</a></Button>
          </CardContent>
        </Card>
      </div> : null}

      <div className="mt-8 flex items-start gap-2 rounded-xl bg-warning/10 p-4 text-xs text-warning-foreground">
        <AlertTriangle className="h-4 w-4 flex-none" />
        <span>Flight prices are demo/indicative. Real ticketing requires integration with flight suppliers, GDS or OTA APIs. Forex flows still route only through verified authorised partners.</span>
      </div>
    </section>
  </AppShell>;
}

function Field({ label, icon, type = "text", value, onChange, className = "" }: { label: string; icon: React.ReactNode; type?: string; value?: string; onChange?: (value: string) => void; className?: string }) {
  return <label className={className}>
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
    <span className="relative mt-1 block">
      <span className="absolute left-3 top-3">{icon}</span>
      <Input type={type} className="pl-9" value={value} onChange={(event) => onChange?.(event.target.value.toUpperCase())} />
    </span>
  </label>;
}

function FlightCard({ flight, onSelect }: { flight: FlightDeal; onSelect: (flight: FlightDeal) => void }) {
  return <Card className="rounded-2xl shadow-card">
    <CardContent className="p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-sm font-bold">{flight.airlineCode}</div>
          <div>
            <div className="text-sm font-semibold">{flight.airline}</div>
            <div className="text-xs text-muted-foreground">{flight.baggage} • {flight.refundable ? "Refundable" : "Non-refundable"}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Time time={flight.departure} code={flight.fromCode} />
          <div className="flex flex-col items-center text-xs text-muted-foreground"><div>{flight.duration}</div><div className="my-1 flex items-center gap-1"><div className="h-px w-12 bg-border" /><Plane className="h-3 w-3" /><div className="h-px w-12 bg-border" /></div><div>{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</div></div>
          <Time time={flight.arrival} code={flight.toCode} />
        </div>
        <div className="text-left md:text-right">
          <div className="text-2xl font-bold">Rs {flight.price.toLocaleString("en-IN")}</div>
          <div className="text-xs text-muted-foreground">per traveller</div>
          <Button size="sm" className="mt-2 bg-gradient-hero" onClick={() => onSelect(flight)}>Select</Button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3 text-xs">
        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary"><Sparkles className="h-3 w-3" /> AI: {predictionCopy[flight.prediction]} ({flight.predictionConfidence}%)</span>
        <span className="rounded-full bg-secondary px-2 py-1 text-muted-foreground">Deal score {flight.dealScore}/100</span>
        {flight.couponEligible ? <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary"><Tag className="h-3 w-3" /> FLIGHTFX eligible</span> : null}
      </div>
    </CardContent>
  </Card>;
}

function Time({ time, code }: { time: string; code: string }) {
  return <div className="text-center"><div className="text-lg font-bold">{time}</div><div className="text-xs text-muted-foreground">{code}</div></div>;
}

function FeatureList({ title, items }: { title: string; items: string[] }) {
  return <Card className="rounded-2xl shadow-card"><CardContent className="p-5"><h3 className="text-sm font-semibold">{title}</h3><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{items.map((item) => <li key={item}>• {item}</li>)}</ul></CardContent></Card>;
}
