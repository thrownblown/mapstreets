
var map;
var myPoly;
var path = [
new google.maps.LatLng(37.78371,-122.40),
new google.maps.LatLng(37.78370618798191,-122.408766746521),
new google.maps.LatLng(37.79,-122.41)
];

var testLat = [];
var testLing = [];
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
    // center: new google.maps.LatLng(37.7107,-122.4376),
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
  console.log(myPoly.getPaths().getArray());

  var myArray = myPoly.getPaths().getArray()[0].j;
  console.log(myArray);
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
// $(document).ready(function(){
//   $("a .showCorners").click(function(){
//     console.log('yo');
//     getCorners();
//   });
// });

google.maps.event.addDomListener(window, 'load', initialize);
