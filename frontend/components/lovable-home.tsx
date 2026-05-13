"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  FileCheck2,
  Globe2,
  HelpCircle,
  MapPin,
  Plane,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  WalletCards,
  type LucideIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LandingAnalytics } from "@/components/landing-analytics";
import { WaitlistForm } from "@/components/waitlist-form";
import { lovableCurrencies, lovablePartners } from "@/lib/lovable-forex";

const services = [
  {
    icon: Banknote,
    title: "Buy travel forex",
    copy: "Compare verified partner rates, choose pickup or delivery, and reserve a short rate lock.",
    href: "/dashboard"
  },
  {
    icon: RefreshCcw,
    title: "Sell leftover currency",
    copy: "Create a safe authorised-partner buy-back request. No user-to-user cash meetups.",
    href: "/sell-leftover"
  },
  {
    icon: CreditCard,
    title: "Forex card planning",
    copy: "Plan a cash-card split for your trip with transparent fees and travel-ready reminders.",
    href: "/forex-card"
  },
  {
    icon: Bot,
    title: "AI travel money planner",
    copy: "Get a practical cash, card, ATM, denomination, and scam-warning checklist.",
    href: "/planner"
  }
];

const steps = [
  "Enter destination, city, currency, and amount",
  "Compare verified authorised partners",
  "Upload required KYC metadata",
  "Reserve the quote and track partner confirmation"
];

const faqs = [
  {
    question: "Does RoamFX allow peer-to-peer currency exchange?",
    answer: "No. RoamFX never enables unlicensed user-to-user cash exchange or cash meetups. Every transaction is routed to verified authorised partners."
  },
  {
    question: "Are rates final?",
    answer: "Rates shown are indicative until you reserve a rate and the partner confirms the booking. Market rates and partner availability may change."
  },
  {
    question: "When is KYC required?",
    answer: "KYC depends on amount, purpose, payment mode, booking type, and partner policy. RoamFX shows a checklist before confirmation."
  },
  {
    question: "Can I use cash for a high-value INR transaction?",
    answer: "RoamFX enforces compliance guardrails. INR equivalent transactions at or above the configured threshold require non-cash payment modes."
  }
];

