const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const close = document.getElementById("close");

burger.addEventListener("click", (e) => {
    menu.style.display = "flex";
});

close.addEventListener("click", () => {
    menu.style.display = "none";
})

