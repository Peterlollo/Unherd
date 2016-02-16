
// Rename main module and require more as needed
angular.module('bands', ['bands.home','bands.advancedSearch', 'bands.services', 'ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
    //Set up Appropriate routes here
      .when('/home', {
        templateUrl: 'app/home/home.html',
        controller: 'HomeController'
      })
      .when('/advancedSearch', {
        templateUrl: 'app/advancedSearch/advancedSearch.html',
        controller: 'AdvancedSearchController'
      });
      //Require and add $httpProvider interceptor here if needed
  }]);
  //Add authorization checks here if needed