package com.empl.mgr.support;

import java.io.Serializable;

public class LayerJsonReturn implements Serializable {

	private static final long serialVersionUID = 1L;

	/*
	 * JSON-code
	 */ 
	private int code;   //状态码，0代表成功，其它失败
	/*
	 * JSON-msg   //状态信息，一般可为空
	 */
	private String msg;
	/*
	 * JSON-count    //数据总量
	 */
	private int count;
	/*
	 * JSON主体
	 */
	private Object data;



	public LayerJsonReturn() {
		// TODO Auto-generated constructor stub
	}



	public int getCode() {
		return code;
	}



	public void setCode(int code) {
		this.code = code;
	}



	public String getMsg() {
		return msg;
	}



	public void setMsg(String msg) {
		this.msg = msg;
	}



	public int getCount() {
		return count;
	}



	public void setCount(int count) {
		this.count = count;
	}



	public Object getData() {
		return data;
	}



	public void setData(Object data) {
		this.data = data;
	}

	
	public LayerJsonReturn(int code,String msg,int count,Object data) {
		super();
		this.code = code;
		this.msg = msg;
		this.count = count;
		this.data = data;
	}
	public static LayerJsonReturn build(int code,String msg,int count,Object data) {
		return new LayerJsonReturn(code, msg ,count,data);
	}
	/*
	 * 成功
	 * alex
	 */
	public static LayerJsonReturn buildSuccess(int count,Object data) {
		return build(0,"数据请求成功" ,count,data );
	}

	/*
	 * 失败
	 * alex
	 */
	public static LayerJsonReturn buildFailure(String msg) {
		return build(300,msg ,0 , null );
	}


}
