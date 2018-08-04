# Neighborhood Map React
---

## Background
This project features a map of a sample neighborhood with the ability to filter the locations of interest.  It uses create-react-app to bootstrap the project.  The app demonstrates integration of Leaftlet map, external APIs and React with responsive design, accessibility and progressive web app in mind.

## Install
- Clone the project from github
- cd into the project folder
- Run `npm install`
- Open `src/RestaurantAPI.js` and add FourSquare clientId and clientSecret
- Run `npm start`
- Open `http://localhost:3000` in the browser

## Important Notes
Since the project is scaffolded with `create-react-app`, it automatically generated the two files `registerServiceWorker.js` and `service-worker.js`.  To overwrite the `service-worker.js` file, you either have to eject and edit the webpack config file or use `Workbox`, which is what I did.

To test service worker, please do not run in incognito mode because the mode only has 100MB for the cache and that's not enough to cache all the tiles.

Also, service worker is only enabled in production mode.  To build for production, run
```
npm run build
serve -s build
```

Then open `http://localhost:5000` in the browser

## Dependencies
- [FourSquareAPI](https://developer.foursquare.com/)
- `Leaflet Map`.  `leaflet.smoothmarkerbouncing` plugin was also used to enable animation. I did not use CDNs for them.  Instead, both of them are imported into React so that they will be included in the build, thus minified and cached with the code.

# Maintainers
[@vschau](https://github.com/vschau)
