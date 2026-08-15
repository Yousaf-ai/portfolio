document.getElementById("year").textContent = new Date().getFullYear();

const progressTrack = document.querySelector(".scroll-progress");
const progressBar = document.querySelector(".scroll-progress-bar");
const backToTop = document.querySelector(".back-to-top");
let ticking = false;

function updateScrollUI() {
  if (!progressBar || !progressTrack || !backToTop) {
    ticking = false;
    return;
  }

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
  const percent = Math.round(progress * 100);

  progressBar.style.transform = `scaleX(${progress})`;
  progressTrack.setAttribute("aria-valuenow", String(percent));
  backToTop.classList.toggle("visible", scrollTop > 200);
  ticking = false;
}

function onScrollOrResize() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateScrollUI);
}

window.addEventListener("scroll", onScrollOrResize, { passive: true });
window.addEventListener("resize", onScrollOrResize);
updateScrollUI();

if (backToTop) {
  backToTop.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const header = document.querySelector(".site-header");
const mobileNav = window.matchMedia("(max-width: 900px)");

function placeNav() {
  if (mobileNav.matches) {
    document.body.appendChild(nav);
  } else if (header && menuToggle) {
    header.insertBefore(nav, menuToggle);
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
}

placeNav();
mobileNav.addEventListener("change", placeNav);

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  });
});

document.querySelectorAll(".bar span[data-width]").forEach((bar) => {
  bar.style.setProperty("--w", bar.dataset.width);
});

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".skill-group").forEach((group) => skillObserver.observe(group));
