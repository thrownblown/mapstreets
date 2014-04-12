var map;
var coordinates;
var gmap = new google.maps.Map()
var userPoly = new google.maps.Polygon({paths: coordinates});
var path = [];
var gridCoord = [];
var streets = [];
var testLat = [];
var testLng = [];
var mem = {};
var streetName;
var center = [37.76700618798191,-122.427066746521];
//extending our big A Array to provide easy min/max methods
Array.max = function( array ){
  return Math.max.apply( Math, array );
};

Array.min = function( array ){
  return Math.min.apply( Math, array );
};

function initialize() {

  map = L.map('map', { scrollWheelZoom: false }).setView(center, 14);
  mapLink = '<a href="http://opencyclemap.org">OpenStreetMap</a>';
  L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    minZoom: 10,
  }).addTo(map);

  var mapLayer = MQ.mapLayer();
  var toner = new L.StamenTileLayer("toner");
  var terrain = new L.StamenTileLayer("terrain");
   
  L.control.layers({
    'Toner': toner,
    'Terrain': terrain,
    'Map': mapLayer,
    'Hybrid': MQ.hybridLayer()
  }).addTo(map);

  var geoClick = MQ.geocode().on('success', function(e) {
    $('#streets strong').remove();
    var desc = geoClick.describeLocation(e.result.best);
    $('#streets').prepend('<strong class="grid">' + desc + '</strong>')
  });
   
  map.on('click', function(e) {
    geoClick.reverse(e.latlng);
  });
   

  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  var drawControl = new L.Control.Draw({
    position: 'topleft',
    draw: {
      polygon: {
        shapeOptions: {
          color: 'red',
          dashArray: '10, 10'
        },
        allowIntersection: false,
        drawError: {
          color: 'orange',
          timeout: 1000
        },
        showArea: true,
        metric: false,
        repeatMode: true
      },
      polyline: false,
      rectangle: false,
      circle: false
    },
    edit: {
      featureGroup: drawnItems,
        selectedPathOptions: {
          color: 'black', /* Hot pink all the things! */
          opacity: 0.8,
          dashArray: '10, 10',
          fill: true,
          fillColor: 'blue',
          fillOpacity: 0.3
        }
    }
  });

  map.addControl(drawControl);

  map.on('draw:created', function (e) {
    var type = e.layerType;
    var layer = e.layer;
    drawnItems.addLayer(layer);
    coordinates = (layer.toGeoJSON().geometry.coordinates[0]);
    testBox(coordinates);
  });


}


function testBox(coordinates){
  for (var i = 0; i < coordinates.length; i++){
    testLat.push(coordinates[i][1]);
    testLng.push(coordinates[i][0]);
  }
}


function applyGrid(){

  var height = [];
  var lat = Array.min(testLat);
  while(lat < Array.max(testLat)){
    height.push(lat);
    lat += 0.0005;
  }

  var width = [];
  var lng = Array.min(testLng);
  while(lng < Array.max(testLng)){
    width.push(lng);
    lng += 0.0005;
  }

  for (var h =0; h < height.length; h++){
    for (var w=0; w< width.length; w++){
      var coord = new google.maps.LatLng(height[h],width[w]);
      if (google.maps.geometry.poly.containsLocation(coord, userPoly)){
        gridCoord.push(height[h].toString() + ',' + width[w].toString());
      }
    }
  }
}

function reverseGeo(){
  var gridLen = gridCoord.length;
  for (var i=0; i<gridLen; i++){
    var loc = gridCoord[i];
    $.ajax({
        url: 'http://www.mapquestapi.com/geocoding/v1/reverse?key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56',
        dataType: 'jsonp',
        type: 'POST',
        contentType:'json',
        data: {location: loc},
        success: function(data) {
          streets.push(data.results[0].locations[0].street);
          if ((streets.length%50)===0){streetSplit(streets)};
          if (streets.length===gridLen){
            streetSplit(streets);
            $('#streets').prepend('<h2>COMPLETE</h2>')
          };
        }
      });
  }
}

function streetSplit(arr){
  mem = {};
  $('#streets tr').remove();
  for (var i = 0; i < arr.length; i++){
    var stArr = arr[i].split(' ');
    var streetNum = parseFloat(stArr.slice(0,1));
    if (stArr.length > 2){
      streetName = stArr.slice(1).join(' ');
    } else if(stArr.length === 2){
      if (stArr[1]==='Broadway'){
        streetName = 'Broadway'
      }else{
        streetName = arr[i];
      }
    }
    if (streetNum){
      if (streetName in mem){
        mem[streetName].push(streetNum);
      } else {
        mem[streetName] = [];
        mem[streetName].push(streetNum);
      }
    }
  }
  var keys = [];
  for (var i in mem){
    keys.push(i);
    keys.sort();
    var min = Array.min(mem[i]);
    var max = Array.max(mem[i]);
    mem[i]=[min, max]
  }
  var len = keys.length;
  for (i = 0; i < len; i++){
    $('#streets table')
      .append('<tr><td width=130>' + keys[i] + '</td><td><strong> Min: </strong>' + mem[keys[i]][0] + '</td><td><strong> Max: </strong>' + mem[keys[i]][1] + '</td></tr>');
  }
}

function twoFer(){
  var streets = [];
  applyGrid();
  reverseGeo();
  $('.grid').remove();
  $('ul').append('<li><a href="#" class"applyGrid" onclick="streetSplit(streets);">Show Streets</a></li>');
}

function recenter(){
  var city = document.getElementById('city').value;
  var state = document.getElementById('state').value;
  var zip = document.getElementById('zip').value;
  $.ajax({
        url: 'http://www.mapquestapi.com/geocoding/v1/address?&key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56&location=' + city + ',' + state + ' ' + zip,
        dataType: 'jsonp',
        type: 'POST',
        contentType:'json',
        success: function(data) {
          center = data.results[0].locations[0].latLng;
          console.log(center);
          map.setView(center, 14);
        }
      });
}

$('document').ready(initialize());
// window.onload = initialize();