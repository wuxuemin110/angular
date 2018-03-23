'use strict';

angular.module('myApp.findPassword', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/findPassword', {
			templateUrl: 'templates/index/findPassword.html',
			controller: 'FindPasswordCtrl'
		});
	}])

	.controller('FindPasswordCtrl', function($scope, $http, $mdDialog, FindPasswordService, $location, userOnlineBankService2) {
		$scope.find = {
			//     
		};

		//发送短信验证
		$scope.sendSms = function() {
			var data = {
				"code": $scope.imgCode,
				"phone": $scope.find.phone
			}
			$http.post(
				HOST_URL + "/sms/findpwd",
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
						.textContent(responseData['resultMsg'])
						.ok('确定')
					);
				} else {
					userOnlineBankService2.alertInfo(responseData);
				}

			}).error(function(responseData) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('发生错误')
					.textContent(responseData['resultMsg'])
					.ok('确定')
				);
				$scope.changeVerificationCode();
			});
		};

		$scope.changeVerificationCode = function() {
			$http.get(HOST_URL + "/code").success(function(responseData) {
				if(responseData.resultCode == "0") {
					document.getElementById("verificationCode").src = "data:image/gif;base64," + responseData.resultData['image'];
				} else {
					userOnlineBankService2.alertInfo(responseData);
				}
			}).error(function(responseData) {
				$mdDialog.show(
					$mdDialog.alert()      	
					.clickOutsideToClose(true)
					.title('发生错误')
					.textContent(responseData['resultMsg'])
					.ok('确定')
				);
			});
		};
		$scope.changeVerificationCode();

		$scope.findPassword = function() {
			if($scope.find.phone == undefined || $scope.find.phone == '') {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent('手机号不能为空')
					.ok('确定')
				);
				return;
			}
			if(!(/^1[3|4|5|7|8]\d{9}$/.test($scope.find.phone))) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent('手机号填写错误')
					.ok('确定')
				);
				return;
			}
			if($scope.find.code == undefined || $scope.find.code == '') {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent('短信验证码不能为空')
					.ok('确定')
				);
				return;
			}

			if($scope.find.pwd1 != $scope.find.pwd2) {

				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent('您输入的两次密码不一致')
					.ok('确定')
				);
				return;
			}
			if($scope.find.pwd1.length < 6) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent('输入密码不能小于6位')
					.ok('确定')
				);
				return;
			}
			var findData = {
				"phone": $scope.find.phone,
				"pwd": $scope.find.pwd1,
				"code": $scope.find.code
			}
//			console.log(findData);
			$http.post(
				HOST_URL + "/user/findpwd",
				$.param(findData), {
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
						.textContent(responseData['resultMsg'])
						.ok('确定')
					).finally(function() {
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
					.textContent(responseData['resultMsg'])
					.ok('确定')
				);
			});
			$scope.changeVerificationCode();
		};

	})

	.factory('FindPasswordService', function($http, $mdDialog) {
		return {}
	});