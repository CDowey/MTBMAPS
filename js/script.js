// Create Map

var map = L.map('mapid').setView([44, -72.5], 8);

// Basemaps
var base = L.tileLayer('').addTo(map)

var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
});

var Thunderforest_Landscape = L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={apikey}', {
  attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  apikey: 'eb1937f239cf4794a8edeb744d50d083',
  maxZoom: 22
});


var baselayer = {
  'No Basemap': base,
  'Stamen Basemap': Stamen_Toner,
  'Outdoors Basemap': Thunderforest_Landscape
}

// create an operational layer that is empty for now
let trail1 = L.layerGroup().addTo(map)
let trail2 = L.layerGroup().addTo(map)

var myStyle = {
  "color": "#ff7800",
  "weight": 2,
  "opacity": 0.65
};

// Read in geoJson from file and add to layerGroup
var steeple = new L.GeoJSON.AJAX("data/SteepleZones.geojson");
trail1.addLayer(steeple)

var Spruce = new L.GeoJSON.AJAX("data/Spruce.geojson", {
  onEachFeature: function(feature, layer) {
    layer.bindPopup(feature.properties.name);
  },
  style: myStyle
});

trail2.addLayer(Spruce)

// Create layerControl for layerGroups
let layerControl = {
  "Steeple Ski": trail1,
  "Spruce": trail2 // an option to show or hide the layer you created from geojson
}


L.control.layers(baselayer, layerControl).addTo(map)

// Update counter to reflect the number of layers on
var myTable = document.getElementById('counter');
var count = 0
myTable.rows[0].cells[1].innerHTML = count;

map.on('baselayerchange', function(layer, name) {
  count++;
  myTable.rows[0].cells[1].innerHTML = count;
});

// Set map bounds (doesn't work??)
var FeatureGroup = L.FeatureGroup(trail1, trail2)

map.fitBounds(steeple.getBounds(),{
  padding: [20,20]
});

// Set up buttons to toggle Basemaps
function BasemapOff() {
  if(!toggle) {
    map.removeLayer(data1);
  } else {
    map.addLayer(data1);
  }
  toggle = !toggle;
}
