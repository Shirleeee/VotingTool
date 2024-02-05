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
  // const refreshInterval = 10000; // 5000 Millisekunden (5 Sekunden)
  // const reloadPage = () => {
  //   location.reload();
  //   reloadData();
  // };

  // setInterval(reloadPage, refreshInterval);
  // reloadData();

  // function reloadData() {
    const barItems = document.querySelectorAll(".bar-item");
    const spanResults = document.querySelectorAll("#span-result");

    for (let i = 0; i < barItems.length; i++) {
      const widthPercentage = parseFloat(spanResults[i].textContent);
      barItems[i].style.width = widthPercentage + "%";
    }
  // }
};
