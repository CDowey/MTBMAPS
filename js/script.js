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
  "Callagys",
  'Flo'
]

// Randomize order of list and select first item (after a correct guess move to the next item)
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var trail_rand = shuffle(trails)

var current_trail = trail_rand.slice(0,1)

document.getElementById("currentTrail").innerHTML = "Trail Displayed = " + current_trail ;


var remaining_trail_options = trail_rand.filter(function(value, index, arr){
    return value != current_trail;
}).slice(0,4);

trail_options = shuffle(current_trail.concat(remaining_trail_options));

document.getElementById("option1").innerHTML = trail_options[0];
document.getElementById("option2").innerHTML = trail_options[1];
document.getElementById("option3").innerHTML = trail_options[2];
document.getElementById("option4").innerHTML = trail_options[3];
document.getElementById("option5").innerHTML = trail_options[4];


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
var trailGroup = new L.featureGroup().addTo(map);

// Read in geoJson from file and add to layerGroup
var lineStyle = {
  "color": "#ff7800",
  "weight": 2,
  "opacity": 0.65
};

//var trail = new L.GeoJSON.AJAX("data/Visceral.geojson", {
//  style : lineStyle
//});

//trail.on('data:loaded', function() {
//    map.fitBounds(steeple.getBounds())
//  });

// Use omnivore for displaying gpx files
var trail = omnivore.gpx('data/' + current_trail + '.gpx')
    .on('ready', function() {
        style : lineStyle;   //not sure this is the right place for lineStyle
        map.fitBounds(trail.getBounds()) //ideally there would be a bit more padding I think
    })

trail.addTo(trailGroup);

// Create layerControl for layerGroups
let layerControl = {
  "Trail": trailGroup,
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
