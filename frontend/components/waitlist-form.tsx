"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trackEvent } from "@/lib/analytics";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const waitlistSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  city: z.string().min(2, "Enter your city"),
  nextTravelDestination: z.string().min(2, "Enter a destination"),
  expectedTravelDate: z.string().optional(),
  interestedIn: z.enum(["BUY_FOREX", "SELL_LEFTOVER", "PARTNER_LISTING", "AI_PLANNER"])
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

export function WaitlistForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { interestedIn: "BUY_FOREX" }
  });
  const mutation = useMutation({
    mutationFn: (values: WaitlistFormValues) => api("/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ ...values, expectedTravelDate: values.expectedTravelDate || null })
    }),
    onSuccess: (_, values) => {
      trackEvent("waitlist_joined", { city: values.city, interestedIn: values.interestedIn });
      reset({ interestedIn: "BUY_FOREX" });
    }
  });

  return <Card id="join-beta" className="border-primary/30">
    <CardHeader>
      <CardTitle>Join beta waitlist</CardTitle>
      <CardDescription>Get early access to verified partner search, rate comparison, buyback routing, and the AI planner.</CardDescription>
    </CardHeader>
    <CardContent>
      {mutation.isSuccess ? <div className="mb-4 flex items-center gap-2 rounded-lg border bg-accent/40 p-3 text-sm"><CheckCircle2 className="text-primary" /> You’re on the list. We’ll reach out before public beta opens in your city.</div> : null}
      {mutation.isError ? <div className="mb-4 rounded-lg border border-destructive/40 p-3 text-sm text-destructive">{mutation.error instanceof Error ? mutation.error.message : "Could not join waitlist"}</div> : null}
      <form onSubmit={handleSubmit(values => mutation.mutate(values))} className="grid gap-3 md:grid-cols-2">
        <Field error={errors.name?.message}><Input placeholder="Name" {...register("name")} /></Field>
        <Field error={errors.email?.message}><Input placeholder="Email" {...register("email")} /></Field>
        <Field><Input placeholder="Phone optional" {...register("phone")} /></Field>
        <Field error={errors.city?.message}><Input placeholder="City" {...register("city")} /></Field>
        <Field error={errors.nextTravelDestination?.message}><Input placeholder="Next travel destination" {...register("nextTravelDestination")} /></Field>
        <Field><Input type="date" {...register("expectedTravelDate")} /></Field>
        <div className="md:col-span-2">
          <Select {...register("interestedIn")}>
            <option value="BUY_FOREX">Buy forex</option>
            <option value="SELL_LEFTOVER">Sell leftover currency</option>
            <option value="PARTNER_LISTING">Partner listing</option>
            <option value="AI_PLANNER">AI planner</option>
          </Select>
        </div>
        <Button className="md:col-span-2" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : null}
          Join waitlist
        </Button>
      </form>
    </CardContent>
  </Card>;
}

function Field({ children, error }: { children: React.ReactNode; error?: string }) {
  return <div className="flex flex-col gap-1">{children}{error ? <span className="text-xs text-destructive">{error}</span> : null}</div>;
}
