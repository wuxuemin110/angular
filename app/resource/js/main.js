var ary = location.href.split("&");
jQuery(".slideTxtBox").slide( { effect:ary[1],autoPlay:ary[2],trigger:ary[3],easing:ary[4],delayTime:ary[5],pnLoop:ary[6] });
jQuery(".picScroll-left").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"left",autoPlay:true,vis:7});
jQuery(".slideBox").slide({mainCell:".bd ul",effect:"leftLoop",autoPlay:true});
jQuery(".txtScroll-top").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"top",autoPlay:true});
jQuery(".picScroll-left").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:true});
$(document).ready(function(){
    $(".city").click(function(){
        $(".city-con").toggle();
    });
    $("#activity").hover(function(){
        $(".nav-sub1").toggle();
    });
    $("#service").hover(function(){
        $(".nav-sub2").toggle();
    });
    $(".city").click(function(){
        $(".city-con").toggle();
    });
});

function pageScroll(){
    //把内容滚动指定的像素数（第一个参数是向右滚动的像素数，第二个参数是向下滚动的像素数）
    window.scrollBy(0,-100);
    //延时递归调用，模拟滚动向上效果
    scrolldelay = setTimeout('pageScroll()',100);
    //获取scrollTop值，声明了DTD的标准网页取document.documentElement.scrollTop，否则取document.body.scrollTop；因为二者只有一个会生效，另一个就恒为0，所以取和值可以得到网页的真正的scrollTop值
    var sTop=document.documentElement.scrollTop+document.body.scrollTop;
    //判断当页面到达顶部，取消延时代码（否则页面滚动到顶部会无法再向下正常浏览页面）
    if(sTop==0) clearTimeout(scrolldelay);
}


$(function(){
    $('.btn_authCode').click(function(){
        if($(this).hasClass('dis')){
            return false;
        }else{
            //alert("sd");
            var mobile=$("#username").val();
            //	alert(mobile);
            if(mobile==""){
                return false;

            }//else if($("#tel_check").attr("class")!="Validform_checktip Validform_right"){
            //   return false;
            // }
            var my_v =0,my_suss=0;
            $('.btn_authCode').addClass('dis').html('已发送(<span>120</span>)');
            var count = 120;
            var timer = null;
            timer = setInterval(function(){
                count--;
                $('.btn_authCode span').text(count);
                if(count == 0){
                    clearInterval(timer);
                    $('.btn_authCode').removeClass('dis').html('获取验证码');
                }
                if(my_suss == 1){
                    if(my_v == 0){
                        alert("短信获取失败,请稍后重试！");
                    }
                }

            },1000);
            $.post("register.html",{mobile:mobile},function(v){
                my_suss = 1;
                if(v==1){
                    my_v =1;

                }else{

                    alert("短信获取失败,请稍后重试！");
                }
            });



        }
    });

});


function ShowDiv(show_div,bg_div){
    document.getElementById(show_div).style.display='block';
    document.getElementById(bg_div).style.display='block' ;
    var bgdiv = document.getElementById(bg_div);
    bgdiv.style.width = document.body.scrollWidth;
// bgdiv.style.height = $(document).height();
    $("#"+bg_div).height($(document).height());

};
//关闭弹出层
function CloseDiv(show_div,bg_div)
{
    document.getElementById(show_div).style.display='none';
    document.getElementById(bg_div).style.display='none';
};
function codefans(){
    var box=document.getElementById("MyDiv");
    box.style.display="none";
}
setTimeout("codefans()",3000);//3秒，可以改动

$(document).ready(function(){
    $("#fen").click(function(){
        $(".yin").toggle();
    });
});


//图片上传预览    IE是用了滤镜。
function previewImage(file)
{
    var MAXWIDTH  = 210;
    var MAXHEIGHT = 115;
    var div = document.getElementById('preview');
    if (file.files && file.files[0])
    {
        div.innerHTML ='<img id=imghead>';
        var img = document.getElementById('imghead');
        img.onload = function(){
            var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
            img.width  =  210;
            img.height =  115;
//
        }
        var reader = new FileReader();
        reader.onload = function(evt){img.src = evt.target.result;}
        reader.readAsDataURL(file.files[0]);
    }
    else //兼容IE
    {
        var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        file.select();
        var src = document.selection.createRange().text;
        div.innerHTML = '<img id=imghead>';
        var img = document.getElementById('imghead');
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
        var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);
    }
}
function clacImgZoomParam( maxWidth, maxHeight, width, height ){
    var param = {top:0, left:0, width:width, height:height};
    if( width>maxWidth || height>maxHeight )
    {
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;

        if( rateWidth > rateHeight )
        {
            param.width =  maxWidth;
            param.height = Math.round(height / rateWidth);
        }else
        {
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }

    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
}


//图片上传预览    IE是用了滤镜。
function previewImage1(file)
{
    var MAXWIDTH  = 105;
    var MAXHEIGHT = 122;
    var div = document.getElementById('preview1');
    if (file.files && file.files[0])
    {
        div.innerHTML ='<img id=imghead1>';
        var img = document.getElementById('imghead1');
        img.onload = function(){
            var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
            img.width  =  105;
            img.height =  122;
//
        }
        var reader = new FileReader();
        reader.onload = function(evt){img.src = evt.target.result;}
        reader.readAsDataURL(file.files[0]);
    }
    else //兼容IE
    {
        var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        file.select();
        var src = document.selection.createRange().text;
        div.innerHTML = '<img id=imghead1>';
        var img = document.getElementById('imghead1');
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
        var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);
    }
}
function clacImgZoomParam( maxWidth, maxHeight, width, height ){
    var param = {top:0, left:0, width:width, height:height};
    if( width>maxWidth || height>maxHeight )
    {
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;

        if( rateWidth > rateHeight )
        {
            param.width =  maxWidth;
            param.height = Math.round(height / rateWidth);
        }else
        {
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }

    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
}


