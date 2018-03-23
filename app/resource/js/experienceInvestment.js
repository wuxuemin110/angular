var isContinue = true;
$(function () {
    window.onload = function () {
        init(1, 6, 0, '');
        investmentList();
    }
});

function investmentList()
{
    if (isContinue)
    {
        isContinue = false;
        $.ajax({
            type: "POST",
            url: location.protocol + '//' + location.host + '/investment/investmentList.php',
            data: 'planType=1&pageIndex=' + pageIndex + '&pageSize=' + pageSize,
            dataType: "json",
            before: function () {
            },
            success: function (result) {
                if (result.code == 'N00000')
                {
                    loadPagination(result.data.pageIndex, result.data.totalPages, investmentList);
                    loadTemplate(result.data.data);
                }
                else
                {
                    document.getElementById("template_pagination").innerHTML = result.message;
                }
            },
            complete: function () {
                isContinue = true;
            },
            error: function () {
            }
        });
    }
}

function loadTemplate(data)
{
    var f = (pageIndex - 1) * pageSize;
    var _html_pagination = '<table class="table-yyyy">';
    _html_pagination += '<tr>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">序号</th>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">计划名称</th>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">开始时间</th>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">结束时间</th>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">投入金额</th>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">预期年化收益</th>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">累计收益</th>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">合同</th>';
    _html_pagination += '</tr>';
    for (var i = 0; i < data.length; i++)
    {
        f++;
        _html_pagination += '<tr>';
        _html_pagination += '<td height="34" align="center">'+f+'</td>';
        _html_pagination += '<td align="center">'+data[i].plan_name.substr(-9)+'</td>';
        _html_pagination += '<td align="center">'+(data[i].begin_time ? data[i].begin_time.substr(0,10) : '')+'</td>';
        _html_pagination += '<td align="center">'+(data[i].begin_time ? data[i].end_time.substr(0,10) : '')+'</td>';
        _html_pagination += '<td align="center">'+data[i].amount+'元</td>';
        _html_pagination += '<td align="center">'+data[i].money_rate+'%</td>';
        _html_pagination += '<td align="center">'+data[i].had_profit+'元</td>';
        _html_pagination += '<td align="center">';
         if (data[i]['state'] == 1)
        {
            _html_pagination += '收益中';
        }
        else if (data[i]['state'] == 2)
        {
            _html_pagination += '已结束';
        }
        else
        {
            _html_pagination += '未开始';
        }
        _html_pagination += '</td>';
        _html_pagination += '</tr>';
    }
    _html_pagination += '</table>';

    $("#template_pagination").html(_html_pagination);

}