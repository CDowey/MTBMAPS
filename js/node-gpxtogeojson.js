var tj = require('togeojson'),
    fs = require('fs'),
    // node doesn't have xml parsing or a dom. use xmldom
    DOMParser = require('xmldom').DOMParser;

var gpx = new DOMParser().parseFromString(fs.readFileSync('/Users/CDowey/github/MTBMAPS/data/1Love.gpx', 'utf8'));

var converted = tj.gpx(gpx);
