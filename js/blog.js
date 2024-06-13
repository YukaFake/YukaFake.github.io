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