package com.empl.mgr.service;


import com.empl.mgr.constant.MethodType;
import com.empl.mgr.support.JSONReturn;
import com.empl.mgr.support.LayerJsonReturn;

public abstract interface ModuleService {
	
	public abstract JSONReturn addMenu(String moduleName, String moduleCode,String moduleOrder,String moduleSuperCode,String moduleLevel,String modulePage,String acctName);

	public abstract JSONReturn findMenuById(Long acctName);

	public abstract JSONReturn findMenu(String acctName);

	public abstract JSONReturn findModuleParameter(String moduleCode, String acctName);

	public abstract JSONReturn findBreadcrumb(String moduleCode);

	public abstract JSONReturn findAllModule(long roleId);

	public abstract JSONReturn setRoleSecureValid(long rold, String code, int type, boolean add);

	public abstract boolean secureValid(String userName, String[] code, MethodType type);
	public abstract LayerJsonReturn findModuleFirstList(int page,int limit,String searchVal,String acctName);
	public abstract LayerJsonReturn findModuleSecondList(String moduleCode,String moduleName,String acctName);
	public abstract JSONReturn findModuleFirstPage(int page, String searchVal,String acctName);
	public abstract JSONReturn modifyMenu(long id, String name, String code,String page,String order);
	public abstract JSONReturn deleteModule(long id);


}
