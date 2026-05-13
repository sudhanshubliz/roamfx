"use client";

import type React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, Building2, CheckCircle2, CreditCard, FileText, GraduationCap, Mail, RefreshCcw, ShieldCheck, Sparkles, WalletCards, type LucideIcon } from "lucide-react";
import { LovablePageHero, LovableSiteShell } from "@/components/lovable-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const complianceLine = "All RoamFX exchange and buy-back journeys route through verified authorised partners. RoamFX does not support unlicensed P2P cash exchange or user-to-user cash meetups.";

export function ForexCardPage() {
  return <MarketingFrame eyebrow="Forex card" title="Plan multi-currency travel cards with cash backup" subtitle="Compare card-ready partner options, estimate cash-card split, and keep KYC actions visible before departure.">
    <FeatureGrid items={[
      ["Load strategy", "Plan card versus cash by country, trip length, and activity mix.", CreditCard],
      ["Fee visibility", "Show markup, reload, delivery, and partner service fees before checkout.", WalletCards],
      ["Trip-ready alerts", "Reminders for card activation, ATM backup, and emergency cash.", Sparkles]
    ]} />
    <ActionBand title="Ready to compare forex card and cash options?" href="/planner" cta="Open AI planner" />
  </MarketingFrame>;
}

export function SendMoneyPage() {
  return <MarketingFrame eyebrow="Remittance" title="Send money abroad through authorised providers" subtitle="Education, visa, medical, and family-maintenance remittance flows are structured as partner-led requests with document checklists.">
    <FeatureGrid items={[
      ["Education remittance", "Capture student, university, invoice, and purpose details for authorised partner review.", GraduationCap],
      ["Document checklist", "Keep PAN, passport, offer letter, invoice, and payment proof metadata organised.", FileText],
      ["Partner acceptance", "No payment is processed until an authorised provider accepts the request.", BadgeCheck]
    ]} />
    <ComplianceCard />
  </MarketingFrame>;
}

export function StudyAbroadPage() {
  return <MarketingFrame eyebrow="Students" title="Study abroad money planning for families" subtitle="A guided flow for tuition remittance, living-expense forex, emergency cards, and parent-friendly reminders.">
    <FeatureGrid items={[
      ["Tuition readiness", "Track invoice, university, country, amount, and deadline metadata.", GraduationCap],
      ["Living expense forex", "Compare verified partners for cash, card, and pickup options.", WalletCards],
      ["Parent checklist", "Share reminders for travel dates, KYC, tickets, and settlement status.", BookOpen]
    ]} />
    <ActionBand title="Start with a safe travel money plan" href="/planner" cta="Plan student forex" />
  </MarketingFrame>;
}

export function VisaPage() {
  return <MarketingFrame eyebrow="Visa checklist" title="Travel documents and money proof in one checklist" subtitle="Plan visa, flight, passport, PAN, address proof, and booking-specific KYC metadata before partner review.">
    <div className="grid gap-4 md:grid-cols-2">
      {["Passport", "PAN", "Visa or appointment proof", "Flight ticket", "Address proof", "Currency declaration form when required"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <span className="font-medium">{item}</span>
      </div>)}
    </div>
    <ActionBand title="Upload KYC metadata after creating a booking" href="/dashboard" cta="Start booking" />
  </MarketingFrame>;
}

export function AboutPage() {
  return <MarketingFrame eyebrow="About RoamFX" title="A compliance-first marketplace for travel forex" subtitle="RoamFX helps travellers discover verified authorised partners while giving forex businesses a cleaner operating layer for quotes, KYC, inventory, and bookings.">
    <div className="grid gap-4 lg:grid-cols-3">
      <Stat value="Verified" label="partner-led transactions" />
      <Stat value="No P2P" label="cash meetup policy" />
      <Stat value="Audit-ready" label="status and document trails" />
    </div>
    <ComplianceCard />
  </MarketingFrame>;
}

export function BlogPage() {
  const posts = [
    ["How to avoid airport forex overcharging", "Compare before you fly, check all service fees, and reserve through verified partners."],
    ["Cash versus card by destination", "Why the right split changes by ATM access, merchant acceptance, and emergency buffer."],
    ["Selling leftover currency safely", "Use authorised partner buy-back routes instead of informal cash exchange offers."]
  ];
  return <MarketingFrame eyebrow="Guides" title="Travel forex guides for smarter trips" subtitle="Investor-demo content surfaces that can later be connected to a CMS.">
    <div className="grid gap-4 md:grid-cols-3">
      {posts.map(([title, copy]) => <Card key={title} className="rounded-2xl shadow-card">
        <CardContent className="p-5">
          <Badge variant="outline">Travel money</Badge>
          <h2 className="mt-4 text-xl font-semibold">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
          <Link href="/planner" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">Plan this <ArrowRight className="h-3.5 w-3.5" /></Link>
        </CardContent>
      </Card>)}
    </div>
  </MarketingFrame>;
}

