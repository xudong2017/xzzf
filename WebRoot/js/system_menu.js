var moduleCode = '04003';//此处moduleCode 为必须值，用于获取其权限
var tableObj; 
var tableObjSecond;
var type = {};
var layerIndex;
var loading;
var moduleSuperCode;
var currentModuleName;
var Obj= {};
function initFun() {
	if(secure.find){
		findListInfo();
	}
	/*初始化layer组件*/
	layui.use('element', function(){
		console.log("element");
	  var element = layui.element;
	  element.init();
	  
	});
	layui.use(['layer'],function(){
		console.log("layer");
	    layui.layer;
	});
	layui.use('laytpl', function(){
		console.log("laytpl");
		  layui.laytpl;
	});
	layui.use('form', function(){
		  var form = layui.form;
		//监听提交
		  form.on('submit(Edit)', function(data){
		    Edit();//此处为layerForm 验证通过后，真正调用更新的方法
		    return false;
		  });
		  form.on('submit(Add)', function(data){
			  	Add();//此处为layerForm 验证通过后，真正调用更新的方法
			    return false;
			  });
		//监听提交
		  form.on('submit(EditSecond)', function(data){
			  EditSecond();//此处为layerForm 验证通过后，真正调用更新的方法
		    return false;
		  });
		  form.on('submit(AddSecond)', function(data){
			  AddSecond();//此处为layerForm 验证通过后，真正调用更新的方法
			    return false;
			  });
	});
	/*初始化layer组件*/
}
/*
 * 获取列表数据
 * alex
 */
function findListInfo() {
	layui.use('table', function(){
	var table = layui.table;
		tableObj = table.render({ 
			  id: 'dataTable',
			  elem: '#dataTable',
			  cols:  [[ //标题栏
//			            {checkbox: true},
//			            ,{fixed:true} //其它参数在此省略
			            {field: 'moduleId', title: '编号', width:60},
			            {field: 'moduleName', title: '模块名称', width:330,templet: '#titleTpl'},
			            {field: 'moduleCode', title: '模块编码', width:200,sort:true},
			            {field: 'time', title: '创建时间', width:200},
			            {fixed: 'right',title: '操作', width:350, templet: '#toolBar'}
			          ]],
	          page: true,
	          limits: [10,15,20] ,
	          limit: 10 ,
	          even:true,
			  url: 'mgr/findModuleFirstList',			//	  where: {searchVal : $('input.searchInput').val()},
			  method: 'post',
			  loading: true,
			  done: function(res, curr, count){
				    //如果是异步请求数据方式，res即为你接口返回的信息。
				    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
				    //得到当前页码 --curr
				    //得到数据总量 --count
				  }
			});
			//监听工具条
			table.on('tool(dataTable)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
			  var data = obj.data; 			//获得当前行数据                                   		  // var tr = obj.tr; 				//获得当前行 tr 的DOM对象
			  var layEvent = obj.event; 	//获得 lay-event 对应的值
				  if(layEvent === 'detail'){ //查看
					  /*赋值*/
					  showViewBox(data.moduleId);
				  } else if(layEvent === 'del'){ //删除
					  layer.confirm('确认要删除此条数据吗？', function(index){
					  DeleteModule(data.moduleId);				//调用删除方法
				      layer.close(index);
				    });
				  } else if(layEvent === 'edit'){ //编辑
					  showEditBox(data.moduleId);
				  } else if(layEvent === 'Module'){ //菜单管理
						listModule(data.moduleCode,data.moduleName);
				  }
			});
		
	});
}

/**
 * 条件搜索函数
 */
$.search=function(){
	tableObj.reload({
		  where: { 
		     'searchVal':$(".input-group .moduleName").val()
		  }
		});
};

/**
 * 显示添加表单
*/
function showAddBox(id){
	var formClass=".AddForm ";
	$.FormJustClear(formClass);
	layerIndex=layerOpen_forAdd("添加","div.Add","");
}
/**
 * 添加模块
 */
