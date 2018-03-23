/**
 * Created by Administrator on 2017/11/06.
 */
angular.module('myApp.invitFriend', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/invitFriend', {
            templateUrl: 'templates/appWeb/invitFriend.html',
            controller: 'invitFriend'
        });
    }])
    .controller('invitFriend', function ($scope) {

    });