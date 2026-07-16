/* common.js — tema, status de rede e icônes */
(function () {
  // Tema salvo
  var saved = localStorage.getItem("upa_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);

  function updateToggleIcon() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.innerHTML = isDark
      ? '<i data-lucide="sun"></i>'
      : '<i data-lucide="moon"></i>';
    if (window.lucide) window.lucide.createIcons();
  }

  function updateNet() {
    var status = document.getElementById("net-status");
    var label  = document.getElementById("net-label");
    if (!status || !label) return;
    var dot = status.querySelector(".net-dot");
    if (navigator.onLine) {
      if (dot) dot.classList.remove("offline");
      label.textContent = "Online";
    } else {
      if (dot) dot.classList.add("offline");
      label.textContent = "Offline";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.lucide) window.lucide.createIcons();
    updateToggleIcon();
    updateNet();

    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var cur = document.documentElement.getAttribute("data-theme") || "dark";
        var nxt = cur === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", nxt);
        localStorage.setItem("upa_theme", nxt);
        updateToggleIcon();
      });
    }
  });

  window.addEventListener("online",  updateNet);
  window.addEventListener("offline", updateNet);
})();