function Add(){
	var formClass=".AddForm ";
	Obj.moduleName = $(formClass+'input.moduleName').val();
	Obj.moduleCode = $(formClass+'input.moduleCode').val();
	Obj.moduleOrder = $(formClass+'input.moduleOrder').val();
	Obj.moduleSuperCode =$('input.moduleSuperCode').val();
	Obj.moduleLevel =$('input.moduleLevel').val();
	loading =layerLoading();
	$.post('mgr/addMenu', {moduleName : Obj.moduleName,moduleCode : Obj.moduleCode,moduleOrder:Obj.moduleOrder,moduleLevel:Obj.moduleLevel,moduleSuperCode:Obj.moduleSuperCode},
		function(data){
			layer.close(loading);
			layer.close(layerIndex);
			if(!$.isSuccess(data)) return;
			layerMsg(data.body,1);
			tableObj.reload();			
	}, 'json');
}
/**
 * 显示查看表单
*/
function showViewBox(id){
	var formClass=".ViewForm ";
	loading =layerLoading();
	$.getJSON('mgr/findMenuByid', {moduleid : id}, function(data){
		layer.close(loading);
		if(!$.isSuccess(data)) return;
		$(formClass+'input.moduleName').val(data.body.moduleName);
		$(formClass+'input.moduleCode').val(data.body.moduleCode);
		$(formClass+'input.moduleOrder').val(data.body.orderNum);


	});
	layerOpen_forView("查看","div.View","");
}
/**
 * 显示修改表单
*/
function showEditBox(id){
	Obj.moduleid = id;
	var formClass=".EditForm ";
	$.FormJustClear(formClass);
	loading =layerLoading();
	$.getJSON('mgr/findMenuByid', {moduleid : id}, function(data){
		layer.close(loading);
		if(!$.isSuccess(data)) return;
		$(formClass+'input.moduleName').val(data.body.moduleName);
		$(formClass+'input.moduleCode').val(data.body.moduleCode);
		$(formClass+'input.moduleOrder').val(data.body.orderNum);
	});
	layerIndex=layerOpen_forEdit("修改","div.Edit","");
}
function Edit(){
	if(!Obj.moduleid) return;
	var formClass=".EditForm ";
	Obj.moduleName = $(formClass+'input.moduleName').val();
	Obj.moduleCode = $(formClass+'input.moduleCode').val();
	Obj.moduleOrder = $(formClass+'input.moduleOrder').val();
	loading =layerLoading();
	$.post('mgr/modifyMenu', {
		id : Obj.moduleid,
		name : Obj.moduleName,
		code : Obj.moduleCode,
		order : Obj.moduleOrder
	}, function(data){
		layer.close(loading);
		layer.close(layerIndex);
		if(!$.isSuccess(data)) return;
		layerMsg(data.body,1);
		tableObj.reload();						//重载表格----即刷新
	}, 'json');
}
function DeleteModule(id){
	$.getJSON('mgr/deleteModule', {id:id}, function(data){
		if(!$.isSuccess(data)) return;
		layerMsg(data.body,1);
		tableObj.reload();		
	});
}


/*
 * 模块二级菜单数据
 */
function listModule(moduleCode,moduleName){
	if(!moduleCode) return;
	 moduleSuperCode = moduleCode;
	 currentModuleName = moduleName;
	 Obj.moduleCode = moduleCode;
	 $('#ModuleTableDiv .currentModule').text("当前模块名: "+currentModuleName);
	layui.use('table', function(){
	var table = layui.table;
			  tableObjSecond = table.render({ 
			  id: 'ModuleTable',
			  elem: '#ModuleTable',
			  cols:  [[ //标题栏
//			            {checkbox: true},
//			            ,{fixed:true} //其它参数在此省略
			            {field: 'moduleId', title: '编号', width:60},
			            {field: 'moduleName', title: '菜单名称', width:150},
			            {field: 'moduleCode', title: '菜单编码', width:100,sort:true},
			            {field: 'modulePage', title: '菜单链接', width:300},
			            {field: 'time', title: '创建时间', width:170},

			            {fixed: 'right',title: '操作', width:170, fixed: 'right',templet: '#ModuletoolBar'}
			          ]],
	          even:true,
			  url: 'mgr/findModuleSecondList',			
			  where: { 'moduleCode': Obj.moduleCode},
			  method: 'post',
			  loading: true,
			  done: function(res, curr, count){
				    //如果是异步请求数据方式，res即为你接口返回的信息。
				    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
				    //得到当前页码 --curr
				    //得到数据总量 --count
				  }
			});
			//监听工具条
			table.on('tool(ModuleTable)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
			  var data = obj.data; 			//获得当前行数据                                   		  // var tr = obj.tr; 				//获得当前行 tr 的DOM对象
			  var layEvent = obj.event; 	//获得 lay-event 对应的值
				  if(layEvent === 'detail'){ //查看
					  /*赋值*/
					  showViewBoxSecond(data.moduleId);
				  } else if(layEvent === 'del'){ //删除
					  layer.confirm('真的删除行么', function(index){
					  DeleteModuleSecond(data.moduleId);				//调用删除方法
				      layer.close(index);
				    });
				  } else if(layEvent === 'edit'){ //编辑
					  showEditBoxSecond(data.moduleId);
				  } 
			});
	});
	layerIndex=layerOpen_forView("二级菜单","div.Module",['auto', '80%']);
}
/**
 * 条件搜索函数
 */
