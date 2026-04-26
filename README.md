# RoamFX

RoamFX is a production-shaped MVP for a compliance-safe traveller forex marketplace. It connects travellers to verified authorised forex partners, banks, FFMCs, AD Category entities, and travel-forex providers. It intentionally does not provide unlicensed peer-to-peer cash exchange.

## Compliance Note

RoamFX is a technology platform. Currency exchange transactions are completed only through verified authorised partners, subject to applicable laws, KYC, and partner acceptance. In the MVP:

- Public partner/rate search returns only `VERIFIED` partners.
- INR equivalent `>= 50000` cannot use `CASH`.
- Threshold and leftover buy-back bookings require KYC flow.
- Community leftover currency requests are routed to `SELL_LEFTOVER_FOREX` booking flow.
- There is no direct user-to-user exchange endpoint or cash meetup workflow.

## Architecture

### System Architecture

```mermaid
flowchart LR
  Traveller[Traveller Web App] --> API[Spring Boot API]
  Partner[Partner Dashboard] --> API
  Admin[Admin Dashboard] --> API
  API --> Auth[JWT + RBAC]
  API --> DB[(PostgreSQL + Flyway)]
  API --> Redis[(Redis placeholder)]
  API --> AI[TravelMoneyAdvisor interface]
  AI --> Mock[MockTravelMoneyAdvisor]
```

### Booking Lifecycle

```mermaid
stateDiagram-v2
  [*] --> DRAFT
  DRAFT --> PENDING_KYC: threshold/documents required
  DRAFT --> RATE_LOCKED: low-risk booking
  PENDING_KYC --> RATE_LOCKED: KYC metadata accepted
  RATE_LOCKED --> EXPIRED: lock window elapsed
  RATE_LOCKED --> PARTNER_REVIEW: partner review
  PARTNER_REVIEW --> CONFIRMED
  PARTNER_REVIEW --> REJECTED
  CONFIRMED --> READY_FOR_PICKUP
  READY_FOR_PICKUP --> COMPLETED
  DRAFT --> CANCELLED
  RATE_LOCKED --> CANCELLED
```

### Compliance-Safe Leftover Currency Flow

```mermaid
sequenceDiagram
  participant U as Traveller
  participant C as Community Request
  participant API as RoamFX API
  participant P as Verified Authorised Partner
  U->>C: I have leftover USD
  C->>API: LEFTOVER_CURRENCY_REQUEST
  API->>API: Block P2P meetup path
  API->>API: Create SELL_LEFTOVER_FOREX booking
  API->>P: Route buy-back request
  P->>API: Confirm or reject after KYC metadata review
  API->>U: Booking confirmation
```

## Stack

- Frontend: Next.js 14, TypeScript, Tailwind CSS, shadcn-style components, React Hook Form, Zod, TanStack Query.
- Backend: Java 17, Spring Boot 3, Spring Security, JWT, JPA, PostgreSQL, Flyway, OpenAPI.
- Infra: Docker Compose for frontend, backend, postgres, redis.

## Run Locally

```bash
cd roamfx
docker compose up --build
```

Frontend: http://localhost:3000  
Backend: http://localhost:8080  
Swagger: http://localhost:8080/swagger-ui.html

The Compose stack starts PostgreSQL, Redis, the Spring Boot API, and the Next.js frontend with one command. Flyway creates the schema and seeds currencies, partners, and rates automatically; demo users are seeded on API startup with BCrypt hashes.

For separate local development:

```bash
cd roamfx/backend
mvn spring-boot:run

cd roamfx/frontend
npm install
npm run dev
```

## API Response Format

