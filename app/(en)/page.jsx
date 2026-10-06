import HomePage, { homeMetadata } from "@/components/HomePage";
export const revalidate = 86400;
export const generateMetadata = () => homeMetadata("en");
export default function Page() { return <HomePage lang="en" />; }
