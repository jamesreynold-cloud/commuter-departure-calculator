const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

const GTFS_URL = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw';

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');

  const parentStopId = process.env.ELMHURST_PARENT_STOP_ID;
  if (!parentStopId) {
    res.status(500).json({
      error: 'Missing ELMHURST_PARENT_STOP_ID env var'
    });
    return;
  }

  const northStopId = `${parentStopId}N`;
  const southStopId = `${parentStopId}S`;

  try {
    const response = await fetch(GTFS_URL);
    if (!response.ok) {
      res.status(502).json({ error: `MTA feed error: ${response.status}` });
      return;
    }

    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );

    const nowMs = Date.now();
    const northbound = [];
    const southbound = [];

    for (const entity of feed.entity || []) {
      const tripUpdate = entity.tripUpdate;
      if (!tripUpdate || !tripUpdate.trip) continue;

      const routeId = tripUpdate.trip.routeId;
      if (routeId !== 'R') continue;

      const tripId = tripUpdate.trip.tripId || '';
      const stopUpdates = tripUpdate.stopTimeUpdate || [];

      for (const update of stopUpdates) {
        const stopId = update.stopId;
        if (stopId !== northStopId && stopId !== southStopId) continue;

        const arrivalTime = (update.arrival && update.arrival.time) || (update.departure && update.departure.time);
        if (!arrivalTime) continue;

        const arrivalEpoch = Number(arrivalTime);
        const minutesAway = Math.max(0, Math.round((arrivalEpoch * 1000 - nowMs) / 60000));
        const entry = {
          arrivalEpoch,
          arrivalISO: new Date(arrivalEpoch * 1000).toISOString(),
          minutesAway,
          tripId
        };

        if (stopId === northStopId) {
          northbound.push(entry);
        } else if (stopId === southStopId) {
          southbound.push(entry);
        }
      }
    }

    const bySoonest = (a, b) => a.arrivalEpoch - b.arrivalEpoch;
    northbound.sort(bySoonest);
    southbound.sort(bySoonest);

    res.status(200).json({
      stationName: 'Elmhurst Av',
      routeId: 'R',
      northbound: northbound.slice(0, 3),
      southbound: southbound.slice(0, 3),
      fetchedAtISO: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch MTA feed', message: err.message });
  }
};
