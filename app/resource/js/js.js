// JavaScript Document
$(function(){
	var t = n = 0, count = $(".package p").size();
	$("ul li:eq(0) a img").addClass("IMG_caise");
	$("[banner]").eq(0).removeClass("m").addClass("m1");
		$(function(){
			$("#thumb-view a").click(function() {
				//点击触发事件：取消自动并延续自动。
				clearInterval(t);
				t = setInterval("showAuto()",7000);
				   var i = $("#thumb-view a").index($(this));   
				   	   n = i;
				   for(j=0; j<8; j++){
					   if(j==i){
						   $("ul li:eq(j) a img").addClass("IMG_caise");
						   $("[banner]").eq(j).removeClass("m").addClass("m1");
					   }else{
						   $("ul li:eq(j) a img").removeClass("IMG_caise");
						   $("[banner]").eq(j).removeClass("m1").addClass("m");
					   }
				   }
					   if (i >= count) return i=0;
				   $(".over_con span").html($(".package p").eq(i).find("img").attr('alt'));
				   $(".package p").filter(":visible").hide().parent().children().eq(i).fadeIn(500); 
				});
						t = setInterval("showAuto()",7000);
				})
					//焦点触发。
					$("a").focus(function(){
						$(this).blur();
						return false;
					});
					
	//自动轮播效果。
	function showAuto(){				
			n = n >= (count - 1) ? 0 : ++n;						
			$("#thumb-view a").eq(n).trigger('click');
			$("[banner]").eq(n).removeClass("m").addClass("m1");			
	}
	})