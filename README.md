# Commuter Departure Calculator

![CI](https://github.com/jamesreynold-cloud/commuter-departure-calculator/actions/workflows/ci.yml/badge.svg)

MVP: small frontend + serverless API that calculates when a commuter should leave to arrive at a destination on time.

Features
- Simple static frontend: `frontend/index.html`
- Serverless API: `api/calculate-departure.js` (POST { route, arrivalTime, buffer })
- Travel times in `data/travelTimes.json`
- Tests for calculation logic in `__tests__/calc.test.js`

Quick local run
1. Start backend (optional):
   - `cd backend && npm install && node server.js` (API runs at http://localhost:3001)
2. Open `frontend/index.html` in your browser and use the app (when using the local backend, change the fetch URL to `http://localhost:3001/calculate-departure`).

Deploy to Vercel (recommended)
1. Go to https://vercel.com, log in, and import the repository `jamesreynold-cloud/commuter-departure-calculator`.
2. Vercel will detect `api/` serverless functions and `frontend/` static files using `vercel.json`.
3. Deploy — after success you'll get a live URL.

Live site (deployed): https://commuter-departure-calculator-bm1qo5m2c-james-reynolds-projects.vercel.app

Example API curl:
```bash
curl -sS -X POST https://commuter-departure-calculator-bm1qo5m2c-james-reynolds-projects.vercel.app/api/calculate-departure \
  -H "Content-Type: application/json" \
  -d '{"route":"bus101","arrivalTime":"09:00","buffer":10}'
```

Run E2E tests locally
1. Install dependencies: `npm ci`
2. Install Playwright browsers: `npx playwright install`
3. Run tests: `npm run test:e2e` (set `LIVE_URL` if you want to test the deployed site)

CI: GitHub Actions runs E2E automatically on push to `main` using the live `LIVE_URL`.

If you want me to finish the Vercel import and deploy for you, authorize me (I can guide you through the web flow).