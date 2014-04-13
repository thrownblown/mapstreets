var map,
    geoJsonPoly,
    gridCoord = [],
    streets = [],
    testLat = [],
    testLng = [],
    mem = {},
    streetName,
    center = [37.76300618798191,-122.427066746521];
//extending our big A Array to provide easy min/max methods
Array.max = function( array ){
  return Math.max.apply( Math, array );
};

Array.min = function( array ){
  return Math.min.apply( Math, array );
};

function init() {

  map = L.map('map', { scrollWheelZoom: false }).setView(center, 14);
  mapLink = '<a href="http://opencyclemap.org">OpenStreetMap</a>';
  L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    minZoom: 12,
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
    $('#logo strong').remove();
    var desc = geoClick.describeLocation(e.result.best);
    $('#logo').prepend('<strong class="grid">' + desc + '</strong>')
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
          color:"#F70D1A",
          dashArray:"10, 10",
          opacity:0.8,
          fillColor:"#FF7F50",
          fillOpacity:0.5
        },
        allowIntersection: false,
        drawError: {
          color: 'orange',
          timeout: 1000
        },
        showArea: true,
        metric: false,
        repeatMode: false
      },
      polyline: false,
      rectangle: false,
      circle: false
    },
    edit: {
      featureGroup: drawnItems
    }
  });

  map.addControl(drawControl);
  
  $('.leaflet-draw-section:first')
    .append('<div class="leaflet-draw-inner-toolbar" title="Polygon already drawn"></div>');

  map.on('draw:created', function (e) {
    var type = e.layerType;
    var layer = e.layer;
    drawnItems.addLayer(layer);
    geoJsonPoly = (layer.toGeoJSON());
    testBox(geoJsonPoly.geometry.coordinates[0]);
    $('.leaflet-draw-inner-toolbar').show();
    $('.grid').remove();
    $('#streets').prepend('<br class="grid"/><button class="grid" onclick="twoFer()">Show Streets</button><br class="grid"/>');

  });

  map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
      if (layer instanceof L.Polygon){
        geoJsonPoly = (layer.toGeoJSON());
        testBox(geoJsonPoly.geometry.coordinates[0]);
      }
    });
  });

  map.on('draw:deleted', function(e) {
    $('.leaflet-draw-inner-toolbar').hide();
    geoJsonPoly = {};
  });

}


function testBox(coordinates){
  testLat = [];
  testLng = [];
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
  var hLen = height.length;
  var wLen = width.length;

  for (var h =0; h < hLen; h++){
    for (var w=0; w< wLen; w++){
      var coord =  L.latLng(height[h],width[w]);
      var gjLayer = L.geoJson(geoJsonPoly);
      var results = leafletPip.pointInLayer(coord, gjLayer);
      if (results[0]){
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
        if ((streets.length%20)===0){streetSplit(streets)}
        if (streets.length===gridLen){
          streetSplit(streets);
          $('#streets table').prepend('<tr><td><h2>COMPLETE</h2></td></tr>')
        }
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
  for (i in mem){
    keys.push(i);
    keys.sort();
    var min = Array.min(mem[i]);
    var max = Array.max(mem[i]);
    mem[i]=[min, max]
  }
  var len = keys.length;
  for (i = 0; i < len; i++){
    console.log(mem)
    $('#streets table')
      .append('<tr><td width=130>' + keys[i] + '</td><td><b> Min: </b>' + mem[keys[i]][0] + '</td><td><b> Max: </b>' + mem[keys[i]][1] + '</td></tr>');
  }
}

function twoFer(){
  var streets = [];
  applyGrid();
  reverseGeo();
  $('.grid').remove();
}

function recenter(){
  var city = document.getElementById('city').value || 'Dolores Park, San Francisco, 94110';
  var state = document.getElementById('state').value;
  var zip = document.getElementById('zip').value; 
  $.ajax({
    url: 'http://www.mapquestapi.com/geocoding/v1/address?&key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56&location=' + city + ',' + state + ' ' + zip,
    dataType: 'jsonp',
    type: 'POST',
    contentType:'json',
    success: function(data) {
      center = data.results[0].locations[0].latLng;
      map.setView(center, 14);
    }
  });
}

$('document').ready(init());