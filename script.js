const sitePreloader = document.querySelector("#site-preloader");
const preloaderStartedAt = performance.now();
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let preloaderFinished = false;

const themeToggle = document.querySelector(".theme-toggle");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme, persist = false) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeColorMeta?.setAttribute("content", isDark ? "#29374c" : "#fffefd");

  if (!persist) return;
  try {
    localStorage.setItem("harmony-theme", isDark ? "dark" : "light");
  } catch {
    // The selected theme still applies when storage is unavailable.
  }
}

applyTheme(document.documentElement.dataset.theme || "light");

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme, true);
});

function finishPreloader() {
  if (preloaderFinished) return;
  preloaderFinished = true;
  const minimumDuration = prefersReducedMotion ? 0 : 650;
  const remainingDuration = Math.max(0, minimumDuration - (performance.now() - preloaderStartedAt));

  window.setTimeout(() => {
    document.body.classList.remove("is-loading");
    startAllCardVideos();
    if (!sitePreloader) return;
    sitePreloader.classList.add("is-leaving");
    window.setTimeout(() => sitePreloader.remove(), 450);
  }, remainingDuration);
}

if (document.readyState === "complete") finishPreloader();
else window.addEventListener("load", finishPreloader, { once: true });
window.setTimeout(finishPreloader, 1800);

const collections = {
  projects: [
    {
      title: "Research Reach",
      description: "Chrome extension research scraper sending automated, personalized cold emails.",
      poster: "research-reach-poster.png",
      githubUrl: "https://github.com/harmonyychen/research-reach",
      tags: ["Full-stack development"],
    },
    {
      title: "Morra Ai",
      description: "AI-powered practice app for the IB French Individual Oral.",
      poster: "morra-ai-poster.png",
      githubUrl: "https://github.com/The4Caster13/MorraAI",
      tags: ["Product design", "Full-stack development"],
    },
  ],
  community: [
    {
      title: "HOSA Canada",
      description: "Managing programs and workshops for 11,000 students across Canada.",
      poster: "hosa-poster.png",
      url: "https://www.hosacanada.org",
      tags: ["Project management", "Education"],
    },
    {
      title: "Ignite Fair",
      description: "Leading 18 executives to create in-person events for 800+ students in the GTA.",
      poster: "ignite-fair.JPG",
      url: "https://www.ignitefair.org",
      tags: ["Leadership", "Event management"],
    },
  ],
  "case-study": [
    {
      title: "YPB Case Study",
      description: "Market research and product decisions for Abercrombie's athleisure sub-brand, YPB. Ivey Horizon Case Competition Winner.",
      video: "case-competition-compatible.mp4",
      poster: "case-competition-poster.png",
      tags: ["Product strategy", "Market research"],
    },
  ],
};

const faqItems = [
  {
    question: "what’s your go-to digicam?",
    answer: "My Nikon Coolpix. I love the ethereal quality of the flash. I bring it everywhere—a haven of my favourite people and places.",
    photos: ["camera-1.png", "camera-2.png", "camera-3.png"],
  },
  {
    question: "something you’re proud of building?",
    answer: "Aporia Literary Journal, a poetry and visual arts journal and community featuring talented young people across Canada. Explore it at",
    answerLink: { href: "https://www.aporialiterary.ca", label: "aporialiterary.ca" },
    photos: ["aporia-1.png", "aporia-2.png", "aporia-3.png"],
  },
  {
    question: "best purchase?",
    answer: "My Owala. It’s truly one of my little joys in life and reminds me to stay hydrated.",
    photos: ["owala-1.png", "owala-2.png", "owala-3.png"],
  },
  {
    question: "something more people should do?",
    answer: "Lift weights with a focus on mobility and athleticism. It’s an invaluable investment in long-term quality of life.",
    photos: ["exercise-1.png", "exercise-2.png", "exercise-3.png"],
  },
  {
    question: "favourite art medium?",
    answer: "Acrylic. I love how fast-drying it is—it makes layering colours and finishing a work in one sitting easy.",
    photos: ["art-1.png", "art-2.png", "art-3.png"],
  },
];

