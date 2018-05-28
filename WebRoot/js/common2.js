var secure = null;	// 权限参数
var page = 1;	// 默认页面
var dialog = null;
var layer_loading =null;
$(function() {
	$.ajaxSettings.async = false; 
	if(moduleCode >= 0){
		findMenu(moduleCode, initFun);
	}

});


/*
 * 根据当前帐号的权限获取导航菜单
 * alex
 */
function findMenu(moduleCode, initFun) {
	console.log("findMenu");
	$.getJSON('mgr/findMenu', function(data) {
		if(!$.isSuccess(data)) return;
		var nav = $('div#nav .layui-nav').empty();
//		  $('<li class="layui-nav-item "><a href="./index.html" ><i class="layui-icon"style="font-size: 17px;color: #fff;">&#xe68e;</i> &nbsp;首页</a></li>').appendTo(nav);
		$.each(data.body, function(i, v) {
			if(!v.moduleLevel){
				$('<li class=\'layui-nav-item\' name=\''+v.moduleCode+'\'></li>')
				.append($("<a href='javascript:void(0)'></a>")
				.append(v.moduleName))
				.append(analyzeMenu(v.moduleCode, data.body))
				.appendTo(nav);
			}
		});
//		$('<li class="layui-nav-right floatright"><a href="javascript:void(0)" onclick="exit(this)">注销</a></li>').appendTo(nav);
//		$(' <li class="layui-nav-right floatright"><a href="#" data-target="#modifyPassword" onclick="modifyPassword()"><i class="layui-icon" style="font-size: 17px;color: #fff;">&#xe612;</i>'+
//		  ' &nbsp; <span class="acctInfo"></span></a></li>').appendTo(nav);
		findModuleParameter(moduleCode, initFun);
	});
}

/*
 * 解析导航菜单//即获取二级菜单
 * alex
 */
function analyzeMenu(code, data){
	var dl = '';
	dl += "<dl class='layui-nav-child'>";
	$.each(data, function(i,v){
		if(v.moduleSuperCode == code) dl += "<dd><a href='"+v.modulePage+"' target='myiframe'>"+v.moduleName+"</a></dd>"; 
	});
	dl += "</dl>";
	return dl;
}

/*
 * 获取权限信息, 传入模块编号及回调函数  
 * alex
 */
function findModuleParameter(moduleCode, initFun) {
	if(!moduleCode) return;
	console.log("findModuleParameter");
	$.getJSON('mgr/findModuleParameter', {moduleCode : moduleCode}, function(data){
		if(!$.isSuccess(data)) return;
		$('span.acctInfo').append(data.body.acctount);
		secure = data.body;
		if(!secure.find){
			$('div.main').remove();	// 删除页面主要元素
			BootstrapDialog.msg("非法操作, 你没有当前页面的权限!",BootstrapDialog.TYPE_DANGER);
			return;
		}
		$('div.main').removeClass('hide');
		if("0" != moduleCode){
//			var obj = $('ol.breadcrumb').empty();
			var obj = $('#breadCrumb .layui-breadcrumb').empty();
			obj.append($("<a ></a>").append(data.body.superModuleName));
			obj.append($("<a class='active'></a>").append(data.body.moduleName));
			$('#nav .layui-nav-ul').find('.layui-nav-item[name='+data.body.code+']').addClass('layui-this');
			$('title').text(data.body.moduleName + ' - ' + data.body.superModuleName);
		}
		$.ajaxSettings.async = true; //恢复ajax请求的异步请求
		initFun();
	});
	
}
/*
 * 获取面包绡
 * alex
 */
function findBreadcrumb(){
	$.post('mgr/findBreadcrumb', {moduleCode : moduleCode}, function(data){
		var obj = $('div#breadCrumb .layui-breadcrumb').empty();
		obj.append($("<a></a>").append(data.body.superName));
		obj.append($("<a class='active'></a>").append(data.body.name));
		$('title').text(data.body.name + ' - ' + data.body.superName);
		$('#nav .layui-nav-ul').find('.layui-nav-item[name='+data.body.code+']').addClass('layer-this');
	}, 'json');
}
/*
 * 追加面包绡
 * alex
 */
