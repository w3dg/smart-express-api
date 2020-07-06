const express = require("express");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.enable("trust proxy");
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

// #1 Use Cache
// #2 Use rate-limiting and slow-down

const ipLimiter = rateLimit({
  windowMs: 60 * 1000, // 1min
  max: 5, // limit each IP to 5 requests per 1min
});
//  apply to all requests
// app.use(limiter);

const speedLimiter = slowDown({
  windowMs: 60 * 1000, // 1min
  delayAfter: 1, // allow 1 requests per 1min, then...
  delayMs: 500, // begin adding 500ms of delay per request above delayAfter:
});

//  apply to all requests
// app.use(speedLimiter);

let cache;
let cachedTime;

app.get("/", (req, res) => {
  res.send("WEATHER-API-BACKEND \n Go Home");
});

// ipLimiter and speedLimiter will be applicable to this route only in this case. Add them as middlewares before the actual handler.
app.get("/api/v1/weather", ipLimiter, speedLimiter, (req, res) => {
  // serve up cache in last 80 s
  if (cache && cachedTime > Date.now() - 80 * 1000) {
    return res.json(cache);
  } else {
    // if time > last cache make new req

    const API_URL = ""; // insert your own url here

    fetch(API_URL)
      .then((response) => response.json())
      .then((json) => {
        cache = json;
        cachedTime = Date.now();
        return res.json({
          json,
        });
      });
  }
});

app.get("*", (req, res) => {
  res.status(500).json({
    error: "Internal Server Error",
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
