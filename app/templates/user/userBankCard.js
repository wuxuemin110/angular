'use strict';

angular.module('myApp.userBankCard', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/user/userBankCard', {
			templateUrl: 'templates/user/userBankCard.html',
			controller: 'UserBankCardCtrl'
		});
	}])

	.controller('UserBankCardCtrl', function($scope, $mdDialog, UserService, UserInfoService, UserBankCardService, $http, $location) {
		$scope.personaCurrent = 6;
		$scope.bankIndex = 1;
		$scope.user = {};
		$scope.userInfo = {};
		$scope.bankInfo = [];
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
		// 校验登录
		var userId = sessionStorage.userId;
		var token = sessionStorage.token;
		if(token == undefined) {
			$mdDialog.show(
				$mdDialog.alert()
				.clickOutsideToClose(true)
				.title('提示')
				.textContent("您尚未登录！")
				.ok('确定')
			);
			self.location = "/login";
		} else {
			UserService.synUser(token).success(function() {
				$scope.user = UserService.getUser();
			});
			UserBankCardService.synUserInfo(userId, token).success(function() {
				$scope.userInfo = UserBankCardService.getUserInfo();
				//console.log($scope.userInfo);
			});
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
				}else if(responseData.resultCode == "2") {
					sessionStorage.clear();
					 $location.path('/login');
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

			$scope.bankBtn = function(UserInfo) {
//				console.log($scope.UserInfo.hasCardId);
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

				//$scope.bankIndex = 2;
			}

			//获取银行卡信息
			$scope.bankInfo = function() {
				$http.get(
					HOST_URL + "user/" + userId + "/account/cards?token=" + token).success(function(responseData) {
					if(responseData.resultCode == "0") {
					$scope.bankInfo = responseData.resultData;
					//console.log($scope.bankInfo);
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
					.textContent(responseData['resultMsg'])
					.ok('确定')
				);
				});
			}
			$scope.bankInfo();
		

		$scope.userBankCard1 = "ddhover";
		//
		// function
		$scope.updateBankCard = function() {
//			console.log($scope.userCard);
			if($scope.userCard.province==""){
				$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent('请选择省')
						.ok('确定')
					)
				return 0;
			}
			if($scope.userCard.city==""){
				$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent('请选择市')
						.ok('确定')
					)
				return 0;
			}
			if($scope.userCard.district==""){
				$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent('请选择县区')
						.ok('确定')
					)
				return 0;
			}
			var cardData = angular.copy($scope.userCard);
			UserBankCardService.updateUserCard(userId, token, cardData);
		}
		
		}
	})

	.factory('UserBankCardService', function($http, $mdDialog, $location) {
		var userCards;
		var userInfo;
		return {
			 getUserInfo: function () {
                return userInfo;
           },
            // 同步用户信息
            synUserInfo: function (userId, token) {
                return $http.get(HOST_URL + "/user/" + userId + "/info?token=" + token).success(function (responseData) {
                	if(responseData.resultCode == "0") {
                    userInfo = responseData.resultData;
                    //console.log(userInfo);
                   }
                }).error(function (responseData) {
                   $mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent(responseData['resultMsg'])
					.ok('确定')
				);
                });
            },
			getUserCards: function() {
				return userCards;
			},
			// 同步银行卡列表
			synUserCard: function(userId, token) {
				return $http.get(HOST_URL + "/user/" + userId + "/account/cards?token=" + token).success(function(responseData) {
					userCards = responseData;
				}).error(function(responseData) {

				});
			},
			// 更新用户银行卡
			updateUserCard: function(userId, token, userCard) {
				userCard.token=token;
				return $http.post(
					HOST_URL + "/user/" + userId + "/account/card/add",
					$.param(userCard), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
				).success(function(responseData) {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent('银行卡设置成功')
						.ok('确定')
					).finally(function() {
						//window.location.reload();
						$location.path('/user/userRecharge');
					});
				}).error(function(responseData) {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('发生错误，错误信息如下：')
						.textContent(responseData['resultMsg'])
						.ok('确定')
					);
				});
			}
		}
	});