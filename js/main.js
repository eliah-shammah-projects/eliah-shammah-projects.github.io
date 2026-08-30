/* Eliahu Netanel Shammah — portfolio
   Small, dependency-free enhancements. The page works without any of this. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------- footer year */

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------------------------------------------------- mobile menu */

  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      menu.classList.toggle("is-open", !open);
    });

    menu.addEventListener("click", function (e) {
      if (e.target.tagName !== "A") return;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      menu.classList.remove("is-open");
    });
  }

  /* ---------------------------------------------------- nav border on scroll */

  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------- active nav link */

  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__menu a"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------- reveal on scroll */

  var revealables = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add("is-in"); });
  } else {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        // light stagger so grouped items don't pop in all at once
        entry.target.style.transitionDelay = Math.min(i, 4) * 70 + "ms";
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(revealables, function (el) { revealer.observe(el); });
  }

  /* ---------------------------------------------------- project media */

  // The monospace placeholder behind each frame is a fallback for a missing
  // file, nothing more — the media itself is visible from the start.
  Array.prototype.forEach.call(document.querySelectorAll(".media"), function (frame) {
    var el = frame.querySelector("video, img");
    if (!el) return;

    var failed = function () { frame.classList.add("is-missing"); };

    el.addEventListener("error", failed, true);

    if (el.tagName === "IMG") {
      if (el.complete && !el.naturalWidth) failed();
      return;
    }

    // Only play while visible — no reason to burn cycles offscreen.
    if ("IntersectionObserver" in window) {
      var player = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var p = el.play();
            if (p && p.catch) p.catch(function () { /* autoplay blocked — fine */ });
          } else {
            el.pause();
          }
        });
      }, { threshold: 0.25 });
      player.observe(el);
    } else {
      el.setAttribute("autoplay", "");
    }
  });

  /* ---------------------------------------------------- portrait fallback */

  var portrait = document.querySelector(".hero__portrait img");

  if (portrait) {
    var missing = function () {
      portrait.closest(".hero__portrait").classList.add("is-missing");
    };
    portrait.addEventListener("error", missing);
    if (portrait.complete && !portrait.naturalWidth) missing();
  }
})();
