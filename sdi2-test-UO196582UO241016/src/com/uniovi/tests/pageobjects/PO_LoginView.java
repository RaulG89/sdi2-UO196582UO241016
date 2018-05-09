package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.util.SeleniumUtils;

public class PO_LoginView extends PO_NavView {

	public static void fillForm(WebDriver driver, String emailp,
			String passwordp) {
		// TODO Auto-generated method stub
		WebElement email = driver.findElement(By.name("email"));
		email.click();
		email.clear();
		email.sendKeys(emailp);
		WebElement password = driver.findElement(By.name("password"));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		// Pulsar el boton de Alta.
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}

	static public void checkLogIn(WebDriver driver, int language) {
		SeleniumUtils.EsperaCargaPagina(driver, "text",
				p.getString("login.message", language), getTimeout());
	}

	public static void checkInvalidLogIn(WebDriver driver, int language) {
		SeleniumUtils.EsperaCargaPagina(driver, "text",
				p.getString("unsuccessfull.signin.message", language),
				getTimeout());
	}

}
