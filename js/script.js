// Set counter
var count = 11
document.getElementById("count").innerHTML = "Points remaining: " + count;

// Create list of trail names
var trails = [
  'Visceral',
  'Rastaman',
  'Florence',
  '1Love',
  'Evolution',
  'Sheep Thrills',
  'Rogue One',
  "Callagy's",
  'Flow'
]

document.getElementById("option1").innerHTML = trails[0];
// Need a function to take the one correct answer
// Grab four other options and then randomize order and assign to buttons
function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

var trail_sel = getRandomSubarray(trails, 5);


document.getElementById("option1").innerHTML = trail_sel[0];
document.getElementById("option2").innerHTML = trail_sel[1];
document.getElementById("option3").innerHTML = trail_sel[2];
document.getElementById("option4").innerHTML = trail_sel[3];
document.getElementById("option5").innerHTML = trail_sel[4];


// Create Map

var map = L.map('mapid')//.setView([44, -72.5], 8);
//var map = L.map('mapid');

// Basemaps
var Base = L.tileLayer('').addTo(map);

var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
});

var Stamen_TonerBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
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
  'No Basemap': Base,
  'Stamen Basemap': Stamen_TonerBackground,
  'Outdoors Basemap': Thunderforest_Landscape
};

// create an operational layer that is empty for now
var trail1 = new L.featureGroup().addTo(map);

// Read in geoJson from file and add to layerGroup
var lineStyle = {
  "color": "#ff7800",
  "weight": 2,
  "opacity": 0.65
};

var steeple = new L.GeoJSON.AJAX("data/Visceral.geojson", {
  style : lineStyle
});

steeple.on('data:loaded', function() {
    map.fitBounds(steeple.getBounds())
  });

steeple.addTo(trail1);

// Create layerControl for layerGroups
let layerControl = {
  "Trail": trail1,
//  "Spruce": trail2 // an option to show or hide the layer you created from geojson
}

L.control.layers(baselayer, layerControl).addTo(map)

// Update counter to reflect the basemap toggles

map.on('baselayerchange', function(layer, name) {
  count--;

  // Alert for running out of points
  if(count==0){
    alert("You have run out of points");
  }
  document.getElementById("count").innerHTML = "Points remaining: " + count;
});

// On button click add proper basemap to map. This doesn't require removing the other

function StamenBase(){
  $('.leaflet-control-layers-selector')[1].click()
}

function OutdoorBase(){
  $('.leaflet-control-layers-selector')[2].click()
}

// Set counter
function StamenBase(){
  $('.leaflet-control-layers-selector')[1].click()
}
