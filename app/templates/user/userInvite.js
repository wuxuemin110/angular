'use strict';

angular.module('myApp.userInvite', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/user/userInvite', {
			templateUrl: 'templates/user/userInvite.html',
			controller: 'userInviteCtrl'
		});
	}])
	.controller('userInviteCtrl', function($scope, userInviteService, $http, redPackageService, $location, userOnlineBankService2) {
		var role = sessionStorage.role;
		$scope.inviteIndex = 1;
		$scope.recommend = {};
		$scope.classNameVoucher = "ddhover";
		$scope.personaCurrent = 9;
		var userId = sessionStorage.getItem("userId");
		var token = sessionStorage.getItem("token");

		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/login";
			return 0;
		} else {
			$scope.getUserInfo = function() {
				$http.get(
					HOST_URL + "user/" + userId + "/userInfo?token=" + token).success(function(responseData) {
					if(responseData.resultCode == "0") {
						$scope.UserInfo = responseData.resultData;
						
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
			$scope.getUserInfo();
			//获取邀请码
			$scope.recommend = function() {
				$http.get(
					HOST_URL + "/user/account/" + userId + "/recommend/url?token=" + token).success(function(responseData) {
					if(responseData.resultCode == "0") {
						$scope.recommend = responseData.resultData;
					} else {
						userOnlineBankService2.alertInfo(responseData);
					}
					//				console.log(responseData);

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
			$scope.recommend();
			//获取推广记录
			$scope.riskData = {
				token: token,
				page: 1,
				limit: 10,
			};
			$scope.selectPage = function(page) {

				if(page <= 1) {
					page = 1;
				} else if(page >= $scope.totalPages) {
					page = $scope.totalPages;
				}
				$scope.riskData['page'] = page;
				var data = angular.copy($scope.riskData);
				redPackageService.selectPage("/user/" + userId + "/recommend", data).then(function() {
					var tmpObject = redPackageService.getResult();
					//              console.log(tmpObject);
					$scope.itemList = tmpObject.itemList;
					$scope.nowPage = tmpObject.nowPage;
					$scope.sumCount = tmpObject.sumCount;
					$scope.pages = tmpObject.pages;
					$scope.isShowDot = tmpObject.isShowDot;
					$scope.totalPages = tmpObject.totalPages;
					$scope.startIndex = tmpObject.startIndex;
				});
			};
			//获取奖励记录
			$scope.riskData1 = {
				token: token,
				page: 1,
				limit: 10,
			};
			$scope.selectPage1 = function(page) {

				if(page <= 1) {
					page = 1;
				} else if(page >= $scope.totalPages) {
					page = $scope.totalPages;
				}
				$scope.riskData1['page'] = page;
				var data1 = angular.copy($scope.riskData1);
				redPackageService.selectPage("/user/" + userId + "/reward", data1).then(function() {
					var tmpObject = redPackageService.getResult();
					//              console.log(tmpObject);
					$scope.itemList1 = tmpObject.itemList;
					$scope.nowPage1 = tmpObject.nowPage;
					$scope.sumCount1 = tmpObject.sumCount;
					$scope.pages1 = tmpObject.pages;
					$scope.isShowDot1 = tmpObject.isShowDot;
					$scope.totalPages1 = tmpObject.totalPages;
					$scope.startIndex1 = tmpObject.startIndex;
				});
			};
			$scope.selectPage(1);
			$scope.selectPage1(1);
			//     var queryData="";
			//	   var url="/user/recommend?token="+token;
			//	   var url1="/user/reward?token="+token;
			//      $scope.synPaymentPlan = paymentPlansService.synPaymentPlans(url,queryData).then(function() {
			//					$scope.totalPaymentPlan = paymentPlansService.getTotal().totalPaymentPlan;
			//					$scope.paymentplans = paymentPlansService.selectPaymentPlans(1);
			//					$scope.paymentplanPages = paymentPlansService.getPaymentPlanPages();
			////				console.log($scope.totalPaymentPlan, $scope.paymentplans, $scope.paymentplanPages);
			//				});
			//					
			//	 $scope.selectPaymentPlansPages = function(pages) {
			//			if(pages >= $scope.paymentplanPages.length) {
			//				pages = $scope.paymentplanPages.length;
			//			} else if(pages <= 1) {
			//				pages = 1;
			//			}
			//
			//			$scope.paymentplans = paymentPlansService.selectPaymentPlans(pages);
			//			$scope.nowPaymentPlanPage = pages;
			//		
			//		};
			//		$scope.nowPaymentPlanPage = 1;
			//	//获取奖励记录
			//	 $scope.synPaymentPlan = userInviteService.synPaymentPlans(url1).then(function() {
			//					$scope.totalPaymentPlan1 = userInviteService.getTotal().totalPaymentPlan;
			//					$scope.paymentplans1 = userInviteService.selectPaymentPlans1(1);
			//					$scope.paymentplanPages1 = userInviteService.getPaymentPlanPages();
			//				});
			//	
			//	
			//	 $scope.selectPaymentPlansPages1 = function(pages) {
			//			if(pages >= $scope.paymentplanPages1.length) {
			//				pages = $scope.paymentplanPages1.length;
			//			} else if(pages <= 1) {
			//				pages = 1;
			//			}
			//
			//			$scope.paymentplans1 = userInviteService.selectPaymentPlans1(pages);
			//			$scope.nowPaymentPlanPage1 = pages;
			//			console.log($scope.nowPaymentPlanPage1);
			//		};
			//		$scope.nowPaymentPlanPage1 = 1;
			//      $scope.selectExPage(1).finally(function () {
			//          $scope.selectAcPage(1).finally(function () {
			//              $scope.selectPocketPage(1);
			//          })
			//      })
		}
	})
	.factory('userInviteService', function($http, $mdDialog) {
		//     var paymentplans;
		//		var eachPageItems = 10;
		//		
		//		var paymentplanPages;
		//		
		//		var totalPaymentPlan = 0;

		return {
			//			getTotal: function() {
			//				return {
			//					totalPaymentPlan: totalPaymentPlan,
			//				}
			//			},
			//			
			//         synPaymentPlans: function(url) {
			//         	//console.log(url,queryData);
			//				return $http.get(HOST_URL +url
			//				).success(function(responseData) {
			//					paymentplans = responseData.resultData;
			//					totalPaymentPlan = paymentplans.length;
			//					var resultArr = [];
			//
			//					for(var i = 0; i < Math.ceil(paymentplans.length / eachPageItems); i++) {
			//						resultArr[i] = i;
			//					}
			//					paymentplanPages = resultArr;
			//					
			//
			//				}).error(function() {
			//
			//				});
			//			},	
			//			selectPaymentPlans1: function(page) {
			//				var result = [];
			//				var limit;
			//				if(page == paymentplanPages.length || paymentplanPages.length == 0) {
			//					limit = paymentplans.length;
			//					
			//				} else {
			//					limit = page * eachPageItems;
			//				}
			//				for(var i = (page - 1) * eachPageItems; i < limit; i++) {
			//					paymentplans[i].indexId = i + 1;
			//					result.push(paymentplans[i]);
			//				}
			//				return result;
			//				
			//			},
			//			getPaymentPlanPages: function() {
			//				return paymentplanPages;
			//			},
		}
	});