import { notFound } from "next/navigation";
import CityPage, { cityMetadata } from "@/components/CityPage";
import { CITIES, SIZES, cityBySlug, sizeBySlug } from "@/lib/config";

export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = () => CITIES.flatMap((c) => SIZES.map((s) => ({ city: c.slug, size: s.slug })));

export async function generateMetadata({ params }) {
  const { city, size } = await params;
  if (!cityBySlug(city) || !sizeBySlug(size)) return {};
  return cityMetadata("ur", city, size);
}
export default async function Page({ params }) {
  const { city, size } = await params;
  if (!cityBySlug(city) || !sizeBySlug(size)) notFound();
  return <CityPage lang="ur" citySlug={city} sizeSlug={size} />;
}
