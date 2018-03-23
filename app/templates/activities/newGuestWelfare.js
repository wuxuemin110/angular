/**
 * Created by Administrator on 2017/11/06.
 */
angular.module('myApp.newGuestWelfare', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/newGuestWelfare', {
            templateUrl: 'templates/activities/newGuestWelfare.html',
            controller: 'newGuestWelfare'
        });
    }])
    .controller('newGuestWelfare', function ($scope) {

    });