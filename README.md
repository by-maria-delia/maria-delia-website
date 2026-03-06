# Maria Delia — Guardapolvos para maestras jardineras

Maria Delia is a handmade shop that creates customizable teacher smocks (*guardapolvos*) designed especially for early childhood educators (*maestras jardineras*).

Each garment is made to order and can be personalized with different sizes, border colors, and pocket designs. The goal is to offer practical, durable, and beautifully crafted smocks that reflect the warmth and dedication of teachers who work with young children.

## How it works

The website showcases the available models and lets customers configure their preferred options. Instead of a traditional checkout, orders are finalized via WhatsApp — all selected customization details are automatically included in the message.

Because every piece is handcrafted, production and delivery times may vary depending on demand.

## Tech stack

- **React 19** + **TypeScript** — UI
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — styling
- **Google Sheets** — product catalog and gallery (published as CSV)
- **PapaParse** — CSV parsing
- **Biome** — linting and formatting
- **GitHub Pages** — deployment (`npm run deploy`)

## Getting started

```bash
npm install
npm run dev
```

## Product catalog

Products and gallery photos are managed via Google Sheets. Publish each tab as CSV (File → Share → Publish to web → CSV) and paste the URLs in `src/config.ts`.

## Deployment

```bash
npm run deploy
```

Deploys to GitHub Pages under the `/maria-delia/` base path.
