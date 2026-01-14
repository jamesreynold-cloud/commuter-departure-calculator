const { test, expect } = require('@playwright/test');

// Basic E2E: open homepage, fill form, check result text has expected departure time
// Uses LIVE_URL via playwright.config.js

test('calculates departure and shows notification & countdown', async ({ page, baseURL }) => {
  // We will test notification scheduling and countdown by using a debug route with 0 travel time
  // and making the page think "now" is 5 seconds before the departure minute.

  // Compute arrival time as the next minute (HH:MM)
  const now = new Date();
  const next = new Date(now.getTime() + 60_000);
  const hh = String(next.getHours()).padStart(2, '0');
  const mm = String(next.getMinutes()).padStart(2, '0');
  const arrivalTime = `${hh}:${mm}`;

  // Compute desired page start time: 5 seconds before departure minute
  const departureTimestamp = new Date(next.getFullYear(), next.getMonth(), next.getDate(), next.getHours(), next.getMinutes(), 0, 0).getTime();
  const desiredStart = departureTimestamp - 5000; // 5s before
  const realNow = Date.now();
  const offset = desiredStart - realNow;

  // Inject Date override and mock Notification before any scripts run
  await page.addInitScript(({ offset }) => {
    // override Date.now and Date constructor to add offset while preserving progress
    const RealDate = Date;
    const realNow = RealDate.now;
    function PatchedDate(...args) {
      if (args.length === 0) {
        return new RealDate(realNow() + offset);
      }
      return new RealDate(...args);
    }
    PatchedDate.now = () => realNow() + offset;
    PatchedDate.UTC = RealDate.UTC;
    PatchedDate.parse = RealDate.parse;
    PatchedDate.prototype = RealDate.prototype;
    // make Date global
    // eslint-disable-next-line no-global-assign
    globalThis.Date = PatchedDate;

    // Stub Notification to capture calls
    globalThis.__lastNotification = null;
    class FakeNotification {
      constructor(title, opts) {
        globalThis.__lastNotification = { title, opts };
      }
      static requestPermission() { return Promise.resolve('granted'); }
    }
    globalThis.Notification = FakeNotification;
  }, { offset });

  await page.goto('/');

  // Fill form with debug route and zero buffer so departure==arrival
  await page.selectOption('#route', 'debug');
  await page.fill('#arrivalTime', arrivalTime);
  await page.fill('#buffer', '0');

  // Submit
  await page.click('button:has-text("Calculate Departure")');

  // Verify immediate result text
  await page.waitForSelector('#result');
  const result = await page.locator('#result').textContent();
  expect(result).toContain('You should leave at');

  // Countdown should show time less than a minute (0m Xs) shortly after
  await page.waitForFunction(() => {
    const el = document.getElementById('countdown');
    return el && /Leaving in 0m \d+s/.test(el.innerText);
  }, null, { timeout: 5000 });

  // Wait up to 6s for the scheduled notification to fire
  await page.waitForFunction(() => !!globalThis.__lastNotification, null, { timeout: 7000 });
  const notif = await page.evaluate(() => globalThis.__lastNotification);
  expect(notif).not.toBeNull();
  expect(notif.title).toContain('Time to Leave');
});