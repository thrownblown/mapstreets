// var map;
var userPoly;
var path = [];
var gridCoord = [];
var streets = [];
var testLat = [];
var testLing = [];
var mem = {};
var seCorner;
var neCorner;
var swCorner;
var nwCorner;
var streetName;
var center = [37.76570618798191,-122.428766746521];
//extending our big A Array to provide easy min/max methods
Array.max = function( array ){
  return Math.max.apply( Math, array );
};

Array.min = function( array ){
  return Math.min.apply( Math, array );
};

function initialize() {

  var map = L.map('map').setView(center, 14);
  mapLink = '<a href="http://opencyclemap.org">OpenStreetMap</a>';
  L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    minZoom: 12,
  }).addTo(map);

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
    var type = e.layerType,
      layer = e.layer;
    drawnItems.addLayer(layer);
  });

  var mapLayer = MQ.mapLayer();
  var toner = new L.StamenTileLayer("toner");
  var terrain = new L.StamenTileLayer("terrain");
   
  L.control.layers({
    'Toner': toner,
    'Terrain': terrain,
    'Map': mapLayer,
    'Hybrid': MQ.hybridLayer()
  }).addTo(map);

  var popup = L.popup();
  var geocode;
   
  map.on('click', function(e) {
    popup.setLatLng(e.latlng).openOn(this);
    geocode.reverse(e.latlng);
  });
   
  geocode = MQ.geocode().on('success', function(e) {
    popup.setContent(geocode.describeLocation(e.result.best));
  });

}


function buildTestArray(){
  var myArray = userPoly.getPaths().getArray()[0].j;
  for (var i = 0; i < myArray.length; i++){
    testLat.push(myArray[i].k);
    testLing.push(myArray[i].A);
  }
}

function getCorners(){
  buildTestArray();
  var circle ={
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: 'red',
      fillOpacity: .8,
      scale: 4,
      strokeColor: 'black',
      strokeWeight: 2
  };

  seCorner = new google.maps.Marker({
    position: new google.maps.LatLng(Array.min(testLat),Array.max(testLing)),
    title: 'seCorner',
    map: map,
    icon: circle
  });

  neCorner = new google.maps.Marker({
    position: new google.maps.LatLng(Array.max(testLat),Array.max(testLing)),
    title: 'neCorner',
    map: map,
    icon: circle
  });

  nwCorner = new google.maps.Marker({
    position: new google.maps.LatLng(Array.max(testLat),Array.min(testLing)),
    title: 'nwCorner',
    map: map,
    icon: circle
  });

  swCorner = new google.maps.Marker({
    position: new google.maps.LatLng(Array.min(testLat),Array.min(testLing)),
    title: 'swCorner',
    map: map,
    icon: circle
  });
}


function applyGrid(){

  var height = [];
  var lat = Array.min(testLat);
  while(lat < Array.max(testLat)){
    height.push(lat);
    lat += 0.0005;
  }

  var width = [];
  var lng = Array.min(testLing);
  while(lng < Array.max(testLing)){
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
  getCorners();
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
        // data: {location: loc},
        success: function(data) {
          center = data.results[0].locations[0].latLng;
          console.log(center);
          map.panTo(center);
        }
      });
}

$('document').ready(initialize());
// window.onload = initialize();