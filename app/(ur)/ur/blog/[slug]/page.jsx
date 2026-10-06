import { notFound } from "next/navigation";
import BlogPost, { blogPostMetadata } from "@/components/BlogPost";
import { postSlugs, postBySlug } from "@/lib/blog";

export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = () => postSlugs().map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!postBySlug(slug)) return {};
  return blogPostMetadata("ur", slug);
}
export default async function Page({ params }) {
  const { slug } = await params;
  if (!postBySlug(slug)) notFound();
  return <BlogPost lang="ur" slug={slug} />;
}
