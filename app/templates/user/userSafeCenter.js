'use strict';

angular.module('myApp.userSafeCenter', ['ngRoute', 'ngMaterial'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/user/userSafeCenter', {
			templateUrl: 'templates/user/userSafeCenter.html',
			controller: 'userSafeCenterCtrl'
		});
	}])

	.controller('userSafeCenterCtrl', function($location, $scope, $mdDialog, UserService, userSafeCenterService, $http, userOnlineBankService2) {

		$scope.password = {};
		$scope.UserInfo = {};
		$scope.idcard = {};
		$scope.userCard = {};
		$scope.tradePassword = {};
		$scope.personaCurrent = 5;
		$scope.showfrom = 1;
		$scope.showPassword = 1;
		$scope.showRealname = 1;
		$scope.userCard = {};
		$scope.cityData;
		$scope.banks = [{
				id: "0801020000",
				label: '中国工商银行'
			},
			{
				id: "0801030000",
				label: '中国农业银行'
			},
			{
				id: "0801050000",
				label: '中国建设银行'
			},
			{
				id: "0803050000",
				label: '民生银行'
			},
			{
				id: "0801040000",
				label: '中国银行'
			},
			{
				id: "0803090000",
				label: '兴业银行'
			},
			{
				id: "0803030000",
				label: '光大银行'
			},
			{
				id: "0803020000",
				label: '中信银行'
			},
			{
				id: "0804100000",
				label: '平安银行'
			},
			{
				id: "0801000000",
				label: '邮政储蓄银行'
			},
			{
				id: "0803010000",
				label: '交通银行'
			},
			{
				id: "0803060000",
				label: '广发银行'
			},
			{
				id: "0803100000",
				label: '浦发银行'
			},
			{
				id: "0803080000",
				label: '招商银行'
			},
			{
				id: "0803040000",
				label: '华夏银行'
			},
			{
				id: "0804031000",
				label: '北京银行'
			},
			{
				id: "0804010000",
				label: '上海银行'
			}
		];
		var userId = sessionStorage.userId;
		var token = sessionStorage.token;
		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/login";
			return;
		} else {
			//获取地区
			$scope.getCity = function() {

				$http.get("templates/user/json/city-picker.json").success(function(data) {
					$scope.cityData = data;

					$scope.userCard.province = "";
					$scope.userCard.city = "";
					$scope.userCard.district = "";
				});
			}
			$scope.getCity();
			//获取用户信息
			$scope.getUserInfo = function() {
				$http.get(
					HOST_URL + "user/" + userId + "/userInfo?token=" + token).success(function(responseData) {
					if(responseData.resultCode == "0") {
						$scope.UserInfo = responseData.resultData;
					} else {
						userOnlineBankService2.alertInfo(responseData);
					}

					if($scope.UserInfo.hasCardId != true) { //判断是否实名认证过
						$scope.showRealname = 2;

					}
					if($scope.UserInfo.hasTradePassword != true && $scope.UserInfo.hasCardId != false) { //已实名认证且没设置交易密码
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

			//获取用户实名信息
			$scope.getIdcard = function() {
				$http.get(
					HOST_URL + "user/" + userId + "/idcard?token=" + token).success(function(responseData) {
					if(responseData.resultCode == "0") {
						$scope.getIdcard = responseData.resultData;
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
			$scope.getIdcard();
			//		console.log($scope.UserInfo);

			//提交用户实名信息
			$scope.updateRealName = function(userCard) {
//				console.log($scope.userCard);
				if(typeof($scope.userCard.realName) == "undefined") {
					userSafeCenterService.alertError("请输入真实姓名");
					return 0;
				}
				if(typeof($scope.userCard.idCard) == "undefined") {
					userSafeCenterService.alertError("请输入身份证号码");
					return 0;
				}
				if(typeof($scope.userCard.bankCode) == "undefined"){
					userSafeCenterService.alertError("请选择银行");
					return 0;		
				}
				if($scope.userCard.province == "") {
					userSafeCenterService.alertError("请选择省");
					return 0;
				}
				if($scope.userCard.city == "") {
					userSafeCenterService.alertError("请选择市");
					return 0;
				}
				if($scope.userCard.district == "") {
					userSafeCenterService.alertError("请选择县区");
					return 0;
				}
				if($scope.userCard.cardNumber == "" || typeof($scope.userCard.cardNumber) == "undefined") {
					userSafeCenterService.alertError("请输入银行卡号");
					return 0;
				}
				if(typeof($scope.userCard.subbranch) == "undefined") {
					userSafeCenterService.alertError("请填写开户支行名");
					return 0;
				}
				userSafeCenterService.updateRealName(token, $scope.userCard, userId).then(function() {
					$scope.userCard = {};
				});

			};
			// function修改登录密码
			$scope.update = function() {
				if(typeof($scope.password.password) == "undefined" && typeof($scope.password.passwordNew) == "undefined" && typeof($scope.password.passwordNew2 == "undefined")) {
					userSafeCenterService.alertError("请完整输入以上信息");
					return 0;
				}
				if($scope.password.passwordNew != $scope.password.passwordNew2) {
					userSafeCenterService.alertError("您输入的两次密码不一致");
					return 0;
				}
				if($scope.password.passwordNew.length < 6) {
					userSafeCenterService.alertError("输入密码不能小于6位");
					return 0;
				}
				userSafeCenterService.updatePassword(token, $scope.password, userId).then(function() {
					$scope.password = {};
					// 修改密码过后提醒重新登录 20160525

				});
			};

			//设置交易密码
			$scope.updateTradePassword = function() {
				       	  if ($scope.UserInfo.hasCardId!=true) {
				       	  	
				       	  	$mdDialog.show(
								$mdDialog.alert()
								.clickOutsideToClose(true)
								.title('提示')
								.textContent("请先实名认证!")
								.ok('确定')
							).finally(function() {
								 window.location.reload();
							});
				             
				             
				              return 0;
				              
				          }
				if(typeof($scope.tradePassword.code) == "undefined") {
					userSafeCenterService.alertError("请输入正确的验证码");
					return 0;
				}
				
				if(typeof($scope.tradePassword.pwd1) == "undefined" && typeof($scope.tradePassword.pwd2 == "undefined")) {
					userSafeCenterService.alertError("请输入交易密码");
					return 0;
				}
				if($scope.tradePassword.pwd1 != $scope.tradePassword.pwd2) {
					userSafeCenterService.alertError("您输入的两次密码不一致");
					return 0;
				}
				if($scope.tradePassword.pwd1.length < 6) {
					userSafeCenterService.alertError("输入密码不能小于6位");
					return 0;
				}
				

				userSafeCenterService.updateTradePassword(token, $scope.tradePassword, userId, $scope.UserInfo).then(function() {
					$scope.tradePassword = {};

				});

			};

			//发送短信验证
			$scope.sendSms = function() {
				$http.get(
					HOST_URL + "/sms/trade?token=" + token, {}, {
						headers: {
							'Content-Type': 'application/json'
						}
					}
				).success(function() {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent("短信发送成功")
						.ok('确定')
					);
				}).error(function(responseData) {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('发生错误')
						.textContent(responseData.resultMsg)
						.ok('确定')
					);
					//				$scope.changeVerificationCode();
				});
			};

		}
	})

	.factory('userSafeCenterService', function($http, $mdDialog, $location, userOnlineBankService2) {
		return {
			updatePassword: function(token, updatePassword, userId) {

				var data = angular.copy(updatePassword);
				data.token = token;

				return $http.post(
					HOST_URL + "/user/" + userId + "/updatePassword",
					$.param(data), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).success(function(responseData) {
					if(responseData.resultCode == "0") {
						$mdDialog.show(
							$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('提示')
							.textContent(responseData.resultMsg + "，请重新登录")
							.ok('确定')

						).finally(function() {
							sessionStorage.clear();
							$location.path('/login');
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
			},
			updateRealName: function(token, userCard, userId) {
//				console.log(userCard);
				userCard.token = token;
				return $http.post(
					HOST_URL + "user/" + userId + "/account/card/binding",
					$.param(userCard), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).success(function(responseData) {

					if(responseData.resultCode == "0") {
						$mdDialog.show(
							$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('提示')
							.textContent("实名认证成功，请设置交易密码！")
							.ok('确定')
						).finally(function() {
							window.location.reload();
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

			},
			updateTradePassword: function(token, tradePassword, userId, UserInfo) {
				var data = {
					"token": token,
					"pwd": tradePassword.pwd1,
					"code": tradePassword.code
				};
				return $http.post(
					HOST_URL + "user/" + userId + "/account/tradepwd",
					$.param(data), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).success(function(responseData) {

					if(responseData.resultCode == "0") {
						if(UserInfo.hasBankCard != true) { //没有绑定银行卡
							$mdDialog.show(
								$mdDialog.alert()
								.clickOutsideToClose(true)
								.title('提示')
								.textContent("交易密码设置成功，请绑定银行卡！")
								.ok('确定')
							).finally(function() {
								$location.path('/user/userBankCard');
							});
							return;
						}

						if(UserInfo.hasBankCard != false) { //绑定银行卡
							$mdDialog.show(
								$mdDialog.alert()
								.clickOutsideToClose(true)
								.title('提示')
								.textContent("交易密码设置成功!")
								.ok('确定')
							).finally(function() {
								$location.path('/investment');
							});
							return;
						}
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

			},
			alertError: function(message) {
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