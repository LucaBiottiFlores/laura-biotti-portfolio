(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;

  // --- Tema claro/oscuro ---
  var toggle = document.querySelector("[data-theme-toggle]");
  var label = document.querySelector("[data-theme-label]");

  function applyTheme(dark) {
    root.setAttribute("data-theme", dark ? "dark" : "light");
    if (label) label.textContent = dark ? "Claro" : "Oscuro";
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved ? saved === "dark" : prefersDark);

  if (toggle) {
    toggle.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") !== "dark");
    });
  }

  // --- Menú móvil ---
  var menuToggle = document.querySelector("[data-menu-toggle]");
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  document.querySelectorAll(".nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      body.classList.remove("nav-open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // --- Lightbox ---
  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  var lightboxImg = lightbox.querySelector(".lightbox-img");
  var lightboxCaption = lightbox.querySelector(".lightbox-caption");
  var closeBtn = lightbox.querySelector("[data-lightbox-close]");
  var prevBtn = lightbox.querySelector("[data-lightbox-prev]");
  var nextBtn = lightbox.querySelector("[data-lightbox-next]");

  var items = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  var index = 0;

  items.forEach(function (item) {
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    var img = item.querySelector("img");
    var fig = item.querySelector("figcaption");
    var label = (fig ? fig.textContent.trim() : "") || (img ? img.getAttribute("alt") : "") || "Ver trabajo";
    item.setAttribute("aria-label", "Ampliar: " + label);
  });

  function captionFor(item) {
    var fig = item.querySelector("figcaption");
    if (fig) return fig.textContent.trim();
    var img = item.querySelector("img");
    return img ? img.getAttribute("alt") : "";
  }

  function render() {
    var item = items[index];
    var img = item.querySelector("img");
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.getAttribute("alt") || "";
    }
    lightboxCaption.textContent = captionFor(item);
    lightbox.scrollTop = 0;
  }

  function open(i) {
    index = (i + items.length) % items.length;
    render();
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    body.classList.add("lightbox-open");
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    body.classList.remove("lightbox-open");
    if (items[index]) items[index].focus();
  }

  items.forEach(function (item, i) {
    item.addEventListener("click", function () { open(i); });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(i);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", close);
  if (prevBtn) prevBtn.addEventListener("click", function () { open(index - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { open(index + 1); });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") open(index - 1);
    if (e.key === "ArrowRight") open(index + 1);
  });
})();
