"use client";

import { useEffect, useRef, useState } from "react";
import { CreditCard, Mail, Mic, MicOff, MessageCircle, Phone, Plane, Send, Sparkles, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AiCard = { kind: "flight" | "partner" | "coupon"; title: string; subtitle: string; price?: string };
type AiMessage = { role: "user" | "ai"; text: string; cards?: AiCard[] };

const quickPrompts = [
  "Plan my trip",
  "Find best forex rate",
  "How much cash should I carry?",
  "Find cheap flights",
  "Apply coupon"
];

function getReply(question: string): AiMessage {
  const text = question.toLowerCase();
  if (text.includes("rate") || text.includes("usd") || text.includes("forex")) {
    return {
      role: "ai",
      text: "Today's best demo USD rate is Rs 84.12 from Global Forex Pvt. Ltd. Final rate locks only through verified authorised partners.",
      cards: [
        { kind: "partner", title: "Global Forex Pvt. Ltd.", subtitle: "AD-I verified • same day", price: "Rs 84.12/USD" },
        { kind: "partner", title: "Travel Currency Exchange", subtitle: "FFMC verified • lowest fee", price: "Rs 84.18/USD" }
      ]
    };
  }
  if (text.includes("flight") || text.includes("cheap")) {
    return {
      role: "ai",
      text: "I found flight deal prototypes with AI price prediction. Real ticketing still needs supplier integration, but the investor demo flow is ready.",
      cards: [
        { kind: "flight", title: "Emirates DEL to DXB", subtitle: "Non-stop • 4h 10m", price: "Rs 22,400" },
        { kind: "flight", title: "Air India DEL to DXB", subtitle: "Non-stop • 3h 55m", price: "Rs 24,150" }
      ]
    };
  }
  if (text.includes("coupon")) {
    return {
      role: "ai",
      text: "Try ROAMFIRST for first-order savings or FLIGHTFX for a flight + forex bundle.",
      cards: [{ kind: "coupon", title: "ROAMFIRST", subtitle: "5% off first order, max Rs 500" }]
    };
  }
  if (text.includes("cash") || text.includes("carry")) {
    return { role: "ai", text: "For a 7-day Dubai trip, a practical split is AED 2,500 cash plus AED 4,000 on a forex card, with an INR emergency reserve. Confirm rules and rates before transaction." };
  }
  if (text.includes("doc") || text.includes("kyc")) {
    return { role: "ai", text: "Keep PAN, passport, visa or ticket, and address proof ready. RoamFX only routes transactions through verified authorised partners subject to KYC and partner acceptance." };
  }
  return { role: "ai", text: "Share destination, dates, travellers, budget, and currency. I can create a forex, flight, coupon, and document checklist while keeping the flow compliance-safe." };
}

export function RoamAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const [emailModal, setEmailModal] = useState(false);
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "unsupported">("idle");
  const [messages, setMessages] = useState<AiMessage[]>([
    { role: "ai", text: "Hi! I'm Roam AI. Tell me your destination, dates and budget. Hindi or Hinglish also works in the future voice flow." }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [messages, open]);

  function send(prompt?: string) {
    const question = (prompt ?? input).trim();
    if (!question) return;
    setInput("");
    setMessages((items) => [...items, { role: "user", text: question }]);
    setTimeout(() => setMessages((items) => [...items, getReply(question)]), 350);
    if (/email|mail/i.test(question)) setTimeout(() => setEmailModal(true), 500);
  }

  function toggleVoice() {
    const SpeechRecognition = typeof window !== "undefined" ? ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition) : null;
    if (!SpeechRecognition) {
      setVoiceState("unsupported");
      setMessages((items) => [...items, { role: "ai", text: "Voice input is not supported in this browser, so I switched back to text." }]);
      return;
    }
    if (voiceState === "listening") {
      setVoiceState("idle");
      return;
    }
    setVoiceState("listening");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceState("idle");
      send(transcript);
    };
    recognition.onerror = () => setVoiceState("idle");
    recognition.onend = () => setVoiceState("idle");
    recognition.start();
  }

  if (!open) {
    return <button onClick={() => setOpen(true)} className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-gradient-hero px-5 py-3 text-sm font-medium text-primary-foreground shadow-elegant transition hover:scale-105 md:bottom-6 md:right-6">
      <Sparkles className="h-4 w-4" /> Ask Roam AI
    </button>;
  }

  return <>
    <div className="fixed inset-x-2 bottom-2 z-50 flex h-[80vh] flex-col overflow-hidden rounded-2xl border bg-card shadow-elegant md:bottom-6 md:left-auto md:right-6 md:h-[600px] md:w-[400px]">
      <div className="flex items-center justify-between bg-gradient-hero px-4 py-3 text-primary-foreground">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"><Sparkles className="h-4 w-4" /></div>
          <div>
            <div className="text-sm font-semibold">Roam AI</div>
            <div className="text-[10px] opacity-80">Travel, flights and forex assistant</div>
          </div>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Close Roam AI"><X className="h-4 w-4" /></button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message, index) => <div key={index} className={`flex flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}>
          <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>{message.text}</div>
          {message.cards?.map((card) => <div key={`${index}-${card.title}`} className="flex w-[85%] items-center gap-3 rounded-xl border bg-card p-3 shadow-card">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
              {card.kind === "flight" ? <Plane className="h-4 w-4" /> : card.kind === "partner" ? <CreditCard className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{card.title}</div>
              <div className="text-xs text-muted-foreground">{card.subtitle}</div>
            </div>
            {card.price ? <div className="text-sm font-bold">{card.price}</div> : null}
          </div>)}
        </div>)}
        {voiceState === "listening" ? <div className="rounded-xl bg-primary/10 p-3 text-center text-xs font-semibold text-primary">Listening...</div> : null}
      </div>

      <div className="border-t p-2">
        <div className="mb-2 flex flex-wrap gap-1">
          {quickPrompts.map((prompt) => <button key={prompt} onClick={() => send(prompt)} className="rounded-full bg-secondary px-3 py-1 text-[11px] hover:bg-primary/10">{prompt}</button>)}
        </div>
        <div className="mb-2 flex gap-1">
          <button onClick={() => setEmailModal(true)} className="flex-1 rounded-lg border px-2 py-1 text-[11px] hover:bg-secondary"><Mail className="mr-1 inline h-3 w-3" /> Email pack</button>
          <button onClick={() => setMessages((items) => [...items, { role: "ai", text: "Callback requested. A production version would create a support lead and SLA timer." }])} className="flex-1 rounded-lg border px-2 py-1 text-[11px] hover:bg-secondary"><Phone className="mr-1 inline h-3 w-3" /> Callback</button>
          <button onClick={() => setMessages((items) => [...items, { role: "ai", text: "WhatsApp handoff placeholder. Production integration should avoid sharing sensitive KYC data in chat." }])} className="flex-1 rounded-lg border px-2 py-1 text-[11px] hover:bg-secondary"><MessageCircle className="mr-1 inline h-3 w-3" /> WhatsApp</button>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant={voiceState === "listening" ? "destructive" : "outline"} onClick={toggleVoice}>{voiceState === "listening" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}</Button>
          <Input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") send(); }} placeholder="Ask anything..." />
          <Button size="icon" onClick={() => send()} className="bg-gradient-hero"><Send className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>

    {emailModal ? <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 p-4" onClick={() => setEmailModal(false)}>
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-elegant" onClick={(event) => event.stopPropagation()}>
        <h3 className="text-lg font-bold">Email your travel pack</h3>
        <p className="mt-1 text-sm text-muted-foreground">Prototype email notification placeholder for forex partner, flight options, coupons, and document checklist.</p>
        <div className="my-4 rounded-xl border bg-secondary/40 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Your RoamFX Travel Pack</p>
          <p className="mt-2">Best forex partner, flight options, coupon, KYC checklist, and no-P2P compliance reminder.</p>
        </div>
        <Input type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setEmailModal(false)}>Cancel</Button>
          <Button className="bg-gradient-hero" onClick={() => { setEmailModal(false); setMessages((items) => [...items, { role: "ai", text: `Travel pack queued for ${email || "your email"}.` }]); }}>Send pack</Button>
        </div>
      </div>
    </div> : null}
  </>;
}
