(function () {
  var pages = [
    ["index.html", "Home"],
    ["scores.html", "Scores explained"],
    ["venom-types.html", "Venom types"],
    ["species.html", "Species"]
  ];
  var here = window.PAGE || (document.body && document.body.getAttribute("data-page"));
  var logo = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18c3 0 3-4 6-4s3 4 6 4 3-4 4-4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="19.5" cy="7" r="2.2" fill="var(--accent)"/></svg>';
  var nav = pages.map(function (p) {
    return '<a href="' + p[0] + '"' + (p[0] === here ? ' aria-current="page"' : "") + ">" + p[1] + "</a>";
  }).join("");
  function mount() {
  var head = document.createElement("div");
  head.innerHTML =
    '<header class="site-head"><div class="in">' +
    '<a class="brand" href="index.html">' + logo + "Venomous Snakes Explained</a>" +
    '<nav class="nav" aria-label="Main">' + nav + "</nav>" +
    '<details class="bitten"><summary>Bitten?</summary><div class="panel">' +
    "<h3>Get to a hospital now</h3>" +
    "<p>Call your local emergency number, or get someone to drive you to the nearest hospital.</p>" +
    "<ul><li>Keep the person still and calm. Movement speeds up the spread of venom.</li>" +
    "<li>Take off rings, watches and tight clothing before swelling starts.</li>" +
    "<li>Do not cut, suck, apply ice or use a tourniquet.</li>" +
    "<li>Note the time of the bite. A photo of the snake helps, but do not try to catch it.</li></ul>" +
    '<p class="caption">This site explains venom. It cannot tell you how serious a bite is. Treat every bite as an emergency.</p>' +
    "</div></details></div></header>";
  var first = document.body.firstChild;
  while (head.firstChild) document.body.insertBefore(head.firstChild, first);
  }
  function mountFoot() {
  var foot = document.createElement("footer");
  foot.className = "site-foot";
  foot.innerHTML = '<div class="in"><span>Venomous Snakes Explained. This site explains venom; it is not medical advice.</span><span>Scores are indicative, built from lab data and expert judgement. <a href="scores.html">How the scores work</a>.</span></div>';
  document.body.appendChild(foot);
  }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
  if (document.readyState === "complete" || document.readyState === "interactive") mountFoot(); else document.addEventListener("DOMContentLoaded", mountFoot);

  // Shared tooltip
  var tip = null;
  window.showTip = function (html, x, y) {
    if (!tip) { tip = document.createElement("div"); tip.className = "tip"; tip.setAttribute("role", "status"); document.body.appendChild(tip); }
    tip.innerHTML = html;
    tip.classList.add("on");
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = Math.min(x + 14, window.innerWidth - w - 8);
    var top = y - h - 12 < 8 ? y + 16 : y - h - 12;
    tip.style.left = Math.max(8, left) + "px";
    tip.style.top = top + "px";
  };
  window.hideTip = function () { if (tip) tip.classList.remove("on"); };

  window.fmt = function (v, d) { return v == null ? "–" : Number(v).toFixed(d == null ? 1 : d); };
  window.slug = function (sci) { return "sp-" + sci.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".html"; };
  window.byName = function (sci) { return (window.SPECIES || []).find(function (s) { return s.sci === sci; }); };

  // Chart labels: try spots around each point and keep the first that covers no other point, label, caption or the plot edge.
  // labels: [{x, y, text}], pts: [{x, y}] (every plotted point), box: {l, t, r, b} in SVG units.
  window.placeLabels = function (svg, labels, pts, box) {
    var NS = "http://www.w3.org/2000/svg", R = 7;
    var taken = [].map.call(svg.querySelectorAll(".quad, .contour-t"), function (e) { return e.getBBox(); });   // keep chart captions clear too
    var spots = [];                                   // right, left, above, below and the diagonals, stepping further out each ring
    [0, 10, 22].forEach(function (d) {
      spots.push([10 + d, 4, "start"], [-10 - d, 4, "end"], [0, -11 - d, "middle"], [0, 19 + d, "middle"],
                 [8 + d, -9 - d, "start"], [-8 - d, -9 - d, "end"], [8 + d, 17 + d, "start"], [-8 - d, 17 + d, "end"]);
    });
    var hit = function (a, b) { return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height; };
    labels.forEach(function (l) {
      var t = document.createElementNS(NS, "text"); t.setAttribute("class", "lbl"); t.textContent = l.text; svg.appendChild(t);
      var best = null;
      spots.forEach(function (sp) {
        if (best && best.cost === 0) return;
        t.setAttribute("x", l.x + sp[0]); t.setAttribute("y", l.y + sp[1]); t.setAttribute("text-anchor", sp[2]);
        var bb = t.getBBox(), r = { x: bb.x - 2, y: bb.y - 1, width: bb.width + 4, height: bb.height + 2 }, cost = 0;
        pts.forEach(function (p) { if (hit(r, { x: p.x - R, y: p.y - R, width: 2 * R, height: 2 * R })) cost += 10; });
        taken.forEach(function (o) { if (hit(r, o)) cost += 10; });
        if (r.x < box.l || r.y < box.t || r.x + r.width > box.r || r.y + r.height > box.b) cost += 1000;   // never run off the chart
        if (!best || cost < best.cost) best = { cost: cost, sp: sp, r: r };
      });
      t.setAttribute("x", l.x + best.sp[0]); t.setAttribute("y", l.y + best.sp[1]); t.setAttribute("text-anchor", best.sp[2]);
      taken.push(best.r);
    });
  };
})();

// Species pages: left and right arrow keys step through species
document.addEventListener("keydown", function (e) {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  var rel = e.key === "ArrowLeft" ? "prev" : e.key === "ArrowRight" ? "next" : null;
  var a = rel && document.querySelector('.pager a[rel="' + rel + '"]');
  if (a) location.href = a.href;
});
