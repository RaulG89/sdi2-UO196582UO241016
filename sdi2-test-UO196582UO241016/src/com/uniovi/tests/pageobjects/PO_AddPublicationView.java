package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_AddPublicationView extends PO_NavView {
	static public void fillForm(WebDriver driver, String titlep, String textp) {
		WebElement title = driver.findElement(By.name("title"));
		title.click();
		title.clear();
		title.sendKeys(titlep);
		WebElement text = driver.findElement(By.name("text"));
		text.click();
		text.clear();
		text.sendKeys(textp);
		By boton = By.id("submit");
		driver.findElement(boton).click();
	}

	static public void fillForm(WebDriver driver, String titlep, String textp,
			String imagen) {
		WebElement title = driver.findElement(By.name("title"));
		title.click();
		title.clear();
		title.sendKeys(titlep);
		WebElement text = driver.findElement(By.name("text"));
		text.click();
		text.clear();
		text.sendKeys(textp);

		imagen = imagen.replace("\\", "/");
		imagen = "file:///" + imagen;
		driver.findElement(By.name("image")).sendKeys(imagen);

		By boton = By.id("submit");
		driver.findElement(boton).click();
	}
}
