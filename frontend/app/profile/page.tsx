"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Bell, CheckCircle2, LogOut, Plane, Plus, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { RoleGuard } from "@/components/role-guard";
import { type User } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type SavedTraveller = { name: string; relation: string; passportStatus: string };

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<Partial<User>>({});
  const [saved, setSaved] = useState<SavedTraveller[]>([
    { name: "Aarav Sharma", relation: "Self", passportStatus: "Metadata pending review" },
    { name: "Nisha Sharma", relation: "Spouse", passportStatus: "Not uploaded" }
  ]);
  const [newName, setNewName] = useState("");
  const [destination, setDestination] = useState("Europe");
  const [notify, setNotify] = useState("trip-reminders");

  useEffect(() => {
    const raw = localStorage.getItem("roamfx_user");
    if (raw) setUser(JSON.parse(raw) as User);
  }, []);

  function addTraveller() {
    if (!newName.trim()) return;
    setSaved((items) => [...items, { name: newName.trim(), relation: "Co-traveller", passportStatus: "Not uploaded" }]);
    setNewName("");
  }

  function logout() {
    localStorage.removeItem("roamfx_token");
    localStorage.removeItem("roamfx_role");
    localStorage.removeItem("roamfx_user");
    router.push("/login");
  }

  return <AppShell>
    <RoleGuard allow={["TRAVELLER", "PARTNER_ADMIN", "PLATFORM_ADMIN"]}>
      <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="grid size-14 place-items-center rounded-full bg-teal-800 text-lg font-semibold text-white">{(user.fullName ?? "RoamFX User").slice(0, 2).toUpperCase()}</span>
                <div>
                  <CardTitle>{user.fullName ?? "RoamFX User"}</CardTitle>
                  <CardDescription>{user.email ?? "Login to persist profile details"}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Phone" value={user.phone ?? "+91 98765 43210"} />
                <Field label="Country" value={user.country ?? "India"} />
                <Field label="Role" value={user.role ?? "TRAVELLER"} />
                <Field label="KYC status" value={user.kycStatus ?? "PENDING"} />
              </div>
              <Button variant="outline" onClick={logout}><LogOut data-icon="inline-start" /> Logout</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Security and compliance</CardTitle><CardDescription>Controls that protect traveller and partner workflows.</CardDescription></CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <TrustRow title="Verified partner-only exchange" />
              <TrustRow title="Cash threshold warning at INR 50,000" />
              <TrustRow title="No user-to-user meetup flow" />
              <TrustRow title="Document metadata review trail" />
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-5">
          <Card>
            <CardHeader><CardTitle>Saved travellers</CardTitle><CardDescription>Prepare repeat bookings without re-entering all traveller details.</CardDescription></CardHeader>
            <CardContent className="grid gap-3">
              {saved.map((traveller) => <div key={`${traveller.name}-${traveller.relation}`} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-md bg-muted"><UserRound /></span>
                  <div><div className="font-semibold">{traveller.name}</div><div className="text-sm text-muted-foreground">{traveller.relation} · {traveller.passportStatus}</div></div>
                </div>
                <Button variant="outline" size="sm">Use for booking</Button>
              </div>)}
              <div className="grid gap-2 rounded-lg border p-4 sm:grid-cols-[1fr_auto]">
                <Input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Add co-traveller name" />
                <Button onClick={addTraveller}><Plus data-icon="inline-start" /> Add</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Travel preferences</CardTitle><CardDescription>Used for AI planner, repeat bookings, and reminders.</CardDescription></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">Default destination<Input value={destination} onChange={(event) => setDestination(event.target.value)} /></label>
              <label className="grid gap-1 text-sm font-medium">Notifications<Select value={notify} onChange={(event) => setNotify(event.target.value)}><option value="trip-reminders">Trip reminders</option><option value="rate-alerts">Rate alerts</option><option value="kyc-only">KYC only</option></Select></label>
              <Preference icon={<Plane />} title="Repeat booking" detail={`Pre-fill ${destination} route and saved travellers.`} />
              <Preference icon={<Bell />} title="Reminder timing" detail="Nudge 7 days and 48 hours before travel." />
            </CardContent>
          </Card>
        </section>
      </main>
    </RoleGuard>
  </AppShell>;
}

function Field({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 font-semibold">{value}</div></div>;
}

function TrustRow({ title }: { title: string }) {
  return <div className="flex items-center gap-2"><ShieldCheck className="text-teal-700" size={18} /> {title} <Badge variant="outline" className="ml-auto">Active</Badge></div>;
}

function Preference({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return <div className="rounded-lg border p-4">{icon}<div className="mt-2 flex items-center gap-2 font-semibold">{title}<CheckCircle2 size={16} className="text-teal-700" /></div><div className="mt-1 text-sm text-muted-foreground">{detail}</div></div>;
}
