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
            url: location.protocol + '//' + location.host + '/investment/planList_investor.php',
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
    var _html_pagination = '<table class="tab_table" cellpadding="0" cellspacing="2" id="tab_2" align="center">';
    _html_pagination += '<tr bgcolor="#3baeda">';
    _html_pagination += '<td width="262" height="38" align="center" style="color:#fff;">序号</td>';
    _html_pagination += '<td width="262" height="38" align="center" style="color:#fff;">用户名</td>';
    _html_pagination += '<td width="262" height="38" align="center" style="color:#fff;">加入金额</td>';
    _html_pagination += '<td width="262" height="38" align="center" style="color:#fff;">加入时间</td>';
    _html_pagination += '</tr>';
    for (var i = 0; i < data.length; i++)
    {
        f++;
		_html_pagination += '<?php $value='+data[i]+';?>';
        _html_pagination += '<tr bgcolor=\'#e1e4e9\'>';
        _html_pagination += '<td width="262" height="38" align="center">'+f+'</td>';
        _html_pagination += '<?php $for_accid="select investor_id from investor_account where id=".$value[\'account_id\'];$acc=$db->get_one($for_accid);?>';
        _html_pagination += '<?php if($acc){$for_name="select investor_name from investor where id=".$acc[\'investor_id\'];$name=$db->get_one($for_name);}?>';
        _html_pagination += '<td width="262" height="38" align="center"style="color:#666;"><?=\'*\'.ar::cn_substr($name[\'investor_name\'],20,1,\'UTF-8\',\'\')?></td>';
        _html_pagination += '<td width="262" height="38" align="center"style="color:#666;"><?=  number_format($value[\'amount_all\'],2)?>元<?php if (!empty(intval($value[\'briberyMoney\']))) { echo \'+\'.number_format($value[\'briberyMoney\'],2).\'元现金红包\';}?></td>';        
        _html_pagination += '<td width="262" height="38" align="center"style="color:#666;"><?=substr($value[\'buy_date\'],0,10)?></td>';
		_html_pagination += '</tr>';
    }
    _html_pagination += '</table>';
    
    $("#template_pagination").html(_html_pagination);
}