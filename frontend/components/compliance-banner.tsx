import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ComplianceBanner() {
  return <Alert className="border-secondary/60 bg-secondary/15">
    <AlertTriangle data-icon="inline-start" />
    <AlertTitle>Compliance-safe forex marketplace</AlertTitle>
    <AlertDescription>RoamFX is a technology platform. Currency exchange transactions are completed only through verified authorised partners, subject to applicable laws, KYC, and partner acceptance. RoamFX does not support unlicensed peer-to-peer currency exchange.</AlertDescription>
  </Alert>;
}
