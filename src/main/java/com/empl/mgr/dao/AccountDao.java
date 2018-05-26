package com.empl.mgr.dao;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;

import com.empl.mgr.constant.AccountDeleteState;
import com.empl.mgr.constant.PageConstant;
import com.empl.mgr.dao.support.AbstractDao;
import com.empl.mgr.dto.AccountListDto;
import com.empl.mgr.model.TeAccount;

@Repository
public class AccountDao extends AbstractDao<TeAccount> {

	@Override
	public Class<TeAccount> getEntityClass() {
		// TODO Auto-generated method stub
		return TeAccount.class;
	}

	// long acctId, String acctName, String acctNickname, Date createTime, String creator

	@SuppressWarnings("unchecked")
	public List<AccountListDto> findAccountList(int page,int limit, String val) {
		// TODO Auto-generated method stub
		StringBuffer query = new StringBuffer();
		query.append("select new com.empl.mgr.dto.AccountListDto ");
		query.append("(te.acctId, te.acctName, te.acctNickname, te.createTime, te.creator, te.acctSuper) ");
		query.append("from TeAccount te where te.acctDeleteState = ? ");
		query.append(StringUtils.isEmpty(val) ? "" : " and (te.acctNickname like '%" + val
				+ "%' or te.acctName like '%" + val + "%')");
		query.append("order by te.acctId desc");
		return findSession().createQuery(query.toString()).setBoolean(0, AccountDeleteState.NO_DELETE)
				.setFirstResult((page - 1) * limit).setMaxResults(limit).list();
	}
	public int findAccountListCount(int page,int limit, String val){
		StringBuffer query = new StringBuffer();
		query.append("select count(id) ");
		query.append("from TeAccount te where te.acctDeleteState = ? ");
		query.append(StringUtils.isEmpty(val) ? "" : " and (te.acctNickname like '%" + val
				+ "%' or te.acctName like '%" + val + "%')");
		return Integer.parseInt(findSession().createQuery(query.toString()).setBoolean(0, AccountDeleteState.NO_DELETE).uniqueResult().toString());
	};


	public int findAccountPage(String val) {
		// TODO Auto-generated method stub
		StringBuffer query = new StringBuffer();
		query.append("select count(te.acctId) from TeAccount te where te.acctDeleteState = ? ");
		query.append(StringUtils.isEmpty(val) ? "" : " and (te.acctNickname like '%" + val
				+ "%' or te.acctName like '%" + val + "%')");
		return Integer.parseInt(findSession().createQuery(query.toString()).setBoolean(0, AccountDeleteState.NO_DELETE)
				.uniqueResult().toString());
	}
}
