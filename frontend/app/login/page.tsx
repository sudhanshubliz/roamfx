import { AppShell } from "@/components/app-shell";
import { AuthForm } from "@/components/auth-form";
export default function Page() { return <AppShell><main className="px-4 py-10"><AuthForm mode="login" /></main></AppShell>; }