export function LovableHome() {
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState(100000);
  const selected = useMemo(() => lovableCurrencies.find((item) => item.code === currency) ?? lovableCurrencies[0], [currency]);
  const bestPartner = lovablePartners[0];
  const receive = amount / selected.buy;

  return <div className="overflow-hidden bg-background">
    <LandingAnalytics />
    <section className="relative border-b bg-gradient-to-br from-white via-secondary/40 to-primary/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(20,184,166,0.22),transparent_32%),radial-gradient(circle_at_12%_86%,rgba(37,99,235,0.12),transparent_30%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-20">
        <div>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Find verified travel forex near you. Compare live rates. Book safely.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            RoamFX helps international travellers compare verified authorised forex partners, lock a short quote window, upload KYC metadata, and avoid airport overcharging or unsafe cash exchange.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-gradient-hero shadow-elegant">
              <Link href="/dashboard">Compare rates <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/70">
              <Link href="/planner">Plan trip money <Sparkles className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            <TrustStat value="0" label="P2P exchanges" />
            <TrustStat value="30m" label="quote lock window" />
            <TrustStat value="4+" label="verified demo partners" />
          </div>
        </div>

        <div className="relative">
          <img src="/hero-globe.jpg" alt="" className="absolute -right-10 -top-10 hidden h-56 w-56 rounded-full object-cover opacity-80 shadow-elegant lg:block" />
          <Card className="relative overflow-hidden rounded-2xl shadow-elegant">
            <CardContent className="p-0">
              <div className="bg-gradient-hero p-5 text-primary-foreground">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/75">Traveller quote</p>
                    <h2 className="text-2xl font-semibold">INR to {selected.code}</h2>
                  </div>
                  <Badge className="bg-white/15 text-white"><ShieldCheck className="h-3.5 w-3.5" /> Verified only</Badge>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="rounded-xl border bg-secondary/35 p-4">
                    <span className="text-sm text-muted-foreground">You send</span>
                    <div className="mt-2 flex items-center gap-2 text-3xl font-bold">
                      <span>₹</span>
                      <input
                        aria-label="Amount in INR"
                        value={amount}
                        inputMode="numeric"
                        onChange={(event) => setAmount(Number(event.target.value.replace(/\D/g, "")) || 0)}
                        className="min-w-0 flex-1 bg-transparent text-3xl font-bold outline-none"
                      />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Indian Rupee</p>
                  </label>
                  <div className="rounded-xl border bg-secondary/35 p-4">
                    <span className="text-sm text-muted-foreground">You receive</span>
                    <div className="mt-2 text-3xl font-bold">{selected.flag} {receive.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
                    <p className="mt-2 text-sm text-success">Best demo rate: ₹{selected.buy}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="h-11 rounded-md border bg-background px-3 text-sm font-medium">
                    {lovableCurrencies.map((item) => <option key={item.code} value={item.code}>{item.flag} {item.code} - {item.name}</option>)}
                  </select>
                  <Button asChild className="bg-gradient-hero"><Link href="/dashboard">Reserve rate</Link></Button>
                </div>

                <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold">{bestPartner.name}</p>
                      <p className="text-sm text-muted-foreground">Best verified demo partner. Final transaction subject to partner acceptance and KYC.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <section className="border-y bg-card">
      <div className="mx-auto flex max-w-7xl overflow-hidden px-4 py-4">
        <div className="flex min-w-full animate-ticker items-center gap-4">
          {[...lovableCurrencies, ...lovableCurrencies].map((item, index) => <div key={`${item.code}-${index}`} className="flex items-center gap-2 whitespace-nowrap rounded-full border bg-background px-4 py-2 text-sm">
            <span>{item.flag}</span><strong>{item.code}</strong><span className="text-muted-foreground">Buy ₹{item.buy}</span><TrendingUp className="h-3.5 w-3.5 text-success" />
          </div>)}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Travel money without the usual traps</h2>
          <p className="mt-4 text-muted-foreground">Airport counters, unclear fees, fake dealers, and last-minute KYC confusion create avoidable stress. RoamFX turns the process into a guided partner-led workflow.</p>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
            <HelpCircle className="mb-2 h-5 w-5" />
            RoamFX is a technology platform. It does not process illegal forex transactions or facilitate unlicensed cash exchange.
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => <Link key={service.title} href={service.href} className="group rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
            <service.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.copy}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Open <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
          </Link>)}
        </div>
      </div>
    </section>

    <section className="bg-secondary/45 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">How RoamFX works</h2>
            <div className="mt-7 space-y-4">
              {steps.map((step, index) => <div key={step} className="flex gap-4 rounded-2xl border bg-background p-4 shadow-card">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</div>
                <div>
                  <p className="font-semibold">{step}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Designed for traveller clarity, partner accountability, and compliance evidence.</p>
                </div>
              </div>)}
            </div>
          </div>
          <Card className="rounded-2xl shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Best partner preview</h3>
                <Badge variant="outline"><Clock className="h-3.5 w-3.5" /> Updated now</Badge>
              </div>
              <div className="mt-5 space-y-3">
                {lovablePartners.map((partner, index) => <div key={partner.name} className="rounded-xl border p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{partner.name}</p>
                        <Badge className={index === 0 ? "bg-success text-white" : ""} variant={index === 0 ? "default" : "outline"}>{partner.badge}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{partner.delivery} fulfilment, service charges ₹{partner.charges}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold">₹{partner.rate}</p>
                      <p className="text-xs text-muted-foreground">USD buy rate</p>
                    </div>
                  </div>
                </div>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 lg:grid-cols-3">
      <FeaturePanel icon={MapPin} title="Why not airport exchange?" text="Airport counters can be convenient but expensive. RoamFX compares partner quotes before you fly so you can book with better visibility." />
      <FeaturePanel icon={FileCheck2} title="Safety and compliance" text="Partner verification, KYC status, audit logs, threshold guardrails, and no-P2P rules are visible throughout the journey." />
      <FeaturePanel icon={WalletCards} title="Leftover buyback" text="Declare leftover currency and route it to authorised partner buy-back with pickup or branch options and payout ETA." />
    </section>

    <section className="border-y bg-gradient-hero py-16 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI travel money planner</h2>
          <p className="mt-4 max-w-2xl text-white/75">Estimate cash versus card, emergency buffer, denominations, ATM usage, card acceptance, and country-specific scam warnings before booking with a verified partner.</p>
          <Button asChild size="lg" className="mt-6 bg-white text-primary hover:bg-white/90"><Link href="/planner">Generate my plan <Sparkles className="h-4 w-4" /></Link></Button>
        </div>
        <div className="rounded-2xl bg-white/12 p-5 backdrop-blur">
          <div className="flex items-center gap-3">
            <Plane className="h-7 w-7" />
            <div>
              <p className="font-semibold">Europe family trip</p>
              <p className="text-sm text-white/70">Recommended cash: EUR 650 - EUR 750</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniDark label="Cash" value="40%" />
            <MiniDark label="Card" value="60%" />
            <MiniDark label="Confidence" value="87%" />
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">FAQ</h2>
          <p className="mt-3 text-muted-foreground">Clear answers for travellers, partners, and anyone evaluating RoamFX for public beta.</p>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Star className="h-4 w-4 text-warning" /> Trusted flows, not informal dealer chats.</div>
        </div>
        <div className="space-y-3">
          {faqs.map((faq) => <details key={faq.question} className="group rounded-2xl border bg-card p-5 shadow-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
              {faq.question}
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
          </details>)}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-20">
      <div className="grid overflow-hidden rounded-3xl border bg-card shadow-elegant lg:grid-cols-[0.85fr_1.15fr]">
        <div className="bg-gradient-hero p-8 text-primary-foreground lg:p-10">
          <Globe2 className="h-10 w-10" />
          <h2 className="mt-5 text-3xl font-bold tracking-tight">Join the RoamFX beta waitlist</h2>
          <p className="mt-4 text-white/75">Help us validate city coverage, verified partner workflows, AI guidance, and traveller booking ergonomics.</p>
          <div className="mt-6 space-y-3 text-sm text-white/85">
            {["Verified-partner marketplace", "Quote and KYC journey", "Leftover currency buyback", "AI travel money planner"].map((item) => <p key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {item}</p>)}
          </div>
        </div>
        <div className="p-6 lg:p-8">
          <WaitlistForm />
        </div>
      </div>
    </section>
  </div>;
}

function TrustStat({ value, label }: { value: string; label: string }) {
  return <div className="rounded-2xl border bg-white/70 p-4 shadow-card">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
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
