const pageThemeToggle = document.querySelector(".theme-toggle");
const pageThemeColorMeta = document.querySelector('meta[name="theme-color"]');

function applyPageTheme(theme, persist = false) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  pageThemeToggle?.setAttribute("aria-pressed", String(isDark));
  pageThemeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  pageThemeColorMeta?.setAttribute("content", isDark ? "#29374c" : "#fffefd");

  if (!persist) return;
  try {
    localStorage.setItem("harmony-theme", isDark ? "dark" : "light");
  } catch {
    // The selected theme still applies when storage is unavailable.
  }
}

applyPageTheme(document.documentElement.dataset.theme || "light");

pageThemeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyPageTheme(nextTheme, true);
});

const aboutFaq = document.querySelector("[data-about-faq]");
const aboutFaqImage = aboutFaq?.querySelector(".ifaq-image");
const aboutFaqImageElement = aboutFaqImage?.querySelector("img");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let aboutPhotoRotationTimer = null;

function stopAboutPhotoRotation() {
  window.clearInterval(aboutPhotoRotationTimer);
  aboutPhotoRotationTimer = null;
}

function showAboutPhotos(sources) {
  stopAboutPhotoRotation();
  if (!aboutFaqImage || !aboutFaqImageElement || !sources.length) return;

  let index = 0;
  aboutFaqImage.hidden = false;
  aboutFaqImageElement.src = sources[index];

  if (prefersReducedMotion) return;
  aboutPhotoRotationTimer = window.setInterval(() => {
    index = (index + 1) % sources.length;
    aboutFaqImageElement.src = sources[index];
  }, 900);
}

aboutFaq?.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const answer = item.querySelector(".faq-answer");
    const willOpen = !item.classList.contains("is-open");

    aboutFaq.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
      openItem.classList.remove("is-open");
      openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      openItem.querySelector(".faq-answer").setAttribute("aria-hidden", "true");
    });

    item.classList.toggle("is-open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
    answer.setAttribute("aria-hidden", String(!willOpen));

    if (willOpen) showAboutPhotos(item.dataset.photos.split(","));
    else if (aboutFaqImage) {
      stopAboutPhotoRotation();
      aboutFaqImage.hidden = true;
    }
  });
});
