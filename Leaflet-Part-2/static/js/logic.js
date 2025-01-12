// Initialize the map, set its view to a default location, and set the zoom level
const coord = [36.017566, -58.167489];
const map = L.map('map').setView(coord, 3);

// Define tile layers (base maps)
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const topo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; <a href="https://www.esri.com">Esri</a> &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; <a href="https://www.esri.com">Esri</a> &mdash; Source: Esri, Maxar, NOAA, USGS, and others'
});

// Add default base map (OpenStreetMap)
osm.addTo(map);

// Set marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 5; // Scale the size so the display on the map makes visual sense
}

// Assign colors to each depth range to assign later to each marker
function markerColor(depth) {
    if (depth > 90) return 'darkred';  
    if (depth > 70) return 'red';   
    if (depth > 50) return 'yellow';
    if (depth > 30) return 'orange'; 
    if (depth > 10) return 'lightgreen';
    return 'green';
}

// Create layer groups to store earthquake and tectonic plate data
const earthquakeLayer = L.layerGroup();
const tectonicLayer = L.layerGroup();

// Fetch earthquake data from the json link provided
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(response => response.json()) // Parse the JSON data
  .then(data => {
    // Loop through each value of the dataset
    for (let i = 0; i < data.features.length; i++) {
        const feature = data.features[i]; // Access each feature
        const [lon, lat, depth] = feature.geometry.coordinates; // Extract coordinates
        const magnitude = feature.properties.mag;               // Extract magnitude
        const title = feature.properties.title; // Extract the earthquake title from the dataset
        const splitTitle = title.split(" - "); // split the title on the - character
        const location = splitTitle[1]; // Extract the location from the new array

      // Add a circle marker for each earthquake
      L.circleMarker([lat, lon], {
        radius: markerSize(magnitude), // Marker size based on magnitude using the markerSize function
        fillColor: markerColor(depth), // Marker color based on depth using the markerColor function
        color: '#000',                    // Marker Border color
        weight: 1,                        // Marker Border weight
        opacity: 1,                       // Marker Border opacity
        fillOpacity: 0.8                  // Marker Fill opacity
      }).addTo(earthquakeLayer) // Add earthquake markers to the earthquake layer
        .bindPopup(`<h3>Location: ${location}</h3>
                    <p style="margin: 0;">Depth: ${depth.toFixed(2)} km</p>
                    <p style="margin: 0;">Earthquake Magnitude: ${magnitude}</p>
    `);
    };
  })
  .catch(error => {
    console.error('There was an error fetching from the dataset:', error); // return an error if the data doesn't load
  });

// Fetch tectonic plates data (GeoJSON)
fetch('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: 'orange',
        weight: 2
      }
    }).addTo(tectonicLayer); // Add tectonic plates as a layer
  })
  .catch(error => console.error('Error fetching tectonic plates data:', error));

// Add a legend to the map
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'legend');

    // Add styles for the legend that look most appealing
    div.style.backgroundColor = 'white'; 
    div.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    div.style.padding = '10px';
    div.style.fontSize = '14px';
    div.style.lineHeight = '18px';
    div.style.borderRadius = '5px';

    // create arrays of the depth ranges and their assocated colors for the legend display
    const depthRanges = [-10, 10, 30, 50, 70, 90];
    const colors = ['green', 'lightgreen', 'orange', 'yellow', 'red', 'darkred']

    // Add a title to the legend
    div.innerHTML += '<h4 style="margin:0 0 5px 0;">Depth Ranges (km)</h4>';

    // Loop through the depth ranges to generate legend values and their associated colors
    for (let i = 0; i < depthRanges.length; i++) {
        const start = depthRanges[i];
        const end = depthRanges[i + 1] || 'greater';

        div.innerHTML += `
            <i style="background: ${colors[i]};
                      width: 12px; 
                      height: 12px; 
                      display: inline-block; 
                      border: 1px solid #000;
                      margin-right: 5px"></i>
            ${start} - ${end}<br>
        `;
    }

    return div;
};

// Add the legend to the map
legend.addTo(map);

// Define overlays for the datasets
const overlays = {
  "Earthquakes": earthquakeLayer,
  "Tectonic Plates": tectonicLayer
};

// Define base maps
const baseMaps = {
  "Simple Map": osm,
  "Topographical Map": topo,
  "Satellite Map": satellite
};

// Add layer control to the map
L.control.layers(baseMaps, overlays).addTo(map);