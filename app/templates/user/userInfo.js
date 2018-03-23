'use strict';

angular.module('myApp.userInfo', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/user/userInfo', {
            templateUrl: 'templates/user/userInfo.html',
            controller: 'UserInfoCtrl'
        });
    }])

    .controller('UserInfoCtrl', function ($scope, UserInfoService, $location) {
        $scope.userInfo = {};
        // 检测登录
        $scope.className2 = "ddhover";
        var userId = localStorage.userId;
        var token = localStorage.token;
        var role = localStorage.role;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/login";
        } else {
            $scope.userName = localStorage.userName;
            $scope.isInvestor = false;
            var roleNum = Math.floor(role / 100);
            if (roleNum == 1) {
                UserInfoService.synUserInfo(userId, token).then(function () {
                    $scope.userInfo = UserInfoService.getUserInfo();
                    $scope.setDisabled();
                });
            } else {
                $location.path('/user/loans');
            }
        }
        // function
        $scope.update = function () {
            UserInfoService.updateUserInfo(userId, token, $scope.userInfo).then(function () {
                $scope.userInfo = UserInfoService.getUserInfo();
                UserInfoService.alertInfo("修改成功");
                $scope.setDisabled();
            });
        };

        $scope.setDisabled = function () {
            if ($scope.userInfo.realName != "" && $scope.userInfo.realName != undefined && $scope.userInfo.realName != null){
                angular.element("#realName").attr("disabled","disabled");
                
            }
            if ($scope.userInfo.idCard != "" && $scope.userInfo.idCard != undefined){
                angular.element("#idCard").attr("disabled","disabled");
            }
            if ($scope.userInfo.phone != "" && $scope.userInfo.phone != undefined){
                angular.element("#phone").attr("disabled","disabled");
            }
        };
    })

    .factory('UserInfoService', function ($http, $mdDialog) {
        var userInfo;
        var loanList;
        return {
            getUserInfo: function () {
                return userInfo;
            },
            getUserLoans: function () {
                return loanList;
            },
            // 同步用户信息
            synUserInfo: function (userId, token) {
                return $http.get(HOST_URL + "/user/" + userId + "/info?token=" + token).success(function (responseData) {
                    userInfo = responseData;
                }).error(function (responseData) {
                    // 无响应
                });
            },
            synUserLoans: function (userId, token) {
                return $http.get(HOST_URL + "/user/" + userId + "/loans/?token=" + token).success(function (responseData) {
                    loanList = responseData;
                }).error(function (respsonseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('发生错误，错误信息如下：')
                            .textContent(respsonseData.error)
                            .ok('确定')
                    );
                })
            },
            updateUserInfo: function (userId, token, userInfo) {
                return $http.patch(
                    HOST_URL + "/user/" + userId + "/info?token=" + token,
                    userInfo,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                ).success(function (responseData) {
                    userInfo = responseData;
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('发生错误，错误信息如下：')
                            .textContent(responseData.error)
                            .ok('确定')
                    );
                });
            },
            alertError: function (message) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('发生错误，错误信息如下：')
                        .textContent(message)
                        .ok('确定')
                );
            },
            alertInfo: function (message) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(message)
                        .ok('确定')
                );
            }
        }
    });