/* Cavallino Logbook — Model-specific PPI research prompts
 * Read-only guidance sourced from the model encyclopedia; never a factory checklist.
 */
(function () {
  "use strict";
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function safeUrl(v) { try { var u = new URL(v); return (u.protocol === "https:" || u.protocol === "http:") ? u.href : ""; } catch (_) { return ""; } }
  function install() {
    var root = document.getElementById("prePurchaseContent");
    var profiles = window.CavallinoModelEncyclopedia && window.CavallinoModelEncyclopedia.models;
    var vehicle = document.getElementById("ppiVehicle");
    if (!root || !Array.isArray(profiles) || !vehicle || root.querySelector("[data-model-ppi-guidance]")) return;
    var panel = document.createElement("section");
    panel.className = "sc-item";
    panel.dataset.modelPpiGuidance = "1";
    panel.innerHTML = '<h3>Model-specific research prompts</h3><p class="sc-meta">Choose a model to display relevant inspection research. These are prompts for a qualified specialist, not factory requirements or a pass/fail checklist.</p><div class="field"><label for="ppiModelProfile">Model family</label><select id="ppiModelProfile"><option value="">Select a Ferrari model</option>' +
      profiles.map(function (p) { return '<option value="' + esc(p.id) + '">' + esc(p.name) + ' — ' + esc(p.era) + '</option>'; }).join("") +
      '</select></div><div id="ppiModelPromptBody"><p class="sc-meta">Select a model family to see identification checks, inspection themes and source links.</p></div><button class="btn btn-ghost btn-sm" id="ppiAddModelPrompts" type="button" disabled>Add prompts to report summary</button>';
    var notice = root.querySelector(".sc-notice");
    if (notice) notice.insertAdjacentElement("afterend", panel);
    else root.insertBefore(panel, root.firstChild);
    var select = panel.querySelector("#ppiModelProfile");
    var body = panel.querySelector("#ppiModelPromptBody");
    var add = panel.querySelector("#ppiAddModelPrompts");
    var active = null;
    function show(profile) {
      active = profile || null;
      if (!profile) {
        body.innerHTML = '<p class="sc-meta">Select a model family to see identification checks, inspection themes and source links.</p>';
        add.disabled = true;
        return;
      }
      var links = profile.sources.map(function (source) {
        var url = safeUrl(source[1]);
        return url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(source[0]) + '</a>' : "";
      }).filter(Boolean).join(" · ");
      body.innerHTML = '<p><strong>Identification:</strong> ' + esc(profile.identity) + '</p><p><strong>Inspection themes:</strong> ' + esc(profile.focus) + '</p><p class="sc-meta"><strong>Sources:</strong> ' + links + '</p>';
      add.disabled = false;
    }
    function findFromVehicle() {
      var text = vehicle.value.toLowerCase();
      var found = profiles.find(function (p) {
        var token = p.id.toLowerCase();
        if (token === "f355" || token === "f430") return text.indexOf(token) >= 0;
        return text.indexOf(token) >= 0 || text.indexOf(p.name.toLowerCase()) >= 0;
      });
      if (found) { select.value = found.id; show(found); }
      else if (!text.trim()) { select.value = ""; show(null); }
    }
    select.addEventListener("change", function () {
      var profile = profiles.find(function (p) { return p.id === select.value; });
      if (profile) vehicle.value = "Ferrari " + profile.name;
      show(profile);
    });
    vehicle.addEventListener("input", findFromVehicle);
    add.onclick = function () {
      if (!active) return;
      var summary = document.getElementById("ppiSummary");
      if (!summary) return;
      var text = "MODEL-SPECIFIC RESEARCH PROMPTS — " + active.name + "\nIdentification: " + active.identity + "\nInspection themes: " + active.focus + "\nThese are research prompts only; verify against the exact VIN, year, market and variant.";
      summary.value = summary.value.trim() ? summary.value.trim() + "\n\n" + text : text;
      if (typeof window.toast === "function") window.toast("Model research prompts added to report summary");
    };
    findFromVehicle();
  }
  var original = window.renderPrePurchaseInspection;
  if (typeof original === "function") {
    window.renderPrePurchaseInspection = function () { original(); install(); };
    window.renderPrePurchaseInspection();
  }
})();
