"use client";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: mode === "login" ? "traveller@roamfx.app" : "", password: mode === "login" ? "password123" : "" } });
  async function onSubmit(values: FormValues) {
    try {
      const body = mode === "login" ? { email: values.email, password: values.password } : values;
      const res = await api<{ accessToken: string; user: { role: string } }>(`/api/auth/${mode}`, { method: "POST", body: JSON.stringify(body) });
      localStorage.setItem("roamfx_token", res.accessToken);
      localStorage.setItem("roamfx_role", res.user.role);
      setMessage(`Signed in as ${res.user.role}. Token stored locally for API calls.`);
    } catch (e) { setMessage(e instanceof Error ? e.message : "Authentication failed"); }
  }
  return <Card className="mx-auto max-w-md"><CardHeader><CardTitle>{mode === "login" ? "Login" : "Register"}</CardTitle><CardDescription>Use demo credentials or create a traveller account.</CardDescription></CardHeader><CardContent>
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      {mode === "register" ? <Input placeholder="Full name" {...register("fullName")} /> : null}
      <Input placeholder="Email" {...register("email")} aria-invalid={!!errors.email} />
      <Input placeholder="Password" type="password" {...register("password")} aria-invalid={!!errors.password} />
      {mode === "register" ? <><Input placeholder="Phone" {...register("phone")} /><Input placeholder="Country" {...register("country")} /></> : null}
      <Button disabled={isSubmitting}>{isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Create account"}</Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </form>
  </CardContent></Card>;
}
