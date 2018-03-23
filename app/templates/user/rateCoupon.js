'use strict';

angular.module('myApp.rateCoupon', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/user/rateCoupon', {
            templateUrl: 'templates/user/rateCoupon.html',
            controller: 'rateCouponCtrl'
        });
    }])
    .controller('rateCouponCtrl', function ($scope, rateCouponService) {
        var role = sessionStorage.role;
     $scope.redIndex=1;
        $scope.classNameVoucher = "ddhover";
        $scope.personaCurrent=8;
        var userId = sessionStorage.getItem("userId");
        var token = sessionStorage.getItem("token");

        // 判断显示
        $scope.isInvestor = false;
        var roleNum = Math.floor(role / 100);
        if (roleNum == 1) {
            $scope.isInvestor = true;
        }

        $scope.riskData = {
            token: token,
            page: 1,
            limit: 12,
            type: 1
        };

        $scope.mytime = Date.parse(new Date());

        $scope.selectExPage = function (page) {
            return rateCouponService.selectPage("/user/" + userId + "/account/vouchers", "/user/" + userId + "/account/vouchers/total", {
                token: token,
                page: page,
                limit: 12,
                type: 1
            }).then(function () {
                var tmpObject = rateCouponService.getResult();
                $scope.ExitemList = tmpObject.itemList;
                $scope.ExnowPage = tmpObject.nowPage;
                $scope.Expages = tmpObject.pages;
                $scope.ExisShowDot = tmpObject.isShowDot;
                $scope.ExtotalPages = tmpObject.totalPages;
                $scope.ExstartIndex = tmpObject.startIndex;
            });
        };
        $scope.selectAcPage = function (page) {
            return rateCouponService.selectPage("/user/" + userId + "/account/vouchers", "/user/" + userId + "/account/vouchers/total", {
                token: token,
                page: page,
                limit: 12,
                type: 2
            }).then(function () {
                var tmpObject = rateCouponService.getResult();
                $scope.AcitemList = tmpObject.itemList;
                $scope.AcnowPage = tmpObject.nowPage;
                $scope.Acpages = tmpObject.pages;
                $scope.AcisShowDot = tmpObject.isShowDot;
                $scope.ActotalPages = tmpObject.totalPages;
                $scope.AcstartIndex = tmpObject.startIndex;
            });
        };
        $scope.selectPocketPage = function (page) {
            return rateCouponService.selectPage("/user/" + userId + "/account/vouchers", "/user/" + userId + "/account/vouchers/total", {
                token: token,
                page: page,
                limit: 12,
                type: 0
            }).then(function () {
                var tmpObject = rateCouponService.getResult();
                $scope.PkitemList = tmpObject.itemList;
                console.log($scope.PkitemList)
                $scope.PknowPage = tmpObject.nowPage;
                $scope.Pkpages = tmpObject.pages;
                $scope.PkisShowDot = tmpObject.isShowDot;
                $scope.PktotalPages = tmpObject.totalPages;
                $scope.PkstartIndex = tmpObject.startIndex;
            });
        };

        $scope.selectExPage(1).finally(function () {
            $scope.selectAcPage(1).finally(function () {
                $scope.selectPocketPage(1);
            })
        })

    })
    .factory('rateCouponService', function ($http,$mdDialog) {
        var totalCount;
        var tmpObj = {};
        return {
            getResult: function () {
                return tmpObj;
            },
            selectPage: function (url, urlForCount, data) {
                var url_data = "?";

                function isType(obj, type) {
                    return Object.prototype.toString.call(obj) === "[object " + type + "]";
                }

                for (var item in data) {
                    if (isType(data[item], "Object")) {
                        if (item == "keyword") {
                            url_data += "keyword=&";
                        }
                        for (var ite in data[item]) {
                            // 如果是二层数组，key是value，value是key
                            url_data += ite + "=" + data[item][ite] + "&";
                        }
                    } else {
                        url_data += item + "=" + data[item] + "&";
                    }
                }
                var promiseA = $http.get(HOST_URL + urlForCount + url_data).success(function (responseData) {
                    totalCount = responseData.total;
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.error)
                            .ok('确定')
                    );
                });

                return promiseA.then(function () {
                    return $http.get(HOST_URL + url + url_data, data).success(function (responseData) {
                        var items = responseData;
                        var eachPages = data.limit;
                        var totalPage = Math.ceil(totalCount / data.limit);
                        var page = data.page;
                        tmpObj.totalPages = totalPage;
                        tmpObj.itemList = [];
                        if (page <= 1) {
                            page = 1;
                        }

                        if (page >= totalPage) {
                            page = totalPage;
                        }
                        for (var i = 0; i < items.length; i++) {
                            tmpObj.itemList.push(items[i]);
                        }
                        tmpObj.startIndex = (page - 1) * eachPages + 1;
                        tmpObj.nowPage = page;
                        tmpObj.pages = [];
                        if (tmpObj.nowPage > 3 && tmpObj.totalPages > 7) {
                            if (tmpObj.nowPage + 3 < tmpObj.totalPages) {
                                for (var i = 0; i < 7; i++) {
                                    tmpObj.pages[i] = {};
                                    tmpObj.pages[i].showNumber = tmpObj.nowPage - 3 + i;
                                    tmpObj.isShowDot = true;
                                }
                            } else if (tmpObj.nowPage + 3 >= tmpObj.totalPages) {
                                for (var i = 6; i >= 0; i--) {
                                    tmpObj.pages[6 - i] = {};
                                    tmpObj.pages[6 - i].showNumber = tmpObj.totalPages - i;
                                    tmpObj.isShowDot = false;
                                }
                            }
                        } else if (tmpObj.nowPage <= 3 && tmpObj.totalPages > 8) {
                            for (var i = 0; i <= 6; i++) {
                                tmpObj.pages[i] = {};
                                tmpObj.pages[i].showNumber = i + 1;
                                tmpObj.isShowDot = true;
                            }
                        } else {
                            for (var i = 0; i < tmpObj.totalPages; i++) {
                                tmpObj.pages[i] = {};
                                tmpObj.pages[i].showNumber = i + 1;
                                tmpObj.isShowDot = false;
                            }
                        }
                        return tmpObj;
                    }).error(function (responseData) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('提示')
                                .textContent(responseData.error)
                                .ok('确定')
                        );
                    });
                });
            }
        }
    });