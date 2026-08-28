const preloaderFrames = [
  "preloader-1.png",
  "preloader-2.png",
  "preloader-3.png",
  "preloader-4.png",
  "preloader-5.png",
  "preloader-6.png",
];
const sitePreloader = document.querySelector("#site-preloader");
const preloaderImage = document.querySelector("#preloader-frame");
const preloaderStartedAt = performance.now();
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
let preloaderFrameIndex = 0;
let preloaderFrameTimer = null;
let preloaderHasFinished = false;

preloaderFrames.slice(1).forEach((source) => {
  const frame = new Image();
  frame.src = source;
});

if (sitePreloader && preloaderImage && !prefersReducedMotion) {
  preloaderFrameTimer = window.setInterval(() => {
    preloaderFrameIndex = (preloaderFrameIndex + 1) % preloaderFrames.length;
    preloaderImage.src = preloaderFrames[preloaderFrameIndex];
  }, 200);
}

function finishPreloader() {
  if (preloaderHasFinished) return;
  preloaderHasFinished = true;

  const minimumDuration = prefersReducedMotion ? 0 : 1200;
  const remainingDuration = Math.max(
    0,
    minimumDuration - (performance.now() - preloaderStartedAt),
  );

  window.setTimeout(() => {
    if (preloaderFrameTimer) window.clearInterval(preloaderFrameTimer);
    document.body.classList.remove("is-loading");
    document.documentElement.classList.add("is-ready");
    window.requestAnimationFrame(() => initializeCardVideos(document));

    if (!sitePreloader) return;
    sitePreloader.classList.add("is-leaving");

    const removePreloader = () => sitePreloader.remove();
    sitePreloader.addEventListener("transitionend", removePreloader, {
      once: true,
    });
    window.setTimeout(removePreloader, 600);
  }, remainingDuration);
}

if (document.readyState === "complete") {
  finishPreloader();
} else {
  window.addEventListener("load", finishPreloader, { once: true });
}

const emailContact = document.querySelector(".email-contact");
const emailTrigger = document.querySelector(".email-trigger");

function closeEmailBubble() {
  if (!emailContact || !emailTrigger) return;
  emailContact.classList.remove("is-open");
  emailTrigger.setAttribute("aria-expanded", "false");
}

if (emailContact && emailTrigger) {
  emailTrigger.addEventListener("click", () => {
    const willOpen = !emailContact.classList.contains("is-open");
    emailContact.classList.toggle("is-open", willOpen);
    emailTrigger.setAttribute("aria-expanded", String(willOpen));
  });

  document.addEventListener("click", (event) => {
    if (!emailContact.contains(event.target)) closeEmailBubble();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeEmailBubble();
      emailTrigger.focus();
    }
  });
}

const collections = {
  projects: [
    /*{
      title: "Pardon",
      description:
        "Chrome extension website blocker requiring partner accountability.",
    },*/
    {
      title: "Morra Ai",
      description:
        "AI-powered practice app with live audio transcription, custom questions, and feedback for the IB French Individual Oral.",
      video: "morra-ai.mp4",
      poster: "morra-ai-poster.png",
      url: "https://morrai-production.up.railway.app",
      tags: ["Full-Stack Development", "Product Design"],
    },
    {title: "more coming soon!!"}
  ], 
  community: [
    {
      title: "HOSA Canada",
      description:
        "Managing workshops for 9,000+ students across Canada.",
      poster: "hosa-poster.png",
      url: "https://www.hosacanada.org",
      tags: ["Project Management", "Education"],
    },
    {
      title: "Ignite Fair",
      description:
        "Leading 18 executives to create in-person events for 800+ students in the GTA.",
      poster: "ignite-fair.JPG",
      url: "https://www.ignitefair.org",
      tags: ["Project Management", "Leadership"],
    },
  ],
  "case-study": [
    {
      title: "YPB Case Study",
      description:
        "Market research and product decisions for Abercrombie's athleisure sub-brand, YPB. Ivey Horizon Case Competition Winner.",
      video: "case-competition.mp4",
      poster: "case-competition-poster.png",
      tags: ["Product Strategy", "Market Research"],
    },
  ],
  graphics: [
  
  ],
};

