import Link from "next/link";
import { ShieldCheck, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold"><span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground"><WalletCards data-icon="inline-start" /></span>RoamFX</Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          <Link href="/rates">Rates</Link><Link href="/partners">Partners</Link><Link href="/planner">AI planner</Link><Link href="/compliance">Safety</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden md:flex"><ShieldCheck data-icon="inline-start" /> Verified partners only</Badge>
          <Button asChild variant="outline" size="sm"><Link href="/login">Login</Link></Button>
        </div>
      </div>
    </header>
    {children}
  </div>;
}
