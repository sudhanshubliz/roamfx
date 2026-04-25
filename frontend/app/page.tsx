import Link from "next/link";
import type React from "react";
import { ArrowRight, Banknote, BrainCircuit, CheckCircle2, CircleHelp, Plane, RefreshCcw, ShieldCheck, WalletCards } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ComplianceBanner } from "@/components/compliance-banner";
import { LandingAnalytics } from "@/components/landing-analytics";
import { MapPlaceholder } from "@/components/map-placeholder";
import { RateComparison } from "@/components/rate-comparison";
import { WaitlistForm } from "@/components/waitlist-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const steps = ["Search nearby verified partners", "Compare live rates and fees", "Upload KYC when required", "Reserve rate", "Complete through authorised partner"];
const faqs = [
  ["Does RoamFX support peer-to-peer exchange?", "No. RoamFX does not support unlicensed peer-to-peer currency exchange or user-to-user cash meetups."],
  ["Who completes the transaction?", "Currency exchange is completed only through verified authorised partners, subject to KYC, law, and partner acceptance."],
  ["Can I sell leftover currency?", "Yes, but the request is routed to authorised partner buyback flow, not another traveller."],
  ["Are rates guaranteed?", "Rates and fees can change. Confirm final quote, lock window, KYC, and payment mode before transaction."]
];

export default function HomePage() {
  return <AppShell>
    <LandingAnalytics />
    <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-6 md:py-10">
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col justify-center gap-5">
          <Badge variant="secondary" className="w-fit"><ShieldCheck data-icon="inline-start" /> Verified authorised partners only</Badge>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-normal md:text-6xl">Find verified travel forex near you. Compare live rates. Book safely.</h1>
            <p className="max-w-xl text-lg text-muted-foreground">RoamFX helps travellers avoid unsafe dealers, airport markups, hidden fees, and fake notes by routing every exchange through verified authorised forex partners.</p>
          </div>
          <div className="flex flex-wrap gap-3"><Button asChild size="lg"><Link href="/rates">Compare rates <ArrowRight data-icon="inline-end" /></Link></Button><Button asChild variant="outline" size="lg"><a href="#join-beta">Join beta</a></Button></div>
        </div>
        <div className="flex flex-col gap-4"><ComplianceBanner /><RateComparison /></div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Feature icon={<CircleHelp />} title="Problem" text="Travellers often overpay at airport counters or risk informal cash exchange. RoamFX brings rates, partners, fees, and fulfilment into one safe workflow." />
        <Feature icon={<WalletCards />} title="How it works" text="Search, compare, reserve, upload KYC where required, and complete the transaction through the selected verified partner." />
        <Feature icon={<Plane />} title="Why not airport exchange" text="Airport exchange can be convenient, but spreads and fees may be less favourable. Use it only for emergency cash and compare before you fly." />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck /> Verified partners</CardTitle><CardDescription>Only verified partners appear in public search.</CardDescription></CardHeader>
          <CardContent className="grid gap-3">
            {["AD Category banks and entities", "FFMCs and authorised money changers", "Travel-forex providers with verification status", "Pickup, delivery, or store visit fulfilment"].map(item => <div key={item} className="flex items-center gap-2 rounded-lg border p-3 text-sm"><CheckCircle2 className="text-primary" /> {item}</div>)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BrainCircuit /> AI travel money planner</CardTitle><CardDescription>Plan cash/card split before booking.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4"><div className="text-2xl font-semibold">35%</div><p className="text-sm text-muted-foreground">Suggested cash mix for sample mid-range trips, adjusted by risk and activities.</p></div>
            <div className="rounded-lg border p-4"><div className="text-2xl font-semibold">0 P2P</div><p className="text-sm text-muted-foreground">Assistant explicitly avoids unlicensed cash meetup guidance.</p></div>
            <Button asChild className="md:col-span-2"><Link href="/planner">Open planner</Link></Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Feature icon={<RefreshCcw />} title="Leftover currency buyback" text="Declare leftover currency after your trip and route the request to authorised partner buyback flow." />
        <Feature icon={<ShieldCheck />} title="Safety and compliance" text="Cash threshold guardrails, KYC checklist, verified partner status, suspicious rate warnings, and clear disclaimers." />
        <Feature icon={<Banknote />} title="Transparent total cost" text="Compare sell rate, buyback rate, service fee, available amount, freshness, and suspicious deviation indicators." />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Card><CardHeader><CardTitle>Booking flow</CardTitle><CardDescription>Built for mobile-first traveller decisions.</CardDescription></CardHeader><CardContent className="grid gap-3">{steps.map((step, index) => <div key={step} className="flex items-center gap-3 rounded-lg border p-3"><span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm text-primary-foreground">{index + 1}</span><span className="font-medium">{step}</span></div>)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Nearby partners</CardTitle><CardDescription>Prepared for Google Maps or Mapbox integration.</CardDescription></CardHeader><CardContent><MapPlaceholder /></CardContent></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader><CardTitle>FAQ</CardTitle><CardDescription>Beta launch questions travellers and partners ask first.</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-3">{faqs.map(([q, a]) => <div key={q} className="rounded-lg border p-4"><div className="font-medium">{q}</div><p className="mt-1 text-sm text-muted-foreground">{a}</p></div>)}</CardContent>
        </Card>
        <WaitlistForm />
      </section>
    </main>
  </AppShell>;
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base">{icon}{title}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{text}</CardContent></Card>;
}
