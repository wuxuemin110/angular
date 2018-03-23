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
            url: location.protocol + '//' + location.host + '/investment/planList.php',
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
    var _html_pagination = '<table class="table-l">';
    _html_pagination += '<tr>';
    _html_pagination += '<th>序号</th>';
    _html_pagination += '<th>计划名称</th>';
    _html_pagination += '<th>计划金额</th>';
    _html_pagination += '<th>加入人数</th>';
    _html_pagination += '<th>净收益率</th>';
    _html_pagination += '<th>计划时间</th>';
    _html_pagination += '<th>状态</th>';
    _html_pagination += '</tr>';
    for (var i = 0; i < data.length; i++)
    {
        f++;
        _html_pagination += '<tr>';
        _html_pagination += '<td>'+f+'</td>';
        _html_pagination += '<td><a target="_blank" style="color:#36abde;" href="licai.php?pl='+data[i]['id']+'">'+data[i]['plan_name']+'</a></td>';
        _html_pagination += '<td>'+data[i]['plan_amount']+'元</td>';
        _html_pagination += '<td>'+data[i]['all_p']+'</td>';
        _html_pagination += '<td>'+data[i]['money_rate']+'%</td>';
        if(data[i]['type']==1)
		{
		_html_pagination += '<td>'+data[i]['staging']+'天</td>';
		}
		else
		{
        _html_pagination += '<td>'+data[i]['staging']+'月</td>';
		}
        if (data[i]['state'] == 0)
        {
            if (data[i]['now_amount'] == data[i]['plan_amount'])
            {
                _html_pagination += '<td><button type="button" class="btn btn-danger index-bottom">已&nbsp;满&nbsp;标</button> </td>';
            }
            else
            {
                _html_pagination += '<td><button type="button" class="btn btn-danger index-bottom">我要加入</button></td>';
            }
        }
        else if (data[i]['state'] == 1)
        {
            _html_pagination += '<td><button type="button" class="btn btn-warning index-bottom">收&nbsp;益&nbsp;中</button></td>';
        }
        else if (data[i]['state'] == 2)
        {
            _html_pagination += '<td><button type="button" class="btn btn-primary index-bottom">已结束</button></td>';
        }
        else if (data[i]['state'] == 3)
        {
            _html_pagination += '<td> <button type="button" class="btn btn-info index-bottom">等待开放</button></td>';
        }
        _html_pagination += '</tr>';
    }
    _html_pagination += '</table>';
    
    $("#template_pagination").html(_html_pagination);
}