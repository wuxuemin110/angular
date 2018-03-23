angular.module('myApp.filter', ['ngRoute'])

	.filter('TradeType', function() {
		return function(input) {
			input = parseInt(input);
			switch(input) {
				case 0:
					return "默认";
					break;
				case 100:
					return "投资";
					break;
				case 110:
					return "使用红包券";
					break;
				case 120:
					return "使用体验金券";
					break;
				case 130:
					return "使用加息券";
					break;
				case 200:
					return "借款";
					break;
				case 300:
					return "充值现金";
					break;
				case 310:
					return "充值红包券";
					break;
				case 320:
					return "充值体验金券";
					break;
				case 330:
					return "充值加息券";
					break;
				case 400:
					return "收益";
					break;
				case 500:
					return "本金退出";
					break;
				case 600:
					return "提现";
					break;
				case 700:
					return "订单";
					break;
				case 800:
					return "活动";
					break;
				case 810:
					return "活动赠送红包券";
					break;
				case 820:
					return "活动赠送体验金券";
					break;
				case 830:
					return "活动赠送加息券";
					break;
				case 900:
					return "还款";
					break;
				default:
					return "未知状态，请联系管理员查询";
			}
		};
	})
	.filter('newDate', function($filter) {
		return function(input, format) {

			if(input != undefined) {

				var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
				var formatedDate = input.replace(pattern, '$1-$2-$3 $4:$5:$6');
				formatedDate = formatedDate.replace(new RegExp(/-/gm), "/");
				formatedDate = new Date(formatedDate);
				formatedDate = formatedDate.getTime();

				return $filter("date")(formatedDate, format);

			}

		};
	})
	.filter('RechargeConvert', function() {
		return function(input) {
			input = '' + input;
			input = input.replace(',', '');
			input = parseFloat(input).toFixed(2);
			return input;
		}
	})

	.filter('PlanState', function() {
		return function(input) {
			switch(input) {
				case 0:
					return "开放中";
					break;
				case 1:
					return "收益中";
					break;
				case 2:
					return "已结束";
					break;
				case 3:
					return "等待开放";
					break;
				case 4:
					return "隐藏";
					break;
				default:
					return "未知状态";
			}
		};
	})

	.filter('juequ1', function() {
		return function(input) {
			if(input.length >= 4) {
				input = input.substr(0, 2) + "****";
				return input;
			} else if(input.length < 4 && input.length > 2) {
				input = input.substr(0, 2) + "**";
				return input;
			} else {
				input = input.substr(0, 1) + "*";
				return input;
			}

		};
	})
	.filter('PointToMillionYuan', function() {
		return function(input) {
			if(input == null || input == "") {
				return 0;
			}
			input = parseFloat(input / 1000000).toFixed(3);
			input = input.substring(0, input.toString().length - 1)
			return input;
		};
	})

	.filter('YuanToPoint', function() {
		return function(input) {
			input = parseFloat(input) * 100;
			return input;
		};
	})
	.filter('parseInt', function() {
		return function(input) {
			input = parseInt(input);
			return input;
		};
	})
	.filter('DHtml', function($sce) {
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	})
	.filter('PointToYuan', function() {
		return function(input) {
			if(input == null || input == "") {
				return 0;
			}
			input = parseFloat(input) / 100;
			return input;
		};
	})
	.filter('Fee', function() {
		return function(input) {
			if(input < 2) {
				return 0;
			}
			if(input < 100) {
				return(input - 2).toFixed(2);
			} else {
				return input;
			}
		};
	})

	.filter('MinCost', function() {
		return function(input) {
			if(input < 0.01) {
				return 0.01;
			} else {
				return input;
			}
		}

	})

	.filter('FEE', function() {
		return function(input) {

			var p = parseInt(input)
			return p.toFixed(2);
		}
	})
	.filter('IdCard', function() {
		return function(input) {
			var p = input.substring(0, 14)
			return p + "xxxxx";
		};
	})
	.filter('BankCode', function() {
		return function(input) {
			var banks = {
				1: "中国工商银行",
				2: "中国农业银行",
				3: "中国建设银行",
				4: "民生银行",
				5: "中国银行",
				6: "兴业银行",
				7: "光大银行",
				8: "中信银行",
				9: "平安银行",
				10: "邮政银行",
				11: "交通银行",
				12: "广发银行",
				13: "浦发银行",
				14: "招商银行",
				15: "华夏银行"
			};
			for(var i = 1; i <= banks.length; i++) {
				if(i == input) {
					return banks[i];
				}
			}
			return "请选择银行";
		};
	})

	.filter('LoanState', function() {
		return function(input) {
			input = '' + input;
			input = parseInt(input);
			switch(input) {
				case 110:
					return '待审核';
				case 120:
					return '审核中';
				case 130:
					return '通过';
				case 140:
					return '未通过';
				case 210:
					return '还款中';
				case 220:
					return '已结束';
				default:
					return '异常';
			}
		}
	})
	.filter('LoanTypeTransform', function() {
		return function(input) {
			switch(input) {
				case 0:
				case 1:
				case 2:
				case 3:
					return '';
					break;
				case 4:
					return '';
				case 5:
					return '';
			}
		}
	})
	.filter('CarPlanNameTransform', function() {
		return function(input) {
			return input.replace('', '');
		}
	})
	.directive('stringToNumber', function() {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				ngModel.$parsers.push(function(value) {
					return '' + value;
				});
				ngModel.$formatters.push(function(value) {
					return parseFloat(value, 10);
				});
			}
		};
	})

	.directive('mdImg', function($http) {
		return {
			restrict: 'EA',
			replace: true,
			scope: true,
			template: getTemplate,
			link: postLink
		};

		function getTemplate(elem, attr) {
			return '<img style="height: 100px;width: 160px">';
		}

		function postLink(scope, elem, attr) {
			var i = 0;
			var timer = setInterval(function() {

				if(attr.imgKey != "" && attr.imgKey != undefined) {
					clearInterval(timer);
					if(attr.imgKey.indexOf('upload') > -1) {
						elem.attr('src', "http://120.25.147.123/" + attr.imgKey);
					} else {
						$http.get(HOST_URL + 'images?key=' + attr.imgKey).success(function(responseData) {
							if(responseData.url == null) {
								if(attr.imgKey.indexOf('http') > -1) {
									elem.attr('src', attr.imgKey);
								} else {
									elem.attr('src', 'http://xxd-audit.oss-cn-shenzhen.aliyuncs.com/' + attr.imgKey);
								}
							} else {
								if(attr.imgKey.indexOf('http') > -1) {
									elem.attr('src', attr.imgKey);
								} else {
									elem.attr('src', responseData.url);
								}
							}
						})
					}
				} else {
					++i;
					if(i > 10) {
						clearInterval(timer);
					}
				}
			}, 1000);

			elem.on('click', function() {
				scope.$parent.$parent.$apply(function() {
					scope.$parent.$parent.showImg = true;
					scope.$parent.$parent.fullImgUrl = elem.attr('src');
				});
			});

		}
	})

	.filter('RepaymentState', function() {
		return function(input) {
			switch(input) {
				case 100:
				case '100':
					return '待还款';
				case 200:
				case '200':
					return '逾期';
				case 210:
				case '210':
					return '严重逾期';
				case 300:
				case '300':
					return '已还款';
				case 400:
				case '400':
					return '一次性还款';
				default:
					return '异常';
			}
		}
	})
	.filter('bankCode', function() {
		return function(input) {
			switch(input) {
				case "0801020000":
					return "工商银行";
					break;
				case "0801030000":
					return "农业银行";
					break;
				case "0801040000":
					return "中国银行";
					break;
				case "0801050000":
					return "建设银行";
					break;
				case "0801000000":
					return "邮政储蓄银行";
					break;
				case "0804100000":
					return "平安银行";
					break;
				case "0803050000":
					return "民生银行";
					break;
				case "0803030000":
					return "光大银行";
					break;
				case "0803060000":
					return "广发银行";
					break;
				case "0803020000":
					return "中信银行";
					break;
				case "0803090000":
					return "兴业银行";
					break;
				case "0803040000":
					return "华夏银行";
					break;
				case "0803080000":
					return "招商银行";
					break;
				case "0803100000":
					return "浦发银行";
					break;
				case "0803010000":
					return "交通银行";
					break;
				case "0804031000":
					return "北京银行";
					break;
				case "0804010000":
					return "上海银行";
					break;
				default:
					return "未知状态";
			}
		};
	});