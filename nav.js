/* NAVIGATION */

const mobileNav = document.getElementById("mobile-nav");
const menuToggle = document.getElementById("menu-toggle");

menuToggle.addEventListener("click", () => {

    const isOpen = mobileNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);
});

function closeMenu() {

    mobileNav.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
}

const menuBreakpoint = window.matchMedia("(max-width: 600px)");

menuBreakpoint.addEventListener("change", closeMenu);

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" &&
        mobileNav.classList.contains("open")) {

        closeMenu();
        menuToggle.focus();
    }
});