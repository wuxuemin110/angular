'use strict';

angular.module('myApp.about', ['ngRoute', "highcharts-ng"])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/about', {
            templateUrl: 'templates/about/about.html',
            controller: 'AboutCtrl'
        });
    }])

    .controller('AboutCtrl', function ($scope, AboutService, InvestmentService, $location) {
    	$scope.currentLi=4
        $scope.liIndex = 1;
        var urlPath = $location.search();
        if (urlPath.hasOwnProperty('page')) {
            $scope.liIndex = parseInt(urlPath.page);
        }
        $scope.synTotal = InvestmentService.synTotal().then(function () {

            $scope.Total = InvestmentService.getTotal();
        });
//      $scope.synRankingList = InvestmentService.synRankingList().then(function () {
//          $scope.rankingList = InvestmentService.getRankigList();
//      });
        $scope.riskData = {
            page: 1,
            limit: 4
        };
        $scope.selectPage1 = function (page) {
            $scope.riskData['page'] = page;
            var data = angular.copy($scope.riskData);
            AboutService.selectPage1("/news/list", "/news/total", data).then(function () {
                var tmpObject = AboutService.getResult();
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };
        $scope.selectPage1(1);

        $scope.chart = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: '借款类型分布图'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    showInLegend: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'percent',
                data: [
                    ['创业：8543', 8543.00],
                    ['培训：4417', 4417.00],
                    ['进修：3490', 3490.00],
                    ['缴费：1687', 1687.00],
                    ['周转：4097', 4097.00],
                    ['购物：2553', 2553.00],
                    ['旅游：1107', 1107.00],
                    ['零花：848', 848.00],
                    ['其他：1519', 1519.00]
                ]
            }]
        };
    })
    .factory('AboutService', function ($http) {
        var totalCount;
        var tmpObj = {};
        return {
            selectPage1: function (url, urlForCount, data) {
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
                            url_data += data[item][ite] + "=" + ite + "&";
                        }
                    } else {
                        url_data += item + "=" + data[item] + "&";
                    }
                }
                var promiseA = $http.get(HOST_URL + urlForCount + url_data).success(function (responseData) {
                    totalCount = responseData.total;
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
                    });
                });
            },
            getResult: function () {
                return tmpObj;
            }
        }
    });