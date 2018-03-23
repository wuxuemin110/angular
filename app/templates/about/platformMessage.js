'use strict';

angular.module('myApp.platformMessage', ['ngRoute', "highcharts-ng"])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/platformMessage', {
            templateUrl: 'templates/about/platformMessage.html',
            controller: 'platformMessageCtrl'
        });
    }])

    .controller('platformMessageCtrl', function ($scope, AboutService, platformMessageService, $location) {
        $scope.liIndex = 1;
        var urlPath = $location.search();
        if (urlPath.hasOwnProperty('page')) {
            $scope.liIndex = parseInt(urlPath.page);
        }
//      $scope.synTotal = InvestmentService.synTotal().then(function () {
//
//          $scope.Total = InvestmentService.getTotal();
//      });
//      $scope.synRankingList = InvestmentService.synRankingList().then(function () {
//          $scope.rankingList = InvestmentService.getRankigList();
//      });
        $scope.riskData = {
            page: 1,
            limit: 10
        };
        //平台公告
        $scope.selectPage= function (page) {
            $scope.riskData['page'] = page;
            var data = angular.copy($scope.riskData);
            platformMessageService.selectPage1("/notice/list", data).then(function () {
                var tmpObject = platformMessageService.getResult();
               
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };
        //媒体资讯
        $scope.selectPage1 = function (page) {
            $scope.riskData['page'] = page;
            var data = angular.copy($scope.riskData);
            platformMessageService.selectPage1("/news/list", data).then(function () {
                var tmpObject1 = platformMessageService.getResult();
//               console.log(tmpObject1);
                $scope.itemList1 = tmpObject1.itemList;
                $scope.nowPage1 = tmpObject1.nowPage;
                $scope.pages1 = tmpObject1.pages;
                $scope.isShowDot1 = tmpObject1.isShowDot;
                $scope.totalPages1 = tmpObject1.totalPages;
                $scope.startIndex1 = tmpObject1.startIndex;
            });
        };
        if($scope.liIndex==2){
        	$scope.selectPage1(1);
        }
        $scope.selectPage(1);
        
    })
    .factory('platformMessageService', function ($http) {
        var totalCount;
        var tmpObj = {};
        return {
            selectPage1: function (url, data) {
            	
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

//              var promiseA = $http.get(HOST_URL + urlForCount + url_data).success(function (responseData) {
// //            	console.log(urlForCount, url_data);
// if(responseData.resultCode="0"){
//                  totalCount = responseData.resultData.total;
//                 }
//              });

 //               return promiseA.then(function () {
                    return $http.get(HOST_URL + url + url_data, data).success(function (responseData) {
                         if(responseData.resultCode="0"){
                        var items = responseData.resultData;
                        }
//                       console.log(responseData);
                        var eachPages = data.limit;
                        var totalPage = Math.ceil(responseData.sumCount / data.limit);
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
					.textContent(responseData['resultMsg'])
					.ok('确定')
				);
                });
//                });
            },
            getResult: function () {
                return tmpObj;
            }
        }
    });