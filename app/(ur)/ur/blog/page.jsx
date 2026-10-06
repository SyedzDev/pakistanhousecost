import BlogList, { blogListMetadata } from "@/components/BlogList";
export const revalidate = 86400;
export const generateMetadata = () => blogListMetadata("ur");
export default function Page() { return <BlogList lang="ur" />; }
