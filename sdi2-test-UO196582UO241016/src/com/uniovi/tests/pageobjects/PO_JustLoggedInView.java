package com.uniovi.tests.pageobjects;

import org.openqa.selenium.WebDriver;

import com.uniovi.tests.util.SeleniumUtils;

public class PO_JustLoggedInView extends PO_NavView {

	static public void checkAuthenticated(WebDriver driver, int language) {
		SeleniumUtils.EsperaCargaPagina(driver, "text",
				p.getString("authenticateduser.message", language),
				getTimeout());
	}
}
