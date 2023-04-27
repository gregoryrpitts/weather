# Instructions to run the project:

This project was built with node `v16.16.0`.

## Start Instructions

Backend

You will need to create an `.env` file with a MapBox API token. Copy the `.env.template` file to `.env` and add the provided token.

```
cd <ROOT_DIR>/backend
npm i
npm run start
```

Frontend

```
cd <ROOT_DIR>/frontend
npm i
npm run start
```

Note: You can reset the localStorage and URL params by clicking the "Weather App" string in the NavBar.

# Thought process:

## Improvements

Sticking this section at the top, neven thought I wrote it at the end of the assignment, otherwise it could be missed at the bottom.

First and most obvious improvement is caching and/or storing information on the backend. This is such an obvious improvement that I'm a little regretful for choosing a reverse-proxy. It would cut out a dependency (MapBox in my case) and reduce the calls to NWS by 50%. Backend server response time would be much faster (1 call vs 3).

However, I think the benefits slightly outweigh the cost, mostly due to the circumstances of this project.
- I asked how many users would be using this as a clarifying question and the response was "only a handful" so server response time isn't too big of a concern. 
- Due to same logic above, I don't expect a lot of concurrent requests, so this seems OK for the current use case.
- 4-5 hours on the assignment sheet. It's important to achieve required scope in a timely manner and knowing when to "write a story/ticket for further improvements".
- Adding a database makes it more difficult for end user to setup, and non-database caching (file system or local memory) isn't a long term solution. My solution only requires latest LTS version of node `v16.16.0` which any user would almost certainly have.
- I'm interviewing with frontend team so backend is less important (in theory).
- Caching data from most forward geocoding APIs is against their terms of service and any paid API accounts should be justified by a real business case.

If I were to implement this, I might do something like:

