var moduleCode = '04002';
var curRoleId;
var tableObj; 
var type = {};
type.FIND = 1;
type.DELETE = 2;
type.MODIFY = 3;
type.ADD = 4;


var role = {};
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
	    layui.layer;
	});
	layui.use('laytpl', function(){
		  layui.laytpl;
	});
	layui.use('form', function(){
		  var form = layui.form;
		//监听提交
		  form.on('submit(Edit)', function(data){
			EditRole();//此处为layerForm 验证通过后，真正调用更新的方法
		    return false;
		  });
		  form.on('submit(Add)', function(data){
				AddRole();//此处为layerForm 验证通过后，真正调用更新的方法
			    return false;
			  });
	});
	/*初始化layer组件*/
}
/*
 * 获取列表数据
 * te5l.com [K]
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
			            {field: 'id', title: '编码', width:60},
			            {field: 'name', title: '角色名称', width:250,templet: '#titleTpl'},
			            {field: 'time', title: '创建时间', width:120,sort:true},
			            {field: 'creator', title: '创建人', width:100},
			            {field: 'description', title: '角色简介', width:370},
			            {fixed: 'right',title: '操作', width:270, templet: '#toolBar'}
			          ]],
	          page: true,
	          limits: [10,15,20] ,
	          limit: 10 ,
	          even:true,
			  url: 'mgr/role/findRoleList2',			//	  where: {searchVal : $('input.searchInput').val()},
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
					  showViewBox(data.id);
				  } else if(layEvent === 'del'){ //删除
					  layer.confirm('真的删除行么', function(index){
					  DeleteRole(data.id);				//调用删除方法
				      layer.close(index);
				    });
				  } else if(layEvent === 'edit'){ //编辑
					  showEditBox(data.id);
				  } else if(layEvent === 'Module'){ //编辑
					  showModuleList(data.id);
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
		     'searchVal':$(".input-group .modifyRoleName").val()
		  }
		});
};
/*
 * 显示添加表单
*/
function showAddBox(id){
	var formClass=".AddForm ";
	$.FormClear(formClass);
	layerIndex=layerOpen_forAdd("添加","div.Add","");
}
/*
 * 添加角色
 */
function AddRole(){
	var formClass=".AddForm ";
	role.name = $(formClass+'input.modifyRoleName').val();
	role.desc = $(formClass+'textarea.modifyRoleDesc').val();
	loding =layerLoading();
	$.post('mgr/role/addRole', {name : role.name,desc : role.desc}, function(data){
		layer.close(loding);
		layer.close(layerIndex);
		if(!$.isSuccess(data)) return;
		layerMsg(data.body,1);
		tableObj.reload();			
	}, 'json');
}
/*
 * 显示查看表单
*/
function showViewBox(id){
	var formClass=".ViewForm ";
	loding =layerLoading();
	$.getJSON('mgr/role/findRoleById', {id : id}, function(data){
		layer.close(loding);
		if(!$.isSuccess(data)) return;
		$(formClass+'input.modifyRoleName').val(data.body.name);
		$(formClass+'textarea.modifyRoleDesc').val(data.body.description);
	});
	layerOpen_forView("查看","div.View","");
}
/*
 * 显示修改表单
*/
var layerIndex;
var loding;
function showEditBox(id){
	role.id = id;
	var formClass=".EditForm ";
	$.FormClear(formClass);
	loding =layerLoading();
	$.getJSON('mgr/role/findRoleById', {id : id}, function(data){
		layer.close(loding);
		if(!$.isSuccess(data)) return;
		$(formClass+'input.modifyRoleName').val(data.body.name);
		$(formClass+'textarea.modifyRoleDesc').val(data.body.description);
	});
	layerIndex=layerOpen_forEdit("修改","div.Edit","");
}
function EditRole(){
	if(!role.id) return;
	var formClass=".EditForm ";
	role.name = $(formClass+'input.modifyRoleName').val();
	role.desc = $(formClass+'textarea.modifyRoleDesc').val();
	loding =layerLoading();
	$.post('mgr/role/modifyRole', {
		id : role.id,
		name : role.name,
		desc : role.desc
	}, function(data){
		layer.close(loding);
		layer.close(layerIndex);
		if(!$.isSuccess(data)) return;
		layerMsg(data.body,1);
		tableObj.reload();						//重载表格----即刷新
	}, 'json');
}
function DeleteRole(id){
	$.getJSON('mgr/role/deleteRole', {id:id}, function(data){
		if(!$.isSuccess(data)) return;
		layerMsg(data.body,1);
		tableObj.reload();		
	});
}
function showModuleList(id){
	if(!id) return;
	curRoleId = id;
	loding =layerLoading();
	$.getJSON('mgr/role/findAllModule', {roleId : curRoleId}, function(data){
		layer.close(loding);
		if(!$.isSuccess(data)) return;
		var tbody = $('.Module table.layui-table').empty();
		$.each(data.body, function(i,v){
			if(v.level == 0){
				$("<thead></thead>").append($("<tr></tr>").append($("<th colspan='2'></th>").append(v.name)) )
				.appendTo(tbody); 
				$.each(data.body, function(k,l){
					if(l.superCode == v.code){
						$("<tbody></tbody>").append(	
							$("<tr></tr>")
							.append($("<td class='w-30'></td>").append(l.name+"：")) 
							.append($("<td class='w-70'></td>")
								.append($("<label></label>").append(findFind(l)))
								.append($("<label></label>").append(findAdd(l)))
								.append($("<label></label>").append(findModify(l)))
								.append($("<label></label>").append(findDelete(l)))
							)
						).appendTo(tbody);
					}
				});
			}
		});
		var area=['25%', '80%'];
		layerOpen_forView("模块管理",".Module",area);
	});
}
function findFind(l){
	return "<input type='checkbox' "+$.findChecked(l.find)+" onclick='setRoleSecureValid(this, \""+l.code+"\", "+type.FIND+")' /> 查询 &nbsp; ";
}
function findDelete(l){
	return "<input type='checkbox' "+$.findChecked(l.del)+" onclick='setRoleSecureValid(this, \""+l.code+"\", "+type.DELETE+")' /> 删除 &nbsp;  ";
}
function findModify(l){
	return "<input type='checkbox' "+$.findChecked(l.modify)+" onclick='setRoleSecureValid(this, \""+l.code+"\", "+type.MODIFY+")' /> 修改 &nbsp;  ";
}
function findAdd(l){
	return "<input type='checkbox' "+$.findChecked(l.add)+"  onclick='setRoleSecureValid(this, \""+l.code+"\", "+type.ADD+")' /> 添加  &nbsp; ";
}
/*
 * 为角色设置模块
 */
function setRoleSecureValid(obj, code, type){
	if(!code) return;
	$.post('mgr/role/setRoleSecureValid', {
		rold : curRoleId,
		code : code, 
		type : type,
		add : $(obj).is(':checked')
	}, function(data){
		if(!$.isSuccess(data)) return;
	}, 'json');
}