const graphicsSlides = ["slides/4.png", "slides/5.png", "slides/6.png", "slides/7.png", "slides/8.png", "slides/9.png"];
const panel = document.querySelector("#collection-panel");
const projectCardTemplate = document.querySelector("#project-card-template");
const tabs = [...document.querySelectorAll('[role="tab"]')];
let photoRotationTimer = null;
let cardVideoObserver = null;
const cardVideoRetryTimers = new WeakMap();
const cardVideoRetryDelays = [0, 200, 800, 2000];

const singingIllustration = document.querySelector("[data-singing-animation]");
const singingAnimationTrigger = document.querySelector(".hero-singer-wrap");
const singingNote = document.querySelector(".singer-note");
const singingAnimationFramesByTheme = {
  light: [
    "hero-singing-frame-1.png",
    "hero-singing-frame-2.png",
    "hero-singing-frame-3.png",
    "hero-singing-frame-4.png",
  ],
  dark: [
    "hero-singing-frame-1-dark.png",
    "hero-singing-frame-2-dark.png",
    "hero-singing-frame-3-dark.png",
    "hero-singing-frame-4-dark.png",
  ],
};
let singingAnimationFrames = singingAnimationFramesByTheme.light;
const singingFrameSequence = [ 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3];
let singingSequenceIndex = 0;
let singingAnimationTimer = null;
let singingFramesReady = false;
let singingNoteFrame = null;
let singingNotePoint = { x: 0, y: 0 };
let singingHitMapWidth = 0;
let singingHitMapHeight = 0;
let singingHitMapMinimumX = null;
let singingHitMapMaximumX = null;
let singingHitMapRequest = 0;

const hoverCardTriggers = [...document.querySelectorAll("[data-hover-card]")];
const textHoverCard = document.createElement("div");
const textHoverCardImage = document.createElement("img");
const textHoverCardTitle = document.createElement("span");
const textHoverCardCopy = document.createElement("span");
let activeHoverCardTrigger = null;
let hoverCardFrame = null;
let hoverCardPoint = { x: 0, y: 0 };

textHoverCard.className = "text-hover-card";
textHoverCard.id = "text-hover-card";
textHoverCard.setAttribute("role", "tooltip");
textHoverCard.setAttribute("aria-hidden", "true");
textHoverCardImage.className = "text-hover-card-image";
textHoverCardImage.alt = "";
textHoverCardTitle.className = "text-hover-card-title";
textHoverCardCopy.className = "text-hover-card-copy";
textHoverCard.append(textHoverCardImage, textHoverCardTitle, textHoverCardCopy);
document.body.append(textHoverCard);

function setHoverCardPosition(x, y) {
  hoverCardPoint = { x, y };
  if (hoverCardFrame) return;

  hoverCardFrame = window.requestAnimationFrame(() => {
    hoverCardFrame = null;
    const offset = activeHoverCardTrigger?.dataset.hoverCardShape === "circle" ? 0 : 18;
    const gutter = 12;
    const bounds = textHoverCard.getBoundingClientRect();
    let nextX = hoverCardPoint.x + offset;
    let nextY = hoverCardPoint.y + offset;

    if (nextX + bounds.width > window.innerWidth - gutter) {
      nextX = hoverCardPoint.x - bounds.width - offset;
    }
    if (nextY + bounds.height > window.innerHeight - gutter) {
      nextY = hoverCardPoint.y - bounds.height - offset;
    }

    nextX = Math.max(gutter, Math.min(nextX, window.innerWidth - bounds.width - gutter));
    nextY = Math.max(gutter, Math.min(nextY, window.innerHeight - bounds.height - gutter));
    textHoverCard.style.setProperty("--hover-card-x", `${nextX}px`);
    textHoverCard.style.setProperty("--hover-card-y", `${nextY}px`);
  });
}

