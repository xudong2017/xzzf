package com.empl.mgr.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Version;

/**
 * TeDepartment entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "te_department")
public class TeDepartment implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	private long deptId;
	private long parentId; // 父节点ID
	private Date timestamp;
	private String deptName;
	private String deptType; // 部门类型（1：部门，2：科室）
	private Date createTime;
	private String creator;
	private String deptDescription;
	private long deptPrincipal;
	private boolean status;// 数据状态
	// Constructors

	/** default constructor */
	public TeDepartment() {
	}

	/** full constructor */
	public TeDepartment(long parentId,String deptName,String deptType, Date createTime, String creator, String deptDescription, long deptPrincipal) {
		this.parentId = parentId;
		this.deptName = deptName;
		this.deptType = deptType;
		this.createTime = createTime;
		this.creator = creator;
		this.deptDescription = deptDescription;
		this.deptPrincipal = deptPrincipal;
	}

	@Override
	public String toString() {
		return "TeDepartment [deptId:" + deptId + ", timestamp:" + timestamp + ", deptName:" + deptName
				+ ", createTime:" + createTime + ", creator:" + creator + ", deptDescription:" + deptDescription
				+ ", deptPrincipal:" + deptPrincipal + "]";
	}

	// Property accessors
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "deptId", unique = true, nullable = false)
	public long getDeptId() {
		return this.deptId;
	}

	public void setDeptId(long deptId) {
		this.deptId = deptId;
	}

	@Version
	@Column(name = "timestamp", nullable = false, length = 19)
	public Date getTimestamp() {
		return this.timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	@Column(name = "deptName", length = 64)
	public String getDeptName() {
		return this.deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	@Column(name = "createTime", length = 19)
	public Date getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	@Column(name = "creator", length = 64)
	public String getCreator() {
		return this.creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	@Column(name = "deptDescription", length = 1024)
	public String getDeptDescription() {
		return this.deptDescription;
	}

	public void setDeptDescription(String deptDescription) {
		this.deptDescription = deptDescription;
	}

	@Column(name = "deptPrincipal")
	public long getDeptPrincipal() {
		return this.deptPrincipal;
	}

	public void setDeptPrincipal(long deptPrincipal) {
		this.deptPrincipal = deptPrincipal;
	}
	@Column(name = "parentId")
	public long getParentId() {
		return parentId;
	}

	public void setParentId(long parentId) {
		this.parentId = parentId;
	}
	@Column(name = "deptType")
	public String getDeptType() {
		return deptType;
	}

	public void setDeptType(String deptType) {
		this.deptType = deptType;
	}
	@Column(name = "status")
	public boolean getStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

}