function createMap(quakes) {
    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
  
    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
        "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the quakes layer.
    let overlayMaps = {
        "Earthquake Epicenters": quakes
    };
  
    // Create the map object with options.
    let map = L.map("map", {
        center: [43.495971,14.047156],
        zoom: 2,
        layers: [streetmap, quakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}

function chooseColor(depth){
    if (depth < 10) return "#00FF00";
    else if (depth < 30) return "greenyellow";
    else if (depth < 50) return "yellow";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "orangered";
    else return "#FF0000";
  }
  
function createMarkers(response) {
    let earthquakes = response.features;
    let epicenters = [];

    for (let i = 0; i < earthquakes.length; i++) {
        let earthquake = earthquakes[i];
        let magnitude = earthquake.properties.mag;
        let depth = earthquake.geometry.coordinates[2];


        let epicenter = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
            radius: Math.max(5, magnitude * 4),
            fillColor: chooseColor(earthquake.geometry.coordinates[2]),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(`${earthquake.properties.place}<br>${new Date(earthquake.properties.time)}<br>Magnitude: ${magnitude}<br>Depth: ${depth} km`);

        epicenters.push(epicenter);
    }
    createMap(L.layerGroup(epicenters));
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
