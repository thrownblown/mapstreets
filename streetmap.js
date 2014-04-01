
var map;
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

//extending our big A Array to provide easy min/max methods
Array.max = function( array ){
  return Math.max.apply( Math, array );
};

Array.min = function( array ){
  return Math.min.apply( Math, array );
};




function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(37.78370618798191,-122.408766746521),
    zoom: 14
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


  userPoly = new google.maps.Polygon({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    editable: true
  });
  userPoly.setMap(map);
  userPoly.setPaths(path);



  google.maps.event.addListener(map, 'click', addLatLng);
}
function addLatLng(event) {
  path.push(event.latLng);
  userPoly.setPaths(path);
  var myArray = userPoly.getPaths().getArray()[0].j;
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
      if (google.maps.geometry.poly.containsLocation(coord, userPoly)){
        gridCoord.push(height[h].toString() + ',' + width[w].toString());
      }
    }
  }
}
function twoFer(){
  getCorners();
  applyGrid();
};
  
function reverse(){
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
    var stArr = arr[i].split(' ');
    var streetNum = stArr.slice(0,1);
    console.log(stArr, stArr.length);
    if (stArr.length > 2){
      var streetName = stArr.slice(1).join(' ');
    }
    if (streetName in mem){
      console.log('we been here before ', streetName);
      mem[streetName].push(parseInt(streetNum));
    } else {
      console.log('whoa ', streetName);
      mem[streetName] = [];
      mem[streetName].push(parseInt(streetNum));      
    }
  }
}



google.maps.event.addDomListener(window, 'load', initialize);
