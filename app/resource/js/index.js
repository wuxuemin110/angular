// 执行时间
var exeTime = 0;
var exeNumber = 0;
$(function () {
    // 每隔3秒执行切换广告
    window.setInterval(function () {
        exeTime += 500;
        if (exeTime > 3000)
        {
            switchSlider(exeNumber);
        }
    }, 500);
    
    $('[role="ajax-img"]').click(function(){
        var jumpUrl = $(this).attr('jump-url');
        if (!(jumpUrl == '' || jumpUrl == undefined))
        {
        }
    });
});

// 广告
function switchSlider(n)
{
    var total = 0;
    $('.carousel-img').each(function () {
        $(this).removeClass('active');
    });
    $('.carousel-img').each(function () {
        var sort = $(this).attr('sort');
        if (sort == n)
        {
            total = $(this).attr('total');
            $(this).addClass('active');
        }
    });
    $('.cr-tab').each(function () {
        $(this).removeClass('active');
    });
    $('.cr-tab').each(function () {
        var sort = $(this).attr('sort');
        if (sort == n)
        {
            $(this).addClass('active');
        }
    });

    if (n + 1 == total)
    {
        exeNumber = 0;
    }
    else
    {
        exeNumber = n + 1;
    }
    exeTime = 0;
}