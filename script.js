const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-header]");
const parallaxTarget = document.querySelector("[data-parallax]");
const revealItems = document.querySelectorAll(".reveal");
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
const magneticItems = document.querySelectorAll(".magnetic");

const setHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeader();
window.addEventListener("scroll", setHeader, { passive: true });

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (!prefersReduced && parallaxTarget) {
  let ticking = false;

  const updateParallax = () => {
    const y = Math.round(window.scrollY * -0.075);
    parallaxTarget.style.setProperty("--parallax-y", `${y}px`);
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    },
    { passive: true }
  );
}

const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (!prefersReduced && hasFinePointer && dot && ring) {
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { x: pointer.x, y: pointer.y };

  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
    },
    { passive: true }
  );

  const animateCursor = () => {
    ringPos.x += (pointer.x - ringPos.x) * 0.18;
    ringPos.y += (pointer.y - ringPos.y) * 0.18;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
    window.requestAnimationFrame(animateCursor);
  };

  animateCursor();

  document.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("pointerenter", () => ring.classList.add("is-active"));
    item.addEventListener("pointerleave", () => ring.classList.remove("is-active"));
  });
}

if (!prefersReduced && hasFinePointer) {
  magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
    });

    item.addEventListener("pointerleave", () => {
      item.style.transform = "translate(0, 0)";
    });
  });
}
