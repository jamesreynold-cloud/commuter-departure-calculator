function calculateDeparture(arrivalTime, travelTime, buffer = 10) {
  const [hour, minute] = arrivalTime.split(':').map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    throw new Error('Invalid arrivalTime');
  }
  let arrivalMinutes = hour * 60 + minute;
  let leaveMinutes = arrivalMinutes - travelTime - buffer;
  if (leaveMinutes < 0) leaveMinutes += 24 * 60;
  const leaveHour = Math.floor(leaveMinutes / 60);
  const leaveMinute = leaveMinutes % 60;
  return `${String(leaveHour).padStart(2, '0')}:${String(leaveMinute).padStart(2,'0')}`;
}

module.exports = { calculateDeparture };
