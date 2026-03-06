# Maria Delia - Project Guide

## Stack
React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4 + React Query (TanStack Query). Linting: ESLint + Biome. Deployed via gh-pages.

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run deploy` — build + deploy to GitHub Pages

## Project Structure
```
src/
  components/   # Navbar, Hero, HowItWorks, ModelsGallery, ProductCard,
                # Customizer, Showcase, DeliveryInfo, Footer, FadeUp
  hooks/        # useGoogleSheet (CSV fetch+parse), useInView (intersection observer)
  utils/        # whatsapp.ts (builds wa.me URL with product details)
  assets/       # brand-guidelines.json
  config.ts     # env var access (VITE_WSP_NUMBER, VITE_PRODUCTS_SHEET_CSV_URL)
  types.ts      # Product, GalleryPhoto, WhatsAppParams interfaces
  index.css     # Tailwind theme: custom colors, fonts, animations
  App.tsx        # Root layout composing all sections
```

## Data Flow
- Products and gallery data come from **Google Sheets CSV** exports, parsed with PapaParse via `useGoogleSheet<T>()`.
- **React Query** manages all data fetching. Use aggressive caching (`staleTime`, `gcTime`) to minimize API hits against Google Sheets rate limits. Prefer long stale times since sheet data changes infrequently.
- Products filter by `disponible === "TRUE"`, gallery by `visible === "TRUE"`.
- Customizer modal collects size/color/print selections, then opens WhatsApp with a pre-filled message.

## Brand & Design

### Colors (use semantic names in Tailwind classes)
| Name | Hex | Usage |
|------|-----|-------|
| School Blue | #9DB7D5 | Primary UI, product backgrounds |
| Denim Blue | #5E6F82 | Secondary buttons, accents |
| Soft White | #F7F7F4 | Main backgrounds |
| Leaf Green | #5E7D6A | Accents, nature references |
| Teacher Pink | #E67A8A | Border trims, small CTA details |
| Warm Yellow | #E3C567 | Tiny details only |
| Floral Teal | #6FAFB4 | Pocket print references |
| Dark Text | #333333 | Main text |
| Soft Gray | #777777 | Secondary text |

### Fonts (loaded from Google Fonts)
- **Dancing Script** — display/branding (hero title, logo)
- **Nunito** — body text, navigation, UI
- **Shadows Into Light** — handwritten accent (labels, badges)

### Brand Personality
Artesanal, calido, prolijo, clasico, amigable, docente, femenino. All copy in **Spanish (Argentina)**.

## Conventions
- Locale: `es-AR` for price formatting (`toLocaleString("es-AR")`)
- Animations: FadeUp wrapper component + CSS keyframes (fade-up, fade-in, slide-down) with stagger delays
- Responsive: mobile-first with md/lg breakpoints, hamburger menu on mobile
- Env vars prefixed with `VITE_` (accessed via `import.meta.env`)
- Vite base path: `/maria-delia/`

## Environment Variables (.env)
```
VITE_WSP_NUMBER=...
VITE_PRODUCTS_SHEET_CSV_URL=...
```
