const { test, expect } = require('@playwright/test');

// Basic E2E: open homepage, fill form, check result text has expected departure time
// Uses LIVE_URL via playwright.config.js

test('calculates departure and shows notification text', async ({ page, baseURL }) => {
  await page.goto('/');

  // Set inputs
  await page.selectOption('#route', 'trainA');
  await page.fill('#arrivalTime', '08:00');
  await page.fill('#buffer', '12');

  // Submit
  await page.click('button:has-text("Calculate Departure")');

  // Wait for result to populate
  const result = await page.locator('#result').textContent();
  expect(result).toContain('You should leave at');
  // Train A: travelTime 25, buffer 12 => 08:00 arrival -> leave at 07:23
  expect(result).toMatch(/07:23/);
});