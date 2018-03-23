var isContinue = true;
var planId = $('#planId').val();
$(function () {
    window.onload = function () {
        init(1, 6, 0, '');
        investmentBorrowList();
    }
});

function investmentBorrowList()
{
    if (isContinue)
    {
        isContinue = false;
        $.ajax({
            type: "POST",
            url: location.protocol + '//' + location.host + '/investment/investmentBorrowList.php',
            data: 'planId='+planId+'&pageIndex=' + pageIndex + '&pageSize=' + pageSize,
            dataType: "json",
            before: function () {
            },
            success: function (result) {
                if (result.code == 'N00000')
                {
                    loadPagination(result.data.pageIndex, result.data.totalPages, investmentBorrowList);
                    loadTemplate(result.data.data,result.data.date);
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

function loadTemplate(data, date)
{
    var f = (pageIndex - 1) * pageSize;
    var _html_pagination = '<table class="table-yyyy">';
    var ext;
    var reg = /BF/;
    _html_pagination += '<tr>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">序号</th>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">借款人姓名</th>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">金额</th>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">借款时间</th>';
    _html_pagination += '<th class="t1" style="background-color: #36abde;">协议</th>';
    _html_pagination += '</tr>';
    for (var i = 0; i < data.length; i++)
    {
        if (reg.test(data[i].agreement_code)) {
            ext = '.pdf';
        } else {
            ext = '.txt';
        }
        f++;
        _html_pagination += '<tr>';
        _html_pagination += '<td height="34" align="center">'+f+'</td>';
        _html_pagination += '<td align="center">'+(data[i].r_name ? data[i].r_name : '')+'</td>';
        _html_pagination += '<td align="center">' + (data[i].moneys ? data[i].moneys : '') + '</td>';
        _html_pagination += '<td align="center">'+(date ? date : '')+'</td>';
        _html_pagination += '<td align="center">' + (data[i].agreement_code ? '<a onclick="window.open(\'xieyi/' + data[i].agreement_code + ext + '\', \'newwindow\', \'height=600, width=1600, top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no\')" href="javascript:viod(0)" style="color:#999;">点击查看</a>' : '无') + '</td>';
        _html_pagination += '</tr>';
    }
    _html_pagination += '</table>';
    
    $("#template_pagination").html(_html_pagination);
}