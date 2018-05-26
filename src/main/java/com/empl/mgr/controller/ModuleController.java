package com.empl.mgr.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.empl.mgr.controller.support.AbstractController;
import com.empl.mgr.service.ModuleService;
import com.empl.mgr.support.JSONReturn;
import com.empl.mgr.support.LayerJsonReturn;

@Scope
@Controller
public class ModuleController extends AbstractController {

	@Autowired
	private ModuleService moduleService;
	
	@ResponseBody
	@RequestMapping(value = "addMenu")
	public JSONReturn addMenu(@RequestParam String moduleName, @RequestParam String moduleCode,@RequestParam String moduleOrder, @RequestParam String moduleSuperCode, 
			@RequestParam String moduleLevel,@RequestParam(required = false) String modulePage ,HttpSession httpSession) {
		return moduleService.addMenu(moduleName, moduleCode,moduleOrder,moduleSuperCode, moduleLevel,modulePage,acctName(httpSession));
	}

	@ResponseBody
	@RequestMapping(value = "findMenuByid")
	public JSONReturn findMenu(HttpSession httpSession,@RequestParam String moduleid) {
		return moduleService.findMenuById(Long.parseLong(moduleid));
	}
	@ResponseBody
	@RequestMapping(value = "findMenu")
	public JSONReturn findMenu(HttpSession httpSession) {
		return moduleService.findMenu(acctName(httpSession));
	}

	@ResponseBody
	@RequestMapping(value = "findModuleParameter")
	public JSONReturn findModuleParameter(@RequestParam String moduleCode, HttpSession httpSession) {
		return moduleService.findModuleParameter(moduleCode, acctName(httpSession));
	}
	@ResponseBody
	@RequestMapping(value = "findModuleFirstList")
	public LayerJsonReturn findModuleFirstList(@RequestParam int page,@RequestParam int limit, @RequestParam(required=false) String searchVal, HttpSession httpSession) {
		return moduleService.findModuleFirstList(page,limit, searchVal,acctName(httpSession));
	}
	
	@ResponseBody
	@RequestMapping(value = "findModuleFirstPage")
	public JSONReturn findModuleFirstPage(@RequestParam int page, @RequestParam String searchVal, HttpSession httpSession) {
		return moduleService.findModuleFirstPage(page, searchVal,acctName(httpSession));
	}
	/**
	 * 获取模块二级菜单
	 * @param moduleName
	 * @param moduleCode
	 * @param moduleSuperCode
	 * @param moduleLevel
	 * @param modulePage
	 * @param httpSession
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "findModuleSecondList")
	public LayerJsonReturn findModuleSecondList(@RequestParam String moduleCode,@RequestParam(required = false) String moduleName,HttpSession httpSession) {
		return moduleService.findModuleSecondList(moduleCode,moduleName,acctName(httpSession));
	}
	@ResponseBody
	@RequestMapping(value = "modifyMenu")
	public JSONReturn modifyMenu(@RequestParam long id, @RequestParam String name, @RequestParam String code,@RequestParam String order,@RequestParam(required = false) String page,
			HttpSession httpSession) {
		System.out.println(id+"**"+name+"**"+code);
		return moduleService.modifyMenu(id, name, code,page,order);
	}
	@ResponseBody
	@RequestMapping(value = "deleteModule")
	public JSONReturn deleteModule(@RequestParam long id,HttpSession httpSession) {
		return moduleService.deleteModule(id);
	}
}
