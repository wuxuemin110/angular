'use strict';

angular.module('myApp.userTradeRecords', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/user/userTradeRecords', {
            templateUrl: 'templates/user/userTradeRecords.html',
            controller: 'UserTradeRecordsCtrl'
        });
    }])

    .controller('UserTradeRecordsCtrl', function ($scope, UserTradeRecordsService, IndexService) {
        $scope.tradeRecord = {};
        $scope.userAccount = {};
        // 检测登录
        $scope.className1 = "ddhover";
         $scope.personaCurrent=2;
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/login";
            return 0;
        }
        // 获取交易流水
        UserTradeRecordsService.synTradeRecords(userId, token).success(function () {
            $scope.tradeRecords = UserTradeRecordsService.getTradeRecords();
            $scope.selectPage(1, $scope.tradeRecords);
        });
        $scope.selectPage = function (page) {
            var tmpObject = IndexService.selectPages(page, $scope.tradeRecords);
            $scope.itemList = tmpObject.itemList;
            $scope.nowPage = tmpObject.nowPage;
            $scope.pages = tmpObject.pages;
            $scope.isShowDot = tmpObject.isShowDot;
            $scope.totalPages = tmpObject.totalPages;
            $scope.startIndex = tmpObject.startIndex;
        }
    })

    .factory('UserTradeRecordsService', function ($http, $mdDialog) {
        var count = 5;
        var tradeRecords;
        return {
            getTradeRecords: function () {
                return tradeRecords;
            },
            getPages: function () {
                var items = [];
                var pages = tradeRecords.length / count;
                var ends = tradeRecords.length % count;
                if (ends != 0) {
                    pages++;
                }
                for (var i = 0; i < parseInt(pages); i++) {
                    items[i] = i;
                }
                return items;
            },
            // 同步 TradeRecords
            synTradeRecords: function (userId, token) {
                return $http.get(HOST_URL + "/user/" + userId + "/tradeRecords?token=" + token).success(function (responseData) {
                    tradeRecords = responseData;
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(message)
                            .ok('确定')
                    );
                });
            }
        }
    });