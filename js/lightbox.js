// Click-to-expand lightbox for the dissertation project boxes.
// Each .diss-box becomes clickable/keyboard-focusable; clicking opens an
// overlay showing the same title, figure placeholder, and description at
// a larger size.

(function () {
  var overlay, card;

  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    card = document.createElement("div");
    card.className = "lightbox-card";
    card.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><div class="lightbox-body"></div>';
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    card.querySelector(".lightbox-close").addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function open(title, descParas, imgText) {
    ensureOverlay();
    var descHtml = descParas.map(function (d) {
      return '<p class="lightbox-desc">' + d + "</p>";
    }).join("");
    card.querySelector(".lightbox-body").innerHTML =
      '<div class="lightbox-img">' + imgText + "</div>" +
      '<p class="lightbox-title">' + title + "</p>" +
      descHtml;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    card.querySelector(".lightbox-close").focus();
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".diss-box").forEach(function (box) {
      box.setAttribute("tabindex", "0");
      box.setAttribute("role", "button");

      function trigger() {
        var title = box.querySelector(".diss-title").textContent;
        var descParas = Array.prototype.map.call(
          box.querySelectorAll(".diss-desc"),
          function (p) { return p.textContent; }
        );
        var imgHtml = box.querySelector(".diss-img").innerHTML;
        open(title, descParas, imgHtml);
      }

      box.addEventListener("click", trigger);
      box.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          trigger();
        }
      });
    });
  });
})();
