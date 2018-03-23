var accessid = '';
var accesskey = '';
var local_host = HOST_URL;
var host = HOST_URL;
var policyBase64 = '';
var signature = '';
var callbackbody = '';
var filename = '';
var key = '';
var expire = 0;
var g_object_name = '';
var g_object_name_type = '';
var now = timestamp = Date.parse(new Date()) / 1000;

function send_request() {
    var xmlhttp = null;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xmlhttp != null) {
        var serverUrl = host
            + '/user/'
            + localStorage.getItem("userId")
            + '/validations/image?type=PUT&token='
            + localStorage.getItem("token")
            + "&validationsType="
            + localStorage.getItem("validationsType");
        xmlhttp.open("GET", serverUrl, false);
        xmlhttp.send(null);
        return xmlhttp.responseText
    }
    else {
        alert("您的浏览器不支持 XMLHTTP.");
    }
}

function check_object_radio() {
    var tt = document.getElementsByName('myradio');
    for (var i = 0; i < tt.length; i++) {
        if (tt[i].checked) {
            g_object_name_type = tt[i].value;
            break;
        }
    }
}

function get_signature() {
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000;
    if (expire < now + 3) {
        body = send_request();
        var obj = eval("(" + body + ")");
        host = obj['host'];
        policyBase64 = obj['policy'];
        accessid = obj['accessid'];
        signature = obj['signature'];
        expire = parseInt(obj['expire']);
        callbackbody = obj['callback'];
        key = obj['dir'];
        return true;
    }
    return false;
}

function random_string(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function get_suffix(filename) {
    pos = filename.lastIndexOf('.');
    suffix = '';
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

function calculate_object_name(filename) {
    if (g_object_name_type == 'local_name') {
        g_object_name += "${filename}"
    }
    else if (g_object_name_type == 'random_name') {
        suffix = get_suffix(filename);
        g_object_name = key + random_string(10) + suffix
    }
    return ''
}

function get_uploaded_object_name(filename) {
    if (g_object_name_type == 'local_name') {
        tmp_name = g_object_name;
        tmp_name = tmp_name.replace("${filename}", filename);
        return tmp_name
    }
    else if (g_object_name_type == 'random_name') {
        return g_object_name
    }
}

function set_upload_param(up, filename, ret) {
    if (ret == false) {
        ret = get_signature()
    }
    g_object_name = key;
    if (filename != '') {
        suffix = get_suffix(filename);
        calculate_object_name(filename)
    }
    new_multipart_params = {
        'key': g_object_name,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'callback': callbackbody,
        'signature': signature
    };

    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });

    up.start();
}

var uploader = new plupload.Uploader({
    runtimes: 'html5,flash,silverlight,html4',
    browse_button: 'selectfiles',
    //multi_selection: false,
    container: document.getElementById('container'),
    flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
    silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
    url: 'http://oss.aliyuncs.com',

    filters: {
        mime_types: [ //只允许上传图片和zip,rar文件
            {title: "Image files", extensions: "jpg,gif,png,bmp"}
            // {title: "Zip files", extensions: "zip,rar"}
        ],
        max_file_size: '2mb', //最大只能上传5mb的文件
        prevent_duplicates: true //不允许选取重复文件
    },

    init: {
        PostInit: function () {
            document.getElementById('ossfile').innerHTML = '';
            document.getElementById('postfiles').onclick = function () {
                set_upload_param(uploader, '', false);
                return false;
            };
        },

        FilesAdded: function (up, files) {
            if (up.files.length > 1 || uploader.files.length > 1) {
                document.getElementById('console').appendChild(document.createTextNode("\n一次只允许上传一个文件"));
                return;
            }
            plupload.each(files, function (file) {
                document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
                    + '<div class="progress" style="width: 100%;"><div class="progress-bar" style="width: 0%"></div></div>'
                    + '</div>';
            });
        },

        BeforeUpload: function (up, file) {
            check_object_radio();
            set_upload_param(up, file.name, true);
        },

        UploadProgress: function (up, file) {
            var d = document.getElementById(file.id);
            d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            var prog = d.getElementsByTagName('div')[0];
            var progBar = prog.getElementsByTagName('div')[0];
            progBar.style.width = file.percent + '%';
            progBar.setAttribute('aria-valuenow', file.percent);
        },

        FileUploaded: function (up, file, info) {
            if (info.status == 200) {
                var postData = {};
                postData[localStorage.getItem("validationsType")] = get_uploaded_object_name(file.name);
                postData = JSON.stringify(postData);
                $.ajax({
                    url: local_host + "/user/" + localStorage.getItem("userId") + "/validations?token=" + localStorage.getItem("token"),
                    type: 'POST',
                    data: postData,
                    contentType: 'application/json',
                    success: function (data, status, xhr) {
                        document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = ' 上传成功！';
                    },
                    Error: function (xhr, error, exception) {
                        document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = ' 回调到服务器时失败！';
                    }
                });
                // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = ' 上传成功，文件名：' + get_uploaded_object_name(file.name);
            }
            else {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
            }
        },

        Error: function (up, err) {
            if (err.code == -600) {
                document.getElementById('console').appendChild(document.createTextNode("\n选择的文件超过了2M"));
            }
            else if (err.code == -601) {
                document.getElementById('console').appendChild(document.createTextNode("\n选择的文件后缀不对"));
            }
            else if (err.code == -602) {
                document.getElementById('console').appendChild(document.createTextNode("\n这个文件已经上传过一遍了"));
            }
            else {
                document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
            }
        }
    }
});

uploader.init();
