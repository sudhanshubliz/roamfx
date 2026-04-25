import { PageTemplate } from "@/components/page-template";
export default function Page() { return <PageTemplate allow={["TRAVELLER"]} title="My bookings" description="Track rate locks, KYC status, partner confirmation, pickup/delivery, and completion." items={["Rate locked","Pending KYC","Partner review","Confirmed","Ready for pickup","Completed"]} />; }
