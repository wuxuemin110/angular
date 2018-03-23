'use strict';

angular.module('myApp.investment', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/investment', {
			templateUrl: 'templates/index/investment.html',
			controller: 'InvestmentCtrl'
		});
	}])
	.controller('InvestmentCtrl', function($scope, InvestmentService, $timeout,userOnlineBankService2) {
		$scope.session1 = '';
		$scope.tidText = '请输入密码';
		$scope.liIndex = 10;
		$scope.currentLi = 2;

		//$scope.showPasword = false;
		//$scope.isNoToken = true;
		//$scope.isToken = false;
		//if (localStorage.session1 != undefined && localStorage.session1 != '' || localStorage.session1 != null) {
		//    $scope.isNoToken = false;
		//    $scope.isToken = true;
		//}
		//$scope.showPassword1 = function () {
		//    $scope.specilPassword = '';
		//    $scope.showPasword = true;
		//    $timeout(function () {
		//        $(".p_input").focus();
		//    }, 100);
		//};
		//
		//$scope.changePassword = function () {
		//    console.log($scope.specilPassword)
		//    switch ($scope.specilPassword) {
		//        case 'Xxd88':
		//            console.log($scope.specilPassword)
		//            $scope.tidText = '密码正确';
		//            $scope.isNoToken = false;
		//            $scope.isToken = true;
		//            $scope.showPasword = false;
		//            localStorage.setItem('session1', '123');
		//            break;
		//        default:
		//            $scope.tidText = '请输入正确密码';
		//    }
		//};
		//$scope.hidePasword = function () {
		//    $scope.showPasword = false;
		//};

		$scope.synPlans = InvestmentService.synMainPlans().then(function() {
			//          $scope.mainPlans = InvestmentService.getMainPlans();
			$scope.selectPage(1, 10);

			//          $scope.synRankingList = InvestmentService.synRankingList().then(function () {
			//              $scope.rankingList = InvestmentService.getRankigList();
			//              
			//          });
		});
		//      $scope.synTotal = InvestmentService.synTotal().then(function () {
		//          $scope.Total = InvestmentService.getTotal();
		//          
		//      });
		$scope.selectPage = function(page, liIndex) {
//      console.log(page, liIndex);
			if(page <= 1) {
				page = 1;
			} else if(page >= $scope.totalPages) {
				page = $scope.totalPages;
			}
			InvestmentService.synBottomPlans(page, liIndex).then(function() {

				$scope.tmpScope = InvestmentService.getBottomPlans();

				$scope.bottomPlans = $scope.tmpScope.bottomPlans;

				$scope.totalPages = $scope.tmpScope.totalPages;
				$scope.pages = $scope.tmpScope.pages;
				$scope.nowPage = $scope.tmpScope.nowPage;
				$scope.isShowDot = $scope.tmpScope.isShowDot;
				$scope.startIndex = (page - 1) * 5 + 1;
				if(!(/msie [6|7|8|9]/i.test(navigator.userAgent))) {
					//WOW.js
					new WOW().init();
				};
			});

		}

		$scope.selectPage(1, 10);
	})

	.factory('InvestmentService', function($http,userOnlineBankService2) {
		var mainPlanList;
		var bottomPlanList;
		var tmpScope = {};
		var rankingList;
		var Total;
		var dataLimit=8;
		return {
			getPlans: function() {
				return plans;
			},
			getMainPlans: function() {
				return mainPlanList;
			},
			getBottomPlans: function() {
				return tmpScope;
			},
			// 同步计划
			synMainPlans: function() {
				return $http.get(HOST_URL + "/plans?order=desc&limit="+dataLimit).success(function(responseData) {
					if(responseData.resultCode == "0") {
						mainPlanList = responseData.resultData;
					}
				}).error(function() {
					// 无响应
				});
			},
			synTotal: function() {
				return $http.get(HOST_URL + "/user/investment/total").success(function(responseData) {
					Total = responseData;
				}).error(function() {
					// 无响应
				});
			},
			getTotal: function() {
				return Total;
			},
			// 同步历史计划
			synBottomPlans: function(page, type) {
				//          	console.log(type);
				//              return $http.get(HOST_URL + "/plans?order=desc&limit=8&page=" + page).success(function (responseData) {
				if(type == 10) {

					var typeData = ""
				} else {
					var typeData = "&type=" + type
				}

				return $http.get(HOST_URL + "/plans?order=desc&limit="+dataLimit+"&page=" + page + typeData).success(function(responseData) {

					if(responseData.resultCode == "0") {
						bottomPlanList = responseData.resultData;
//						console.log(responseData,bottomPlanList[0]);
					}

					tmpScope.bottomPlans = bottomPlanList;
					if(bottomPlanList == "") {
						tmpScope.totalPages = 0
					} else {
						tmpScope.totalPages = Math.ceil(responseData.sumCount/ dataLimit);
					}

					tmpScope.nowPage = page;
					tmpScope.pages = [];
					if(tmpScope.nowPage > 3 && tmpScope.totalPages > 7) {
						if(tmpScope.nowPage + 3 < tmpScope.totalPages) {
							for(var i = 0; i < 7; i++) {
								tmpScope.pages[i] = {};
								tmpScope.pages[i].showNumber = tmpScope.nowPage - 3 + i;
								tmpScope.isShowDot = true;
							}
						} else if(tmpScope.nowPage + 3 >= tmpScope.totalPages) {
							for(var i = 6; i >= 0; i--) {
								tmpScope.pages[6 - i] = {};
								tmpScope.pages[6 - i].showNumber = tmpScope.totalPages - i;
								tmpScope.isShowDot = false;
							}
						}
					} else if(tmpScope.nowPage <= 3 && tmpScope.totalPages > 8) {
						for(var i = 0; i <= 6; i++) {
							tmpScope.pages[i] = {};
							tmpScope.pages[i].showNumber = i + 1;
							tmpScope.isShowDot = true;
						}
					} else {
						for(var i = 0; i < tmpScope.totalPages; i++) {
							tmpScope.pages[i] = {};
							tmpScope.pages[i].showNumber = i + 1;
							tmpScope.isShowDot = false;
						}
					}

				}).error(function() {
					// 无响应
				});
			},
			synRankingList: function() {
				return $http.get(HOST_URL + "/user/investment/rankings").success(function(responseData) {
					rankingList = responseData;
				}).error(function() {

				});
			},
			getRankigList: function() {
				return rankingList;
			}
		}
	});