var moduleCode = '04004';
var curAcctName = "";
var tableObj; 
var tableObjsecond;
var layerIndex;
var loading;//layer的loading对象
var Obj= {};
var sectionParentId;

/*初始化layer组件*/
function initFun() {
	if(secure.find){
		findListInfo();
	}

	/*初始化layer组件*/
	layui.use('element', function(){
	  var element = layui.element;
	  element.init();
	});
	layui.use(['layer'],function(){
	    layui.layer;
	});
	layui.use('laytpl', function(){
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
			            {field: 'deptId', title: '编号', width:60},
			            {field: 'deptName', title: '部门名称', width:180},
			            {field: 'time', title: '创建时间', width:150,sort:true},
			            {field: 'creator', title: '创建人', width:150},
			            {field: 'deptDescription', title: '描述', width:380},
			            {fixed: 'right',title: '操作', width:230, templet: '#toolBar'}
			          ]],
	          page: true,
	          limits: [10,15,20] ,
	          limit: 10 ,
	          even:true,
			  url: 'mgr/department/findDepartmentList',			
			  where: {'searchValue':$("#searchForm .input-group .deptName").val(),'parentId':0,'deptType':1},
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
					  showViewBox(data.deptId);
				  } else if(layEvent === 'del'){ //删除
					  layer.confirm('确认要删除此条数据吗？', function(index){
					  Delete(data.deptId);				//调用删除方法
				      layer.close(index);
				    });
				  } else if(layEvent === 'edit'){ //编辑
					  showEditBox(data.deptId);
				  } 
				  else if(layEvent === 'Section'){ //管理
					  sectionParentId="";
					  sectionParentId=data.deptId;
					  listSection(data.deptName,data.deptId);
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
		     'searchValue':$("#searchForm .input-group .deptName").val()
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
 * 添加部门
 */
function Add(){
	var formClass=".AddForm ";
	Obj.parentId = $(formClass+'input.parentId').val();
	Obj.deptType = $(formClass+'input.deptType').val();
	Obj.deptName = $(formClass+'input.deptName').val();
	Obj.deptDescription =$(formClass+'textarea.deptDescription').val();
	loading =layerLoading();
	$.post('mgr/department/addDepartment', {parentId : Obj.parentId,deptName:Obj.deptName,deptType: Obj.deptType,deptDescription:Obj.deptDescription},
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
	$.getJSON('mgr/department/findDepartmentById', {deptId : id}, function(data){
		layer.close(loading);
		if(!$.isSuccess(data)) return;
		$(formClass+'input.deptName').val(data.body.deptName);
		$(formClass+'textarea.deptDescription').val(data.body.deptDescription);
		layerOpen_forView("查看","div.View","");
	});
}

/**
 * 显示修改表单
*/
function showEditBox(id){
	Obj.deptId = id;
	var formClass=".EditForm ";
	$.FormJustClear(formClass);
	loading =layerLoading();
	$.getJSON('mgr/department/findDepartmentById', {deptId : id}, function(data){
		layer.close(loading);
		if(!$.isSuccess(data)) return;
		$(formClass+'input.deptName').val(data.body.deptName);
		$(formClass+'textarea.deptDescription').val(data.body.deptDescription);
		layerIndex=layerOpen_forEdit("部门信息修改","div.Edit","");
	});
}
function Edit(){
	if(!Obj.deptId) return;
	var formClass=".EditForm ";
	Obj.deptName =$(formClass+'input.deptName').val();
	Obj.deptDescription =$(formClass+'textarea.deptDescription').val();
	loading =layerLoading();
	$.post('mgr/department/modifyDepartment', {
		deptId : Obj.deptId,
		deptName : Obj.deptName,
		deptDescription : Obj.deptDescription 
	}, function(data){
		layer.close(loading);
		layer.close(layerIndex);
		if(!$.isSuccess(data)) return;
		tableObj.reload();								//重载表格----即刷新
		layerMsg(data.body,1);
	
	}, 'json');
}

function Delete(id){
	$.getJSON('mgr/department/deleteDepartment', {deptId:id}, function(data){
		if(!$.isSuccess(data)) return;
		layerMsg(data.body,1);
		tableObj.reload();		
	});
}


/*
 * 模块二级菜单数据
 */
function listSection(deptName,deptId){
	if(!deptId) return;
	 Obj.deptId = deptId;
	 $('#SectionTableDiv .currentDept').text("当前部门: "+deptName);
	 layui.use('table', function(){
			var table = layui.table;
				tableObjsecond = table.render({ 
					  id: 'SectionTable',
					  elem: '#SectionTable',
					  cols:  [[ //标题栏
//					            {checkbox: true},
//					            ,{fixed:true} //其它参数在此省略
					            {field: 'deptId', title: '编号', width:60},
					            {field: 'deptName', title: '科室名称', width:180},
					            {field: 'time', title: '创建时间', width:150,sort:true},
					            {field: 'creator', title: '创建人', width:150},
					            {field: 'deptDescription', title: '描述', width:380},
					            {fixed: 'right',title: '操作', width:230, templet: '#SectiontoolBar'}
					          ]],
			          page: true,
			          limits: [10,15,20] ,
			          limit: 10 ,
			          even:true,
					  url: 'mgr/department/findDepartmentList',			
					  where: {'parentId':deptId,'deptType':2},
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
					table.on('tool(SectionTable)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
					  var data = obj.data; 			//获得当前行数据                                   		  // var tr = obj.tr; 				//获得当前行 tr 的DOM对象
					  var layEvent = obj.event; 	//获得 lay-event 对应的值
						  if(layEvent === 'detail'){ //查看
							  /*赋值*/
							  showViewBoxSecond(data.deptId);
						  } else if(layEvent === 'del'){ //删除
							  layer.confirm('确认要删除此条数据吗？', function(index){
							  DeleteSecond(data.deptId);				//调用删除方法
						      layer.close(index);
						    });
						  } else if(layEvent === 'edit'){ //编辑
							  showEditBoxSecond(data.deptId);
						  } 
					});
				
			});
	layerIndex=layerOpen_forView("科室管理","div.Section",['auto', '80%']);
}
/**
 * 条件搜索函数
 */
$.FormClearSecond =function(FormId){
	$(FormId+" input[name]").val("");
	$(FormId+" textarea[name]").val("");
	$.searchSeconde();
};
/**
 * 显示添加表单
*/
function showAddBoxSecond(){
	var formClass=".AddFormSecond ";
	$.FormJustClear(formClass);
	layerIndex=layerOpen_forAdd("科室添加","div.AddSecond","");
}
/**
 * 添加模块
 */
function AddSecond(){
	var formClass=".AddFormSecond ";
	Obj.parentId = sectionParentId;
	Obj.deptType = $(formClass+'input.deptType').val();
	Obj.deptName = $(formClass+'input.deptName').val();
	Obj.deptDescription =$(formClass+'textarea.deptDescription').val();
	console.log(Obj);
	loading =layerLoading();
	$.post('mgr/department/addDepartment', {parentId : Obj.parentId,deptName:Obj.deptName,deptType: Obj.deptType,deptDescription:Obj.deptDescription},
		function(data){
			layer.close(loading);
			layer.close(layerIndex);
			if(!$.isSuccess(data)) return;
			layerMsg(data.body,1);
			tableObjsecond.reload();			
	}, 'json');
}
/**
 * 显示查看表单
*/
function showViewBoxSecond(id){
	var formClass=".ViewFormSecond ";
	loading =layerLoading();
	$.getJSON('mgr/department/findDepartmentById', {deptId : id}, function(data){
		layer.close(loading);
		if(!$.isSuccess(data)) return;
		$(formClass+'input.deptName').val(data.body.deptName);
		$(formClass+'textarea.deptDescription').val(data.body.deptDescription);
		layerOpen_forView("查看","div.ViewSecond","");
	});
}
/**
 * 显示修改表单
*/
function showEditBoxSecond(id){
	Obj.deptId = id;
	var formClass=".EditFormSecond ";
	$.FormJustClear(formClass);
	loading =layerLoading();
	$.getJSON('mgr/department/findDepartmentById', {deptId : id}, function(data){
		layer.close(loading);
		if(!$.isSuccess(data)) return;
		$(formClass+'input.deptName').val(data.body.deptName);
		$(formClass+'textarea.deptDescription').val(data.body.deptDescription);
		layerIndex=layerOpen_forEdit("科室信息修改","div.EditSecond","");
	});
}
function EditSecond(){
	if(!Obj.deptId) return;
	var formClass=".EditFormSecond ";
	Obj.deptName =$(formClass+'input.deptName').val();
	Obj.deptDescription =$(formClass+'textarea.deptDescription').val();
	loading =layerLoading();
	$.post('mgr/department/modifyDepartment', {
		deptId : Obj.deptId,
		deptName : Obj.deptName,
		deptDescription : Obj.deptDescription 
	}, function(data){
		layer.close(loading);
		layer.close(layerIndex);
		if(!$.isSuccess(data)) return;
		layerMsg(data.body,1);
		tableObjsecond.reload();						//重载表格----即刷新
	}, 'json');
}
function DeleteSecond(id){
	$.getJSON('mgr/department/deleteDepartment', {deptId:id}, function(data){
		if(!$.isSuccess(data)) return;
		layerMsg(data.body,1);
		tableObjsecond.reload();		
	});
}