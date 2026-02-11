const { test, expect } = require('@playwright/test');

test('shows R arrivals and minutes after fetch', async ({ page }) => {
  await page.route('**/api/mta-arrivals', async route => {
    const mock = {
      stationName: 'Elmhurst Av',
      routeId: 'R',
      northbound: [{ arrivalEpoch: 1710000000, arrivalISO: '2024-03-09T12:00:00.000Z', minutesAway: 5, tripId: 'trip1' }],
      southbound: [{ arrivalEpoch: 1710000600, arrivalISO: '2024-03-09T12:10:00.000Z', minutesAway: 10, tripId: 'trip2' }],
      fetchedAtISO: new Date().toISOString()
    };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mock)
    });
  });

  await page.goto('/');
  await expect(page.getByText('R @ Elmhurst Av')).toBeVisible();
  await expect(page.getByText(/min/)).toBeVisible();
});
