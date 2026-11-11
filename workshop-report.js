/* Cavallino Logbook — customer-facing workshop report generator.
 * Read-only report assembly from locally stored vehicle, service and originality records.
 */
(function(){
 "use strict";
 const $=id=>document.getElementById(id);
 const esc=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const today=()=>new Date().toISOString().slice(0,10);
 function app(){return window.CavallinoApp&&window.CavallinoApp.getState?window.CavallinoApp.getState():null;}
 function selected(){const a=app();return a&&a.cars.find(c=>c.id===window.CavallinoApp.getSelectedId())||a&&a.cars[0]||null;}
 function render(){
  const root=$("workshopReportContent");if(!root)return;
  const a=app(),cars=a&&Array.isArray(a.cars)?a.cars:[];
  root.innerHTML=`<div class="panel">
   <div class="panel-top"><div><h2>Professional Workshop Report</h2><div class="panel-meta">Prepare a customer-facing vehicle condition and service-history report</div></div></div>
   <div class="sc-notice"><strong>Report scope:</strong> This report compiles records already entered in this browser. It does not independently inspect the vehicle, verify invoices, certify originality or determine roadworthiness. Review every detail before giving the report to a customer.</div>
   ${cars.length?`<div class="field-group"><div class="field"><label>Vehicle</label><select id="wrCar">${cars.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.year||"")+' '+esc(c.model||"Vehicle")+' — '+esc(c.nick||"")+'</option>').join("")}</select></div><div class="field"><label>Report date</label><input id="wrDate" type="date" value="${today()}"></div></div>
   <div class="field-group"><div class="field"><label>Workshop / specialist name</label><input id="wrShop" maxlength="160" placeholder="Workshop name"></div><div class="field"><label>Prepared by</label><input id="wrAuthor" maxlength="120" placeholder="Technician / advisor"></div></div>
   <div class="field-group"><div class="field"><label>Customer / recipient</label><input id="wrCustomer" maxlength="160" placeholder="Customer name (optional)"></div><div class="field"><label>Report reference</label><input id="wrRef" maxlength="80" placeholder="Job number / RO reference"></div></div>
   <div class="field-group"><div class="field"><label>Workshop observations and recommendations</label><textarea id="wrNotes" maxlength="5000" placeholder="Enter observations, work completed, items requiring attention and recommended follow-up. Distinguish inspected items from items not inspected."></textarea></div></div>
   <div class="field-group"><div class="field"><label><input type="checkbox" id="wrServices" checked style="width:auto"> Include recorded service history</label></div><div class="field"><label><input type="checkbox" id="wrOriginality" checked style="width:auto"> Include recorded originality / provenance notes</label></div></div>
   <p class="rr-meta">The report uses the selected vehicle's current local Garage record, its service entries and recorded originality fields. It does not change or save over those records.</p>
   <div class="modal-actions"><button class="btn btn-brass" id="wrPrint">Generate &amp; print report</button></div>
   `:`<div class="empty"><h3>No vehicle in Garage</h3><p>Add a vehicle before creating a workshop report.</p></div>`}
  </div>`;
  if(!cars.length)return;
  const current=selected();if(current)$("wrCar").value=current.id;
  $("wrPrint").onclick=printReport;
 }
 function printReport(){
  const a=app();if(!a)return;
  const car=a.cars.find(c=>c.id===$("wrCar").value);if(!car){alert("Select a vehicle.");return;}
  const date=$("wrDate").value||today(),services=Array.isArray(car.services)?car.services.slice().sort((x,y)=>String(y.date||"").localeCompare(String(x.date||""))):[];
  const orig=a.orig&&a.orig[car.id]||{};
  const serviceHtml=$("wrServices").checked?(services.length?'<h2>Recorded service history</h2><table><thead><tr><th>Date</th><th>Odometer</th><th>Work recorded</th><th>Workshop</th><th>Cost</th></tr></thead><tbody>'+services.map(s=>'<tr><td>'+esc(s.date)+'</td><td>'+esc(s.odo||"—")+'</td><td><strong>'+esc(s.type)+'</strong><br>'+esc(s.notes||"")+'</td><td>'+esc(s.shop||"—")+'</td><td>'+(Number(s.cost)?new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(Number(s.cost)):"—")+'</td></tr>').join("")+'</tbody></table>':'<h2>Recorded service history</h2><p>No service entries are recorded for this vehicle.</p>'):"";
  const origHtml=$("wrOriginality").checked?'<h2>Recorded originality / provenance</h2><table><tbody>'+Object.entries(orig).map(([k,v])=>'<tr><th>'+esc(k)+'</th><td>'+esc(v)+'</td></tr>').join("")+'</tbody></table>':"";
  const w=window.open("","_blank");if(!w){alert("Your browser blocked the report window. Allow pop-ups for this app and try again.");return;}
  const notes=esc($("wrNotes").value).replace(/\n/g,"<br>");
  const doc='<!doctype html><html><head><meta charset="utf-8"><title>Cavallino Workshop Report</title><style>body{font:14px/1.55 Arial,sans-serif;color:#211e1a;max-width:900px;margin:35px auto;padding:0 24px}header{border-bottom:3px solid #8b6d3f;padding-bottom:16px;margin-bottom:24px}h1{font:30px Georgia,serif;margin:0}h2{font:20px Georgia,serif;margin:28px 0 10px;border-bottom:1px solid #b8a27e;padding-bottom:6px}.muted{color:#665f55}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px}.item{padding:7px 0;border-bottom:1px solid #ddd}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{text-align:left;vertical-align:top;padding:8px;border-bottom:1px solid #ddd}th{background:#f3f0e9}.notice{margin-top:30px;padding:12px;border:1px solid #b8a27e;font-size:12px;color:#514b42}.notes{white-space:normal}@media print{body{margin:0;max-width:none;padding:0 10mm}button{display:none}}</style></head><body><header><div class="muted">CAVALLINO LOGBOOK · WORKSHOP DOCUMENTATION</div><h1>Vehicle Workshop Report</h1><div class="muted">Report date: '+esc(date)+' · Reference: '+esc($("wrRef").value||"—")+'</div></header><div class="grid"><div class="item"><b>Vehicle</b><br>'+esc(car.year)+" "+esc(car.model)+'</div><div class="item"><b>Nickname / registration</b><br>'+esc(car.nick||"—")+'</div><div class="item"><b>VIN</b><br>'+esc(car.vin||"Not recorded")+'</div><div class="item"><b>Odometer</b><br>'+esc(car.mileage||"Not recorded")+'</div><div class="item"><b>Workshop</b><br>'+esc($("wrShop").value||"—")+'</div><div class="item"><b>Prepared by</b><br>'+esc($("wrAuthor").value||"—")+'</div><div class="item"><b>Customer</b><br>'+esc($("wrCustomer").value||"—")+'</div></div><h2>Workshop observations &amp; recommendations</h2><div class="notes">'+(notes||"No additional observations entered.")+'</div>'+serviceHtml+origHtml+'<div class="notice"><b>Important limitations:</b> This document is compiled from information entered in Cavallino Logbook on this device. It is not an independent inspection certificate, warranty, valuation, authenticity certification or statement of roadworthiness. Historical records and originality descriptions have not been independently authenticated. Only items explicitly described as inspected should be treated as inspected. Verify technical requirements, recalls and VIN applicability with Ferrari documentation and a qualified specialist.</div><p class="muted">Generated by Cavallino Logbook. Not affiliated with Ferrari S.p.A.</p><script>window.onload=function(){window.print();};<\/script></body></html>';
  w.document.open();w.document.write(doc);w.document.close();
 }
 window.renderWorkshopReport=render;
 if(document.readyState!=="loading")render();else document.addEventListener("DOMContentLoaded",render);
})();
