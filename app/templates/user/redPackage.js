'use strict';

angular.module('myApp.redPackage', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/user/redPackage', {
			templateUrl: 'templates/user/redPackage.html',
			controller: 'redPackageCtrl'
		});
	}])

	.controller('redPackageCtrl', function($scope, redPackageService, $http, $location, userOnlineBankService2) {
		var role = sessionStorage.role;
		$scope.redIndex = 1;
		$scope.classNameVoucher = "ddhover";
		$scope.personaCurrent = 7;
		var userId = sessionStorage.getItem("userId");
		var token = sessionStorage.getItem("token");
		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/login";
			return 0;
		} else {
			$scope.getUserInfo = function() {
				return $http.get(
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

			//      // 判断显示
			//      $scope.isInvestor = false;
			//      var roleNum = Math.floor(role / 100);
			//      if (roleNum == 1) {
			//          $scope.isInvestor = true;
			//      }

			//      $scope.riskData = {
			//          token: token,
			//          page: 1,
			//          limit: 12,
			//          type: 1
			//      };

			//      $scope.mytime = Date.parse(new Date());
			//
			//      $scope.selectExPage = function (page) {
			//          return redPackageService.selectPage("/user/" + userId + "/account/vouchers", "/user/" + userId + "/account/vouchers/total", {
			//              token: token,
			//              page: page,
			//              limit: 12,
			//              type: 1
			//          }).then(function () {
			//              var tmpObject = redPackageService.getResult();
			//              $scope.ExitemList = tmpObject.itemList;
			//              $scope.ExnowPage = tmpObject.nowPage;
			//              $scope.Expages = tmpObject.pages;
			//              $scope.ExisShowDot = tmpObject.isShowDot;
			//              $scope.ExtotalPages = tmpObject.totalPages;
			//              $scope.ExstartIndex = tmpObject.startIndex;
			//          });
			//      };
			//      $scope.selectAcPage = function (page) {
			//          return redPackageService.selectPage("/user/" + userId + "/account/vouchers", "/user/" + userId + "/account/vouchers/total", {
			//              token: token,
			//              page: page,
			//              limit: 12,
			//              type: 2
			//          }).then(function () {
			//              var tmpObject = redPackageService.getResult();
			//              $scope.AcitemList = tmpObject.itemList;
			//              $scope.AcnowPage = tmpObject.nowPage;
			//              $scope.Acpages = tmpObject.pages;
			//              $scope.AcisShowDot = tmpObject.isShowDot;
			//              $scope.ActotalPages = tmpObject.totalPages;
			//              $scope.AcstartIndex = tmpObject.startIndex;
			//          });
			//      };
			//判断红包是否为空
			$scope.redEmpty = 1;
			//获取未使用红包
			$scope.riskData = {
				token: token,
				page: 1,
				limit: 12,
				type: 0,
				status: 0
			};
			$scope.selectPage = function(page) {

				if(page <= 1) {
					page = 1;
				} else if(page >= $scope.totalPages) {
					page = $scope.totalPages;
				}
				$scope.riskData['page'] = page;
				var data = angular.copy($scope.riskData);
				redPackageService.selectPage("/user/" + userId + "/account/vouchers", data).then(function() {
					var tmpObject = redPackageService.getResult();
//					             console.log(tmpObject);
					if(tmpObject.totalPages > 0) {
						$scope.redEmpty = 2;
					}
					$scope.itemList = tmpObject.itemList;
					$scope.nowPage = tmpObject.nowPage;
					$scope.sumCount = tmpObject.sumCount;
					$scope.pages = tmpObject.pages;
					$scope.isShowDot = tmpObject.isShowDot;
					$scope.totalPages = tmpObject.totalPages;
					$scope.startIndex = tmpObject.startIndex;
				});
			};
		  //判断已使用红包是否为空
			$scope.useEmpty = 1;
			//获取已使用红包
			$scope.riskData1 = {
				token: token,
				page: 1,
				limit: 12,
				type: 0,
				status: 2
			};
			$scope.selectPage1 = function(page) {

				if(page <= 1) {
					page = 1;
				} else if(page >= $scope.totalPages1) {
					page = $scope.totalPages1;
				}
				$scope.riskData1['page'] = page;
				var data1 = angular.copy($scope.riskData1);
				redPackageService.selectPage("/user/" + userId + "/account/vouchers", data1).then(function() {
					var tmpObject = redPackageService.getResult();
//					console.log(tmpObject);
					if(tmpObject.totalPages > 0) {
						$scope.useEmpty = 2;
					}
					$scope.itemList1 = tmpObject.itemList;
					$scope.nowPage1 = tmpObject.nowPage;
					$scope.sumCount1 = tmpObject.sumCount;
					$scope.pages1 = tmpObject.pages;
					$scope.isShowDot1 = tmpObject.isShowDot;
					$scope.totalPages1 = tmpObject.totalPages;
					$scope.startIndex1 = tmpObject.startIndex;
				});
			};
			
			
			//获取已过期红包
			$scope.riskData2 = {
				token: token,
				page: 1,
				limit: 12,
				type: 0,
				status: 1
			};
			$scope.selectPage2 = function(page) {

				if(page <= 1) {
					page = 1;
				} else if(page >= $scope.totalPages2) {
					page = $scope.totalPages2;
				}
				$scope.riskData2['page'] = page;
				var data2 = angular.copy($scope.riskData2);
				redPackageService.selectPage("/user/" + userId + "/account/vouchers", data2).then(function() {
					var tmpObject = redPackageService.getResult();
					if(tmpObject.totalPages > 0) {
						$scope.useEmpty = 2;
					}
//					console.log(tmpObject);
					$scope.itemList2 = tmpObject.itemList;
					$scope.nowPage2 = tmpObject.nowPage;
					$scope.sumCount2 = tmpObject.sumCount;
					$scope.pages2 = tmpObject.pages;
					$scope.isShowDot2 = tmpObject.isShowDot;
					$scope.totalPages2 = tmpObject.totalPages;
					$scope.startIndex2 = tmpObject.startIndex;
				});
			};
			$scope.selectPage(1);
			$scope.selectPage1(1);
			$scope.selectPage2(1);
		}

		//
		//      $scope.selectExPage(1).finally(function () {
		//          $scope.selectAcPage(1).finally(function () {
		//              $scope.selectPocketPage(1);
		//          })
		//      })

	})
	.factory('redPackageService', function($http, $mdDialog,userOnlineBankService2) {
		var totalCount;
		var tmpObj = {};
		return {
			selectPage: function(url, data) {

				var url_data = "?";

				function isType(obj, type) {
					return Object.prototype.toString.call(obj) === "[object " + type + "]";
				}
				for(var item in data) {
					if(isType(data[item], "Object")) {
						if(item == "keyword") {
							url_data += "keyword=&";
						}
						for(var ite in data[item]) {
							// 如果是二层数组，key是value，value是key
							url_data += data[item][ite] + "=" + ite + "&";
						}
					} else {
						url_data += item + "=" + data[item] + "&";
					}
				}
				//                var promiseA
				//                = $http.get(HOST_URL + urlForCount + url_data).success(function (responseData) {
				//           	console.log(urlForCount, url_data);
				//                    totalCount = responseData.total;
				//                });

				//            return promiseA.then(function () {
				return $http.get(HOST_URL + url + url_data, data).success(function(responseData) {

					if(responseData.resultCode == "0") {
						var items = responseData.resultData;
						var eachPages = data.limit;
						var totalPage = Math.ceil(responseData.sumCount / data.limit);
						var page = data.page;
						tmpObj.sumCount = responseData.sumCount;
						tmpObj.totalPages = totalPage;
						tmpObj.itemList = [];
						if(page <= 1) {
							page = 1;
						}

						if(page >= totalPage) {
							page = totalPage;
						}
						for(var i = 0; i < items.length; i++) {
							tmpObj.itemList.push(items[i]);
						}
						tmpObj.startIndex = (page - 1) * eachPages + 1;
						tmpObj.nowPage = page;
						tmpObj.pages = [];
						if(tmpObj.nowPage > 3 && tmpObj.totalPages > 7) {
							if(tmpObj.nowPage + 3 < tmpObj.totalPages) {
								for(var i = 0; i < 7; i++) {
									tmpObj.pages[i] = {};
									tmpObj.pages[i].showNumber = tmpObj.nowPage - 3 + i;
									tmpObj.isShowDot = true;
								}
							} else if(tmpObj.nowPage + 3 >= tmpObj.totalPages) {
								for(var i = 6; i >= 0; i--) {
									tmpObj.pages[6 - i] = {};
									tmpObj.pages[6 - i].showNumber = tmpObj.totalPages - i;
									tmpObj.isShowDot = false;
								}
							}
						} else if(tmpObj.nowPage <= 3 && tmpObj.totalPages > 8) {
							for(var i = 0; i <= 6; i++) {
								tmpObj.pages[i] = {};
								tmpObj.pages[i].showNumber = i + 1;
								tmpObj.isShowDot = true;
							}
						} else {
							for(var i = 0; i < tmpObj.totalPages; i++) {
								tmpObj.pages[i] = {};
								tmpObj.pages[i].showNumber = i + 1;
								tmpObj.isShowDot = false;
							}
						}
						return tmpObj;
					} else {
						userOnlineBankService2.alertInfo(responseData);
					}
					//                      console.log(responseData);

				});
				//            });
			},
			getResult: function() {
				return tmpObj;
			}
		}
	});