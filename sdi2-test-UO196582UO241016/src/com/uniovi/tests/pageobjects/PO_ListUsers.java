package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_ListUsers extends PO_NavView {
	
	public static void fillSearchText(WebDriver driver, String searchTextp) {
		// TODO Auto-generated method stub
		WebElement searchText = driver.findElement(By.name("busqueda"));
		searchText.click();
		searchText.clear();
		searchText.sendKeys(searchTextp);
		// Pulsar el boton de Alta.
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}

}
