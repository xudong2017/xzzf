package com.empl.mgr.support;

import java.io.Serializable;

public class JSONReturn implements Serializable {

	private static final long serialVersionUID = 1L;

	/*
	 * JSON头
	 * alex
	 */
	private boolean head;

	/*
	 * JSON主体
	 * alex
	 */
	private Object body;

	/*
	 * 返回头
	 * alex
	 */
	private static final boolean HEAD_SUCCESS = true;
	private static final boolean HEAD_FAILURE = false;

	/*
	 * 返回空主体
	 * alex
	 */
	private static final String EMPTY_BODY = "";

	public JSONReturn() {
		// TODO Auto-generated constructor stub
	}

	public boolean isHead() {
		return head;
	}

	public void setHead(boolean head) {
		this.head = head;
	}

	public Object getBody() {
		return body;
	}

	public void setBody(Object body) {
		this.body = body;
	}

	public JSONReturn(boolean head, Object body) {
		super();
		this.head = head;
		this.body = body;
	}

	public static JSONReturn build(boolean head, Object body) {
		return new JSONReturn(head, body);
	}

	/*
	 * 成功
	 * alex
	 */
	public static JSONReturn buildSuccess(Object body) {
		return build(HEAD_SUCCESS, body);
	}

	/*
	 * 失败
	 * alex
	 */
	public static JSONReturn buildFailure(Object body) {
		return build(HEAD_FAILURE, body);
	}

	/*
	 * 成功,空主体
	 * alex
	 */
	public static JSONReturn buildSuccessWithEmptyBody() {
		return build(HEAD_SUCCESS, EMPTY_BODY);
	}

	/*
	 * 失败,空主体
	 * alex
	 */
	public static JSONReturn buildFailureWithEmptyBody() {
		return build(HEAD_FAILURE, EMPTY_BODY);
	}

}
