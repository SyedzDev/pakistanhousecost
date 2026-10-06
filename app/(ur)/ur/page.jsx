import HomePage, { homeMetadata } from "@/components/HomePage";
export const revalidate = 86400;
export const generateMetadata = () => homeMetadata("ur");
export default function Page() { return <HomePage lang="ur" />; }
