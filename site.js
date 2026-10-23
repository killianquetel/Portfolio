const box = document.querySelector(".lightbox");
const boxImg = box.querySelector("img");
const boxText = box.querySelector("p");

document.querySelectorAll("a.zoom").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    boxImg.src = link.href;
    boxText.textContent = link.dataset.caption || "";
    box.hidden = false;
  });
});

box.addEventListener("click", () => {
  box.hidden = true;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") box.hidden = true;
});
