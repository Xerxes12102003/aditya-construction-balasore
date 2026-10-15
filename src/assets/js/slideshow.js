const root = document.querySelector("[data-slideshow]");

if (root) {
  const slides = [...root.querySelectorAll(".hero__slide")];
  const btn = root.querySelector("[data-pause]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer = null;
  let userPaused = false;

  const show = (n) => {
    slides[index].classList.remove("is-active");
    index = (n + slides.length) % slides.length;
    slides[index].classList.add("is-active");
  };
  const stop = () => {
    clearInterval(timer);
    timer = null;
  };
  const start = () => {
    if (!timer && !userPaused && !reduce) timer = setInterval(() => show(index + 1), 4000);
  };

  if (reduce) {
    btn.hidden = true;
  } else {
    btn.addEventListener("click", () => {
      userPaused = !userPaused;
      btn.setAttribute("aria-pressed", String(userPaused));
      btn.textContent = userPaused ? "Play" : "Pause";
      userPaused ? stop() : start();
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);
    start();
  }
}
