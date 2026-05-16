"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowRightLeft, Banknote, Bot, CheckCircle2, ChevronDown, CreditCard, FileCheck2, GraduationCap, HelpCircle, Plane, RefreshCcw, Send, ShieldCheck, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LandingAnalytics } from "@/components/landing-analytics";
import { WaitlistForm } from "@/components/waitlist-form";
import { lovableCities, lovableCurrencies, lovablePartners } from "@/lib/lovable-forex";

const services = [
  { icon: Banknote, title: "Buy Foreign Currency", copy: "Order cash in major currencies with verified partner pickup or delivery.", href: "/buy-forex" },
  { icon: RefreshCcw, title: "Sell Foreign Currency", copy: "Convert leftover currency through authorised partner buy-back. No P2P.", href: "/sell-forex" },
  { icon: CreditCard, title: "Forex Travel Card", copy: "Plan a multi-currency card with cash backup and clear fee visibility.", href: "/forex-card" },
  { icon: Send, title: "International Money Transfer", copy: "Outward remittance request surfaces for education, medical, family and visa purposes.", href: "/send-money" },
  { icon: GraduationCap, title: "Student Remittance", copy: "Tuition, living expense, document and deadline planning for study abroad.", href: "/study-abroad" },
  { icon: Plane, title: "AI Flight Deals", copy: "Prototype flight search with AI price prediction and flight + forex bundle nudges.", href: "/flight-deals" },
  { icon: Bot, title: "AI Travel Planner", copy: "Day-by-day cash, card, ATM, scam-warning and document guidance.", href: "/ai-travel-planner" },
  { icon: FileCheck2, title: "Visa Assistance", copy: "AI checklist for travel documents, funds proof and partner KYC metadata.", href: "/visa" }
];

const faqs = [
  ["Does RoamFX allow peer-to-peer currency exchange?", "No. RoamFX never enables unlicensed user-to-user cash exchange or cash meetups. Every transaction is routed to verified authorised partners."],
  ["Are rates final?", "Rates shown are indicative until you reserve a rate and the partner confirms the booking. Market rates and partner availability may change."],
  ["What is new from the Lovable app?", "The UI now includes the blue hero quote widget, service marketplace cards, AI flight deals, smart checkout, mobile bottom nav and a richer Roam AI assistant."],
  ["Can RoamFX book flights today?", "Flight deals are a working mock/investor prototype. Real ticketing requires supplier, GDS or OTA provider integration before production."]
];