- Use a Python Django/Flask backend that write to a PostgresQL relational database.
- Use the [pgeocode](https://pgeocode.readthedocs.io/en/latest/) package so that I don't have an external API dependency on zip->lat/long geocoding.
- Cache the response from the first NWS request (the weather station code) and the Lat/Long pair in my local database.
- Only require a single external API request to service weather for cached values.

## Process

My first step after reading the problem statement was to check the [documentation](https://weather-gov.github.io/api/general-faqs) of the National Weather Service API. That's where I learned that you cannot query the API by zip code.

## Finding Lat/Long coordinates

Three options moving forward:

1. API selection for geocoordinates.
2. 3rd party package installed on backend for zip code to Lat/Long conversions.
3. Spin my own.

Number 3 seems silly when there are so many services to do the same thing.

Number 1 seems the most reliable and up to date especially if we use a service recommended by NWS. Plus, it's agnostic to backend technology. It does suffer the downsides of being less reliable - 3rd parties could have downtime and they could change their API signature.

Number introduces a backend architecture contraint, i.e. any package we choose locks us into whatever framework/language it was written for without doing a bunch of extra work.

In the spirit of this project I'll select Number 1, although I think my implenentation of this option could be much better (mentioned below).

For the record I don't think it would be bad to select [pgeocode](https://pgeocode.readthedocs.io/en/latest/) since it has good documentation, lots of contributors, and a [relatively recent release](https://github.com/symerio/pgeocode). _pgeocode_ would require the least about of work especially for a python backend. But it does lock you in to Python.

## Api Selection

NWS API requires Lat/Long input, so we must use a service that provides Zip Code -> Lat/Long coordinate translation. It's also important to note that we ONLY have the Zip code as input. Anything else would increase amount of data the User needs to input and violate the requirements.

I limit my choices to the options provided by NWS on their documentation (page linked above).

Since this is a small prototype project, my priorities with API selection are:

0. API meets requirements.
1. Find something with good documentation.
2. Find something with a free tier that I have no chance of exceeding.
3. Find something with minimal signup (credit card, etc)

In my experience this is best to get things off the ground. If I encapsulate the geolocation API service properly, then we can swap out geolocation services very easily in case there is a pricing or bandwidth concern with my selection.

- [Y] Bing Maps Locations: **Free Tier: 125,000 cumulative billable transactions**
- [Y] Esri ArcGIS World Geocoding Service **Free Tier: 20,000 geocodes/month**
- [N] Geocode.xyz **Rate limiting to 1/sec with free tier**
- [N] Google Maps Geocoding **Requires Google project with billing enabled**
- [Y] MapBox Geocoding **Free Tier: 100,000 req/month, 600 req/minute**
- [Y] MapQuest Geocoding **Free Tier: Up to 15k requests per month, 600 req/minute**
- [N] US Census Bureau Geocoding Service: **Requires street address**

Geocode.xyz seems worth investigating if we have high volume, because they provide an AWS AMI that allows us to setup our own location server. It still would incur AWS fees but this might be lower than a per request billing for very high volume usage.

I'm selecting MapBox. It has 100k free queries and easy, user friendly documentation. If we start to reach our limit, we can cache the responses for a very low price (around $250).

## User Flow/Frontend

The user should land on a page that doesn't require authentication. There will be a single form that allows them to enter a five digit zip code. When the user hits "Search" or presses enter, we will
fetch the data and display. Also:

- Create a slider to switch between F/C. UI library component for expediency.
- Store the last searched for zip code, probably in browser local storage since it only need to be read by the client.
- Share button to copy URL to clipboard. Icon Button that copies to clipboard.
- Responsive layout for mobile

## Backend

Bcakend doesn't need a database for this project. We need to store our API key when requesting to the MapBox API and hide that from the frontend. Backend will need the ability to make two requests, one to MapBox and one to NWS.

## Technology Selection

I struggled with the backend choice, mostly trying to decide between writing just a reverse-proxy and a backend that stores data in a database. my decision came down to my opinion that for an MVP, I think this backend deosn't really require storage. The weather changes so quickly that caching the weather reports seems like a more "nice to have" feature for when we have more users.

I would actually make an argument to cache the zip code -> lat/longitude conversions in some kind of database so that we don't need to rely on MapBox. This seems like a no-brainer for "next steps". Note that this is against the terms of service for the free tier MapBox API as far as I can tell.

I went with the reverse proxy. It's good enough, since it allows me to make AJAX requests to our data sources and hide my credentials (MapBox API token) on the backend. The easiest way to bring this up is a very simple `node` server. It also cuts down on the setup and dependency installation, which is important when submitting a project like this :)

Frontend will be `create-react-app`. I'll use MUI React Component Library to help me bring this up quickly. I like using UI Component Frameworks beacuse they enforce styles and create a structure around theming, which makes your life a lot easier down the road.

## Implementation

### Backend

Backend first. It's just a reverse proxy that handles request and makes a sequence of web requests to gather the data. It turns out we needed three requests to service the data. Again, I decided against caching certain information to limit the scope of this assignment.

I did get surprised mid-implemnentation that I needed two NWS API requests. I misread the documentation and thought I could get weather from Lat/Long coordinates, but I needed to make a request to the weather station first. This creates opportunity to cache the responses from both of those requests and cut the number of requests down to one for any one weather request.

I went pretty heavy with Test Driven Devleopment in the backend. I'm a big fan of this approach beacuse it helps flesh out corner cases before you encounter them on the frontend, and forces you to understand about the contraints to using the API before you write the frontend.

### Frontend

create-react-app with a Typescript template is the starting point. I added Material UI component library because I'm deeply familiar with it and it would allow me to build a responsive design quickly.

The browser remembers the user's location by storing it in local storage. URL parameters will override any local storage state.

I went with a **Provider** pattern to store data in the React Application. I could have driven everything out of one top level component but I wanted to demonstrate some kind of global data management for the assignment. Redux seemed too complex for this small assignment, so a Provider was a nice choice. The weather fetch logic is driven from it's own hook, which abtracts the axios implementation away from the `WeatherProvider`. This makes it easier in case we ever want to change AJAX libraries or if the Backend API signature changes - we can isolate the changes to the `useWeather` hook.
