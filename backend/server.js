const express = require("express");
const cors = require("cors");
const travelTimes = require("./travelTimes.json");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Commuter Departure API is running"));

app.post("/calculate-departure", (req, res) => {
    const { route, arrivalTime, buffer } = req.body;

    if (!route || !arrivalTime || buffer === undefined) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    const travelTime = travelTimes[route];
    if (!travelTime) {
        return res.status(400).json({ error: "Invalid route" });
    }

    const [hour, minute] = arrivalTime.split(":").map(Number);
    let arrivalMinutes = hour * 60 + minute;

    let leaveMinutes = arrivalMinutes - travelTime - buffer;
    if (leaveMinutes < 0) leaveMinutes += 24 * 60;

    const leaveHour = Math.floor(leaveMinutes / 60);
    const leaveMinute = leaveMinutes % 60;
    const departureTime = `${String(leaveHour).padStart(2,'0')}:${String(leaveMinute).padStart(2,'0')}`;

    res.json({
        route,
        arrivalTime,
        buffer,
        departureTime
    });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
