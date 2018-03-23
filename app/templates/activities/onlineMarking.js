/**
 * Created by Administrator on 2017/11/06.
 */
angular.module('myApp.onlineMarking', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/onlineMarking', {
            templateUrl: 'templates/activities/onlineMarking.html',
            controller: 'onlineMarking'
        });
    }])
    .controller('onlineMarking', function ($scope) {

    });