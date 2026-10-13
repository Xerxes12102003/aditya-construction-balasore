const video = document.querySelector("[data-hero-video]");

if (video) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (!reduce && !saveData) video.play().catch(() => {});
}
