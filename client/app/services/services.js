//Be sure to rename all angular modules, rename file structure, and reference the proper directories & files in the index.hmtl page
angular.module('bands.services', [])
  .factory('Utils', function($location) {

    var startSpinner = function() {
      $('h2').append('<div class="row text-center spinner"><img src="assets/spiffygif_46x46.gif"></div>');
    };

    var stopSpinner = function(){
      $('.spinner').remove();
    };

    var routeIndex = function () {
      $location.path('/home');
    };

    return {
      startSpinner: startSpinner,
      stopSpinner: stopSpinner,
      routeIndex: routeIndex
    };
  });