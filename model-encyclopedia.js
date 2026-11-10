/* Cavallino Logbook — Ferrari Model Encyclopedia
 * Editorial model identification and inspection context, not factory service data.
 */
(function () {
  "use strict";
  var models = [
    {
      id:"308", name:"308 GTB / GTS", era:"1975–1985", layout:"Mid-engine V8 · transverse engine family",
      variants:"GTB Berlinetta; GTS targa; early carburettor cars; GTBi/GTSi fuel-injected cars; GTB/GTS Quattrovalvole (QV). Italian-market 208 derivatives are a separate displacement family.",
      identity:"Identify body style, engine/fuel-system generation, market specification and (for early GTBs) fibreglass vetroresina versus steel body. Dry-/wet-sump details vary by variant and market.",
      focus:"Documented belt and major-service history; chassis and body corrosion (including the steel chassis beneath fibreglass panels); fuse-box and electrical condition; fuel-system and cold-start behavior. These are inspection prompts, not a diagnosis.",
      noteIds:["308-001"], history:"https://fullysorted.com/research/models/ferrari/308-gtb-gts",
      sources:[["Ferrari model history and buyer research","https://fullysorted.com/research/models/ferrari/308-gtb-gts"],["Hagerty 308 buyer guide","https://www.hagerty.co.uk/articles/buyers-guide-ferrari-308/"]]
    },
    {
      id:"328", name:"328 GTB / GTS", era:"1985–1989", layout:"Mid-engine V8 · transverse engine family",
      variants:"328 GTB Berlinetta; 328 GTS targa. Production and equipment details can differ by market and build date.",
      identity:"Confirm GTB versus GTS, model year, market, emissions equipment and whether ABS is fitted; late-production chassis/build details matter when ordering parts or applying procedures.",
      focus:"Review timing-belt and valve-service invoices; inspect corrosion, electrical/fuse-board condition, fuel delivery and gearbox behavior cold and warm. Confirm exact factory schedule from the car's own documentation.",
      noteIds:["328-001"], history:"https://fullysorted.com/research/models/ferrari/328",
      sources:[["Ferrari model history and buyer research","https://fullysorted.com/research/models/ferrari/328"],["Magneto 308/328 buyer guide","https://www.magnetomagazine.com/articles/1973-1989-ferrari-308-328-buying-guide-from-magneto-magazine/"]]
    },
    {
      id:"348", name:"348", era:"1989–1995", layout:"Mid-engine V8 · longitudinal engine / transverse gearbox",
      variants:"Early tb Berlinetta and ts targa; later GTB and GTS; full Spider; market-specific Serie Speciale; Challenge and GT Competizione derivatives.",
      identity:"Distinguish tb/ts from later GTB/GTS and Spider, plus early/late engine-management and chassis revisions. Do not assume all 348s share identical parts or calibration.",
      focus:"Review belt-service evidence; assess gear selection, clutch and transfer-gear behavior; inspect suspension, spring platforms and climate-control electronics. Cold and warm road tests are useful when conducted by a specialist.",
      noteIds:["348-001"], history:"https://fullysorted.com/research/models/ferrari/348",
      sources:[["Ferrari model history and buyer research","https://fullysorted.com/research/models/ferrari/348"],["Auto Express 348 buyer guide","https://www.autoexpress.co.uk/ferrari/104978/ferrari-348-buying-guide-and-review-1989-1994"]]
    },
    {
      id:"f355", name:"F355", era:"1994–1999", layout:"Mid-engine V8 · longitudinal engine",
      variants:"Berlinetta coupe; GTS targa; Spider convertible; 355 F1 electrohydraulic paddle-shift cars from 1997; Challenge and Serie Fiorano variants.",
      identity:"Confirm body, production year, engine-management generation, transmission type and any Challenge/Fiorano specification. Spider model-year references can differ between sources and markets.",
      focus:"Seek detailed timing-belt service invoices and exact scope; review valve-guide/oil-consumption history; inspect exhaust manifolds and catalyst condition. Use compression/leak-down or other tests only as directed by a qualified specialist.",
      noteIds:["f355-001","f355-002","f355-003"], history:"https://fullysorted.com/research/models/ferrari/f355",
      sources:[["Ferrari model history and buyer research","https://fullysorted.com/research/models/ferrari/f355"],["Hagerty F355 buyer guide","https://www.hagerty.co.uk/articles/buying-guide-ferrari-f355-1994-99/"],["Car and Driver F355 buyer guide","https://www.caranddriver.com/news/a15356898/ferrari-f355-buyers-guide-what-you-need-to-know-about-values-problems-and-more/"]]
    },
    {
      id:"360", name:"360 Modena / Spider", era:"1999–2005", layout:"Mid-engine V8 · aluminium spaceframe",
      variants:"360 Modena coupe; 360 Spider; Challenge Stradale special series. Modena and Spider offered six-speed gated manual or F1 automated manual; Challenge Stradale was F1-only.",
      identity:"Confirm Modena/Spider/Challenge Stradale, manual versus F1, market and build/VIN details. Check factory campaign status independently; a printed VIN or engine range is only a screening clue.",
      focus:"Verify belt-service scope and records; inspect F1 clutch/hydraulic operation where fitted; check suspension ball joints; request Ferrari confirmation of applicable camshaft-variator campaign history.",
      noteIds:["360-001","360-002","360-003"], history:"https://fullysorted.com/research/models/ferrari/360",
      sources:[["Ferrari model history and buyer research","https://fullysorted.com/research/models/ferrari/360"],["evo 360 history and buying guide","https://www.evo.co.uk/ferrari/360/19057/ferrari-360-modena-history-specs-and-buying-guide"],["Ferrari TechInfo and campaign portal","https://techinfo.ferrari.com/recall"]]
    },
    {
      id:"f430", name:"F430", era:"2004–2009", layout:"Mid-engine V8 · aluminium spaceframe · E-Diff",
      variants:"F430 Berlinetta; F430 Spider; 430 Scuderia; Scuderia Spider 16M; gated six-speed manual or F1 automated manual on applicable road variants.",
      identity:"Identify standard versus Scuderia/16M, coupe versus Spider, original transmission type and any documented conversion. Carbon-ceramic brake fitment and Spider roof equipment are specification-dependent.",
      focus:"Specialist inspection of exhaust manifolds and brackets; review F1 pump, actuator and clutch records where fitted; check engine mounts, suspension joints, roof operation and VIN-specific campaigns. Do not infer clutch condition from mileage alone.",
      noteIds:["f430-001"], history:"https://fullysorted.com/research/models/ferrari/f430",
      sources:[["Ferrari model history and buyer research","https://fullysorted.com/research/models/ferrari/f430"],["Octane Files F430 common problems","https://www.octanefiles.com/guides/ferrari-f430-common-problems"],["Car Collector International F430 buyer guide","https://www.carcollectorinternational.com/research/buyers-guides/ferrari/f430"]]
    },
    {
      id:"458", name:"458 Italia", era:"2009–2015", layout:"Mid-engine V8 · dual-clutch transmission",
      variants:"458 Italia coupe; 458 Spider; 458 Speciale; 458 Speciale A. Distinguish standard and special-series body, equipment and calibration.",
      identity:"Confirm exact variant, model year, market and VIN. Review campaign/recall status against Ferrari and NHTSA records; model-year summaries do not prove an individual car was affected or repaired.",
      focus:"Request DCT diagnostics and a hot road test; check damper and suspension condition; inspect soft-touch controls and interior trim; confirm applicable safety recall/campaign completion with supporting records.",
      noteIds:["458-001"], history:"https://www.carcollectorinternational.com/research/buyers-guides/ferrari/458-italia",
      sources:[["Car Collector International 458 buyer guide","https://www.carcollectorinternational.com/research/buyers-guides/ferrari/458-italia"],["Ferrari 458 model history","https://fullysorted.com/research/models/ferrari/458"],["NHTSA recall lookup","https://www.nhtsa.gov/recalls"]]
    },
    {
      id:"488", name:"488 GTB / Spider", era:"2015–2020 (variant/model-year ranges differ)", layout:"Mid-engine twin-turbo V8 · dual-clutch transmission",
      variants:"488 GTB coupe; 488 Spider folding hardtop; 488 Pista coupe; 488 Pista Spider. Track-only Challenge and customer-racing derivatives are not road-car variants.",
      identity:"Confirm GTB/Spider/Pista/Pista Spider, model year, market and option specification. Record turbo, brake and wheel/tyre configuration; recall eligibility is VIN-specific.",
      focus:"Review scheduled-service and campaign paperwork; have a specialist assess turbo operation, DCT diagnostics, brakes and tire condition; cycle the Spider roof; check non-standard wheel/tyre fitment and stored faults.",
      noteIds:["488-001"], history:"https://www.octanefiles.com/cars/ferrari-488-gtb",
      sources:[["Octane Files 488 model history and buyer guide","https://www.octanefiles.com/cars/ferrari-488-gtb"],["Car Collector International 488 buyer guide","https://www.carcollectorinternational.com/research/buyers-guides/ferrari/488"],["Ferrari 2015 annual report — 488 GTB launch","https://cdn.ferrari.com/cms/network/media/pdf/ferrari_nv_-_2015_annual_report_feb_25_final.pdf"]]
    },
    {
      id:"roma", name:"Roma", era:"2020–2026 model-year era; coupe and Spider ranges differ", layout:"Front-mid-engine V8 grand tourer · 2+2 coupe / soft-top Spider",
      variants:"Roma coupe; Roma Spider (introduced 2023). The Roma is succeeded in Ferrari's range by the Amalfi; confirm exact build and model-year designation.",
      identity:"Confirm coupe versus Spider, build date/model year, market, options and VIN. The Spider roof and associated systems add inspection points. Check recall applicability by VIN rather than assuming all cars in a model year are affected.",
      focus:"Review 12V battery and charging history; test displays, haptic controls, lighting, central locking and stored faults; inspect roof operation/sealing on Spider; verify NHTSA 22V-536 brake-fluid-reservoir-cap remedy for affected VINs.",
      noteIds:["roma-001"], history:"https://www.octanefiles.com/cars/ferrari-roma",
      sources:[["Octane Files Roma model history and buyer guide","https://www.octanefiles.com/cars/ferrari-roma"],["PistonHeads Roma used buying guide","https://www.pistonheads.com/features/ph-buying-guides/ferrari-roma--ph-used-buying-guide/49190"],["NHTSA recall 22V-536 report","https://static.nhtsa.gov/odi/rcl/2022/RCLRPT-22V536-4188.PDF"],["Ferrari 2025 annual report","https://ferrari.scene7.com/is/content/ferrari/Ferrari_Annual_Report_2025_20F%20Form"]]
    }
  ];
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function safeUrl(v) { try { var u = new URL(v); return (u.protocol === "https:" || u.protocol === "http:") ? u.href : ""; } catch (_) { return ""; } }
  function mount() {
    var root = document.getElementById("specialistCenterContent");
    if (!root || root.querySelector("[data-model-encyclopedia]")) return;
    var panel = document.createElement("section");
    panel.className = "panel";
    panel.dataset.modelEncyclopedia = "1";
    panel.innerHTML = '<div class="panel-top"><div><h2>Ferrari Model Encyclopedia</h2><div class="panel-meta">Nine core model families · identity, variants and inspection research</div></div><span class="pill pill-none">Research edition 1.0</span></div>' +
      '<div class="sc-notice"><strong>How to use this library:</strong> Model-year ranges are broad reference guides, not VIN decoders. Market, production date, options and running changes can alter applicability. Verify identity and all technical work against Ferrari documentation for the individual vehicle.</div>' +
      '<div class="field"><label for="modelEncyclopediaSearch">Find a model or topic</label><input id="modelEncyclopediaSearch" type="search" placeholder="Try F355, Spider, gearbox, recall, belt history..."></div>' +
      '<div id="modelEncyclopediaList" class="model-encyclopedia-list"></div>';
    var style = document.createElement("style");
    style.textContent = '.model-encyclopedia-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr));gap:12px;margin-top:14px}.model-encyclopedia-card{border:1px solid var(--hairline);border-radius:10px;padding:14px;background:var(--surface-2)}.model-encyclopedia-card h3{font-family:Fraunces,serif;font-size:20px;margin:0 0 3px;color:var(--ink)}.model-encyclopedia-card .model-era{font:11px "JetBrains Mono",monospace;color:var(--ink-dim);margin-bottom:10px}.model-encyclopedia-card p{font-size:13px;line-height:1.55;margin:8px 0}.model-encyclopedia-card strong{color:var(--ink)}.model-encyclopedia-card .model-sources{font-size:11px;line-height:1.7;margin-top:10px;padding-top:8px;border-top:1px solid var(--hairline)}.model-encyclopedia-card a{color:var(--brass,#C6A66B)}.model-encyclopedia-card button{margin-top:10px}.model-encyclopedia-empty{padding:20px;text-align:center;color:var(--ink-dim)}';
    if (!document.getElementById("model-encyclopedia-style")) { style.id = "model-encyclopedia-style"; document.head.appendChild(style); }
    root.insertBefore(panel, root.firstChild);
    var input = panel.querySelector("#modelEncyclopediaSearch");
    var list = panel.querySelector("#modelEncyclopediaList");
    function render(filter) {
      var q = String(filter || "").toLowerCase().trim();
      var matches = models.filter(function (m) { return [m.name,m.era,m.layout,m.variants,m.identity,m.focus].join(" ").toLowerCase().indexOf(q) >= 0; });
      list.innerHTML = matches.length ? matches.map(function (m) {
        var links = m.sources.map(function (src) { var url=safeUrl(src[1]); return url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(src[0]) + '</a>' : ""; }).filter(Boolean).join(" · ");
        return '<article class="model-encyclopedia-card"><h3>' + esc(m.name) + '</h3><div class="model-era">' + esc(m.era) + ' · ' + esc(m.layout) + '</div><p><strong>Variants:</strong> ' + esc(m.variants) + '</p><p><strong>Identify before applying guidance:</strong> ' + esc(m.identity) + '</p><p><strong>Inspection research:</strong> ' + esc(m.focus) + '</p><div class="model-sources"><strong>Research sources:</strong><br>' + links + '</div><button class="btn btn-ghost btn-sm" data-find-notes="' + esc(m.id) + '">Find matching Specialist Notes</button></article>';
      }).join("") : '<div class="model-encyclopedia-empty">No model matches that search.</div>';
      list.querySelectorAll("[data-find-notes]").forEach(function (btn) {
        btn.onclick = function () {
          var model = models.find(function (m) { return m.id === btn.dataset.findNotes; });
          var search = document.getElementById("scSearch");
          if (search) { search.value = model ? model.id.toUpperCase().replace("F355","F355").replace("F430","F430") : ""; search.dispatchEvent(new Event("input", {bubbles:true})); search.scrollIntoView({behavior:"smooth",block:"center"}); }
        };
      });
    }
    input.addEventListener("input", function () { render(input.value); });
    render("");
  }
  var original = window.renderSpecialistCenter;
  if (typeof original === "function") {
    window.renderSpecialistCenter = function () { original(); mount(); };
    window.renderSpecialistCenter();
  }
})();
