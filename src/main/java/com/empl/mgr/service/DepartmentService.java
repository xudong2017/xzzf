package com.empl.mgr.service;

import com.empl.mgr.support.JSONReturn;
import com.empl.mgr.support.LayerJsonReturn;

public abstract interface DepartmentService {

	public abstract JSONReturn findDepartmentList(int page, String searchValue, String acctName);
	
	public abstract LayerJsonReturn findDepartmentList(int page,int limit,String searchVal,long parentId,long deptType,String acctName);
	
	public abstract JSONReturn findDepartmentCount(int page, String searchValue);

	public abstract JSONReturn findDepartmentById(long deptId);

	public abstract JSONReturn modifyDepartment(long deptId, String name, String desc, String acctName);

//	public abstract JSONReturn addDepartment(String name, String desc, String acctName);
	
	public abstract JSONReturn addDepartment(long parentId,String name,String deptType, String desc, String acctName);

	public abstract JSONReturn deleteDepartment(long deptId, String acctName);

	public abstract JSONReturn findAllDepartment();

	public abstract JSONReturn findDeptEmplList(long deptId, String acctName);

	public abstract JSONReturn setPrincipal(long deptId, long emplId, String acctName);

}
