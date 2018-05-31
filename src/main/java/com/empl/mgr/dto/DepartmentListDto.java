package com.empl.mgr.dto;

import java.io.Serializable;
import java.util.Date;

/**
 * 部门列表展示传输实体类
 * alex
 * @author alex
 */
public class DepartmentListDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private long deptId; // 部门ID
	private long parentId; // 父节点ID
	private String deptName; // 部门名称
	private String deptType; // 部门类型（1：部门，2：科室）
	private Date createTime; // 创建时间
	private String creator; // 创建人
	private String deptDescription; // 部门简介
	private long principal; // 负责人ID
	private String time; // 时间
	private String fullName;// 部门负责人
	private int status;// 数据状态

	public DepartmentListDto() {
		// TODO Auto-generated constructor stub
	}

	public DepartmentListDto(long deptId,long parentId, String deptName, String deptType, Date createTime, String creator, String deptDescription,
			long deptPrincipal) {
		super();
		this.deptId = deptId;
		this.parentId = parentId;
		this.deptName = deptName;
		this.deptType = deptType;
		this.createTime = createTime;
		this.creator = creator;
		this.deptDescription = deptDescription;
		this.principal = deptPrincipal;
	}

	@Override
	public String toString() {
		return "DepartmentListDto [deptId:" + deptId + ", parentId:" + parentId+ ", deptName:" + deptName+ ", deptType:" + deptType 
				+ ", createTime:" + createTime	+ ", creator:" + creator + ", deptDescription:" + deptDescription + ", principal:" + principal
				+ ", time:" + time + "]";
	}

	public long getDeptId() {
		return deptId;
	}

	public void setDeptId(long deptId) {
		this.deptId = deptId;
	}

	public String getDeptName() {
		return deptName;
	}

	public String getDeptDescription() {
		return deptDescription;
	}

	public void setDeptDescription(String deptDescription) {
		this.deptDescription = deptDescription;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public long getPrincipal() {
		return principal;
	}

	public void setPrincipal(long principal) {
		this.principal = principal;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public long getParentId() {
		return parentId;
	}

	public void setParentId(long parentId) {
		this.parentId = parentId;
	}

	public String getDeptType() {
		return deptType;
	}

	public void setDeptType(String deptType) {
		this.deptType = deptType;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

}