All application API responses use the same envelope:

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "errorCode": null,
  "timestamp": "2026-04-25T16:30:00Z"
}
```

Errors use `success=false`, a user-safe `message`, and a stable `errorCode`.

## Environment

Copy:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Backend variables:

| Variable | Purpose | Default |
| --- | --- | --- |
| `SERVER_PORT` | API port | `8080` |
| `DATABASE_URL` | JDBC PostgreSQL URL | `jdbc:postgresql://localhost:5432/roamfx` |
| `DATABASE_USERNAME` | Database user | `roamfx` |
| `DATABASE_PASSWORD` | Database password | `roamfx` |
| `JWT_SECRET` | HS256 signing secret, use a strong production secret | local development secret |
| `JWT_EXPIRY_MINUTES` | Access-token lifetime | `120` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins | `http://localhost:3000` |
| `RATE_LOCK_MINUTES` | Rate reservation window | `30` |
| `SUSPICIOUS_DEVIATION_PERCENT` | Rate deviation warning threshold | `8` |
| `AI_PROVIDER` | Travel-money advisor provider: `auto`, `mock`, `openai`, `google`, `anthropic`, `groq`, `deepseek`, `grok`, or `openrouter` | `auto` |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | Optional OpenAI provider key/model | empty / `gpt-4o-mini` |
| `GOOGLE_API_KEY` / `GOOGLE_MODEL` | Optional Google Gemini provider key/model | empty / `gemini-1.5-flash` |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL` | Optional Anthropic provider key/model | empty / `claude-3-5-haiku-latest` |
| `GROQ_API_KEY` / `GROQ_MODEL` | Optional Groq provider key/model | empty / `llama-3.1-8b-instant` |
| `DEEPSEEK_API_KEY` / `DEEPSEEK_MODEL` | Optional DeepSeek provider key/model | empty / `deepseek-chat` |
| `GROK_API_KEY` / `GROK_MODEL` | Optional xAI Grok provider key/model | empty / `grok-2-latest` |
| `OPENROUTER_API_KEY` / `OPENROUTER_MODEL` | Optional OpenRouter provider key/model | empty / `openai/gpt-4o-mini` |

Frontend variables:

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Browser-visible backend URL | `http://localhost:8080` |

## Deployment

The repository includes:

- `.github/workflows/ci.yml` for backend tests and frontend builds.
- `.github/workflows/deploy-render.yml` for Render deploy hooks after CI passes.
- `render.yaml` for a Render Blueprint with frontend, backend, and PostgreSQL.

Render setup:

1. Create a new Render Blueprint from this GitHub repository.
2. Review `render.yaml`, especially the database plan and service names.
3. Set production-safe environment variables, including `JWT_SECRET` and `CORS_ALLOWED_ORIGINS`.
4. After services are created, add GitHub repository secrets:
   - `RENDER_BACKEND_DEPLOY_HOOK_URL`
   - `RENDER_FRONTEND_DEPLOY_HOOK_URL`
5. Future pushes to `main` run CI first, then call Render deploy hooks.

Expected Render URLs after Blueprint creation:

- Frontend: `https://roamfx-frontend.onrender.com`
- Backend: `https://roamfx-backend.onrender.com`
- Swagger: `https://roamfx-backend.onrender.com/swagger-ui.html`

## Mobile Investor Demo

RoamFX now ships as an installable mobile PWA. Once the Render frontend is live, open the frontend URL on a phone and add it to the home screen.

Android:

1. Open `https://roamfx-frontend.onrender.com` in Chrome.
2. Tap Install app or Add to Home screen.

iOS:

1. Open `https://roamfx-frontend.onrender.com` in Safari.
2. Tap Share.
3. Tap Add to Home Screen.

The PWA includes a manifest, service worker, offline fallback, app icons, and an install prompt. It keeps the product compliance-safe: all exchange and leftover-currency flows continue to route through verified authorised partners.

An Expo WebView wrapper is scaffolded in `mobile/roamfx-expo` for the next native beta phase.

## Free Deployment Alternative

If Render asks for paid infrastructure, use a split free demo stack:

1. **Northflank Sandbox** for backend + database. It currently advertises 2 free services and 1 free database, which fits `roamfx-backend` plus Postgres for an investor demo.
2. **Cloudflare Pages Free** for the PWA frontend. Build command: `npm run build:static`; output directory: `out`; root directory: `frontend`.
3. Set `NEXT_PUBLIC_API_URL` in Cloudflare Pages to the public Northflank backend URL.
4. Set backend environment variables in Northflank:
   - `DATABASE_URL`
   - `DATABASE_USERNAME`
   - `DATABASE_PASSWORD`
   - `JWT_SECRET`
   - `CORS_ALLOWED_ORIGINS=https://<your-cloudflare-pages-domain>`
   - `AI_PROVIDER=auto`
   - one or more AI keys, such as `OPENAI_API_KEY`, `GOOGLE_API_KEY`, `ANTHROPIC_API_KEY`, `GROQ_API_KEY`, `DEEPSEEK_API_KEY`, `GROK_API_KEY`, or `OPENROUTER_API_KEY`

