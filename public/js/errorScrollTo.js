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
  const errorDatasec = document.getElementById("errorDatasec");
  const errorFilm = document.getElementById("errorFilm");

  console.log(
    "🚀 ~ file: errorScrollTo.js:14 ~ setup ~ errorDatasec:",
    errorDatasec
  );

  if (errorDatasec) {
    errorDatasec.scrollIntoView({
      behavior: "smooth"
    });
  }
  if (errorFilm) {
    errorFilm.scrollIntoView({
      behavior: "smooth"
    });
  }
};
