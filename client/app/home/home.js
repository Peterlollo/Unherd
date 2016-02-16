angular.module('bands.home', [])
  .controller('HomeController', function($scope, $location, $http, $q, Utils){

    $scope.upcomingShows = [];
    $scope.artists = [];

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

    $scope.bandsInTown = function(artists){
    if(!artists || artists.length === 0) {
      return;
    }
    
     artists.forEach(function(artist, i){
      return $.getJSON("http://api.bandsintown.com/artists/mbid_" +artist.mbid + "/events.json?callback=?&app_id=ramesh", function(result) {
        $scope.$apply(function(){
            if(!result || result.length === 0) {
              return false;
            } else {
             //don't forget about this funky CALL
              [].forEach.call(result, function(show) {
                  if(show.venue.city) {
                    if(show.venue.city.toLowerCase() === $scope.area.toLowerCase()) {
                      // console.log('I can not believe we got a match!',$scope.artists[i]);
                      $scope.artists[i].upcoming = 'Upcoming show at '+ show.venue.name + ' on ' + show.datetime + '. \n Get tickets.';
                      $scope.artists[i].tix = show.url;
                    }
                  }
                });
               }
             });
          });
        });
     };


      $scope.searchArea = function() {
         $scope.artists = [];
         Utils.startSpinner();
         return $http({
           method: 'GET',
           url: 'http://developer.echonest.com/api/v4/artist/search?max_familiarity=1&api_key=JDJI14KNR66G2VOKO&format=json&results=50&artist_location='+$scope.area.toLowerCase()+'&bucket=artist_location&bucket=images&bucket=genre&bucket=id:musicbrainz&artist_end_year_after=present'
         }).then(function(res) {
           Utils.stopSpinner();
           var artistArray = res.data.response.artists;
           artistArray.forEach(function(band){
             var artist = {};
             artist.name = band.name;
             artist.mbid = band.foreign_ids[0].foreign_id.slice(19);
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
           return $scope.bandsInTown($scope.artists);
           
         });
       };

  //scroll spy?
// $('section').scrollspy({ target: '#navbar-example' })

// $('[data-spy="scroll"]').each(function () {
//   var $spy = $(this).scrollspy('refresh')
// });



  });