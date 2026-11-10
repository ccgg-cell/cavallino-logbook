/* Cavallino Logbook — Pre-Purchase Inspection
 * General-purpose condition checklist; not factory certification.
 * Isolated localStorage namespace.
 */
(function(){
"use strict";
const KEY="cavallino_ppi_v1";
const groups=[
["Identity & paperwork",["VIN/chassis identity agrees with paperwork","Title, registration and ownership documents reviewed","Service invoices and mileage chronology reviewed","Ferrari campaign status checked with Ferrari; NHTSA checked separately","Keys, manuals, tools and supplied equipment inventoried"]],
["Body & exterior",["Panel fit, paint consistency and prior repairs assessed","Structure and underbody examined by qualified personnel","Corrosion, water ingress and underbody condition assessed","Glass, lamps, seals, trim and exterior hardware checked","Wheels, tires, tire age and damage recorded"]],
["Cabin & electrical",["Seats, trim, carpets and water ingress checked","Switchgear, instruments, warning lamps and controls operated","Battery, charging and electrical supply assessed","Climate control, windows, locks and accessories operated"]],
["Mechanical & diagnostics",["Cold-start behavior, leaks, noises, smoke and temperature assessed","Cooling system, leaks and fan operation assessed","Visible fluid leaks documented; specifications verified separately","Transmission, clutch and shift behavior assessed for fitted type","Driveline, mounts, bearings and vibration/noise assessed","Brake system, pedal feel, wear and warnings assessed","Steering, suspension, joints, dampers and tire wear assessed","Diagnostic scan completed; codes and test results saved"]],
["Road test & decision",["Road test completed safely or reason not completed recorded","Steering, braking, ride, vibration and noises assessed","Model/year/VIN concerns checked against authoritative sources","Further tests, repair estimates and open questions documented","Buyer decision, conditions and specialist sign-off recorded"]]
];
const ratings=["not_inspected","good","monitor","attention","not_applicable"];
const labels={"not_inspected":"Not inspected","good":"No concern observed","monitor":"Monitor / review","attention":"Attention / diagnosis","not_applicable":"Not applicable"};
let db={version:1,items:[]};
try{const x=JSON.parse(localStorage.getItem(KEY)||"null");if(x&&x.version===1&&Array.isArray(x.items))db=x;}catch(e){}
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function save(){try{localStorage.setItem(KEY,JSON.stringify(db));return true;}catch(e){alert("Could not save. Export a backup and check browser storage.");return false;}}
function validBackup(o){return !!o&&o.version===1&&Array.isArray(o.items)&&o.items.every(r=>r&&typeof r.id==="string"&&typeof r.vehicle==="string"&&typeof r.date==="string"&&Array.isArray(r.checks)&&r.checks.every(c=>c&&typeof c.key==="string"&&ratings.includes(c.rating)&&typeof c.notes==="string"&&typeof c.evidence==="string"));}
function renderList(){
 const box=document.getElementById("ppiSaved");if(!box)return;
 box.innerHTML=db.items.length?db.items.slice().reverse().map(r=>'<article class="sc-item"><div class="sc-item-head"><strong>'+esc(r.year)+' '+esc(r.vehicle)+' — '+esc(r.date)+'</strong><span class="pill pill-none">'+esc(r.overall)+'</span></div><div class="sc-meta">VIN: '+esc(r.vin||"Not entered")+' · Odometer: '+esc(r.odo||"Not entered")+' · Inspector: '+esc(r.inspector||"Not entered")+'</div><p>'+esc(r.summary||"No summary.")+'</p><button class="btn btn-ghost btn-sm" data-print="'+esc(r.id)+'">Print report</button> <button class="btn btn-ghost btn-sm" data-delete="'+esc(r.id)+'">Delete</button></article>').join(""):'<p class="sc-meta">No saved inspections yet.</p>';
 box.querySelectorAll("[data-print]").forEach(b=>b.onclick=()=>printReport(b.dataset.print));
 box.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>{if(confirm("Delete this report?")){db.items=db.items.filter(x=>x.id!==b.dataset.delete);if(save())renderList();}});
}
function printReport(id){
 const r=db.items.find(x=>x.id===id);if(!r)return;
 const w=window.open("","_blank");if(!w){alert("Allow pop-ups to print the report.");return;}
 let html='<!doctype html><html><head><meta charset="utf-8"><title>Cavallino PPI Report</title><style>body{font:13px Arial;margin:25px;color:#222}h1{font-size:22px}h2{font-size:16px;border-bottom:1px solid #999;margin-top:22px}table{width:100%;border-collapse:collapse;font-size:11px}td,th{border:1px solid #bbb;padding:6px;text-align:left;vertical-align:top}.meta{line-height:1.8}.note{border:1px solid #999;padding:10px;margin-top:20px;font-size:11px}@media print{body{margin:12mm}}</style></head><body><h1>Cavallino Logbook — Pre-Purchase Inspection</h1><p>Independent condition record — not a Ferrari factory certification.</p><div class="meta"><b>Vehicle:</b> '+esc(r.year)+' '+esc(r.vehicle)+'<br><b>VIN:</b> '+esc(r.vin)+'<br><b>Market:</b> '+esc(r.market)+'<br><b>Variant:</b> '+esc(r.variant)+'<br><b>Odometer:</b> '+esc(r.odo)+'<br><b>Date:</b> '+esc(r.date)+'<br><b>Inspector:</b> '+esc(r.inspector)+'<br><b>Seller:</b> '+esc(r.seller)+'<br><b>Assessment:</b> '+esc(r.overall)+'</div><h2>Executive summary</h2><p>'+esc(r.summary)+'</p>';
 groups.forEach((g,gi)=>{
  html+='<h2>'+esc(g[0])+'</h2><table><tr><th>Item</th><th>Rating</th><th>Findings</th><th>Evidence reference</th></tr>';
  g[1].forEach((label,i)=>{const c=r.checks.find(x=>x.key===gi+"-"+i)||{};html+='<tr><td>'+esc(label)+'</td><td>'+esc(labels[c.rating]||"Not inspected")+'</td><td>'+esc(c.notes)+'</td><td>'+esc(c.evidence)+'</td></tr>';});
  html+='</table>';
 });
 html+='<div class="note"><b>Important:</b> This is a recording template, not a substitute for a qualified Ferrari specialist examination. Ratings reflect only observations entered. Verify model-specific procedures, specifications, campaign status and safety-critical findings for the exact VIN, year, market and variant. “Not inspected” does not mean satisfactory.</div><p><b>Inspector sign-off:</b> '+esc(r.signoff)+'</p><script>window.onload=()=>window.print();</script></body></html>';
 w.document.write(html);w.document.close();
}
function render(){
 const root=document.getElementById("prePurchaseContent");if(!root)return;
 let checklist="";
 groups.forEach((g,gi)=>{
  checklist+='<section class="sc-item"><h3>'+esc(g[0])+'</h3>';
  g[1].forEach((label,i)=>{const key=gi+"-"+i;checklist+='<div class="field-group" style="align-items:flex-start"><div class="field" style="flex:2"><label>'+esc(label)+'</label><select data-rate="'+key+'">'+ratings.map(v=>'<option value="'+v+'">'+labels[v]+'</option>').join("")+'</select></div><div class="field"><label>Findings / notes</label><input data-notes="'+key+'" maxlength="1000" placeholder="Observed condition or test result"></div><div class="field"><label>Evidence reference</label><input data-evidence="'+key+'" maxlength="300" placeholder="Photo filename, invoice, scan ID"></div></div>';});
  checklist+='</section>';
 });
 root.innerHTML='<div class="panel"><div class="panel-top"><div><h2>Ferrari Pre-Purchase Inspection</h2><div class="panel-meta">Structured buyer assessment and printable report</div></div><div><button class="btn btn-ghost btn-sm" id="ppiImport">Import backup</button> <button class="btn btn-ghost btn-sm" id="ppiExport">Export backup</button><input id="ppiImportFile" type="file" accept="application/json,.json" hidden></div></div><div class="sc-notice"><strong>Important:</strong> General recording template only — not a factory checklist, warranty, valuation or pass/fail certification. Mark items “Not inspected” unless actually examined. Use an independent Ferrari specialist and verify technical details against the exact VIN, year, market and variant.</div><div class="field-group"><div class="field"><label>Vehicle / model *</label><input id="ppiVehicle" placeholder="e.g. Ferrari 360 Modena"></div><div class="field"><label>Year</label><input id="ppiYear" maxlength="4"></div></div><div class="field-group"><div class="field"><label>VIN</label><input id="ppiVin"></div><div class="field"><label>Market</label><input id="ppiMarket" placeholder="US / North America"></div></div><div class="field-group"><div class="field"><label>Transmission / variant</label><input id="ppiVariant" placeholder="Manual, F1, Spider, etc."></div><div class="field"><label>Odometer</label><input id="ppiOdo" placeholder="Mileage and units"></div></div><div class="field-group"><div class="field"><label>Inspection date *</label><input id="ppiDate" type="date" value="'+new Date().toISOString().slice(0,10)+'"></div><div class="field"><label>Inspector / shop</label><input id="ppiInspector"></div></div><div class="field-group"><div class="field"><label>Seller / listing</label><input id="ppiSeller"></div><div class="field"><label>Overall assessment</label><select id="ppiOverall"><option>Draft report</option><option>Further inspection required</option><option>Attention items identified</option><option>No major issues observed in inspected areas</option></select></div></div><div class="field-group"><div class="field"><label>Executive summary / buyer considerations</label><textarea id="ppiSummary" maxlength="4000"></textarea></div></div>'+checklist+'<div class="modal-actions"><button class="btn btn-brass" id="ppiSave">Save PPI report</button></div></div><div class="panel"><h2>Saved inspection reports</h2><div id="ppiSaved"></div></div>';
 document.getElementById("ppiImport").onclick=()=>document.getElementById("ppiImportFile").click();
 document.getElementById("ppiImportFile").onchange=async event=>{
  const file=event.target.files&&event.target.files[0];if(!file)return;
  try{
   const imported=JSON.parse(await file.text());
   if(!validBackup(imported)){alert("Unsupported or invalid PPI backup. Nothing was changed.");return;}
   if(confirm("Merge these inspections with the current browser data? Existing reports will be kept.")){
    const ids=new Set(db.items.map(x=>x.id));imported.items.forEach(x=>{if(!ids.has(x.id)){db.items.push(x);ids.add(x.id);}});
    if(save())renderList();
   }
  }catch(e){alert("Could not read this backup. Nothing was changed.");}
  finally{event.target.value="";}
 };
 document.getElementById("ppiExport").onclick=()=>{const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"});const a=document.createElement("a");const u=URL.createObjectURL(blob);a.href=u;a.download="cavallino-ppi-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);};
 document.getElementById("ppiSave").onclick=()=>{
  const vehicle=document.getElementById("ppiVehicle").value.trim(),date=document.getElementById("ppiDate").value;if(!vehicle||!date){alert("Enter vehicle and inspection date.");return;}
  const checks=[];groups.forEach((g,gi)=>g[1].forEach((label,i)=>{const key=gi+"-"+i;checks.push({key,rating:root.querySelector('[data-rate="'+key+'"]').value,notes:root.querySelector('[data-notes="'+key+'"]').value.trim(),evidence:root.querySelector('[data-evidence="'+key+'"]').value.trim()});}));
  db.items.push({id:"ppi-"+Date.now(),vehicle,year:document.getElementById("ppiYear").value.trim(),vin:document.getElementById("ppiVin").value.trim(),market:document.getElementById("ppiMarket").value.trim(),variant:document.getElementById("ppiVariant").value.trim(),odo:document.getElementById("ppiOdo").value.trim(),date,inspector:document.getElementById("ppiInspector").value.trim(),seller:document.getElementById("ppiSeller").value.trim(),overall:document.getElementById("ppiOverall").value,summary:document.getElementById("ppiSummary").value.trim(),checks,signoff:""});
  if(save())renderList();
 };
 renderList();
}
window.renderPrePurchaseInspection=render;
if(typeof document!=="undefined")render();
if(typeof module!=="undefined"&&module.exports)module.exports={groups,ratings,validBackup};
})();
