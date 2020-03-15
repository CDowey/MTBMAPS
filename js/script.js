// Set counter
let count = 10
document.getElementById("count").innerHTML = "Points remaining: " + count.toString();

// Create list of trail names
let trails = [
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
  let currentIndex = array.length, temporaryValue, randomIndex;

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

let trail_rand = shuffle(trails)

// Create map and grouplayers and Basemaps
// Create Map

let map = L.map('mapid')//.setView([44, -72.5], 8);
//let map = L.map('mapid');

// Basemaps
let Base = L.tileLayer('').addTo(map);

let Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
});

let Stamen_TonerBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

let Thunderforest_Landscape = L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={apikey}', {
  attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  apikey: 'eb1937f239cf4794a8edeb744d50d083',
  maxZoom: 22
});


let baselayer = {
  'No Basemap': Base,
  'Minimal Basemap': Stamen_TonerBackground,
  'Outdoors Basemap': Thunderforest_Landscape
};

// create an operational layer that is empty for now
let trailGroup = new L.featureGroup().addTo(map);

// Read in geoJson from file and add to layerGroup
let lineStyle = {
  "color": "#ff7800",
  "weight": 2,
  "opacity": 0.65
};

//let trail = new L.GeoJSON.AJAX("data/Visceral.geojson", {
//  style : lineStyle
//});


// Create layerControl for layerGroups
let layerControl = {
  "Trail": trailGroup,
//  "Spruce": trail2 // an option to show or hide the layer you created from geojson
}

L.control.layers(baselayer, layerControl).addTo(map)

// Update counter to reflect the basemap toggles

map.on('baselayerchange', function(layer, name) {

  // Alert for running out of points
  if(count==0){
    alert("You have run out of points");
  }
  document.getElementById("count").innerHTML = "Points remaining: " + count;
});

// Should the points update to reflect the pans and zooms?


// On button click or correct selection add proper basemap to map.

function NoBase(){
  $('.leaflet-control-layers-selector')[0].click()
}

function StamenBase(){
  $('.leaflet-control-layers-selector')[1].click()
  count = count - 1
  document.getElementById("count").innerHTML = "Points remaining: " + count.toString();

}

function OutdoorBase(){
  $('.leaflet-control-layers-selector')[2].click()
  count = count - 3
  document.getElementById("count").innerHTML = "Points remaining: " + count.toString();
}

// Need a function that does the following upon page load
// and upon each correct selection afterwards until no trails left
// Selects the first/next trail in the random shuffle
// Builds the five buttons including the trail and four others
// Sets the basemap to no basemap
// Adds the track of the first/next trail to the map and zooms to

let trail_number = 0
let trail_array_len = trail_rand.length
let current_trail_global = ''

// Run loadNextTrail upon page load
document.addEventListener("DOMContentLoaded", function() {
  loadNextTrail();
});

function loadNextTrail(){ //need some if trailnumber<= length else print game done

  if (trail_number >= trail_array_len){
    alert('End of list of trails')
    console.log('game over')
  } else {
    // Get the next trail in the random order of trail names
    let current_trail = trail_rand.slice(trail_number, trail_number + 1);
    console.log(current_trail[0])
    // For now display the name of the current trail
    // Build the labels for the buttons, starting with the other four
    let remaining_trail_options = trail_rand.filter(function(value, index, arr){
        return value != current_trail;
    }).slice(0,4);
    trail_options = shuffle(current_trail.concat(remaining_trail_options));

    // For each loop on an array to build the buttons text and restore color
    const button_ids = ["option1", "option2", "option3", "option4", "option5"]

    button_ids.forEach((item, i) => {
      document.getElementById(item).innerHTML = trail_options[i];
      document.getElementById(item).style.backgroundColor = "#4CAF50"
    });

    // Load the current trail onto the map
    let trail = omnivore.gpx('data/' + current_trail + '.gpx')
        .on('ready', function() {
            style : lineStyle;   //not sure this is the right place for lineStyle
            map.fitBounds(trail.getBounds(), {padding: [15, 15]}) //ideally there would be a bit more padding I think
        })

    // add id to trail layer for easy removal later

    trail.addTo(trailGroup);
    // Reset Basemap
    NoBase()

    // Increase trail number for next time function is run
    trail_number = trail_number + 1

    return map_load = {
      current_trail: current_trail[0],
      trail_layer_id : trail._leaflet_id
    }
  }
};


function trailbuttons_click(button) {
    if(button.innerHTML == map_load.current_trail){

      // Flash the correct button a different shade of green
      button.style.backgroundColor = "#2fd609";

      // Remove
      trailGroup.removeLayer(map_load.trail_layer_id);
      // Load next trail
      setTimeout(loadNextTrail(), 200000);

    } else {
      // Decrease count
      count--;

      // Alert for running out of points
      if(count==0){
        alert("You have run out of points");
      }
      document.getElementById("count").innerHTML = "Points remaining: " + count;
      // Change button background color
      button.style.backgroundColor = "#8B0000"
    }
}
