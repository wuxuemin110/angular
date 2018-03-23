// JavaScript Document
$(function(){
$('.png a').mouseover(function(){
	
	//var _left = $(this).css("left");
	var _index = $(this).index();
	if(_index>0){
	if(_index>=3){
		var _num = 33+131*(_index-1)+7*(_index-2);
	}else{
		var _num = 33+131*(_index-1);	
	}
	//alert(_index);
	$(".js_bj").stop().animate({left:_num},'fast');
	}
	//alert($('object').attr("id"));
});

});