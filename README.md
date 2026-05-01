# BookSnaps

BookSnaps is a mobile-first `Next.js` PWA for capturing highlights from physical books, extracting text with OCR, and saving searchable notes by book and page.

## Stack

- `Next.js 16` with App Router and TypeScript
- `Tailwind CSS 4`
- `shadcn/ui-style` local components
- `Supabase` for auth, Postgres, and storage
- `PaddleOCR` in a separate self-hosted service
- `Docker Compose` ready for Coolify deployment

## What is implemented

- Dashboard, books, capture, highlight detail, and search flows
- API routes for books, highlights, and search
- Demo mode when Supabase env vars are missing
- Supabase SSR helpers and middleware scaffolding
- PWA manifest, service worker registration, and offline fallback page
- OCR service contract with a standalone Python container
- Supabase SQL migration with RLS and private storage bucket

## Local development

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

If Supabase is not configured, the project runs in demo mode with seeded books and highlights.

## Supabase setup

Create a Supabase project and configure:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Then apply the SQL in [supabase/migrations/0001_initial.sql](/Users/rafaelveronez/web/booksnaps/supabase/migrations/0001_initial.sql:1).

Auth expected for production:

- Google OAuth
- Magic link email

The login UI is already present; wire the client actions to `supabase.auth.signInWithOtp` and `supabase.auth.signInWithOAuth` when you are ready to enable live auth.

## OCR service

The app expects an OCR service at `OCR_SERVICE_URL` with:

- `POST /ocr`
- multipart field `image`
- multipart field `language`

The included service lives in [ocr-service/app.py](/Users/rafaelveronez/web/booksnaps/ocr-service/app.py:1) and uses `PaddleOCR` when available.

Run the full stack with Docker Compose:

```bash
docker compose up --build
```

## Deployment notes

- App container uses `Next.js standalone` output.
- Coolify can deploy the root app service and the OCR sidecar from `docker-compose.yml`.
- Supabase remains managed externally.

## Important gaps before production

- Replace demo auth actions with real Supabase auth calls.
- Add background job processing for OCR if you want true asynchronous processing.
- Add automated tests for API routes and form flows.
- Add signed URL refresh logic if highlight image sessions need longer-lived previews.
