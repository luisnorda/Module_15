// data
link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"



let myMap = L.map("map", {
    center: [0, 0],
    zoom: 2
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  


function depthToColor(depth) {
  if (depth < 10) return "limegreen";  
  else if (depth < 30) return "lawngreen"; 
  else if (depth < 50) return "yellowgreen";  
  else if (depth < 70) return "goldenrod";  
  else if (depth < 90) return "darkorange";  
  else return "red";  
}


// earthquake data
d3.json(link)
    .then((data) => {
        // Loop through earthquake data and create markers
        data.features.forEach(feature => {
            const coords = feature.geometry.coordinates;
            const magnitude = feature.properties.mag;
            const depth = coords[2];
            const title = feature.properties.title;

           
            const markerSize = magnitude * 2.5;

            marker = L.circleMarker([coords[1], coords[0]], {
              radius: markerSize,
              fillColor: depthToColor(depth),
              color: 'black', // Border color
              weight: 1, // Border weight
              opacity: 1, // Border opacity
              fillOpacity: 0.7, // Fill opacity
            }).addTo(myMap);
            marker.bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth} km<br>${title}`);
        });
    })
    .catch(error => console.error('Error fetching earthquake data:', error));


// Function to create a legend
function createLegend() {
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      const depthRanges = [[-10, 10], [10, 30], [30, 50], [50, 70], [70, 90], [90, 110]]; 

      for (let i = 0; i < depthRanges.length; i++) {
        const minDepth = depthRanges[i][0];
        const maxDepth = depthRanges[i][1];
        const avgDepth = (minDepth + maxDepth) / 2;
    
       
        if (i === depthRanges.length - 1) {
            div.innerHTML +=
                '<i style="background:' + depthToColor(avgDepth) + '"></i> ' +
                minDepth + '+<br>';
        } else {
            div.innerHTML +=
                '<i style="background:' + depthToColor(avgDepth) + '"></i> ' +
                minDepth + '&ndash;' + maxDepth + '<br>';
        }
      }
      return div;
  };
  legend.addTo(myMap);
}
// Call the function to create the legend
createLegend();