function showTextHoverCard(trigger, x, y) {
  activeHoverCardTrigger = trigger;
  const imageSource = trigger.dataset.hoverCardImage;
  const isLinkCard = trigger.matches("a[href]");
  const isPortraitCard = trigger.dataset.hoverCardShape === "circle";
  textHoverCard.classList.toggle("is-link-card", isLinkCard);
  textHoverCard.classList.toggle("is-portrait-card", isPortraitCard);
  textHoverCard.classList.toggle("has-image", Boolean(imageSource));
  if (imageSource) {
    textHoverCardImage.src = imageSource;
    textHoverCardImage.alt = trigger.dataset.hoverCardImageAlt || "";
  } else {
    textHoverCardImage.removeAttribute("src");
    textHoverCardImage.alt = "";
  }
  textHoverCardTitle.textContent = trigger.dataset.hoverCardTitle || "";
  textHoverCardCopy.textContent = trigger.dataset.hoverCard;

  const background = trigger.dataset.hoverCardBg;
  const color = trigger.dataset.hoverCardColor;
  const requestedWidth = Number.parseFloat(trigger.dataset.hoverCardWidth);
  textHoverCard.style.setProperty("--hover-card-bg", background && CSS.supports("color", background) ? background : "#e0ddd7");
  textHoverCard.style.setProperty("--hover-card-color", color && CSS.supports("color", color) ? color : "#3f4b63");
  textHoverCard.style.setProperty("--hover-card-width", `${Number.isFinite(requestedWidth) ? Math.min(360, Math.max(150, requestedWidth)) : 220}px`);
  textHoverCard.classList.add("is-visible");
  textHoverCard.setAttribute("aria-hidden", "false");
  trigger.setAttribute("aria-describedby", textHoverCard.id);
  setHoverCardPosition(x, y);
}

function hideTextHoverCard(trigger) {
  if (activeHoverCardTrigger !== trigger) return;
  activeHoverCardTrigger = null;
  textHoverCard.classList.remove("is-visible");
  textHoverCard.setAttribute("aria-hidden", "true");
  trigger.removeAttribute("aria-describedby");
}

hoverCardTriggers.forEach((trigger) => {
  trigger.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "touch") return;
    showTextHoverCard(trigger, event.clientX, event.clientY);
  });
  trigger.addEventListener("pointermove", (event) => {
    if (activeHoverCardTrigger === trigger) setHoverCardPosition(event.clientX, event.clientY);
  });
  trigger.addEventListener("pointerleave", () => hideTextHoverCard(trigger));
  trigger.addEventListener("focus", () => {
    const bounds = trigger.getBoundingClientRect();
    showTextHoverCard(trigger, bounds.right, bounds.bottom);
  });
  trigger.addEventListener("blur", () => hideTextHoverCard(trigger));
});

function advanceSingingAnimation() {
  if (!singingIllustration) return;
  singingSequenceIndex = (singingSequenceIndex + 1) % singingFrameSequence.length;
  singingIllustration.src = singingAnimationFrames[singingFrameSequence[singingSequenceIndex]];
}

function startSingingAnimation() {
  if (
    !singingIllustration
    || !singingFramesReady
    || singingAnimationTimer
    || prefersReducedMotion
    || document.hidden
  ) return;

  singingAnimationTimer = window.setInterval(advanceSingingAnimation, 1000 / 9);
}

function setSingingNotePosition(x, y) {
  if (!singingNote) return;
  singingNotePoint = { x, y };
  if (singingNoteFrame) return;

  singingNoteFrame = window.requestAnimationFrame(() => {
    singingNoteFrame = null;
    const gutter = 12;
    const offset = 10;
    const width = singingNote.offsetWidth;
    const height = singingNote.offsetHeight;
    let nextX = singingNotePoint.x + offset;
    let nextY = singingNotePoint.y - height + offset;

    if (nextX + width > window.innerWidth - gutter) {
      nextX = singingNotePoint.x - width - offset;
    }
    if (nextY < gutter) nextY = singingNotePoint.y + offset * 2;

    nextX = Math.max(gutter, Math.min(nextX, window.innerWidth - width - gutter));
    nextY = Math.max(gutter, Math.min(nextY, window.innerHeight - height - gutter));
    singingNote.style.setProperty("--singer-note-x", `${nextX}px`);
    singingNote.style.setProperty("--singer-note-y", `${nextY}px`);
  });
}

