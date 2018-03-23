'use strict';

angular.module('myApp.safeEnsure', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/safeEnsure', {
            templateUrl: 'templates/about/safeEnsure.html',
            controller: 'safeEnsureCtrl'
        });
    }])

    .controller('safeEnsureCtrl', function ($scope, AboutService, InvestmentService, $location) {
           $scope.currentLi = 3;
    })