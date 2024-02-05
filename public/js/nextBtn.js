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
  const btnFurtherContainers = document.querySelectorAll(
    ".btn-further-container"
  );
  // display hidden js elements
  btnFurtherContainers.forEach(function (nextBtn) {
    console.log(
      "🚀 ~ file: nextBtn.js:19 ~ btnFurtherContainers:",
      btnFurtherContainers
    );
    nextBtn.style.display = "grid";
  });

  const btnNextContainers = document.querySelectorAll(".btn-next-container");
  btnNextContainers.forEach(function (nextBtn) {
    nextBtn.style.display = "grid";
  });

  const nextBtns = document.querySelectorAll(`section .next`);
  if (nextBtns) {
    nextBtns.forEach(function (nextBtn) {
      nextBtn.addEventListener("click", function () {
        // console.log("🚀 ~ file: hearts.js:17 ~ nextBtn:", nextBtn.name);
        let nextSection = parseInt(nextBtn.name) + 1;
        // console.log("🚀 ~ file: hearts.js:24 ~ nextSection:", nextSection);
        if (nextSection) {
          document
            .getElementById(nextSection)
            .scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }
};
