'use strict';

angular.module('myApp.login', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/login', {
			templateUrl: 'templates/index/login.html',
			controller: 'LoginCtrl'
		});
	}])

	.controller('LoginCtrl', function($scope, $http, $mdDialog, LoginService,userOnlineBankService2) {
		$scope.user = {
			//'role': '100'
		};

		$scope.login = function() {
			LoginService.login($scope.user, $scope.verificationCode).success(function() {
				$scope.changeVerificationCode();
			}).error(function() {
				$scope.changeVerificationCode();
			});
		};
		$scope.changeVerificationCode = function() {
			$http.get(HOST_URL + "/code").success(function(responseData) {
				if(responseData.resultCode == "0") {
					document.getElementById("verificationCode").src = "data:image/gif;base64," + responseData.resultData['image'];
				}
				else{
					userOnlineBankService2.alertInfo(responseData);
				}
			}).error(function(responseData) {
				if(responseData == undefined) {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('获取图形验证码发生错误')
						.textContent('通信异常，请刷新，如多次刷新未解决，请联系客服')
						.ok('确定')
					);
				} else {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('发生错误')
						.textContent(responseData['resultMsg'])
						.ok('确定')
					);
				}
			});
		};
		$scope.changeVerificationCode();
	})

	.factory('LoginService', function($http, $mdDialog,userOnlineBankService2) {
		var user;
		var userInfo;
		var userAuth;

		return {
			getAll: function() {
				return [user, userInfo, userAuth];
			},
			login: function(user, code) {
				var data = {
					"code": code,
					"from": "pc",
					"name": user.name,
					"password": user.password
				}
				if(user.name == undefined || user.name == '') {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent('用户名不能为空')
						.ok('确定')
					);
					return;
				}

				if(user.password == undefined || user.password == '') {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent('请输入密码')
						.ok('确定')
					);
					return;
				}
				if(code == undefined || code == '') {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent('请输入验证码')
						.ok('确定')
					);
					return;
				}

				return $http.post(
					HOST_URL + "/user/login",
					$.param(data), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).success(function(responseData) {
//					console.log(responseData);
					if(responseData.resultCode == "0") {
						var loginData = responseData.resultData;
					
					//                  localStorage.setItem('userId', responseData['user']['id']);
					//                  localStorage.setItem('userName', responseData['user']['name']);
					//                  localStorage.setItem('role', responseData['user']['role']);
					//                  localStorage.setItem('token', responseData['userAuth']['token']);
					sessionStorage.setItem('userId', loginData['user']['id']);
					sessionStorage.setItem('userName', loginData['user']['name']);
					sessionStorage.setItem('role', loginData['user']['role']);
					sessionStorage.setItem('token', loginData['userAuth']['token']);
					self.location = "/user/index";
					}
					else{
//						console.log(responseData);
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
		}
	});