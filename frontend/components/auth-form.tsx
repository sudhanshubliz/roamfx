"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import * as React from "react";

const schema = z.object({ fullName: z.string().optional(), email: z.string().email(), password: z.string().min(8), phone: z.string().optional(), country: z.string().optional() });
type FormValues = z.infer<typeof schema>;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [message, setMessage] = React.useState("");
  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: mode === "login" ? "traveller@roamfx.app" : "", password: mode === "login" ? "password123" : "" } });
  function routeFor(role: string) {
    if (role === "PARTNER_ADMIN") return "/partner";
    if (role === "PLATFORM_ADMIN") return "/admin";
    return "/dashboard";
  }
  async function onSubmit(values: FormValues) {
    try {
      const body = mode === "login" ? { email: values.email, password: values.password } : values;
      const res = await api<{ accessToken: string; user: { role: string; fullName?: string; email?: string } }>(`/api/auth/${mode}`, { method: "POST", body: JSON.stringify(body) });
      localStorage.setItem("roamfx_token", res.accessToken);
      localStorage.setItem("roamfx_role", res.user.role);
      localStorage.setItem("roamfx_user", JSON.stringify(res.user));
      setMessage(`Signed in as ${res.user.role}. Redirecting...`);
      router.push(routeFor(res.user.role));
    } catch (e) { setMessage(e instanceof Error ? e.message : "Authentication failed"); }
  }
  function chooseDemo(email: string) {
    setValue("email", email);
    setValue("password", "password123");
  }
  return <Card className="mx-auto max-w-md"><CardHeader><CardTitle>{mode === "login" ? "Login" : "Register"}</CardTitle><CardDescription>Use demo credentials or create a traveller account.</CardDescription></CardHeader><CardContent>
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      {mode === "login" ? <div className="grid gap-2 sm:grid-cols-3">
        <Button type="button" variant="outline" onClick={() => chooseDemo("traveller@roamfx.app")}>Traveller</Button>
        <Button type="button" variant="outline" onClick={() => chooseDemo("partner@roamfx.app")}>Partner</Button>
        <Button type="button" variant="outline" onClick={() => chooseDemo("admin@roamfx.app")}>Admin</Button>
      </div> : null}
      {mode === "register" ? <Input placeholder="Full name" {...register("fullName")} /> : null}
      <Input placeholder="Email" {...register("email")} aria-invalid={!!errors.email} />
      <Input placeholder="Password" type="password" {...register("password")} aria-invalid={!!errors.password} />
      {mode === "register" ? <><Input placeholder="Phone" {...register("phone")} /><Input placeholder="Country" {...register("country")} /></> : null}
      <Button disabled={isSubmitting}>{isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Create account"}</Button>
      <p className="text-xs text-muted-foreground">Demo password: <strong>password123</strong>. Exchange flows remain routed through verified authorised partners only.</p>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </form>
  </CardContent></Card>;
}
