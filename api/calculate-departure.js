const travelTimes = {
  "bus101": 20,
  "bus202": 35,
  "trainA": 25,
  "debug": 0
};

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

module.exports = (req, res) => {
  // CORS - Set before anything else
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version');
  
  // Preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST allowed' });
    return;
  }

  try {
    const { route, arrivalTime, buffer = 10 } = req.body || {};
    
    if (!route || !arrivalTime) {
      res.status(400).json({ error: 'Missing route or arrivalTime' });
      return;
    }

    const travelTime = travelTimes[route];
    if (travelTime === undefined) {
      res.status(400).json({ error: 'Unknown route' });
      return;
    }

    const departureTime = calculateDeparture(arrivalTime, travelTime, Number(buffer));
    
    res.status(200).json({ 
      route, 
      arrivalTime, 
      buffer: Number(buffer), 
      departureTime, 
      travelTime 
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};
