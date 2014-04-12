var app = angular.module("mapulator", ["leaflet-directive"]);
app.controller("mapctrl", ["$scope", function($scope) {
  Array.max = function( array ){
    return Math.max.apply( Math, array );
  };

  Array.min = function( array ){
    return Math.min.apply( Math, array );
  };
  var tilesDict = {
    toner: {
      name: "Toner",
      url: "http://tile.stamen.com/toner/{z}/{x}/{y}.png",
      options: {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
      }
    },
    terrain: {
      name: "Terrain",
      url: "http://tile.stamen.com/terrain/{z}/{x}/{y}.png",
      options: {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
      }
    },
    opencyclemap: {
      name: "Open Cycle Map",
      url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
      options: {
        attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
      }
    },
    openstreetmap: {
      name: "Open Street Map",
      url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    }
  };

// var mapLayer = MQ.mapLayer();

angular.extend($scope, {
  sf: {
    lat: 37.77070618798191,
    lng: -122.432766746521,
    zoom: 14,
  },
  tiles: tilesDict.toner,
  events: {
    map: {
      enable: ['click', 'drag'],
      logic: 'emit',
    }
  },
  defaults: {
    scrollWheelZoom: false,
    doubleClickZoom: true
  },
  controls: {
    draw: { 
      options: {
        position: "topleft",
        draw:{
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false,
          polygon: {
            shapeOptions: {
              color: 'red'
            },
            allowIntersection: false,
            drawError: {
              color: 'orange',
              timeout: 1000
            }
          }
        }
      }
    }
  }
  // layers: {
  //   baselayers: {
  //     osm: {
  //         name: 'OpenStreetMap',
  //         url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  //         type: 'xyz'
  //       }
  //     }
  //   }
  });

  $scope.changeTiles = function(tiles) {
      $scope.tiles = tilesDict[tiles];
  };

}]);

app.controller("eventcrtl", [ '$scope', "leafletData", function($scope, leafletData) {
  
  $scope.$on('leafletDirectiveMap.click', function(event, args){
    console.log(args.leafletEvent.latlng.toString());
  });

  leafletData.getMap().then(function(map) {
    map.on('draw:created', function (e) {
      var layer = e.layer;
      console.log(JSON.stringify(layer.toGeoJSON()));
      angular.extend($scope, {
            geojson: {
              data: layer.toGeoJSON(),
              style: {
                fillColor: "red",
                weight: 2,
                opacity: 0.7,
                color: 'red',
                dashArray: '3',
                fillOpacity: 0.3
              }
            },
            edit: {
              featureGroup: layer,
              selectedPathOptions: {
                color: '#fe57a1', /* Hot pink all the things! */
                opacity: 0.6,
                dashArray: '10, 10',
                fill: true,
                fillColor: '#fe57a1',
                fillOpacity: 0.1
              }
            }
        });
     });
  });

}]);


// var map;
// var userPoly;
// var path = [];
// var gridCoord = [];
// var streets = [];
// var testLat = [];
// var testLing = [];
// var mem = {};
// var seCorner;
// var neCorner;
// var swCorner;
// var nwCorner;
// var streetName;




// function buildTestArray(){
//   var myArray = userPoly.getPaths().getArray()[0].j;
//   for (var i = 0; i < myArray.length; i++){
//     testLat.push(myArray[i].k);
//     testLing.push(myArray[i].A);
//   }
// }

// function addLatLng(event) {
//   path.push(event.latLng);
//   userPoly.setPaths(path);
// }

// function getCorners(){
//   buildTestArray();
//   var circle ={
//       path: google.maps.SymbolPath.CIRCLE,
//       fillColor: 'red',
//       fillOpacity: .8,
//       scale: 4,
//       strokeColor: 'black',
//       strokeWeight: 2
//   };

//   seCorner = new google.maps.Marker({
//     position: new google.maps.LatLng(Array.min(testLat),Array.max(testLing)),
//     title: 'seCorner',
//     map: map,
//     icon: circle
//   });

//   neCorner = new google.maps.Marker({
//     position: new google.maps.LatLng(Array.max(testLat),Array.max(testLing)),
//     title: 'neCorner',
//     map: map,
//     icon: circle
//   });