function addBreadcrumb(msg){
	$('ol.breadcrumb').find('.active').removeClass('active');
	$('ol.breadcrumb').append($("<li class='active'></li>").append(msg));
}


/*
 * 退出登录
 * alex
 */
function exit(tar){
	layer.confirm("请确认是是否需要注销登录!", function(result){
		if(!result) return;
		$.getJSON('mgr/exit', function(data){
			if(!$.isSuccess(data)) return;
			window.location.href="./login.html"; 
		});
	});
}



(function($) {
	// 获取传递的参数
	$.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	};
	// 获取项目根路径
	$.getRootPath = function(){
	    var curWwwPath=window.document.location.href; // 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	    var pathName=window.document.location.pathname; // 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	    var pos=curWwwPath.indexOf(pathName);
	    var localhostPaht=curWwwPath.substring(0,pos); // 获取主机地址，如： http://localhost:8083
	    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1); // 获取带"/"的项目名，如：/uimcardprj
	    return(localhostPaht+projectName);
	};
	// 删除空格
	$.removeTrim = function(str){
		return str.replace(/^\s+|\s+$/g,"");
	};
	// 判断返回数据的JSON头是成功还是失败
	$.isSuccess = function(data) {
		if(data.head) return data.head;
		if(!data.body) return;
		if((data.body == 'PERMISSION_DENIED' || data.body == 'UNLOGIN') && layerIndex != null){
			layer.close(layerIndex);
			if(data.body == 'UNLOGIN'){
				layer.alert(data.body, {title:'操作失败',icon: 2,skin: 'errorAlert'},function(){
					window.location.href="./login.html"; 
				});				
				return;
			}
		}else{
			layer.alert(data.body, {title:'操作失败',icon: 2,skin: 'errorAlert'});		
		}
		return data.head;
	};
})(jQuery);


//重写Data的方法。
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
/**
 * 根据传入的选择器前缀，清空input和textarea框的值
 */
$.FormClear=function(FormId){
	$(FormId+" input[name]").not("input[class*='notReset']").val("");
	$(FormId+" textarea[name]").val("");
	$.search();
};
function layerOpen_forView(title,conteId,arrea){
	if(arrea==""){
		arrea =	['30%', 'auto'];
	}
	 layer.open({
		  title: title,
		  area : arrea,
		  type : 1,
		  content: $(conteId), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
		  btn: ['关闭'],
		  shadeClose :true,
		  yes: function(index){
			    layer.close(index);
			  },
		  btnAlign: 'c'
		});
}
function layerOpen_forEdit(title,conteId,arrea){
	if(arrea==""){
		arrea =	['30%', 'auto'];
	}
	return layer.open({
		  title: title,
		  area : arrea,
		  type : 1,
		  content: $(conteId) //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
		});
}
function layerOpen_forAdd(title,conteId,arrea){
	if(arrea==""){
		arrea =	['30%', 'auto'];
	}
	return layer.open({
		  title: title,
		  area : arrea,
		  type : 1,
		  content: $(conteId) //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
		});
}
function layerLoading(){
	return layer.load(1, {
		  shade: [0.3,'#fff'] //0.3透明度的白色背景
		});
}
function layerMsg(msg,type){
	 layer.msg(msg, { icon: type, time: 2000 });//2秒关闭（如果不配置，默认是3秒）
}
var modifyPasswordLayer;
function modifyPassword(){
	modifyPasswordLayer = layer.open({
		  title: "修改密码-new",
		  area : ['30%', '280px'],
		  type : 2,
		  content:"./modify_passwordNew.html", //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
		  shadeClose :true
		});
}
$.findChecked = function(val){
	return val ? " checked=true " : "" ;
};
$.findOpeion = function(id, current){
	return id == current ? " selected=true " : "" ;
};
function changeFrameHeight(){
	
    var ifm= document.getElementById("myiframe"); 
    var iframepage=  $(".layui-body");
    ifm.height=iframepage.height();
};
window.onresize=function(){  
     changeFrameHeight(); 
};