var app = angular.module("mapulator", ["leaflet-directive"]);
app.controller("mapctrl", ["$scope", function($scope) {
  var tilesDict = {
    toner: {
      name: "Zinester",
      url: "http://tile.stamen.com/toner/{z}/{x}/{y}.png",
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
        DrawOptions: {
          position: "topright",
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
  });

  $scope.changeTiles = function(tiles) {
      $scope.tiles = tilesDict[tiles];
  };

  // var drawnItems = new L.FeatureGroup();
  // map.addLayer(drawnItems);

  // var drawControl = new L.Control.Draw({
  //   position: 'topright',
  //   draw: {
  //     polygon: {
  //       shapeOptions: {
  //         color: 'purple'
  //       },
  //       allowIntersection: false,
  //       drawError: {
  //         color: 'orange',
  //         timeout: 1000
  //       },
  //       showArea: true,
  //       metric: false,
  //       repeatMode: true
  //     },
  //     polyline: {
  //       shapeOptions: {
  //         color: 'red'
  //       },
  //     },
  //     rect: {
  //       shapeOptions: {
  //         color: 'green'
  //       },
  //     },
  //     circle: {
  //       shapeOptions: {
  //         color: 'steelblue'
  //       },
  //     },
  //     marker: {
  //       icon: greenIcon
  //     },
  //   },
  //   edit: {
  //     featureGroup: drawnItems
  //   }
  // });
  // map.addControl(drawControl);

  // map.on('draw:created', function (e) {
  //   var type = e.layerType,
  //     layer = e.layer;

  //   if (type === 'marker') {
  //     layer.bindPopup('A popup!');
  //   }

  //   drawnItems.addLayer(layer);
  // });

}]);

app.controller("eventcrtl", [ '$scope', "leafletData", function($scope, leafletData) {
  
  $scope.$on('leafletDirectiveMap.click', function(event, args){
    console.log(args.leafletEvent.latlng.toString());
  });

  leafletData.getMap().then(function(map) {
    map.on('draw:created', function (e) {
      var layer = e.layer;
      console.log(JSON.stringify(layer.toGeoJSON()));
     });
  });

}]);