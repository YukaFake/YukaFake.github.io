![[Pasted image 20250103121018.png]]

#Windows #Easy #dnspyy #breakpoint #GenericAll #powermand #PowerView #getST
___
# Resumen 

El soporte es una máquina Windows de Easy difficulty que cuenta con un recurso compartido SMB que permite la autenticación anónima. Tras conectarse al recurso compartido, se descubre un archivo ejecutable que se utiliza para consultar el servidor LDAP de la máquina en busca de usuarios disponibles. Mediante ingeniería inversa, análisis de red o emulación, se identifica la contraseña que el binario utiliza para enlazar el servidor LDAP y que puede utilizarse para realizar más consultas LDAP. Se identifica un usuario llamado `support` en la lista de usuarios, y se encuentra que el campo `info` contiene su contraseña, permitiendo así una conexión WinRM a la máquina. Una vez en la máquina, la información del dominio puede ser recogida a través de `SharpHound`, y `BloodHound` revela que el grupo `Shared Support Accounts` del que el usuario `support` es miembro, tiene privilegios `GenericAll` en el Controlador de Dominio. Se realiza un ataque de Delegación Restringida Basada en Recursos, y se recibe un shell como `NT Authority\System`.

___

Se realizó un escaneo de la red con RustScan para identificar los puertos abiertos y los servicios en ejecución.

![](Pasted%20image%2020250217223659.png)
<span class="center-text">Escaneo con Rustscan</span>

Como parte del proceso de enumeración, se verificó la existencia de recursos compartidos accesibles de forma anónima, obteniendo los siguientes resultados:

![](Pasted%20image%2020250217223850.png)
<span class="center-text">Recurso compartido encontrado</span>

Una vez identificado el recurso, se estableció conexión mediante `smbclient`, donde se encontró un directorio que contenía un archivo ZIP. Este archivo parecía incluir un ejecutable, por lo que se procedió a descargarlo para su análisis.

![](Pasted%20image%2020250217224020.png)
<span class="center-text">Archivo interesante</span>

Una vez descargado en nuestro sistema, se procedió a descomprimir el archivo para analizar su contenido.

![](Pasted%20image%2020250217224103.png)
<span class="center-text">Contenido del zip</span>

Al confirmar que se trata de un archivo ejecutable (`.exe`), se trasladó a un entorno Windows para ejecutarlo y analizar su comportamiento en profundidad.

Al ejecutar el exe se observa que existen 2 modos uno denominado find y el otro user, se procede a interactuar con cada uno para analizar su funcion

![](Pasted%20image%2020250217225630.png)
<span class="center-text">Interactuando con el programa</span>

Se identificó que el programa permite buscar usuarios por su primer y último apellido, así como por su nombre. Sin embargo, la interacción con la aplicación es limitada debido a la falta de conexión a la VPN de HTB. Para superar esta restricción, se procedió a desensamblar el ejecutable utilizando `dnSpy`, lo que permitió identificar varias funciones clave. Entre ellas, la más relevante es `ldapQuery`, ya que revela la consulta de un usuario al servicio LDAP, lo que podría proporcionar información valiosa sobre la autenticación y estructura del directorio.

![](Pasted%20image%2020250217230103.png)
<span class="center-text">Desamoblando exe e identificación de una función interesante</span>

Se identificó que el usuario utilizado en la consulta LDAP es **"ldap"**, y la contraseña se pasa como argumento. Para obtener más información, se estableció un **breakpoint** en el código y se inició el proceso de depuración. El objetivo es interceptar la ejecución del programa y observar si la contraseña se encuentra en **texto plano** cuando es procesada en memoria, lo que podría permitir su extracción y posterior uso para autenticación.

![](Pasted%20image%2020250217230338.png)
<span class="center-text">Breakpoint establecido</span>

Con el **breakpoint** establecido y los argumentos adecuados para la ejecución del programa, se procedió a iniciarlo en modo depuración. Durante la ejecución, se logró interceptar el momento en que la contraseña del usuario **ldap** es procesada en memoria, permitiendo su extracción en **texto plano**.

![](Pasted%20image%2020250217230447.png)
<span class="center-text">Obtención de contraseña en texto claro</span>

Utilizando la herramienta **nexec**, se procedió a validar las credenciales obtenidas. Para ello, se ingresó el usuario **support** junto con la contraseña, previamente codificada, como argumento en la ejecución. Este proceso permitió confirmar la autenticidad de las credenciales y verificar el acceso con éxito.

![](Pasted%20image%2020250217230939.png)<span class="center-text">Validación de usuario con la contraseña encontrada</span>

Se logro observar que ahora hemos obtenido una contraseña y un usuario, ahora empezamos a enumerar más información tirando de nexec para enumerar ldap

![](Pasted%20image%2020250217231241.png)
<span class="center-text">Obteniendo información acerca del dominio</span>

Una vez extraída la información, se llevó a cabo un análisis detallado, identificando que el usuario de interés para obtener acceso es **support**. Este usuario pertenece al grupo **Remote Management Users**, lo que le otorga privilegios para acceder al sistema de forma remota. Con este hallazgo, se utilizó la herramienta **ldapsearch** para recopilar más información sobre la cuenta, con el objetivo de evaluar posibles vectores de acceso.

![](Pasted%20image%2020250217232306.png)
<span class="center-text">Usuario objetivo</span>

![](Pasted%20image%2020250217232651.png)
<span class="center-text">Posible contraseña</span>

Una vez investigado este usuario notamos que tiene un campo diferente al del resto, por lo que procedemos validar si no es una contraseña para ello nuevamnete usamo nexec para la confirmación

![](Pasted%20image%2020250217232827.png)
<span class="center-text">Validación exitosa</span>

