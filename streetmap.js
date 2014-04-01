
var map;
var myPoly;
var path = [];
var gridCoord = [];
var streets = [];
var testLat = [];
var testLing = [];
var mem = {};

//moding our big A Array to provide easy min/max methods
Array.max = function( array ){
  return Math.max.apply( Math, array );
};

Array.min = function( array ){
  return Math.min.apply( Math, array );
};

var seCorner;
var neCorner;
var swCorner;
var nwCorner;



function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(37.78370618798191,-122.408766746521),
    zoom: 14
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


  myPoly = new google.maps.Polygon({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    editable: true
  });
  myPoly.setMap(map);
  myPoly.setPaths(path);



  google.maps.event.addListener(map, 'click', addLatLng);
}
function addLatLng(event) {
  path.push(event.latLng);
  myPoly.setPaths(path);
  var myArray = myPoly.getPaths().getArray()[0].j;
  for (var i = 0; i < myArray.length; i++){
    testLat.push(myArray[i].k);
    testLing.push(myArray[i].A);
  }
}
function getCorners(){
  if (seCorner){
    seCorner.setMap(null);
    neCorner.setMap(null);
    swCorner.setMap(null);
    nwCorner.setMap(null);
  }

  seCorner = new google.maps.Marker({
    position: new google.maps.LatLng(Array.min(testLat),Array.max(testLing)),
    title: 'seCorner',
    map: map
  });
  console.log('seCorner', Array.min(testLat),Array.max(testLing));

  neCorner = new google.maps.Marker({
    position: new google.maps.LatLng(Array.max(testLat),Array.max(testLing)),
    title: 'neCorner',
    map: map
  });
  console.log('neCorner', Array.max(testLat),Array.max(testLing));

  nwCorner = new google.maps.Marker({
    position: new google.maps.LatLng(Array.max(testLat),Array.min(testLing)),
    title: 'nwCorner',
    map: map
  });
  console.log('nwCorner', Array.max(testLat),Array.min(testLing));

  swCorner = new google.maps.Marker({
    position: new google.maps.LatLng(Array.min(testLat),Array.min(testLing)),
    title: 'swCorner',
    map: map
  });
  console.log('swCroner', Array.min(testLat),Array.min(testLing));
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
      if (google.maps.geometry.poly.containsLocation(coord, myPoly)){
        gridCoord.push(height[h].toString() + ',' + width[w].toString());
      }
    }
  }
}

function reverse(){
  getCorners();
  applyGrid();
  for (var i=0; i<gridCoord.length; i++){
    var loc = gridCoord[i];
    $.ajax({
        url: 'http://www.mapquestapi.com/geocoding/v1/reverse?key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56',
        dataType: 'jsonp',
        type: 'POST',
        contentType:'json',
        data: {location: loc},
        success: function(data) {streets.push(data.results[0].locations[0].street);},
        error: function(data) {console.log('error occurred - ' + data);}
      });
  }
}

function streetSplit(arr){
  for (var i = 0; i < arr.length; i++){
    var streetName = arr[i].match(/([A-Z])\w+/g);
    if (streetName.length===[2]){ streetName = streetName.join(' '); }
    if (streetName in mem){
      console.log('we been here before ', streetName);
      mem[streetName].push(arr[i].match(/([0-9])\w+([^th])\W/g));
    } else {
      console.log('whoa ', streetName);
      mem[streetName] = [];
      var addy = arr[i].match(/([0-9])\w+([^th])\W/g);
      console.log('addy is ',addy);
      if (addy){ mem[streetName].join(addy); }
    }
  }
}



google.maps.event.addDomListener(window, 'load', initialize);
