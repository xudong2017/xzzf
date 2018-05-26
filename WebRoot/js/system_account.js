var moduleCode = '04001';//此处moduleCode 为必须值，用于获取其权限
var curAcctName = "";
var tableObj; 
var layerIndex;
var loading;//layer的loading对象
var Obj= {};

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
	});
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
			            {field: 'id', title: '编号', width:60},
			            {field: 'name', title: '账户名', width:200},
			            {field: 'nickname', title: '昵称', width:200,sort:true},
			            {field: 'time', title: '创建时间', width:200},
			            {field: 'creator', title: '负责人', width:150},
			            {fixed: 'right',title: '操作', width:350, templet: '#toolBar'}
			          ]],
	          page: true,
	          limits: [10,15,20] ,
	          limit: 10 ,
	          even:true,
			  url: 'mgr/account/findAccountList',			//	  where: {searchVal : $('input.searchInput').val()},
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
					  Delete(data.id);				//调用删除方法
				      layer.close(index);
				    });
				  } else if(layEvent === 'edit'){ //编辑
					  showEditBox(data.id);
				  } else if(layEvent === 'initPassword'){ //编辑
					  initPassword(data.id);
				  } 
				  else if(layEvent === 'manager'){ //管理
					  manager(data.name);
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
		     'searchValue':$("#searchForm .input-group .acctName").val()
		  }
		});
};

/**
 * 显示添加表单
*/
function showAddBox(id){
	var formClass=".AddForm ";
	$.FormClear(formClass);
	layerIndex=layerOpen_forAdd("添加","div.Add","");
}
/**
 * 添加模块
 */
function Add(){
	var formClass=".AddForm ";
	Obj.username = $(formClass+'input.acctName').val();
	Obj.nickname = $(formClass+'input.acctNick').val();
	Obj.password = $(formClass+'input.acctPass').val();
	loading =layerLoading();
	$.post('mgr/account/addAccount', {user : Obj.username,nick : Obj.nickname,pass:Obj.password},
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
	$.getJSON('mgr/account/findAccountById', {id : id}, function(data){
		layer.close(loading);
		if(!$.isSuccess(data)) return;
		$(formClass+'input.acctName').val(data.body.name);
		$(formClass+'input.acctNick').val(data.body.nickname);
		$(formClass+'input.acctcreator').val(data.body.creator);
		layerOpen_forView("查看","div.View","");
	});
}

/*
 * 提示并确认初始密码为123456
 * te5l.com [K]
 */
function initPassword(id){
	if(!id) return;
	layer.confirm("请确定是否将该账户密码重置为 <b style='color:red;'><br/>11111111（8个1）</b>",{icon: 3, title:'提示'}, function(index){
		loading =layerLoading();
		  layer.close(index);
		  $.getJSON('mgr/account/initPassword', {id:id}, function(data){
			  layer.close(loading);
				if(!$.isSuccess(data)) return; 
				layerMsg(data.body,1);
			});
		});
}

/**
 * 显示修改表单
*/
function showEditBox(id){
	Obj.id = id;
	var formClass=".EditForm ";
	$.FormClear(formClass);
	loading =layerLoading();
	$.getJSON('mgr/account/findAccountById', {id : id}, function(data){
		console.log(data.body);
		layer.close(loading);
		if(!$.isSuccess(data)) return;
		$(formClass+'div.acctName').text(data.body.name);
		$(formClass+'input.acctNick').val(data.body.nickname);
		layerIndex=layerOpen_forEdit("修改","div.Edit","");
	});
}
function Edit(){
	if(!Obj.id) return;
	var formClass=".EditForm ";
	Obj.acctNick = $(formClass+'input.acctNick').val();
	loading =layerLoading();
	$.post('mgr/account/modifyNickname', {
		id : Obj.id,
		nickname : Obj.acctNick 
	}, function(data){
		layer.close(loading);
		layer.close(layerIndex);
		if(!$.isSuccess(data)) return;
		layerMsg(data.body,1);
		tableObj.reload();						//重载表格----即刷新
	}, 'json');
}


function Delete(id){
	$.getJSON('mgr/account/delAccount', {id:id}, function(data){
		if(!$.isSuccess(data)) return;
		layerMsg(data.body,1);
		tableObj.reload();		
	});
}
/*
 * 遍历并显示角色列表
 * te5l.com [K]
 */
function manager(acctName){
	if(acctName=="admin"){
		layer.alert("此账户为高级管理员，拥有最高权限", {title:'提示',icon: 1,skin: 'successAlert'});		
		return;
	}
		
		if(!acctName) return;
		var tbody = $('.Manager table.layui-table').empty();
		curAcctName = acctName;
		loading =layerLoading();
		$.getJSON('mgr/account/findRole', {acctName : acctName}, function(data){
			layer.close(loading);
			if(!$.isSuccess(data)) return;
			$.each(data.body, function(i,v){
				$("<tbody></tbody>")
				.append($("<tr></tr>").append($("<td></td>").append($("<label></label>").append(findRoleCheckBox(v) +" &nbsp; "+ v.roleName))) )     
				.appendTo(tbody);
			});
			layerIndex=layerOpen_forView("角色管理","div.Manager","");
		});
}
function findRoleCheckBox(v){
	return "<input type='checkbox' "+$.findChecked(v.opt)+" onclick='setAccountRole(this,"+v.id+")' code='"+v.id+"' />";
}
