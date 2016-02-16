angular.module('bands.advancedSearch', [])
  .controller('AdvancedSearchController', function($scope, Utils, $http) {

    $scope.checkbox;

    $scope.submitOnEnter = function($event) {
      $('h2.error').remove();
      if($event.which === 13 && !$scope.area) {
        $('form').prepend($('<h2 class="error">Please add a city</h2>'));
      } else if($event.which === 13) {
        return $scope.searchArea();
      }
    };


    $scope.upcomingShows = [];
    $scope.artists = [];
    $scope.artists2 = [];

     $scope.advancedSearch = function(){
      $location.path('/advancedSearch');
     };


    $scope.formatArea = function(area) {
      return area.split(' ').join('%20');
    };

    $scope.bandsInTown = function(artists){
    if(!artists || artists.length === 0) {
      return;
    }
    var count = artists.length;
     artists.forEach(function(artist, i){
      return $.getJSON("http://api.bandsintown.com/artists/mbid_" +artist.mbid + "/events.json?callback=?&app_id=ramesh", function(result) {
        count--;
        $scope.$apply(function(){
            if(!result || result.length === 0) {
              return;
            } else {
              [].forEach.call(result, function(show) {
                  if(show.venue.city) {
                    if(show.venue.city.toLowerCase() === $scope.area.toLowerCase()) {
                      console.log('==============MATCH!');
                      $scope.artists[i].upcoming = 'Upcoming show at '+ show.venue.name + ' on ' + show.datetime + '. \n Get tickets.';
                      $scope.artists[i].tix = show.url;
                    }
                  }
                });
               }
             });
           if(count <= 1 && $scope.checkbox) {
            Utils.stopSpinner();
            $scope.artists.forEach(function(artist, j){
              if(artist.upcoming) {
                $scope.artists2.push(artist);
              }
            });
            $scope.artists = [];
            $scope.artists2.forEach(function(art){
              $scope.artists.push(art);
            });
            $scope.artists2 = [];
           }
        });
      });
    };

$scope.queryStr = 'http://developer.echonest.com/api/v4/artist/search?max_familiarity=';
      $scope.formatQuery = function(){
      if($scope.obscurity && typeof parseInt($scope.obscurity) === 'number') {
        $scope.queryStr+=(parseInt($scope.obscurity)/10).toFixed(2);
      } else {
        $scope.queryStr+='1';
      }
      $scope.queryStr+='&api_key=JDJI14KNR66G2VOKO&format=json&results=50&artist_location='+$scope.area.toLowerCase()+'&bucket=artist_location&bucket=images&bucket=genre&bucket=id:musicbrainz&artist_end_year_after=present';
     };
// 'http://developer.echonest.com/api/v4/artist/search?max_familiarity=1&api_key=JDJI14KNR66G2VOKO&format=json&results=50&artist_location='+$scope.area.toLowerCase()+'&bucket=artist_location&bucket=images&bucket=genre&bucket=id:musicbrainz&artist_end_year_after=present&genre=pop'

// 'http://developer.echonest.com/api/v4/artist/search?max_familiarity=1&api_key=JDJI14KNR66G2VOKO&format=json&results=50&artist_location='+$scope.area.toLowerCase()+'&bucket=artist_location&bucket=images&bucket=genre&bucket=id:musicbrainz&artist_end_year_after=present&genre=funk+rock+rap+rock'
      $scope.searchArea = function() {
        $scope.queryStr = 'http://developer.echonest.com/api/v4/artist/search?max_familiarity=';
         $scope.artists = [];
         Utils.startSpinner();
         $scope.formatQuery();
         return $http({
           method: 'GET',
           url: $scope.queryStr
         }).then(function(res) {
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
             if($scope.genre){
               if(artist.genres.join().indexOf($scope.genre) > -1) {
                console.log('we are unshifting');
                $scope.artists.unshift(artist);
               } else {
                 $scope.artists.push(artist);
               }
              } else {
                $scope.artists.push(artist);
              }
           });
           console.log('RESPONSE from the NEST :', res);
           return $scope.bandsInTown($scope.artists);
         });
       };

       $scope.listAllGenres = function() {
        return $http({
          method: 'GET',
          url: 'http://developer.echonest.com/api/v4/artist/list_genres?api_key=JDJI14KNR66G2VOKO&format=json'
        }).then(function(data){
          console.log('Genre data', data);
        });
       };
  });


///bad bit req: http://api.bandsintown.com/artists/mbid_42e7c020-1fa0-4924-b06e-6091a7a8652…ack=jQuery22006737538515590131_1455647558706&app_id=ramesh&_=1455647558808
//good bit req: