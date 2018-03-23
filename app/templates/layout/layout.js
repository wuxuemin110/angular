'use strict';

angular.module('myApp.layout', ['ngRoute'])
    .controller('LayoutController',function ($scope, $location, $mdDialog,$http) {
        var userId = sessionStorage.userId;
        var token = sessionStorage.token;
        var userName = sessionStorage.userName;
        var role = sessionStorage.role;
       
        $scope.roletouzi = role;
        $scope.url = {
            'login': '/login',
            'register': '/register'
        };
        if (userId != undefined && token != undefined && userName != undefined) {
            $scope.url.login = '/user/index';
            $scope.url.register = '/logout';
            //$scope.userName = userName;
            $scope.userName = userName.substr(0, 3) + '****' + userName.substr(7);
            $scope.userName1 = "个人中心";
            $scope.log = "退出登录";
        } else {
            $scope.url.login = '/login';
            $scope.url.register = '/register';
            $scope.userName1 = "立即登录";
            $scope.log = "立即注册";
        }

        $scope.investor_show = false;
        var roleNum = Math.floor(role / 100);
        $scope.investor_show = roleNum == 1;
        $scope.showConfirm = function () {
            $mdDialog.show(
                $mdDialog.confirm()
                    .clickOutsideToClose(true)
                    .title('您确定要退出吗？')
                    .ok('确定')
                    .cancel('取消')
            ).then(function () {
            	 var url = $location.path();
            	// console.log(url);
            	 if(url=="/"){
            	 	window.location.reload();
            	 }
            	else{
            		$location.path('/');
            	}
            	$scope.uploadToken();
                sessionStorage.clear();
                $location.path('/');
                $scope.url.login = '/login';
                $scope.url.register = '/register';
                $scope.userName1 = "立即登录";
                $scope.log = "立即注册";
            }, function () {

            });
        };
        var tokenData={
        	token:token
        };
      $scope.uploadToken=function(){
         $http.post(HOST_URL + "/user/logout/" + userId ,
					 
                   $.param(tokenData)
                , {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
				).success(function(responseData) {
					
				}).error(function(responseData) {
					
				});
		};

       
    });