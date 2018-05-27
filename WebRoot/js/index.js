var moduleCode = '0';
function initFun() {
	if(secure.find){
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
