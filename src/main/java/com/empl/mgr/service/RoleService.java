package com.empl.mgr.service;

import com.empl.mgr.support.JSONReturn;
import com.empl.mgr.support.LayerJsonReturn;

public abstract interface RoleService {

	public abstract JSONReturn findRoleList(int page,int limit, String searchVal, String acctName);
	
	public abstract LayerJsonReturn findRoleList2(int page,int limit, String searchVal, String acctName);

	public abstract JSONReturn findRolePage(int page, String searchVal);

	public abstract JSONReturn addRole(String roleName, String desc, String acctName);

	public abstract JSONReturn modifyRole(long id, String roleName, String desc, String acctName);

	public abstract JSONReturn deleteRole(long id, String acctName);

	public abstract JSONReturn findRoleById(long id);

}
