package com.empl.mgr.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.empl.mgr.annotation.SecureValid;
import com.empl.mgr.constant.MethodType;
import com.empl.mgr.controller.support.AbstractController;
import com.empl.mgr.service.DepartmentService;
import com.empl.mgr.support.JSONReturn;
import com.empl.mgr.support.LayerJsonReturn;

@Scope
@Controller
@RequestMapping(value = "department")
public class DepartmentController extends AbstractController {

	@Autowired
	private DepartmentService departmentService;

//	@ResponseBody
//	@RequestMapping(value = "findDepartmentList")
//	@SecureValid(code = "03001", desc = "获取部门列表", type = MethodType.FIND)
//	public JSONReturn findDepartmentList(@RequestParam int page,@RequestParam int limit, @RequestParam(required=false) String searchValue, HttpSession httpSession) {
//		return departmentService.findDepartmentList(page,limit, searchValue, acctName(httpSession));
//	}
	@ResponseBody
	@RequestMapping(value = "findDepartmentList")
	@SecureValid(code = "04004", desc = "获取部门列表", type = MethodType.FIND)
	public LayerJsonReturn findDepartmentList(@RequestParam int page,@RequestParam int limit, @RequestParam(required=false) String searchValue,@RequestParam(required=false) long parentId,@RequestParam long deptType, HttpSession httpSession) {
		return departmentService.findDepartmentList(page, limit, searchValue,parentId,deptType, acctName(httpSession));
	}
	@ResponseBody
	@RequestMapping(value = "findDepartmentCount")
	@SecureValid(code = "03001", desc = "获取部分页", type = MethodType.FIND)
	public JSONReturn findDepartmentCount(@RequestParam int page, @RequestParam String searchValue) {
		return departmentService.findDepartmentCount(page, searchValue);
	}

	@ResponseBody
	@RequestMapping(value = "findDepartmentById")
	@SecureValid(code = "03001", desc = "根据ID号,获取部门信息", type = MethodType.FIND)
	public JSONReturn findDepartmentById(@RequestParam long deptId) {
		return departmentService.findDepartmentById(deptId);
	}

	@ResponseBody
	@RequestMapping(value = "modifyDepartment")
	@SecureValid(code = "03001", desc = "修改部门信息", type = MethodType.MODIFY)
	public JSONReturn modifyDepartment(@RequestParam long deptId, @RequestParam String deptName, String deptDescription,
			HttpSession httpSession) {
		return departmentService.modifyDepartment(deptId, deptName, deptDescription, acctName(httpSession));
	}

	@ResponseBody
	@RequestMapping(value = "addDepartment")
	@SecureValid(code = "03001", desc = "添加部门信息", type = MethodType.ADD)
	public JSONReturn addDepartment(@RequestParam long parentId,@RequestParam String deptType,@RequestParam String deptName, String deptDescription, HttpSession httpSession) {
		return departmentService.addDepartment(parentId,deptName,deptType, deptDescription, acctName(httpSession));
	}

	@ResponseBody
	@RequestMapping(value = "deleteDepartment")
	@SecureValid(code = "03001", desc = "删除部门信息", type = MethodType.DELETE)
	public JSONReturn deleteDepartment(@RequestParam long deptId, HttpSession httpSession) {
		return departmentService.deleteDepartment(deptId, acctName(httpSession));
	}

	@ResponseBody
	@RequestMapping(value = "findDeptEmplList")
	@SecureValid(code = "03001", desc = "获取部门员工下拉框列表信息", type = MethodType.FIND)
	public JSONReturn findDeptEmplList(@RequestParam long deptId, HttpSession httpSession) {
		return departmentService.findDeptEmplList(deptId, acctName(httpSession));
	}

	@ResponseBody
	@RequestMapping(value = "setPrincipal")
	@SecureValid(code = "03001", desc = "设置部门经理", type = MethodType.MODIFY)
	public JSONReturn setPrincipal(@RequestParam long deptId, @RequestParam long emplId, HttpSession httpSession) {
		return departmentService.setPrincipal(deptId, emplId, acctName(httpSession));
	}

}
