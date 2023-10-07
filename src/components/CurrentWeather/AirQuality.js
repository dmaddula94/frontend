const mapboxgl = require('mapbox-gl');
const moment = require('moment');

// Set your API key
const apiKey = "QnHFAzk6yin94m7rybRnPA41s9SoAMtW";

// Set your Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoiZG1hZGR1bGEiLCJhIjoiY2xtanNwYXFmMDZkMzJzbzRyMXR6aWlpbiJ9.BBTMWrilLFhqOB_UgU-D7w";

// initialize the map
var map = new mapboxgl.Map({
  container: 'map',
  zoom: 3,
  center: [980, 40],
  style: 'mapbox://styles/mapbox/light-v10',
  antialias: true
});

// set the timestamp
const timestamp = moment.utc().add(6, "hours").toISOString();

// set the format
const format = '.png';

// organize the fields to visualize
const pollutionFieldsConfig = [
    {
        field: "epaIndex",
        paintProps: {
            'raster-opacity': 0.2,
        }
    },
    {
        field: "pollutantO3",
        paintProps: {
            'raster-opacity': 0.2,
        }
    },
    {
        field: "pollutantNO2",
    },
    {
        field: "pollutantCO",
        paintProps: {
            'raster-opacity': 0.4,
        }
    },
    {
        field: "pollutantSO2",
    }
]


const pollenFieldsConfig = [
    {
        field: "grassIndex",
    },
    {
        field: "weedIndex",
    }
]

function visualizeTrendsOnMap(fieldsConfig){
  
    // inject the tile layers
    map.on('load', function() {
        fieldsConfig.forEach((f) => {
            const { field, paintProps } = f;
            map.addSource(`tomorrow-io-api-${field}`, {
                "type": 'raster',
                "tiles": [`https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/${field}/${timestamp}${format}?apikey=${apiKey}`],
                "tileSize": 256,
                "attribution": '&copy; <a href="https://www.tomorrow.io/weather-api">Powered by Tomorrow.io</a>'
            });
            map.addLayer({
                "id": `${field}-tiles`,
                "type": "raster",
                "source": `tomorrow-io-api-${field}`,
                "minzoom": 1,
                "maxzoom": 12
            });
            Object.entries(paintProps || {}).forEach(([prop, val]) => {
                map.setPaintProperty(
                    `${field}-tiles`,
                    prop,
                    val,
                );
            })
            
        })

    });
}

visualizeTrendsOnMap(pollenFieldsConfig);