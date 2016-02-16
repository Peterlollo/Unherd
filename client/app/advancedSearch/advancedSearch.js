angular.module('bands.advancedSearch', [])
  .controller('AdvancedSearchController', function($scope) {
    $scope.submitOnEnter = function($event) {
      $('h2.error').remove();
      if($event.which === 13 && !$scope.area) {
        $('form').prepend($('<h2 class="error">Please add a city</h2>'));
      };
    };


  });