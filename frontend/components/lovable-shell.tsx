"use client";

import type React from "react";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Globe2, Mail, MapPin, Menu, Phone, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { RoamAI } from "@/components/roam-ai";

const menus = [
  {
    label: "Forex",
    items: [
      { href: "/dashboard", label: "Buy Forex" },
      { href: "/sell-leftover", label: "Sell Forex" },
      { href: "/forex-card", label: "Forex Card" },
      { href: "/rates", label: "Live Rates" },
      { href: "/checkout", label: "Smart Checkout" }
    ]
  },
  {
    label: "Send Money",
    items: [
      { href: "/send-money", label: "Education Remittance" },
      { href: "/send-money", label: "Medical Remittance" },
      { href: "/send-money", label: "Family Maintenance" },
      { href: "/send-money", label: "Visa Fee Transfer" }
    ]
  },
  {
    label: "Travel AI",
    items: [
      { href: "/planner", label: "AI Trip Planner" },
      { href: "/flight-deals", label: "AI Flight Deals" },
      { href: "/planner", label: "Budget Calculator" },
      { href: "/visa", label: "Visa Checklist" }
    ]
  }
];

export function LovableSiteShell({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-background">
    <LovableNavbar />
    <main className="flex-1 pb-14 md:pb-0">{children}</main>
    <LovableFooter />
    <MobileBottomNav />
    <RoamAI />
  </div>;
}

export function LovablePageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return <section className="border-b bg-gradient-to-b from-secondary/70 to-background">
    <div className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
      {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p> : null}
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight lg:text-5xl">{title}</h1>
      {subtitle ? <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p> : null}
    </div>
  </section>;
}

