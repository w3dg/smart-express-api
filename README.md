# Smart-express-api

An implementation ( a template rather ) for understanding how to make express servers more secure day by day.

### Run Locally

After installing dependencies with `npm install`, <br />

- `npm run start` will start up the server,
- `npm run dev` will start up the server with nodemon which will restart the server whenever code changes.

### Why

You have your api for your own use ( mostly ) like a proxy for a weather api to hide your api key. Well, Good. But the thing is, others can look at the api and try to spam it in which case your api key will be likely expired for the day or hour (depending on the api) leaving you to be the sufferer who is now sad because the website you made which talks to the server is now broken and you cannot flex to others that you made it and show it to them or [think of some other circumstances, you know]

Thats where this kind of implementation will come in!

### Things to do when setting up api

- **Rate-Limiting by IP and Speed Limiting**

  With the **express-rate-limit** and the **express-slow-down** packages you will be assured to rate limit the ip which makes more requests to the server in a given timeframe than you want , simultaneously increasing the response time each request at a time thus discouraging and blocking the bad guy. :tada:

```js
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
```

- **Serving up local cache of the data**

  You may want to use a **local cache** of the data from the api you are calling so that the subsequent requests remain relatively much faster and you dont have to call the api again and again thus saving up on the limit ( if any ). :sparkles:

```js
// serve up cache in last 80 s
if (cache && cachedTime > Date.now() - 80 * 1000) {
  return res.json(cache);
} else {
  // if time > last cache make new requset

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
```

### Technologies/Packages Used

- [cors](https://www.npmjs.com/package/cors) (Allows Cross origin requests ( sets Access control origin header: "\*" ))
- [dotenv](https://www.npmjs.com/package/dotenv) (loads in environment cariables from a `.env` file so that secrets are hidden)
- [express](https://www.npmjs.com/package/express) ( the server framework itself for node.js)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) ( Use to limit repeated requests to public APIs and/or endpoints such as password reset. )
- [express-slow-down](https://www.npmjs.com/package/expresss-slow-down) ( Basic rate-limiting middleware for Express that slows down responses rather than blocking them outright )
- [helmet](https://www.npmjs.com/package/helmet) ( Helmet helps you secure your Express apps by setting various HTTP headers. ),
- [morgan](https://www.npmjs.com/package/morgan) ( A logger to see requests and other info about them),
- [node-fetch](https://www.npmjs.com/package/node-fetch) ( Implementation of fetch on the backend with node )
- [nodemon](https://www.npmjs.com/package/nodemon) ( A tool to restart your server whenever files change. More to be used in dev environments to refresh server code)

##### Note

This starter will use all the packages mentioned above so after `npm install` they will be ready to go! If you want to hide api keys and other stuff just start editing the corresponding files and voila!