const faqItems = [
  {
    question: "what’s your go-to digicam?",
    answer: "My Nikon Coolpix. I love the ethereal quality of the (sometimes blinding) flash. I bring it with me everywhere, and it's a haven of my favourite people and places.",
    photos: ["camera-1.png", "camera-2.png", "camera-3.png"],
  },
  {
    question: "something you’re proud of building?",
    answer: "Aporia Literary Journal, a poetry and visual arts journal & community with works by incredibly talented young people across Canada. Check it out at",
    answerLink: {
      href: "https://www.aporialiterary.ca",
      label: "aporialiterary.ca",
    },
    photos: ["aporia-1.png", "aporia-2.png", "aporia-3.png"],
  },
  {
    question: "best purchase?",
    answer: "My Owala. It's truly one of my little joys in life and reminds me to #stayhydrated.",
    photos: ["owala-1.png", "owala-2.png", "owala-3.png"],
  },
  {
    question: "something you think more people should do?",
    answer: "Lift weights with a focus on mobility and athleticism. It's an invaluable investment in long-term quality of life.",
    photos: ["exercise-1.png", "exercise-2.png", "exercise-3.png"],
  },
  {
    question: "favourite art medium?",
    answer: "Acrylic!! I love how fast-drying it is. Makes it super easy to layer colours and complete an artwork in one sitting.",
    photos: ["art-1.png", "art-2.png", "art-3.png"],
  },

];

const graphicsSlides = [
  "slides/4.png",
  "slides/5.png",
  "slides/6.png",
  "slides/7.png",
  "slides/8.png",
  "slides/9.png",
];

const panel = document.querySelector("#collection-panel");
const projectCardTemplate = document.querySelector("#project-card-template");
const tabs = [...document.querySelectorAll('[role="tab"]')];
const tabsContainer = document.querySelector(".category-tabs");
const placeholderLinks = [...document.querySelectorAll("[data-placeholder-link]")];
const hero = document.querySelector(".hero");
const heroDecor = document.querySelector(".hero-decor");
const decorLight = heroDecor?.querySelector(".decor-light");
const aboutDialog = document.querySelector("#about-dialog");
const aboutTrigger = heroDecor?.querySelector(".decor-frame-2");
const aboutClose = aboutDialog?.querySelector("[data-about-close]");
let aboutOpenedWithKeyboard = false;
const heroTextElements = [
  ...document.querySelectorAll(".name-word, .intro, .bio p"),
];
const bioLines = [...document.querySelectorAll(".bio p")];
const decorHoverImages = [
  ...document.querySelectorAll(".hero-decor img[data-hover-src]"),
];
const narrowDecorShifts = [
  [".decor-light", 0],
  [".decor-rug", 20],
  [".decor-cat", 25],
  [".decor-frame-1", 68],
  [".decor-frame-3", 58],
  [".decor-frame-2", 62],
  [".decor-shelf", 98],
  [".decor-book-1", 108],
  [".decor-book-2", 106],
  [".decor-book-3", 104],
  [".decor-shelf-plant", 107],
  [".decor-plant", 170],
].map(([selector, finalShift]) => ({
  element: heroDecor?.querySelector(selector),
  finalShift,
}));
const rotatingPhotos = faqItems.flatMap((item) => item.photos || []);
let photoRotationTimer = null;
let photoRotationIndex = 0;
let heroLayoutFrame = null;

bioLines.forEach((line, index) => {
  line.style.setProperty("--bio-line-delay", `${560 + index * 90}ms`);
});

decorHoverImages.forEach((image) => {
  const defaultSource = image.getAttribute("src");
  const hoverSource = image.dataset.hoverSrc;
  const isLight = image.classList.contains("decor-light");
  let isLocked = false;
  const preload = new Image();
  preload.src = hoverSource;

  const preserveImageBox = () => {
    if (image.style.width && image.style.height) return;
    const bounds = image.getBoundingClientRect();
    image.style.width = `${bounds.width}px`;
    image.style.height = `${bounds.height}px`;
    image.style.objectFit = "contain";
  };

  const showHoverImage = () => {
    preserveImageBox();
    image.src = hoverSource;
  };

  const showDefaultImage = () => {
    image.src = defaultSource;
    image.style.removeProperty("width");
    image.style.removeProperty("height");
    image.style.removeProperty("object-fit");
  };

  if (isLight) {
    image.addEventListener("click", () => {
      isLocked = !isLocked;
      if (isLocked) {
        showHoverImage();
      } else {
        showDefaultImage();
      }
    });
  }

  image.addEventListener("pointerenter", () => {
    showHoverImage();
    image.classList.add("is-hovered");
  });

  const endHover = () => {
    image.classList.remove("is-hovered");
    if (!isLocked) showDefaultImage();
  };

  image.addEventListener("pointerleave", endHover);
  image.addEventListener("pointercancel", endHover);
});

