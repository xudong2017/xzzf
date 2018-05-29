var moduleCode = '04004';
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
			            {field: 'deptName', title: '部门名称', width:200},
			            {field: 'time', title: '创建时间', width:200,sort:true},
			            {field: 'creator', title: '创建人', width:150},
			            {field: 'deptDescription', title: '描述', width:200},
			            {fixed: 'right',title: '操作', width:350, templet: '#toolBar'}
			          ]],
	          page: true,
	          limits: [10,15,20] ,
	          limit: 10 ,
	          even:true,
			  url: 'mgr/department/findDepartmentList',			
			  where: {'searchValue':$("#searchForm .input-group .deptName").val()},
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
		     'searchValue':$("#searchForm .input-group .deptName").val()
		  }
		});
};
