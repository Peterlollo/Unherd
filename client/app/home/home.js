angular.module('bands.home', [])
  .controller('HomeController', function($scope, $location, $http){

   var init = function() {console.log('home controller up and going');};
   
   init();

   // $scope.spotify = function(artist) {
   //   return $http({
   //    method: 'GET'
   //    url: 
   //   });
   // }



   var advancedSearchForm = $('');

   $scope.advancedSearch = function(){
    $location.path('/advancedSearch');
   };

   $scope.submitOnEnter = function($event) {
    var keyCode = $event.which || $event.keyCode;
    if( keyCode === 13 ) return $scope.searchArea();
   };

   $scope.formatArea = function(area) {
    return area.split(' ').join('%20');
   };

   $scope.upcomingShows = [];

   $scope.bandsInTown = function(artist){
    $.getJSON("http://api.bandsintown.com/artists/" +artist + "/events.json?callback=?&app_id=ramesh", function(result) {
      if(!result) { 
        return false; 
      }
      result.forEach(function(show) {
          if(show.venue.city) {
            if(show.venue.city.toLowerCase() === $scope.area.toLowerCase()) {
              console.log('I can not believe we got a match!', show.venue.city);
              var nextShow = {};
              nextShow.venue = show.venue.name;
              nextShow.date = show.datetime;
              nextShow.tickets = show.url;
              $scope.upcomingShows.push(nextShow);
              return true;
            }
          }

      });
    });
   };

   $scope.artists = [];


   $scope.searchArea = function() {
    return  $http({
      method: 'GET',
      url: 'http://developer.echonest.com/api/v4/artist/search?max_familiarity=1&api_key=JDJI14KNR66G2VOKO&format=json&results=50&artist_location='+$scope.area.toLowerCase()+'&bucket=artist_location&bucket=images&bucket=genre&artist_end_year_after=present'
    }).then(function(res) {
      var artistArray = res.data.response.artists;
      artistArray.forEach(function(band){
        var artist = {};
        artist.name = band.name;
        if($scope.bandsInTown($scope.formatArea(artist.name))){
          artist.upcoming = $scope.upcomingShows;
          $scope.upcomingShows = [];
        }
        artist.genres = [];
        band.genres.forEach(function(genreObj) {
          artist.genres.push(genreObj.name);
        });
        for(var i = 0; i< band.images.length; i++) {
          if(band.images[i].url.indexOf('wiki') > -1){
            artist.image = band.images[i];
            break;
          }
        }
        if(!artist.image) {
          artist.image = {url: '../../assets/guitar.jpg'};
        }
        $scope.artists.push(artist);
      });
      console.log('RESPONSE from the NEST :', res);
    });
  };

  //scroll spy?
// $('section').scrollspy({ target: '#navbar-example' })

// $('[data-spy="scroll"]').each(function () {
//   var $spy = $(this).scrollspy('refresh')
// });



  });