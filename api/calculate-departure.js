// Serverless API for Vercel / Netlify-compatible environments
const travelTimes = require('../data/travelTimes.json');

function calculateDeparture(arrivalTime, travelTime, buffer) {
  const [hour, minute] = arrivalTime.split(':').map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    throw new Error('Invalid arrival time');
  }
  let arrivalMinutes = hour * 60 + minute;
  let leaveMinutes = arrivalMinutes - travelTime - buffer;
  if (leaveMinutes < 0) leaveMinutes += 24 * 60;
  const leaveHour = Math.floor(leaveMinutes / 60);
  const leaveMinute = leaveMinutes % 60;
  return `${String(leaveHour).padStart(2, '0')}:${String(leaveMinute).padStart(2,'0')}`;
}

module.exports = async function (req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).send({ error: 'Only POST supported' });

    const { route, arrivalTime, buffer = 10 } = req.body || {};
    if (!route || !arrivalTime) return res.status(400).json({ error: 'Missing route or arrivalTime' });

    const travelTime = travelTimes[route];
    if (travelTime === undefined) return res.status(400).json({ error: 'Unknown route' });

    const departureTime = calculateDeparture(arrivalTime, travelTime, Number(buffer));

    return res.json({ route, arrivalTime, buffer: Number(buffer), departureTime, travelTime });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};