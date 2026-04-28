"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Bell,
  Bot,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Edit3,
  Filter,
  Home,
  Info,
  List,
  LocateFixed,
  Map,
  MapPin,
  Menu,
  Navigation,
  Plane,
  ReceiptText,
  RefreshCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  WalletCards
} from "lucide-react";
import { LandingAnalytics } from "@/components/landing-analytics";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { WaitlistForm } from "@/components/waitlist-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PartnerRate = {
  id: string;
  name: string;
  initials: string;
  color: string;
  receiveBonus: number;
  rate: number;
  fee: number;
  delivery: string;
  slot: string;
  rating: number;
  reviews: number;
  branches: string;
  city: string;
  area: string;
  lat: number;
  lng: number;
  phone: string;
  license: string;
  tag?: string;
};

const partners: PartnerRate[] = [
  { id: "global-forex", name: "Global Forex Pvt. Ltd.", initials: "FX", color: "bg-teal-700", receiveBonus: 12.4, rate: 91.32, fee: 220, delivery: "Airport pickup", slot: "T3, DEL · Today, 4:00 PM", rating: 4.8, reviews: 128, branches: "15+ branches", city: "Delhi", area: "T3, Delhi Airport", lat: 28.5562, lng: 77.1, phone: "+911145551010", license: "RBI AD-I", tag: "Best Value" },
  { id: "travel-currency", name: "Travel Currency Exchange", initials: "TC", color: "bg-blue-600", receiveBonus: 6.3, rate: 90.83, fee: 780, delivery: "Home delivery", slot: "Connaught Place · Tomorrow, 10:00 AM - 1:00 PM", rating: 4.6, reviews: 96, branches: "20+ branches", city: "Delhi", area: "Connaught Place, Delhi", lat: 28.6315, lng: 77.2167, phone: "+911145552020", license: "RBI FFMC" },
  { id: "world-forex", name: "World Forex Services", initials: "WT", color: "bg-orange-600", receiveBonus: 1.5, rate: 90.43, fee: 1150, delivery: "Airport pickup", slot: "Aerocity · Tomorrow, 9:00 AM", rating: 4.5, reviews: 74, branches: "10+ branches", city: "Delhi", area: "Aerocity, Delhi", lat: 28.5483, lng: 77.1217, phone: "+911145553030", license: "RBI AD-II" },
  { id: "unimoni-india", name: "Unimoni India", initials: "UI", color: "bg-emerald-700", receiveBonus: 0, rate: 89.99, fee: 1620, delivery: "Branch pickup", slot: "BKC · Today, 5:30 PM", rating: 4.4, reviews: 63, branches: "25+ branches", city: "Mumbai", area: "Bandra Kurla Complex, Mumbai", lat: 19.0669, lng: 72.8675, phone: "+912245551010", license: "Travel forex partner" }
];

const cityCoordinates: Record<string, { lat: number; lng: number; label: string }> = {
  delhi: { lat: 28.6139, lng: 77.209, label: "Delhi NCR" },
  "delhi ncr": { lat: 28.6139, lng: 77.209, label: "Delhi NCR" },
  mumbai: { lat: 19.076, lng: 72.8777, label: "Mumbai" },
  bengaluru: { lat: 12.9716, lng: 77.5946, label: "Bengaluru" },
  bangalore: { lat: 12.9716, lng: 77.5946, label: "Bengaluru" }
};

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Bookings", icon: ReceiptText, href: "/bookings" },
  { label: "Get Rates", icon: CircleDollarSign, href: "/rates", primary: true },
  { label: "Planner", icon: Bot, href: "/planner" },
  { label: "More", icon: SlidersHorizontal, href: "/compliance" }
];

function distanceKm(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthKm = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthKm * Math.asin(Math.sqrt(h));
}

