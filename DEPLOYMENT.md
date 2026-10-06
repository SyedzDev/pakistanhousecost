# 🚀 Deployment & SEO Guide — Pakistan House Cost AI

Ye guide aapko step-by-step batati hai ke website ko **live** kaise karein, **domain** kaise lein, aur **Google par top** kaise laayein.

---

## 1️⃣ Website Live Karna (Vercel — recommended)

Aapki site **Next.js 15** par bani hai. Sabse aasan aur best hosting **Vercel** hai (free plan kaafi hai).

### Steps

1. **GitHub repo banayein**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<aapka-username>/<repo-name>.git
   git push -u origin main
   ```

2. **Vercel par import karein**
   - [vercel.com](https://vercel.com) par GitHub se sign up karein
   - **Add New → Project** → apna repo select karein
   - Vercel khud Next.js detect kar lega (koi build setting change nahi karni)

3. **Environment Variables add karein** (Vercel → Project → Settings → Environment Variables):

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SITE_URL` | `https://aapka-domain.com` |
   | `NEXT_PUBLIC_API_URL` | `https://costesitmatedhouse2026.vercel.app` |

   > ⚠️ **Zaroori:** `NEXT_PUBLIC_SITE_URL` mein asal domain daalein, warna canonical / sitemap / OG links `your-domain.com` par point karenge (SEO kharab hota hai).

4. **Deploy** dabayein — 2 minute mein live ho jayegi.

### Local build test
```bash
npm install
npm run build
npm run start
```

---

## 2️⃣ Domain Name Kya Lein

Domain **Namecheap**, **GoDaddy**, ya **Cloudflare** se lein (~$10–12/saal).

### Recommended names (short + keyword-rich)
- `pakistanhousecost.com` ⭐ (best — exact keyword)
- `housecostpakistan.com`
- `gharkharcha.pk` (Urdu audience ke liye `.pk` trust deta hai)
- `constructioncost.pk`

### Tips
- `.com` best hai; `.pk` Pakistan audience ke liye acha hai
- Chhota, yaad rakhne wala, aur keyword ho (jaise "house cost")
- Numbers aur hyphens se bachein
- Domain lene ke baad **Vercel → Domains** tab se connect karein (Vercel DNS instructions dega)

---

## 3️⃣ Google Par Top Rank Kaise Karein (SEO)

Technical SEO already **complete** hai:
- ✅ Sitemap (`/sitemap.xml`) with hreflang (en, ur, x-default)
- ✅ Robots (`/robots.txt`) — AI crawlers allowed
- ✅ Structured data (Organization, WebSite, FAQPage, BreadcrumbList, BlogPosting)
- ✅ Meta tags, canonical, OpenGraph, Twitter cards
- ✅ Web manifest + icons
- ✅ Bilingual (English + Urdu) with proper hreflang

### A. Google Search Console (sabse zaroori)
1. [search.google.com/search-console](https://search.google.com/search-console) par jayein
2. Apna domain add karein → verify karein (DNS ya HTML tag)
3. **Sitemap submit karein:** `https://aapka-domain.com/sitemap.xml`
4. **URL Inspection** se important pages ko "Request Indexing" karein

### B. Google Business Profile
Agar aap construction/contracting service bhi dete hain to local SEO ke liye profile banayein.

### C. Content (ranking ki jaan)
- Har city/size page par unique, detailed content (already achha hai)
- **Blog** regularly update karein — long-tail keywords par rank karte hain
- Urdu + English dono mein content (bilingual setup already hai)

### D. Backlinks (off-page SEO)
- Pakistani construction forums, Facebook groups, Quora par site share karein
- Guest posts likhein
- Local directories mein listing karein

### E. Speed & Mobile
Site already fast (103 kB JS) aur mobile-friendly hai ✅

### F. Regular updates
Rates har mahine update karein — Google fresh content ko pasand karta hai.

---

## 4️⃣ Blog Kaise Add Karein (naya post)

Blog posts `lib/blog.js` mein hain. Naya post add karne ke liye:

```js
{
  slug: "aapka-post-slug",
  date: "2026-10-06",
  updated: "2026-10-06",
  en: { title: "...", description: "...", h1: "...", body: `<p>HTML content</p>` },
  ur: { title: "...", description: "...", h1: "...", body: `<p>HTML content</p>` },
}
```

Sitemap aur blog list automatically update ho jayenge.

---

## 5️⃣ Checklist (Priority Order)

- [ ] Domain lein (e.g. `pakistanhousecost.com`)
- [ ] GitHub repo banayein aur code push karein
- [ ] Vercel par deploy karein + env variables set karein
- [ ] Domain connect karein Vercel mein
- [ ] Google Search Console setup + sitemap submit
- [ ] Blog posts regularly add karein
- [ ] Backlinks + regular content updates