Cloudflare Pages is a good PWA host because it includes free SSL, static hosting, previews, and high bandwidth limits. Vercel Hobby is also technically free, but Vercel describes Hobby as personal/non-commercial, so use it carefully for an investor-facing startup demo.

## Demo Users

- `traveller@roamfx.app` / `password123`
- `partner@roamfx.app` / `password123`
- `admin@roamfx.app` / `password123`

## Demo Flow

1. Open `/rates` and compare USD/EUR/GBP/AED/SGD/THB/JPY to INR rates.
2. Login with traveller credentials.
3. Open `/dashboard` to see traveller-only guarded surfaces.
4. Create a booking through `POST /api/bookings`.
5. Try `paymentMode=CASH` above INR 50000 and observe the compliance block.
6. Upload KYC metadata using `POST /api/documents`.
7. Login as partner and use partner endpoints to confirm or complete bookings.
8. Login as admin and verify partners/documents; audit logs are written for sensitive actions.
9. Use `/planner` or `POST /api/ai/travel-money-plan` for mock AI guidance.

## AI Provider Architecture

The travel money assistant uses `TravelMoneyAdvisor` as its provider interface. `AutoTravelMoneyAdvisor` routes requests to the first available configured provider and falls back to the deterministic `MockTravelMoneyAdvisor` if no key exists or a provider fails. Supported env-based providers are OpenAI, Google Gemini, Anthropic, Groq, DeepSeek, xAI Grok, and OpenRouter. Placeholder classes remain for AWS Bedrock and Vertex AI enterprise integrations.

The prompt template explicitly prohibits illegal or unsafe guidance, unlicensed peer-to-peer exchange, and user-to-user cash meetups. It instructs providers to recommend verified authorised partners and include a disclaimer that rates, fees, KYC requirements, and local rules can change.

## Screenshot Placeholders

Investor showcase screenshot:

![RoamFX mobile traveller dashboard](docs/screenshots/dashboard.png)

Additional product screenshots to capture after deployment:

| Screen | Placeholder |
| --- | --- |
| Landing and rate comparison | `docs/screenshots/landing.png` |
| Traveller booking flow | `docs/screenshots/traveller-booking.png` |
| Partner dashboard | `docs/screenshots/partner-dashboard.png` |
| Admin audit dashboard | `docs/screenshots/admin-dashboard.png` |

## Roadmap

- Add provider-owned partner accounts and partner-to-user ownership mapping.
- Add settlement ledger, commissions, invoices, and payout reconciliation.
- Replace mock AI with OpenAI, AWS Bedrock, or Vertex AI implementation.
- Integrate Google Maps or Mapbox provider for geospatial search.
- Add object storage and malware scanning for uploaded documents.
- Add production rate limiting, observability, and fraud detection models.

## Public Beta Launch Checklist

- Confirm legal/compliance review of partner onboarding, KYC copy, cash threshold messaging, and leftover currency buyback routing.
- Verify `POST /api/waitlist` and `GET /api/admin/waitlist` in Swagger before launch.
- Connect email notification placeholder to a production provider such as SES, SendGrid, or Postmark.
- Connect analytics placeholder events: `landing_viewed`, `rate_search_started`, `waitlist_joined`, `booking_started`, `booking_completed`.
- Replace demo dashboard data with aggregate APIs for admin and partner workspaces.
- Add privacy policy, terms, cookie notice, and data-retention policy for waitlist and KYC metadata.
- Configure production secrets: `JWT_SECRET`, database credentials, `CORS_ALLOWED_ORIGINS`, and `AI_PROVIDER`.
- Set up uptime checks for frontend, backend, Postgres, and Redis.
- Run a beta smoke test: landing, waitlist submit, rate search, login, booking create, KYC metadata upload, partner confirm, admin audit review.
- Keep the public beta compliant: no peer-to-peer exchange, no user-to-user cash meetup, and all exchange flows through verified authorised partners.
