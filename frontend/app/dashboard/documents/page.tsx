import { PageTemplate } from "@/components/page-template";

export default function Page() {
  return <PageTemplate title="My Documents" description="Traveller document vault surface for KYC metadata, rejection reasons and next actions." items={["PAN", "Passport", "Visa / Ticket", "Address proof"]} allow={["TRAVELLER", "PLATFORM_ADMIN"]} />;
}
