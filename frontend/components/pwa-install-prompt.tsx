"use client";

import { useEffect, useState } from "react";
import { Download, ShieldCheck, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const dismissedKey = "roamfx-pwa-install-dismissed";

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    const dismissed = window.localStorage.getItem(dismissedKey) === "true";
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    const isiOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

    if (!dismissed && !standalone && isiOS) {
      setIosHint(true);
      setVisible(true);
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      if (!dismissed && !standalone) {
        setInstallEvent(event as BeforeInstallPromptEvent);
        setVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(dismissedKey, "true");
    setVisible(false);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-lg border bg-card p-3 text-card-foreground shadow-xl md:bottom-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Smartphone size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold">
            Add RoamFX to your phone
            <ShieldCheck size={16} className="text-primary" />
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Install the investor demo as a mobile app experience. Exchange flows remain routed through verified authorised partners.
          </p>
          {iosHint ? (
            <p className="mt-2 rounded-md bg-accent px-2 py-1.5 text-xs text-accent-foreground">
              On iPhone: tap Share, then Add to Home Screen.
            </p>
          ) : null}
          <div className="mt-3 flex gap-2">
            {installEvent ? <Button size="sm" onClick={install}><Download size={16} /> Install</Button> : null}
            <Button size="sm" variant="outline" onClick={dismiss}>Later</Button>
          </div>
        </div>
        <button aria-label="Dismiss install prompt" className="rounded-md p-1 text-muted-foreground hover:bg-muted" onClick={dismiss}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
