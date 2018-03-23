'use strict';

angular.module('myApp.join', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/join/:id', {
			templateUrl: 'templates/index/join.html',
			controller: 'JoinCtrl'
		});
	}])

	.controller('JoinCtrl', function($scope, $rootScope, $routeParams, $mdDialog, $mdMedia, JoinService, $location, $http, redPackageService, userOnlineBankService2) {
		var userId = sessionStorage.userId;
		var token = sessionStorage.token;
		$scope.activeTap = 0;
		$scope.isShow = false;
		$scope.money = "";
		$scope.loans = [];
		$scope.loanPages = [];
		$scope.investments = [];
		$scope.investmentPages = [];
		$scope.showImg = false;
		$scope.rightShow = 1;
		$scope.UserInfo = {};
		$scope.fullImgUrl = '';
		$scope.carLoan = {};

		$scope.showI = true;
		$scope.password = '';

		$scope.showMyImg = function() {
			$scope.showI = true;
			var srcImg = this.src;
			//			console.log(this);
			$scope.myImg = angular.element.attr('src', 'srcImg');
		};

		// 判断登录
		if(token == undefined) {

			$scope.rightShow = 1;
			//			              $mdDialog.show(
			//			                  $mdDialog.alert()
			//			                      .clickOutsideToClose(true)
			//			                      .title('请先登录')
			//			                      .ok('确定')
			//			              ).finally(function () {
			//			                  $location.path('/login');
			//			              });
			//			              return;
		} else {

			$scope.rightShow = 2;
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
			};
			$scope.getUserInfo();

		};

		$scope.synPlan = function() {
			window.scrollTo(0, 0);

			JoinService.synPlan($routeParams.id).then(function() {

				$scope.plan = JoinService.getPlan();
				$scope.plan.percent=parseInt((($scope.plan['nowSum'] / $scope.plan['amount']) * 100)>100 ? 100:($scope.plan['nowSum'] / $scope.plan['amount']*100));
				
				$scope.joinPlan = {
        "width" : $scope.plan.percent+"%",
        
    }
				//				console.log($scope.plan);
				//				console.log($scope.plan)
				//				console.log($scope.plan );
				//
				//				if($scope.plan.type == 0 || $scope.plan.type == 1 || $scope.plan.type == 2) {
				//					$scope.activeTap = 0;
				//				} else {
				//					$scope.activeTap = 1;
				//				}

				//				$scope.synInvestment = JoinService.synInvestments($routeParams.id).then(function() {
				//					$scope.totalInvestment = JoinService.getTotal().totalInvestment;
				//					$scope.investments = JoinService.selectInvestments(1);
				//					$scope.investmentPages = JoinService.getInvestmentPages();
				//					console.log($scope.totalInvestment, $scope.investments, $scope.investmentPages);
				//				});

			});
		};
		$scope.synPlan();

		$scope.riskData = {
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
			return redPackageService.selectPage("/plan/" + $routeParams.id + "/investments", data).then(function() {
				var tmpObject = redPackageService.getResult();

				$scope.itemList = tmpObject.itemList;
				$scope.nowPage = tmpObject.nowPage;
				$scope.sumCount = tmpObject.sumCount;
				$scope.pages = tmpObject.pages;
				$scope.isShowDot = tmpObject.isShowDot;
				$scope.totalPages = tmpObject.totalPages;
				$scope.startIndex = tmpObject.startIndex;
			});
		};
		$scope.selectPage(1);
		$scope.getRedpack = function(userId) {
			return $http.get(
					HOST_URL + "/user/" + userId + "/account/canusevouchers?token=" + token + "&type=0&amount=" + $scope.money*100 + "&cycle=" + $scope.plan.staging)
				.success(function(responseData) {

					if(responseData.resultCode == "0") {
						$scope.redVouchers = responseData.resultData;
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
		};

		//查询红包信息
		$scope.change = function() {
			if($scope.money != "" & $scope.money != null) {
				$scope.selectedItem="0";
				$scope.oneRedVoucher="";
				$scope.getRedpack(userId);
			}
		}
		//查询单个红包信息

		$scope.change2 = function() {
			$scope.chengeitem = $scope.selectedItem;
			$http.get(
				HOST_URL + "/user/" + userId + "/voucher/" + $scope.chengeitem + "?token=" + token).success(function(responseData) {
				if(responseData.resultCode == "0") {
					$scope.oneRedVoucher = responseData.resultData;
					$scope.oneRedVoucher.voucherValue = $scope.oneRedVoucher.voucherValue / 100;
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
		//设置全投
		$scope.allMoney = function() {
			//			console.log($scope.UserInfo.money);
			var balance = $scope.plan.amount - $scope.plan.nowSum;
			if(balance > $scope.UserInfo.money) {
				$scope.money = parseInt($scope.UserInfo.money / 100);
			} else {
				$scope.money = balance / 100;
			}
			$scope.getRedpack(userId);
		}

		$scope.selectInvestmentsPages = function(pages) {
			if(pages >= $scope.investmentPages.length) {
				pages = $scope.investmentPages.length;
			} else if(pages <= 1) {
				pages = 1;
			}

			$scope.investments = JoinService.selectInvestments(pages);
			$scope.nowInvestmentPage = pages;
		};
		$scope.nowLoanPage = 1;
		$scope.nowInvestmentPage = 1;
		// 加载券
		$scope.vouchers = {};
		$scope.vouchersAll = {};
		$scope.vouchers.pocket_money = {};
		$scope.vouchers.exp_money = {};
		$scope.vouchers.raising_rates = {};
		//      if (sessionStorage.token != undefined) {
		//          var qmkmw = $rootScope.money;
		//          JoinService.synVouchers(userId, token, $routeParams.id, qmkmw).then(function () {
		//              var vouchers = JoinService.getVouchers();
		//              $scope.lengthA = vouchers.length;
		//              if (vouchers != undefined && vouchers != '') {
		//                  for (var voucher in vouchers) {
		//                      $scope.vouchersAll[vouchers[voucher]['id']] = (vouchers[voucher]);
		//                      // 可使用券z
		//                      if (vouchers[voucher]['type'] == 0) {
		//                          $scope.vouchers.pocket_money[vouchers[voucher]['id']] = (vouchers[voucher]);
		//                      } else if (vouchers[voucher]['type'] == 1) {
		//                          $scope.vouchers.exp_money[vouchers[voucher]['id']] = (vouchers[voucher]);
		//                      } else if (vouchers[voucher]['type'] == 2) {
		//                          $scope.vouchers.raising_rates[vouchers[voucher]['id']] = (vouchers[voucher]);
		//                      }
		//                  }
		//              }
		//          });
		//      }

		//查询用户信息

		// 获取红包

		//js代码实现option值变化后的查询等操作    
		//$scope.getRedpack();
		//$scope.vouchersSelect = {};
		$scope.beforePostInvestment = function(plan, selectedItem) {
			//					console.log(plan.minAmount);
			var moneyData = $scope.money;
			var type = "^[0-9]*[1-9][0-9]*$";
			var r = new RegExp(type);
			var flag = r.test(moneyData);
			if(!flag) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('金额错误')
					.textContent('请输入正整数')
					.ok('确定')
				);
				return;
			}
			if($scope.money < (plan.minAmount / 100)) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('金额错误')
					.textContent('投资金额必须为大于' + plan.minAmount / 100)
					.ok('确定')
				);
				return;
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
			var UserInfoMoney = $scope.UserInfo.money / 100;
			if($scope.money > UserInfoMoney) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('金额错误')
					.textContent('可用余额不足，请充值')
					.ok('确定')
				).finally(function() {
					$location.path('/user/userRecharge');
				});
				return;
			}
			if(plan.type != 1) {
				if($scope.money == null || $scope.money == '' || isNaN($scope.money) != false) {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('温馨提示')
						.textContent("输入金额才能加入计划！")
						.ok('确定')
					);
					return;
				}
			}
			$rootScope.money = angular.copy($scope.money);
			//$rootScope.selectedItem = angular.copy($scope.selectedItem);
			//$rootScope.password = angular.copy($scope.password);
			// 过滤不可使用券
			//          var vouchers = JoinService.getVouchers();
			//          for (var voucher in vouchers) {
			//              // 可使用券
			//              if (vouchers[voucher]['type'] == 0) {
			//                  $scope.vouchers.pocket_money[vouchers[voucher]['id']] = (vouchers[voucher]);
			//              } else if (vouchers[voucher]['type'] == 1) {
			//                  $scope.vouchers.exp_money[vouchers[voucher]['id']] = (vouchers[voucher]);
			//              } else if (vouchers[voucher]['type'] == 2) {
			//                  $scope.vouchers.raising_rates[vouchers[voucher]['id']] = (vouchers[voucher]);
			//              }
			//          }

			$scope.isShow = true;

			//
			//          $mdDialog.show({
			//              templateUrl: 'templates/index/join_select_voucher.html',
			//              parent: angular.element(document.body),
			//              clickOutsideToClose: true
			//          });
		};
		$scope.confirmBoxclose = function() {
			$scope.isShow = false;
		}
		$scope.hide = function() {
			$mdDialog.hide();
		};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		// 选择券
		//      $scope.selectVoucher = function (id) {
		//          var element = angular.element('#voucher' + id);
		//          var type = $scope.vouchersAll[id].type;
		//          switch (type) {
		//              case 0:
		//                  if (element.hasClass('icon-12')) {
		//                      delete $scope.vouchersSelect[id];
		//                  } else {
		//                      var idT = $(".icon-12").attr("name");
		//                      delete $scope.vouchersSelect[idT];
		//                      $scope.vouchersSelect[id] = id;
		//                  }
		//                  break;
		//              case 1:
		//                  if (element.hasClass('icon-11')) {
		//                      delete $scope.vouchersSelect[id];
		//                  } else {
		//                      var idT = $(".icon-11").attr("name");
		//                      delete $scope.vouchersSelect[idT];
		//                      $scope.vouchersSelect[id] = id;
		//                  }
		//                  break;
		//              case 2:
		//                  if (element.hasClass('icon-10')) {
		//                      delete $scope.vouchersSelect[id];
		//                  } else {
		//                      var idT = $(".icon-10").attr("name");
		//                      delete $scope.vouchersSelect[idT];
		//                      $scope.vouchersSelect[id] = id;
		//                  }
		//                  break;
		//              default:
		//                  break;
		//          }
		//      };

		// 提交购买
		$scope.postInvestment = function(selectedItem, tradePassword, specialPlanPassword) {
			//			console.log(selectedItem, tradePassword, specialPlanPassword);
			//			if(tradePassword == "" || tradePassword == undefined || tradePassword == null) {
			//				$mdDialog.show(
			//					$mdDialog.alert()
			//					.clickOutsideToClose(true)
			//					.title('温馨提示')
			//					.textContent("交易密码不能为空")
			//					.ok('确定')
			//				);
			//				return;
			//			};
			var selectedItem = parseInt(selectedItem);
			var pocketId = selectedItem;

			JoinService.newInvestment($routeParams.id, $rootScope.money, pocketId, tradePassword, specialPlanPassword);
			$scope.isShow = false;
			$mdDialog.hide();
		}
		$scope.switchTap = function(index) {
			$scope.activeTap = index;
		}
		$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
			$(".details_banner").thumbnailImg({
				large_elem: ".large_box",
				small_elem: ".small_list",
				left_btn: ".left_btn",
				right_btn: ".right_btn"
			});
			var l = $("#bigImageBg").find("ul li").length;
			$("#details_banner li").click(function() {
				var index = $(this).index();
				$("#bigImageBg").show();
				$("#bigImageBg li:eq(" + index + ")").addClass("imgShow");
				//$(".img-responsive").attr("src", src);

			})

			$(".bigLeft").click(function() {

				var i;
				$("#bigImageBg").find("ul li").each(function(index) {
					if($(this).hasClass("imgShow")) {
						i = index
					}
				});
				i--;
				if(i < 0) {
					i = l - 1
				}
				$("#bigImageBg").find("ul li").eq(i).addClass("imgShow").siblings().removeClass("imgShow");
			});
			$(".bigRight").click(function() {
				var i;
				$("#bigImageBg").find("ul li").each(function(index) {
					if($(this).hasClass("imgShow")) {
						i = index;

					}
				});
				i++;
				if(i > l - 1) {
					i = 0
				}
				$("#bigImageBg").find("ul li").eq(i).addClass("imgShow").siblings().removeClass("imgShow");

			});
			$(".closeImg").click(function() {
				$("#bigImageBg").hide();
			})
		});

	})

	.factory('JoinService', function($http, UserService, $mdDialog, $location, $route, userOnlineBankService2) {
		var plan;
		var loans;
		var carLoan;
		var investments;
		var eachPageItems = 10;
		var loanPages;
		var investmentPages;
		var vouchers;
		var totalInvestment = 0;
		var totalLoan = 0;
		return {
			getTotal: function() {
				return {
					totalInvestment: totalInvestment,
					totalLoan: totalLoan
				}
			},
			synPlan: function(planId) {
				return $http.get(HOST_URL + "/plan/" + planId).success(function(responseData) {

					if(responseData.resultCode == "0") {
						plan = responseData.resultData;
					} else {
						userOnlineBankService2.alertInfo(responseData);
					}
					//										console.log(plan);

				}).error(function() {

				});
			},
			getPlan: function() {
				return plan;
			},
			//			getVouchers: function() {
			//				return vouchers;
			//			},
			//			synVouchers: function(userId, token, planId, money) {
			//				return $http.get(
			//					HOST_URL + "/user/" + userId + "/vouchers/recommend?planId=" + planId +
			//					"&token=" + token + "&money=" + money * 100).success(function(responseData) {
			//					vouchers = responseData;
			//				}).error(function() {});
			//			},
			//          synLoan: function (planId) {
			//              return $http.get(HOST_URL + "/plan/" + planId + "/loan", {cache: true}).success(function (responseData) {
			//                  loans = responseData;
			//                  totalLoan = loans.length;
			//                  var resultArr = [];
			//                  for (var i = 0; i < Math.ceil(loans.length / eachPageItems); i++) {
			//                      resultArr[i] = i;
			//                  }
			//                  loanPages = resultArr;
			//              }).error(function () {
			//              });
			//          },
			//          synCarLoan: function (planId) {
			//              return $http.get(HOST_URL + "/plan/" + planId + "/carLoan", {cache: true}).success(function (responseData) {
			//                  carLoan = responseData;
			//              }).error(function () {
			//              });
			//          },
			//          selectLoans: function (page) {
			//              if (loans.length == 0) {
			//                  return;
			//              }
			//              var result = [];
			//              var limit;
			//              if (page == loanPages.length) {
			//                  limit = loans.length;
			//              } else {
			//                  limit = page * eachPageItems;
			//              }
			//              for (var i = (page - 1) * eachPageItems; i < limit; i++) {
			//                  loans[i].indexId = i + 1;
			//                  result.push(loans[i]);
			//              }
			//              return result;
			//          },
			//          getLoanPages: function () {
			//              return loanPages;
			//          },
			//          getCarLoan: function () {
			//              var tmpLoan = [];
			//              tmpLoan.push(carLoan[0]);
			//              tmpLoan[1] = [];
			//              var tmpImgList = carLoan[1];
			//              for (var i = 0; i < tmpImgList.length; i++) {
			//                  var tmpArr = tmpImgList[i]['carLoanImg'].split('|');
			//                  var obj = {
			//                      link: tmpArr[0],
			//                      title: tmpArr[1]
			//                  };
			//                  tmpLoan[1].push(obj);
			//              }
			//              return tmpLoan;
			//          },
			//			synInvestments: function() {
			//				return $http.get(HOST_URL + "/plan/" + planId + "/investments").success(function(responseData) {
			//					investments = responseData;
			//					totalInvestment = investments.length;
			//					var resultArr = [];
			//
			//					for(var i = 0; i < Math.ceil(investments.length / eachPageItems); i++) {
			//						resultArr[i] = i;
			//					}
			//					investmentPages = resultArr;
			//
			//				}).error(function() {
			//
			//				});
			//			},
			synInvestments: function(planId) {
				return $http.get(HOST_URL + "/plan/" + planId + "/investments").success(function(responseData) {
					investments = responseData.resultData;
					//					console.log(investments);
					totalInvestment = responseData.sumCount;
					//					console.log(responseData);
					var resultArr = [];

					for(var i = 0; i < Math.ceil(responseData.sumCount / eachPageItems); i++) {
						resultArr[i] = i;
					}
					investmentPages = resultArr;
					//					console.log(investmentPages);
				}).error(function() {

				});
			},
			selectInvestments: function(page) {
				var result = [];
				var limit;
				if(page == investmentPages.length || investmentPages.length == 0) {
					limit = investments.length;
				} else {
					limit = page * eachPageItems;
				}
				for(var i = (page - 1) * eachPageItems; i < limit; i++) {
					investments[i].indexId = i + 1;
					result.push(investments[i]);
				}
				return result;
			},
			getInvestmentPages: function() {
				return investmentPages;
			},
			newInvestment: function(planId, money, pocketId, tradePassword, specialPlanPassword) {
				var token = sessionStorage.token;
				var userId = sessionStorage.userId;
				var obj = this;

				return UserService.synUserAccount(userId, token).then(function() {
					var account = UserService.getUserAccount();
					obj.synPlan(planId);
					plan = obj.getPlan();
					var canInvestmentMoney = plan.amount - plan.nowSum;
					money *= 100;
					if(plan.type != 1) {
						if(money < plan.minAmount) {
							$mdDialog.show(
								$mdDialog.alert()
								.clickOutsideToClose(true)
								.title('投资金额过低')
								.textContent('单笔投资金额必须大于￥' + plan.minAmount / 100 + '元')
								.ok('确定')
							);
							return;
						}
					}
					if(plan.maxAmount != 0 && money > plan.maxAmount) {
						$mdDialog.show(
							$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('投资金额过高')
							.textContent('单笔投资金额必须小于￥' + plan.maxAmount / 100 + '元')
							.ok('确定')
						);
						return;
					}
					if(money > canInvestmentMoney) {
						$mdDialog.show(
							$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('计划可投金额不足')
							.textContent('计划当前可投余额￥' + canInvestmentMoney / 100 + '元')
							.ok('确定')
						);
						return;
					}

					//				if(money % 10000 != 0) {
					//					$mdDialog.show(
					//						$mdDialog.alert()
					//						.clickOutsideToClose(true)
					//						.title('金额错误')
					//						.textContent('投资金额必须为100的整倍数')
					//						.ok('确定')
					//					);
					//					return;
					//				}
					// 转换 vouchers 为数组
					//					var voucherList = [];
					//					for(var voucher in vouchers) {
					//						voucherList.push(vouchers[voucher]);
					//					}
					return obj.sendInvestment(planId, money, pocketId, tradePassword, specialPlanPassword);
				});
			},
			sendInvestment: function(planId, money, pocketId, tradePassword, specialPlanPassword) {
				var investment = {
					"planId": planId,
					"money": money,
					"pocketId": pocketId,
					"specialPlanPassword": specialPlanPassword,
					"tradePassword": tradePassword,
					"token": sessionStorage.token,
					"userId": sessionStorage.userId
				};

				return $http.post(
					HOST_URL + "/plan/" + planId + "/join",
					$.param(investment), {
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
							.textContent("投资成功")
							.ok('确定')
						).finally(function() {
							//$location.path('/join');
							//window.location.reload();
							$location.path('/user/index');
						});
					} else {
						userOnlineBankService2.alertInfo(responseData);
					}

				}).error(function(responseData) {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('失败')
						.textContent(responseData['resultMsg'])
						.ok('确定')
					);
				});
			}
		}
	}).directive('onFinishRenderFilters', function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element, attr) {
				if(scope.$last === true) {
					$timeout(function() {
						scope.$emit('ngRepeatFinished');
					});
				}
			}
		}
	});