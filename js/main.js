/* ==========================================================================
   IRON CONSTRUCTION GROUP — Main Script
   Vanilla JavaScript, no dependencies.
   ========================================================================== */

(function () {
  "use strict";

  // Flag JS availability so CSS can default content to visible
  // when scripts are disabled.
  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     1. Sticky header state
     ------------------------------------------------------------------ */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScrollHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });
  }

  /* ------------------------------------------------------------------
     2. Mobile navigation
     ------------------------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var overlay = document.querySelector(".nav-overlay");
  var body = document.body;

  var closeNav = function () {
    body.classList.remove("nav-open");
    if (toggle) toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  var openNav = function () {
    body.classList.add("nav-open");
    if (toggle) toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  if (toggle) {
    toggle.addEventListener("click", function () {
      if (body.classList.contains("nav-open")) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeNav);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  // Close menu when a nav link is tapped (mobile)
  var navLinks = document.querySelectorAll(".main-nav a");
  Array.prototype.forEach.call(navLinks, function (link) {
    link.addEventListener("click", closeNav);
  });

  // Mark the current page's nav link as active.
  // Works with both clean URLs (/about) and explicit files (/about.html).
  var current = (window.location.pathname.split("/").pop() || "index.html").replace(/\.html$/i, "");
  Array.prototype.forEach.call(navLinks, function (link) {
    var href = (link.getAttribute("href") || "").replace(/\.html$/i, "");
    if (href === current) link.classList.add("is-active");
  });

  /* ------------------------------------------------------------------
     3. Reveal on scroll
     ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ------------------------------------------------------------------
     4. Animated counters
     ------------------------------------------------------------------ */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var animateCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var duration = 1600;
      var start = null;

      var step = function (ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = target * eased;
        el.textContent = decimals
          ? value.toFixed(decimals)
          : Math.round(value).toLocaleString("en-US");
        if (progress < 1) window.requestAnimationFrame(step);
        else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString("en-US");
      };

      window.requestAnimationFrame(step);
    };

    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     5. Project filtering (projects page)
     ------------------------------------------------------------------ */
  var filterBar = document.querySelector("[data-filter-bar]");
  if (filterBar) {
    var filterBtns = filterBar.querySelectorAll("[data-filter]");
    var projectItems = document.querySelectorAll("[data-category]");
    var filterResult = document.querySelector("[data-filter-result]");
    var filterLabels = {
      all: "Showing all projects.",
      construction: "Showing construction projects.",
      solar: "Showing solar projects.",
      commercial: "Showing commercial projects.",
      residential: "Showing residential projects."
    };

    var applyFilter = function (filter) {
      projectItems.forEach(function (item) {
        var cats = (item.getAttribute("data-category") || "").split(" ");
        var show = filter === "all" || cats.indexOf(filter) !== -1;
        item.classList.toggle("is-hidden", !show);
      });
      if (filterResult && filterLabels[filter]) {
        filterResult.textContent = filterLabels[filter];
      }
    };

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        applyFilter(btn.getAttribute("data-filter"));
      });
    });
  }

  /* ------------------------------------------------------------------
     6. FAQ accordion
     ------------------------------------------------------------------ */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;

    var open = function () {
      item.classList.add("is-open");
      a.style.maxHeight = a.scrollHeight + "px";
      q.setAttribute("aria-expanded", "true");
    };
    var close = function () {
      item.classList.remove("is-open");
      a.style.maxHeight = "0px";
      q.setAttribute("aria-expanded", "false");
    };

    q.addEventListener("click", function () {
      if (item.classList.contains("is-open")) {
        close();
      } else {
        // Optional: close siblings for single-open behaviour
        faqItems.forEach(function (other) {
          if (other !== item) {
            other.classList.remove("is-open");
            other.querySelector(".faq-a").style.maxHeight = "0px";
            other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          }
        });
        open();
      }
    });

    // Keep height correct on resize while open
    window.addEventListener("resize", function () {
      if (item.classList.contains("is-open")) {
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ------------------------------------------------------------------
     7. Testimonial slider
     ------------------------------------------------------------------ */
  var slider = document.querySelector("[data-slider]");
  if (slider) {
    var slides = slider.querySelectorAll(".testimonial-slide");
    var track = slider.querySelector(".testimonial-track");
    var prev = slider.querySelector("[data-prev]");
    var next = slider.querySelector("[data-next]");
    var index = 0;

    if (slides.length > 1 && track) {
      var show = function (i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = "translateX(-" + index * 100 + "%)";
      };

      slides.forEach(function (slide) {
        slide.style.flex = "0 0 100%";
      });
      track.style.display = "flex";
      track.style.transition = "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)";

      if (prev) prev.addEventListener("click", function () { show(index - 1); });
      if (next) next.addEventListener("click", function () { show(index + 1); });

      var autoTimer = null;
      var startAuto = function () {
        if (reduceMotion) return;
        autoTimer = window.setInterval(function () { show(index + 1); }, 6500);
      };
      var stopAuto = function () {
        if (autoTimer) window.clearInterval(autoTimer);
      };

      slider.addEventListener("mouseenter", stopAuto);
      slider.addEventListener("mouseleave", startAuto);
      slider.addEventListener("focusin", stopAuto);
      slider.addEventListener("focusout", startAuto);
      startAuto();
    } else if (prev || next) {
      if (prev) prev.style.display = "none";
      if (next) next.style.display = "none";
    }
  }

  /* ------------------------------------------------------------------
     8. Smooth scroll for same-page anchors
     ------------------------------------------------------------------ */
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  Array.prototype.forEach.call(anchorLinks, function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href");
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      if (reduceMotion) {
        target.scrollIntoView();
      } else {
        var y = target.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  });

  /* ------------------------------------------------------------------
     9. Back to top
     ------------------------------------------------------------------ */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    var onScrollTop = function () {
      toTop.classList.toggle("is-visible", window.scrollY > 600);
    };
    onScrollTop();
    window.addEventListener("scroll", onScrollTop, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------------------
     10. Contact form — front-end submission handler
         (No backend: shows a confirmation notice only.)
     ------------------------------------------------------------------ */
  var quoteForm = document.querySelector("[data-quote-form]");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var notice = document.querySelector("[data-form-notice]");
      if (notice) {
        notice.hidden = false;
        notice.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
      }
      quoteForm.reset();
    });
  }

  /* ------------------------------------------------------------------
     11. Footer year
     ------------------------------------------------------------------ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
