function loadPage(event, url) {
    event.preventDefault(); // Prevenir la redirección inmediata
    document.getElementById('loading').style.display = 'flex';
    setTimeout(function() {
        window.location.href = url;
    }, 1000);  // 1 second delay for loading animation
}

function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
}