function openAboutDialog() {
  if (!aboutDialog || !aboutTrigger || aboutDialog.open) return;
  aboutTrigger.setAttribute("aria-expanded", "true");

  if (typeof aboutDialog.showModal === "function") {
    aboutDialog.showModal();
  } else {
    aboutDialog.setAttribute("open", "");
  }
}

function closeAboutDialog() {
  if (!aboutDialog || !aboutDialog.open) return;
  aboutDialog.close();
}

if (aboutDialog && aboutTrigger && aboutClose) {
  aboutTrigger.addEventListener("click", (event) => {
    aboutOpenedWithKeyboard = event.detail === 0;
    openAboutDialog();
  });
  aboutTrigger.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    aboutOpenedWithKeyboard = true;
    openAboutDialog();
  });

  aboutClose.addEventListener("click", closeAboutDialog);
  aboutDialog.addEventListener("click", (event) => {
    if (event.target === aboutDialog) closeAboutDialog();
  });
  aboutDialog.addEventListener("close", () => {
    aboutTrigger.setAttribute("aria-expanded", "false");
    if (aboutOpenedWithKeyboard) {
      aboutTrigger.focus();
    } else {
      aboutTrigger.blur();
    }
  });
}

function getTextContentRight(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const bounds = range.getBoundingClientRect();
  range.detach();
  return bounds.right;
}

function layoutHeroDecor() {
  if (!hero || !heroDecor || !heroTextElements.length) return;

  const heroBounds = hero.getBoundingClientRect();
  const textRight = Math.max(
    ...heroTextElements.map(getTextContentRight),
  ) - heroBounds.left;
  const narrowProgress = Math.min(
    1,
    Math.max(0, (1100 - hero.clientWidth) / 250),
  );
  const isNarrowLayout = hero.clientWidth < 1100;
  const isCompactLayout = hero.clientWidth < 850;
  const decorLeft = isCompactLayout
    ? hero.clientWidth * 0.64
    : textRight + 10;
  const availableWidth = Math.max(
    0,
    (hero.clientWidth - decorLeft - 50) / 1.06,
  );
  const responsiveWidth = isCompactLayout
    ? Math.min(484.5, Math.max(345, hero.clientWidth * 1.5))
    : isNarrowLayout
      ? 500
      : Math.max(0, hero.clientWidth - 550);
  const heightLimitedWidth = hero.clientHeight * 0.73;
  const decorWidth = Math.min(
    798,
    responsiveWidth,
    isNarrowLayout ? Infinity : heightLimitedWidth,
    isNarrowLayout ? Infinity : availableWidth,
  );

  heroDecor.style.left = `${decorLeft}px`;
  heroDecor.style.width = `${decorWidth}px`;
  if (decorLight) {
    const decorHeight = decorWidth * (850 / 646);
    const decorTop = (hero.clientHeight - decorHeight) / 2;
    decorLight.style.top = `${5 - decorTop}px`;
  }
  narrowDecorShifts.forEach(({ element, finalShift }) => {
    if (!element) return;
    const compactShift = element.classList.contains("decor-cat")
      ? 41
      : element.classList.contains("decor-rug")
        ? 17
        : finalShift;
    element.style.setProperty(
      "--narrow-decor-shift",
      `${narrowProgress * -(isCompactLayout ? compactShift * 1.5 : finalShift)}px`,
    );
  });
}

function requestHeroDecorLayout() {
  window.cancelAnimationFrame(heroLayoutFrame);
  heroLayoutFrame = window.requestAnimationFrame(layoutHeroDecor);
}

rotatingPhotos.forEach((source) => {
  const photo = new Image();
  photo.src = source;
});

placeholderLinks.forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )
  : null;

function observeReveal(element) {
  if (!element) return;

  if (revealObserver) {
    revealObserver.observe(element);
  } else {
    element.classList.add("is-visible");
  }
}

function observeProjectCards() {
  panel.querySelectorAll(".project-card").forEach(observeReveal);
  initializeCardVideos(panel);
}

function playCardVideo(video) {
  if (!video.isConnected || document.hidden) return;
  const playback = video.play();
  if (playback) playback.catch(() => {});
}

const cardVideoObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) playCardVideo(entry.target);
        });
      },
      { threshold: 0.01 },
    )
  : null;