export default function HomePage() {
  const [amount, setAmount] = useState(100000);
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState("global-forex");
  const [fromCountry, setFromCountry] = useState("India");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [manualCity, setManualCity] = useState("Delhi");
  const [location, setLocation] = useState(cityCoordinates.delhi);
  const [locationStatus, setLocationStatus] = useState("Showing verified partners near Delhi NCR.");
  const nearbyPartners = useMemo(() => partners
    .map((partner) => ({ ...partner, distanceKm: distanceKm(location, partner) }))
    .sort((a, b) => a.distanceKm - b.distanceKm), [location]);
  const selected = nearbyPartners.find((partner) => partner.id === selectedId) ?? nearbyPartners[0];
  const receive = useMemo(() => amount / selected.rate, [amount, selected.rate]);
  const total = amount + selected.fee;
  const saving = Math.max(900, Math.round((nearbyPartners[nearbyPartners.length - 1].rate - selected.rate) * -amount / selected.rate));

  function applyCitySearch() {
    const match = cityCoordinates[manualCity.trim().toLowerCase()];
    if (!match) {
      setLocationStatus("Demo location API supports Delhi, Mumbai, and Bengaluru. Showing Delhi NCR partners.");
      setLocation(cityCoordinates.delhi);
      return;
    }
    setLocation(match);
    setLocationStatus(`Nearby partner API loaded verified forex partners around ${match.label}.`);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Browser location is unavailable. Enter city manually.");
      return;
    }
    setLocationStatus("Requesting browser location permission...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude, label: "your current location" });
        setLocationStatus("Nearby partner API ranked verified partners by your current browser location.");
      },
      () => setLocationStatus("Location permission denied or unavailable. Enter city manually."),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_right,rgba(12,115,120,0.10),transparent_34%),linear-gradient(180deg,#fbfaf7_0%,#f8f6f0_100%)] pb-28 text-foreground">
      <LandingAnalytics />
      <PwaInstallPrompt />
      <div className="mx-auto max-w-6xl">
        <TopBar />

        <section className="px-3 pb-5 md:px-6">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="animate-rise rounded-lg border bg-white/90 p-4 shadow-sm backdrop-blur md:p-6">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <CurrencyPicker label="You're in" flag="🇮🇳" value={fromCountry} setValue={setFromCountry} options={["India", "Singapore", "UAE", "United Kingdom"]} />
                <button className="grid size-11 place-items-center rounded-md border bg-background transition hover:-rotate-6 hover:bg-accent" aria-label="Swap route">
                  <RefreshCcw size={20} />
                </button>
                <CurrencyPicker label="You need" flag={toCurrency === "EUR" ? "🇪🇺" : toCurrency === "USD" ? "🇺🇸" : "🇬🇧"} value={`${toCurrency} - ${toCurrency === "EUR" ? "Euro" : toCurrency === "USD" ? "US Dollar" : "Pound"}`} setValue={(value) => setToCurrency(value.slice(0, 3))} options={["EUR - Euro", "USD - US Dollar", "GBP - Pound"]} />
              </div>

              <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-lg border bg-card">
                <label className="block p-4 md:p-6">
                  <span className="text-sm text-muted-foreground">You send</span>
                  <div className="mt-2 flex items-center gap-1 text-2xl font-semibold md:gap-2 md:text-3xl">
                    ₹
                    <input
                      aria-label="Amount in INR"
                      className="min-w-0 flex-1 bg-transparent text-2xl font-semibold outline-none md:text-3xl"
                      value={amount}
                      inputMode="numeric"
                      onChange={(event) => setAmount(Number(event.target.value.replace(/\D/g, "")) || 0)}
                    />
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground">Indian Rupee (INR) <ChevronDown size={16} /></div>
                </label>
                <div className="border-l p-4 md:p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">You receive indicative <Info size={15} /></div>
                  <div className="mt-2 text-2xl font-semibold md:text-3xl">€ {receive.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-emerald-700">
                    <span>Best rate</span><span>•</span><span>Save ₹{saving.toLocaleString("en-IN")}</span><Sparkles size={16} className="animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden animate-rise rounded-lg border bg-gradient-to-br from-teal-800 to-teal-950 p-5 text-white shadow-sm [animation-delay:120ms] md:p-6 lg:block">
              <Badge className="bg-white/15 text-white"><Plane size={14} /> Europe trip ready</Badge>
              <h1 className="mt-4 text-3xl font-semibold md:text-4xl">Book travel forex without airport panic.</h1>
              <p className="mt-3 text-sm leading-6 text-white/75">Compare verified partners, lock a short rate window, upload KYC metadata, and keep a clear paper trail before you fly.</p>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
                <MiniStat value="30m" label="rate lock" />
                <MiniStat value="0" label="P2P trades" />
                <MiniStat value="24/7" label="AI tips" />
              </div>
            </div>
          </div>

          <Link href="/compliance" className="mt-4 flex items-center gap-3 rounded-lg border border-teal-200 bg-teal-50/90 p-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-50">
            <ShieldCheck className="size-8 shrink-0 text-teal-700" />
            <div className="min-w-0 flex-1">
              <div className="font-semibold">RoamFX connects you only with verified, authorised forex partners.</div>
              <p className="mt-1 text-muted-foreground">All partner-led exchange flows stay compliance-safe with KYC and no user-to-user cash meetups.</p>
            </div>
            <span className="hidden items-center gap-2 font-medium text-teal-800 sm:flex">View compliance <ChevronRight size={18} /></span>
          </Link>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="grid grid-cols-2 rounded-lg border bg-white p-1 shadow-sm">
              <button onClick={() => setView("list")} className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${view === "list" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground"}`}><List size={18} /> List view</button>
              <button onClick={() => setView("map")} className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${view === "map" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground"}`}><Map size={18} /> Map view</button>
            </div>
            <Button variant="outline" className="bg-white"><Filter size={17} /> Filters</Button>
          </div>

          <section className="mt-4 grid gap-3 rounded-lg border bg-white p-4 shadow-sm md:grid-cols-[1fr_auto_auto] md:items-center">
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Search nearby forex partners</span>
              <span className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                <Search size={16} className="text-muted-foreground" />
                <input
                  value={manualCity}
                  onChange={(event) => setManualCity(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter") applyCitySearch(); }}
                  className="min-w-0 flex-1 bg-transparent outline-none"
                  placeholder="Delhi, Mumbai, Bengaluru"
                />
              </span>
            </label>
            <Button type="button" onClick={applyCitySearch} variant="outline" className="bg-white">Search city</Button>
            <Button type="button" onClick={useCurrentLocation} className="bg-gradient-to-b from-teal-700 to-teal-900"><LocateFixed size={17} /> Use my location</Button>
            <p className="text-xs text-muted-foreground md:col-span-3">{locationStatus} Map results are mock/demo data now; Google Maps provider keys can replace this adapter later.</p>
          </section>

          {view === "list" ? (
            <section className="mt-4 overflow-hidden rounded-lg border bg-white shadow-sm">
              <div className="hidden grid-cols-[1.45fr_0.75fr_0.8fr_0.85fr_1.05fr_0.7fr] gap-3 border-b px-4 py-3 text-sm text-muted-foreground md:grid">
                <span>Partner<br /><small>View details</small></span>
                <span>You receive<br /><small>({toCurrency})</small></span>
                <span>Exchange rate<br /><small>(INR → {toCurrency})</small></span>
                <span>Total cost<br /><small>(INR)</small></span>
                <span>Delivery / Pickup</span>
                <span>Add funds</span>
              </div>
              <div className="divide-y">
                {nearbyPartners.map((partner) => (
                  <PartnerRow
                    key={partner.id}
                    partner={partner}
                    active={partner.id === selected.id}
                    receive={amount / partner.rate}
                    total={amount + partner.fee}
                    onSelect={() => setSelectedId(partner.id)}
                  />
                ))}
              </div>
            </section>
          ) : (
            <section className="mt-4 grid gap-4 rounded-lg border bg-white p-4 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[420px] overflow-hidden rounded-lg border bg-[radial-gradient(circle_at_25%_30%,rgba(20,184,166,0.22),transparent_20%),radial-gradient(circle_at_70%_62%,rgba(245,158,11,0.20),transparent_18%),linear-gradient(135deg,#ecfeff,#f8fafc)]">
                <div className="absolute inset-x-8 top-1/2 h-px bg-teal-700/20" />
                <div className="absolute inset-y-8 left-1/2 w-px bg-teal-700/20" />
                <div className="absolute left-8 top-8 rounded-full bg-white/90 px-3 py-2 text-xs font-medium shadow-sm">
                  <MapPin size={14} className="mr-1 inline text-teal-700" /> {location.label}
                </div>
                {nearbyPartners.map((partner, index) => (
                  <button
                    key={partner.id}
                    onClick={() => setSelectedId(partner.id)}
                    className={`absolute rounded-full border-4 border-white shadow-lg transition hover:scale-110 ${partner.id === selected.id ? "bg-teal-800 text-white" : "bg-white text-teal-800"}`}
                    style={{ left: `${22 + (index * 17) % 58}%`, top: `${24 + (index * 19) % 52}%` }}
                    aria-label={`Select ${partner.name}`}
                  >
                    <span className="grid size-12 place-items-center rounded-full font-bold">{partner.initials}</span>
                  </button>
                ))}
                <div className="absolute bottom-4 left-4 right-4 rounded-lg border bg-white/95 p-4 shadow-sm backdrop-blur">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{selected.name}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{selected.area} · {selected.distanceKm.toFixed(1)} km away</div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">Verified</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <MiniMapStat label="Rate" value={`₹${selected.rate}`} />
                    <MiniMapStat label="Rating" value={`${selected.rating}★`} />
                    <MiniMapStat label="Fee" value={`₹${selected.fee}`} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Nearby verified forex exchange</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Mock location API ranks authorised partners by distance, rate, delivery mode, rating, and fee. Transactions still go through partner-led booking and KYC.</p>
                </div>
                {nearbyPartners.map((partner) => (
                  <article key={partner.id} className={`rounded-lg border p-3 ${partner.id === selected.id ? "border-teal-600 bg-teal-50/50" : "bg-white"}`}>
                    <button onClick={() => setSelectedId(partner.id)} className="w-full text-left">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold">{partner.name}</div>
                        <Badge variant="outline">{partner.distanceKm.toFixed(1)} km</Badge>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">{partner.license} · {partner.delivery} · {partner.slot}</div>
                    </button>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => setSelectedId(partner.id)}>Select</Button>
                      <Button size="sm" variant="outline" asChild><a href={`tel:${partner.phone}`}>Call</a></Button>
                      <Button size="sm" variant="outline" asChild><a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${partner.name}, ${partner.area}`)}`}><Navigation size={14} /> Directions</a></Button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><ShieldCheck size={14} /> Rates are indicative. Final rate locks after booking.</span>
            <span className="inline-flex items-center gap-1">Last updated: 10:24 AM <RefreshCcw size={14} /></span>
          </div>

          <BookingProgress partner={selected} receive={receive} />
          <AiPlannerCard />

          <section className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-lg border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Why travellers like it</h2>
              <div className="mt-4 grid gap-3 text-sm">
                {["No fake dealer meetups", "Airport markup warnings", "KYC and cash-threshold nudges", "Leftover currency routed to buyback partners"].map((item) => (
                  <div key={item} className="flex items-center gap-2"><BadgeCheck className="text-teal-700" size={18} /> {item}</div>
                ))}
              </div>
            </div>
            <WaitlistForm />
          </section>
        </section>
      </div>
      <BottomNav />
    </main>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b bg-white/88 px-4 py-3 backdrop-blur-xl [padding-top:calc(0.75rem+env(safe-area-inset-top))]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="grid size-10 place-items-center rounded-md hover:bg-muted" aria-label="Open menu"><Menu /></button>
          <div className="h-8 w-px bg-border" />
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-normal">
            <span className="grid size-10 place-items-center rounded-md bg-teal-800 text-white"><ShieldCheck size={24} /></span>
            <span>Roam<span className="text-teal-700">FX</span></span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/planner" className="hidden rounded-md border px-3 py-2 text-sm font-medium text-teal-800 transition hover:bg-teal-50 sm:inline-flex">AI Planner</Link>
          <button className="grid size-10 place-items-center rounded-md hover:bg-muted" aria-label="Notifications"><Bell /></button>
          <Link href="/profile" className="grid size-11 place-items-center rounded-full bg-muted text-sm font-semibold text-teal-800">AS</Link>
        </div>
      </div>
    </header>
  );
}

function CurrencyPicker({ label, flag, value, setValue, options }: { label: string; flag: string; value: string; setValue: (value: string) => void; options: string[] }) {
  return (
    <label className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-xl">{flag}</span>
      <span className="min-w-0">
        <span className="block text-sm text-muted-foreground">{label}</span>
        <select value={value} onChange={(event) => setValue(event.target.value)} className="mt-1 w-full bg-transparent text-base font-semibold outline-none md:text-xl">
          {options.map((item) => <option key={item}>{item}</option>)}
        </select>
      </span>
    </label>
  );
}

function PartnerRow({ partner, active, receive, total, onSelect }: { partner: PartnerRate; active: boolean; receive: number; total: number; onSelect: () => void }) {
  return (
    <article className={`grid gap-3 p-4 transition hover:bg-teal-50/40 md:grid-cols-[1.45fr_0.75fr_0.8fr_0.85fr_1.05fr_0.7fr] md:items-center ${active ? "ring-1 ring-inset ring-teal-600 bg-teal-50/20" : ""}`}>
      <div className="flex items-start gap-3">
        <div className={`grid size-12 shrink-0 place-items-center rounded-full ${partner.color} text-lg font-bold text-white`}>{partner.initials}</div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {partner.tag ? <Badge className="bg-emerald-100 text-emerald-800">{partner.tag}</Badge> : null}
            <span className="font-semibold">{partner.name}</span>
            <BadgeCheck className="text-emerald-700" size={16} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>RBI AD-I</span><span>·</span><Star size={14} className="fill-muted-foreground" /> <span>{partner.rating} ({partner.reviews})</span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{partner.branches}</div>
        </div>
      </div>
      <Cell label="You receive"><strong>€ {receive.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong><small className="text-emerald-700">+ €{partner.receiveBonus.toFixed(2)}</small></Cell>
      <Cell label="Rate"><strong>₹ {partner.rate.toFixed(2)}</strong><small className={partner.tag ? "text-emerald-700" : "text-muted-foreground"}>{partner.tag ? "Best rate" : "Fair band"}</small></Cell>
      <Cell label="Total cost"><strong>₹ {total.toLocaleString("en-IN")}</strong><small className="text-muted-foreground">Incl. charges</small></Cell>
      <Cell label="Delivery / Pickup"><strong>{partner.delivery}</strong><small className="text-muted-foreground">{partner.slot}</small></Cell>
      <div className="flex items-center gap-3 md:justify-end">
        <Button onClick={onSelect} className="min-w-24 bg-gradient-to-b from-teal-700 to-teal-900">Select</Button>
        <button className="inline-flex items-center gap-1 text-sm font-medium text-teal-800">Details <ChevronRight size={16} /></button>
      </div>
    </article>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-1 text-sm"><span className="text-xs text-muted-foreground md:hidden">{label}</span>{children}</div>;
}

function BookingProgress({ partner, receive }: { partner: PartnerRate; receive: number }) {
  return (
    <section className="mt-5 rounded-lg border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Your booking progress</h2>
      <div className="mt-5 grid grid-cols-4 gap-2 text-center text-xs text-muted-foreground">
        {["Enter details", "Choose partner", "Verify & pay", "Confirmation"].map((step, index) => (
          <div key={step} className="relative">
            <div className={`mx-auto grid size-9 place-items-center rounded-full border ${index === 0 ? "border-teal-800 bg-teal-800 text-white" : "bg-white"}`}>{index + 1}</div>
            <div className="mt-2">{step}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-4 rounded-lg border p-4 md:grid-cols-[1.3fr_0.8fr_0.8fr_0.5fr] md:items-center">
        <Cell label="Selected partner"><div className="flex items-center gap-3"><span className={`grid size-10 place-items-center rounded-full ${partner.color} font-bold text-white`}>{partner.initials}</span><strong>{partner.name}</strong><BadgeCheck className="text-emerald-700" size={16} /></div></Cell>
        <Cell label="You receive"><strong>€ {receive.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong></Cell>
        <Cell label="Rate locked for"><strong className="inline-flex items-center gap-2"><CircleDollarSign size={18} /> 04:56</strong></Cell>
        <button className="inline-flex items-center gap-2 font-medium text-teal-800">Edit <Edit3 size={16} /></button>
      </div>
    </section>
  );
}

function AiPlannerCard() {
  return (
    <section className="mt-5 grid gap-4 rounded-lg border bg-white p-5 shadow-sm lg:grid-cols-[1fr_0.55fr] lg:items-center">
      <div className="grid gap-4 md:grid-cols-[190px_1fr] md:items-center">
        <div className="relative h-40 overflow-hidden rounded-lg bg-gradient-to-br from-teal-50 to-amber-50">
          <div className="absolute bottom-4 left-5 h-24 w-16 rounded-lg bg-teal-700 shadow-lg before:absolute before:left-4 before:top-[-12px] before:h-3 before:w-8 before:rounded-full before:border-2 before:border-teal-800 before:content-['']" />
          <div className="absolute bottom-8 left-24 h-24 w-20 rounded-md border bg-white shadow-sm">
            <div className="mx-auto mt-5 size-10 rounded-full bg-[conic-gradient(#0c7378_0_40%,#f2b84b_40%_68%,#dce8e8_68%)]" />
            <div className="mx-auto mt-3 h-2 w-12 rounded bg-teal-100" />
            <div className="mx-auto mt-2 h-2 w-10 rounded bg-teal-100" />
          </div>
          <div className="absolute bottom-5 left-16 grid grid-cols-2 gap-1">{Array.from({ length: 8 }).map((_, i) => <span key={i} className="size-4 rounded-full bg-amber-400 shadow-sm" />)}</div>
        </div>
        <div>
          <div className="flex items-center gap-2"><h2 className="text-lg font-semibold">AI Travel Money Planner</h2><Badge className="bg-blue-100 text-blue-800">BETA</Badge></div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Get a personalised recommendation on how much cash to carry vs. card vs. digital for your trip.</p>
          <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><BadgeCheck size={16} className="text-teal-700" /> Trip: Europe (10 days)</span>
            <span className="inline-flex items-center gap-2"><BadgeCheck size={16} className="text-teal-700" /> Travellers: 2</span>
            <span className="inline-flex items-center gap-2"><BadgeCheck size={16} className="text-teal-700" /> Spend profile: Leisure</span>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-teal-50 p-5">
        <div className="text-sm text-muted-foreground">Recommended cash to carry</div>
        <div className="mt-3 text-3xl font-semibold">€650 - €750</div>
        <p className="mt-2 text-sm text-muted-foreground">~60% of total estimated spend</p>
        <Button asChild className="mt-5 w-full bg-gradient-to-b from-teal-700 to-teal-900"><Link href="/planner">View full plan</Link></Button>
      </div>
    </section>
  );
}

function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/92 px-3 pb-[calc(0.35rem+env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-xl grid-cols-5 items-end gap-1">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className={`group flex flex-col items-center gap-1 rounded-md px-2 py-1 text-xs ${item.primary ? "text-teal-800" : "text-muted-foreground"}`}>
            <span className={`${item.primary ? "mb-0.5 grid size-12 place-items-center rounded-full bg-gradient-to-b from-teal-700 to-teal-900 text-white shadow-lg shadow-teal-900/20 transition group-hover:-translate-y-1" : "grid size-7 place-items-center transition group-hover:-translate-y-0.5 group-hover:text-teal-800"}`}>
              <item.icon size={item.primary ? 22 : 19} />
            </span>
            <span className={item.primary ? "font-semibold" : ""}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return <div className="rounded-lg bg-white/10 px-2 py-3"><div className="text-xl font-semibold">{value}</div><div className="mt-1 text-white/70">{label}</div></div>;
}

function MiniMapStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md bg-muted/60 p-2"><div className="text-xs text-muted-foreground">{label}</div><div className="font-semibold">{value}</div></div>;
}
