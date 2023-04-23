# Instructions to run the project:

This project was build with node `v16.16.0`. 

Backend
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

# Thought process:

My first step after reading the problem statement was to check the [documentation](https://weather-gov.github.io/api/general-faqs) of the National Weather Service API. That's where I learned that you cannot query the API by zip code.

## Finding Lat/Long coordinates

Three options moving forward:

1. API selection for geocoordinates.
2. 3rd party package installed on backend for zip code to Lat/Long conversions.
3. Spin my own.

Number 3 seems silly when there are so many services to do the same thing.

Number 1 seems the most reliable and up to date especially if we use a service recommended by NWS. And it's agnostic to backend technology.

Number 2 is dependent on backend architecture and introduces a _less reliable_ third party dependency for data translation. In the spirit of this project I'll select Number 1.

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

Since the backend deosnt require storage here, a reverse proxy is a really simple solution. It allows me to make ajax requests to our data sources and hide my credentials. It also allows me to standardize the interface between frontend/backend. Changing the data sources wouldn't change the API signature. It hides the data sources from the user. I'll probably use some kind of simple node reverse-proxy. [node-http-proxy](https://github.com/http-party/node-http-proxy) has 13.3k stars on github and 195 maintainers so it seems reliable.

Frontend will be create-react-app. I'll use a MUI React Component Library to help me create a responsive and good looking user experience quickly.

## Implementation

First I created the node server. It's just a reverse proxy that handles request and makes a sequence of web requests to gather the data. It turns out we needed three requests to service the data, but I decided against caching certain information to limit the scope of this assignment.
