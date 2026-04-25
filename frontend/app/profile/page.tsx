import { PageTemplate } from "@/components/page-template";
export default function Page() { return <PageTemplate allow={["TRAVELLER","PARTNER_ADMIN","PLATFORM_ADMIN"]} title="Profile" description="Manage traveller identity, contact details, country, and KYC status." items={["Personal details","KYC status","Saved travellers","Payment preferences","Security","Notifications"]} />; }
