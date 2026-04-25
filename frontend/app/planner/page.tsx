"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Banknote, CheckCircle2, CreditCard, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import type React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppShell } from "@/components/app-shell";
import { ComplianceBanner } from "@/components/compliance-banner";
import { api } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const plannerSchema = z.object({
  destinationCountry: z.string().min(2),
  destinationCity: z.string().optional(),
  departureCountry: z.string().min(2),
  tripDays: z.coerce.number().min(1).max(180),
  travellerCount: z.coerce.number().min(1).max(20),
  travelStyle: z.enum(["BUDGET", "MID_RANGE", "LUXURY"]),
  hotelBooked: z.enum(["true", "false"]),
  cardsAvailable: z.string().optional(),
  expectedActivities: z.string().optional(),
  plannedCashAmount: z.coerce.number().min(0),
  preferredCurrency: z.string().min(3).max(3),
  riskPreference: z.enum(["LOW", "MODERATE", "HIGH"])
});

type PlannerForm = z.infer<typeof plannerSchema>;
type TravelMoneyPlan = {
  recommendedCashAmount: number;
  recommendedCardAmount: number;
  suggestedDenominations: string[];
  dailyBudgetEstimate: number;
  emergencyCashSuggestion: number;
  airportExchangeWarning: string;
  atmUsageAdvice: string;
  cardAcceptanceAdvice: string;
  scamWarnings: string[];
  countrySpecificTips: string[];
  checklist: string[];
  confidenceScore: number;
  disclaimer: string;
  provider: string;
};

const splitList = (value?: string) => value?.split(",").map(item => item.trim()).filter(Boolean) ?? [];

export default function Page() {
  const { register, handleSubmit, formState: { errors } } = useForm<PlannerForm>({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      destinationCountry: "Thailand",
      destinationCity: "Bangkok",
      departureCountry: "India",
      tripDays: 7,
      travellerCount: 2,
      travelStyle: "MID_RANGE",
      hotelBooked: "true",
      cardsAvailable: "Visa, Mastercard",
      expectedActivities: "street food, temples, shopping, day trips",
      plannedCashAmount: 350,
      preferredCurrency: "THB",
      riskPreference: "MODERATE"
    }
  });
  const mutation = useMutation({
    mutationFn: (values: PlannerForm) => api<TravelMoneyPlan>("/api/ai/travel-money-plan", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        hotelBooked: values.hotelBooked === "true",
        cardsAvailable: splitList(values.cardsAvailable),
        expectedActivities: splitList(values.expectedActivities),
        preferredCurrency: values.preferredCurrency.toUpperCase()
      })
    })
  });

  return <AppShell>
    <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6">
      <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col gap-4">
          <Badge variant="secondary" className="w-fit"><Sparkles data-icon="inline-start" /> Provider-ready assistant</Badge>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold md:text-5xl">AI travel money planner</h1>
            <p className="max-w-2xl text-muted-foreground">Estimate a sensible cash/card split, emergency buffer, denominations, ATM usage, and safety checklist before booking forex through verified authorised partners.</p>
          </div>
          <ComplianceBanner />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Trip profile</CardTitle>
            <CardDescription>Guidance is deterministic in local mode and shares the same contract future OpenAI, Bedrock, or Vertex AI providers will use.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(values => mutation.mutate(values))} className="grid gap-3 md:grid-cols-2">
              <Field error={errors.destinationCountry?.message}><Input placeholder="Destination country" {...register("destinationCountry")} /></Field>
              <Field><Input placeholder="Destination city" {...register("destinationCity")} /></Field>
              <Field error={errors.departureCountry?.message}><Input placeholder="Departure country" {...register("departureCountry")} /></Field>
              <Field error={errors.preferredCurrency?.message}><Input placeholder="Preferred currency" {...register("preferredCurrency")} /></Field>
              <Field><Input type="number" min={1} placeholder="Trip days" {...register("tripDays")} /></Field>
              <Field><Input type="number" min={1} placeholder="Travellers" {...register("travellerCount")} /></Field>
              <Select {...register("travelStyle")}><option value="BUDGET">Budget</option><option value="MID_RANGE">Mid range</option><option value="LUXURY">Luxury</option></Select>
              <Select {...register("riskPreference")}><option value="LOW">Low cash risk</option><option value="MODERATE">Balanced</option><option value="HIGH">Higher cash buffer</option></Select>
              <Select {...register("hotelBooked")}><option value="true">Hotel booked</option><option value="false">Hotel not booked</option></Select>
              <Field><Input type="number" min={0} placeholder="Planned cash amount" {...register("plannedCashAmount")} /></Field>
              <div className="md:col-span-2"><Textarea placeholder="Cards available, comma separated" {...register("cardsAvailable")} /></div>
              <div className="md:col-span-2"><Textarea placeholder="Expected activities, comma separated" {...register("expectedActivities")} /></div>
              <Button className="md:col-span-2" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Sparkles data-icon="inline-start" />}
                Generate travel money plan
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {mutation.isError ? <Alert className="border-destructive/40">
        <AlertTriangle data-icon="inline-start" />
        <AlertTitle>Planner could not generate advice</AlertTitle>
        <AlertDescription>{mutation.error instanceof Error ? mutation.error.message : "Please check the form and try again."}</AlertDescription>
      </Alert> : null}

      {mutation.isPending ? <Card><CardContent className="flex items-center gap-3 p-6 text-sm text-muted-foreground"><Loader2 className="animate-spin" /> Preparing a compliance-safe travel money plan...</CardContent></Card> : null}

      {mutation.data ? <PlanResult plan={mutation.data} /> : <Card><CardContent className="p-6 text-sm text-muted-foreground">Run the planner to see cash/card estimates, scam warnings, and a verified-partner checklist.</CardContent></Card>}
    </main>
  </AppShell>;
}

