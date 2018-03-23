'use strict';

angular.module('myApp.paymentPlans', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/user/paymentPlans', {
			templateUrl: 'templates/user/paymentPlans.html',
			controller: 'paymentPlansCtrl'
		});
	}])

	.controller('paymentPlansCtrl', function($scope, paymentPlansService, $http, redPackageService, $location, $filter,userOnlineBankService2) {
		$scope.tradeRecord = {};
		$scope.userAccount = {};
		// 检测登录
		$scope.className1 = "ddhover";
		$scope.personaCurrent = 3;
		$scope.queryData = {};
		var userId = sessionStorage.userId;
		var token = sessionStorage.token;
		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/login";
			return 0;
		}
		else{
			
		

		//查询回款计划      
		$scope.riskData = {
			token: token,
			page: 1,
			limit: 10,
			status: "",
			startDate: "",
			endDate: ""
		};

		

		$scope.selectPage = function(page) {
			if(page <= 1) {
				page = 1;
			} else if(page >= $scope.totalPages) {
				page = $scope.totalPages;
			}
			$scope.riskData['page'] = page;
			var data = angular.copy($scope.riskData);
			if(data.startDate == null) {
				data.startDate = "";
			}
			if(data.endDate == null) {
				data.endDate = "";
			}
			data.startDate = $filter('date')(data.startDate, "yyyyMMddHHmmss");
			data.endDate = $filter('date')(data.endDate, "yyyyMMddHHmmss");

			return redPackageService.selectPage("/user/" + userId + "/repays", data).then(function() {
				var tmpObject = redPackageService.getResult();
				$scope.itemList = tmpObject.itemList;
				$scope.nowPage = tmpObject.nowPage;
				$scope.sumCount = tmpObject.sumCount;
				$scope.pages = tmpObject.pages;
				$scope.isShowDot = tmpObject.isShowDot;
				$scope.totalPages = tmpObject.totalPages;
				$scope.startIndex = tmpObject.startIndex;
			});
		};
		$scope.selectPage(1);
		}
	})

	.factory('paymentPlansService', function($http, $mdDialog) {

		var paymentplans;
		var eachPageItems = 10;

		var paymentplanPages;

		var totalPaymentPlan = 0;

		return {
			getTotal: function() {
				return {
					totalPaymentPlan: totalPaymentPlan,
				}
			},

			synPaymentPlans: function(url, queryData) {
			
				return $http.get(HOST_URL + url + queryData).success(function(responseData) {
					paymentplans = responseData.resultData;
					totalPaymentPlan = paymentplans.length;
					var resultArr = [];

					for(var i = 0; i < Math.ceil(paymentplans.length / eachPageItems); i++) {
						resultArr[i] = i;
					}
					paymentplanPages = resultArr;
//					console.log(paymentplanPages);

				}).error(function() {

				});
			},
			selectPaymentPlans: function(page) {
				var result = [];
				var limit;
				if(page == paymentplanPages.length || paymentplanPages.length == 0) {
					limit = paymentplans.length;
				} else {
					limit = page * eachPageItems;
				}
				for(var i = (page - 1) * eachPageItems; i < limit; i++) {
					paymentplans[i].indexId = i + 1;
					result.push(paymentplans[i]);
				}
				return result;
//				console.log(result, limit);
			},
			getPaymentPlanPages: function() {
				return paymentplanPages;
			},
		}
	});