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
            url: location.protocol + '//' + location.host + '/investment/planList_borrower.php',
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
    var _html_pagination = '<table style="margin-top: 30px;width:100%;" class="tab_table" cellpadding="0" cellspacing="2" id="tab_0" align="center">';
    _html_pagination += '<tr bgcolor="#3baeda">';
    _html_pagination += '<td width="60" height="38" align="center" style="color:#fff;">序号</td>';
    _html_pagination += '<td width="60" height="38" align="center" style="color:#fff;">用户名</td>';
    _html_pagination += '<td width="60" height="38" align="center" style="color:#fff;">姓名</td>';
    _html_pagination += '<td width="200" height="38" align="center" style="color:#fff;">学校</td>';
    _html_pagination += '<td width="60" height="38" align="center" style="color:#fff;">借款金额</td>';
    _html_pagination += '<td width="160" height="38" align="center" style="color:#fff;">身份证</td>';
    _html_pagination += '<td width="160" height="38" align="center" style="color:#fff;">学生证</td>';
	_html_pagination += '<td width="160" height="38" align="center" style="color:#fff;">描述</td>';
    _html_pagination += '</tr>';
    for (var i = 0; i < data.length; i++)
    {
        f++;
        _html_pagination += '<tr>';
        _html_pagination += '<td width="60" height="38" align="center"style="color:#666;">'+f+'</td>';
        _html_pagination += "<?php $length = strlen($value['acc']); echo ar::cn_substr($value['acc'], intval($length/4),0,'UTF-8','***').ar::cn_substr($value['acc'], intval($length/4),intval($length*3/4),'UTF-8',''); ?>";
        _html_pagination += "<td width=\"100\" height=\"38\" align=\"center\"style=\"color:#666;\"><?=ar::cn_substr($value['r_name'],1,0,'UTF-8','**')?>";
        _html_pagination += '<td width="200" height="38" align="center"style="color:#666;"><?=$value["school"]?></td>';
        _html_pagination += '<td width="100" height="38" align="center"style="color:#666;"><?=$value["amount"]?></td>';
		_html_pagination += '<td width="165" height="110" align="center"style="color:#666;">';
        if (data[i]['idCard'])
        {            
            _html_pagination += "<?php echo '<img role=\"showImg\" style=\"cursor: pointer;\" src=\"'.$value['idCard'].'\" height=\"100\" width=\"160\" />';?>";
        }
		_html_pagination += '</td>';
        _html_pagination += '<td width="165" height="110" align="center"style="color:#666;">';
        if (data[i]['studentCard'])
        {            
            _html_pagination += "<?php echo '<img role=\"showImg\" style=\"cursor: pointer;\" src=\"'.$value['studentCard'].'\" height=\"100\" width=\"160\" />';?>";
        }
		_html_pagination += '<td width="100" height="38" align="center"style="color:#666;"><?=ar::cn_substr($value["adminAddDecr"], 30,0,"UTF-8","...")?></td>';
        _html_pagination += '</tr>';
    }
    _html_pagination += '</table>';
    
    $("#template_pagination").html(_html_pagination);
}