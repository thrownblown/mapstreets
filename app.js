var app = angular.module("mapulator", ["leaflet-directive"]);
app.controller("mapctrl", ["$scope", function($scope) {
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