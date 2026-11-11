/* Cavallino Logbook — structured maintenance, issue and campaign reference register.
 * Browser-local evidence index. It does not supply factory intervals or determine VIN applicability.
 */
(function () {
  "use strict";
  const STORE = "cavallino_reference_register_v1";
  const rootId = "referenceRegisterContent";
  const today = () => new Date().toISOString().slice(0, 10);
  const $ = id => document.getElementById(id);
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const safeUrl = value => {
    try { const u = new URL(String(value || "")); return (u.protocol === "http:" || u.protocol === "https:") ? u.href : ""; }
    catch (_) { return ""; }
  };
  const uid = () => "ref-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  let data = {version:1, entries:[]}, query = "", filter = "All", editingId = null;
  try {
    const stored = JSON.parse(localStorage.getItem(STORE) || "null");
    if (stored && Array.isArray(stored.entries)) data.entries = stored.entries.filter(validEntry);
  } catch (_) {}
  function validEntry(x) {
    return !!x && typeof x === "object" &&
      ["id","title","recordType","model","year","market","variant","applicability","system","summary","evidenceType","sourceTitle","sourceUrl","publicationDate","checkedDate","status","reviewer","notes","createdAt","updatedAt"].every(k => typeof x[k] === "string") &&
      !!x.id.trim() && !!x.title.trim() && !!x.summary.trim() &&
      ["Factory maintenance requirement","Manufacturer campaign / recall","Government safety recall","Independent specialist recommendation","Known-issue research","Owner observation"].includes(x.recordType) &&
      ["Draft — not verified","Source recorded — applicability pending","Verified for stated applicability","Superseded"].includes(x.status) &&
      (!x.sourceUrl || !!safeUrl(x.sourceUrl));
  }
  function persist() {
    try { localStorage.setItem(STORE, JSON.stringify(data)); return true; }
    catch (_) { alert("The reference register could not be saved. Browser storage may be full. Export a backup and remove large local files if needed."); return false; }
  }
  function downloadBackup() {
    const payload = {version:1, exportedAt:new Date().toISOString(), entries:data.entries};
    const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href=url; a.download="cavallino-reference-register.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function renderEntries() {
    const target = $("rrEntries"); if (!target) return;
    const rows = data.entries.filter(x => {
      const hay = [x.title,x.recordType,x.model,x.year,x.market,x.variant,x.applicability,x.system,x.summary,x.evidenceType,x.sourceTitle,x.status,x.reviewer,x.notes].join(" ").toLowerCase();
      return (filter === "All" || x.recordType === filter) && (!query || hay.includes(query));
    }).sort((a,b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
    target.innerHTML = rows.length ? rows.map(x => {
      const url = safeUrl(x.sourceUrl);
      return `<article class="rr-entry">
        <div class="rr-entry-head"><div><span class="rr-type">${esc(x.recordType)}</span><h3>${esc(x.title)}</h3></div><span class="rr-status">${esc(x.status)}</span></div>
        <div class="rr-meta"><strong>Applicability:</strong> ${esc([x.model,x.year,x.market,x.variant].filter(Boolean).join(" · ") || "Not specified")}<br>
        <strong>VIN / build notes:</strong> ${esc(x.applicability || "Not specified")} · <strong>System:</strong> ${esc(x.system || "Not specified")}</div>
        <p>${esc(x.summary)}</p>
        <div class="rr-meta"><strong>Evidence:</strong> ${esc(x.evidenceType || "Not specified")} · <strong>Source:</strong> ${esc(x.sourceTitle || "Not supplied")} ${url ? '· <a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Open source</a>' : ""}</div>
        <div class="rr-meta">Publication: ${esc(x.publicationDate || "Not recorded")} · Checked: ${esc(x.checkedDate || "Not recorded")} · Reviewer: ${esc(x.reviewer || "Not recorded")}</div>
        ${x.notes ? '<p class="rr-notes"><strong>Limitations / notes:</strong> '+esc(x.notes)+'</p>' : ""}
        <div class="rr-actions"><button class="btn btn-ghost btn-sm" data-edit="${esc(x.id)}">Edit</button><button class="btn btn-ghost btn-sm" data-delete="${esc(x.id)}">Delete</button></div>
      </article>`;
    }).join("") : '<div class="empty"><h3>No reference entries yet</h3><p>Add a sourced maintenance requirement, campaign, known-issue research note or specialist recommendation. Keep unverified material marked as such.</p></div>';
    const count = $("rrCount"); if (count) count.textContent = rows.length + " of " + data.entries.length + " entries";
  }
  function clearForm() {
    editingId = null;
    ["rrTitle","rrModel","rrYear","rrMarket","rrVariant","rrApplicability","rrSystem","rrSummary","rrEvidence","rrSource","rrUrl","rrPublication","rrReviewer","rrNotes"].forEach(id => { if ($(id)) $(id).value = ""; });
    $("rrType").value = "Independent specialist recommendation";
    $("rrStatus").value = "Draft — not verified";
    $("rrChecked").value = today();
    $("rrSave").textContent = "Save reference entry";
    $("rrCancel").hidden = true;
  }
  function editEntry(id) {
    const x = data.entries.find(v => v.id === id); if (!x) return;
    editingId = id;
    const fields = {rrTitle:"title",rrModel:"model",rrYear:"year",rrMarket:"market",rrVariant:"variant",rrApplicability:"applicability",rrSystem:"system",rrSummary:"summary",rrEvidence:"evidenceType",rrSource:"sourceTitle",rrUrl:"sourceUrl",rrPublication:"publicationDate",rrChecked:"checkedDate",rrReviewer:"reviewer",rrNotes:"notes",rrType:"recordType",rrStatus:"status"};
    Object.entries(fields).forEach(([id,key]) => { if ($(id)) $(id).value = x[key] || ""; });
    $("rrSave").textContent = "Update reference entry"; $("rrCancel").hidden = false;
    $("rrTitle").scrollIntoView({behavior:"smooth",block:"center"}); $("rrTitle").focus();
  }
  function saveEntry() {
    const title = $("rrTitle").value.trim(), summary = $("rrSummary").value.trim(), rawUrl = $("rrUrl").value.trim();
    if (!title || !summary) { alert("Enter both a title and a summary."); return; }
    const sourceUrl = rawUrl ? safeUrl(rawUrl) : "";
    if (rawUrl && !sourceUrl) { alert("Source links must be valid HTTP or HTTPS URLs."); return; }
    const old = data.entries.find(x => x.id === editingId);
    const entry = {
      id: editingId || uid(), title, recordType:$("rrType").value,
      model:$("rrModel").value.trim(), year:$("rrYear").value.trim(), market:$("rrMarket").value.trim(),
      variant:$("rrVariant").value.trim(), applicability:$("rrApplicability").value.trim(),
      system:$("rrSystem").value.trim(), summary, evidenceType:$("rrEvidence").value.trim(),
      sourceTitle:$("rrSource").value.trim(), sourceUrl,
      publicationDate:$("rrPublication").value.trim(), checkedDate:$("rrChecked").value.trim(),
      status:$("rrStatus").value, reviewer:$("rrReviewer").value.trim(), notes:$("rrNotes").value.trim(),
      createdAt:old ? old.createdAt : new Date().toISOString(), updatedAt:new Date().toISOString()
    };
    if (!validEntry(entry)) { alert("Please review the entry fields and verification status."); return; }
    if (old) data.entries = data.entries.map(x => x.id === editingId ? entry : x); else data.entries.push(entry);
    if (persist()) { clearForm(); renderEntries(); if (typeof toast === "function") toast(old ? "Reference updated" : "Reference saved"); }
  }
  function importSpecialistResearch() {
    let specialist;
    try { specialist = JSON.parse(localStorage.getItem("cavallino_specialist_center_v1") || "null"); }
    catch (_) { specialist = null; }
    const notes = specialist && Array.isArray(specialist.items) ? specialist.items : [];
    const modelNotes = notes.filter(x => x && typeof x.id === "string" && typeof x.scope === "string" && /^Ferrari /.test(x.scope));
    if (!modelNotes.length) { alert("No model-specific Specialist Center notes were found on this device. Open Specialist Center first, then try again."); return; }
    const ids = new Set(data.entries.map(x => x.id));
    let added = 0;
    modelNotes.forEach(x => {
      const id = "specialist-" + x.id;
      if (ids.has(id)) return;
      const source = String(x.source || "");
      const isRecall = /NHTSA|recall/i.test(source) && /Roma|22V-536/i.test(x.title + " " + x.summary);
      const isCampaign = /campaign|technical information bulletin|TSB/i.test(x.title + " " + source);
      const recordType = isRecall ? "Government safety recall" : isCampaign ? "Manufacturer campaign / recall" : "Known-issue research";
      const entry = {
        id, title:String(x.title || "Ferrari research note"), recordType,
        model:String(x.scope || ""), year:"", market:"", variant:"",
        applicability:String(x.scope || "Confirm exact VIN, year, market and variant"),
        system:String(x.category || ""), summary:String(x.summary || ""),
        evidenceType:String(x.type || "Secondary-source research"),
        sourceTitle:source, sourceUrl:safeUrl(x.sourceUrl),
        publicationDate:"", checkedDate:today(), status:"Source recorded — applicability pending",
        reviewer:"", notes:"Imported from the on-device Specialist Center. Original note status: " + String(x.status || "Not stated") + ". This is a research prompt, not a factory specification or proof of VIN applicability. Confirm source, current campaign status and individual vehicle applicability before acting.",
        createdAt:new Date().toISOString(), updatedAt:new Date().toISOString()
      };
      if (validEntry(entry)) { data.entries.push(entry); ids.add(id); added++; }
    });
    if (added && persist()) { filter = "All"; query = ""; renderEntries(); alert(added + " source-linked model research entries imported. They remain marked as applicability pending."); }
    else if (!added) alert("All available model research notes are already in the Reference Register.");
  }
  function render() {
    const root = $(rootId); if (!root) return;
    root.innerHTML = `
      <div class="panel">
        <div class="panel-top"><div><h2>Maintenance &amp; Evidence Register</h2><div class="panel-meta">A structured record of what is known, where it came from and what still needs verification</div></div>
          <div><button class="btn btn-ghost btn-sm" id="rrSeedImport">Import specialist research</button> <button class="btn btn-ghost btn-sm" id="rrImportBtn">Import JSON</button> <button class="btn btn-ghost btn-sm" id="rrExport">Export JSON</button><input id="rrImportFile" type="file" accept="application/json,.json" hidden></div>
        </div>
        <div class="rr-notice"><strong>Important:</strong> This is an evidence register, not a live Ferrari technical database. It contains no pre-filled service intervals or repair specifications. A record marked verified means its author has recorded a source and applicability review; it is not an independent certification. Confirm VIN, model year, market, variant and current factory information before acting. Safety-critical work belongs with a qualified Ferrari specialist.</div>
        <div class="field-group"><div class="field"><label>Search entries</label><input id="rrSearch" placeholder="Model, VIN range, system, source or keyword"></div><div class="field"><label>Record type</label><select id="rrFilter"><option>All</option><option>Factory maintenance requirement</option><option>Manufacturer campaign / recall</option><option>Government safety recall</option><option>Independent specialist recommendation</option><option>Known-issue research</option><option>Owner observation</option></select></div></div>
        <div class="rr-count" id="rrCount"></div><div id="rrEntries"></div>
      </div>
      <div class="panel">
        <div class="panel-top"><div><h2>Official verification portals</h2><div class="panel-meta">Check the exact vehicle directly with the manufacturer and government sources</div></div></div>
        <p><strong>Ferrari TechInfo:</strong> factory service literature, workshop procedures, wiring diagrams, technical bulletins, maintenance information, parts and campaign information. Access to some documentation requires a subscription.</p>
        <p><a href="https://techinfo.ferrari.com/" target="_blank" rel="noopener noreferrer">Open Ferrari TechInfo</a> · <a href="https://forms.ferrari.com/content/forms/af/ferrari/af/dws/recall-campaign.html" target="_blank" rel="noopener noreferrer">Ferrari recall campaign VIN check</a></p>
        <p><strong>U.S. safety recalls:</strong> NHTSA's VIN lookup can show certain unrepaired safety recalls. It does not show completed recalls, some recent or older recalls, all specialty-manufacturer recalls, manufacturer service campaigns or international recalls. A zero result is not proof that all campaigns are complete.</p>
        <p><a href="https://www.nhtsa.gov/recalls" target="_blank" rel="noopener noreferrer">Open NHTSA recall lookup</a></p>
      </div>
      <div class="panel">
        <div class="panel-top"><div><h2 id="rrFormHeading">Add a reference entry</h2><div class="panel-meta">Separate factory data, campaigns, specialist advice, known-issue research and owner observations</div></div></div>
        <div class="field-group"><div class="field"><label>Title *</label><input id="rrTitle" maxlength="180" placeholder="e.g. Annual maintenance schedule — exact variant"></div><div class="field"><label>Record type</label><select id="rrType"><option>Factory maintenance requirement</option><option>Manufacturer campaign / recall</option><option>Government safety recall</option><option selected>Independent specialist recommendation</option><option>Known-issue research</option><option>Owner observation</option></select></div></div>
        <div class="field-group"><div class="field"><label>Model family</label><input id="rrModel" maxlength="100" placeholder="e.g. 360 Modena"></div><div class="field"><label>Model year(s)</label><input id="rrYear" maxlength="80" placeholder="e.g. 2000–2004"></div><div class="field"><label>Market</label><input id="rrMarket" maxlength="80" placeholder="e.g. North America"></div></div>
        <div class="field-group"><div class="field"><label>Variant / drivetrain</label><input id="rrVariant" maxlength="140" placeholder="e.g. F1 transmission, Spider"></div><div class="field"><label>VIN / build applicability</label><input id="rrApplicability" maxlength="500" placeholder="Exact VIN range, engine range or confirmation needed"></div></div>
        <div class="field-group"><div class="field"><label>System / component</label><input id="rrSystem" maxlength="120" placeholder="Engine, transmission, brakes..."></div><div class="field"><label>Evidence class</label><input id="rrEvidence" maxlength="160" placeholder="Factory manual, bulletin, NHTSA notice, named specialist"></div></div>
        <div class="field-group"><div class="field"><label>Finding / requirement / recommendation *</label><textarea id="rrSummary" maxlength="6000" placeholder="State what the source actually says, applicability, limits and what remains uncertain. Do not turn an inspection clue into a repair instruction."></textarea></div></div>
        <div class="field-group"><div class="field"><label>Source document / title</label><input id="rrSource" maxlength="240" placeholder="Document title, bulletin number or named source"></div><div class="field"><label>Source URL</label><input id="rrUrl" type="url" placeholder="https://..."></div></div>
        <div class="field-group"><div class="field"><label>Publication / revision date</label><input id="rrPublication" type="date"></div><div class="field"><label>Date checked</label><input id="rrChecked" type="date" value="${today()}"></div><div class="field"><label>Reviewer</label><input id="rrReviewer" maxlength="120" placeholder="Name / specialist shop"></div></div>
        <div class="field-group"><div class="field"><label>Verification status</label><select id="rrStatus"><option>Draft — not verified</option><option>Source recorded — applicability pending</option><option>Verified for stated applicability</option><option>Superseded</option></select></div><div class="field"><label>Limitations / notes</label><textarea id="rrNotes" maxlength="3000" placeholder="Unresolved VIN questions, conflicting sources, review notes..."></textarea></div></div>
        <div class="modal-actions"><button class="btn btn-ghost" id="rrCancel" hidden>Cancel edit</button><button class="btn btn-brass" id="rrSave">Save reference entry</button></div>
      </div>`;
    $("rrSearch").value = query; $("rrFilter").value = filter;
    renderEntries();
    $("rrSearch").oninput = () => { query = $("rrSearch").value.toLowerCase().trim(); renderEntries(); };
    $("rrFilter").onchange = () => { filter = $("rrFilter").value; renderEntries(); };
    $("rrSave").onclick = saveEntry;
    $("rrCancel").onclick = clearForm;
    $("rrExport").onclick = downloadBackup;
    $("rrSeedImport").onclick = importSpecialistResearch;
    $("rrImportBtn").onclick = () => $("rrImportFile").click();
    $("rrEntries").onclick = event => {
      const edit = event.target.closest("[data-edit]"), del = event.target.closest("[data-delete]");
      if (edit) editEntry(edit.dataset.edit);
      if (del) {
        const id = del.dataset.delete, item = data.entries.find(x => x.id === id);
        if (item && confirm("Delete this reference entry? This cannot be undone unless you have an export backup.")) {
          data.entries = data.entries.filter(x => x.id !== id);
          if (persist()) renderEntries();
        }
      }
    };
    $("rrImportFile").onchange = async event => {
      const file = event.target.files && event.target.files[0]; if (!file) return;
      try {
        const imported = JSON.parse(await file.text());
        if (!imported || imported.version !== 1 || !Array.isArray(imported.entries) || !imported.entries.every(validEntry)) {
          alert("This is not a valid Cavallino Reference Register backup. Nothing was changed."); return;
        }
        if (!confirm("Merge these entries with the current register? Existing IDs will be kept and duplicates skipped.")) return;
        const ids = new Set(data.entries.map(x => x.id));
        imported.entries.forEach(x => { if (!ids.has(x.id)) { data.entries.push(x); ids.add(x.id); } });
        if (persist()) renderEntries();
      } catch (_) { alert("Could not read this JSON backup. Nothing was changed."); }
      finally { event.target.value = ""; }
    };
  }
  window.renderReferenceRegister = render;
  if (document.readyState !== "loading") render(); else document.addEventListener("DOMContentLoaded", render);
})();