function prepareSingingHitMap() {
  const source = singingAnimationFrames[0];
  const image = new Image();
  const request = ++singingHitMapRequest;

  singingHitMapMinimumX = null;
  singingHitMapMaximumX = null;

  image.addEventListener("load", () => {
    if (request !== singingHitMapRequest) return;
    const scale = Math.min(1, 600 / image.naturalHeight);
    singingHitMapWidth = Math.max(1, Math.round(image.naturalWidth * scale));
    singingHitMapHeight = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = singingHitMapWidth;
    canvas.height = singingHitMapHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, singingHitMapWidth, singingHitMapHeight);
    const pixels = context.getImageData(0, 0, singingHitMapWidth, singingHitMapHeight).data;
    singingHitMapMinimumX = new Int32Array(singingHitMapHeight);
    singingHitMapMaximumX = new Int32Array(singingHitMapHeight);
    singingHitMapMinimumX.fill(singingHitMapWidth);
    singingHitMapMaximumX.fill(-1);

    for (let y = 0; y < singingHitMapHeight; y += 1) {
      for (let x = 0; x < singingHitMapWidth; x += 1) {
        if (pixels[((y * singingHitMapWidth) + x) * 4 + 3] < 24) continue;
        singingHitMapMinimumX[y] = Math.min(singingHitMapMinimumX[y], x);
        singingHitMapMaximumX[y] = Math.max(singingHitMapMaximumX[y], x);
      }
    }
  }, { once: true });

  image.src = source;
}

function isPointerOverSingingArtwork(clientX, clientY) {
  if (!singingIllustration || !singingHitMapMinimumX || !singingHitMapMaximumX) return false;
  const bounds = singingIllustration.getBoundingClientRect();
  if (
    clientX < bounds.left
    || clientX > bounds.right
    || clientY < bounds.top
    || clientY > bounds.bottom
  ) return false;

  const x = Math.floor(((clientX - bounds.left) / bounds.width) * singingHitMapWidth);
  const y = Math.min(
    singingHitMapHeight - 1,
    Math.max(0, Math.floor(((clientY - bounds.top) / bounds.height) * singingHitMapHeight)),
  );
  const padding = 3;
  return x >= singingHitMapMinimumX[y] - padding && x <= singingHitMapMaximumX[y] + padding;
}

function updateSingingArtworkHover(event) {
  if (!singingAnimationTrigger || event.pointerType === "touch") return;
  const isOverArtwork = isPointerOverSingingArtwork(event.clientX, event.clientY);
  singingAnimationTrigger.classList.toggle("is-image-hovered", isOverArtwork);
  if (!isOverArtwork) return;
  setSingingNotePosition(event.clientX, event.clientY);
}

function stopSingingAnimation() {
  window.clearInterval(singingAnimationTimer);
  singingAnimationTimer = null;
}

function preloadSingingAnimation() {
  if (!singingIllustration) return;

  const allFrames = Object.values(singingAnimationFramesByTheme).flat();
  Promise.all(allFrames.map((source) => new Promise((resolve) => {
    const frame = new Image();
    frame.addEventListener("load", resolve, { once: true });
    frame.addEventListener("error", resolve, { once: true });
    frame.src = source;
  }))).then(() => {
    singingFramesReady = true;
    startSingingAnimation();
  });
}

function syncSingingAnimationTheme() {
  if (!singingIllustration) return;
  const theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const nextFrames = singingAnimationFramesByTheme[theme];

  singingAnimationFrames = nextFrames;
  singingIllustration.src = singingAnimationFrames[singingFrameSequence[singingSequenceIndex]];
  prepareSingingHitMap();
}

const singingThemeObserver = new MutationObserver(syncSingingAnimationTheme);
singingThemeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"],
});

if (singingAnimationTrigger) {
  singingAnimationTrigger.addEventListener("pointerenter", updateSingingArtworkHover);
  singingAnimationTrigger.addEventListener("pointermove", updateSingingArtworkHover);
  singingAnimationTrigger.addEventListener("pointerleave", () => {
    singingAnimationTrigger.classList.remove("is-image-hovered");
  });
  singingAnimationTrigger.addEventListener("focusin", () => {
    const bounds = singingAnimationTrigger.getBoundingClientRect();
    setSingingNotePosition(bounds.right, bounds.top + bounds.height / 2);
  });
}

