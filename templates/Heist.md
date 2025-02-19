![](../img/Heist/0.png)

#Windows #PasswordSpray #password7_cisco #FirefoxAbusignLogFIles

___

# Resumen 

Heist es una caja Windows de fácil dificultad con un portal de  accesible en el servidor web, desde el que es posible obtener hashes de contraseñas de Cisco. Estos hashes se descifran y, a continuación, se utilizan la fuerza bruta RID y la pulverización de contraseñas para obtener acceso a la máquina. Se descubre que el usuario ejecuta Firefox. Se puede volcar el proceso firefox.exe y buscar la contraseña del administrador.

----

Se procedió a hacer un escaneo con el propósito de identificar posibles vectores de ataque para lograr el compromiso del objetivo


![](../img/Heist/1.png)

<span class="center-text">Archivos encontrados</span>

Una vez identificado los servicios abierto empezamos la enumeración con el servidor web corriendo en el sistema, identificando un portal de inicio de session, con el detalle que nos deja acceder como invitados 


![](../img/Heist/2.png)

<span class="center-text">Servidor web</span>

Se oberva que al acceder como invitados se hace presencia de un chat y 2 posibles usuarios del sistema, una llado Hazard y otro support, asi como un archivo adjuntado

![](../img/Heist/3.png)

<span class="center-text">Identificación de usuario e información importante</span>

Al analizar el archivo adjunto, identificamos la presencia de hashes. Tras investigar, determinamos que corresponden a contraseñas cifradas con el método Cisco Type 7.

![](../img/Heist/4.png)

<span class="center-text">Identificación de hashes</span>

*NOTA*: El **Cisco Password Type 7** es un esquema de cifrado propietario utilizado en dispositivos Cisco para almacenar contraseñas en archivos de configuración. No es un método criptográfico seguro, sino una simple ofuscación basada en el algoritmo Vigenère.
### **¿Cómo funciona?**

Las contraseñas tipo 7 se generan mediante una clave fija y un algoritmo de cifrado que produce una cadena hexadecimal representando la contraseña cifrada. El formato en la configuración de Cisco es:

- **Reversible fácilmente**: Cisco Password 7 no es un método de hash criptográfico, sino solo una forma de ocultar la contraseña. Dado que el algoritmo es conocido y usa una clave fija, cualquier contraseña cifrada puede ser revertida a texto plano con herramientas públicas.

Por lo que investigando utilidad en internet obtenemos la siguiente permitiendo mostrar las contraseñas en texto claro

![](../img/Heist/5.png)

<span class="center-text">Contraseña del hash: 0709285E4B1E18091B5C0814</span>

![](../img/Heist/6.png)

<span class="center-text">Contraseña del hash: 0709285E4B1E18091B5C0814</span>

![](../img/Heist/7.png)

<span class="center-text">Contraseña del hash: $1$pdQG$o8nrSzsGXeaduXrjlvKc91</span>

Con una lista de usuarios y posibles contraseñas, realizamos un ataque de **password spraying** utilizando la herramienta **nexec** para verificar si alguna combinación es válida. Como resultado, se identificó lo siguiente:

![](../img/Heist/8.png)

<span class="center-text">Identificación del usuario hazard y su contraseña</span>

Se identificó una contraseña válida para el usuario **hazrd**. Sin embargo, al intentar autenticarse mediante **WinRM**, se confirmó que no tiene acceso. Adicionalmente, se logró enumerar más cuentas utilizando un ataque de **RID Brute Force**.
### **Ataque RID Brute Force**

El **RID Brute Force** es una técnica utilizada en entornos Windows para enumerar usuarios locales o de dominio mediante la manipulación de **Relative Identifiers (RIDs)**. En Windows, cada usuario tiene un **Security Identifier (SID)** compuesto por un identificador base seguido de un RID único.

#### **¿Cómo funciona?**

1. Se obtiene el SID base de la máquina o dominio objetivo.
2. Se enumeran usuarios incrementando el RID en secuencia (ejemplo: 500 para administrador, 501 para invitado, 1000+ para cuentas de usuario).
3. Se cruzan estos datos con ataques de fuerza bruta o password spraying para comprometer cuentas.

![](../img/Heist/9.png)

<span class="center-text">Fuerza bruta hacia RIDs para obtención de más usuarios</span>

Con los nuevos usuarios identificados, se realizó otro ataque de **password spraying**, obteniendo los siguientes resultados:

![](../img/Heist/10.png)

<span class="center-text">Password Spraying y usuario con credenciales validas encontradas</span>

Se procedió a verificar si el usuario con credenciales válidas tiene permisos para conectarse al sistema.

![](../img/Heist/11.png)

<span class="center-text">Identificación del usuario con acceso al sistema</span>

Una vez confirmada la validez del usuario para conectarse al sistema, se estableció la conexión y se capturó la primera flag.

![](../img/Heist/12.png)

<span class="center-text">User flag</span>

# Privilege Escalation

Iniciamos la enumeración del sistema con técnicas básicas. Durante el proceso, al listar las aplicaciones instaladas, encontramos una que resultó inusual.

![](../img/Heist/13.png)

<span class="center-text">Identificación de softwares instalado en el sistema</span>

Tras investigar el software y verificar la existencia de exploits públicos, encontramos un método que permite **escalar privilegios**.

![](../img/Heist/14.png)

<span class="center-text">Posible escalada de privilegios</span>

Al analizar el exploit, identificamos una serie de registros en el directorio mencionado. Antes de proceder con la explotación, revisamos detenidamente el contenido y logramos descubrir otra contraseña.

![](../img/Heist/15.png)

<span class="center-text">Identificación de posible contraseña</span>

Con una contraseña más agregado a nuestra lista, se procede nuevamnete a hacer un password spraying identificando asi la contraseña del usuario administrador

![](../img/Heist/16.png)

<span class="center-text">Contraseña del usuario administrador</span>

Con este hallazgo conseguido, procedemso a entrar y recuperar la flag de administrador 

![](../img/Heist/17.png)

<span class="center-text">Root flag</span>

> **Nota:** Antes de realizar un ataque de **password spraying**, es crucial verificar la política de contraseñas para determinar el número de intentos permitidos antes de un bloqueo. En entornos reales, este aspecto es fundamental para evitar la detección y el bloqueo de cuentas.

