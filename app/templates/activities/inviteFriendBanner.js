/**
 * Created by Administrator on 2017/11/06.
 */
angular.module('myApp.inviteFriendBanner', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/inviteFriendBanner', {
            templateUrl: 'templates/activities/inviteFriendBanner.html',
            controller: 'inviteFriendBanner'
        });
    }])
    .controller('inviteFriendBanner', function ($scope) {

    });