function initializeCardVideos(container) {
  container.querySelectorAll(".card-video").forEach((video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;

    if (video.dataset.autoplayReady === "true") {
      playCardVideo(video);
      return;
    }

    video.dataset.autoplayReady = "true";
    video.addEventListener("canplay", () => playCardVideo(video), {
      once: true,
    });
    cardVideoObserver?.observe(video);

    if (video.readyState >= 2) {
      playCardVideo(video);
    } else {
      video.load();
    }

    window.requestAnimationFrame(() => playCardVideo(video));
    window.setTimeout(() => playCardVideo(video), 300);
  });
}

function pauseCardVideos() {
  panel.querySelectorAll(".card-video").forEach((video) => video.pause());
}

function renderProjectCards(items) {
  const cards = document.createDocumentFragment();

  items.forEach((item, index) => {
    const cardFragment = projectCardTemplate.content.cloneNode(true);
    const card = cardFragment.querySelector(".project-card");
    const media = cardFragment.querySelector("[data-card-media]");
    const video = cardFragment.querySelector(".card-video");
    const arrow = cardFragment.querySelector(".project-arrow");
    const pills = cardFragment.querySelector("[data-card-pills]");

    card.style.setProperty("--card-index", index);
    if (item.url) {
      card.href = item.url;
      card.setAttribute("aria-label", `Open ${item.title} in a new tab`);
    } else {
      card.removeAttribute("target");
      card.removeAttribute("rel");
      arrow.remove();
    }
    cardFragment.querySelector("[data-card-title]").textContent = item.title;
    cardFragment.querySelector("[data-card-description]").textContent =
      item.description;

    if (item.tags?.length) {
      item.tags.forEach((tag) => {
        const pill = document.createElement("span");
        pill.className = "card-pill";
        pill.textContent = tag;
        pills.append(pill);
      });
    } else {
      pills.remove();
    }

    if (item.video) {
      media.classList.add("card-art-video");
      media.setAttribute("aria-hidden", "false");
      video.src = item.video;
      video.setAttribute("aria-label", `${item.title} preview`);

      if (item.poster) video.poster = item.poster;
    } else if (item.poster) {
      const image = document.createElement("img");
      image.className = "card-image";
      image.src = item.poster;
      image.alt = "";
      video.replaceWith(image);
    } else {
      video.remove();
    }

    cards.append(cardFragment);
  });

  panel.replaceChildren(cards);
}

function escapeHTML(value) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character],
  );
}

function faqAnswerHTML(item) {
  const answer = escapeHTML(item.answer);

  if (!item.answerLink) return answer;

  return `${answer} <a class="faq-answer-link" href="${escapeHTML(item.answerLink.href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.answerLink.label)}</a>!`;
}

function faqTemplate() {
  const questions = faqItems
    .map(
      (item, index) => `
        <div class="faq-item" data-faq-index="${index}">
          <button
            class="faq-question"
            type="button"
            aria-expanded="false"
            aria-controls="faq-answer-${index}"
          >
            <span>${escapeHTML(item.question)}</span>
            <span class="faq-toggle" aria-hidden="true"></span>
          </button>
          <div class="faq-answer" id="faq-answer-${index}" aria-hidden="true">
            <div class="faq-answer-inner">
              <p>${faqAnswerHTML(item)}</p>
            </div>
          </div>
        </div>
      `,
    )
    .join("");

  return `
    <div class="ifaq-layout">
      <div class="faq-list">${questions}</div>
      <div class="ifaq-image" aria-hidden="true" hidden>
        <img alt="">
      </div>
    </div>
  `;
}

function graphicsTemplate() {
  const slides = graphicsSlides
    .map(
      (source, index) => `
        <figure class="graphics-slide">
          <img
            src="${escapeHTML(source)}"
            alt="Creative portfolio slide ${index + 1}"
            ${index === 0 ? 'loading="eager"' : 'loading="lazy"'}
            decoding="async"
          >
        </figure>
      `,
    )
    .join("");

  return `
    <div
      class="graphics-scroll"
      tabindex="0"
      role="region"
      aria-label="Creative portfolio slides. Scroll horizontally to see more."
    >
      ${slides}
    </div>
  `;
}

function bindGraphicsScroll() {
  const scroller = panel.querySelector(".graphics-scroll");
  if (!scroller) return;

  scroller.querySelectorAll(".graphics-slide img").forEach((image) => {
    image.addEventListener(
      "wheel",
      (event) => {
        if (event.deltaY === 0) return;

        const multiplier = event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? scroller.clientWidth
            : 1;

        event.preventDefault();
        scroller.scrollLeft += event.deltaX + event.deltaY * multiplier;
      },
      { passive: false },
    );
  });
}