function clearCardVideoRetry(video) {
  const timer = cardVideoRetryTimers.get(video);
  if (timer !== undefined) window.clearTimeout(timer);
  cardVideoRetryTimers.delete(video);
}

function markCardVideoPlaying(video) {
  clearCardVideoRetry(video);
  video.dataset.autoplayRetry = "0";
  video.removeAttribute("data-autoplay-pending");
  video.closest(".card-art")?.classList.add("video-is-playing");
}

function queueCardVideoPlayback(video, resetRetry = false) {
  if (!video.isConnected || video.dataset.autoplayDisabled === "true") return;
  if (video.dataset.inViewport !== "true" || document.hidden) return;
  if (video.dataset.videoLoaded !== "true") return;
  if (!video.paused && !video.ended) {
    markCardVideoPlaying(video);
    return;
  }

  if (resetRetry) video.dataset.autoplayRetry = "0";
  const retryIndex = Number(video.dataset.autoplayRetry || 0);
  if (retryIndex >= cardVideoRetryDelays.length) return;

  clearCardVideoRetry(video);
  video.dataset.autoplayRetry = String(retryIndex + 1);
  const timer = window.setTimeout(() => {
    cardVideoRetryTimers.delete(video);
    playCardVideo(video);
  }, cardVideoRetryDelays[retryIndex]);
  cardVideoRetryTimers.set(video, timer);
}

function playCardVideo(video) {
  if (!video.isConnected || video.dataset.autoplayDisabled === "true") return;
  if (video.dataset.inViewport !== "true" || document.hidden) return;

  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.controls = false;

  if (!video.paused && !video.ended) {
    markCardVideoPlaying(video);
    return;
  }

  video.dataset.autoplayPending = "true";
  let playback;

  try {
    playback = video.play();
  } catch {
    queueCardVideoPlayback(video);
    return;
  }

  // Older Safari versions return undefined instead of a promise.
  if (!playback) {
    queueCardVideoPlayback(video);
    return;
  }

  playback.then(() => {
    markCardVideoPlaying(video);
  }).catch(() => {
    video.dataset.autoplayPending = "true";
    queueCardVideoPlayback(video);
  });
}

function loadCardVideo(video) {
  if (video.dataset.videoLoaded === "true" || !video.dataset.src) return;
  video.dataset.videoLoaded = "true";
  video.preload = "auto";
  video.setAttribute("preload", "auto");
  video.src = video.dataset.src;
  video.load();
}

function activateCardVideo(video) {
  loadCardVideo(video);
  queueCardVideoPlayback(video, true);
}

function observeCardVideo(video) {
  if (video.dataset.autoplayObserved === "true") return;
  video.dataset.autoplayObserved = "true";

  if (!("IntersectionObserver" in window)) {
    video.dataset.inViewport = "true";
    activateCardVideo(video);
    return;
  }
  if (!cardVideoObserver) {
    cardVideoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const observedVideo = entry.target;
        const isFullyVisible = entry.isIntersecting && entry.intersectionRatio >= 1;
        observedVideo.dataset.inViewport = String(isFullyVisible);

        if (isFullyVisible) {
          activateCardVideo(observedVideo);
          return;
        }

        clearCardVideoRetry(observedVideo);
        if (!observedVideo.paused) observedVideo.pause();
      });
    }, { rootMargin: "0px", threshold: 1 });
  }

  cardVideoObserver.observe(video);
}

