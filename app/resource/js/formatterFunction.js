//格式化时间代码----------------------------------------------------
Date.prototype.format =function(format)
{
    var o = {
    "M+" : this.getMonth()+1, //month
"d+" : this.getDate(),    //day
"h+" : this.getHours(),   //hour
"m+" : this.getMinutes(), //minute
"s+" : this.getSeconds(), //second
"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
"S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
    (this.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
    format = format.replace(RegExp.$1,
    RegExp.$1.length==1? o[k] :
    ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}

var showVal = ""
var addTimeFun = function(value,rows){
	if(value==null ||value==''){
		return '';
	}
	return new Date(value).format('yyyy-MM-dd hh:mm:ss');
//	return new Date(parseInt(value) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");   
}
var invest_addTimeFun = function(value,rows){
	value = rows.verifyTime
	
	showVal = new Date(parseInt(value) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ") 
	return showVal;   
}
// 数量格式化 111,111
var numFormat = function(num){
	if(num == 0)
	{
		return num;
	}
	else
	{
		n = 2; 
		num = parseFloat((num + "").replace(/[^\d\.-]/g, "")).toFixed(n) + ""; 
		var l = num.split(".")[0].split("").reverse(); 
		t = ""; 
		for (i = 0; i < l.length; i++) { 
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : ""); 
		} 
		return  t.split("").reverse().join("");
	}
}
//金额格式化  12,345.00
var moneyFormat = function(money){
	if(money == 0)
	{
		return money;
	}
	else
	{
		n = 2; 
		money = parseFloat((money + "").replace(/[^\d\.-]/g, "")).toFixed(n) + ""; 
		var l = money.split(".")[0].split("").reverse(), r = money.split(".")[1]; 
		t = ""; 
		for (i = 0; i < l.length; i++) { 
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : ""); 
		} 
		return  t.split("").reverse().join("") + "." + r;
	}
}

var borrowTypeName=function(value,rows){
	switch (value) {
	case 101:
		 return "秒还标";
		break;
	case 102:
		 return "信用标";
		break;
	case 103:
		 return "抵押标";
		break;
	case 104:
		 return "净值标";
		break;
	case 110:
		 return "流转标";
		break;
	case 112:
		 return "担保标";
		break;
	default:
		break;
	}
}

var typeFun = function(value,rows){
	switch (value)
	{
		case 1:
			showVal = "网银直联"
			break;
		case 2:
			showVal = "网上支付"
			break;	
		case 3:
			showVal = "线下支付"
			break;	
	}
	return showVal;
}//充值类型

var paymentFun = function(value,rows){
	if(value==undefined)
	{
		showVal = "手动充值"
	} else{
		showVal = value
	}
	return showVal;
}//充值方式（银行）

var rechargeStatus= function(value,rows){
	switch (value)
	{
		case 0:
			showVal = "审核中"
			break;
		case 1:
			showVal = "充值成功"
			break;	
		case 2:
			showVal = "充值失败"
			break;	
	}
	return showVal;
}//充值状态

var verifyRemarkFun = function(value,rows){
	if(value===undefined)
	{
		showVal = "——"
	}else{
		showVal = value
	}
	return showVal
}//管理备注

var CashStatusFun = function(value,rows){
	switch (value)
	{
		case 0:
			showVal = "申请中";
			break;
		case 1:
			showVal = "财务复审通过";
			break;
		case 2:
			showVal = "财务复审不通过";
			break;
		case 4:
			showVal = "用户取消";
			break;		
		case 5:
			showVal = "客服初审通过";
			break;	
		case 6:
			showVal = "客服初审不通过";
			break;	
		case 7:
			showVal = "财务初审通过";
			break;	
		case 8:
			showVal = "财务初审不通过";
			break;		
	}
	return showVal;
}//提现状态/** 状态 0：申请提现 5：客服初审通过，6：客服初审不通过 7：财务初审通过，8：财务初审不通过 1：财务复审通过，2：财务复审不通过 4：用户取消 */


var operateStatusFun =  function(value,rows){
	value=rows['status'];
	var Id = rows['id'];
	if(value==0||value==5||value==7)
	{
		showVal = '<a href="###" onclick="location.href=\'/member/cash/cancel.html?id='+Id+'\'"><font color="red">取消</font></a>'
	}
	else{
		showVal = "——"
	}
	return showVal
}//提现操作


var filepicFun=function(value,rows){
	return "<a href='"+rows.picPath+"' target='_blank'>查看</a>";
}

//投资数据处理------------------------

var slideBar = function(value,rows){
	var accountYes = rows['accountYes'];
	var account = rows['account'];
	showVal = ((accountYes/account)*100).toString();
	showVal = showVal.substr(0,4);
	return showVal;
}//进度条的显示

var invest_borrowDay = function(value,rows){
	if(rows.isDay == 1)
	{
		showVal = rows.timeLimitDay + "天"
	}else{
		showVal = value + "个月"
	}	
	return showVal
}

var invest_dayApr = function(value,rows){
	showVal = "年利率：<font class='c_red'>"+value+"</font>"
	return showVal
}//年利率

var  invest_TypeFun = function(value,rows){
	var imgType,type_title,dayImg="",lockImg="",awardImg="";
	if(rows.partAccount){
		awardImg = '<a rel="tooltip" class="aimg" data-original-title="奖励标" ><img src="'+webroot+theme+'/images/award.png"></a>'
	}
	if(rows.pwd){
		awardImg = '<a rel="tooltip" class="aimg" data-original-title="定向标" ><img src="'+webroot+theme+'/images/lock.png"></a>'
	}
	if(rows.isDay){
		awardImg = '<a rel="tooltip" class="aimg" data-original-title="天标" ><img src="'+webroot+theme+'/images/day.png"></a>'
	}
	switch (rows.type)
	{
		case 101:
			showVal = "miao.png";//秒还标
			type_title = "秒还标";
			break;
		case 102:
			showVal = "xin.png";//信用标
			type_title = "信用标";
			break;	
		case 103:
			showVal = "pledge.png";//抵押标
			type_title = "抵押标";
			break;
		case 104:
			showVal = "jing.png";//净值标
			type_title = "净值标";
			break;	
		case 105:
			showVal = "bao.png";//担保标
			type_title = "担保标";
			break;
		case 108:
			showVal = "yuyue.png";//预约标
			type_title = "预约标";
			break;
		case 110:
			showVal = "flow.png";//流转标
			type_title = "流转标";
			break;
		case 112:
			showVal = "offvouch.png";//线下担保标
			type_title = "线下担保标";
			break;
		case 113:
			showVal = "bao.png";//质押标
			type_title = "质押标";
			break;
		case 115:
			showVal = "shi.png";//事业标
			type_title = "事业标";
			break;
		case 116:
			showVal = "lian.png";//联名担保标
			type_title = "联名担保标";
			break;
	}
	imgType = '<a rel="tooltip" class="aimg" data-original-title="'+type_title+'" ><img src="'+webroot+theme+'/images/'+showVal+'"></a>'
				+awardImg+dayImg+lockImg;
	return imgType;
}//借款标种以及提示语句
var  invest_typeTxtFun = function(value,rows){
	value = rows['type']
	switch (value)
	{
		case 101:
			showVal = "秒标满额系统自动还款"; 
			break;
		case 102:
			showVal = "网站给予的信用额度借款标";
			break;	
		case 103:
			showVal = "小微企业现场审核抵押标";
			break;
		case 104:
			showVal = "借款者在网站内资产做保障的借款标";
			break;	
		case 105:
			showVal = "担保标";
			break;
		case 108:
			showVal = "预约标";
			break;
		case 110:
			showVal = "网站内流转的借款标";
			break;
		case 112:
			showVal = "线下担保标";
			break;
		case 113:
			showVal = "质押标";
			break;
		case 115:
			showVal = "事业标";
			break;
		case 116:
			showVal = "联名担保标";
			break;
	}
	return showVal;
}//借款标种以及提示语句
var invest_flowYes = function(value,rows){
	if(rows['type']==110)
	{
		showVal = "已经流转："+value
	}else{
		showVal = null
	}
	return showVal
}//已经流转标显示
var lowestAccount = function(value,rows){
	if(rows.type!=110){
		if(value==0){
			showVal = "无限制"
		}else{
			showVal = value+"元"
		}
	}else{
		if(rows.lowestSingleLimit==0){
			showVal = "无限制"
		}else{
			showVal = value+"元"
		}
	}
	return showVal
}
var mostAccount = function(value,rows){
	if(rows.type!=110){
		if(value==0){
			showVal = "无限制"
		}else{
			showVal = value+"元"
		}
	}else{
		if(rows.mostSingleLimit==0){
			showVal = "无限制"
		}else{
			showVal = value+"元"
		}
	}
	return showVal
}
var invest_flowAll = function(value,rows){
	
	if(rows['type']==110)
	{
		showVal = "总份数："+value
	}else{
		showVal = null
	}
	return showVal
}//流转总份数显示

var invest_borrowStatus = function(value,rows){
	var statusTxt = "";
	var statusClass = "";
	switch (value)
	{
		case -1:
			statusTxt = "用户取消";
			statusClass = "forbid";
			break;
		case 0:
			statusTxt = "等待审批";
			statusClass = "nowinvest";
			break;
		case 1:
			if(rows.account == rows.accountYes){
				statusTxt = "等待复审";
				statusClass = "nowinvest";
			}else{
				statusTxt = "立即投标";
				statusClass = "nowinvest";
			}
			break;
		case 2:
			statusTxt = "管理员撤回";
			statusClass = "forbid";
			break;
		case 3:
			statusTxt = "复审通过";
			statusClass = "nowinvest";
			break;
		case 4:
			statusTxt = "复审失败";
			statusClass = "forbid";
			break;
		case 5:
			statusTxt = "用户取消";
			statusClass = "forbid";
			break;
		case 6:
			statusTxt = "还款中";
			statusClass = "forbid";
			break;
		case 7:
			statusTxt = "还款中";
			statusClass = "forbid";
			break;
		case 8:
			statusTxt = "已还款";
			statusClass = "forbid";
			break;
		case 19:
			statusTxt = "自动投标";
			statusClass = "forbid";
			break;
		case 59:
			statusTxt = "用户取消";
			statusClass = "forbid";
			break;
	}
	return ("<span class='"+statusClass+"'>"+statusTxt+"</span>");//nowinvest forbid
}//借款标状态显示

var invest_refund = function(value,rows){
	switch (value)
	{
		case 1:
			showVal = "等额本息";
			break;
		case 2:
			showVal = "一次性还";
			break;
		case 3:
			showVal = "每月付息";
			break;
		case 4:
			showVal = "提前付息到期还本";
			break;
		case 5:
			showVal = "每月提前还息到期还本";
			break;
	}
	return showVal
}//还款方式

//投资页面---------------------------
//我的借款----------START-----------------
var logBorrow = "";
var logBorrowTypeFun = function(value,rows){
	switch (value)
	{
		case 105:
			logBorrow = "担保标";
			break;
		default:
			logBorrow = "普通标";
			break;	
	}
	return logBorrow;
}//标类型
var logBorrowNameFun = function(value,rows){
	if(value.length > 8){
		return "<a href='/invest/detail.html?id="+rows.id +"&startTime="+rows.addTime+"' title='"+value+"' target='_blank'>"+value.substring(0,8)+"...</a>";
	}else{
		return "<a href='/invest/detail.html?id=" + rows.id + "&startTime="+rows.addTime+"' title='" + value + "' target='_blank'>" + value + "</a>";
	}
}//标题
var logBorrowTimeLimitFun = function(value,rows){
	if(rows.type == 101){
		return "满标即还";
	}else if(rows.isDay != undefined && rows.isDay == 1){
		return rows.timeLimitDay + "天";
	}else{
		return rows.timeLimit + "个月";
	}
}//期限
var logBorrowStatusFun = function(value,rows){
	return "待登记";
	if(status == 0){
		return "待登记";
	}else if(status == 9){
		return "待确认";
	}else if(status == 11){
		return "待初审";
	}else if(rows.status == 1 && rows.scales == 100){//进度为100则满标复审中
		if(rows.type != 110){
			return "满标审核中";
		}else{
			return "认购已满标";
		}
	}else if(rows.status == 1 && rows.flow){
		return "已流标";
	}else if(rows.status == 1 && rows.scales != 100){
		return "初审通过";
	}else if(rows.status == 2){
		return "初审未通过";
	}else if(rows.status == 3){
		return "复审通过";
	}else if(rows.status == 4 || rows.status == 49){
		return "复审未通过";
	}else if(status == -2){
		return "撤回处理中";
	}else if(rows.status == 5 || rows.status == 59){
		return "管理员撤回";
	}else if(rows.status == 6){
		return "还款中";
	}else if(rows.status == 7){
		return "部分还款";
	}else if(rows.status == 8){
		if(rows.type == 110){
			return "停止流转";
		}else{
			return "还款成功";
		}
	}else{
		return "已撤回";
	}
}//状态
var tenderStatusFun = function(value,rows){
	if(rows.status == 0 || rows.scales != 100){
		return "未满标复审";
	}else if(rows.status == 1){
		return "满标复审通过";
	}else{
		return "满标复审未通过";
	}
}//投标状态
var logBorrowOperateFun = function(value,rows){
	if(rows.status == 0){
		if(rows.type == 110){
			return "<a href='/borrow/loan.html?borrowId=" + rows.id + "&type=flow'>编辑</a>|" + 
			       '<a href="#" onClick=cancel("/member/borrow/cancel.html?id='+rows.id+'") >撤回</a>';
		}else if(rows.type == 103){
			return "<a href='/borrow/loan.html?borrowId=" + rows.id + "&type=fast'>编辑</a>|" + 
		           '<a href="#" onClick=cancel("/member/borrow/cancel.html?id='+rows.id+'") >撤回</a>';
		}else if(rows.type == 102){
			return "<a href='/borrow/loan.html?borrowId=" + rows.id + "&type=month'>编辑</a>|" + 
		           '<a href="#" onClick=cancel("/member/borrow/cancel.html?id='+rows.id+'") >撤回</a>';
		}else if(rows.type == 101){
			return "<a href='/borrow/loan.html?borrowId=" + rows.id + "&type=miaobiao'>编辑</a>|" + 
		           '<a href="#" onClick=cancel("/member/borrow/cancel.html?id='+rows.id+'") >撤回</a>';
		}else if(rows.type == 112){
			return "<a href='/borrow/loan.html?borrowId=" + rows.id + "&type=offvouch'>编辑</a>|" + 
		           '<a href="#" onClick=cancel("/member/borrow/cancel.html?id='+rows.id+'") >撤回</a>';
		}
	}else if(rows.status == 6 || rows.status == 7 || rows.status == 8){
		return "<a href='/member/borrow/repayment.html?borrowId=" + rows.id + "' >还款明细</a>";
	}else{
		return '-';
	}
}//操作
//我的借款----------END-----------------
var protocolBorrowerOperateFun = function(status,id,type){
	alert(type);
	if(status == 3 || status == 6 || status == 7 || status == 8 || (type == "113" && status == 1) || (type == "115" && status == 1)){ //添加判断是否满标复审通过
		return "<a href='/member/borrow/borrowerProtocol.html?borrowId=" + id + "' >下载协议</a>";
	}else{
		return "-" + status;
	}
}
var protocolTenderOperateFun = function(value,rows){
	if(rows.status == 1 && rows.scales == 100){ //添加判断是否满标复审通过
		return "<a href='/member/invest/tenderProtocol.html?tenderId=" + rows.id+ "' >下载协议</a>";
	}else{
		return "-";
	}
}


//我的投资 S
var investPeriodFun=function(value,rows){
	if(rows.borrowStyle==2){
		return "1/1";
	}
	if(rows.borrowStyle&&rows.timeLimit){
		return (rows.period+1)+"/"+rows.timeLimit;
	}else{
		return (rows.period+1)+"/"+1;
	}
}
//我的投资 E




//还款明细 S
var repayTypeFun=function(value,rows){
	if(value==105){
		return "担保标";
	}
	return "普通标";
}


var repayPeriodFun=function(value,rows){
	if(rows.borrowStyle!=2){
		return "第"+(rows.period+1)+"期/总共"+rows.timeLimit+"期";
	}else{
		return "第"+(rows.period+1)+"期/总共"+(rows.period+1)+"期";
	}
}

var repayTimeFun=function(value,rows){
	if(value>0){
		return new Date(value).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
	}
	return "-";
}
var repayProcessFun=function(value,rows){
	if(rows.repaymentYesAccount>0 && rows.repaymentAccount>0){
		return rows.repaymentYesAccount/rows.repaymentAccount;
	}
	return 0;
}
var repayStatusFun1=function(value,rows){
	switch(rows.borrowStatus){
	case 0:
		return "发布审批中";
	case 1:
		if(rows.account_yes==rows.account){
			if(rows.type!=110){
				return "满标审核中";
			}else{
				return "认购已满标";
			}
		}else{
			return "正在募集"
		}
	case 2:
		return "审核失败";
	case 3:
		return "已满标";
	case 4:
		return "满标审核失败";
	case 5:
		return "撤回";
	case 6:
		return "还款中";
	case 7:
		return "部分还款";
	case 8:
		if(rows.type==110){
			return "停止流转";
		}
		return "还款成功";
	}
}
var isDayFun=function(value,rows){
	if(value==1){
		return rows.timeLimitDay+"天";
	}
	return rows.timeLimit+"月";
}
var repayOpearteFun=function(value,rows){
//	if(rows.borrowStatus==0&&rows.type!=110){
//		if(rows.type!=110){
//			return "<a href='#' onclick=" + "javascript:if(confirm('确定要撤回此招标')) location.href='/member/borrow/cancel.html?id=" + rows.borrow.id + "'" + ">撤回</a>";
//		}else{
//			return '<a href="/borrow/loan.html?id='+rows.borrow.id+'">编辑</a>';
//		}
//	}else if(rows.borrowStatus=1 && rows.type!=110){
//		return "<a href='#' onclick=" + "javascript:if(confirm('确定要撤回此招标')) location.href='/member/borrow/cancel.html?id=" + rows.borrow.id+">撤回</a>";
//	}
//	if(rows.borrowStatus==3 || rows.borrowStatus>5){
//		return '<a href="/member/borrow/repaymentdetail.html?borrow_Id='+rows.borrow.id+'" >还款明细</a>';
//	}
	if(rows.status==1){
		return '已还款';
	}else if(rows.status==3){
		return '处理中';
	}else{
		return '<a href="#" onClick=repay("/member/borrow/doPriorRepay.html?repaymentId='+rows.id+'") >提前还款</a>--<a href="#" onClick=repay("/invest/ymdRepaySkip.html?repaymentId='+rows.id+'") >还款</a>';
	}
}
var repayStatusFun=function(value,rows){
	if(rows.status==0){
		return '待还款';
	}else if(rows.status==2){
		return '网站垫付';
	}else if(rows.status==1){
		return '已还款';
	}else if(rows.status==3){
		return '还款处理中';
	}
}
//还款明细 E

//投标记录 S
var isAutoTenderFun = function(value, rows){
	if(rows.isAutoTender == 0){
		return '网站投标';
	}else if(rows.isAutoTender==1){
		return '自动投标';
	}else if(rows.isAutoTender==2){
		return '手机投标';
	}
}
//投标记录 E

//信用额度 S
var amountStatusFun=function(value,rows){
	switch(value){
	case -1:
		return "审核未通过";
	case 1:
		return "审核通过";
	default:
		return "正在审核";
	}
}
var verifyTimeFun=function(value,rows){
	if(rows.status!=0&&rows.status!=2){
		return new Date(value).format('yyyy-MM-dd hh:mm:ss');  
	}			
	return "-";
}

var accountNewFun=function(value,rows){
	if(value>0){
		return value;
	}else{
		return "-";
	}
}
//信用额度 E

var investTypeFun = function(value,rows)
{
		
}

//信用额度申请
var creditApplyFun = function(value,rows){
	if(value==-1){
		showVal = "审核未通过";
	}else if(value==1){
		showVal = "审核通过";
	}	
	else{
		showVal = "正在审核";
	}
	return showVal;
}
var fileCredit = function(value,rows){
	if(value==null){
		showVal = 0;
	}else{
		showVal = value;
	}
	return showVal;
}
var fileStatus = function(value,rows){
	if(value==0){
		showVal = "未审核";
	}else if(value==2){
		showVal = "审核未通过";
	}else{
		showVal = "审核通过";
	}
	return showVal;
}


//站内信操作-----------

var friendOperate;
var friendOperateFun = function(value,rows){
	if(rows.status == 1){
		friendOperate = "<a href='/member/friend/delete.html?userId=" + rows.user.userId + "&friendUserId=" + rows.friend.userId + "'>删除好友</a>";
		friendOperate += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='/member/friend/addBlack.html?userId=" + rows.user.userId + "&friendUserId=" + rows.friend.userId + "'>加入黑名单</a>";
	}else if(rows.status == 0){
		friendOperate = "<a href='/member/friend/add.html?userId=" + rows.user.userId + "&friendUserId=" + rows.friend.userId + "'>新增好友</a>";
	}
	return friendOperate;
}//好友管理的操作

var message;
var messageTitleFun = function(value,rows){
		message = "<a href='/member/message/view.html?id=" + rows.id + "&type=box'>" + rows.title + "</a>";
	return message;
}//站内信标题
var messageIdFun = function(value,rows){
	message = "<input type='checkbox' class='J_msginput' name='id' value='" + rows.id + "'/>";
	return message;
}
var messageStatusFun = function(value,rows){
	if(rows.status == 0){
		message = "<div class='icon_unread'></div>";
	}else{
		message = "<div class='icon_read'></div>";
	}
	return message;
}//未读和已读的状态
var messageStatus1Fun = function(value,rows){
	message = "<div class='icon_xin_no'></div>";
	return message;
}
var messageTitle1Fun = function(value,rows){
	message = "<a href='/member/message/view.html?id=" + rows.id + "&type=sent'>" + rows.title + "</a>";
	return message;
}


function messageOperate(){
	var checkBox = $("#J_messageAll");
	var checkChild = $(".J_msginput");
	var delBtn = $("#J_delmessage");
	var readBtn = $("#J_readmessage");
	var unreadBtn = $("#J_unreadmessage");
	var delSentBtn = $("#J_delsent");
	var operateUrl = "/member/message/set.html?type=";
	var idVal = ""
	function checkAll(){
		var flag = false;
		checkBox.click(function(){
			if(flag)
			{
				$(this).prop("checked",false);
				checkChild.prop("checked",false)
				flag = false;
			}else{
				$(this).prop("checked",true);
				checkChild.prop("checked",true)
				flag = true;
			}
		})
	}
	checkAll();//选中所有的邮件
	
	
	function messageFun(){
		delBtn.click(function(){
			msgCommon($(this),delMethod)
		});//删除收件箱的选中邮件
		readBtn.click(function(){
			msgCommon($(this),readMethod)
		});//收件箱的设置邮件为已读
		unreadBtn.click(function(){
			msgCommon($(this),unreadMethod)
		});//收件箱的设置邮件为未读
		delSentBtn.click(function(){
			msgCommon($(this),delMethod)
		})
		
		function msgCommon(obj,fun){
			var typeVal = obj.attr("data-value");
			var that = "";
			idVal = "";
			checkChild.each(function(){
				that = $(this);
				if(that.is(":checked"))
				{
					idVal = idVal+"&id="+that.val();
				}
				return idVal;
			});
			$.ajax({
				url:operateUrl+typeVal+idVal+"&random="+(new Date()).getTime(),
				type:"post",
				success:function(data){
					checkChild.each(function(){
						if($(this).is(":checked"))
						{
							fun($(this),data)
						}
					})
				}
			})
		}
		
		function delMethod(obj,data){
			if(data.result==true)
			{
				obj.parents("tr").remove();
			}else{
				layer.alert("删除失败")
			}
		}//删除函数
		
		
		function readMethod(obj,data){
			if(data.result==true)
			{
				
				obj.parents("tr").find(".icon_unread").addClass("icon_read").removeClass("icon_unread");
			}else{
				layer.alert("标记失败")
			}
		}//标记邮件为已读函数
		
		function unreadMethod(obj,data){
			if(data.result==true)
			{
				obj.parents("tr").find(".icon_read").addClass("icon_unread").removeClass("icon_read");
			}else{
				layer.alert("标记失败")
			}
		}//标记邮件为未读函数
		
		
	}
	messageFun();
	
}


//站内信删除邮件
$(function(){
	function viewDel(){
		var delBtn = $("#J_viewDel");
		delBtn.click(function(){
			var _url = $(this).attr("data-value");
			$.ajax({
				url:_url,
				type:"post",
				success:function(data){
					if(data.result)
					{
						window.location.href="/member/message/detail.html"
					}else{
						layer.alert(" 删除失败")
					}
				}
			})
		})
	}
	viewDel();
})

//债权转让记录
var credit;
var creditStatusFun = function(value,rows){
	debugger;
	switch(value){
	case 0:
		credit = "发布";
		break;
	case 1:
		credit = "审核通过";
		break;
	case 2:
		credit = "审核未通过";
		break;
	case 3:
		credit = "转让成功";
		break;
	case 4:
		credit = "复审未通过";
		break;
	case 5:
		credit = "撤回";
		break;
	default:
		credit = "错误信息";
		break;
	}
	return credit;
}//状态

var creditOperateFun = function(value,rows){
	credit = "<a href='/member/creditAssignment/buy.html?ca_id=" + rows.id + "'>债权购买明细</a>";
	return credit;
}//操作

var creditStatusFun1 = function(value,rows){
	switch(value){
	case 0:
		credit = "未成交";
		break;
	case 1:
		credit = "已成交";
		break;
	case 2:
		credit = "撤回";
		break;
	}
	return credit;
}

var awardFun = function(value,rows){
	if(value==0 || value==undefined){
		showVal = "无"
	}else{
		showVal = value+"%";
	}
	return showVal
}
var creditBuyFeeStatusFun = function(value,rows){
	switch(value){
	case 0:
		credit = "冻结中";
		break;
	case 1:
		credit = "已收取";
		break;
	default:
		credit = "已退回";
		break;
	}
	return credit;
}

var creditProtocolFun = function(value,rows){
	credit = "<a href='#' onclick=" + "javascript:if(confirm('确定要下载吗？')) location.href='/member/creditAssignment/protocol.html?type=2&ca_id=" + rows.id + "'" + ">下载</a>";
	return credit;
}//协议下载

//咨询服务列表的超链接
var articleHref = function(value,rows){
	if(rows.nid)
	{
		showVal = "/article/detail.html?nid="+rows.nid+"&id="+rows.id
	}
	else{
		showVal = "/article/detail.html?id="+rows.id
	}
	return showVal
};


function borrowStatus(){
	var scales = $("#scales").val();
	var type = $("#type").val();
	var statusBox = $("#invest_statusBtn");
	var statusVal = statusBox.attr("data-value");
	var statusTxt = "";
	var statusClass = "";
	switch (statusVal)
	{
		case "-1":
			statusTxt = "用户取消";
			break;
		case "0":
			statusTxt = "等待初审";
			break;
		case "1":
			statusTxt = "初审通过";
			break;
		case "2":
			statusTxt = "初审未通过";
			break;
		case "3":
			statusTxt = "复审通过";
			break;
		case "4":
		case "49":
			statusTxt = "复审不通过";
			break;
		case "5":
			statusTxt = "后台管理员撤回";
			break;
		case "6":
			statusTxt = "还款中";
			break;
		case "7":
			statusTxt = "还款中";
			break;
		case "8":
			statusTxt = "已还款";
			break;
		case "19":
			statusTxt = "自动投标";
			break;
		case "59":
			statusTxt = "后台管理员撤回";
			break;
	}
	$("#invest_info_status").text(statusTxt)
	if(statusVal==1&&scales==100&&type!=110){//判断是否满标
		statusBox.append("<span class='investbtn'>满标等待复审</span>");//nowinvest forbid
	}else if(statusVal==1&&scales==100&&type==110){
		//type取值暂时取不到，等前端修改到这一部分再处理 2014-08-05
		statusBox.append("<span class='investbtn'>流转中</span>");
	}else if(statusVal==1&&scales!=100){
		statusBox.append("<input type='submit' class='investbtn' value='确认提交'/>");//nowinvest forbid
	}else{
		statusBox.append("<span class='investbtn'>"+statusTxt+"</span>");//nowinvest forbid
	}
}//投资内页，借款标状态显示
$(function(){
	borrowStatus();
});
function _jsonIE(_string){
	if ($.browser.msie && ($.browser.version<"8.0") && !$.support.style) { 
		_string = JSON.parse(_string); //_string:IE7下的json数据,为string类型
		return _string
	}else{
		return _string
	}
}

//添加序号
var indexFun = function(value,rows){
	var len = rows.data;
}
//积分状态
var storeStatus = function(value,rows){
	if(value == 0){
		return "未审核";
	}else if(value == 1){
		return "审核通过";
	}else if(value == 2){
		return "审核不通过";
	}else{
		return "无用数据";
	}
}

