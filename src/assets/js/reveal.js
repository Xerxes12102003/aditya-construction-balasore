const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-stagger]").forEach((parent) => {
  [...parent.children].forEach((child, i) => {
    child.setAttribute("data-reveal", "");
    child.style.setProperty("--i", i);
  });
});

const items = document.querySelectorAll("[data-reveal]");

if (reduce || !("IntersectionObserver" in window)) {
  items.forEach((el) => el.classList.add("is-visible"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -15% 0px" }
  );
  items.forEach((el) => io.observe(el));
}
