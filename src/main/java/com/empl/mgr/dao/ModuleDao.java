package com.empl.mgr.dao;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.criterion.Order;
import org.springframework.stereotype.Repository;

import com.empl.mgr.constant.PageConstant;
import com.empl.mgr.dao.support.AbstractDao;
import com.empl.mgr.dto.ModuleListDto;
import com.empl.mgr.model.TeModule;

@Repository
public class ModuleDao extends AbstractDao<TeModule> {

	@Override
	public Class<TeModule> getEntityClass() {
		// TODO Auto-generated method stub
		return TeModule.class;
	}
	@SuppressWarnings("unchecked")
	public List<TeModule> findAll() {
		return findSession().createCriteria(getEntityClass()).addOrder(Order.asc("orderNum")).addOrder(Order.asc("id")).list();
	}
	@SuppressWarnings("unchecked")
	public List<TeModule> findMgrModule(String acctName) {
		// TODO Auto-generated method stub
		StringBuffer query = new StringBuffer();
		query.append("from TeModule tm where exists ");
		query.append("(from TeAccountRole tar, TeRoleModule trm ");
		query.append("where tar.roleLabel = trm.roleLabel and ");
		query.append("(tm.moduleCode = trm.moduleCode or tm.moduleCode = trm.mosuleSuperCode) ");
		query.append("and trm.finds=1 and tar.acctName = ?)");
		query.append(" order by tm.orderNum ");
		return findSession().createQuery(query.toString()).setString(0, acctName).list();
	}
	@SuppressWarnings("unchecked")
	//经过权限
	public List<ModuleListDto> findFirstModule(int page,int limit,String searchVal,String acctName) {
		// TODO Auto-generated method stub
		StringBuffer query = new StringBuffer();
		query.append("select new com.empl.mgr.dto.ModuleListDto (moduleId, moduleName, moduleCode, moduleSuperCode, modulePage,moduleLevel,createTime) from TeModule tm where exists ");
		query.append("(from TeAccountRole tar, TeRoleModule trm ");
		query.append("where tar.roleLabel = trm.roleLabel and ");
		query.append("(tm.moduleCode = trm.moduleCode or tm.moduleCode = trm.mosuleSuperCode) ");
		query.append("and trm.finds=1 and tar.acctName = ?)");
		query.append("and tm.moduleSuperCode = 0)");
		query.append(" order by tm.orderNum ");
		return findSession().createQuery(query.toString()).setString(0, acctName).list();
	}
	@SuppressWarnings("unchecked")
	//无需权限,获取所有模块信息
	public List<ModuleListDto> findAllFirstModule(int page,int limit,String searchVal) {
		// TODO Auto-generated method stub
		StringBuffer query = new StringBuffer();
		query.append("select new com.empl.mgr.dto.ModuleListDto (moduleId, moduleName, moduleCode, moduleSuperCode, modulePage,moduleLevel,createTime) from TeModule tm  where 1=1");
		query.append(StringUtils.isNotBlank(searchVal) ? "and tm.moduleName like '%" + searchVal + "%'" : "");
		query.append("and tm.moduleSuperCode = 0");
		query.append(" order by tm.orderNum ");
		return findSession().createQuery(query.toString()).setFirstResult((page - 1) * PageConstant.PAGE_LIST)
		.setMaxResults(PageConstant.PAGE_LIST).list();
	}
	//无需权限,获取所有模块信息
	public int findAllFirstModuleCount(String searchVal) {
		// TODO Auto-generated method stub
		StringBuffer query = new StringBuffer();
		query.append("select count(moduleName) from TeModule tm where 1=1 ");
		query.append(StringUtils.isNotBlank(searchVal) ? "and tm.moduleName like '%" + searchVal + "%'" : "");
		query.append("and tm.moduleSuperCode = 0");
		return Integer.parseInt(findSession().createQuery(query.toString()).uniqueResult().toString());
	}
		//经过权限
		public int findFirstModuleCount(String searchVal,String acctName) {
			// TODO Auto-generated method stub
			StringBuffer query = new StringBuffer();
			query.append("select count(moduleName) from TeModule tm where exists ");
			query.append("(from TeAccountRole tar, TeRoleModule trm ");
			query.append("where tar.roleLabel = trm.roleLabel and ");
			query.append("(tm.moduleCode = trm.moduleCode or tm.moduleCode = trm.mosuleSuperCode) ");
			query.append("and trm.finds=1 and tar.acctName = ?)");
			query.append("and tm.moduleSuperCode = 0");
			query.append(StringUtils.isNotBlank(searchVal) ? "and tm.moduleName like '%" + searchVal + "%'" : "");

			return Integer.parseInt(findSession().createQuery(query.toString()).setString(0, acctName).uniqueResult().toString());
		}
		
		//经过权限，获取所有模块子菜单信息
		@SuppressWarnings("unchecked")
		public List<TeModule> findModuleSecondList(String moduleCode,String moduleName,String acctName) {
			// TODO Auto-generated method stub
			StringBuffer query = new StringBuffer();
			query.append("from TeModule tm where exists ");
			query.append("(from TeAccountRole tar, TeRoleModule trm ");
			query.append("where tar.roleLabel = trm.roleLabel and ");
			query.append("(tm.moduleCode = trm.moduleCode or tm.moduleCode = trm.mosuleSuperCode) ");
			query.append("and trm.finds=1 and tar.acctName = ?)");
			query.append("and tm.moduleSuperCode = ?");
			query.append(StringUtils.isNotBlank(moduleName) ? "and tm.moduleName like '%" + moduleName + "%'" : "");

			query.append(" order by tm.orderNum ");
			return findSession().createQuery(query.toString()).setString(0, acctName).setString(1, moduleCode).list();
		}
		@SuppressWarnings("unchecked")
		//无需权限,获取所有模块子菜单信息
		public List<TeModule> findModuleSecondList(String moduleCode,String moduleName) {
			// TODO Auto-generated method stub
			StringBuffer query = new StringBuffer();
			query.append("from TeModule tm  where 1=1");
			query.append("and tm.moduleSuperCode = ?");
			query.append(StringUtils.isNotBlank(moduleName) ? "and tm.moduleName like '%" + moduleName + "%'" : "");

			query.append(" order by tm.orderNum ");
			return findSession().createQuery(query.toString()).setString(0, moduleCode).list();
		}
		
	
}
