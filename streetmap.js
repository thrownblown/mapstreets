var app = angular.module('mapulator', [])
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
var streetName;

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
    zoom: 14,
    styles: [{
      featureType: "poi",
      elementType: "labels",
      stylers: [ { visibility: "off" } ]
    }]
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

  neCorner = new google.maps.Marker({
    position: new google.maps.LatLng(Array.max(testLat),Array.max(testLing)),
    title: 'neCorner',
    map: map
  });

  nwCorner = new google.maps.Marker({
    position: new google.maps.LatLng(Array.max(testLat),Array.min(testLing)),
    title: 'nwCorner',
    map: map
  });

  swCorner = new google.maps.Marker({
    position: new google.maps.LatLng(Array.min(testLat),Array.min(testLing)),
    title: 'swCorner',
    map: map
  });
}


function applyGrid(){

  var height = [];
  var lat = Array.min(testLat);
  while(lat < Array.max(testLat)){
    height.push(lat);
    lat += 0.0003;
  }

  var width = [];
  var lng = Array.min(testLing);
  while(lng < Array.max(testLing)){
    width.push(lng);
    lng += 0.0003;
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
  streets = [];
  getCorners();
  applyGrid();
  setTimeout(reverse(), 2000);
  setTimeout(streetSplit(streets), 2000);
}

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
  mem = {};
  for (var i = 0; i < arr.length; i++){
    var stArr = arr[i].split(' ');
    var streetNum = stArr.slice(0,1);
    if (stArr.length > 2){
      streetName = stArr.slice(1).join(' ');
    } else if(stArr.length === 2){
      if (stArr[2]==='Broadway'){
        streetName = 'Broadway'
      }else{
        streetName = arr[i];
      }
    }
    if (streetName in mem){
      mem[streetName].push(parseInt(streetNum));
    } else {
      mem[streetName] = [];
      mem[streetName].push(parseInt(streetNum));
    }
  }
  for (var i in mem){
    var min = Array.min(mem[i]);
    var max = Array.max(mem[i]);
    mem[i]=[min, max]
  }
  console.log(mem);
}

app.service('revGeo', ['$http', '$q', function($http, $q) {
  console.log('revGeo')
  this.mapQuest = function(){
    for (var i=0; i<gridCoord.length; i++){
      return $http({
        url: 'http://www.mapquestapi.com/geocoding/v1/reverse?key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56',
        dataType: 'jsonp',
        method: 'POST',
        contentType:'json',
        data: {location: loc}
      })
      .then(function(data) {
        streets.push(data.results[0].locations[0].street);
      })
    };
  }
}]);

app.controller('streetCtrl', function($scope, $http, revGeo){
  $scope.streetMinMax = function(){

    console.log('strreetMinMax')

    streetSplit(streets);
    console.log('clicked!!');
    $scope.memMinMax=mem;
    $scope.showMinMax = true;
  };

  $scope.fetch = function(){
    
    console.log('fetch')

    revGeo.mapQuest()
    .then(function(data) {
      console.log(data);
      $scope.streetData = data;
    });
  };

  $scope.findCorners = function(){
    
    console.log('findCorners')

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

    neCorner = new google.maps.Marker({
      position: new google.maps.LatLng(Array.max(testLat),Array.max(testLing)),
      title: 'neCorner',
      map: map
    });

    nwCorner = new google.maps.Marker({
      position: new google.maps.LatLng(Array.max(testLat),Array.min(testLing)),
      title: 'nwCorner',
      map: map
    });

    swCorner = new google.maps.Marker({
      position: new google.maps.LatLng(Array.min(testLat),Array.min(testLing)),
      title: 'swCorner',
      map: map
    });
  }


  $scope.gridPoly = function (){

    console.log('gridPoly')

    var height = [];
    var lat = Array.min(testLat);
    while(lat < Array.max(testLat)){
      height.push(lat);
      lat += 0.0003;
    }

    var width = [];
    var lng = Array.min(testLing);
    while(lng < Array.max(testLing)){
      width.push(lng);
      lng += 0.0003;
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
  

  $scope.postLatLng = function(){

    console.log('postLatLng')

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

  $scope.splitMem = function(arr){

    console.log('splitMem')

    mem = {};
    for (var i = 0; i < arr.length; i++){
      var stArr = arr[i].split(' ');
      var streetNum = stArr.slice(0,1);
      if (stArr.length > 2){
        streetName = stArr.slice(1).join(' ');
      } else if(stArr.length === 2){
        if (stArr[2]==='Broadway'){
        streetName = 'Broadway'
      } else {
        streetName = arr[i];
      }
      if (streetName in mem){
        mem[streetName].push(parseInt(streetNum));
      } else {
        mem[streetName] = [];
        mem[streetName].push(parseInt(streetNum));
      }
    }
    for (var i in mem){
      var min = Array.min(mem[i]);
      var max = Array.max(mem[i]);
      mem[i]=[min, max]
    }
    console.log(mem);
    $scope.memMinMax = mem;
    $scope.showMinMax = true;
  }
});

google.maps.event.addDomListener(window, 'load', initialize);
