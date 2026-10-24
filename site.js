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

document.querySelectorAll(".turntable").forEach((tt) => {
  const view = tt.querySelector("img");
  const bar = tt.querySelector(".tt-load i");
  const count = Number(tt.dataset.frames);
  const url = (n) => tt.dataset.src.replace("{i}", String(n).padStart(3, "0"));
  const frames = [];
  let current = Number(tt.dataset.start) || 0;
  let loaded = 0;
  let spinning = true;
  let drag = null;

  const show = (n) => {
    current = ((Math.round(n) % count) + count) % count;
    if (frames[current] && frames[current].complete) view.src = frames[current].src;
  };

  const stopSpin = () => {
    spinning = false;
    tt.classList.add("touched");
  };

  const load = () => {
    for (let n = 0; n < count; n++) {
      const im = new Image();
      im.onload = () => {
        loaded++;
        bar.style.width = `${(100 * loaded) / count}%`;
        if (loaded === count) {
          tt.classList.add("ready");
          requestAnimationFrame(spin);
        }
      };
      im.src = url((current + n) % count);
      frames[(current + n) % count] = im;
    }
  };

  let last = 0;
  const spin = (time) => {
    if (!spinning) return;
    if (time - last > 70) {
      show(current + 1);
      last = time;
    }
    requestAnimationFrame(spin);
  };

  tt.addEventListener("pointerdown", (event) => {
    if (!tt.classList.contains("ready")) return;
    stopSpin();
    drag = { x: event.clientX, start: current };
    tt.setPointerCapture(event.pointerId);
    tt.classList.add("dragging");
  });

  tt.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const perFrame = tt.clientWidth / count / 1.2;
    show(drag.start - (event.clientX - drag.x) / perFrame);
  });

  const release = () => {
    drag = null;
    tt.classList.remove("dragging");
  };
  tt.addEventListener("pointerup", release);
  tt.addEventListener("pointercancel", release);

  tt.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    stopSpin();
    show(current + (event.key === "ArrowLeft" ? 1 : -1));
  });

  new IntersectionObserver((entries, observer) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      load();
    }
  }, { rootMargin: "300px" }).observe(tt);
});
