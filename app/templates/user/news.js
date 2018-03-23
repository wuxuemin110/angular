'use strict';

angular.module('myApp.news', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/news/:id', {
            templateUrl: 'templates/user/news.html',
            controller: 'NewsCtrl'
        });
    }])
    .controller('NewsCtrl', function ($routeParams,$scope,NewsService) {
//      $scope.Jump = function (page) {
//          location.href = "/about/?page=" + page;
//      }
window.scrollTo(0, 0);
        NewsService.news($routeParams.id).then(function () {
            $scope.News =  NewsService.getNews();
//          console.log($scope.News);
 //           NewsService.updateFrequency(NewsService.getNews()[1].id,NewsService.getNews()[1].hits)
        });
    })
    .factory('NewsService', function ($http,$mdDialog) {
        var news;
        return {
            getNews: function () {
                return news;
            },
            news: function (newsID) {
                return $http.get(HOST_URL + "/news/details/" + newsID).success(function (responseData) {
                	  if(responseData.resultCode="0"){
                    news = responseData.resultData;
                   }
                }).error(function (responseData) {
                  $mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent(responseData['resultMsg'])
					.ok('确定')
				);
                });
            },
            updateFrequency: function (newsID,hits) {
                return $http.get(HOST_URL + "/news/frequency/" + hits+"?id="+newsID);
            }
        }
    });