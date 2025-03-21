
![](../img/Manager/0.png)

#Windows #Medium #RoadToOSCP
___
Realizamos un escaneo inicial utilizando la herramienta **Rustscan**, la cual generó el siguiente resultado:

![](../img/Manager/1.png)

Posteriormente, se procedió a analizar los resultados obtenidos, y como paso siguiente se realizó una revisión detallada de los protocolos comunes en sistemas Windows, enfocándose en el puerto **445** asociado a **SMB (Server Message Block)**. Para este análisis, se utilizó la herramienta **smbclient**, permitiendo interactuar directamente con el servicio y evaluar posibles configuraciones débiles o vulnerabilidades.

![](../img/Manager/2.png)

Al observar que existe una via potencial de enumerar recursos compartidos se procedio a hacer una atque de fuerza bruta hacia los rids, asi permitiendo obtner usuarios, se procedio a usar la herramienta de impacket-lookupsid

![](../img/Manager/3.png)

Una vez obtenido los usuairo se procedio a validar si son existen, esto fue posible gracias a la herramienta de kerbrute que con la utilidad de enumuser podemos corroborar si existen dichos usuarios

![](../img/Manager/4.png)

Y se observo que es correcto, los usuario son validos por lo tanto ahora, probemos una tecnica que nos permite hacer fuerza bruta sobre los usuarios usando el mimso nombre de usuario para su contraseña, para ello usamos nxc utilidad de crackmapexec 


![](../img/Manager/5.png)

Se observa que el usuario operator posee la misma contraseña que el nombre del usuario, procedemos ver si podemos ver diferetnes recursos compartidos, sin embargo no se logro apreciar nada, ahora analizando nuevamente nuestros escaneo se observa la precencia de un protocoo mssql, para ello se procedio a intentar entrar con estas credenciales dando como resultado sactisfactorio el acceso

![](../img/Manager/6.png)

En mssql existe una utilidad que nos permite listar direcotorios, para ellos procedemos a intentar ver si es posible ya que en algunos casos es limitado y no se puede hacer esto

![](../img/Manager/7.png)

Se logra apreciar que es poible hacer eso, al percartarnos que es un IIS el servidor web, archivos criticos siempre son guardados en /inetpub/wwwroot/ observemos que hay alli

![](../img/Manager/8.png)

Se aprecia un archivo zip que parece como una copia, y se encuentra en el mimso direcotorio que la pagina web por lo tanto con un get se podra descargar

Una vez descargado se procedio a analizar el archovo primero un 7z l se listo todo antes de descomprimirlo, y se observo un archiovo oculto que al abrirlo se logro ver credenciales en texto claro, que fuero posteriormente probadas y se logro el accesso al sistema

![](../img/Manager/9.png)

![](../img/Manager/10.png)

![](../img/Manager/11.png)


Ahora para la escalada de privilegios usamos del recurso ADpeas que nos permite enumerar vectores de ataque para poder elevar nuestros privilegios

Después de ejecutar **ADPeas**, analizamos los resultados obtenidos. Observamos que se hace referencia a Certificados, un indicador importante en el contexto de seguridad en Active Directory. Siempre que identifiquemos Certificados, es recomendable utilizar herramientas especializadas como **Certipy**. Estas herramientas son especialmente útiles para explorar configuraciones relacionadas con servicios de certificados en AD, permitiéndonos evaluar hasta qué nivel de acceso o privilegios (_ADSC_) podemos escalar de manera efectiva y segura

![](../img/Manager/12.png)

Utilizando la herramienta previamente mencionada, **Certipy**, procedemos a su ejecución. Los resultados indican que el sistema es vulnerable a la explotación del ataque **ESC7**, lo que confirma la posibilidad de escalar privilegios a través de esta técnica.

![](../img/Manager/13.png)

Luego de invesitgar, [aquí](https://book.hacktricks.wiki/en/windows-hardening/active-directory-methodology/ad-certificates/domain-escalation.html) podemos obtener más recursos para saber como aprovecharnos de los ESC y que son exactamente, en este caso particular usaremos el ESC7 de tipo de ataque 2

Primero empezaremos agregando a raven a el grupo de manager, para ello se elaboro lo siguiente 

![](../img/Manager/14.png)

Seguidamente estaremos activando la plantilla SubCA

![](../img/Manager/15.png)

Esta solicitud será denegada, pero guardaremos la clave privada y anotaremos el ID de la solicitud.

![](../img/Manager/16.png)

Con nuestro Manage CA y Manage Certificates, podemos entonces emitir la solicitud de certificado fallida con el comando ca y el parámetro -issue-request  

![](../img/Manager/17.png)
Y por último, podemos recuperar el certificado emitido con el comando req y el parámetro -retrieve 

![](../img/Manager/18.png)

Y una vez obtenida los hashes, hacemos un pass the hash usando Evil-wirm para conectarnos como administrador

![](../img/Manager/19.png)
