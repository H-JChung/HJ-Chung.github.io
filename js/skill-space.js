// Skill-space scatter plot.
// Loads data/skills-{low,mid}.json, lets the visitor pick two skill
// dimensions as axes, and plots majors as labelled points.

(function () {
  var state = { data: null, xi: 0, yi: 1, filter: "" };
  var slot, dim1Sel, dim2Sel, detailSel, searchBox;

  var FILES = { low: "data/skills-low.json", mid: "data/skills-mid.json" };

  function loadData(level) {
    slot.innerHTML = '<div style="padding:2rem; text-align:center; color:var(--ink-faint); font-size:13px;">Loading…</div>';
    fetch(FILES[level])
      .then(function (r) { return r.json(); })
      .then(function (json) {
        state.data = json;
        populateSkillSelects(json.skills);
        state.xi = 0;
        state.yi = Math.min(1, json.skills.length - 1);
        dim1Sel.value = state.xi;
        dim2Sel.value = state.yi;
        render();
      })
      .catch(function (err) {
        slot.innerHTML = '<div style="padding:2rem; text-align:center; color:var(--ink-faint); font-size:13px;">Could not load data (' + err + ').</div>';
      });
  }

  function populateSkillSelects(skills) {
    [dim1Sel, dim2Sel].forEach(function (sel) {
      sel.innerHTML = "";
      skills.forEach(function (s, i) {
        var o = document.createElement("option");
        o.value = i;
        o.textContent = s;
        sel.appendChild(o);
      });
    });
  }

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  function render() {
    if (!state.data) return;
    var xi = state.xi, yi = state.yi;
    var majors = state.data.majors;
    var skills = state.data.skills;

    var xs = majors.map(function (m) { return m.values[xi]; });
    var ys = majors.map(function (m) { return m.values[yi]; });
    var xMin = Math.min.apply(null, xs), xMax = Math.max.apply(null, xs);
    var yMin = Math.min.apply(null, ys), yMax = Math.max.apply(null, ys);
    var xPad = (xMax - xMin) * 0.08 || 0.1, yPad = (yMax - yMin) * 0.08 || 0.1;
    xMin -= xPad; xMax += xPad; yMin -= yPad; yMax += yPad;

    var W = 680, H = 460, L = 40, R = 16, T = 16, B = 40;
    var PW = W - L - R, PH = H - T - B;
    function px(v) { return L + ((v - xMin) / (xMax - xMin)) * PW; }
    function py(v) { return T + PH - ((v - yMin) / (yMax - yMin)) * PH; }

    var q = state.filter.trim().toLowerCase();
    var pts = majors.map(function (m, i) {
      return { n: m.name, x: px(m.values[xi]), y: py(m.values[yi]), i: i,
               match: q && m.name.toLowerCase().indexOf(q) !== -1 };
    });

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto;" role="img">';
    if (xMin < 0 && xMax > 0) {
      svg += '<line x1="' + px(0) + '" y1="' + T + '" x2="' + px(0) + '" y2="' + (T + PH) + '" stroke="var(--line)" stroke-width="1" stroke-dasharray="3 3"/>';
    }
    if (yMin < 0 && yMax > 0) {
      svg += '<line x1="' + L + '" y1="' + py(0) + '" x2="' + (L + PW) + '" y2="' + py(0) + '" stroke="var(--line)" stroke-width="1" stroke-dasharray="3 3"/>';
    }
    svg += '<line x1="' + L + '" y1="' + (T + PH) + '" x2="' + (L + PW) + '" y2="' + (T + PH) + '" stroke="var(--line-strong)" stroke-width="1"/>';
    svg += '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (T + PH) + '" stroke="var(--line-strong)" stroke-width="1"/>';
    svg += '<text x="' + (L + PW) + '" y="' + (H - 10) + '" text-anchor="end" style="font-size:12px;fill:var(--ink-soft);">' + esc(skills[xi]) + ' \u2192</text>';
    svg += '<text x="' + L + '" y="' + (T - 4) + '" style="font-size:12px;fill:var(--ink-soft);">\u2191 ' + esc(skills[yi]) + '</text>';

    var order = pts.slice().sort(function (a, b) { return a.y - b.y; });
    var placed = [];
    var dotsHtml = "", labelsHtml = "";
    order.forEach(function (p) {
      var isHi = p.match;
      var w = p.n.length * 5.6, lx = p.x + 7, ly = p.y + 3.5;
      if (lx + w > L + PW) lx = p.x - 7 - w;
      var box = { x: lx, y: ly - 9, w: w, h: 13 };
      var hit = false;
      for (var k = 0; k < placed.length; k++) {
        var qbox = placed[k];
        if (box.x < qbox.x + qbox.w && box.x + box.w > qbox.x && box.y < qbox.y + qbox.h && box.y + box.h > qbox.y) { hit = true; break; }
      }
      var show = isHi || !hit;
      if (!hit || isHi) placed.push(box);
      labelsHtml +=
        '<text class="lab" data-i="' + p.i + '" x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) +
        '" style="font-size:11px;pointer-events:none;fill:' + (isHi ? "var(--accent)" : "var(--ink-soft)") +
        ';font-weight:' + (isHi ? "500" : "400") + ';opacity:' + (show ? 1 : 0) + ';">' + esc(p.n) + '</text>';
      dotsHtml +=
        '<circle class="dot" data-i="' + p.i + '" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) +
        '" r="' + (isHi ? 6 : 4) + '" fill="' + (isHi ? "#B8863B" : "#7F77DD") + '" style="cursor:pointer;"/>';
    });

    svg += dotsHtml + labelsHtml + "</svg>";
    slot.innerHTML = svg;

    slot.querySelectorAll(".dot").forEach(function (c) {
      c.addEventListener("mouseenter", function () {
        var t = slot.querySelector('.lab[data-i="' + c.dataset.i + '"]');
        if (t) { t.style.opacity = 1; t.style.fill = "var(--ink)"; t.parentNode.appendChild(t); }
        c.setAttribute("r", 7);
      });
      c.addEventListener("mouseleave", render);
    });
  }

  function init() {
    slot = document.getElementById("skill-space-slot");
    dim1Sel = document.getElementById("dim1");
    dim2Sel = document.getElementById("dim2");
    detailSel = document.getElementById("detail");
    if (!slot || !dim1Sel || !dim2Sel || !detailSel) return;

    searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.autocomplete = "off";
    searchBox.placeholder = "Find a major\u2026";
    searchBox.style.cssText =
      "font-family:'IBM Plex Sans',sans-serif;font-size:13px;padding:6px 10px;border:1px solid var(--line-strong);border-radius:4px;width:220px;box-sizing:border-box;";

    var searchWrap = document.createElement("div");
    searchWrap.style.cssText = "position:relative;display:inline-block;margin-bottom:10px;";

    var suggestList = document.createElement("ul");
    suggestList.style.cssText =
      "list-style:none;margin:2px 0 0;padding:4px 0;position:absolute;top:100%;left:0;right:0;background:var(--paper);border:1px solid var(--line-strong);border-radius:4px;max-height:220px;overflow-y:auto;z-index:10;display:none;box-shadow:0 4px 10px rgba(0,0,0,0.08);";

    searchWrap.appendChild(searchBox);
    searchWrap.appendChild(suggestList);
    slot.parentNode.insertBefore(searchWrap, slot);

    function closeSuggestions() { suggestList.style.display = "none"; }

    function showSuggestions() {
      var q = searchBox.value.trim().toLowerCase();
      suggestList.innerHTML = "";
      if (!q || !state.data) { closeSuggestions(); return; }
      var matches = state.data.majors
        .filter(function (m) { return m.name.toLowerCase().indexOf(q) !== -1; })
        .slice(0, 8);
      if (!matches.length) { closeSuggestions(); return; }
      matches.forEach(function (m) {
        var li = document.createElement("li");
        li.textContent = m.name;
        li.style.cssText = "padding:7px 10px;font-size:13px;cursor:pointer;";
        li.addEventListener("mouseenter", function () { li.style.background = "var(--accent-tint)"; });
        li.addEventListener("mouseleave", function () { li.style.background = "transparent"; });
        li.addEventListener("mousedown", function (e) {
          e.preventDefault();
          searchBox.value = m.name;
          state.filter = m.name;
          closeSuggestions();
          render();
        });
        suggestList.appendChild(li);
      });
      suggestList.style.display = "block";
    }

    dim1Sel.addEventListener("change", function () { state.xi = +dim1Sel.value; render(); });
    dim2Sel.addEventListener("change", function () { state.yi = +dim2Sel.value; render(); });
    detailSel.addEventListener("change", function () {
      var v = detailSel.value;
      if (v === "high") return;
      loadData(v);
    });
    searchBox.addEventListener("input", function () {
      state.filter = searchBox.value;
      showSuggestions();
      render();
    });
    searchBox.addEventListener("focus", showSuggestions);
    document.addEventListener("click", function (e) {
      if (!searchWrap.contains(e.target)) closeSuggestions();
    });

    loadData(detailSel.value || "low");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
