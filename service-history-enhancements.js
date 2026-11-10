/* Cavallino Logbook — Service History Enhancements
 * Backward-compatible extension of the existing cavallino_v2 garage records.
 * Adds supporting-document metadata, safe editing/deletion and CSV export.
 */
(function () {
  "use strict";
  var KEY = "cavallino_v2";
  var fields = [
    ["s-parts", "Parts / fluids / part numbers", "Record only documented details, quantities and part numbers."],
    ["s-invoice", "Invoice / document reference", "Invoice number or your own file reference."],
    ["s-basis", "Record basis", ""],
    ["s-followup", "Recommended follow-up", "Record the workshop's recommendation and any stated due date or mileage."]
  ];
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
        cell.insertAdjacentHTML("beforeend", '<div class="ledger-actions"><button class="btn btn-ghost btn-sm" onclick="CavallinoServiceHistory.edit(\\'' + esc(entry.id) + '\\')">Edit record</button><button class="btn btn-ghost btn-sm" onclick="CavallinoServiceHistory.remove(\\'' + esc(entry.id) + '\\')">Delete</button></div>');
      });
      var header = root.querySelector(".panel-top");
      if (header && !header.querySelector("[data-csv-export]")) {
        var btn = document.createElement("button");
        btn.className = "btn btn-ghost btn-sm"; btn.textContent = "Export CSV"; btn.dataset.csvExport = "1"; btn.onclick = exportCSV;
        header.appendChild(btn);
      }
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
  enhanceLedger();
  if (typeof window.renderLedger === "function") window.renderLedger();
  document.addEventListener("click", function (e) { if (e.target && e.target.closest && e.target.closest('[onclick="openAddSvc()"]')) setTimeout(addFields, 0); });
})();
