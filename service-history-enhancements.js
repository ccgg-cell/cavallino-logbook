/* Cavallino Logbook — Service History Enhancements
 * Backward-compatible extension of the existing cavallino_v2 garage records.
 * Adds supporting-document metadata, safe editing/deletion and CSV export.
 */
(function () {
  "use strict";
  var KEY = "cavallino_v2";
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  function write(db) { try { localStorage.setItem(KEY, JSON.stringify(db)); return true; } catch (e) { alert("Could not save this change. Export a backup and check browser storage."); return false; } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function currentCar(db) { return db && db.cars && db.cars.find(function (c) { return c.id === selectedId; }); }
  function addFields() {
    var modal = document.querySelector("#addSvcOverlay .modal");
    if (!modal || document.getElementById("s-parts")) return;
    var actions = modal.querySelector(".modal-actions");
    var group = document.createElement("div");
    group.className = "field-group";
    group.innerHTML = '<div class="field"><label>Parts / fluids / part numbers</label><textarea id="s-parts" placeholder="Record only documented details, quantities and part numbers."></textarea></div>';
    modal.insertBefore(group, actions);
    group = document.createElement("div");
    group.className = "field-group";
    group.innerHTML = '<div class="field"><label>Invoice / document reference</label><input id="s-invoice" placeholder="Invoice number or your own file reference"></div><div class="field"><label>Record basis</label><select id="s-basis"><option>Not specified</option><option>Factory documentation</option><option>Independent specialist recommendation</option><option>Owner observation</option><option>Other / unverified</option></select></div>';
    modal.insertBefore(group, actions);
    group = document.createElement("div");
    group.className = "field-group";
    group.innerHTML = '<div class="field"><label>Recommended follow-up</label><textarea id="s-followup" placeholder="Workshop recommendation and any stated due date or mileage."></textarea></div>';
    modal.insertBefore(group, actions);
    var style = document.createElement("style");
    style.textContent = ".ledger-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.ledger-actions .btn{padding:5px 9px;font-size:10px}";
    document.head.appendChild(style);
  }
  function enhanceSavedRecord() {
    var parts = document.getElementById("s-parts");
    var db = read(), car = currentCar(db);
    if (!parts || !car || !car.services || !car.services.length) return;
    var entry = car.services[car.services.length - 1];
    entry.parts = parts.value.trim();
    entry.invoiceRef = document.getElementById("s-invoice").value.trim();
    entry.basis = document.getElementById("s-basis").value;
    entry.followup = document.getElementById("s-followup").value.trim();
    write(db);
  }
  function editRecord(id) {
    var db = read(), car = currentCar(db);
    var e = car && (car.services || []).find(function (x) { return x.id === id; });
    if (!e) return;
    var fieldsToEdit = [
      ["date", "Date (YYYY-MM-DD)"], ["odo", "Odometer"], ["type", "Service type"],
      ["shop", "Workshop / specialist"], ["cost", "Cost (USD)"], ["notes", "Work performed / findings"],
      ["parts", "Parts / fluids / part numbers"], ["invoiceRef", "Invoice / document reference"],
      ["basis", "Record basis"], ["followup", "Recommended follow-up"]
    ];
    for (var i = 0; i < fieldsToEdit.length; i++) {
      var k = fieldsToEdit[i][0], value = prompt(fieldsToEdit[i][1], e[k] == null ? "" : String(e[k]));
      if (value === null) return;
      e[k] = k === "odo" || k === "cost" ? (Number(value) || 0) : value;
    }
    if (write(db) && typeof window.renderAll === "function") window.renderAll();
  }
  function deleteRecord(id) {
    var db = read(), car = currentCar(db);
    if (!car || !confirm("Delete this service record? This cannot be undone unless you have a backup.")) return;
    car.services = (car.services || []).filter(function (e) { return e.id !== id; });
    if (write(db) && typeof window.renderAll === "function") window.renderAll();
  }
  function exportCSV() {
    var db = read(), car = currentCar(db);
    if (!car) return;
    var cols = ["date","odo","type","shop","cost","notes","parts","invoiceRef","basis","followup"];
    var quote = function (v) { return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"'; };
    var csv = [cols.join(",")].concat((car.services || []).map(function (e) { return cols.map(function (k) { return quote(e[k]); }).join(","); })).join("\r\n");
    var blob = new Blob(["\uFEFF", csv], {type:"text/csv;charset=utf-8"});
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = (car.year + "-" + car.model).replace(/[^a-z0-9_-]+/gi, "_") + "-service-history.csv";
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }
  function enhanceLedger() {
    var root = document.getElementById("ledgerContent");
    if (!root || root.dataset.historyEnhanced === "1") return;
    root.dataset.historyEnhanced = "1";
    var original = window.renderLedger;
    if (typeof original !== "function") return;
    window.renderLedger = function () {
      original();
      var db = read(), car = currentCar(db);
      if (!car) return;
      var rows = root.querySelectorAll("tbody tr");
      var entries = (car.services || []).slice().sort(function (a,b) { return new Date(b.date) - new Date(a.date); });
      rows.forEach(function (row, index) {
        var entry = entries[index];
        if (!entry || row.querySelector(".ledger-actions")) return;
        var cell = row.cells[2];
        if (!cell) return;
        var meta = "";
        if (entry.parts) meta += '<div class="td-note"><b>Parts / fluids:</b> ' + esc(entry.parts) + '</div>';
        if (entry.invoiceRef) meta += '<div class="td-note"><b>Invoice ref:</b> ' + esc(entry.invoiceRef) + '</div>';
        if (entry.basis && entry.basis !== "Not specified") meta += '<div class="td-note"><b>Basis:</b> ' + esc(entry.basis) + '</div>';
        if (entry.followup) meta += '<div class="td-note"><b>Follow-up:</b> ' + esc(entry.followup) + '</div>';
        if (meta) cell.insertAdjacentHTML("beforeend", meta);
        cell.insertAdjacentHTML("beforeend", '<div class="ledger-actions"><button class="btn btn-ghost btn-sm" data-history-edit="' + esc(entry.id) + '">Edit record</button><button class="btn btn-ghost btn-sm" data-history-delete="' + esc(entry.id) + '">Delete</button></div>');
        cell.querySelector("[data-history-edit]").onclick = function () { editRecord(entry.id); };
        cell.querySelector("[data-history-delete]").onclick = function () { deleteRecord(entry.id); };
      });
      var header = root.querySelector(".panel-top");
      if (header && !header.querySelector("[data-csv-export]")) {
        var btn = document.createElement("button");
        btn.className = "btn btn-ghost btn-sm"; btn.textContent = "Export CSV"; btn.dataset.csvExport = "1"; btn.onclick = exportCSV;
        header.appendChild(btn);
      }
    };
  }
  function exportFullBackup() {
    var payload = {
      format: "cavallino-logbook-backup",
      version: 1,
      exportedAt: new Date().toISOString(),
      stores: {
        garage: read(),
        specialist: localStorage.getItem("cavallino_specialist_center_v1") ? JSON.parse(localStorage.getItem("cavallino_specialist_center_v1")) : null,
        inspections: localStorage.getItem("cavallino_ppi_v1") ? JSON.parse(localStorage.getItem("cavallino_ppi_v1")) : null
      }
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], {type:"application/json"});
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = "cavallino-logbook-full-backup-" + new Date().toISOString().slice(0,10) + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function validFullBackup(p) {
    if (!p || p.format !== "cavallino-logbook-backup" || p.version !== 1 || !p.stores || !p.stores.garage || !Array.isArray(p.stores.garage.cars)) return false;
    if (!p.stores.garage.cars.every(function (c) { return c && typeof c.id === "string" && typeof c.model === "string" && Array.isArray(c.services) && c.services.every(function (e) { return e && typeof e.id === "string"; }); })) return false;
    var sc = p.stores.specialist;
    if (sc !== null && (!sc || !Array.isArray(sc.items) || !Array.isArray(sc.records) || !sc.items.every(function (n) { return n && typeof n.id === "string"; }))) return false;
    var ppi = p.stores.inspections;
    if (ppi !== null && (!ppi || ppi.version !== 1 || !Array.isArray(ppi.items))) return false;
    if (ppi && !ppi.items.every(function (r) {
      return r && typeof r.id === "string" && typeof r.vehicle === "string" && typeof r.date === "string" && Array.isArray(r.checks) &&
        (r.photos === undefined || (Array.isArray(r.photos) && r.photos.length <= 8 && r.photos.every(function (photo) {
          return photo && typeof photo.name === "string" && typeof photo.caption === "string" &&
            typeof photo.dataUrl === "string" && photo.dataUrl.length <= 900000 &&
            /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(photo.dataUrl);
        })));
    })) return false;
    return true;
  }
  function importFullBackup(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var payload;
      try { payload = JSON.parse(String(reader.result || "")); } catch (e) { alert("That file is not valid JSON."); return; }
      if (!validFullBackup(payload)) { alert("This does not look like a valid Cavallino Logbook full backup. No data was changed."); return; }
      if (!confirm("Restore this backup? It will replace the Garage, Specialist Center and Pre-Purchase records currently stored in this browser. Export a current backup first if you want to keep today's data.")) return;
      try {
        localStorage.setItem(KEY, JSON.stringify(payload.stores.garage));
        if (payload.stores.specialist) localStorage.setItem("cavallino_specialist_center_v1", JSON.stringify(payload.stores.specialist));
        else localStorage.removeItem("cavallino_specialist_center_v1");
        if (payload.stores.inspections) localStorage.setItem("cavallino_ppi_v1", JSON.stringify(payload.stores.inspections));
        else localStorage.removeItem("cavallino_ppi_v1");
        alert("Backup restored. The app will reload to reopen the restored records.");
        window.location.reload();
      } catch (e) { alert("Restore could not finish because browser storage is full or unavailable. Existing data may be incomplete; reload and check your backup."); }
    };
    reader.onerror = function () { alert("Could not read that backup file."); };
    reader.readAsText(file);
  }
  function addBackupControls() {
    var header = document.querySelector("#view-garage .garage-header");
    if (!header || header.querySelector("[data-full-backup]")) return;
    var actions = document.createElement("div");
    actions.style.display = "flex"; actions.style.gap = "8px"; actions.style.flexWrap = "wrap";
    var exportBtn = document.createElement("button");
    exportBtn.className = "btn btn-ghost btn-sm"; exportBtn.textContent = "Export Full Backup";
    exportBtn.dataset.fullBackup = "1"; exportBtn.onclick = exportFullBackup;
    var importBtn = document.createElement("button");
    importBtn.className = "btn btn-ghost btn-sm"; importBtn.textContent = "Restore Backup";
    var input = document.createElement("input");
    input.type = "file"; input.accept = "application/json,.json"; input.hidden = true;
    input.onchange = function () { if (input.files && input.files[0]) importFullBackup(input.files[0]); input.value = ""; };
    importBtn.onclick = function () { input.click(); };
    actions.appendChild(exportBtn); actions.appendChild(importBtn); actions.appendChild(input);
    header.appendChild(actions);
  }
  function addMaintenanceReminder() {
    var db = read(), car = currentCar(db);
    if (!car) { alert("Select a vehicle in the Garage first."); return; }
    var title = prompt("What maintenance or inspection should be tracked?");
    if (title === null || !title.trim()) return;
    var dueDate = prompt("Due date (YYYY-MM-DD), if known. Leave blank if not applicable.", "");
    if (dueDate === null) return;
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) { alert("Enter the date as YYYY-MM-DD."); return; }
    var dueOdo = prompt("Due odometer in miles, if known. Leave blank if not applicable.", "");
    if (dueOdo === null) return;
    if (dueOdo.trim() && (!/^\d+$/.test(dueOdo.trim()) || Number(dueOdo) < 0)) { alert("Enter a valid odometer reading."); return; }
    if (!dueDate && !dueOdo.trim()) { alert("Enter at least a due date or due odometer."); return; }
    var notes = prompt("Source / workshop recommendation / notes (optional). Do not treat this as a factory interval unless documented.", "") || "";
    car.maintenanceReminders = Array.isArray(car.maintenanceReminders) ? car.maintenanceReminders : [];
    car.maintenanceReminders.push({id:"rem-" + Date.now().toString(36) + Math.random().toString(36).slice(2,6), title:title.trim(), dueDate:dueDate.trim(), dueOdo:dueOdo.trim() ? Number(dueOdo) : null, notes:notes, status:"open", createdAt:new Date().toISOString()});
    if (write(db) && typeof window.renderAll === "function") window.renderAll();
  }
  function updateReminder(id, action) {
    var db = read(), car = currentCar(db);
    if (!car) return;
    car.maintenanceReminders = Array.isArray(car.maintenanceReminders) ? car.maintenanceReminders : [];
    var item = car.maintenanceReminders.find(function (r) { return r.id === id; });
    if (!item) return;
    if (action === "complete") {
      item.status = "complete"; item.completedAt = new Date().toISOString(); item.completedOdo = Number(car.mileage || 0);
    } else if (action === "delete") {
      if (!confirm("Delete this reminder?")) return;
      car.maintenanceReminders = car.maintenanceReminders.filter(function (r) { return r.id !== id; });
    }
    if (write(db) && typeof window.renderAll === "function") window.renderAll();
  }
  function enhanceSchedule() {
    var root = document.getElementById("scheduleContent");
    if (!root || root.dataset.remindersEnhanced === "1" || typeof window.renderSchedule !== "function") return;
    root.dataset.remindersEnhanced = "1";
    var original = window.renderSchedule;
    window.renderSchedule = function () {
      original();
      var db = read(), car = currentCar(db);
      if (!car) return;
      var items = Array.isArray(car.maintenanceReminders) ? car.maintenanceReminders : [];
      var today = new Date().toISOString().slice(0,10), mileage = Number(car.mileage || 0);
      var rows = items.slice().sort(function (a,b) { return (a.status === "complete") - (b.status === "complete") || String(a.dueDate || "9999").localeCompare(String(b.dueDate || "9999")); }).map(function (r) {
        var overdue = r.status !== "complete" && ((r.dueDate && r.dueDate <= today) || (r.dueOdo != null && mileage >= Number(r.dueOdo)));
        var due = [];
        if (r.dueDate) due.push("Date: " + esc(r.dueDate));
        if (r.dueOdo != null) due.push("Odometer: " + esc(r.dueOdo.toLocaleString("en-US")) + " mi");
        var status = r.status === "complete" ? "Completed" : overdue ? "Due" : "Upcoming";
        var actions = r.status === "complete" ? "" : '<button class="btn btn-ghost btn-sm" data-reminder-complete="' + esc(r.id) + '">Mark complete</button> ';
        return '<div class="sched-row"><div><div class="sched-name">' + esc(r.title) + '</div><div class="sched-detail">' + esc(due.join(" · ") || "No due target") + (r.notes ? " · " + esc(r.notes) : "") + '</div></div><div>' + (overdue ? '<span class="pill pill-warn">Due</span>' : '<span class="pill pill-none">' + status + '</span>') + '<div style="margin-top:6px">' + actions + '<button class="btn btn-ghost btn-sm" data-reminder-delete="' + esc(r.id) + '">Delete</button></div></div></div>';
      }).join("");
      var panel = document.createElement("div");
      panel.className = "panel";
      panel.innerHTML = '<div class="panel-top"><div><h2>My Maintenance Reminders</h2><div class="panel-meta">Your own dates, mileage targets and workshop recommendations — not factory intervals</div></div><button class="btn btn-brass btn-sm" data-reminder-add="1">+ Add Reminder</button></div>' + (rows || '<p class="sc-meta">No personal reminders yet. Add one using a date or odometer target supplied by your workshop or service documentation.</p>') + '<p class="sc-meta">A reminder is user-entered planning information. Confirm service requirements for the exact VIN, model year, market and variant with Ferrari documentation or a qualified specialist.</p>';
      root.insertBefore(panel, root.firstChild);
      panel.querySelector("[data-reminder-add]").onclick = addMaintenanceReminder;
      panel.querySelectorAll("[data-reminder-complete]").forEach(function (btn) { btn.onclick = function () { updateReminder(btn.dataset.reminderComplete, "complete"); }; });
      panel.querySelectorAll("[data-reminder-delete]").forEach(function (btn) { btn.onclick = function () { updateReminder(btn.dataset.reminderDelete, "delete"); }; });
    };
  }
  window.CavallinoServiceHistory = {edit:editRecord, remove:deleteRecord, exportCSV:exportCSV};
  var originalSave = window.saveService;
  if (typeof originalSave === "function") {
    window.saveService = function () { originalSave(); enhanceSavedRecord(); if (typeof window.renderAll === "function") window.renderAll(); };
  }
  var originalOpen = window.openAddSvc;
  if (typeof originalOpen === "function") {
    window.openAddSvc = function () {
      originalOpen();
      ["s-parts","s-invoice","s-followup"].forEach(function (id) { var el=document.getElementById(id); if(el)el.value=""; });
      var basis=document.getElementById("s-basis"); if(basis)basis.value="Not specified";
    };
  }
  addFields();
  addBackupControls();
  enhanceLedger();
  enhanceSchedule();
  if (typeof window.renderLedger === "function") window.renderLedger();
  document.addEventListener("click", function (e) { if (e.target && e.target.closest && e.target.closest('[onclick="openAddSvc()"]')) setTimeout(addFields, 0); });
})();
