var moduleCode = '04003';//此处moduleCode 为必须值，用于获取其权限
var curRoleId;
var moduleSuperCode;
var currentName;
var AddsecondModuleClass=".add-secondMenu-box ";
var ModifysecondModuleClass =".modify-secondMenu-box ";
var type = {};
type.FIND = 1;
type.DELETE = 2;
type.MODIFY = 3;
type.ADD = 4;

var menu = {};
function initFun() {
	if(secure.find){
		dialog = BootstrapDialog.loading();
		findListInfo();
	}
	if(!secure.add)
		$('button.add-btn').remove();
	if(secure.add)
		$('button.add-btn').removeClass('hide');
}
/*
 * 获取列表数据
 * alex
 */
function findListInfo() {
	$.post('mgr/findModuleFirstList', {
		page : page,
		searchVal : $('input.searchInput').val()
	}, function(data) {
		var tbody = $('tbody.tbody').empty();
		dialog.close();
		if(!$.isSuccess(data)) return;
		$.each(data.body, function(i,v){
			$("<tr></tr>")
			.append($("<td></td>").append(v.moduleId))
			.append($("<td></td>").append(v.moduleName))
			.append($("<td></td>").append(v.moduleCode))
			.append($("<td></td>").append(new Date(v.timestamp).Format("yyyy-MM-dd")))   //格式化时间戳使用new Date(时间).Format("yyyy-MM-dd")
			.append($("<td></td>").append(analyzeBtns(v)))
			.appendTo(tbody);
		});
	}, 'json');
	findModulePage();
}
/*
 * 获取列表分页
 * alex
 */
function findModulePage() {
	$.post('mgr/findModuleFirstPage', {page : page,searchVal : $('input.searchInput').val()}, function(data) {
		$.analysisPage(data.body); 
	}, 'json');
}
/*
 * 解析数据列表的操作按钮
 * alex
 */
function analyzeBtns(v) {
	var btns = ""; 
	btns += secure.modify ? "<button type='button' class='btn btn-primary btn-xs' onclick='showModifyBox(" + v.moduleId + ")'><span class='glyphicon glyphicon-pencil'></span>编辑</button>&nbsp; " : "" ;
	btns += secure.modify ? "<button type='button' class='btn btn-success btn-xs' onclick='listModule(\"" + v.moduleCode + "\",\""+v.moduleName+"\")'><span class='glyphicon glyphicon glyphicon-star'></span>菜单管理</button>&nbsp; " : "" ;
	btns += secure.del ? "<button type='button' class='btn btn-danger btn-xs' onclick='hintDelete(" + v.moduleId + ")'><span class='glyphicon glyphicon-remove'></span>删除</button>&nbsp; " : "" ;
	return btns;
}
/*
 * 解析二级菜单数据列表的操作按钮
 * alex
 */
function analyzeSecondBtns(v) {
	var btns = ""; 
	btns += secure.modify ? "<button type='button' class='btn btn-primary btn-xs' onclick='showSecondModifyBox(" + v.moduleId + ")'><span class='glyphicon glyphicon-pencil'></span>编辑</button>&nbsp; " : "" ;
	btns += secure.del ? "<button type='button' class='btn btn-danger btn-xs' onclick='hintSecondModuleDelete(" + v.moduleId + ")'><span class='glyphicon glyphicon-remove'></span>删除</button>&nbsp; " : "" ;
	return btns;
}
/*
 * 显示添加角色窗口
 * alex
 */
function showAddBox(){
	$('.empty').removeClass('empty');
	$('input.moduleName').val('');
	$('input.moduleCode').val('');
	BootstrapDialog.showModel($('div.add-box'));
}
/*
 * 添加模块
 * alex
 */
function addModule(){
	$.isSubmit = true;
	menu.moduleName = $.verifyForm($('input.moduleName'), true);
	menu.moduleCode = $.verifyForm($('input.moduleCode'), true);
	menu.moduleOrder = $.verifyForm($('input.moduleOrder'), true);
	menu.moduleSuperCode =$('input.moduleSuperCode').val();
	menu.moduleLevel =$('input.moduleLevel').val();
	if(!$.isSubmit) return;
	dialog = BootstrapDialog.isSubmitted();
	$.post('mgr/addMenu', {moduleName : menu.moduleName,moduleCode : menu.moduleCode,moduleOrder:menu.moduleOrder,moduleLevel:menu.moduleLevel,moduleSuperCode:menu.moduleSuperCode},
			function(data){
		dialog.close();
		if(!$.isSuccess(data)) return;
		BootstrapDialog.hideModel($('div.add-box'));
		BootstrapDialog.msg(data.body, BootstrapDialog.TYPE_SUCCESS);
		findListInfo();
	}, 'json');
}
/*
 * 显示模块信息信息窗口
 * alex
 */