function prepareCardVideo(video) {
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.controls = false;
  video.preload = video.dataset.videoLoaded === "true" ? "auto" : "none";
  video.disablePictureInPicture = true;
  video.disableRemotePlayback = true;
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("loop", "");
  video.setAttribute("preload", video.dataset.videoLoaded === "true" ? "auto" : "none");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("disablepictureinpicture", "");
  video.setAttribute("disableremoteplayback", "");
  video.setAttribute("x-webkit-airplay", "deny");
  video.setAttribute("tabindex", "-1");
  video.setAttribute("aria-hidden", "true");
  video.removeAttribute("controls");

  if (video.dataset.autoplayPrepared === "true") return;
  video.dataset.autoplayPrepared = "true";
  video.addEventListener("loadedmetadata", () => queueCardVideoPlayback(video, true));
  video.addEventListener("loadeddata", () => queueCardVideoPlayback(video, true));
  video.addEventListener("canplay", () => queueCardVideoPlayback(video, true));
  video.addEventListener("playing", () => markCardVideoPlaying(video));
  video.addEventListener("pause", () => {
    if (!document.hidden && video.dataset.inViewport === "true") {
      queueCardVideoPlayback(video, true);
    }
  });
}

function startAllCardVideos() {
  panel.querySelectorAll(".card-video").forEach((video) => {
    prepareCardVideo(video);
    observeCardVideo(video);
    if (video.dataset.inViewport === "true") activateCardVideo(video);
  });
}

function renderProjectCards(items) {
  const cards = document.createDocumentFragment();

  items.forEach((item) => {
    const fragment = projectCardTemplate.content.cloneNode(true);
    let card = fragment.querySelector(".project-card");
    const media = fragment.querySelector("[data-card-media]");
    const video = fragment.querySelector(".card-video");
    const poster = fragment.querySelector("[data-card-poster]");
    const arrow = fragment.querySelector(".project-arrow");
    const githubLink = fragment.querySelector("[data-card-github]");
    const pills = fragment.querySelector("[data-card-pills]");

    fragment.querySelector("[data-card-title]").textContent = item.title;
    fragment.querySelector("[data-card-description]").textContent = item.description;

    if (item.url) {
      const cardLink = document.createElement("a");
      cardLink.className = card.className;
      cardLink.href = item.url;
      cardLink.target = "_blank";
      cardLink.rel = "noopener noreferrer";
      cardLink.setAttribute("aria-label", `Open ${item.title} in a new tab`);
      cardLink.append(...card.childNodes);
      card.replaceWith(cardLink);
      card = cardLink;
    } else {
      arrow.remove();
    }

    if (item.githubUrl && !item.url) {
      githubLink.href = item.githubUrl;
      githubLink.setAttribute("aria-label", `View ${item.title} on GitHub`);
    } else githubLink.remove();

    if (item.tags?.length) {
      item.tags.forEach((tag) => {
        const pill = document.createElement("span");
        pill.className = "card-pill";
        pill.textContent = tag;
        pills.append(pill);
      });
    } else pills.remove();

    if (item.video) {
      prepareCardVideo(video);
      video.dataset.src = item.video;
      if (item.poster) {
        poster.src = item.poster;
        video.poster = item.poster;
      } else poster.remove();
    } else if (item.poster) {
      poster.classList.remove("card-video-poster");
      poster.src = item.poster;
      video.remove();
    } else {
      video.remove();
      poster.remove();
      media.setAttribute("aria-hidden", "true");
    }

    cards.append(fragment);
  });

  panel.replaceChildren(cards);
  startAllCardVideos();
}

function escapeHTML(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

function faqAnswerHTML(item) {
  const answer = escapeHTML(item.answer);
  if (!item.answerLink) return answer;
  return `${answer} <a class="faq-answer-link" href="${escapeHTML(item.answerLink.href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.answerLink.label)}</a>.`;
}

function faqTemplate() {
  const questions = faqItems.map((item, index) => `
    <div class="faq-item" data-faq-index="${index}">
      <button class="faq-question" type="button" aria-expanded="false" aria-controls="faq-answer-${index}">
        <span>${escapeHTML(item.question)}</span><span class="faq-toggle" aria-hidden="true"></span>
      </button>
      <div class="faq-answer" id="faq-answer-${index}" aria-hidden="true">
        <div class="faq-answer-inner"><p>${faqAnswerHTML(item)}</p></div>
      </div>
    </div>
  `).join("");

  return `<div class="ifaq-layout"><div class="faq-list">${questions}</div><div class="ifaq-image" aria-hidden="true" hidden><img alt=""></div></div>`;
}

function graphicsTemplate() {
  return `<div class="graphics-scroll" tabindex="0" role="region" aria-label="Creative portfolio slides. Scroll horizontally to see more.">${graphicsSlides.map((source, index) => `
    <figure class="graphics-slide"><img src="${escapeHTML(source)}" alt="Creative portfolio slide ${index + 1}" ${index === 0 ? 'loading="eager"' : 'loading="lazy"'}></figure>
  `).join("")}</div>`;
}

function bindGraphicsScroll() {
  const scroller = panel.querySelector(".graphics-scroll");
  if (!scroller) return;

  scroller.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    const multiplier = event.deltaMode === 1
      ? 16
      : event.deltaMode === 2
        ? scroller.clientWidth
        : 1;
    const distance = event.deltaY * multiplier;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const atStart = scroller.scrollLeft <= 0 && distance < 0;
    const atEnd = scroller.scrollLeft >= maxScroll - 1 && distance > 0;

    if (maxScroll <= 0 || atStart || atEnd) return;

    event.preventDefault();
    scroller.scrollLeft += distance;
  }, { passive: false });
}

