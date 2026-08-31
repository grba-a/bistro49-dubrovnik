/* =========================================================================
   Bistro 49 — single-file runtime
   =========================================================================
   A vanilla port of the React components' behaviour, so the portable HTML can
   be opened straight off disk with no server, no build step and no bundle.

   It is deliberately readable: the markup above is the real semantic HTML and
   this script is plain ES5-ish JavaScript, so text and copy can be edited by
   hand without touching a toolchain.

   Motion rules match the site: custom ease-out curves, nothing animated but
   transform and opacity, no scrub or parallax below 768px, and opacity-only
   under prefers-reduced-motion.
   ========================================================================= */
(function () {
  "use strict";

  var EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isDesktop = function () { return window.innerWidth >= 768; };

  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* ---------------------------------------------------------------------
     Views — the site's two routes live in one file
     --------------------------------------------------------------------- */
  var views = {};
  Array.prototype.forEach.call(document.querySelectorAll("[data-view]"), function (v) {
    views[v.getAttribute("data-view")] = v;
  });
  var current = null;
  var built = {};

  function showView(name, anchor) {
    if (!views[name]) name = "home";
    if (current === name) {
      if (anchor) scrollToAnchor(anchor);
      return;
    }
    Object.keys(views).forEach(function (k) {
      views[k].hidden = k !== name;
    });
    current = name;
    window.history.replaceState(null, "", "#" + name + (anchor ? "/" + anchor : ""));

    if (!built[name]) {
      built[name] = true;
      buildView(views[name], name);
    }
    ScrollTrigger.refresh();

    if (anchor) scrollToAnchor(anchor);
    else scrollTo(0, true);
  }

  function scrollToAnchor(id) {
    var el = document.getElementById(id);
    // The anchor may live in the view that just became visible, so let layout
    // settle before measuring it.
    requestAnimationFrame(function () {
      if (el) scrollTo(el.getBoundingClientRect().top + window.scrollY - 80);
      else scrollTo(0, true);
    });
  }

  /* Route the site's real hrefs without a server. */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.charAt(0) !== "/" && href.charAt(0) !== "#") return;
    if (a.target === "_blank") return;

    var view = "home";
    var anchor = "";
    if (href.indexOf("/menu") === 0) view = "menu";
    var hashAt = href.indexOf("#");
    if (hashAt !== -1) anchor = href.slice(hashAt + 1);
    if (href.charAt(0) === "#") { view = current; anchor = href.slice(1); }

    e.preventDefault();
    showView(view, anchor);
  });

  /* ---------------------------------------------------------------------
     Live open / closed state — port of src/lib/hours.ts
     --------------------------------------------------------------------- */
  function openState(now) {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Zagreb",
      weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
    }).formatToParts(now || new Date());
    var get = function (t) {
      for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value;
      return "0";
    };
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var day = days.indexOf(get("weekday"));
    var hour = (Number(get("hour")) % 24) + Number(get("minute")) / 60;

    if (day === 0) return { open: false, status: "Closed today", detail: "We open again Monday at 08:00" };
    if (hour < 8) {
      var mins = Math.round((8 - hour) * 60);
      return { open: false, status: "Closed", detail: mins <= 90 ? "Opening in " + mins + " min" : "Doors open at 08:00" };
    }
    var left = 24 - hour;
    if (left <= 1) return { open: true, status: "Last orders", detail: "Closing in " + Math.max(1, Math.round(left * 60)) + " min" };
    return { open: true, status: "Open now", detail: left <= 4 ? "Kitchen open until midnight" : "Open until midnight" };
  }

  function paintBadges() {
    var s = openState();
    Array.prototype.forEach.call(document.querySelectorAll("[data-open-badge]"), function (badge) {
      badge.innerHTML =
        '<span class="size-2 shrink-0 rounded-full ' +
        (s.open ? "bg-mint shadow-[0_0_0_3px_rgba(106,192,179,0.18)]" : "bg-muted") +
        '"></span><span class="font-mono text-[0.6875rem] tracking-[0.18em] uppercase">' +
        '<span class="' + (s.open ? "text-bone" : "text-muted") + '">' + s.status + "</span>" +
        '<span class="text-muted"> · ' + s.detail + "</span></span>";
    });
  }

  /* ---------------------------------------------------------------------
     Scrolling — the browser's own. The smooth-scroll library that used to sit
     here was removed from the site, and this export mirrors the site.
     --------------------------------------------------------------------- */
  function scrollTo(y, immediate) {
    window.scrollTo({ top: y, behavior: immediate || reduced ? "auto" : "smooth" });
  }

  /* ---------------------------------------------------------------------
     Chrome: nav lift + mobile action bar
     --------------------------------------------------------------------- */
  function chrome() {
    var navs = document.querySelectorAll("[data-nav]");
    var bars = document.querySelectorAll("[data-sticky-bar]");
    function onScroll() {
      var y = window.scrollY;
      Array.prototype.forEach.call(navs, function (n) {
        n.classList.toggle("border-white/8", y > 24);
        n.classList.toggle("bg-ink/85", y > 24);
        n.classList.toggle("backdrop-blur-xl", y > 24);
        n.classList.toggle("border-transparent", y <= 24);
      });
      var show = y > window.innerHeight * 0.85;
      Array.prototype.forEach.call(bars, function (b) {
        b.classList.toggle("translate-y-full", !show);
        b.classList.toggle("translate-y-0", show);
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Hero — intro curtain, then the wordmark choreography
     --------------------------------------------------------------------- */
  function hero(root) {
    var curtain = root.querySelector("[data-curtain]");
    var tagline = root.querySelector("[data-tagline]");

    if (reduced) {
      if (curtain) curtain.style.display = "none";
      gsap.set(root.querySelectorAll("[data-hero-fade], [data-tagline], [data-hero-bg]"), { opacity: 1 });
      gsap.set(root.querySelectorAll("[data-hero-clip]"), { clipPath: "inset(0 0 0% 0)" });
      return;
    }

    var seen = false;
    try { seen = sessionStorage.getItem("b49-intro") === "1"; } catch (e) { /* file:// can block storage */ }

    var tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

    if (!seen && curtain) {
      var counter = { value: 0 };
      var readout = curtain.querySelector("[data-counter]");
      tl.to(counter, {
        value: 49, duration: 1, ease: "power2.inOut",
        onUpdate: function () {
          if (readout) {
            var v = String(Math.round(counter.value));
            readout.textContent = v.length < 2 ? "0" + v : v;
          }
        },
      })
        .to(curtain.querySelector("[data-curtain-inner]"), { opacity: 0, duration: 0.28 })
        .to(curtain, {
          clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "power3.inOut",
          onComplete: function () {
            curtain.style.display = "none";
            try { sessionStorage.setItem("b49-intro", "1"); } catch (e) { /* ignore */ }
          },
        });
    } else if (curtain) {
      curtain.style.display = "none";
    }

    tl.fromTo(root.querySelectorAll("[data-hero-bg]"),
      { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.8 }, seen ? 0 : "-=0.5")
      .fromTo(root.querySelectorAll("[data-hero-word]"),
        { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.1 }, "-=1.55")
      .fromTo(root.querySelectorAll("[data-hero-clip]"),
        { clipPath: "inset(0 0 100% 0)", scale: 1.05 }, { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1.15 }, "-=0.95")
      .fromTo(root.querySelectorAll("[data-hero-fade]"),
        { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.045 }, "-=0.55");

    if (tagline) {
      document.fonts.ready.then(function () {
        gsap.set(tagline, { opacity: 1 });
        SplitText.create(tagline, {
          type: "lines", mask: "lines", autoSplit: true,
          onSplit: function (self) {
            return gsap.fromTo(self.lines, { yPercent: 108 }, {
              yPercent: 0, duration: 0.9, ease: EASE_OUT, stagger: 0.07,
              delay: seen ? 0.75 : 2.15, overwrite: true,
            });
          },
        });
      });
    }
  }

  /* ---------------------------------------------------------------------
     Reveal engine — sections opt in with data attributes
     --------------------------------------------------------------------- */
  function reveals(root) {
    var groups = root.querySelectorAll("[data-reveal-group]");
    var singles = [];
    Array.prototype.forEach.call(root.querySelectorAll("[data-reveal]"), function (el) {
      if (!el.closest("[data-reveal-group]")) singles.push(el);
    });

    if (reduced) {
      Array.prototype.forEach.call(root.querySelectorAll("[data-reveal]"), function (el) {
        gsap.to(el, { opacity: 1, duration: 0.3, scrollTrigger: { trigger: el, start: "top 92%", once: true } });
      });
      gsap.set(root.querySelectorAll("[data-clip]"), { clipPath: "none" });
      return;
    }

    Array.prototype.forEach.call(groups, function (group) {
      var items = group.querySelectorAll("[data-reveal]");
      if (!items.length) return;
      gsap.fromTo(items, { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.9, ease: EASE_OUT, stagger: 0.08,
        scrollTrigger: { trigger: group, start: "top 82%", once: true },
      });
    });

    singles.forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.9, ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });

    Array.prototype.forEach.call(root.querySelectorAll("[data-clip]"), function (el) {
      gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, {
        clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    if (isDesktop()) {
      Array.prototype.forEach.call(root.querySelectorAll("[data-parallax]"), function (el) {
        var amount = Number(el.getAttribute("data-parallax")) || 12;
        gsap.fromTo(el, { yPercent: -amount / 2 }, {
          yPercent: amount / 2, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }
  }

  /* ---------------------------------------------------------------------
     The Day Arc — sticky panel, chapters crossfaded on scroll.
     Desktop only: a scrubbed section on a phone reads as "nothing happens".
     --------------------------------------------------------------------- */
  function dayArc(root) {
    var track = root.querySelector("[data-track]");
    if (!track || !isDesktop()) return;
    var panels = track.querySelectorAll("[data-panel]");
    if (panels.length < 2) return;

    gsap.set(panels, { opacity: 0 });
    gsap.set(panels[0], { opacity: 1 });

    var rail = root.querySelectorAll("[data-rail]");
    function setRail(active) {
      Array.prototype.forEach.call(rail, function (el, i) {
        el.style.color = i === active ? "var(--color-mint)" : "";
      });
    }
    setRail(0);

    if (reduced) {
      Array.prototype.forEach.call(panels, function (p, i) {
        if (!i) return;
        ScrollTrigger.create({
          trigger: track,
          start: "top+=" + (i / panels.length) * 100 + "% top",
          onEnter: function () { gsap.set(panels, { opacity: function (j) { return j === i ? 1 : 0; } }); setRail(i); },
          onEnterBack: function () { gsap.set(panels, { opacity: function (j) { return j === i ? 1 : 0; } }); setRail(i); },
        });
      });
      return;
    }

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: track, start: "top top", end: "bottom bottom", scrub: 0.6,
        onUpdate: function (self) {
          setRail(Math.min(panels.length - 1, Math.floor(self.progress * panels.length)));
        },
      },
    });

    Array.prototype.forEach.call(panels, function (panel, i) {
      if (!i) return;
      var at = i - 0.5;
      // Images cross-dissolve; text leaves fast and arrives late, because two
      // overlapping paragraphs of display type are unreadable.
      tl.to(panels[i - 1], { opacity: 0, duration: 0.5 }, at)
        .to(panel, { opacity: 1, duration: 0.5 }, at)
        .to(panels[i - 1].querySelector("[data-panel-text]"), { opacity: 0, duration: 0.14 }, at)
        .fromTo(panel.querySelector("[data-panel-text]"), { opacity: 0 }, { opacity: 1, duration: 0.16 }, at + 0.34);
    });
  }

  /* ---------------------------------------------------------------------
     Review marquee — constant motion, so `linear` is the only right easing
     --------------------------------------------------------------------- */
  function marquee(root) {
    var lane = root.querySelector("[data-lane]");
    if (!lane || reduced) return;
    var tween = gsap.to(lane, { xPercent: -50, ease: "none", duration: 46, repeat: -1 });
    lane.addEventListener("pointerenter", function () { tween.pause(); });
    lane.addEventListener("pointerleave", function () { tween.resume(); });
  }

  /* ---------------------------------------------------------------------
     Menu category rail — active item tracked by IntersectionObserver
     --------------------------------------------------------------------- */
  function menuNav(root) {
    var links = root.querySelectorAll("[data-menu-link]");
    if (!links.length) return;
    var sections = [];
    Array.prototype.forEach.call(links, function (l) {
      var el = document.getElementById(l.getAttribute("data-menu-link"));
      if (el) sections.push(el);
    });
    if (!sections.length) return;

    function mark(id) {
      Array.prototype.forEach.call(links, function (l) {
        var on = l.getAttribute("data-menu-link") === id;
        l.classList.toggle("bg-mint", on);
        l.classList.toggle("text-ink", on);
        l.classList.toggle("md:bg-transparent", on);
        l.classList.toggle("md:text-mint", on);
        l.classList.toggle("md:border-mint", on);
        l.classList.toggle("text-muted", !on);
        l.classList.toggle("md:border-white/10", !on);
      });
    }

    var io = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; })[0];
      if (visible) mark(visible.target.id);
    }, { rootMargin: "-88px 0px -70% 0px", threshold: 0 });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  function buildView(root, name) {
    if (name === "home") {
      hero(root);
      dayArc(root);
      marquee(root);
    } else {
      menuNav(root);
    }
    reveals(root);
  }

  document.documentElement.classList.add("js-ready");
  paintBadges();
  window.setInterval(paintBadges, 60000);
  chrome();

  var hash = (window.location.hash || "").replace(/^#/, "");
  var wanted = hash.split("/")[0] || "home";
  showView(views[wanted] ? wanted : "home", hash.split("/")[1] || "");

  // Reveals depend on final image sizes; re-measure once everything has loaded.
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
