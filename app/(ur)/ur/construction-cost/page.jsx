import HubPage, { hubMetadata } from "@/components/HubPage";
export const revalidate = 86400;
export const generateMetadata = () => hubMetadata("ur");
export default function Page() { return <HubPage lang="ur" />; }