function LovableNavbar() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b bg-background/82 backdrop-blur-lg">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-elegant">
          <Globe2 className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight">Roam<span className="text-gradient">FX</span></span>
      </Link>

      <nav className="hidden items-center gap-1 lg:flex">
        {menus.map((menu) => <div key={menu.label} className="group relative">
          <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-foreground">
            {menu.label} <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <div className="invisible absolute left-0 top-full w-60 translate-y-1 pt-2 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <div className="rounded-xl border bg-card p-2 shadow-elegant">
              {menu.items.map((item) => <Link key={item.label} href={item.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-secondary">{item.label}</Link>)}
            </div>
          </div>
        </div>)}
        <Link href="/study-abroad" className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary">Study Abroad</Link>
        <Link href="/flight-deals" className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary">Flights</Link>
        <Link href="/blog" className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary">Blog</Link>
        <Link href="/contact" className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary">Contact</Link>
      </nav>

      <div className="hidden items-center gap-2 lg:flex">
        <Button asChild variant="ghost" size="sm"><Link href="/login">Login</Link></Button>
        <Button asChild size="sm" className="bg-gradient-hero shadow-elegant"><Link href="/dashboard">Get Started</Link></Button>
      </div>

      <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
    </div>

    {open ? <div className="border-t bg-background lg:hidden">
      <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
        {menus.flatMap((menu) => menu.items).concat([
          { href: "/study-abroad", label: "Study Abroad" },
          { href: "/flight-deals", label: "Flights" },
          { href: "/blog", label: "Blog" },
          { href: "/contact", label: "Contact" },
          { href: "/dashboard", label: "Dashboard" },
          { href: "/login", label: "Login" }
        ]).map((item) => <Link key={`${item.href}-${item.label}`} href={item.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-secondary">{item.label}</Link>)}
        <Button asChild className="mt-2 w-full bg-gradient-hero"><Link href="/dashboard" onClick={() => setOpen(false)}>Get Started</Link></Button>
      </div>
    </div> : null}
  </header>;
}

function LovableFooter() {
  const cols = [
    { title: "Forex Services", links: [{ href: "/dashboard", label: "Buy Forex" }, { href: "/sell-leftover", label: "Sell Forex" }, { href: "/forex-card", label: "Forex Card" }, { href: "/rates", label: "Live Rates" }, { href: "/send-money", label: "Send Money Abroad" }] },
    { title: "Travel & AI", links: [{ href: "/planner", label: "AI Trip Planner" }, { href: "/flight-deals", label: "AI Flight Deals" }, { href: "/visa", label: "Visa Assistance" }, { href: "/study-abroad", label: "Study Abroad" }, { href: "/blog", label: "Travel Guides" }] },
    { title: "Popular Currencies", links: [{ href: "/rates", label: "USD Rate" }, { href: "/rates", label: "EUR Rate" }, { href: "/rates", label: "GBP Rate" }, { href: "/rates", label: "AED Rate" }] },
    { title: "Popular Cities", links: [{ href: "/partners", label: "Forex in Delhi" }, { href: "/partners", label: "Forex in Mumbai" }, { href: "/partners", label: "Forex in Bengaluru" }, { href: "/partners", label: "Forex in Chennai" }] }
  ];
  return <footer className="border-t bg-secondary/40">
    <div className="mx-auto max-w-7xl px-4 py-14">
      <div className="grid gap-10 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground"><Globe2 className="h-5 w-5" /></div>
            <span className="text-xl font-bold">Roam<span className="text-gradient">FX</span></span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">AI-powered travel forex platform. Compare verified partner rates, plan trips, and manage travel money in one place.</p>
          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@roamfx.app</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 80000 00000</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Bengaluru, India</li>
          </ul>
        </div>
        {cols.map((col) => <div key={col.title}>
          <h4 className="text-sm font-semibold">{col.title}</h4>
          <ul className="mt-4 space-y-2">
            {col.links.map((link) => <li key={link.label}><Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">{link.label}</Link></li>)}
          </ul>
        </div>)}
      </div>
      <div className="mt-10 rounded-xl border bg-background p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">Compliance note:</strong> RoamFX is a technology platform. Currency exchange, forex card, and remittance services are fulfilled only through verified authorised partners subject to applicable RBI/FEMA guidelines, KYC, payment rules, and partner acceptance. RoamFX does not support unlicensed P2P cash exchange.
      </div>
      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} RoamFX. All rights reserved.</p>
        <div className="flex gap-5 text-xs text-muted-foreground"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/compliance">Safety</Link></div>
      </div>
    </div>
  </footer>;
}

function LovableAIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "ai" | "user"; text: string }>>([{ role: "ai", text: "Hi, I am Roam AI. Ask me about forex rates, KYC, travel cards, remittance, or trip planning." }]);
  const [input, setInput] = useState("");
  function reply(question: string) {
    const lower = question.toLowerCase();
    if (lower.includes("rate") || lower.includes("usd")) return "Indicative USD rates are visible on Live Rates. Final rate locks only through verified authorised partners.";
    if (lower.includes("kyc")) return "KYC may be required based on amount, booking type, and partner policy. Keep Passport, PAN, ticket/visa, and address proof ready.";
    if (lower.includes("sell")) return "Leftover currency sell-back is routed to authorised partner buy-back. RoamFX never enables user-to-user cash meetups.";
    return "Tell me your destination, dates, currency, and budget. I can suggest a safe cash/card split and verified-partner checklist.";
  }
  function send() {
    const q = input.trim();
    if (!q) return;
    setMessages((items) => [...items, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => setMessages((items) => [...items, { role: "ai", text: reply(q) }]), 350);
  }
  if (!open) return <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-hero px-5 py-3 text-sm font-medium text-primary-foreground shadow-elegant transition hover:scale-105"><Sparkles className="h-4 w-4" /> Ask Roam AI</button>;
  return <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border bg-card shadow-elegant">
    <div className="flex items-center justify-between bg-gradient-hero px-4 py-3 text-primary-foreground">
      <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4" /> Roam AI Assistant</div>
      <button onClick={() => setOpen(false)} aria-label="Close"><X className="h-4 w-4" /></button>
    </div>
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      {messages.map((message, index) => <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>{message.text}</div>
      </div>)}
    </div>
    <div className="flex gap-2 border-t p-3">
      <Input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") send(); }} placeholder="Ask anything..." />
      <Button size="icon" onClick={send} className="bg-gradient-hero"><Send className="h-4 w-4" /></Button>
    </div>
  </div>;
}
