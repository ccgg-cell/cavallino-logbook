/* Cavallino Logbook — Specialist Knowledge Center
 * Separate storage namespace; never writes Garage/Service Log data.
 * Technical claims require model/VIN applicability and a traceable source.
 */
(function () {
  "use strict";
  const STORE = "cavallino_specialist_center_v1";
  const TODAY = () => new Date().toISOString().slice(0, 10);
  const seed = [
    {id:"sc-001",title:"Confirm vehicle identity before applying technical guidance",category:"Verification",scope:"All models",type:"Specialist process",status:"General guidance",summary:"Confirm VIN, model designation, model year, market, engine, transmission and relevant production variant before using any model-specific procedure or interval.",source:"Vehicle identification and manufacturer documentation should be checked for the individual car.",sourceUrl:"",updated:TODAY()},
    {id:"sc-002",title:"Keep evidence with every maintenance record",category:"Documentation",scope:"All models",type:"Specialist process",status:"General guidance",summary:"Record date, odometer, workshop, technician, work performed, parts and part numbers where known, invoices, photographs, test results and follow-up recommendations.",source:"Cavallino Logbook documentation standard.",sourceUrl:"",updated:TODAY()},
    {id:"sc-003",title:"Separate factory requirements from specialist recommendations",category:"Service planning",scope:"All models",type:"Editorial standard",status:"General guidance",summary:"Label each maintenance item as factory-published, campaign/recall, legal requirement, or independent specialist recommendation. Do not present an estimate or common practice as a factory interval.",source:"Cavallino Logbook editorial and verification standard.",sourceUrl:"",updated:TODAY()}
  ];
  let queryText = "", selectedCategory = "";
  let data;
  try { data = JSON.parse(localStorage.getItem(STORE) || "null") || {}; } catch (_) { data = {}; }
  if (!Array.isArray(data.items)) data.items = seed.slice();
  if (!Array.isArray(data.records)) data.records = [];
  data.items = data.items.map(x => ({sourceUrl:"", ...x}));
  function persist() {
    try { localStorage.setItem(STORE, JSON.stringify(data)); return true; }
    catch (_) { alert("The browser could not save this data. Export a backup and check available browser storage."); return false; }
  }
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function el(id) { return document.getElementById(id); }
  function safeUrl(value) {
    try { const u = new URL(value); return (u.protocol === "https:" || u.protocol === "http:") ? u.href : ""; }
    catch (_) { return ""; }
  }
  function renderItems() {
    const list = el("scItems"); if (!list) return;
    const search = queryText.toLowerCase(), category = selectedCategory;
    const items = data.items.filter(x => (!category || x.category === category) &&
      (!search || [x.title,x.scope,x.category,x.summary,x.source,x.type,x.status].join(" ").toLowerCase().includes(search)));
    list.innerHTML = items.length ? items.map(x => {
      const url = safeUrl(x.sourceUrl);
      return `<article class="sc-item"><div class="sc-item-head"><strong>${esc(x.title)}</strong><span class="pill pill-none">${esc(x.status || "Needs verification")}</span></div>
      <div class="sc-meta">${esc(x.scope || "All models")} · ${esc(x.category)} · ${esc(x.type)}</div><p>${esc(x.summary)}</p>
      <div class="sc-source">Source: ${esc(x.source || "Not supplied")} · Updated: ${esc(x.updated || "—")} ${url ? '· <a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Open source</a>' : ""}</div></article>`;
    }).join("") : '<div class="empty"><h3>No matching notes</h3><p>Try another search or add a new knowledge note.</p></div>';
  }
  function renderRecords() {
    const target = el("scRecords"); if (!target) return;
    target.innerHTML = data.records.length ? '<h3>Saved inspection notes</h3>' + data.records.slice().reverse().map(r =>
      `<article class="sc-item"><strong>${esc(r.vehicle)} — ${esc(r.area)}</strong><div class="sc-meta">${esc(r.date)} · ${esc(r.odo || "Odometer not entered")}</div><p>${esc(r.notes)}</p></article>`).join("") : "";
  }
  function downloadBackup() {
    const payload = {version:1,exportedAt:new Date().toISOString(),items:data.items,records:data.records};
    const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href=url; a.download="cavallino-specialist-center.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function validImport(obj) {
    return !!obj && obj.version === 1 && Array.isArray(obj.items) && Array.isArray(obj.records) &&
      obj.items.every(x => x && typeof x.title === "string" && x.title.trim() && typeof x.summary === "string" && x.summary.trim()) &&
      obj.records.every(x => x && typeof x.notes === "string" && x.notes.trim());
  }
  function render() {
    const root = el("specialistCenterContent"); if (!root) return;
    root.innerHTML = `
      <div class="panel">
        <div class="panel-top"><div><h2>Ferrari Specialist Knowledge Center</h2><div class="panel-meta">Reference notes, inspection guidance and workshop records</div></div>
          <div><button class="btn btn-ghost btn-sm" id="scImportBtn">Import backup</button> <button class="btn btn-ghost btn-sm" id="scExport">Export backup</button><input id="scImportFile" type="file" accept="application/json,.json" hidden></div>
        </div>
        <div class="sc-notice"><strong>Accuracy standard:</strong> Starter library contains general documentation guidance only. It does not assert model-specific defects, factory intervals, part numbers or repair procedures. Confirm every technical claim against the correct VIN, model year, market and authoritative source. Browser-local data does not sync to other devices.</div>
        <div class="field-group"><div class="field"><label>Search knowledge</label><input id="scSearch" placeholder="Search model, system, topic or keyword"></div>
          <div class="field"><label>Category</label><select id="scCategory"><option value="">All categories</option><option>Verification</option><option>Documentation</option><option>Service planning</option><option>Engine</option><option>Transmission</option><option>Chassis</option><option>Electrical</option><option>Body & interior</option><option>Diagnostics</option></select></div></div>
        <div id="scItems"></div>
      </div>
      <div class="panel"><div class="panel-top"><div><h2>Official Reference Portals</h2><div class="panel-meta">Open the source directly; access and coverage vary</div></div></div>
        <p><strong>Ferrari Technical Information:</strong> Factory service literature, workshop procedures, wiring diagrams, technical bulletins, maintenance, parts and campaign information. Subscription may be required.</p>
        <p><a href="https://techinfo.ferrari.com/" target="_blank" rel="noopener noreferrer">Ferrari TechInfo portal</a> · <a href="https://techinfo.ferrari.com/recall" target="_blank" rel="noopener noreferrer">Ferrari VIN campaign lookup</a></p>
        <p><strong>United States safety recalls:</strong> NHTSA VIN lookup and model-year recall data. A clean result is not proof that every manufacturer campaign or historical issue has been addressed.</p>
        <p><a href="https://www.nhtsa.gov/recalls" target="_blank" rel="noopener noreferrer">NHTSA recall lookup</a> · <a href="https://www.nhtsa.gov/nhtsa-datasets-and-apis" target="_blank" rel="noopener noreferrer">NHTSA datasets and API documentation</a></p>
      </div>
      <div class="panel"><div class="panel-top"><div><h2>Add a Knowledge Note</h2><div class="panel-meta">Unverified submissions stay clearly marked until reviewed</div></div></div>
        <div class="field-group"><div class="field"><label>Title *</label><input id="scTitle" maxlength="160" placeholder="e.g. F430 cooling system inspection notes"></div><div class="field"><label>Model / scope</label><input id="scScope" maxlength="120" placeholder="e.g. F430, 2005–2009"></div></div>
        <div class="field-group"><div class="field"><label>Category</label><select id="scNewCategory"><option>Verification</option><option>Documentation</option><option>Service planning</option><option>Engine</option><option>Transmission</option><option>Chassis</option><option>Electrical</option><option>Body & interior</option><option>Diagnostics</option></select></div><div class="field"><label>Guidance type</label><select id="scType"><option>Factory documentation</option><option>Campaign / recall</option><option>Independent specialist recommendation</option><option>Observed issue — needs verification</option><option>Diagnostic procedure — needs verification</option><option>General process</option></select></div></div>
        <div class="field-group"><div class="field"><label>Note / procedure summary *</label><textarea id="scSummary" maxlength="5000" placeholder="Describe the finding or guidance. Include conditions, limits and verification status."></textarea></div></div>
        <div class="field-group"><div class="field"><label>Source / reference title</label><input id="scSource" maxlength="240" placeholder="Document title, bulletin number, invoice or specialist"></div><div class="field"><label>Source URL (optional)</label><input id="scSourceUrl" type="url" placeholder="https://..."></div></div>
        <div class="modal-actions"><button class="btn btn-brass" id="scAdd">Save Knowledge Note</button></div>
      </div>
      <div class="panel"><div class="panel-top"><div><h2>Diagnostic & Inspection Notes</h2><div class="panel-meta">Record observations without treating an unconfirmed diagnosis as fact</div></div></div>
        <div class="field-group"><div class="field"><label>Vehicle</label><input id="scVehicle" maxlength="180" placeholder="Model, year and VIN (if appropriate)"></div><div class="field"><label>Date</label><input id="scDate" type="date" value="${TODAY()}"></div></div>
        <div class="field-group"><div class="field"><label>Odometer</label><input id="scOdo" maxlength="40" placeholder="Mileage"></div><div class="field"><label>System / area</label><input id="scArea" maxlength="120" placeholder="Engine, suspension, electrical..."></div></div>
        <div class="field-group"><div class="field"><label>Observation, test results and next action</label><textarea id="scRecord" maxlength="8000" placeholder="Symptoms, conditions, fault codes, measurements, tests performed, results and recommended follow-up."></textarea></div></div>
        <div class="modal-actions"><button class="btn btn-brass" id="scSaveRecord">Save Inspection Note</button></div><div id="scRecords"></div>
      </div>`;
    el("scSearch").value=queryText; el("scCategory").value=selectedCategory;
    renderItems(); renderRecords();
    el("scSearch").oninput=()=>{queryText=el("scSearch").value;renderItems();};
    el("scCategory").onchange=()=>{selectedCategory=el("scCategory").value;renderItems();};
    el("scAdd").onclick=()=>{
      const title=el("scTitle").value.trim(), summary=el("scSummary").value.trim();
      if(!title||!summary){alert("Please enter a title and note summary.");return;}
      const rawUrl=el("scSourceUrl").value.trim(), sourceUrl=rawUrl?safeUrl(rawUrl):"";
      if(rawUrl&&!sourceUrl){alert("Please enter a valid http or https source URL.");return;}
      data.items.push({id:"sc-"+Date.now(),title,scope:el("scScope").value.trim()||"Unspecified",category:el("scNewCategory").value,type:el("scType").value,status:"User-added — verify source",summary,source:el("scSource").value.trim()||"Not supplied",sourceUrl,updated:TODAY()});
      if(persist()){render();if(typeof toast==="function")toast("Knowledge note saved");}
    };
    el("scSaveRecord").onclick=()=>{
      const notes=el("scRecord").value.trim(); if(!notes){alert("Please enter the inspection observation or test results.");return;}
      const date=el("scDate").value;
      if(!date){alert("Please select the inspection date.");return;}
      data.records.push({vehicle:el("scVehicle").value.trim()||"Vehicle not specified",date,odo:el("scOdo").value.trim(),area:el("scArea").value.trim()||"Unspecified",notes});
      if(persist()){render();if(typeof toast==="function")toast("Inspection note saved");}
    };
    el("scExport").onclick=downloadBackup;
    el("scImportBtn").onclick=()=>el("scImportFile").click();
    el("scImportFile").onchange=async event=>{
      const file=event.target.files && event.target.files[0]; if(!file)return;
      try {
        const imported=JSON.parse(await file.text());
        if(!validImport(imported)){alert("This file does not match the supported Specialist Center backup format. Nothing was changed.");return;}
        if(!confirm("Import and merge these notes with the current browser data? Existing records will be kept; duplicate IDs will be skipped."))return;
        const ids=new Set(data.items.map(x=>x.id));
        imported.items.forEach(x=>{if(!ids.has(x.id)){data.items.push({...x,sourceUrl:safeUrl(x.sourceUrl||"")});ids.add(x.id);}});
        data.records=data.records.concat(imported.records);
        if(persist()){render();if(typeof toast==="function")toast("Backup imported");}
      } catch(_){alert("Could not read this backup file. Nothing was changed.");}
      finally {event.target.value="";}
    };
  }
  window.renderSpecialistCenter=render;
  document.addEventListener("DOMContentLoaded",render);
})();
