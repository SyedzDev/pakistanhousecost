# Ghar Kharcha PK — Next.js

Pakistan house construction cost calculator (English + Urdu), SEO-ready. Data aap ki FastAPI se aata hai.

## Chalana
```bash
npm install
cp .env.example .env.local      # NEXT_PUBLIC_SITE_URL aur NEXT_PUBLIC_API_URL set karein
npm run dev                     # http://localhost:3000
```

## Vercel par deploy
1. GitHub par nayi repo banayein aur ye folder push karein.
2. Vercel > Add New Project > repo chunein (Framework: Next.js khud detect hoga).
3. Environment Variables: `NEXT_PUBLIC_SITE_URL` (apna domain) aur `NEXT_PUBLIC_API_URL` (API ka URL).
4. Deploy. Phir Google Search Console mein `https://aap-ka-domain/sitemap.xml` submit karein.

## Pages
- `/` aur `/ur` : calculator + FAQ
- `/construction-cost` : sab shehron aur sizes ki list
- `/construction-cost/{city}/{size}` (jaise `/construction-cost/lahore/5-marla`) : har page par apne numbers
- `/ur/...` : har page ka Urdu version (RTL)
- `/sitemap.xml`, `/robots.txt`, `/og` (social share image)

## Badalna
- Naam / shehr / sizes: `lib/config.js`
- Saara text (English + Urdu): `lib/i18n.js`
- Rang aur layout: `app/globals.css`
# pakistanhousecost
