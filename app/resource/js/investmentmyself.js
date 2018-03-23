var isContinue = true;
$(function () {
    window.onload = function () {
        init(1, 5, 0, '');
        planList();
    }
});

function planList()
{
    if (isContinue)
    {
        isContinue = false;
        $.ajax({
            type: "POST",
            url: location.protocol + '//' + location.host + '/investment/planListMyself.php',
            data: '&pageIndex=' + pageIndex + '&pageSize=' + pageSize,
            dataType: "json",
            before: function () {
            },
            success: function (result) {
                if (result.code == 'N00000')
                {
                    loadPagination(result.data.pageIndex, result.data.totalPages, planList);
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
    _html_pagination += '<th class="t1" style="background-color: #36abde;">交易类别</th>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">交易名称</th>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">金额</th>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">时间</th>';
    _html_pagination += '</tr>';
    for (var i = 0; i < data.length; i++)
    {
        f++;
        _html_pagination += '<tr>';
        _html_pagination += '<td>'+f+'</td>';
		_html_pagination += '<td>'+data[i]['act_type']+'</td>';
        _html_pagination += '<td>'+data[i]['act_name']+'</td>';
        _html_pagination += '<td>'+Math.abs(data[i]['amount'])+'</td>';
        _html_pagination += '<td>'+data[i]['time']+'</td>';        
        _html_pagination += '</tr>';
    }
    _html_pagination += '</table>';
    
    $("#template_pagination").html(_html_pagination);
}