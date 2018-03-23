'use strict';

angular.module('myApp.InvestmentRecords', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/user/InvestmentRecords', {
			templateUrl: 'templates/user/InvestmentRecords.html',
			controller: 'InvestmentRecordsCtrl'
		});
	}])

	.controller('InvestmentRecordsCtrl', function($scope, InvestmentRecordsService, redPackageService, $http, $location, $filter, userOnlineBankService2) {
		$scope.tradeRecord = {};
		$scope.userAccount = {};

		$scope.className1 = "ddhover";
		$scope.personaCurrent = 2;
		$scope.idcard = {};
		var userId = sessionStorage.userId;
		var token = sessionStorage.token;
		// 检测登录
		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/login";
			return 0;
		} else {


			// 获取累计资金数据
			$scope.totalData = function() {
				$http.get(
					HOST_URL + "user/" + userId + "/totalData?token=" + token).success(function(responseData) {
					if(responseData.resultCode == "0") {
						$scope.totalData = responseData.resultData;
						//                  console.log($scope.totalData);
					} else {
						userOnlineBankService2.alertInfo(responseData);
					}

				}).error(function(responseData) {

					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent(responseData['resultMsg'])
						.ok('确定')
					);
				});
			}
			$scope.totalData();

			// 查询投资记录
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
				//          console.log(data);
				if(data.startDate == null) {
					data.startDate = "";
				}
				if(data.endDate == null) {
					data.endDate = "";
				}
				data.startDate = $filter('date')(data.startDate, "yyyyMMddHHmmss");
				data.endDate = $filter('date')(data.endDate, "yyyyMMddHHmmss");
				
				return redPackageService.selectPage("/user/" + userId + "/investments", data).then(function() {
					var tmpObject = redPackageService.getResult();

					$scope.itemList = tmpObject.itemList;
					//					             console.log($scope.itemList);
					$scope.nowPage = tmpObject.nowPage;
					$scope.sumCount = tmpObject.sumCount;
					$scope.pages = tmpObject.pages;
					$scope.isShowDot = tmpObject.isShowDot;
					$scope.totalPages = tmpObject.totalPages;
					$scope.startIndex = tmpObject.startIndex;
				});
			};
			$scope.selectPage(1);

			//点击下载协议
			$scope.downloadProtocol = function(planId) {
				window.open(HOST_URL + "user/" + userId + "/investment/" + planId + "/pdf?token=" + token);
			}
			
		}
	})

	.factory('InvestmentRecordsService', function($http, $mdDialog) {

		return {

		}
	});