export function ContactPage() {
  return <MarketingFrame eyebrow="Contact" title="Talk to RoamFX" subtitle="For beta access, partner onboarding, investor demos, and compliance-first marketplace feedback.">
    <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
      <div className="rounded-2xl border bg-gradient-hero p-6 text-primary-foreground shadow-elegant">
        <Mail className="h-8 w-8" />
        <h2 className="mt-4 text-2xl font-semibold">support@roamfx.app</h2>
        <p className="mt-3 text-sm text-white/75">This form is a placeholder notification surface for beta. Production email delivery can be wired via a provider later.</p>
      </div>
      <Card className="rounded-2xl shadow-card">
        <CardContent className="space-y-4 p-5">
          <Input placeholder="Full name" aria-label="Full name" />
          <Input placeholder="Email" aria-label="Email" />
          <Input placeholder="City" aria-label="City" />
          <Textarea placeholder="Tell us what you need" aria-label="Message" />
          <Button className="w-full bg-gradient-hero">Send beta enquiry</Button>
        </CardContent>
      </Card>
    </div>
  </MarketingFrame>;
}

export function BuyForexPage() {
  return <MarketingFrame eyebrow="Buy forex" title="Book travel forex through verified partners" subtitle="Use the RoamFX dashboard to select currency, compare partners, reserve a quote, upload KYC metadata, and track confirmation.">
    <FeatureGrid items={[
      ["Compare rates", "Sort by rate, rating, pickup, delivery, and location convenience.", Sparkles],
      ["Lock quote", "Reserve an indicative rate for a short window before partner confirmation.", WalletCards],
      ["Track status", "Follow KYC, partner review, pickup readiness, and completion.", FileText]
    ]} />
    <ActionBand title="Open the live traveller flow" href="/dashboard" cta="Start buy forex" />
  </MarketingFrame>;
}

export function SellForexPage() {
  return <MarketingFrame eyebrow="Sell forex" title="Sell leftover currency through authorised buy-back" subtitle="Declare leftover currency and route the request to verified partners with pickup or store-visit options.">
    <FeatureGrid items={[
      ["No P2P", "The request is not shown as a user-to-user cash meetup.", ShieldCheck],
      ["Partner buy-back", "Verified partners review amount, currency, KYC metadata, and payout ETA.", RefreshCcw],
      ["Settlement tracking", "Track partner acceptance, handover, payout mode, and settlement state.", Building2]
    ]} />
    <ActionBand title="Start the compliance-safe sell-back journey" href="/sell-leftover" cta="Sell leftover forex" />
  </MarketingFrame>;
}

function MarketingFrame({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children: React.ReactNode }) {
  return <LovableSiteShell><main>
    <LovablePageHero eyebrow={eyebrow} title={title} subtitle={subtitle} />
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-12">{children}</section>
  </main></LovableSiteShell>;
}

function FeatureGrid({ items }: { items: Array<[string, string, LucideIcon]> }) {
  return <div className="grid gap-4 md:grid-cols-3">
    {items.map(([title, copy, Icon]) => <Card key={title} className="rounded-2xl shadow-card">
      <CardContent className="p-6">
        <Icon className="h-8 w-8 text-primary" />
        <h2 className="mt-5 text-xl font-semibold">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
      </CardContent>
    </Card>)}
  </div>;
}

function ComplianceCard() {
  return <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5 text-sm text-teal-950">
    <div className="flex items-start gap-3">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <p>{complianceLine}</p>
    </div>
  </div>;
}

function ActionBand({ title, href, cta }: { title: string; href: string; cta: string }) {
  return <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
    <h2 className="text-2xl font-semibold">{title}</h2>
    <Button asChild className="bg-gradient-hero"><Link href={href}>{cta} <ArrowRight className="h-4 w-4" /></Link></Button>
  </div>;
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="rounded-2xl border bg-card p-6 shadow-card">
    <div className="text-3xl font-bold text-gradient">{value}</div>
    <div className="mt-2 text-sm text-muted-foreground">{label}</div>
  </div>;
}
