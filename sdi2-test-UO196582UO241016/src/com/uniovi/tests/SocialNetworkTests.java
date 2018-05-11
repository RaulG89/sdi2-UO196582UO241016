package com.uniovi.tests;

import static org.junit.Assert.assertTrue;

import java.util.List;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.uniovi.tests.pageobjects.PO_ListUsers;
import com.uniovi.tests.pageobjects.PO_LoginView;
import com.uniovi.tests.pageobjects.PO_RegisterView;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.SeleniumUtils;

//Ordenamos las pruebas por el nombre del método 
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class SocialNetworkTests {

	// En Windows (Debe ser la versión 46.0 y desactivar las actualizacioens
	// automáticas)):
	 static String PathFirefox =
	 "E:\\Clase\\UNIOVI\\5_Quinto_Curso\\SDI\\PL_SDI_5\\Firefox46.0.win"
	 + "\\Firefox46.win\\FirefoxPortable.exe";
	// static String PathFirefox =
	// "C:\\Users\\UO241016\\Downloads\\PL_SDI_5\\PL_SDI_5\\Firefox46.0.win"
	// + "\\Firefox46.win\\FirefoxPortable.exe";
	//static String PathFirefox = "C:\\Users\\Marcos\\Downloads\\Firefox46.win\\FirefoxPortable.exe";

	// Común a Windows y a MACOSX
	static WebDriver driver = getDriver(PathFirefox);
	static String URL = "http://localhost:8081";

	public static WebDriver getDriver(String PathFirefox) {
		// Firefox (Versión 46.0) sin geckodriver para Selenium 2.x.
		System.setProperty("webdriver.firefox.bin", PathFirefox);
		WebDriver driver = new FirefoxDriver();
		return driver;
	}

	@BeforeClass
	public static void before() {
		//driver.navigate().to("http://localhost:8081/erasedatatest");
	}
	
	// Antes de cada prueba se navega al URL home de la aplicaciónn
	@Before
	public void setUp() {
		driver.navigate().to(URL);
	}

	// Después de cada prueba se borran las cookies del navegador
	@After
	public void tearDown() {
		driver.manage().deleteAllCookies();
	}

	// Al finalizar la última prueba
	@AfterClass
	static public void end() {
		// Cerramos el navegador al finalizar las pruebas
		driver.quit();
	}

	// 1.1 [RegVal] Registro de Usuario con datos válidos
	@Test
	public void PR01_RegVal() {
		// Vamos al formulario de registro
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonSignup')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "RegVal", "regval@gmail.com", "regval123", "regval123");
		// Comprobamos que se ha registrado con éxito
		SeleniumUtils.textoPresentePagina(driver, "Nuevo usuario registrado");
	}
	
	@Test
	public void PR01_RegVal2() {
		// Vamos al formulario de registro
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonSignup')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "Yeyas", "yeyas@gmail.com", "yeyas123", "yeyas123");
		// Comprobamos que se ha registrado con éxito
		SeleniumUtils.textoPresentePagina(driver, "Nuevo usuario registrado");
	}
	
	@Test
	public void PR01_RegVal3() {
		// Vamos al formulario de registro
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonSignup')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "Prueba3", "prueba3@prueba3.com", "prueba3", "prueba3");
		// Comprobamos que se ha registrado con éxito
		SeleniumUtils.textoPresentePagina(driver, "Nuevo usuario registrado");
	}
	
	@Test
	public void PR01_RegVal4() {
		// Vamos al formulario de registro
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonSignup')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "Prueba4", "prueba4@prueba4.com", "prueba4", "prueba4");
		// Comprobamos que se ha registrado con éxito
		SeleniumUtils.textoPresentePagina(driver, "Nuevo usuario registrado");
	}

	// 1.2 [RegInval] Registro de Usuario con datos inválidos (repetición de
	// contraseña invalida).
	@Test
	public void PR02_RegInval() {
		// Vamos al formulario de registro
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonSignup')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "RegInval", "reginval@gmail.com", "unpassword", "otropassword");
		// Comprobamos que se ha registrado con éxito
		SeleniumUtils.textoPresentePagina(driver, "Las contraseñas han de coincidir");
	}

	// 2.1 [InVal] Inicio de sesión con datos válidos.
	@Test
	public void PR03_InVal() {
		// Vamos al formulario de logueo.
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonLogin')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "yeyas@gmail.com", "yeyas123");
		// COmprobamos que entramos en la pagina privada
		SeleniumUtils.textoPresentePagina(driver, "Usuarios");
	}

	// 2.2 [InInVal] Inicio de sesión con datos inválidos (usuario no existente en
	// la aplicación)..
	@Test
	public void PR04_InInVal() {
		// Vamos al formulario de logueo.
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonLogin')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "notexistent@gmail.com", "12345");
		// COmprobamos que aparece el error de que las credenciales introducidas
		// son
		// inválidas.
		SeleniumUtils.textoPresentePagina(driver, "Email o password incorrecto");
	}

	// 3.1 [LisUsrVal] Acceso al listado de usuarios desde un usuario en sesión
	@Test
	public void PR05_LisUsrVal() {
		// Vamos al formulario de logueo.
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonLogin')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "yeyas@gmail.com", "yeyas123");
		// COmprobamos que entramos en la pagina privada
		SeleniumUtils.textoPresentePagina(driver, "Usuarios");
	}

	// 3.2 [LisUsrInVal] Intento de acceso con URL desde un usuario no
	// identificado
	// al listado de usuarios
	// desde un usuario en sesión. Debe producirse un acceso no permitido a
	// vistas
	// privadas.
	@Test
	public void PR06_LisUsrInVal() {
		driver.navigate().to("http://localhost:8081/user/list");
		SeleniumUtils.textoPresentePagina(driver, "Intento de acceso a una zona privada sin autorizacion");
	}

	// 4.1 [BusUsrVal] Realizar una búsqueda valida en el listado de usuarios desde
	// un usuario en sesión.
	@Test
	public void PR07_BusUsrVal() {
		// Vamos al formulario de logueo.
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonLogin')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "yeyas@gmail.com", "yeyas123");
		// COmprobamos que entramos en la pagina privada
		SeleniumUtils.textoPresentePagina(driver, "Usuarios");
		// Rellenamos el campo de busqueda
		PO_ListUsers.fillSearchText(driver, "Prueba3");
		// Comprobamos que aparece el deseado.
		PO_View.checkElement(driver, "text", "Prueba3");
	}

	// 4.2 [BusUsrInVal] Intento de acceso con URL a la búsqueda de usuarios desde
	// un usuario no
	// identificado. Debe producirse un acceso no permitido a vistas privadas.
	@Test
	public void PR08_BusUsrInVal() {
		driver.navigate().to("http://localhost:8081/user/list?busqueda=quemasda");
		SeleniumUtils.textoPresentePagina(driver, "Intento de acceso a una zona privada sin autorizacion");
	}

	// 5.1 [InvVal] Enviar una invitación de amistad a un usuario de forma valida.
	@Test
	public void PR09_InvVal() {
		// Vamos al formulario de logueo.
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonLogin')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "yeyas@gmail.com", "yeyas123");
		// COmprobamos que entramos en la pagina privada
		SeleniumUtils.textoPresentePagina(driver, "Usuarios");
		By enlace = By.xpath("//td[contains(text(), 'Prueba3')]/following-sibling::*[2]");
		SeleniumUtils.esperarSegundos(driver, 1);
		driver.findElement(enlace).click();
		// Comprobación
		SeleniumUtils.esperarSegundos(driver, 2);
		SeleniumUtils.textoPresentePagina(driver, "Petición de amistad enviada correctamente.");
	}

	// 5.2 [InvInVal] Enviar una invitación de amistad a un usuario al que ya le
	// habíamos invitado la invitación
	// previamente. No debería dejarnos enviar la invitación, se podría ocultar el
	// botón de enviar invitación o
	// notificar que ya había sido enviada previamente.
	@Test
	public void PR10_InvInVal() {
		// Vamos al formulario de logueo.
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonLogin')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "yeyas@gmail.com", "yeyas123");
		// COmprobamos que entramos en la pagina privada
		SeleniumUtils.textoPresentePagina(driver, "Usuarios");
		By enlace = By.xpath("//td[contains(text(), 'Prueba3')]/following-sibling::*[2]");
		SeleniumUtils.esperarSegundos(driver, 1);
		driver.findElement(enlace).click();
		// Comprobación
		SeleniumUtils.esperarSegundos(driver, 2);
		SeleniumUtils.textoPresentePagina(driver, "Error al enviar petición, ya existe una petición enviada.");
	}

	// 6.1 [LisInvVal] Listar las invitaciones recibidas por un usuario, realizar la
	// comprobación con una lista
	// que al menos tenga una invitación recibida.
	@Test
	public void PR11_LisInvVal() {
		// Vamos al formulario de logueo.
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonLogin')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "prueba3@prueba3.com", "prueba3");
		// COmprobamos que entramos en la pagina privada
		SeleniumUtils.textoPresentePagina(driver, "Usuarios");
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href,'/requests')]");
		elementos.get(0).click();
		// Comprobamos
		elementos = PO_View.checkElement(driver, "free", "//td/following-sibling::*[1]");
		assertTrue(elementos.size() == 1);
	}

	// 7.1 [AcepInvVal] Aceptar una invitación recibida
	@Test
	public void PR12_AcepInvVal() {
		// Vamos al formulario de logueo.
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonLogin')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "prueba3@prueba3.com", "prueba3");
		// COmprobamos que entramos en la pagina privada
		SeleniumUtils.textoPresentePagina(driver, "Usuarios");
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href,'/requests')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Comprobamos que aparecen dos botones de aceptar, por lo tanto,
		// existen 2
		// peticiones de amistad pendientes.
		elementos = PO_View.checkElement(driver, "free", "//td/following-sibling::*[1]");
		assertTrue(elementos.size() == 1);
		elementos.get(0).click();
	}

	// 8.1 [ListAmiVal] Listar los amigos de un usuario, realizar la comprobación con una lista que al menos
	// tenga un amigo.
	@Test	
	public void PR13_ListAmiVal() {
		// Vamos al formulario de logueo.
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonLogin')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "yeyas@gmail.com", "yeyas123");
		// COmprobamos que entramos en la pagina privada
		SeleniumUtils.textoPresentePagina(driver, "Usuarios");
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href,'/friends')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		elementos = PO_View.checkElement(driver, "free", "//td[contains(text(), 'Prueba3')]");
		assertTrue(elementos.size() == 1);
	}

	// C1.1[[CInVal] Inicio de sesión con datos válidos
	@Test
	public void PR14_CInVal() {
		driver.navigate().to("http://localhost:8081/cliente.html");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "yeyas@gmail.com", "yeyas123");
		// Comprobamos que entramos en la pagina privada
		SeleniumUtils.esperarSegundos(driver, 3);
		//SeleniumUtils.textoPresentePagina(driver, "Amigos");
		PO_View.checkElement(driver, "text", "Amigos");
	}

	// C1.2 [CInInVal] Inicio de sesión con datos inválidos (usuario no existente en la aplicación).
	@Test
	public void PR15_CInInVal() {
		driver.navigate().to("http://localhost:8081/cliente.html");
		PO_LoginView.fillForm(driver, "notexistent@gmail.com", "12345");
		// Comprobamos que aparece el error de que las credenciales introducidas
		// son
		// inválidas.
		SeleniumUtils.textoPresentePagina(driver, "Usuario no encontrado");
	}

	// C.2.1 [CListAmiVal] Acceder a la lista de amigos de un usuario, que al menos tenga tres amigos.
	@Test
	public void PR16_CListAmiVal() {
		//Enviamos invitaciones a los demás usuarios
		
		// Vamos al formulario de logueo.
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonLogin')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "yeyas@gmail.com", "yeyas123");
		// COmprobamos que entramos en la pagina privada
		SeleniumUtils.textoPresentePagina(driver, "Usuarios");
		By enlace = By.xpath("//td[contains(text(), 'Prueba4')]/following-sibling::*[2]");
		SeleniumUtils.esperarSegundos(driver, 1);
		driver.findElement(enlace).click();
		SeleniumUtils.esperarSegundos(driver, 1);
		enlace = By.xpath("//td[contains(text(), 'RegVal')]/following-sibling::*[2]");
		SeleniumUtils.esperarSegundos(driver, 1);
		driver.findElement(enlace).click();
		// Comprobación
		SeleniumUtils.esperarSegundos(driver, 2);
		SeleniumUtils.textoPresentePagina(driver, "Petición de amistad enviada correctamente.");
		
		//Deslogueamos del sistema
		driver.navigate().to("http://localhost:8081/logout");
		
		//Accedemos con el usuario Prueba4
		
		// Vamos al formulario de logueo.
		elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonLogin')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "prueba4@prueba4.com", "prueba4");
		SeleniumUtils.textoPresentePagina(driver, "Usuarios");
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href,'/requests')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Comprobamos que aparece un boton de aceptar
		// peticiones de amistad pendientes.
		elementos = PO_View.checkElement(driver, "free", "//td/following-sibling::*[1]");
		assertTrue(elementos.size() == 1);
		elementos.get(0).click();
		
		//Deslogueamos del sistema
		driver.navigate().to("http://localhost:8081/logout");
		
		//Accedemos con el usuario RegVal
		
		// Vamos al formulario de logueo.
		elementos = PO_View.checkElement(driver, "free", "//li/a[contains(@id, 'botonLogin')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "regval@gmail.com", "regval123");
		SeleniumUtils.textoPresentePagina(driver, "Usuarios");
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href,'/requests')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Comprobamos que aparece un boton de aceptar
		// peticiones de amistad pendientes.
		elementos = PO_View.checkElement(driver, "free", "//td/following-sibling::*[1]");
		assertTrue(elementos.size() == 1);
		elementos.get(0).click();
		
		//Deslogueamos del sistema
		driver.navigate().to("http://localhost:8081/logout");
		
		//Accedemos con el usuario Yeyas y comprobamos
		
		driver.navigate().to("http://localhost:8081/cliente.html");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "yeyas@gmail.com", "yeyas123");
		// Comprobamos que entramos en la pagina privada
		SeleniumUtils.esperarSegundos(driver, 3);
		
		//Comprobamos que estan los tres amigos
		PO_View.checkElement(driver, "text", "Prueba3");
		PO_View.checkElement(driver, "text", "Prueba4");
		PO_View.checkElement(driver, "text", "RegVal");
		
	}

	// C.2.2 [CListAmiFil] Acceder a la lista de amigos de un usuario, y realizar un filtrado para encontrar a un
	// amigo concreto, el nombre a buscar debe coincidir con el de un amigo
	@Test
	public void PR17_CListAmiFil() {
		driver.navigate().to("http://localhost:8081/cliente.html");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "yeyas@gmail.com", "yeyas123");
		// Comprobamos que entramos en la pagina privada
		SeleniumUtils.esperarSegundos(driver, 3);
		WebElement searchText = driver.findElement(By.name("busqueda"));
		searchText.click();
		searchText.clear();
		searchText.sendKeys("Prueba3");
		SeleniumUtils.esperarSegundos(driver, 3);
		// Comprobamos que aparece el deseado.
		PO_View.checkElement(driver, "text", "Prueba3");
	}

	// C3.1 [CListMenVal] Acceder a la lista de mensajes de un amigo “chat”, la lista debe contener al menos
	// tres mensajes.
	@Test
	public void PR18_CListMenVal() {
		//Accedemos al cliente
		driver.navigate().to("http://localhost:8081/cliente.html");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "prueba4@prueba4.com", "prueba4");
		//Accedemos al chat
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//td/a");
		assertTrue(elementos.size() == 1);
		elementos.get(0).click();
		//Escribimos los tres mensajes
		SeleniumUtils.esperarSegundos(driver, 1);
		WebElement message = driver.findElement(By.id("message"));
		message.click();
		message.clear();
		message.sendKeys("Hola");
		SeleniumUtils.esperarSegundos(driver, 2);
		message = driver.findElement(By.id("send"));
		message.click();
		message = driver.findElement(By.id("message"));
		message.click();
		message.clear();
		message.sendKeys("Que");
		SeleniumUtils.esperarSegundos(driver, 2);
		message = driver.findElement(By.id("send"));
		message.click();
		message = driver.findElement(By.id("message"));
		message.click();
		message.clear();
		message.sendKeys("tal?");
		SeleniumUtils.esperarSegundos(driver, 2);
		message = driver.findElement(By.id("send"));
		message.click();
		
		//Nos logueamos con el otro usuario
		driver.navigate().to("http://localhost:8081/cliente.html?w=login");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "yeyas@gmail.com", "yeyas123");
		//Accedemos al chat con Prueba4
		SeleniumUtils.esperarSegundos(driver, 3);
		elementos = PO_View.checkElement(driver, "free", "//tr[contains(@id, 'Prueba4')]/td[4]/a");
		assertTrue(elementos.size() == 1);
		elementos.get(0).click();
		//Comprobamos que los mensajes que obtiene son 3
		SeleniumUtils.esperarSegundos(driver, 3);
		elementos = PO_View.checkElement(driver, "free", "//div[contains(@class, 'message-container-left')]");
		assertTrue(elementos.size() == 3);
	}

	// C4.1 [CCrearMenVal] Acceder a la lista de mensajes de un amigo “chat” y crear un nuevo mensaje,
	// validar que el mensaje aparece en la lista de mensajes.
	@Test
	public void PR19_CCrearMenVal() {
		//Accedemos al cliente
		driver.navigate().to("http://localhost:8081/cliente.html");
		// Rellenamos el formulario
		SeleniumUtils.esperarSegundos(driver, 1);
		PO_LoginView.fillForm(driver, "prueba3@prueba3.com", "prueba3");
		//Accedemos al chat
		SeleniumUtils.esperarSegundos(driver, 1);
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//td/a");
		assertTrue(elementos.size() == 1);
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		//Escribimos los tres mensajes
		WebElement message = driver.findElement(By.id("message"));
		message.click();
		message.clear();
		message.sendKeys("Hola");		
		message = driver.findElement(By.id("send"));
		message.click();
		SeleniumUtils.esperarSegundos(driver, 3);
		
		//Comprobamso que el mensaje se encuentra en el chat
		elementos = PO_View.checkElement(driver, "free", "//div[contains(@class, 'message-container-right')]");
		assertTrue(elementos.size() == 1);
		SeleniumUtils.esperarSegundos(driver, 1);
		PO_View.checkElement(driver, "text", "Hola");
		
	}

}