Con esta validación hecha procedemos a entrar al sistema y capturar la flag de user

![](Pasted%20image%2020250217232956.png)
<span class="center-text">User flag</span>

# Privilege Escalation

Para la **escalada de privilegios**, al contar con credenciales válidas del usuario **support**, se procedió a ejecutar **SharpHound**. Esta herramienta permitió recopilar información detallada sobre la infraestructura del dominio, identificando posibles **vectores de ataque** que podrían facilitar la escalada de privilegios dentro del sistema.

![](Pasted%20image%2020250217233456.png)
<span class="center-text">Resultados de SharpHound</span>

Se transfirió el archivo **ZIP** generado por **SharpHound** a nuestro sistema local y se procedió a analizarlo utilizando **BloodHound**. Esta herramienta permitió visualizar las relaciones y permisos dentro del dominio, identificando posibles rutas de **escalada de privilegios** basadas en los privilegios del usuario **support**.

Despúes de un analices identificamos que el usuario support es miembro del grupo de Shared Support account y este miembre tiene privilegios GenericAll sobre el equipo, por lo que absuando de este privilegios podemos llegar hacer Administradores de dominio pero para ello necesitaremos primero preparar nuestro entorno por lo que empezamos a transferirnos las herramientas a usar en este caso

![](Pasted%20image%2020250217234016.png)

Para empezar a abusar del Resource-based Constrained Delegation primero describamos que es este tipo de abuso

### Resource-based Constrained Delegation

Es similar a la Delegación Restringida básica pero en lugar de dar permisos a un objeto para suplantar a cualquier usuario contra un servicio. La Delegación Restringida basada en recursos establece en el objeto quién puede suplantar a cualquier usuario contra él.
En este caso, el objeto restringido tendrá un atributo llamado msDS-AllowedToActOnBehalfOtherIdentity con el nombre del usuario que puede suplantar a cualquier otro usuario contra él.

Con esta breve descripción procedemos a empezar el ataque

Primero importamos las herramientas necesarias

```powershell
# Importar los módulos necesarios 
Import-Module PowerMad Import-Module PowerView
```

Luego hacemos lo siguiente

```powershell
# Crear un nuevo objeto de computadora en el dominio con el nombre 'SERVICEA'
New-MachineAccount -MachineAccount SERVICEA -Password $(ConvertTo-SecureString '123456' -AsPlainText -Force) -Verbose
``` 

Posteriormente hacemos lo siguiente 

```powershell
# Obtener el SID del equipo que queremos usar para la delegación
$ComputerSid = (Get-DomainComputer FAKECOMPUTER -Properties objectsid).objectsid
# Crear un descriptor de seguridad para configurar la delegación 
$SD = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList "O:BAD:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;$ComputerSid)" 
$SDBytes = New-Object byte[] ($SD.BinaryLength) 
$SD.GetBinaryForm($SDBytes, 0)
```

Y por ultimo hacemos 

```powershell
# Aplicar la delegación basada en recursos al equipo objetivo 
Get-DomainComputer dc | Set-DomainObject -Set @{'msds-allowedtoactonbehalfofotheridentity'=$SDBytes}
```

Seguimos estos pasos y se debería ver de la siguiente manera

![](Pasted%20image%2020250220232956.png)
*Preparación para el abuso del privilegio GenericAll*

En nuestra maquina de atacante lo que hacemos ahora es lo siguiente:

![](Pasted%20image%2020250220233021.png)
*Solicitud de ticket de servicio*

#### **Desglose de los parámetros:**

- `impacket-getST`: Herramienta de Impacket que obtiene un **Service Ticket (ST)** utilizando **S4U2Self y S4U2Proxy**.
- `-spn cifs/dc.support.htb`: Especifica el **Service Principal Name (SPN)** del servicio al que queremos autenticarnos. En este caso, se está apuntando al `CIFS` (Common Internet File System) del **controlador de dominio (DC)** en `support.htb`.
- `-impersonate Administrator`: Intenta **impersonar** al usuario **Administrator** en el dominio.
- `-dc-ip 10.10.11.174`: Dirección IP del **controlador de dominio** (`Domain Controller`).
- `support.htb/attackersystem$:Summer2018!`: Credenciales de autenticación en el formato `DOMINIO/USUARIO:CONTRASEÑA`. Aquí, `attackersystem$` es probablemente una **cuenta de máquina** (denotada por `$` al final).

Si todo sale bien ahora podemos ingresar al controlador de dominio haciendo lo siguiente


![](Pasted%20image%2020250220233032.png)
*Ingreso al sistema como Administrador*

- `KRB5CCNAME=Administrator@cifs_dc.support.htb@SUPPORT.HTB.ccache`
    
    - Define la variable de entorno para usar un **ticket Kerberos en caché**, en lugar de credenciales de usuario y contraseña.
    - Este ticket se obtuvo previamente mediante un ataque de **Resource-Based Constrained Delegation (RBCD)**.
- `impacket-psexec`
    
    - Herramienta de Impacket que usa el protocolo **SMB (Server Message Block)** para ejecutar comandos de forma remota en un sistema Windows.
    - Funciona creando un **servicio temporal** en la máquina objetivo y ejecutando un comando con privilegios elevados.
- `-k`
    
    - Indica que se debe utilizar **autenticación Kerberos**, en lugar de NTLM.
- `-no-pass`
    
    - No se necesita ingresar una contraseña, ya que el ticket Kerberos en caché se está utilizando para autenticación.
- `dc.support.htb`
    
    - Especifica el nombre del **controlador de dominio** al que se conectará.

Y al final capturamos la flag Administrator

![](Pasted%20image%2020250220233124.png)
*Flag root*
