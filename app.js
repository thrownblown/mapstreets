var app = angular.module("mapulator", ["leaflet-directive"]);
function mapctrl($scope) {
  var tilesDict = {
    openstreetmap: {
      url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    },
    opencyclemap: {
      url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
      options: {
        attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
        }
      },
      toner: {
        url: "http://tile.stamen.com/toner/{z}/{x}/{y}.png",
        options: {
          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
        }
      }
  };

  angular.extend($scope, {
    sf: {
      lat: 37.78370618798191,
        lng: -122.408766746521,
        zoom: 14,
      },
      tiles: tilesDict.toner
  });

  $scope.changeTiles = function(tiles) {
      $scope.tiles = tilesDict[tiles];
  };
 
  angular.extend($scope, {
      events: {
        map: {
          enable: ['click', 'drag'],
          logic: 'emit',
          defaults: {
            scrollWheelZoom: false,
            doubleClickZoom: true,
            tileLayer: "http://tile.stamen.com/toner/<zoom>/<x>/<y>.png"
          }
        }
      },
    });
};

app.controller("eventcrtl", [ '$scope', function($scope) {
    $scope.$on('leafletDirectiveMap.click', function(event, args){
      console.log(args.leafletEvent.latlng.toString());
    });
}]);
