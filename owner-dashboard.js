/* Cavallino Logbook — Owner Dashboard
 * Read-only overview of the selected vehicle's local records and personal reminders.
 */
(function () {
  "use strict";
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function read(key) { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (_) { return null; } }
  function money(v) { return Number(v || 0).toLocaleString("en-US", {style:"currency",currency:"USD",maximumFractionDigits:0}); }
  function render() {
    var host = document.querySelector("#view-garage .garage-header");
    if (!host) return;
    var old = document.getElementById("ownerDashboard");
    if (old) old.remove();
    var db = read("cavallino_v2");
    var car = db && Array.isArray(db.cars) ? db.cars.find(function (c) { return c.id === selectedId; }) : null;
    var ppi = read("cavallino_ppi_v1");
    var specialist = read("cavallino_specialist_center_v1");
    var panel = document.createElement("section");
    panel.id = "ownerDashboard";
    panel.className = "panel";
    panel.style.marginBottom = "18px";
    if (!car) {
      panel.innerHTML = '<div class="panel-top"><div><h2>Owner Dashboard</h2><div class="panel-meta">Select a vehicle to see its records and reminders</div></div></div>';
    } else {
      var services = Array.isArray(car.services) ? car.services.slice() : [];
      services.sort(function (a,b) { return String(b.date || "").localeCompare(String(a.date || "")); });
      var reminders = Array.isArray(car.maintenanceReminders) ? car.maintenanceReminders : [];
      var today = new Date().toISOString().slice(0,10), mileage = Number(car.mileage || 0);
      var open = reminders.filter(function (r) { return r.status !== "complete"; });
      var due = open.filter(function (r) { return (r.dueDate && r.dueDate <= today) || (r.dueOdo != null && mileage >= Number(r.dueOdo)); });
      var upcoming = open.length - due.length;
      var spend = services.reduce(function (sum,e) { return sum + Number(e.cost || 0); },0);
      var latest = services[0];
      var ppiCount = ppi && Array.isArray(ppi.items) ? ppi.items.length : 0;
      var noteCount = specialist && Array.isArray(specialist.items) ? specialist.items.length : 0;
      panel.innerHTML =
        '<div class="panel-top"><div><h2>Owner Dashboard</h2><div class="panel-meta">' + esc(car.year) + ' ' + esc(car.model) + ' · ' + Number(mileage).toLocaleString("en-US") + ' mi recorded</div></div><span class="pill pill-none">Local records</span></div>' +
        '<div class="owner-dashboard-grid">' +
        '<div class="owner-dashboard-stat"><span>Service records</span><strong>' + services.length + '</strong><small>' + (latest ? 'Latest: ' + esc(latest.date || "Date not entered") : 'No service entries yet') + '</small></div>' +
        '<div class="owner-dashboard-stat"><span>Documented spend</span><strong>' + money(spend) + '</strong><small>Based only on entered service costs</small></div>' +
        '<div class="owner-dashboard-stat"><span>Reminders due</span><strong>' + due.length + '</strong><small>' + upcoming + ' upcoming · ' + (reminders.length - open.length) + ' completed</small></div>' +
        '<div class="owner-dashboard-stat"><span>Saved inspections</span><strong>' + ppiCount + '</strong><small>' + noteCount + ' Specialist Center knowledge notes</small></div>' +
        '</div>' +
        '<div class="owner-dashboard-latest">' + (latest ? '<strong>Most recent service:</strong> ' + esc(latest.date || "Date not entered") + ' · ' + esc(latest.type || "Service") + ' · ' + Number(latest.odo || 0).toLocaleString("en-US") + ' mi' : 'Add your first service entry to start the vehicle history') + '</div>' +
        '<div class="owner-dashboard-actions"><button class="btn btn-ghost btn-sm" data-open-tab="ledger">Open Service Log</button><button class="btn btn-ghost btn-sm" data-open-tab="schedule">Open Schedule & Reminders</button><button class="btn btn-ghost btn-sm" data-open-tab="specialist">Specialist Center</button><button class="btn btn-ghost btn-sm" data-open-tab="prepurchase">Pre-Purchase Workspace</button></div>' +
        '<p class="sc-meta" style="margin-top:10px">Dashboard figures summarize information entered in this browser. Reminder targets are owner-entered planning notes, not factory service intervals. No cloud sync is active.</p>';
    }
    var style = document.getElementById("owner-dashboard-style");
    if (!style) {
      style = document.createElement("style"); style.id = "owner-dashboard-style";
      style.textContent = '.owner-dashboard-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px}.owner-dashboard-stat{background:var(--surface-2);border:1px solid var(--hairline);border-radius:9px;padding:12px;min-width:0}.owner-dashboard-stat span{display:block;color:var(--ink-dim);font-size:10px;text-transform:uppercase;letter-spacing:.08em}.owner-dashboard-stat strong{display:block;font:24px Fraunces,serif;color:var(--ink);margin:5px 0}.owner-dashboard-stat small{display:block;color:var(--ink-dim);font-size:10px;line-height:1.4}.owner-dashboard-latest{font-size:12px;margin-top:12px;padding:10px 0;border-top:1px solid var(--hairline)}.owner-dashboard-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}';
      document.head.appendChild(style);
    }
    host.insertAdjacentElement("afterend", panel);
    panel.querySelectorAll("[data-open-tab]").forEach(function (button) {
      button.onclick = function () { if (typeof window.showTab === "function") window.showTab(button.dataset.openTab); };
    });
  }
  var original = window.renderGarage;
  if (typeof original === "function") {
    window.renderGarage = function () { original(); render(); };
    window.renderGarage();
  }
})();
