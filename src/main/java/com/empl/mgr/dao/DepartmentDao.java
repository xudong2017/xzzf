package com.empl.mgr.dao;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;

import com.empl.mgr.constant.AccountDeleteState;
import com.empl.mgr.constant.PageConstant;
import com.empl.mgr.dao.support.AbstractDao;
import com.empl.mgr.dto.DepartmentListDto;
import com.empl.mgr.dto.DepartmentSelectDto;
import com.empl.mgr.model.TeDepartment;

@Repository
public class DepartmentDao extends AbstractDao<TeDepartment> {

	@Override
	public Class<TeDepartment> getEntityClass() {
		// TODO Auto-generated method stub
		return TeDepartment.class;
	}
	@SuppressWarnings("unchecked")
	public List<DepartmentListDto> findDepartmentList(int page, String searchValue) {
		// TODO Auto-generated method stub
		StringBuffer query = new StringBuffer();
		query.append("select new com.empl.mgr.dto.DepartmentListDto");
		query.append("(dept.deptId, dept.deptName, dept.createTime, dept.creator, dept.deptDescription, dept.deptPrincipal) ");
		query.append("from TeDepartment dept where dept.status = ? and dept.deptType = 1 ");
		query.append(StringUtils.isNotBlank(searchValue) ? " and deptName like '%" + searchValue + "%'" : "");
		query.append(" order by deptId desc");
		return findSession().createQuery(query.toString()).setFirstResult((page - 1) * PageConstant.PAGE_LIST)
				.setMaxResults(PageConstant.PAGE_LIST).list();
	}
	@SuppressWarnings("unchecked")
	public List<DepartmentListDto> findDepartmentList(int page,int limit, String searchValue,Long parentId,long deptType) {
		// TODO Auto-generated method stub
		StringBuffer query = new StringBuffer();
		query.append("select new com.empl.mgr.dto.DepartmentListDto");
		query.append("(dept.deptId,dept.parentId, dept.deptName,dept.deptType, dept.createTime, dept.creator, dept.deptDescription, dept.deptPrincipal) ");
		query.append("from TeDepartment dept where dept.status = ? and dept.deptType = ? and parentId = ?");
		query.append(StringUtils.isNotBlank(searchValue) ? " and deptName like ? " : "");
		query.append("order by deptId desc");
		if(StringUtils.isNotBlank(searchValue)){
			return findSession().createQuery(query.toString()).setBoolean(0, AccountDeleteState.NO_DELETE).setLong(1, deptType).setLong(2, parentId).setString(3, "%"+searchValue+"%").setFirstResult((page - 1) * limit)
					.setMaxResults(PageConstant.PAGE_LIST).list();
		}else{
			return findSession().createQuery(query.toString()).setBoolean(0, AccountDeleteState.NO_DELETE).setLong(1, deptType).setLong(2, parentId).setFirstResult((page - 1) * limit)
					.setMaxResults(PageConstant.PAGE_LIST).list();
		}
		
	}

	@SuppressWarnings("unchecked")
	public List<DepartmentSelectDto> findAllDepartment() {
		// TODO Auto-generated method stub
		String query = "select new com.empl.mgr.dto.DepartmentSelectDto (deptId, deptName) from TeDepartment order by deptId desc";
		return findSession().createQuery(query).list();
	}
	
	public int findAccountListCount(int page,int limit, String val,long parentId,long deptType){
		StringBuffer query = new StringBuffer();
		query.append("select count(id) ");
		query.append("from TeDepartment dept where dept.status = ? and dept.deptType = ? and parentId = ?");
		query.append(StringUtils.isNotBlank(val) ? " and deptName like '%" + val + "%'" : "");
		return Integer.parseInt(findSession().createQuery(query.toString()).setBoolean(0, AccountDeleteState.NO_DELETE).setLong(1, deptType).setLong(2, parentId).uniqueResult().toString());
	};
}
