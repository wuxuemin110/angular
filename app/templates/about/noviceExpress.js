  'use strict';

angular.module('myApp.noviceExpress', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/noviceExpress', {
            templateUrl: 'templates/about/noviceExpress.html',
            controller: 'NoviceExpressCtrl'
        });
    }])

    .controller('NoviceExpressCtrl', function (NoviceExpressService) {
    })

    .factory('NoviceExpressService', function ($http) {
        return {}
    });