function Field({ children, error }: { children: React.ReactNode; error?: string }) {
  return <div className="flex flex-col gap-1">{children}{error ? <span className="text-xs text-destructive">{error}</span> : null}</div>;
}

function PlanResult({ plan }: { plan: TravelMoneyPlan }) {
  const money = (value: number) => Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 });
  return <section className="grid gap-4 lg:grid-cols-3">
    <Card className="lg:col-span-1">
      <CardHeader><CardTitle className="flex items-center gap-2"><Banknote /> Recommended split</CardTitle><CardDescription>Confidence {(Number(plan.confidenceScore) * 100).toFixed(0)}% via {plan.provider}</CardDescription></CardHeader>
      <CardContent className="grid gap-3">
        <Metric icon={<Banknote />} label="Cash" value={money(plan.recommendedCashAmount)} />
        <Metric icon={<CreditCard />} label="Card" value={money(plan.recommendedCardAmount)} />
        <Metric icon={<ShieldCheck />} label="Emergency cash" value={money(plan.emergencyCashSuggestion)} />
        <Metric icon={<CheckCircle2 />} label="Daily budget" value={money(plan.dailyBudgetEstimate)} />
      </CardContent>
    </Card>
    <Card className="lg:col-span-2">
      <CardHeader><CardTitle>Practical guidance</CardTitle><CardDescription>Use this as preparation, then confirm live rates and rules before transacting.</CardDescription></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Advice title="Denominations" items={plan.suggestedDenominations} />
        <Advice title="Scam warnings" items={plan.scamWarnings} />
        <Advice title="Country tips" items={plan.countrySpecificTips} />
        <Advice title="Checklist" items={plan.checklist} />
        <div className="md:col-span-2 grid gap-3">
          <Callout title="Airport exchange warning" body={plan.airportExchangeWarning} />
          <Callout title="ATM usage advice" body={plan.atmUsageAdvice} />
          <Callout title="Card acceptance advice" body={plan.cardAcceptanceAdvice} />
          <Alert className="border-secondary/60 bg-secondary/15"><AlertTitle>Disclaimer</AlertTitle><AlertDescription>{plan.disclaimer}</AlertDescription></Alert>
        </div>
      </CardContent>
    </Card>
  </section>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-lg border p-3"><div className="flex items-center gap-2 text-sm text-muted-foreground">{icon}{label}</div><div className="text-xl font-semibold">{value}</div></div>;
}

function Advice({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-lg border p-4"><h3 className="font-medium">{title}</h3><ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">{items.map(item => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 shrink-0 text-primary" /> <span>{item}</span></li>)}</ul></div>;
}

function Callout({ title, body }: { title: string; body: string }) {
  return <div className="rounded-lg border bg-muted/40 p-4"><div className="font-medium">{title}</div><p className="mt-1 text-sm text-muted-foreground">{body}</p></div>;
}
