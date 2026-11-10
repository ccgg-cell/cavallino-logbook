/* Cavallino Logbook — Specialist Knowledge Center
 * Separate storage namespace; does not modify existing garage/service records.
 * Model-specific claims and service intervals must be source-verified before publication.
 */
(function () {
  "use strict";
  const STORE = "cavallino_specialist_center_v1";
  const seed = [
    {id:"sc-001",title:"Confirm vehicle identity before applying technical guidance",category:"Verification",scope:"All models",type:"Specialist process",status:"General guidance",summary:"Confirm VIN, model designation, model year, market, engine, transmission and relevant production variant before using any model-specific procedure or interval.",source:"Vehicle identification and manufacturer documentation should be checked for the individual car.",updated:"2026-11-10"},
    {id:"sc-002",title:"Keep evidence with every maintenance record",category:"Documentation",scope:"All models",type:"Specialist process",status:"General guidance",summary:"Record date, odometer, workshop, technician, work performed, parts and part numbers where known, invoices, photographs, test results and any follow-up recommendations.",source:"Cavallino Logbook documentation standard.",updated:"2026-11-10"},
    {id:"sc-003",title:"Separate factory requirements from specialist recommendations",category:"Service planning",scope:"All models",type:"Editorial standard",status:"General guidance",summary:"Label each maintenance item as factory-published, campaign/recall, legal requirement, or independent specialist recommendation. Do not present an estimate or common practice as a factory interval.",source:"Cavallino Logbook editorial and verification standard.",updated:"2026-11-10"}
  ];
  let data;
  try { data = JSON.parse(localStorage.getItem(STORE)) || {}; } catch (_) { data = {}; }
  if (!Array.isArray(data.items)) data.items = seed.slice();
  if (!Array.isArray(data.records)) data.records = [];
  function persist(){ localStorage.setItem(STORE, JSON.stringify(data)); }
  function esc(v){ return String(v == null ? "" : v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function el(id){ return document.getElementById(id); }
  function render(){
    const root = el("specialistCenterContent");
    if (!root) return;
    root.innerHTML = `
      <div class="panel">
        <div class="panel-top"><div><h2>Ferrari Specialist Knowledge Center</h2><div class="panel-meta">Verified reference notes, inspection guidance and workshop records</div></div><button class="btn btn-ghost btn-sm" id="scExport">Export Center Data</button></div>
        <div class="sc-notice"><strong>Accuracy standard:</strong> This initial library contains general documentation guidance only. It does not assert model-specific defects, factory service intervals, part numbers or repair procedures. Verify every technical claim against the correct VIN, model year, market and authoritative source.</div>
        <div class="field-group">
          <div class="field"><label>Search knowledge</label><input id="scSearch" placeholder="Search model, system, topic or keyword"></div>
          <div class="field"><label>Category</label><select id="scCategory"><option value="">All categories</option><option>Verification</option><option>Documentation</option><option>Service planning</option><option>Engine</option><option>Transmission</option><option>Chassis</option><option>Electrical</option><option>Body & interior</option><option>Diagnostics</option></select></div>
        </div>
        <div id="scItems"></div>
      </div>
      <div class="panel">
        <div class="panel-top"><div><h2>Add a Knowledge Note</h2><div class="panel-meta">Add sourced notes; unverified submissions remain clearly marked</div></div></div>
        <div class="field-group"><div class="field"><label>Title *</label><input id="scTitle" placeholder="e.g. F430 cooling system inspection notes"></div><div class="field"><label>Model / scope</label><input id="scScope" placeholder="e.g. F430, 2005–2009"></div></div>
        <div class="field-group"><div class="field"><label>Category</label><select id="scNewCategory"><option>Verification</option><option>Documentation</option><option>Service planning</option><option>Engine</option><option>Transmission</option><option>Chassis</option><option>Electrical</option><option>Body & interior</option><option>Diagnostics</option></select></div><div class="field"><label>Guidance type</label><select id="scType"><option>Factory documentation</option><option>Campaign / recall</option><option>Independent specialist recommendation</option><option>Observed issue — needs verification</option><option>Diagnostic procedure — needs verification</option><option>General process</option></select></div></div>
        <div class="field-group"><div class="field"><label>Note / procedure summary *</label><textarea id="scSummary" placeholder="Describe the finding or guidance. Include conditions, limits and verification status."></textarea></div></div>
        <div class="field-group"><div class="field"><label>Source / reference</label><input id="scSource" placeholder="Document title, bulletin number, URL, invoice or specialist"></div></div>
        <div class="modal-actions"><button class="btn btn-brass" id="scAdd">Save Knowledge Note</button></div>
      </div>
      <div class="panel">
        <div class="panel-top"><div><h2>Diagnostic & Inspection Notes</h2><div class="panel-meta">Record observations without treating an unconfirmed diagnosis as fact</div></div></div>
        <div class="field-group"><div class="field"><label>Vehicle</label><input id="scVehicle" placeholder="Model, year and VIN (if appropriate)"></div><div class="field"><label>Date</label><input id="scDate" type="date" value="${new Date().toISOString().slice(0,10)}"></div></div>
        <div class="field-group"><div class="field"><label>Odometer</label><input id="scOdo" placeholder="Mileage"></div><div class="field"><label>System / area</label><input id="scArea" placeholder="Engine, suspension, electrical..."></div></div>
        <div class="field-group"><div class="field"><label>Observation, test results and next action</label><textarea id="scRecord" placeholder="Symptoms, conditions, fault codes, measurements, tests performed, results and recommended follow-up."></textarea></div></div>
        <div class="modal-actions"><button class="btn btn-brass" id="scSaveRecord">Save Inspection Note</button></div>
        <div id="scRecords"></div>
      </div>`;
    const list = el("scItems");
    const search = (el("scSearch").value || "").toLowerCase();
    const category = el("scCategory").value;
    const items = data.items.filter(x => (!category || x.category === category) && (!search || [x.title,x.scope,x.category,x.summary,x.source,x.type].join(" ").toLowerCase().includes(search)));
    list.innerHTML = items.length ? items.map(x => `<article class="sc-item"><div class="sc-item-head"><strong>${esc(x.title)}</strong><span class="pill pill-none">${esc(x.status || "Needs verification")}</span></div><div class="sc-meta">${esc(x.scope || "All models")} · ${esc(x.category)} · ${esc(x.type)}</div><p>${esc(x.summary)}</p><div class="sc-source">Source: ${esc(x.source || "Not supplied")} · Updated: ${esc(x.updated || "—")}</div></article>`).join("") : '<div class="empty"><h3>No matching notes</h3><p>Try another search or add a new knowledge note.</p></div>';
    el("scRecords").innerHTML = data.records.length ? '<h3>Saved inspection notes</h3>' + data.records.slice().reverse().map(r => `<article class="sc-item"><strong>${esc(r.vehicle)} — ${esc(r.area)}</strong><div class="sc-meta">${esc(r.date)} · ${esc(r.odo || "Odometer not entered")}</div><p>${esc(r.notes)}</p></article>`).join("") : "";
    el("scSearch").oninput = render;
    el("scCategory").onchange = render;
    el("scAdd").onclick = () => {
      const title=el("scTitle").value.trim(), summary=el("scSummary").value.trim();
      if(!title || !summary){ alert("Please enter a title and note summary."); return; }
      data.items.push({id:"sc-"+Date.now(),title,scope:el("scScope").value.trim()||"Unspecified",category:el("scNewCategory").value,type:el("scType").value,status:"User-added — verify source",summary,source:el("scSource").value.trim()||"Not supplied",updated:new Date().toISOString().slice(0,10)});
      persist(); render(); if(typeof toast==="function") toast("Knowledge note saved");
    };
    el("scSaveRecord").onclick = () => {
      const notes=el("scRecord").value.trim();
      if(!notes){ alert("Please enter the inspection observation or test results."); return; }
      data.records.push({vehicle:el("scVehicle").value.trim()||"Vehicle not specified",date:el("scDate").value,odo:el("scOdo").value.trim(),area:el("scArea").value.trim()||"Unspecified",notes});
      persist(); render(); if(typeof toast==="function") toast("Inspection note saved");
    };
    el("scExport").onclick = () => {
      const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),...data},null,2)],{type:"application/json"});
      const url=URL.createObjectURL(blob), a=document.createElement("a"); a.href=url; a.download="cavallino-specialist-center.json"; a.click(); URL.revokeObjectURL(url);
    };
  }
  window.renderSpecialistCenter = render;
  document.addEventListener("DOMContentLoaded", render);
})();