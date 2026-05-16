"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Banknote, Building2, Check, Clock, CreditCard, Shield, Sparkles, Tag, Upload, Wallet } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { LovablePageHero } from "@/components/lovable-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { applyDemoCoupon, checkoutPartners, coupons, type PartnerQuote, type ServiceType } from "@/lib/lovable-platform";
import { lovableCities, lovableCurrencies } from "@/lib/lovable-forex";

const serviceOptions: Array<{ id: ServiceType; label: string; desc: string }> = [
  { id: "buy", label: "Buy Foreign Currency", desc: "Cash notes with delivery, branch or airport pickup" },
  { id: "sell", label: "Sell Foreign Currency", desc: "Leftover forex buy-back through authorised partner" },
  { id: "card", label: "Forex Travel Card", desc: "Multi-currency card with cash backup" },
  { id: "send", label: "Send Money Abroad", desc: "Outward remittance request" },
  { id: "student", label: "Student Remittance", desc: "Tuition, living expenses and GIC style planning" },
  { id: "bundle", label: "Flight + Forex Bundle", desc: "Bundle flight deal with verified partner forex" }
];

const steps = ["Service", "Trip", "AI Plan", "Compare", "Coupon", "KYC", "Payment", "Confirm"];

export function SmartCheckout({ initialService = "buy" }: { initialService?: ServiceType }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<ServiceType>(initialService);
  const [city, setCity] = useState("Mumbai");
  const [destination, setDestination] = useState("Dubai");
  const [currency, setCurrency] = useState("AED");
  const [amount, setAmount] = useState("2500");
  const [travellers, setTravellers] = useState("2");
  const [purpose, setPurpose] = useState("Tourism");
  const [selectedPartner, setSelectedPartner] = useState<PartnerQuote>(checkoutPartners[0]);
  const [coupon, setCoupon] = useState("ROAMFIRST");
  const [couponResult, setCouponResult] = useState<{ ok: boolean; discount?: number; error?: string } | null>(null);
  const [docs, setDocs] = useState<Record<string, boolean>>({});
  const [terms, setTerms] = useState(false);

  const total = Number(amount || 0) * selectedPartner.rate + selectedPartner.serviceFee + selectedPartner.deliveryFee;
  const discount = couponResult?.ok ? couponResult.discount ?? 0 : 0;
  const finalPayable = Math.max(0, total - discount);
  const requiredDocs = useMemo(() => {
    const list = ["PAN", "Passport", "Address Proof"];
    if (service !== "sell") list.push("Visa / Ticket");
    if (service === "send" || service === "student") list.push("A2 Form");
    if (service === "student" || purpose === "Education") list.push("University Invoice");
    return list;
  }, [service, purpose]);

  function applyCoupon() {
    setCouponResult(applyDemoCoupon(coupon, service, total));
  }

  return <AppShell>
    <LovablePageHero eyebrow="Smart checkout" title="Complete your booking in minutes" subtitle="A Lovable-inspired multi-step checkout with service selection, trip details, AI guidance, partner comparison, coupons, KYC checklist and payment placeholder." />
    <section className="mx-auto max-w-5xl px-4 py-10">
      <Card className="rounded-2xl shadow-card">
        <div className="overflow-x-auto border-b p-4 md:p-6">
          <div className="flex min-w-max items-center gap-2">
            {steps.map((label, index) => <div key={label} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${index <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{index < step ? <Check className="h-4 w-4" /> : index + 1}</div>
              <span className={`text-xs md:text-sm ${index === step ? "font-semibold" : "text-muted-foreground"}`}>{label}</span>
              {index < steps.length - 1 ? <span className="mx-1 hidden h-px w-6 bg-border md:block" /> : null}
            </div>)}
          </div>
        </div>
        <CardContent className="p-4 md:p-6">
          {step === 0 ? <div className="grid gap-3 sm:grid-cols-2">
            {serviceOptions.map((item) => <button key={item.id} onClick={() => setService(item.id)} className={`rounded-xl border p-5 text-left transition ${service === item.id ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}>
              <div className="font-semibold">{item.label}</div>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </button>)}
          </div> : null}

          {step === 1 ? <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Travel destination"><Input value={destination} onChange={(event) => setDestination(event.target.value)} /></Field>
            <Field label="Your city in India"><select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={city} onChange={(event) => setCity(event.target.value)}>{lovableCities.map((item) => <option key={item}>{item}</option>)}</select></Field>
            <Field label="Travellers"><Input type="number" min={1} value={travellers} onChange={(event) => setTravellers(event.target.value)} /></Field>
            <Field label="Currency"><select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={currency} onChange={(event) => setCurrency(event.target.value)}>{lovableCurrencies.map((item) => <option key={item.code} value={item.code}>{item.flag} {item.code}</option>)}</select></Field>
            <Field label="Amount in foreign currency"><Input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} /></Field>
            <Field label="Purpose"><select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={purpose} onChange={(event) => setPurpose(event.target.value)}>{["Tourism", "Business", "Education", "Medical", "Family Maintenance"].map((item) => <option key={item}>{item}</option>)}</select></Field>
          </div> : null}

          {step === 2 ? <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-hero p-5 text-primary-foreground">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80"><Sparkles className="h-4 w-4" /> Roam AI recommendation</div>
              <h3 className="mt-2 text-xl font-semibold">For a {destination} trip with {travellers} traveller(s)</h3>
              <p className="mt-1 text-sm opacity-90">Carry {Math.round(Number(amount) * 0.4)} {currency} as cash and {Math.round(Number(amount) * 0.6)} {currency} on a forex card. Keep a documented emergency reserve and confirm applicable rules before transaction.</p>
            </div>
            <div className="rounded-xl border bg-secondary/50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><AlertTriangle className="h-4 w-4 text-warning" /> Smart warnings</div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Avoid airport exchange counters when better verified partner quotes are available.</li>
                <li>• Decline DCC when swiping abroad.</li>
                <li>• RoamFX does not support unlicensed P2P currency exchange.</li>
              </ul>
            </div>
          </div> : null}

          {step === 3 ? <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-sm text-primary"><Clock className="h-4 w-4" /> Rate lock preview: 09:59 after partner selection</div>
            {checkoutPartners.map((partner, index) => {
              const selected = selectedPartner.id === partner.id;
              const rowTotal = Number(amount || 0) * partner.rate + partner.serviceFee + partner.deliveryFee;
              return <button key={partner.id} onClick={() => setSelectedPartner(partner)} className={`w-full rounded-xl border p-4 text-left transition ${selected ? "border-primary bg-primary/5" : "hover:border-primary/40"}`}>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{partner.name}</span>
                      <Badge variant="outline">{partner.licenseType}</Badge>
                      <span className="text-xs text-muted-foreground">Star {partner.rating}</span>
                      {index === 0 ? <Badge className="bg-success text-white">Best Value</Badge> : null}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Fee Rs {partner.serviceFee} + Delivery Rs {partner.deliveryFee} • {partner.deliveryTime}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-xs text-muted-foreground">Rate Rs {partner.rate.toFixed(2)} / {currency}</div>
                    <div className="text-lg font-bold">Rs {rowTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
              </button>;
            })}
          </div> : null}

          {step === 4 ? <div className="space-y-4">
            <div className="rounded-xl border p-4">
              <label className="text-sm font-medium">Apply coupon</label>
              <div className="mt-2 flex gap-2"><Input value={coupon} onChange={(event) => setCoupon(event.target.value.toUpperCase())} /><Button onClick={applyCoupon} className="bg-gradient-hero"><Tag className="h-4 w-4" /> Apply</Button></div>
              {couponResult?.ok ? <p className="mt-2 text-sm text-success">Coupon applied. Saved Rs {couponResult.discount}</p> : null}
              {couponResult && !couponResult.ok ? <p className="mt-2 text-sm text-destructive">{couponResult.error}</p> : null}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">{coupons.map((item) => <button key={item.code} onClick={() => setCoupon(item.code)} className="flex items-center justify-between rounded-lg border border-dashed p-3 text-sm hover:border-primary"><span className="font-mono font-semibold">{item.code}</span><span className="text-xs text-muted-foreground">{item.detail}</span></button>)}</div>
          </div> : null}

          {step === 5 ? <div className="space-y-3">
            {requiredDocs.map((doc) => <button key={doc} onClick={() => setDocs((items) => ({ ...items, [doc]: !items[doc] }))} className={`flex w-full items-center justify-between rounded-xl border p-4 text-left ${docs[doc] ? "border-success bg-success/5" : ""}`}>
              <div><div className="font-semibold">{doc}</div><div className="text-xs text-muted-foreground">Metadata upload placeholder. Sensitive raw data should not be logged.</div></div>
              {docs[doc] ? <Check className="h-5 w-5 text-success" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
            </button>)}
          </div> : null}

          {step === 6 ? <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {[["upi", Wallet, "UPI"], ["card", CreditCard, "Card"], ["transfer", Building2, "Bank transfer"], ["later", Banknote, "Pay at partner"]].map(([id, Icon, label]) => <button key={id as string} className="rounded-xl border p-4 text-left hover:border-primary"><Icon className="h-5 w-5 text-primary" /><div className="mt-2 font-semibold">{label as string}</div></button>)}
            </div>
            <label className="flex items-start gap-2 rounded-xl border p-4 text-sm"><input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} /> I understand transactions are completed only through verified authorised partners, subject to KYC, laws and partner acceptance.</label>
            <div className="rounded-xl bg-secondary p-4">
              <div className="flex justify-between text-sm"><span>Order total</span><span>Rs {total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span></div>
              <div className="flex justify-between text-sm text-success"><span>Discount</span><span>- Rs {discount.toLocaleString("en-IN")}</span></div>
              <div className="mt-2 flex justify-between border-t pt-2 text-lg font-bold"><span>Payable</span><span>Rs {finalPayable.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span></div>
            </div>
          </div> : null}

          {step === 7 ? <div className="rounded-2xl border border-success/30 bg-success/5 p-6 text-center">
            <Shield className="mx-auto h-10 w-10 text-success" />
            <h2 className="mt-4 text-2xl font-bold">Booking request created</h2>
            <p className="mt-2 text-sm text-muted-foreground">Demo reference RFX{Math.floor(10000 + finalPayable % 89999)}. Partner confirmation, KYC review and settlement are tracked in the traveller dashboard.</p>
            <Button asChild className="mt-5 bg-gradient-hero"><a href="/bookings">View bookings</a></Button>
          </div> : null}

          <div className="mt-8 flex justify-between border-t pt-5">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Back</Button>
            <Button className="bg-gradient-hero" disabled={step === 6 && !terms} onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}>{step === 6 ? "Confirm request" : step === 7 ? "Done" : "Continue"}</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  </AppShell>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1 text-sm font-medium text-muted-foreground">{label}{children}</label>;
}
