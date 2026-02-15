# Commuter Departure Calculator

![CI](https://github.com/jamesreynold-cloud/commuter-departure-calculator/actions/workflows/ci.yml/badge.svg)

MVP: small frontend + serverless API that calculates when a commuter should leave to arrive at a destination on time.

**Now available as a Progressive Web App (PWA)** - installable on mobile devices!

## Features
- Simple static frontend: `frontend/index.html`
- Serverless API: `api/calculate-departure.js` (POST { route, arrivalTime, buffer })
- Travel times in `data/travelTimes.json`
- Tests for calculation logic in `__tests__/calc.test.js`
- **PWA support**: offline functionality, installable on Android & iOS

## Progressive Web App (PWA)

This app is a fully functional PWA that can be installed on your mobile device and works offline.

### PWA Features
- ✅ **Installable**: Add to home screen on Android and iOS
- ✅ **Offline support**: App shell loads even without internet
- ✅ **Standalone mode**: Launches like a native app (no browser UI)
- ✅ **Caching strategies**: 
  - Network-first for API calls (with offline fallback)
  - Cache-first for static assets
- ✅ **Auto-updates**: Service worker updates automatically

### Testing PWA on Mobile

#### Android (Chrome)
1. Open the deployed URL in Chrome: https://commuter-departure-calculator-bm1qo5m2c-james-reynolds-projects.vercel.app
2. Chrome will show an "Install" prompt at the bottom or in the menu (⋮ → "Install app")
3. Tap "Install" 
4. The app icon will appear on your home screen
5. Launch it like any native app - it will open in standalone mode (no browser UI)

#### iOS (Safari)
1. Open the deployed URL in Safari (Chrome on iOS doesn't support PWA installation)
2. Tap the Share button (square with arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Edit the name if desired, then tap "Add"
5. The app icon will appear on your home screen
6. Launch it like any native app

**Note**: iOS Safari has limited PWA support:
- Push notifications only work for installed PWAs (iOS 16.4+)
- Background sync not supported
- Chrome/Firefox on iOS don't support PWA installation (use Safari)

### Testing Offline Mode
1. Install the app on your device (see above)
2. Open the app
3. Turn on Airplane mode or disable WiFi
4. The app shell (UI) will still load
5. API calls will show a friendly "You are offline" message
6. Turn internet back on and refresh - data will load normally

## Quick local run
1. Start backend (optional):
   - `cd backend && npm install && node server.js` (API runs at http://localhost:3001)
2. Open `frontend/index.html` in your browser and use the app (when using the local backend, change the fetch URL to `http://localhost:3001/calculate-departure`).

**Note**: PWA features (service worker, install prompt) require HTTPS. Use the Vercel deployment to test PWA functionality.

## Local Development with PWA Features

To test PWA features locally, you need to serve over HTTPS or localhost:

```bash
# Install a simple HTTPS server
npm install -g http-server

# Serve the frontend directory
cd frontend
http-server -p 8080

# Open http://localhost:8080 in your browser
```

Then open Chrome DevTools → Application tab to:
- Check manifest
- Inspect service worker
- Test offline mode (Network tab → Offline checkbox)
- View cached resources

## Environment
- Create a `.env.local` file with:
  - `ELMHURST_PARENT_STOP_ID=____`

## Deploy to Vercel (recommended)
1. Go to https://vercel.com, log in, and import the repository `jamesreynold-cloud/commuter-departure-calculator`.
2. Vercel will detect `api/` serverless functions and `frontend/` static files using `vercel.json`.
3. Deploy — after success you'll get a live URL.
4. **PWA will work automatically** (Vercel provides HTTPS by default)

Live site (deployed): https://commuter-departure-calculator-bm1qo5m2c-james-reynolds-projects.vercel.app

Example API curl:
```bash
curl -sS -X POST https://commuter-departure-calculator-bm1qo5m2c-james-reynolds-projects.vercel.app/api/calculate-departure \
  -H "Content-Type: application/json" \
  -d '{"route":"bus101","arrivalTime":"09:00","buffer":10}'
```

## Run E2E tests locally
1. Install dependencies: `npm ci`
2. Install Playwright browsers: `npx playwright install`
3. Run tests: `npm run test:e2e` (set `LIVE_URL` if you want to test the deployed site)

CI: GitHub Actions runs E2E automatically on push to `main` using the live `LIVE_URL`.

## PWA Technical Details

### Files Structure
```
frontend/
├── index.html          # Main app with PWA meta tags
├── style.css           # Styles
├── manifest.json       # PWA manifest (name, icons, display mode)
├── sw.js              # Service worker (caching & offline)
└── icons/             # App icons
    ├── icon-192.svg   # 192x192 icon
    ├── icon-512.svg   # 512x512 icon
    └── apple-touch-icon.svg  # iOS home screen icon
```

### Service Worker Caching Strategy
- **Static assets** (HTML, CSS, icons): Cache-first with network fallback
- **API calls**: Network-first with cache fallback + offline error message
- **Cache versioning**: `v2` - increment when making breaking changes
- **Auto-cleanup**: Old caches are automatically deleted on activation

### Updating the PWA
When you deploy changes:
1. Update the cache version in `sw.js` (e.g., `v2` → `v3`)
2. Deploy to Vercel
3. Users' service workers will auto-update on next visit
4. Hard refresh (Ctrl+Shift+R) to force update during development

If you want me to finish the Vercel import and deploy for you, authorize me (I can guide you through the web flow).