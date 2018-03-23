'use strict';

angular.module('myApp.help', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/help', {
            templateUrl: 'templates/about/help.html',
            controller: 'HelpCtrl'
        });
    }])

    .controller('HelpCtrl', function ($scope,HelpService,platformMessageService) {
        var token = sessionStorage.token;
    	$scope.liIndex=1;
    	
    	$scope.leftProblem1=1;
    	$scope.leftProblem2=1;
    	$scope.leftProblem3=1;
    	
    	 $scope.riskData = {
            page: 1,
            limit: 10,
             // token:token
        };
        //平台公告
        $scope.selectPage= function (page) {
            $scope.riskData['page'] = page;
            var data = angular.copy($scope.riskData);
            // console.log(data);
            // platformMessageService.selectPage1("help/list", data).then(function () {
            platformMessageService.selectPage1("help/list", data).then(function () {
                var tmpObject = platformMessageService.getResult();
                $scope.leftProblem1=1;
                $scope.itemList = tmpObject.itemList;
                for(var i=0; i<$scope.itemList.length; i++){
						$scope.itemList[i].number=i+1;
					}	
//              $scope.nowPage = tmpObject.nowPage;
//              $scope.pages = tmpObject.pages;
//              $scope.isShowDot = tmpObject.isShowDot;
//              $scope.totalPages = tmpObject.totalPages;
//              $scope.startIndex = tmpObject.startIndex;
            });
        };
          $scope.selectPage(1);
       $scope.leftProblem1Fun=function(x){
        $scope.leftProblem1=x.number;
        	
        }
          
    })

    .factory('HelpService', function ($http) {
        return {}
    });