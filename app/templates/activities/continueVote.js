/**
 * Created by Administrator on 2017/11/06.
 */
angular.module('myApp.continueVote', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/continueVote', {
            templateUrl: 'templates/activities/continueVote.html',
            controller: 'continueVote'
        });
    }])
    .controller('continueVote', function ($scope) {

    });