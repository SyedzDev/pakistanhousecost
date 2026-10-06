import HubPage, { hubMetadata } from "@/components/HubPage";
export const revalidate = 86400;
export const generateMetadata = () => hubMetadata("en");
export default function Page() { return <HubPage lang="en" />; }