export function LovableHome() {
  const [tab, setTab] = useState<"buy" | "sell" | "card" | "send">("buy");
  const [currency, setCurrency] = useState("USD");
  const [city, setCity] = useState("Delhi");
  const [amount, setAmount] = useState("1000");
  const selected = useMemo(() => lovableCurrencies.find((item) => item.code === currency) ?? lovableCurrencies[0], [currency]);
  const total = Number(amount || 0) * (tab === "sell" ? selected.sell : selected.buy);

  return <div className="overflow-hidden bg-background">
    <LandingAnalytics />

    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_top_right,white,transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
        <div className="animate-fade-up text-primary-foreground">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> AI-powered travel forex
          </span>
          <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight lg:text-7xl">
            Travel smarter. <br /> Exchange better.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-primary-foreground/85 lg:text-lg">
            Compare live forex rates, order currency or a travel card to your doorstep, send money abroad, and let Roam AI plan your trip, all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/buy-forex">Buy Forex</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
              <Link href="/ai-travel-planner">Try AI Travel Planner</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-primary-foreground/85">
            <span>✓ RBI-authorised partners</span>
            <span>✓ Doorstep delivery</span>
            <span>✓ Best market rates</span>
          </div>
        </div>

        <div className="relative">
          <img src="/hero-globe.jpg" alt="" className="absolute -right-10 -top-8 hidden h-72 w-72 rounded-3xl object-cover opacity-40 lg:block" />
          <Card className="relative rounded-3xl border-white/20 bg-card p-3 shadow-elegant">
            <CardContent className="p-5 md:p-7">
              <h2 className="text-2xl font-bold">Get the best rate today</h2>
              <div className="mt-5 grid grid-cols-4 rounded-xl bg-secondary p-1">
                {(["buy", "sell", "card", "send"] as const).map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize transition ${tab === item ? "bg-background text-primary shadow-sm ring-2 ring-primary" : "text-muted-foreground hover:text-foreground"}`}>{item}</button>)}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium text-muted-foreground">
                  Currency
                  <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="h-12 rounded-lg border bg-background px-3 text-base font-semibold text-foreground">
                    {lovableCurrencies.map((item) => <option key={item.code} value={item.code}>{item.flag} {item.code} - {item.name}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-medium text-muted-foreground">
                  City
                  <select value={city} onChange={(event) => setCity(event.target.value)} className="h-12 rounded-lg border bg-background px-3 text-base font-semibold text-foreground">
                    {lovableCities.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-medium text-muted-foreground sm:col-span-2">
                  Amount ({currency})
                  <input value={amount} inputMode="numeric" onChange={(event) => setAmount(event.target.value.replace(/[^\d.]/g, ""))} className="h-12 rounded-lg border bg-background px-3 text-base font-semibold text-foreground outline-none" />
                </label>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-xl bg-secondary p-4">
                <div className="flex items-center gap-2 text-sm">
                  <ArrowRightLeft className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{tab === "sell" ? "You receive" : "You pay"} (approx)</span>
                </div>
                <span className="text-2xl font-bold">Rs {total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
              </div>
              <Button asChild size="lg" className="mt-5 w-full bg-gradient-hero">
                <Link href={tab === "send" ? "/send-money" : tab === "card" ? "/forex-card" : tab === "sell" ? "/sell-forex" : "/checkout"}>Compare & Book</Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">Indicative rate • Final rate at booking • Verified partners only</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <section className="border-y bg-card">
      <div className="mx-auto flex max-w-7xl overflow-hidden px-4 py-4">
        <div className="flex min-w-full animate-ticker items-center gap-4">
          {[...lovableCurrencies, ...lovableCurrencies].map((item, index) => <div key={`${item.code}-${index}`} className="flex items-center gap-2 whitespace-nowrap text-sm">
            <span>{item.flag}</span><strong>{item.code}</strong><span className="text-muted-foreground">Rs {item.buy}</span><TrendingUp className="h-3.5 w-3.5 text-success" /><span className="text-success">0.12%</span>
          </div>)}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Everything you need</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">One platform for travel money</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => <Link key={service.title} href={service.href} className="group rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-elegant">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground"><service.icon className="h-6 w-6" /></div>
          <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.copy}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Explore <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
        </Link>)}
      </div>
    </section>

    <section className="bg-secondary/45 py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Smart checkout, not static lead forms</h2>
          <p className="mt-4 text-muted-foreground">The imported flow adds service selection, trip details, AI recommendation, partner comparison, coupons, KYC checklist, payment placeholder and confirmation.</p>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
            <HelpCircle className="mb-2 h-5 w-5" />
            RoamFX remains compliance-safe: no unlicensed peer-to-peer cash exchange, no user-to-user meetups, and all forex flows route through verified partners.
          </div>
          <Button asChild className="mt-6 bg-gradient-hero"><Link href="/checkout">Open smart checkout</Link></Button>
        </div>
        <Card className="rounded-2xl shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold">Best partner preview</h3>
              <Badge variant="outline">Updated now</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {lovablePartners.map((partner, index) => <div key={partner.name} className="rounded-xl border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{partner.name}</p>
                      <Badge className={index === 0 ? "bg-success text-white" : ""} variant={index === 0 ? "default" : "outline"}>{partner.badge}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{partner.delivery} fulfilment, service charges Rs {partner.charges}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-bold">Rs {partner.rate}</p>
                    <p className="text-xs text-muted-foreground">USD buy rate</p>
                  </div>
                </div>
              </div>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 lg:grid-cols-3">
      <FeaturePanel icon={Plane} title="AI flight deals" text="Search demo flights, view deal score, price prediction and flight + forex bundle prompts for investor demos." />
      <FeaturePanel icon={FileCheck2} title="Safety and compliance" text="Partner verification, KYC status, audit logs, threshold guardrails and no-P2P rules stay visible throughout." />
      <FeaturePanel icon={ShieldCheck} title="Verified marketplace" text="Every exchange and leftover buy-back flow is partner-led and subject to applicable laws, KYC and partner acceptance." />
    </section>

    <section className="border-y bg-gradient-hero py-16 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Roam AI now handles forex, flights and trip packs</h2>
          <p className="mt-4 max-w-2xl text-white/75">The assistant now supports quick prompts, voice placeholder, flight/partner/coupon cards, email travel-pack placeholder, callback and WhatsApp handoff stubs.</p>
          <Button asChild size="lg" className="mt-6 bg-white text-primary hover:bg-white/90"><Link href="/ai-travel-planner">Generate my plan <Sparkles className="h-4 w-4" /></Link></Button>
        </div>
        <div className="rounded-2xl bg-white/12 p-5 backdrop-blur">
          <div className="flex items-center gap-3">
            <Plane className="h-7 w-7" />
            <div>
              <p className="font-semibold">Dubai travel pack</p>
              <p className="text-sm text-white/70">Flights + forex + coupon + KYC checklist</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniDark label="Flight score" value="95" />
            <MiniDark label="Cash/card" value="40/60" />
            <MiniDark label="KYC" value="Ready" />
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">FAQ</h2>
          <p className="mt-3 text-muted-foreground">Clear answers for travellers, partners and investor demos.</p>
        </div>
        <div className="space-y-3">
          {faqs.map(([question, answer]) => <details key={question} className="group rounded-2xl border bg-card p-5 shadow-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">{question}<ChevronDown className="h-4 w-4 transition group-open:rotate-180" /></summary>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{answer}</p>
          </details>)}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-20">
      <div className="grid overflow-hidden rounded-3xl border bg-card shadow-elegant lg:grid-cols-[0.85fr_1.15fr]">
        <div className="bg-gradient-hero p-8 text-primary-foreground lg:p-10">
          <Sparkles className="h-10 w-10" />
          <h2 className="mt-5 text-3xl font-bold tracking-tight">Join the RoamFX beta waitlist</h2>
          <p className="mt-4 text-white/75">Validate the new Lovable-inspired travel money, flights, checkout and Roam AI experience.</p>
          <div className="mt-6 space-y-3 text-sm text-white/85">
            {["Verified-partner marketplace", "Smart checkout", "AI flight deals", "Roam AI travel pack"].map((item) => <p key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {item}</p>)}
          </div>
        </div>
        <div className="p-6 lg:p-8"><WaitlistForm /></div>
      </div>
    </section>
  </div>;
}

function FeaturePanel({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return <div className="rounded-2xl border bg-card p-6 shadow-card">
    <Icon className="h-8 w-8 text-primary" />
    <h3 className="mt-5 text-xl font-semibold">{title}</h3>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
  </div>;
}

function MiniDark({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-white/12 p-4 text-center">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs text-white/65">{label}</div>
  </div>;
}