//   nwCorner = new google.maps.Marker({
//     position: new google.maps.LatLng(Array.max(testLat),Array.min(testLing)),
//     title: 'nwCorner',
//     map: map,
//     icon: circle
//   });

//   swCorner = new google.maps.Marker({
//     position: new google.maps.LatLng(Array.min(testLat),Array.min(testLing)),
//     title: 'swCorner',
//     map: map,
//     icon: circle
//   });
// }


// function applyGrid(){

//   var height = [];
//   var lat = Array.min(testLat);
//   while(lat < Array.max(testLat)){
//     height.push(lat);
//     lat += 0.0005;
//   }

//   var width = [];
//   var lng = Array.min(testLing);
//   while(lng < Array.max(testLing)){
//     width.push(lng);
//     lng += 0.0005;
//   }

//   for (var h =0; h < height.length; h++){
//     for (var w=0; w< width.length; w++){
//       var coord = new google.maps.LatLng(height[h],width[w]);
//       if (google.maps.geometry.poly.containsLocation(coord, userPoly)){
//         gridCoord.push(height[h].toString() + ',' + width[w].toString());
//       }
//     }
//   }
// }

// function reverseGeo(){
//   var gridLen = gridCoord.length;
//   for (var i=0; i<gridLen; i++){
//     var loc = gridCoord[i];
//     $.ajax({
//         url: 'http://www.mapquestapi.com/geocoding/v1/reverse?key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56',
//         dataType: 'jsonp',
//         type: 'POST',
//         contentType:'json',
//         data: {location: loc},
//         success: function(data) {
//           streets.push(data.results[0].locations[0].street);
//           if ((streets.length%50)===0){streetSplit(streets)};
//           if (streets.length===gridLen){
//             streetSplit(streets);
//             $('#streets').prepend('<h2>COMPLETE</h2>')
//           };
//         }
//       });
//   }
// }

// function streetSplit(arr){
//   mem = {};
//   $('#streets tr').remove();
//   for (var i = 0; i < arr.length; i++){
//     var stArr = arr[i].split(' ');
//     var streetNum = parseFloat(stArr.slice(0,1));
//     if (stArr.length > 2){
//       streetName = stArr.slice(1).join(' ');
//     } else if(stArr.length === 2){
//       if (stArr[1]==='Broadway'){
//         streetName = 'Broadway'
//       }else{
//         streetName = arr[i];
//       }
//     }
//     if (streetNum){
//       if (streetName in mem){
//         mem[streetName].push(streetNum);
//       } else {
//         mem[streetName] = [];
//         mem[streetName].push(streetNum);
//       }
//     }
//   }
//   var keys = [];
//   for (var i in mem){
//     keys.push(i);
//     keys.sort();
//     var min = Array.min(mem[i]);
//     var max = Array.max(mem[i]);
//     mem[i]=[min, max]
//   }
//   var len = keys.length;
//   for (i = 0; i < len; i++){
//     $('#streets table')
//       .append('<tr><td width=130>' + keys[i] + '</td><td><strong> Min: </strong>' + mem[keys[i]][0] + '</td><td><strong> Max: </strong>' + mem[keys[i]][1] + '</td></tr>');
//   }
// }

// function twoFer(){
//   var streets = [];
//   getCorners();
//   applyGrid();
//   reverseGeo();
//   $('.grid').remove();
//   $('ul').append('<li><a href="#" class"applyGrid" onclick="streetSplit(streets);">Show Streets</a></li>');
// }

// function recenter(){
//   var city = document.getElementById('city').value;
//   var state = document.getElementById('state').value;
//   var zip = document.getElementById('zip').value;
//   $.ajax({
//         url: 'http://www.mapquestapi.com/geocoding/v1/address?&key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56&location=' + city + ',' + state + ' ' + zip,
//         dataType: 'jsonp',
//         type: 'POST',
//         contentType:'json',
//         // data: {location: loc},
//         success: function(data) {
//           center = new google.maps.LatLng(data.results[0].locations[0].latLng.lat, data.results[0].locations[0].latLng.lng);
//           initialize();
//         }
//       });
// }

