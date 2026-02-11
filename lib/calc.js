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

function computeLeaveBy(arrivalEpochSeconds, walkingMinutes, bufferMinutes, nowEpochSeconds = Math.floor(Date.now() / 1000)) {
  const totalBufferSeconds = (Number(walkingMinutes) + Number(bufferMinutes)) * 60;
  const leaveByEpoch = Number(arrivalEpochSeconds) - totalBufferSeconds;
  const minutesUntilLeave = Math.floor((leaveByEpoch - nowEpochSeconds) / 60);
  return {
    leaveByEpoch,
    minutesUntilLeave,
    isLate: minutesUntilLeave < 0
  };
}

module.exports = { calculateDeparture, computeLeaveBy };
