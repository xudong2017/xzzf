package com.empl.mgr.filter;

import javax.servlet.FilterChain;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.empl.mgr.constant.SessionKey;
import com.empl.mgr.model.TeAccount;
import com.empl.mgr.service.AccountService;
import com.empl.mgr.utils.CompareUtil;


public class AuthFilter implements  Filter  {
	@Autowired
	private AccountService accountService;
	/**
     * 销毁
     */
	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		System.out.println("销毁");
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse resp,FilterChain chain) throws IOException, ServletException {
		// TODO Auto-generated method stub
		System.out.println("执行");
		HttpServletRequest httpRequest = (HttpServletRequest)req;
		HttpServletResponse response = (HttpServletResponse)resp;
		String root = httpRequest.getContextPath();
		//验证是否是登录页面，直接跳转登录页面
		if(httpRequest.getRequestURI().contains("login.html")){
			String userNametemp = (String) httpRequest.getSession().getAttribute(SessionKey.MODULEACCTNAME);
			if (StringUtils.isEmpty(userNametemp)) {
				chain.doFilter(req, resp);	
			}else{
				response.sendRedirect(root+"/index.html");
			}
		}else{
			//判断session中是否有用户，如没有，则直接返回登录页面。
			String userName = (String) httpRequest.getSession().getAttribute(SessionKey.MODULEACCTNAME);
			if (StringUtils.isEmpty(userName)) {
				response.sendRedirect(root+"/login.html");
			}else{
				chain.doFilter(req, resp);
			}
			
		}
		
	}
	/**
     * 初始化
     */
	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		System.out.println("初始化");
		
	}




}