$.searchSeconde=function(){
	tableObjSecond.reload({
		  where: { 
		     'moduleName':$(".searchformSecond .input-group .moduleName").val(),
		     	'moduleCode': Obj.moduleCode
		  }
		});
};
$.FormClearSecond =function(FormId){
	$(FormId+" input[name]").val("");
	$(FormId+" textarea[name]").val("");
	$.searchSeconde();
};
/**
 * 显示添加表单
*/
function showAddBoxSecond(id){
	var formClass=".AddFormSecond ";
	$.FormJustClear(formClass);
	$(formClass+' input.moduleOrder').val('1');
	$(formClass+' input.moduleSuperCode').val(moduleSuperCode);
	$(formClass+' input.moduleLevel').val("2");
	layerIndex=layerOpen_forAdd("二级菜单添加","div.AddSecond","");
}
/**
 * 添加模块
 */
function AddSecond(){
	var formClass=".AddFormSecond ";
	Obj.moduleName = $(formClass+'input.moduleName').val();
	Obj.moduleCode = $(formClass+'input.moduleCode').val();
	Obj.modulePage = $(formClass+'input.modulePage').val();
	Obj.moduleOrder = $(formClass+'input.moduleOrder').val();
	Obj.moduleSuperCode =$(formClass+'input.moduleSuperCode').val();
	Obj.moduleLevel =$(formClass+'input.moduleLevel').val();
	loading =layerLoading();
	$.post('mgr/addMenu', {moduleName : Obj.moduleName,moduleCode : Obj.moduleCode,modulePage:Obj.modulePage,moduleOrder:Obj.moduleOrder,moduleLevel:Obj.moduleLevel,moduleSuperCode:Obj.moduleSuperCode},
		function(data){
			layer.close(loading);
			layer.close(layerIndex);
			if(!$.isSuccess(data)) return;
			layerMsg(data.body,1);
			tableObjSecond.reload();			
	}, 'json');
}
/**
 * 显示查看表单
*/
function showViewBoxSecond(id){
	var formClass=".ViewFormSecond ";
	loading =layerLoading();
	$.getJSON('mgr/findMenuByid', {moduleid : id}, function(data){
		layer.close(loading);
		if(!$.isSuccess(data)) return;
		$(formClass+'input.moduleName').val(data.body.moduleName);
		$(formClass+'input.moduleCode').val(data.body.moduleCode);
		$(formClass+'input.moduleOrder').val(data.body.orderNum);
		$(formClass+'input.modulePage').val(data.body.modulePage);


	});
	layerOpen_forView("二级菜单查看","div.ViewSecond","");
}
/**
 * 显示修改表单
*/
function showEditBoxSecond(id){
	Obj.moduleid = id;
	var formClass=".EditFormSecond ";
	$.FormJustClear(formClass);
	loading =layerLoading();
	$.getJSON('mgr/findMenuByid', {moduleid : id}, function(data){
		layer.close(loading);
		if(!$.isSuccess(data)) return;
		$(formClass+'input.moduleName').val(data.body.moduleName);
		$(formClass+'input.moduleCode').val(data.body.moduleCode);
		$(formClass+'input.moduleOrder').val(data.body.orderNum);
		$(formClass+'input.modulePage').val(data.body.modulePage);

	});
	layerIndex=layerOpen_forEdit("二级菜单修改","div.EditSecond","");
}
function EditSecond(){
	if(!Obj.moduleid) return;
	var formClass=".EditFormSecond ";
	Obj.moduleName = $(formClass+'input.moduleName').val();
	Obj.moduleCode = $(formClass+'input.moduleCode').val();
	Obj.moduleOrder = $(formClass+'input.moduleOrder').val();
	Obj.modulePage = $(formClass+'input.modulePage').val();

	loading =layerLoading();
	$.post('mgr/modifyMenu', {
		id : Obj.moduleid,
		name : Obj.moduleName,
		code : Obj.moduleCode,
		order: Obj.moduleOrder,
		page : Obj.modulePage
	}, function(data){
		layer.close(loading);
		layer.close(layerIndex);
		if(!$.isSuccess(data)) return;
		layerMsg(data.body,1);
		tableObjSecond.reload();						//重载表格----即刷新
	}, 'json');
}
function DeleteModuleSecond(id){
	$.getJSON('mgr/deleteModule', {id:id}, function(data){
		if(!$.isSuccess(data)) return;
		layerMsg(data.body,1);
		tableObjSecond.reload();		
	});
}