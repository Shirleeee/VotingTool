export const init = () => {
  if (
    "querySelector" in document &&
    "head" in document &&
    "classList" in document.head &&
    "addEventListener" in window
  ) {
    document.addEventListener("DOMContentLoaded", setup);
  }
};

const setup = () => {
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  const navLinks = document.querySelectorAll(".menu__item");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const sectionId = link.getAttribute("href").substring(1);
      console.log("🚀 ~ file: filmmenue.js:29 ~ sectionId:", sectionId);
      const navbar = document.querySelector("nav");

      const navbarHeight = navbar.offsetHeight +40;

      console.log("Höhe der Navigationsleiste:", navbarHeight, "Pixel");     
     
      let sektions = document.querySelectorAll("section");
      sektions.forEach((sektion) => {
        sektion.style.paddingTop = navbarHeight + "px";
      });
      scrollToSection(sectionId);
    });
  });
};
