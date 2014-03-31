 
var map;
var myPoly;
var path = [
new google.maps.LatLng(37.7107,-122.4376),
new google.maps.LatLng(37.7147,-122.4396),
new google.maps.LatLng(37.7087,-122.4366)
]

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(37.7107,-122.4376),
    zoom: 15
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
  console.log(myPoly.getPaths().getArray())

  myArray = myPoly.getPaths().getArray()[0].j
  console.log(myArray);
  for (i=0; i<myArray.length; i++){
    
  }

}

google.maps.event.addDomListener(window, 'load', initialize);