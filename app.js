var app = angular.module('mapapp', ['leaflet-directive']);

app.controller('mapctrl', [ '$scope', function($scope) {

  // $scope.center = {
  //   lat: 37.78370618798191,
  //   lng: -122.408766746521,
  //   zoom: 4
  // };
  // $scope.defaults.scrollWheelZoom = false;
  angular.extend($scope, {
    sf: {
      lat: 37.78370618798191,
      lng: -122.408766746521,
      zoom: 14,
      tiles: tilesDict.opencyclemap,
        defaults: {
            scrollWheelZoom: false
        }
      }
    });

    $scope.changeTiles = function(tiles) {
        $scope.tiles = tilesDict[tiles];
    };


// To handle events, first define an events object on your scope...

angular.extend($scope, {
    events: {
      map: {
        enable: ['click', 'drag', 'blur', 'touchstart'],
        logic: 'emit',
        defaults: {
          scrollWheelZoom: false,
          doubleClickZoom: true,
          tileLayer: "http://tile.stamen.com/toner/<zoom>/<x>/<y>.png"
        }
      }
    },
  });

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
    tiles: tilesDict.opencyclemap,
    defaults: {
            scrollWheelZoom: false
        }
    });
    // toner: {
    //   url: "http://tile.stamen.com/toner/<zoom>/<x>/<y>.png",
    //   options: {
    //     attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'    
    //   }
    // }
// // replace "toner" here with "terrain" or "watercolor"
// var layer = new L.StamenTileLayer("toner");
// var map = new L.Map("element_id", {
//     center: new L.LatLng(37.7, -122.4),
//     zoom: 12
// });
// map.addLayer(layer);

//var map = L.mapbox.map('map');
// var featureGroup = L.featureGroup().addTo(map);
// var drawControl = new L.Control.Draw({
//     edit: {
//       featureGroup: featureGroup
//     }
//   }).addTo(map);
// and add it to your leaflet element.

// Then, you can access latitude and longitude inside the args parameter of the click handler:

// 
    


  window.directionsService = new google.maps.DirectionsService();
  var public_spreadsheet_url = '0AhFZfsMCVP7rdGJOVm04LWRsanlIS1ZST3FpcllIdHc';
  Tabletop.init( { key: public_spreadsheet_url, callback: showInfo} );

}]);


app.controller("eventcrtl", [ '$scope', function($scope) {
    // $scope.$on('leafletDirectiveMap.click', function(event){
    //   console.log(event);
    // });
  // $scope.$on('draw:created', function(e) {
  //     featureGroup.addLayer(e.layer);
  // });

    $scope.$on('leafletDirectiveMap.click', function(event, args){
      console.log(args.leafletEvent.latlng);
    });
}]);

function showInfo(data, tabletop) {
  console.log('fuck you kill all cops');
  window.entries = data['DeliveryData']['elements'];
  window.entries = window.entries.sort(function(a, b){
    if (Date.parse(a.completed) > Date.parse(b.completed)) {
      return 1;
    } else if (Date.parse(a.completed) < Date.parse(b.completed)) {
      return -1;
    } else {
      return 0;
    }
  });
}

window.getJobsByZone = function(zone){
  var arrReturn = [];
  for (var i = 0; i < entries.length; i++){
    if (entries[i].merchcluster === zone){
      arrReturn.push(entries[i]);
    }
  }
  return arrReturn;
};

window.getJobsByObjProp = function(objKey, objVal){
  var arrReturn = [];
  for (var i = 0; i < entries.length; i++){
    if (entries[i][objKey] === objVal){
      arrReturn.push(entries[i]);
    }
  }
  return arrReturn;
};

var routeSet = function(routeArray){

  for (var i =0; i < routeArray.length; i++){
    var dir = MQ.routing.directions();
    dir.route({
      locations: [routeArray.pickloc, routeArray.delloc]
    });
    map.addLayer(MQ.routing.routeLayer({
        directions: dir,
        fitBounds: true
    }));
  }


}

