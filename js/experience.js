const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const close = document.getElementById("close");
const modeGray = document.getElementById("mode-gray");
const modeMovile = document.getElementById("mode-movile");
const home = document.getElementById("home");
var mode = false;

//Abrir menu movile
burger.addEventListener("click", (e) => {
    menu.style.display = "flex";
});

//Cerrado de menu movile
close.addEventListener("click", (e) => {
    menu.style.display = "none";
});


//Funcionalidad de boton de dark/ligth desktop
modeGray.addEventListener("mouseover", (e) => {
    if (e.target.tagName === "IMG" && mode == false) {  // Verifica que el evento viene de una imagen
        e.target.dataset.originalSrc = e.target.src; // Guarda el src original
        e.target.src = "./../img/mode-white.png"; // Cambia la imagen

    } else if (e.target.tagName === "IMG" && mode == true) {
        e.target.dataset.originalSrc = e.target.src; // Guarda el src original
        e.target.src = "./../img/mode-black.png"; // Cambia la imagen    
    }
});

modeGray.addEventListener("mouseout", (e) => {
    if (e.target.tagName === "IMG" && e.target.dataset.originalSrc && mode == false) {
        e.target.src = "./../img/mode-gray.png"; // Cambia la imagen    
    } else if (e.target.tagName === "IMG" && e.target.dataset.originalSrc && mode == true) {
        e.target.src = "./../img/mode-gray.png"; // Cambia la imagen    
    }
});

modeGray.addEventListener("click", (e) => {

    if (!mode) {
        //Cambio de variables y colores
        document.documentElement.style.setProperty("--var-black", "#F5F5F5");
        document.documentElement.style.setProperty("--var-white", "#0d0d0d");

        e.target.src = "./../img/mode-black.png"; // Cambia la imagen    

    } else if (mode) {

        document.documentElement.style.setProperty("--var-black", "#0d0d0d");
        document.documentElement.style.setProperty("--var-white", "#F5F5F5");

        e.target.src = "./../img/mode-white.png"; // Cambia la imagen    

    }

    mode = !mode;
    // console.log(mode);
});


//Funcionalidad de home 
home.addEventListener("mouseover", (e) => {
    if (e.target.tagName === "IMG" && mode == false) {  // Verifica que el evento viene de una imagen
        e.target.dataset.originalSrc = e.target.src; // Guarda el src original
        e.target.src = "./../img/home-white.png"; // Cambia la imagen

    } else if (e.target.tagName === "IMG" && mode == true) {
        e.target.dataset.originalSrc = e.target.src; // Guarda el src original
        e.target.src = "./../img/home-black.png"; // Cambia la imagen    
    }
});

home.addEventListener("mouseout", (e) => {
    if (e.target.tagName === "IMG" && e.target.dataset.originalSrc && mode == false) {
        e.target.src = "./../img/home-gray.png"; // Cambia la imagen    
    } else if (e.target.tagName === "IMG" && e.target.dataset.originalSrc && mode == true) {
        e.target.src = "./../img/home-gray.png"; // Cambia la imagen    
    }
});


//Funcionalidad de boton de dark/ligth movile
modeMovile.addEventListener("mouseover", (e) => {
    if (e.target.tagName === "IMG" && mode == false) {  // Verifica que el evento viene de una imagen
        e.target.dataset.originalSrc = e.target.src; // Guarda el src original
        e.target.src = "./../img/mode-white.png"; // Cambia la imagen

    } else if (e.target.tagName === "IMG" && mode == true) {
        e.target.dataset.originalSrc = e.target.src; // Guarda el src original
        e.target.src = "./../img/mode-black.png"; // Cambia la imagen    
    }
});

modeMovile.addEventListener("mouseout", (e) => {
    if (e.target.tagName === "IMG" && e.target.dataset.originalSrc && mode == false) {
        e.target.src = "./../img/mode-gray.png"; // Cambia la imagen    
    } else if (e.target.tagName === "IMG" && e.target.dataset.originalSrc && mode == true) {
        e.target.src = "./../img/mode-gray.png"; // Cambia la imagen    
    }
});

modeMovile.addEventListener("click", (e) => {

    if (!mode) {
        //Cambio de variables y colores
        document.documentElement.style.setProperty("--var-black", "#F5F5F5");
        document.documentElement.style.setProperty("--var-white", "#0d0d0d");

        e.target.src = "./../img/mode-black.png"; // Cambia la imagen    

    } else if (mode) {

        document.documentElement.style.setProperty("--var-black", "#0d0d0d");
        document.documentElement.style.setProperty("--var-white", "#F5F5F5");

        e.target.src = "./../img/mode-white.png"; // Cambia la imagen    

    }

    mode = !mode;
    // console.log(mode);
});

//Funcionalidad de burger
burger.addEventListener("mouseover", (e) => {
    if (e.target.tagName === "IMG" && mode == false) {  // Verifica que el evento viene de una imagen
        e.target.dataset.originalSrc = e.target.src; // Guarda el src original
        e.target.src = "./../img/burger-white.png"; // Cambia la imagen

    } else if (e.target.tagName === "IMG" && mode == true) {
        e.target.dataset.originalSrc = e.target.src; // Guarda el src original
        e.target.src = "./../img/burger-black.png"; // Cambia la imagen    
    }
});

burger.addEventListener("mouseout", (e) => {
    if (e.target.tagName === "IMG" && e.target.dataset.originalSrc && mode == false) {
        e.target.src = "./../img/burger-gray.png"; // Cambia la imagen    
    } else if (e.target.tagName === "IMG" && e.target.dataset.originalSrc && mode == true) {
        e.target.src = "./../img/burger-gray.png"; // Cambia la imagen    
    }
});

//Funcionamiento de close
close.addEventListener("mouseover", (e) => {
    if (e.target.tagName === "IMG" && mode == false) {  // Verifica que el evento viene de una imagen
        e.target.dataset.originalSrc = e.target.src; // Guarda el src original
        e.target.src = "./../img/close-white.png"; // Cambia la imagen

    } else if (e.target.tagName === "IMG" && mode == true) {
        e.target.dataset.originalSrc = e.target.src; // Guarda el src original
        e.target.src = "./../img/close-black.png"; // Cambia la imagen    
    }
});

close.addEventListener("mouseout", (e) => {
    if (e.target.tagName === "IMG" && e.target.dataset.originalSrc && mode == false) {
        e.target.src = "./../img/close-gray.png"; // Cambia la imagen    
    } else if (e.target.tagName === "IMG" && e.target.dataset.originalSrc && mode == true) {
        e.target.src = "./../img/close-gray.png"; // Cambia la imagen    
    }
});