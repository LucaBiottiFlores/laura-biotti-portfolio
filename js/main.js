(function () {
  "use strict";

  // --- Tema claro/oscuro ---
  var root = document.documentElement;
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
  var body = document.body;
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

})();
