'use strict';

angular.module('myApp.fundDetails', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/user/fundDetails', {
			templateUrl: 'templates/user/fundDetails.html',
			controller: 'fundDetailsCtrl'
		});
	}])

	.controller('fundDetailsCtrl', function($scope, fundDetailsService, redPackageService, $http, $location, $filter, userOnlineBankService2) {
		$scope.tradeRecord = {};
		$scope.userAccount = {};
		$scope.queryData = {};
		// 检测登录
		$scope.className1 = "ddhover";
		$scope.personaCurrent = 4;
		var userId = sessionStorage.userId;
		var token = sessionStorage.token;
		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/login";
			return 0;
		} else {

		
		// 查询交易资金明细

		$scope.riskData = {
			token: token,
			page: 1,
			limit: 10,
			state: "",
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
			

			return redPackageService.selectPage("/user/" + userId + "/tradeRecords", data).then(function() {
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

	.factory('fundDetailsService', function($http, $mdDialog) {

		return {

		}
	});