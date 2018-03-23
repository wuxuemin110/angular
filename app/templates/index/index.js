'use strict';

angular.module('myApp.index', ['ngRoute', 'radialIndicator'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'templates/index/index.html',
			controller: 'IndexCtrl'
		});
	}])

	.controller('IndexCtrl', function($location, $scope, $rootScope, IndexService, InvestmentService, $timeout, $http, $mdDialog, radialIndicatorInstance) {
		//富爸爸
		$scope.indicatorOption = {
			radius: 80,
			percentage: true,
			fontSize:30,
			fontColor:'#fe4c58',
			//displayNumber: false,//设置是否显示数字指示的进度
			barBgColor: "#ffffff",
			barColor: "#ffffff",
			minValue: 0,
			fontFamily:'微软雅黑',
			maxValue: 100,
			fontWeight:'normal',
			initValue: $scope.numbers,
			barWidth: 0,
		};
		$scope.currentLi = 1; //当前所在页面标志	
		$scope.bottomPlans = '';
		$scope.session1 = ''
		//$scope.tidText = '请输入密码'
		//$scope.showPasword = false;
		//$scope.isNoToken = true;
		//$scope.isToken = false;
		//if (localStorage.session1 != undefined && localStorage.session1 != '' || localStorage.session1 != null) {
		//    $scope.isNoToken = false;
		//    $scope.isToken = true;
		//}
		//$scope.showPassword = function () {
		//    $scope.specilPassword = '';
		//    $scope.showPasword = true;
		//    $timeout(function () {
		//        $(".p_input").focus();
		//    }, 100);
		//};
		//
		//$scope.changePassword = function () {
		//    console.log($scope.specilPassword)
		//    switch ($scope.specilPassword) {
		//        case 'Xxd88':
		//            console.log($scope.specilPassword)
		//            $scope.tidText = '密码正确';
		//            $scope.isNoToken = false;
		//            $scope.isToken = true;
		//            $scope.showPasword = false;
		//            localStorage.setItem('session1', '123');
		//            break;
		//        default:
		//            $scope.tidText = '请输入正确密码';
		//    }
		//};
		//$scope.hidePasword = function () {
		//    $scope.showPasword = false;
		//};

		if($location.search().utm_source) {
			localStorage.utm_source = $location.search().utm_source;
			localStorage.uid = $location.search().uid;
		}

		// 首页立即注册大框框在已经登录的时候去掉 - 20160525
		var userId = localStorage.getItem("userId");
		if(userId == undefined || userId == "") {
			angular.element(".index-login").css("display", "block");
		} else {
			angular.element(".index-login").css("display", "none");
		}

		      
				IndexService.Picture().success(function() {
					$scope.IndexImag = IndexService.getPicture();
					for(var i=0; i<$scope.IndexImag.length; i++){
						$scope.IndexImag[i].number=i;
					}		
					//console.log($scope.IndexImag);
				});
		//$scope.IndexImag = IndexService.getPicture();
		//		angular.element('.carousel').carousel({
		//			interval: 3000,
		//			wrap: true
		//		});
		
		
		$scope.$on('ngRepeatFinished2', function(ngRepeatFinishedEvent) {
			
			$('#slides').slides({
			container: 'slides_container',
			preload: true,
			play: 4000,
			pause: 1500,
			hoverPause: true,
			effect: 'slide',
			slideSpeed: 850,
			next: 'prev',
			prev: 'next'
		});

		$("#sdt_menu li").eq(0).addClass("current");
		$('#sdt_menu > li').bind('mouseenter', function() {
			var $elem = $(this);
			$elem.find('img').stop(true).animate({
				'width': '132px',
				'height': '60px',
				'left': '0px'
			}, 400, 'easeOutBack').andSelf().find('.sdt_wrap').stop(true).animate({
				'top': '35px'
			}, 500, 'easeOutBack').andSelf().find('.sdt_active').stop(true).animate({
				'height': '35px'
			}, 300, function() {
				var $sub_menu = $elem.find('.sdt_box');
				if($sub_menu.length) {
					var left = '170px';
					if($elem.parent().children().length == $elem.index() + 1)
						left = '-170px';
					$sub_menu.show().animate({
						'left': left
					}, 200);
				}
			});

		}).bind('mouseleave', function() {
			var $elem = $(this);
			var $sub_menu = $elem.find('.sdt_box');
			if($sub_menu.length > 0) {
				$sub_menu.hide().css('left', '0px');
			}
			$elem.find('.sdt_active').stop(true).animate({
				'height': '0px'
			}, 300).andSelf().find('img').stop(true).animate({
				'width': '0px',
				'height': '0px',
				'left': '85px'
			}, 400).andSelf().find('.sdt_wrap').stop(true).animate({
				'top': '0'
			}, 500);
		});
			
		});
		//获取计划列表
		$scope.getList = function() {
			$http.get(HOST_URL + "/plan/notnew?order=desc&limit=6&page=" + 1).success(function(responseData) {
				if(responseData.resultCode == "0") {
					$scope.bottomPlans1 = responseData.resultData;

				 

									
				}

				if(!(/msie [6|7|8|9]/i.test(navigator.userAgent))) {
					//WOW.js
					
					new WOW().init();
				};

			}).error(function() {
				//				$mdDialog.show(
				//					$mdDialog.alert()
				//					.clickOutsideToClose(true)
				//					.title('提示')
				//					.textContent('获取计划列表时发生错误，请刷新重试，若多次刷新无效，请联系客服解决。')
				//					.ok('确定')
				//				);
			})
		};

		$scope.plans = {};
		//获取体验计划,这个后来改为新手标
		$scope.getExPlan = function() {

			$http.get(HOST_URL + "/plans?order=desc&type=" + 1 + "&limit=" + 1).success(function(responseData) {
								//console.log(responseData.resultData);
				if(responseData.resultCode == "0") {
					$scope.plans = responseData.resultData;
					
				}
				var a = (($scope.plans[0]['nowSum'] / $scope.plans[0]['amount']) * 100) > 100 ? 100 : ($scope.plans[0]['nowSum'] / $scope.plans[0]['amount'] * 100);
				//新手专享插入圆圈数据
				radialIndicatorInstance['indicator1'].animate(a);

			}).error(function(responseData) {
				
			})
		};
		//获取媒体资讯
		$scope.getNews = function() {
			$http.get(HOST_URL + "/news/list?limit=2&page=" + 1).success(function(responseData) {
				if(responseData.resultCode == "0") {
					$scope.newsList = responseData.resultData;
				//console.log($scope.newsList);
				}
			}).error(function() {
				
			})
		};
		//获取平台公告
		$scope.getNotice = function() {
			$http.get(HOST_URL + "/notice/list?limit=8&page=" + 1
				//			 {},
				//              {
				//                  headers: {
				//                      'Content-Type': 'application/json'
				//                  }
				//              }
			).success(function(responseData) {
								//console.log(responseData);
				if(responseData.resultCode == "0") {
					$scope.noticeList = responseData.resultData;
					//console.log($scope.noticeList);
				}

			}).error(function() {
				
			})
		};

		//获取日投资数据排行榜
		$scope.getDayList = function() {
			$http.get(HOST_URL + "/user/investment/ranking?key=day"
				//			 {},
				//              {
				//                  headers: {
				//                      'Content-Type': 'application/json'
				//                  }
				//              }
			).success(function(responseData) {
				if(responseData.resultCode == "0") {
					var dayListData=responseData.resultData;
					
					for(var i=0; i<dayListData.length; i++){
						dayListData[i].number=i+1;
					}			
					$scope.dayList = dayListData;
//					console.log($scope.dayList);
					

				}

			}).error(function() {
				
			})
		};

		//获取月投资数据排行榜
		$scope.getMonthList = function() {
			$http.get(HOST_URL + "/user/investment/ranking?key=month"
				//			 {},
				//              {
				//                  headers: {
				//                      'Content-Type': 'application/json'
				//                  }
				//              }
			).success(function(responseData) {
				if(responseData.resultCode == "0") {
					var monthListData=responseData.resultData;
					for(var i=0; i<monthListData.length; i++){
						monthListData[i].number=i+1;
					}			
					$scope.monthList = monthListData;

				}

			}).error(function() {
				
			})
		};
		//获取总投资数据排行榜
		$scope.getTotalList = function() {
			$http.get(HOST_URL + "/user/investment/ranking?key=total"
				//			 {},
				//              {
				//                  headers: {
				//                      'Content-Type': 'application/json'
				//                  }
				//              }
			).success(function(responseData) {
                if(responseData.resultCode == "0") {
					var totalListData=responseData.resultData;
					for(var i=0; i<totalListData.length; i++){
						totalListData[i].number=i+1;
					}			
					$scope.totalList = totalListData;
//               console.log($scope.totalList);
				}

			}).error(function() {
				
			})
		};
		$scope.getDayList();
		$scope.getMonthList();
		$scope.getTotalList();
		$scope.getExPlan();
		$scope.getList();
		$scope.getNews();
		$scope.getNotice();
		//进度条
		//$scope.circle = [
		//    {r: {}, l: {}},
		//    {r: {}, l: {}},
		//    {r: {}, l: {}}
		//];
		//
		//$scope.synRealPlans = IndexService.synPlans(0, 3,3).then(function () {
		//    $scope.realPlans = IndexService.getPlans();
		//    $scope.circleFun($scope.realPlans, 0);
		//});
		//
		//$scope.synExpPlans = IndexService.synPlans(1, 3,null).then(function () {
		//    $scope.expPlans = IndexService.getPlans();
		//});
		//
		//$scope.synCarPlans = IndexService.synPlans(2, 3,1).then(function () {
		//    $scope.carPlans = IndexService.getPlans();
		//    $scope.circleFun($scope.carPlans, 2);
		//
		//});
		//$scope.specialPlan = IndexService.specialPlan(3, 1).then(function () {
		//    $scope.special = IndexService.getspecialPlans();
		//    $scope.circleFun($scope.special, 3);
		//
		//});

		//$scope.synTotal = InvestmentService.synTotal().then(function () {
		//    $scope.Total = InvestmentService.getTotal();
		//    $scope.Total.RunningTime = parseInt($scope.Total.RunningTime) + 1;
		//});

		// 公告栏
		//$scope.circleFun = function (plans, type) {
		//    var i;
		//    var limit;
		//    if (type == 0) {
		//        i = 3;
		//        limit = 3 + plans.length;
		//    } else if (type == 3) {
		//        i = 6;
		//        limit = 6 + plans.length;
		//    }
		//    else {
		//        i = 0;
		//        limit = plans.length;
		//    }
		//
		//    for (var k = 0; i < limit; i++, k++) {
		//        var plan = plans[k];
		//        var mask = Math.floor((plan.nowSum / plan.amount) * 100) * 3.6;
		//        $scope.circle[i] = {r: {}, l: {}};
		//        if (mask <= 180) {
		//            $scope.circle[i].r = {
		//                'transform': "rotate(" + mask + "deg)",
		//                '-webkit-transform': "rotate(" + mask + "deg)",
		//                '-moz-transform': "rotate(" + mask + "deg)",
		//                '-o-transform': "rotate(" + mask + "deg)",
		//                '-ms-transform': "rotate(" + mask + "deg)"
		//            };
		//        } else {
		//            $scope.circle[i].r = {
		//                'transform': "rotate(180deg)",
		//                '-webkit-transform': "rotate(180deg)",
		//                '-moz-transform': "rotate(180deg)",
		//                '-o-transform': "rotate(180deg)",
		//                '-ms-transform': "rotate(180deg)"
		//            };
		//            $scope.circle[i].l = {
		//                'transform': "rotate(" + (mask - 180) + "deg)",
		//                '-webkit-transform': "rotate(" + (mask - 180) + "deg)",
		//                '-moz-transform': "rotate(" + (mask - 180) + "deg)",
		//                '-o-transform': "rotate(" + (mask - 180) + "deg)",
		//                '-ms-transform': "rotate(" + (mask - 180) + "deg)"
		//            };
		//        }
		//    }
		//};
	})

	.factory('IndexService', function($http, $mdDialog) {
		//var plans;
		//var itemList;
		var ListObject = {};
		var eachPages;
		var picture;
		return {
			getPicture: function() {
				return picture;
			},
			//synPlans: function (planType, planLimit,staging) {
			//    var str=""
			//    if(staging!=null){
			//       str = "&staging="+staging
			//    }
			//    return $http.get(HOST_URL + "/plans?order=desc&type=" + planType + "&limit=" + planLimit+str).success(function (responseData) {
			//        plans = responseData;
			//        console.log(plans)
			//    }).error(function (responseData) {
			//        $mdDialog.show(
			//            $mdDialog.alert()
			//                .clickOutsideToClose(true)
			//                .title('提示')
			//                .textContent('获取计划列表时发生错误，请刷新重试，若多次刷新无效，请联系客服解决。')
			//                .ok('确定')
			//        );
			//    });
			//}
			Picture: function() {
				return $http.get(HOST_URL + "/banner/list?type=index", {
					cache: true
				}).success(function(responseData) {
					 if(responseData.resultCode == "0") {	
					picture = responseData.resultData;

					}
				}).error(function(responseData) {
					//					$mdDialog.show(
					//						$mdDialog.alert()
					//						.clickOutsideToClose(true)
					//						.title('提示')
					//						.textContent('获取计划列表时发生错误，请刷新重试，若多次刷新无效，请联系客服解决。')
					//						.ok('确定')
					//					);
				});
			},
			selectPages: function(page, items, eachPageCount) {
				if(eachPageCount != null) {
					eachPages = eachPageCount;
				} else {
					eachPages = 5;
				}
				var totalPage = Math.ceil(items.length / eachPages);
				ListObject.totalPages = totalPage;
				ListObject.itemList = [];
				var limit;
				if(page <= 1) {
					page = 1;
				}

				if(page >= totalPage && totalPage > 0) {
					page = totalPage;
				}

				if(page == totalPage || items.length == 0) {
					limit = items.length;
				} else {
					limit = page * eachPages;
				}
				for(var loopI = (page - 1) * eachPages; loopI < limit; loopI++) {
					items[loopI].indexId = loopI + 1;
					ListObject.itemList.push(items[loopI]);
				}
				ListObject.startIndex = (page - 1) * eachPages + 1;
				ListObject.nowPage = page;

				ListObject.pages = [];

				if(ListObject.nowPage > 3 && ListObject.totalPages > 7) {
					if(ListObject.nowPage + 3 < ListObject.totalPages) {
						for(var i = 0; i < 7; i++) {
							ListObject.pages[i] = {};
							ListObject.pages[i].showNumber = ListObject.nowPage - 3 + i;
							ListObject.isShowDot = true;
						}
					} else if(ListObject.nowPage + 3 >= ListObject.totalPages) {
						for(var i = 6; i >= 0; i--) {
							ListObject.pages[6 - i] = {};
							ListObject.pages[6 - i].showNumber = ListObject.totalPages - i;
							ListObject.isShowDot = false;
						}
					}
				} else if(ListObject.nowPage <= 3 && ListObject.totalPages > 8) {
					for(var i = 0; i <= 6; i++) {
						ListObject.pages[i] = {};
						ListObject.pages[i].showNumber = i + 1;
						ListObject.isShowDot = true;
					}
				} else {
					for(var i = 0; i < ListObject.totalPages; i++) {
						ListObject.pages[i] = {};
						ListObject.pages[i].showNumber = i + 1;
						ListObject.isShowDot = false;
					}
				}
				return ListObject;
			}
		}
	}).directive('onFinishRenderFilters2', function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element, attr) {
				if(scope.$last === true) {
					$timeout(function() {
						scope.$emit('ngRepeatFinished2');
					});
				}
			}
		}
	});