function stopPhotoRotation() {
  window.clearInterval(photoRotationTimer);
  photoRotationTimer = null;

  const image = panel.querySelector(".ifaq-image img");
  if (!image) return;

  image.classList.remove("is-rotating-photo");
  image.removeAttribute("src");
}

function hideFAQImage() {
  stopPhotoRotation();

  const imageCard = panel.querySelector(".ifaq-image");
  if (imageCard) imageCard.hidden = true;
}

function startPhotoRotation(sources) {
  stopPhotoRotation();

  const image = panel.querySelector(".ifaq-image img");
  if (!image || !sources?.length) return;

  image.closest(".ifaq-image").hidden = false;

  photoRotationIndex = 0;
  image.classList.add("is-rotating-photo");
  image.src = sources[photoRotationIndex];

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  photoRotationTimer = window.setInterval(() => {
    photoRotationIndex = (photoRotationIndex + 1) % sources.length;
    if (!image.isConnected) return;
    image.src = sources[photoRotationIndex];
  }, 600);
}

function bindFAQAccordions() {
  panel.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const willOpen = !item.classList.contains("is-open");

      if (willOpen) {
        panel.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
          if (openItem === item) return;

          openItem.classList.remove("is-open");
          openItem
            .querySelector(".faq-question")
            .setAttribute("aria-expanded", "false");
          openItem
            .querySelector(".faq-answer")
            .setAttribute("aria-hidden", "true");
        });
      }

      item.classList.toggle("is-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
      answer.setAttribute("aria-hidden", String(!willOpen));

      const photoSet = faqItems[Number(item.dataset.faqIndex)].photos;
      if (willOpen && photoSet) {
        startPhotoRotation(photoSet);
      } else if (willOpen) {
        hideFAQImage();
      } else {
        hideFAQImage();
      }
    });
  });
}

function showCollection(category, activeTab) {
  stopPhotoRotation();
  pauseCardVideos();
  panel.classList.add("is-changing");

  window.setTimeout(() => {
    const isFAQ = category === "ifaq";
    const isGraphics = category === "graphics";
    panel.classList.toggle("is-ifaq", isFAQ);
    panel.classList.toggle("is-graphics", isGraphics);

    if (isFAQ) {
      panel.innerHTML = faqTemplate();
    } else if (isGraphics) {
      panel.innerHTML = graphicsTemplate();
    } else {
      renderProjectCards(collections[category]);
    }

    panel.setAttribute("aria-labelledby", activeTab.id);
    panel.classList.remove("is-changing");

    if (isFAQ) {
      bindFAQAccordions();
      observeReveal(panel.querySelector(".ifaq-layout"));
    } else if (isGraphics) {
      bindGraphicsScroll();
      observeReveal(panel.querySelector(".graphics-scroll"));
    } else {
      observeProjectCards();
    }
  }, 130);
}

function activateTab(tab, moveFocus = false) {
  tabs.forEach((candidate) => {
    const isActive = candidate === tab;
    candidate.setAttribute("aria-selected", String(isActive));
    candidate.tabIndex = isActive ? 0 : -1;
  });

  showCollection(tab.dataset.category, tab);
  if (moveFocus) tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));

  tab.addEventListener("keydown", (event) => {
    let targetIndex;

    if (event.key === "ArrowRight") targetIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") {
      targetIndex = (index - 1 + tabs.length) % tabs.length;
    }
    if (event.key === "Home") targetIndex = 0;
    if (event.key === "End") targetIndex = tabs.length - 1;

    if (targetIndex !== undefined) {
      event.preventDefault();
      activateTab(tabs[targetIndex], true);
    }
  });
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) initializeCardVideos(panel);
});

window.addEventListener("resize", requestHeroDecorLayout, { passive: true });
window.addEventListener("load", requestHeroDecorLayout, { once: true });

if ("ResizeObserver" in window && hero) {
  const heroResizeObserver = new ResizeObserver(requestHeroDecorLayout);
  heroResizeObserver.observe(hero);
}

if (document.fonts?.ready) {
  document.fonts.ready.then(requestHeroDecorLayout);
}

layoutHeroDecor();
renderProjectCards(collections.projects);
observeReveal(tabsContainer);
observeProjectCards();
if (!sitePreloader) document.documentElement.classList.add("is-ready");
