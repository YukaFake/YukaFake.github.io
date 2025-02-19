![[Pasted image 20250209000235.png]]

#Windows #AD #BloodHound #WriteDCL #AbusoDeWriteDCL
____
# Resumen

Forest en un Controlador de Dominio Windows (DC) de fácil dificultad, para un dominio en el que se ha instalado Exchange Server. Se descubre que el DC permite enlaces LDAP anónimos, que se utilizan para enumerar objetos de dominio. La contraseña de una cuenta de servicio con la preautenticación Kerberos deshabilitada puede ser crackeada para obtener un punto de apoyo. Se descubre que la cuenta de servicio es miembro del grupo Operadores de cuentas, que puede utilizarse para añadir usuarios a grupos privilegiados de Exchange. La pertenencia al grupo Exchange se aprovecha para obtener privilegios DCSync en el dominio y volcar los hashes NTLM.

___

# Reconocimiento

Se precede a validar conectividad con la maquina para corroborar así correcto alcance al objetivo

![[Pasted image 20250209000515.png]]

> *Comprobación de alcance al objetivo*

Posteriormente se elaboro un escaneo de todos los puerto usando la herramienta *RUSTSCAN* con la intención de buscar algun servicio vulnerable o algún punto de apoyo para un acceso inicial

![[Pasted image 20250209000647.png]]

> *Escaneo con nmap*

En los escaneo no se logra identificar nada interesante más que el nombre del dominio al que no estamos enfrentando el cual es **htb.local** y el nombre del equipo es **FOREST**, por lo que se procede a agregar esos 2 datos a nuestro archivito de */etc/hosts*

# Enumeración

Con ayuda de la herramienta netxec procedemos a enumerar usuarios, ya que hemos corroborado que tenemos acceso como usuario anónimo 

![[Pasted image 20250209001135.png]]

> *Enumeración de usuarios*

Con los usuarios encontrados, validamos con la herramienta ***kerberbrute*** para ver si son validos, los cuales los siguientes fueron validos

![[Pasted image 20250209001308.png]]

> *Validación de usuarios en el sistema*

# Explotación

Con una lista potencial de usuarios y el puerto de Kerberos abierto, procedemos a realizar un ataque **AS-REP Roasting**. Este ataque consiste en solicitar un Ticket Granting Ticket (TGT) para usuarios que no requieren preautenticación, lo que nos permite obtener un hash cifrado de su contraseña. Posteriormente, este hash puede ser crackeado offline para recuperar la contraseña en texto plano del usuario vulnerable.

![[Pasted image 20250209001500.png]]

> *ASP-Roasting Attack*

Se logro obtener un ticket TGT del usuario *svs-alfresco* por lo que con ayuda de hashcat, se procede a romperlo dando la siguiente contraseña

![[Pasted image 20250209001627.png]]

> *Contraseña del usuario svc-alfresco

Con un usuario y una contraseña procedemos a validar si es útil para poder conectarnos remotamente, nuevamente usando netxec con el argumento winrm

![[Pasted image 20250209001753.png]]

> *Usuario con acceso a conexion remota*

Al nota que nos aparece el mensaje **Pwn3d!** confirmamos que tenemos acceso por winrm por lo que nos procedemos a conectar para estar dentro y capturar la flag de user, si es el caso

![[Pasted image 20250209001935.png]]

> *Flag de user*

# Escalada de Privilegios

Para la escalada de privilegios, utilizamos **BloodHound**, ya que contamos con credenciales válidas de un usuario.
Tras analizar los resultados, identificamos un posible camino de escalada que nos permite obtener privilegios de **Domain Admin**, lo que nos brinda control total sobre el dominio.

![[Pasted image 20250209002301.png]]

> *Posible escalada de privilegios*

Al analizar los resultados de **BloodHound**, observamos la siguiente cadena de privilegios:

1. **Pertenecemos al grupo "Service Accounts"**, que a su vez:
2. **Pertenece a "Privileged IT Account"**, que a su vez:
3. **Pertenece a "Account Operators"**, el cual:
4. **Tiene control total sobre el grupo "Exchange Windows Permissions"**, que a su vez:
5. **Posee privilegios de escritura sobre el DACL (WriteDACL)**.

Dado que **Exchange Windows Permissions** tiene permisos de escritura en el DACL del dominio, podemos explotar esta configuración para escalar privilegios. El ataque se desarrolla en los siguientes pasos:

6. **Agregar un usuario malicioso** o **modificar uno existente** dentro del grupo **Exchange Windows Permissions**.
7. **Otorgar permisos de réplica de directorio (DS-Replication-Get-Changes)** a nuestra cuenta maliciosa.
8. **Utilizar `secretsdump.py` de Impacket** para extraer los hashes de **NTDS.dit**, lo que nos permitirá obtener credenciales de administradores de dominio.

### Creamos un usuario nuevo

```powershell
net user yukafake password123! /add /domain
```

### Lo agregamos al grupo de Exchange Windows Permission

```powershell
net group "Exchange Windows Permissions" /add
```

### Creamos un objeto PSCredential

```powershell
$SecPassword = ConvertTo-SecureString 'password123!' -AsPlainText -Force
$Cred = New-Object System.Management.Automation.PSCredential('htb.local\yukafake', $SecPassword)
```

### Y por ultimo efectuamos el ataque

```powershell
Add-DomainObjectAcl -Credential $Cred -PrincipalIdentity yukafake -Rights DCSync
```
*NOTA: Es necesario importar PowerView.ps1 para que funcione este ataque* 


Luego haber esta seria de pasos, ahora con la herramienta de impacket llamada secretdump, dumpeamos el hash NTLM de administrador, para conectarnos por evil-winrm y obtner la flag de root

![[Pasted image 20250209000445.png]]

> *Obtención de hash de administrador*

![[Pasted image 20250209004256.png]]

> *Flag administrador*


