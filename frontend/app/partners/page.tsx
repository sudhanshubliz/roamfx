"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Building2, Clock3, Filter, List, Map, Navigation, Phone, Search, ShieldCheck, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ComplianceBanner } from "@/components/compliance-banner";
import { api, type Partner } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type PartnerResponse = Partner[] | { content: Partner[] };

export default function Page() {
  const [city, setCity] = useState("Delhi");
  const [currency, setCurrency] = useState("EUR");
  const [delivery, setDelivery] = useState("any");
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const partners = useQuery({
    queryKey: ["partners", city],
    queryFn: async () => {
      const response = await api<PartnerResponse>(`/api/partners?city=${encodeURIComponent(city)}`);
      return Array.isArray(response) ? response : response.content;
    }
  });

  const rows = useMemo(() => (partners.data ?? [])
    .filter((partner) => delivery === "any" || (delivery === "delivery" ? partner.supportsDelivery : partner.supportsPickup))
    .sort((a, b) => Number(b.rating) - Number(a.rating)), [partners.data, delivery]);
  const selected = rows.find((partner) => partner.id === selectedId) ?? rows[0];

  return <AppShell>
    <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6">
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="secondary"><ShieldCheck data-icon="inline-start" /> Verified partners only</Badge>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">Find authorised forex partners</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">Compare verified partners by city, fulfilment mode, rating, opening hours, and booking convenience.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}><List data-icon="inline-start" /> List</Button>
          <Button variant={view === "map" ? "default" : "outline"} onClick={() => setView("map")}><Map data-icon="inline-start" /> Map</Button>
        </div>
      </section>
      <ComplianceBanner />

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-[1.4fr_0.8fr_0.9fr_auto]">
          <label className="flex items-center gap-2 rounded-md border px-3"><Search size={16} className="text-muted-foreground" /><Input value={city} onChange={(event) => setCity(event.target.value)} className="border-0 px-0 focus-visible:outline-0" placeholder="Delhi, Mumbai, Bengaluru" /></label>
          <Select value={currency} onChange={(event) => setCurrency(event.target.value)}>{["USD","EUR","GBP","AED","SGD","THB","JPY"].map((item) => <option key={item}>{item}</option>)}</Select>
          <Select value={delivery} onChange={(event) => setDelivery(event.target.value)}><option value="any">Any fulfilment</option><option value="delivery">Home delivery</option><option value="pickup">Pickup/store</option></Select>
          <Button variant="outline"><Filter data-icon="inline-start" /> Filters</Button>
        </CardContent>
      </Card>

      {partners.isLoading ? <Card><CardContent className="p-6 text-muted-foreground">Loading verified partners...</CardContent></Card> : null}
      {partners.error ? <Card><CardContent className="p-6 text-destructive">Could not load partners. Check backend or mock API configuration.</CardContent></Card> : null}
      {!partners.isLoading && rows.length === 0 ? <Card><CardContent className="p-6 text-muted-foreground">No verified partners found for this filter. Try another city or fulfilment mode.</CardContent></Card> : null}

      {view === "list" ? <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-3">
          {rows.map((partner) => <article key={partner.id} className={`rounded-lg border bg-card p-4 ${selected?.id === partner.id ? "border-teal-700 ring-1 ring-teal-700" : ""}`}>
            <button onClick={() => setSelectedId(partner.id)} className="w-full text-left">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{partner.businessName}</h2>
                    <BadgeCheck size={17} className="text-emerald-700" />
                    <Badge variant="secondary">{partner.licenseType}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{partner.address} · {partner.city}</p>
                </div>
                <Badge variant="outline"><Star size={14} /> {Number(partner.rating).toFixed(1)}</Badge>
              </div>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                <Info icon={<Clock3 />} label="Opening hours" value={partner.openingHours ?? "Partner confirms"} />
                <Info icon={<Building2 />} label="Modes" value={`${partner.supportsPickup ? "Pickup" : ""}${partner.supportsDelivery ? " + Delivery" : ""}`} />
                <Info icon={<ShieldCheck />} label="Status" value={partner.verificationStatus} />
              </div>
            </button>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" asChild><a href={`/dashboard?partner=${partner.id}&currency=${currency}`}>Book with partner</a></Button>
              {partner.contactPhone ? <Button size="sm" variant="outline" asChild><a href={`tel:${partner.contactPhone}`}><Phone size={14} /> Call</a></Button> : null}
              <Button size="sm" variant="outline" asChild><a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${partner.businessName}, ${partner.address ?? partner.city}`)}`}><Navigation size={14} /> Directions</a></Button>
            </div>
          </article>)}
        </div>
        <PartnerDetail partner={selected} currency={currency} />
      </section> : <section className="grid gap-4 rounded-lg border bg-card p-4 lg:grid-cols-[1fr_0.75fr]">
        <div className="relative min-h-[460px] overflow-hidden rounded-lg border bg-[radial-gradient(circle_at_20%_25%,rgba(20,184,166,0.22),transparent_20%),radial-gradient(circle_at_75%_70%,rgba(245,158,11,0.20),transparent_18%),linear-gradient(135deg,#ecfeff,#f8fafc)]">
          <div className="absolute left-6 top-6 rounded-md bg-white/90 px-3 py-2 text-sm font-medium shadow-sm">{city} · {currency}</div>
          {rows.map((partner, index) => <button key={partner.id} onClick={() => setSelectedId(partner.id)} aria-label={`Select ${partner.businessName}`} className={`absolute grid size-12 place-items-center rounded-full border-4 border-white font-bold shadow-lg transition hover:scale-110 ${selected?.id === partner.id ? "bg-teal-800 text-white" : "bg-white text-teal-800"}`} style={{ left: `${18 + (index * 22) % 64}%`, top: `${26 + (index * 17) % 52}%` }}>FX</button>)}
        </div>
        <PartnerDetail partner={selected} currency={currency} />
      </section>}
    </main>
  </AppShell>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-lg border bg-background/50 p-3">{icon}<div className="mt-2 text-xs text-muted-foreground">{label}</div><div className="font-medium">{value}</div></div>;
}

function PartnerDetail({ partner, currency }: { partner?: Partner; currency: string }) {
  if (!partner) return <Card><CardContent className="p-6 text-muted-foreground">Select a partner to inspect trust and fulfilment details.</CardContent></Card>;
  return <Card className="h-fit">
    <CardHeader>
      <CardTitle>{partner.businessName}</CardTitle>
      <CardDescription>{partner.licenseType} · {partner.verificationStatus} · {partner.city}</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4">
      <div className="rounded-lg border bg-teal-50 p-4">
        <div className="flex items-center gap-2 font-semibold text-teal-900"><ShieldCheck size={18} /> Compliance-safe partner flow</div>
        <p className="mt-2 text-sm text-muted-foreground">RoamFX lets travellers discover this partner, but final exchange happens only after partner acceptance, KYC, and applicable payment rules.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Info icon={<Star />} label="Rating" value={`${Number(partner.rating).toFixed(1)} / 5`} />
        <Info icon={<Clock3 />} label="Hours" value={partner.openingHours ?? "Partner confirms"} />
        <Info icon={<Building2 />} label="Pickup" value={partner.supportsPickup ? "Supported" : "Unavailable"} />
        <Info icon={<Navigation />} label="Delivery" value={partner.supportsDelivery ? "Supported" : "Unavailable"} />
      </div>
      <Button asChild><a href={`/dashboard?partner=${partner.id}&currency=${currency}`}>Start compliant booking</a></Button>
    </CardContent>
  </Card>;
}
