package com.empl.mgr.dto;

import java.io.Serializable;
import java.util.Date;

/**
 * 角色列表实体传输类
 * alex
 * @author alex
 */
public class ModuleListDto implements Serializable {

	private static final long serialVersionUID = 1L;


	private long moduleId;
	private Date timestamp;
	private Date createTime;
	private String creator;
	private String moduleName;
	private String moduleCode;
	private String moduleSuperCode;
	private String modulePage;
	private Integer moduleLevel;
	private Integer orderNum;
	private String time;

	public ModuleListDto() {
		// TODO Auto-generated constructor stub
	}
	public ModuleListDto(long moduleId,String moduleName, String moduleCode, String moduleSuperCode, String modulePage, Integer moduleLevel,Date createTime) {
		this.moduleId = moduleId;
		this.moduleName = moduleName;
		this.moduleCode = moduleCode;
		this.moduleSuperCode = moduleSuperCode;
		this.modulePage = modulePage;
		this.moduleLevel = moduleLevel;
		this.createTime = createTime;
	}

	public long getModuleId() {
		return moduleId;
	}

	public void setModuleId(long moduleId) {
		this.moduleId = moduleId;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public String getModuleCode() {
		return moduleCode;
	}

	public void setModuleCode(String moduleCode) {
		this.moduleCode = moduleCode;
	}

	public String getModuleSuperCode() {
		return moduleSuperCode;
	}

	public void setModuleSuperCode(String moduleSuperCode) {
		this.moduleSuperCode = moduleSuperCode;
	}

	public String getModulePage() {
		return modulePage;
	}

	public void setModulePage(String modulePage) {
		this.modulePage = modulePage;
	}

	public Integer getModuleLevel() {
		return moduleLevel;
	}

	public void setModuleLevel(Integer moduleLevel) {
		this.moduleLevel = moduleLevel;
	}

	public Integer getOrderNum() {
		return orderNum;
	}

	public void setOrderNum(Integer orderNum) {
		this.orderNum = orderNum;
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



}
