'use strict';

angular.module('myApp.userWithdraw', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/user/userWithdraw', {
			templateUrl: 'templates/user/userWithdraw.html',
			controller: 'UserWithdrawCtrl'
		});
	}])

	.controller('UserWithdrawCtrl', function($scope, UserService, UserWithdrawService, $timeout, $interval, $mdDialog, $http, $location, userOnlineBankService2) {
		$scope.tradeRecord = {};
		$scope.userAccount = {};
		$scope.userCard = {};
		$scope.UserInfo = {};
		$scope.withdrawCount = {};
		$scope.sendBtnText = '发送短信';
		$scope.DisableSendBtn = false;
		$scope.cd = 60;
		// 检测登录
		var userId = sessionStorage.userId;
		var token = sessionStorage.token;
		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/login";
			return 0;
		} else {
			//获取用户信息
			$scope.getUserInfo = function() {
				$http.get(
					HOST_URL + "user/" + userId + "/userInfo?token=" + token).success(function(responseData) {
					if(responseData.resultCode == "0") {
						$scope.UserInfo = responseData.resultData;
					} else {
						userOnlineBankService2.alertInfo(responseData);
					}

					
					if($scope.UserInfo.hasCardId != true) {
						$scope.showRealname = 2;
						
					}
					if($scope.UserInfo.hasTradePassword != true) {
						$scope.showfrom = 2;
						
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
			$scope.getUserInfo();
			//提现免费次数
			$scope.withdrawCount = function() {
				$http.get(
					HOST_URL + "user/account/" + userId + "/withdraw/count?token=" + token).success(function(responseData) {
					if(responseData.resultCode == "0") {
						
						$scope.withdrawCount = responseData.resultData;
					} else {
						userOnlineBankService2.alertInfo(responseData);
					}


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
			$scope.withdrawCount();
			// 获取账户信息
			UserService.synUserAccount(userId, token).then(function() {
				$scope.userAccount = UserService.getUserAccount();
			});
			// 获取银行卡信息
			UserWithdrawService.synUserCard(userId, token).then(function() {
				$scope.userCard = UserWithdrawService.getUserCard();
				//              console.log($scope.userCard);
			});
		}
//		console.log($scope.tradeRecord.money);
		//
		//$scope.tradeRecord.money = 100;
		//$scope.tradeRecord.cost = 0;
		$scope.userRecharge1 = "ddhover";

		// function
		$scope.withdraw = function() {
			var tradeRecordData = {};
			//          console.log($scope.userAccount);
			if($scope.userAccount.money < $scope.tradeRecord.money) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("提现金额大于账户余额")
					.ok('确定')
				);
				return;
			}
			if($scope.tradeRecord.money < 100) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("提现金额不能小于100")
					.ok('确定')
				);
				return;
			}
			var moneyData = $scope.tradeRecord.money;
			//      	  console.log(moneyData);
			//限制最多只能输入2位小数
			var type = /^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/;
			var flag = type.test(moneyData);
			//			console.log(flag);
			if(!flag) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('金额错误')
					.textContent('最多只能输入2位小数')
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
			tradeRecordData.money = $scope.tradeRecord.money;
			//tradeRecordData.bankCard = $scope.userCard[0]['cardNumber'];
			tradeRecordData.tradePassword = $scope.tradeRecord.tradePassword;
			UserWithdrawService.withdraw(userId, token, tradeRecordData);
		};
		// 提现手机验证码
		//      $scope.sendSms = function () {
		//          $scope.DisableSendBtn = true;
		//          $http.get(
		//              HOST_URL + "/sms/withdraw?token=" + sessionStorage.getItem('token') + "&money=" + (parseInt(parseFloat($scope.tradeRecord.money).toFixed(2) * 100))
		//          ).success(function () {
		//              $scope.sendBtnText = '发送成功';
		//              $timeout(function () {
		//                  $scope.sendBtnText = '倒计时' + $scope.cd + '秒';
		//              }, 3000).then(function () {
		//                  var timer = $interval(function () {
		//                      if ($scope.cd > 0) {
		//                          --$scope.cd;
		//                          $scope.sendBtnText = '倒计时' + $scope.cd + '秒';
		//                      } else {
		//                          $scope.DisableSendBtn = false;
		//                          $interval.cancel(timer);
		//                          $scope.cd = 60;
		//                          $scope.sendBtnText = '重新发送';
		//                      }
		//                  }, 1000);
		//              });
		//          }).error(function (responseData) {
		//              $mdDialog.show(
		//                  $mdDialog.alert()
		//                      .clickOutsideToClose(true)
		//                      .textContent(responseData.error)
		//                      .ok('确定')
		//              ).finally(function () {
		//                  $scope.DisableSendBtn = false;
		//                  $scope.sendBtnText = '再试一次';
		//              });
		//          });
		//      };
	})

	.factory('UserWithdrawService', function($http, $mdDialog, $location, userOnlineBankService2) {
		var userInfo;
		var userCard;
		return {
			getUserInfo: function() {
				return userInfo;
			},
			getUserCard: function() {
				return userCard;
			},
			// 同步用户信息
			synUserInfo: function(userId, token) {
				return $http.get(HOST_URL + "/user/" + userId + "/info?token=" + token).success(function(responseData) {
					userInfo = responseData.userInfo;
				}).error(function(responseData) {
					// 无响应
				});
			},
			synUserCard: function(userId, token) {
				return $http.get(HOST_URL + "/user/" + userId + "/account/cards?token=" + token).success(function(responseData) {
					if(responseData.resultCode == "0") {
						userCard = responseData.resultData;
					} else {
						userOnlineBankService2.alertInfo(responseData);
					}
				}).error(function(responseData) {
					//					if(responseData.resultMsg = '无用户银行卡信息') {
					//						$mdDialog.show(
					//							$mdDialog.alert()
					//							.clickOutsideToClose(true)
					//							.title('提示')
					//							.textContent('您尚未填写银行卡,请先填写银行卡!')
					//							.ok('确定')
					//						).finally(function() {
					//							$location.path('/user/userBankCard');
					//						});
					//					} else {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent(responseData.resultMsg)
						.ok('确定')
					);
					//					}

				});
			},
			withdraw: function(userId, token, tradeRecord) {
				if(tradeRecord.money < 2) {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent("提现金额不能少于2元")
						.ok('确定')
					);
					return;
				}
				tradeRecord.money = parseInt(parseFloat(tradeRecord.money).toFixed(2) * 100);
				tradeRecord.token = token;
				//            console.log(tradeRecord);
				return $http.post(
					HOST_URL + "/user/account/" + userId + "/withdraw",
					$.param(tradeRecord), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
					//               HOST_URL + "/user/account/withdraw?token=" + token+"&money="+tradeRecord.money+"&tradePassword="+tradeRecord.tradePassword
				).success(function(responseData) {
					if(responseData.resultCode == "0") {
						$mdDialog.show(
							$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('提示')
							.textContent('提现申请已提交，系统将尽快为您处理')
							.ok('确定')
						).finally(function() {
							$location.path('/user/fundDetails');
						});
					} else {
						userOnlineBankService2.alertInfo(responseData);
					}
				}).error(function(responseData) {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent(responseData.resultMsg)
						.ok('确定')
					);
				});
			}
		};
	});