function showModifyBox(id){
	$('.empty').removeClass('empty');
	if(!id) return;
	menu.id=id;//此处为menu对象的id赋值，作为修改中的一个参数提交和判断
	dialog = BootstrapDialog.loading();
	$.getJSON('mgr/findMenuByid', {moduleid : id}, function(data){
		dialog.close();
		if(!$.isSuccess(data)) return;
		$('input.ModuleCode').val(data.body.moduleCode);
		$('input.ModuleId').val(data.body.moduleId);
		$('input.ModuleName').val(data.body.moduleName);
		$('input.ModuleOrder').val(data.body.orderNum);
		BootstrapDialog.showModel($('div.modify-box'));
	});
}
/*
 * 编辑
 * alex
 */
function modifyMenu(){
//	console.log(menu);
	if(!menu.id) return;
	$.isSubmit = true;
	menu.code = $.verifyForm($('input.ModuleCode'), true);
	menu.name = $.verifyForm($('input.ModuleName'), true);
	menu.order = $.verifyForm($('input.ModuleOrder'), true);

	if(!$.isSubmit) return;
	dialog = BootstrapDialog.isSubmitted();
	$.post('mgr/modifyMenu', {
		id : menu.id,
		code : menu.code,
		name : menu.name,
		order: menu.order
	}, function(data){
		dialog.close();
		if(!$.isSuccess(data)) return;
		BootstrapDialog.hideModel($('div.modify-box'));
		BootstrapDialog.msg(data.body, BootstrapDialog.TYPE_SUCCESS);
		findListInfo();
	}, 'json');
}
/*
 * 提示并删除数据
 * alex
 */
function hintDelete(id){
	if(!id) return;
	BootstrapDialog.confirm("请确认是否删除该数据?<br /><span class='placeholder'>PS: 删除后该模块下的所有菜单都无法显示， 请谨慎操作!<span>", function(result){
		if(!result) return;
		dialog = BootstrapDialog.isSubmitted();
		$.getJSON('mgr/deleteModule', {id:id}, function(data){
			dialog.close();
			if(!$.isSuccess(data)) return;
			BootstrapDialog.msg(data.body, BootstrapDialog.TYPE_SUCCESS);
			findListInfo();
		});
	});
}

/*
 * 模块二级菜单数据
 * alex
 */
function listModule(id,currentModuleName){
	if(!id) return;
	moduleSuperCode=id;
	currentName=currentModuleName;
	menu.code = id;
	dialog = BootstrapDialog.loading();
	$.post('mgr/findModuleSecondList', { moduleCode: menu.code,moduleName: $('.Menu-module-box input.searchInput').val()}, function(data){
		 $('div.Menu-module-box .currentModule').text("当前模块名: "+currentModuleName);
		dialog.close();
		if(!$.isSuccess(data)) return;
		var tbody = $('div.Menu-module-box table.module-table tbody.tbody').empty();
		$.each(data.body, function(i,v){
			$("<tr></tr>")
			.append($("<td></td>").append(v.moduleId))
			.append($("<td></td>").append(v.moduleName))
			.append($("<td></td>").append(v.moduleCode))
			.append($("<td></td>").append(new Date(v.timestamp).Format("yyyy-MM-dd")))   //格式化时间戳使用new Date(时间).Format("yyyy-MM-dd")
			.append($("<td></td>").append(v.modulePage))
			.append($("<td></td>").append(analyzeSecondBtns(v)))
			.appendTo(tbody);
		});
		BootstrapDialog.showModel($('div.Menu-module-box'));
	});
}
/*
 * 显示添加二级菜单窗口
 * 
 */
function showAddSeconMenu(tar){
	if(!moduleSuperCode)return;
	tar="."+tar;
	$(tar+' .empty').removeClass('empty');
	$(tar+' input.moduleName').val('');
	$(tar+' input.moduleCode').val('');
	$(tar+' input.modulePage').val('');
	$(tar+' input.moduleOrder').val('1');
	$(tar+' input.moduleSuperCode').val(moduleSuperCode);
	$(tar+' input.moduleLevel').val("1");
	BootstrapDialog.showModel($('div.add-secondMenu-box'));
}

/**
 * 添加二级菜单方法
 */