function stopPhotoRotation() {
  window.clearInterval(photoRotationTimer);
  photoRotationTimer = null;
}

function showFAQPhotos(sources) {
  stopPhotoRotation();
  const image = panel.querySelector(".ifaq-image img");
  if (!image || !sources?.length) return;
  image.closest(".ifaq-image").hidden = false;
  let index = 0;
  image.src = sources[index];
  if (prefersReducedMotion) return;
  photoRotationTimer = window.setInterval(() => {
    index = (index + 1) % sources.length;
    if (image.isConnected) image.src = sources[index];
  }, 900);
}

function bindFAQAccordions() {
  panel.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const willOpen = !item.classList.contains("is-open");

      panel.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
        openItem.classList.remove("is-open");
        openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        openItem.querySelector(".faq-answer").setAttribute("aria-hidden", "true");
      });

      item.classList.toggle("is-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
      answer.setAttribute("aria-hidden", String(!willOpen));

      const imageCard = panel.querySelector(".ifaq-image");
      if (willOpen) showFAQPhotos(faqItems[Number(item.dataset.faqIndex)].photos);
      else if (imageCard) imageCard.hidden = true;
    });
  });
}

function showCollection(category, activeTab) {
  stopPhotoRotation();
  cardVideoObserver?.disconnect();
  cardVideoObserver = null;
  panel.querySelectorAll("video").forEach((video) => {
    video.dataset.autoplayDisabled = "true";
    clearCardVideoRetry(video);
    video.pause();
  });
  panel.classList.add("is-changing");

  window.setTimeout(() => {
    const isFAQ = category === "ifaq";
    const isGraphics = category === "graphics";
    panel.classList.toggle("is-ifaq", isFAQ);
    panel.classList.toggle("is-graphics", isGraphics);

    if (isFAQ) {
      panel.innerHTML = faqTemplate();
      bindFAQAccordions();
    } else if (isGraphics) {
      panel.innerHTML = graphicsTemplate();
      bindGraphicsScroll();
    }
    else renderProjectCards(collections[category]);

    panel.setAttribute("aria-labelledby", activeTab.id);
    panel.classList.remove("is-changing");
  }, prefersReducedMotion ? 0 : 130);
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
    if (event.key === "ArrowLeft") targetIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") targetIndex = 0;
    if (event.key === "End") targetIndex = tabs.length - 1;
    if (targetIndex === undefined) return;
    event.preventDefault();
    activateTab(tabs[targetIndex], true);
  });
});

window.addEventListener("load", startAllCardVideos, { once: true });
window.addEventListener("pageshow", () => {
  startAllCardVideos();
  startSingingAnimation();
});
window.addEventListener("focus", startAllCardVideos);
document.addEventListener("pointerdown", startAllCardVideos, { capture: true, passive: true });
document.addEventListener("touchstart", startAllCardVideos, { capture: true, passive: true });
document.addEventListener("keydown", startAllCardVideos, { capture: true });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopSingingAnimation();
    return;
  }

  startAllCardVideos();
  startSingingAnimation();
});

syncSingingAnimationTheme();
preloadSingingAnimation();
renderProjectCards(collections.projects);
