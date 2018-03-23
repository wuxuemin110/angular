//编辑器加载
function loadJS(url, callback, charset) {
    var script = document.createElement('script');
    script.onload = script.onreadystatechange = function () {
        if (script && script.readyState && /^(?!(?:loaded|complete)$)/.test(script.readyState)) return;
        script.onload = script.onreadystatechange = null;
        script.src = '';
        script.parentNode.removeChild(script);
        script = null;
        if (callback) callback();
    };
    script.charset = charset || document.charset || document.characterSet;
    script.src = url;
    try { document.getElementsByTagName("head")[0].appendChild(script); } catch (e) { }
}
function initEditor(id) {
    loadJS('/xheditor/xheditor-1.1.12-zh-cn.min.js', function () { $(id).xheditor(); });
}
function get_html(url1,id){
	var html = '';
	$.ajax({   
		url: url1,   
		async: false,   
		data: "",   
		success: function(returnData){   
		  html = returnData;
		}   
    });
	return html;   
}