'use strict';

angular.module('myApp.userRecharge', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/user/userRecharge', {
			templateUrl: 'templates/user/userRecharge.html',
			controller: 'UserRechargeCtrl'
		});
	}])

	.controller('UserRechargeCtrl', function($scope, $mdDialog, $mdMedia, UserRechargeService, UserService, $http, $location, userOnlineBankService2) {
		$scope.tradeRecord = {};
		$scope.userAccount = {};
		$scope.role = sessionStorage.role;
		$scope.payMode = 'huichao';
		// 检测登录
		var userId = sessionStorage.userId;
		var token = sessionStorage.token;
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

					if($scope.UserInfo.hasCardId != true) {

						$mdDialog.show(
							$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('提示')
							.textContent("请先实名认证!")
							.ok('确定')
						).finally(function() {
							$location.path('/user/userSafeCenter');
						});
						return;
					}
					if($scope.UserInfo.hasBankCard != true) {

						$mdDialog.show(
							$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('提示')
							.textContent("请先绑定银行卡!")
							.ok('确定')
						).finally(function() {
							$location.path('/user/userBankCard');
						});
						return;

					}
					if($scope.UserInfo.hasTradePassword != true) {

						$mdDialog.show(
							$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('提示')
							.textContent("请先设置交易密码!")
							.ok('确定')
						).finally(function() {
							$location.path('/user/userSafeCenter');
						});
						return;
					}
					//				
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
			// 获取账户信息
			UserService.synUserAccount(userId, token).then(function() {
				$scope.userAccount = UserService.getUserAccount();
			});
		}
		//
		//获取用户信息

		$scope.userRecharge1 = "ddhover";
		$scope.recharge = function() {
			//限制充值金额必须为整数！
			var moneyData = $scope.tradeRecord.money;
			//      	  console.log(moneyData);
			var type = /^[0-9]*[1-9][0-9]*$/;
			var flag = type.test(moneyData);
			//			console.log(flag);
			if(!flag) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('充值金额错误')
					.textContent('充值金额必须为整数！')
					.ok('确定')
				);
				return;
			}
			if(moneyData < 100) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('充值金额错误')
					.textContent('输入金额不能少于100元')
					.ok('确定')
				);
				return;
			}
			if(moneyData > 2000000) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('充值金额错误')
					.textContent('输入金额过大，请重新输入')
					.ok('确定')
				);
				return;
			}
			if($scope.tradeRecord.tradePassword == "" || $scope.tradeRecord.tradePassword == undefined || $scope.tradeRecord.tradePassword == null) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('温馨提示')
					.textContent("支付密码不能为空")
					.ok('确定')
				);
				return;
			}
			//          $scope.payMode = port;
			// if (!$scope.tradeRecord.money || $scope.tradeRecord.money <= 1) {
			//     UserRechargeService.alertInfo("金额不能小于1元");
			//     return;
			// }

			var tradeRecordData = angular.copy($scope.tradeRecord);
			tradeRecordData.money = (tradeRecordData.money) * 100;
			//              tradeRecordData.money = Math.ceil(tradeRecordData.money);
			//              tradeRecordData.money = tradeRecordData.money.toFixed(0); // 计算的时候以分计算
			//          } else {
			//              tradeRecordData.money = tradeRecordData.money.toFixed(2) * 100;
			//          }

			UserRechargeService.synRecharge(userId, token, tradeRecordData).then(function() {
				$scope.payBody = UserRechargeService.getRechargeData();
				if($scope.payBody != undefined &&$scope.payBody!= false){
					angular.element('#huichaoModal').modal('show');
					
				}
				//              console.log($scope.payBody);
				//              if ($scope.payBody.signMsg != undefined && $scope.payBody.signMsg != false) {
				//                  switch ($scope.payMode) {
				//                      case 'huichao':
				//                          angular.element('#huichaoModal').modal('show');
				//                          break;
				//                      case 'shengfutong':
				//                          angular.element('#shengfutongModal').modal('show');
				//                          break;
				//                      default:
				//                          break;
				//                  }

				//              }
			});
		};
		//获取银行卡信息
		$scope.bankInfo = function() {
			$http.get(
				HOST_URL + "user/" + userId + "/account/cards?token=" + token).success(function(responseData) {
				if(responseData.resultCode == "0") {
					$scope.bankInfo = responseData.resultData;
//					console.log($scope.bankInfo);
				} else {
					userOnlineBankService2.alertInfo(responseData);
				}

				if($scope.bankInfo.length > 0) {
					$scope.bankIndex = 3;
				}

				//				
			}).error(function(responseData) {

				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent(responseData.resultMsg)
					.ok('确定')
				);
			});
		};
		$scope.bankInfo();
		$scope.showModal = function() {
			angular.element('#huichaoModal').modal('hide');
			angular.element('#shengfutongModal').modal('hide');
			//          angular.element('#myModal').modal('show');
		};
	})
	.factory('UserRechargeService', function($http, $mdDialog, userOnlineBankService2) {
		var rechargeData;
		return {
			getRechargeData: function() {
				return rechargeData;
			},
			synRecharge: function(userId, token, tradeRecord) {
				tradeRecord.token = token;
				return $http.post(
					//                  HOST_URL + "/user/" + userId + "/account/recharge/" + port + "?from=PC&token=" + token,
					HOST_URL + "/user/" + userId + "/account/recharge/dir",
					$.param(tradeRecord), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).success(function(responseData) {

					if(responseData.resultCode == "0") {
						rechargeData = responseData.resultData;
					} else {
						userOnlineBankService2.alertInfo(responseData);
					}

				}).error(function(responseData) {
					rechargeData = {
						signInfo: false
					};
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent(responseData.resultMsg)
						.ok('确定')
					);
				});
			},
			alertInfo: function(message) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent(message)
					.ok('确定')
				);
			}
		};
	});