function addSecondModule(){
		$.isSubmit = true;
		menu.moduleName = $.verifyForm($(AddsecondModuleClass+'input.moduleName'), true);
		menu.moduleCode = $.verifyForm($(AddsecondModuleClass+'input.moduleCode'), true);
		menu.modulePage = $.verifyForm($(AddsecondModuleClass+'input.modulePage'), true);
		menu.moduleOrder = $.verifyForm($(AddsecondModuleClass+'input.moduleOrder'), true);
		menu.moduleSuperCode =$.verifyForm($(AddsecondModuleClass+'input.moduleSuperCode'), false);
		menu.moduleLevel =$.verifyForm($(AddsecondModuleClass+'input.moduleLevel'), false);
		if(!$.isSubmit) return;
		dialog = BootstrapDialog.isSubmitted();
		$.post('mgr/addMenu', {moduleName : menu.moduleName,moduleCode : menu.moduleCode,modulePage : menu.modulePage,moduleOrder : menu.moduleOrder,moduleLevel:menu.moduleLevel,moduleSuperCode:menu.moduleSuperCode},
				function(data){
			dialog.close();
			if(!$.isSuccess(data)) return;
			BootstrapDialog.hideModel($('div'+AddsecondModuleClass));
			BootstrapDialog.msg(data.body, BootstrapDialog.TYPE_SUCCESS);
			listModule(moduleSuperCode,currentName);
		}, 'json');
	}

/**
 * 提示并删除二级菜单数据
 */
function hintSecondModuleDelete(id){
	if(!id) return;
	BootstrapDialog.confirm("请确认是否删除该数据?<br /><span class='placeholder'>PS: 删除后该模块下的所有菜单都无法显示， 请谨慎操作!<span>", function(result){
		if(!result) return;
		dialog = BootstrapDialog.isSubmitted();
		$.getJSON('mgr/deleteModule', {id:id}, function(data){
			dialog.close();
			if(!$.isSuccess(data)) return;
			BootstrapDialog.msg(data.body, BootstrapDialog.TYPE_SUCCESS);
			listModule(moduleSuperCode,currentName);
		});
	});
}
/*
 * 显示模块信息信息窗口
 * alex
 */
function showSecondModifyBox(id){
	$('.empty').removeClass('empty');
	if(!id) return;
	menu.id=id;//此处为menu对象的id赋值，作为修改中的一个参数提交和判断
	dialog = BootstrapDialog.loading();
	$.getJSON('mgr/findMenuByid', {moduleid : id}, function(data){
		dialog.close();
		if(!$.isSuccess(data)) return;
		$(ModifysecondModuleClass+'input.ModuleCode').val(data.body.moduleCode);
		$(ModifysecondModuleClass+'input.ModuleId').val(data.body.moduleId);
		$(ModifysecondModuleClass+'input.ModuleName').val(data.body.moduleName);
		$(ModifysecondModuleClass+'input.modulePage').val(data.body.modulePage);
		$(ModifysecondModuleClass+'input.moduleOrder').val(data.body.orderNum);
		BootstrapDialog.showModel($('div'+ModifysecondModuleClass));
	});
}


/*
 * 编辑保存二级菜单
 * alex
 */
function modifySecondMenu(){
	if(!menu.id) return;
	$.isSubmit = true;
	menu.code = $.verifyForm($(ModifysecondModuleClass+'input.ModuleCode'), true);
	menu.name = $.verifyForm($(ModifysecondModuleClass+'input.ModuleName'), true);
	menu.page = $.verifyForm($(ModifysecondModuleClass+'input.modulePage'), true);
	menu.order = $.verifyForm($(ModifysecondModuleClass+'input.moduleOrder'), true);

	if(!$.isSubmit) return;
	dialog = BootstrapDialog.isSubmitted();
	$.post('mgr/modifyMenu', {
		id   : menu.id,
		code : menu.code,
		name : menu.name,
		page : menu.page,
		order: menu.order
	}, function(data){
		dialog.close();
		if(!$.isSuccess(data)) return;
		BootstrapDialog.hideModel($('div'+ModifysecondModuleClass));
		BootstrapDialog.msg(data.body, BootstrapDialog.TYPE_SUCCESS);
		listModule(moduleSuperCode,currentName);
	}, 'json');
}
$.Secondsearch= function(){
		listModule(moduleSuperCode,currentName);
	};
$.del=function(){
	 $('input.searchInput').val("");
	 $.search();
};
$.Seconddel=function(){
	 $('.Menu-module-box input.searchInput').val("");
	 $.Secondsearch();
};