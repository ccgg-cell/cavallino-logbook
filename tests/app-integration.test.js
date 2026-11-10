/* Static integration smoke checks for the Cavallino Logbook app shell. */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const sw = fs.readFileSync("sw.js", "utf8");
const specialist = fs.readFileSync("specialist-center.js", "utf8");
const ppi = fs.readFileSync("prepurchase-inspection.js", "utf8");
const photos = fs.readFileSync("inspection-photo-evidence.js", "utf8");
const serviceHistory = fs.readFileSync("service-history-enhancements.js", "utf8");
const modelEncyclopedia = fs.readFileSync("model-encyclopedia.js", "utf8");
const modelPpiGuidance = fs.readFileSync("model-ppi-guidance.js", "utf8");

const tabs = [...html.matchAll(/class="tab[^"]*"[^>]*data-view="([^"]+)"/g)].map(m => m[1]);
assert.ok(tabs.length >= 6, "the app should expose its core and specialist tabs");
assert.equal(new Set(tabs).size, tabs.length, "tab view keys should be unique");

for (const name of tabs) {
  assert.match(html, new RegExp('id="view-' + name + '"'), "missing view container for tab: " + name);
}
assert.match(html, /id="specialistCenterContent"/, "Specialist Center mount point must exist");
assert.match(html, /id="prePurchaseContent"/, "Pre-Purchase mount point must exist");

const specialistMarkup = html.indexOf('<script src="./specialist-center.js"></script>');
const ppiMarkup = html.indexOf('<script src="prepurchase-inspection.js"></script>');
const inlineInit = html.lastIndexOf("function renderAll()");
assert.ok(specialistMarkup >= 0 && specialistMarkup < inlineInit, "Specialist Center module must load before app initialization");
assert.ok(ppiMarkup > inlineInit, "PPI module must load after the app shell markup and initialization");
const photoMarkup = html.indexOf('<script src="inspection-photo-evidence.js"></script>');
assert.ok(photoMarkup > ppiMarkup, "photo evidence module must load after PPI module");
assert.match(html, /window\.renderSpecialistCenter\(\)/, "app render cycle must refresh Specialist Center");
assert.match(html, /window\.renderPrePurchaseInspection\(\)/, "app render cycle must refresh PPI when available");
assert.match(ppi, /if\(typeof document!==\"undefined\"\)render\(\)/, "PPI module must render when loaded after app initialization");
assert.match(photos, /cavallino_ppi_v1/, "photo evidence must use the PPI storage namespace");
assert.match(photos, /MAX = 8/, "photo evidence must enforce an attachment limit");
assert.match(photos, /dataUrl\.length <= 900000/, "photo evidence must cap image size before local storage");
assert.match(photos, /dataUrl\.length > 900000/, "oversized photos must be rejected");
assert.match(serviceHistory, /invoiceRef/, "service history should preserve invoice references");
assert.match(serviceHistory, /followup/, "service history should capture follow-up recommendations");
assert.match(serviceHistory, /function exportCSV/, "service history should support CSV export");
assert.match(serviceHistory, /function editRecord/, "service records should be editable");
assert.match(serviceHistory, /function deleteRecord/, "service records should be deletable");
assert.match(serviceHistory, /function exportFullBackup/, "full local data backup should be exportable");
assert.match(serviceHistory, /function importFullBackup/, "full local data backup should be restorable");
assert.match(serviceHistory, /validFullBackup/, "backup restore must validate data before writing");
assert.match(serviceHistory, /cavallino_specialist_center_v1/, "full backup should include Specialist Center data");
assert.match(serviceHistory, /cavallino_ppi_v1/, "full backup should include inspection data");
assert.match(serviceHistory, /function addMaintenanceReminder/, "owners should be able to create personal maintenance reminders");
assert.match(serviceHistory, /function updateReminder/, "personal maintenance reminders should be manageable");
assert.match(serviceHistory, /maintenanceReminders/, "personal reminders should be saved with the selected vehicle");
assert.match(serviceHistory, /not factory intervals/, "personal reminders must be distinguished from factory requirements");
assert.match(modelEncyclopedia, /Ferrari Model Encyclopedia/, "model encyclopedia module should be present");
for (const model of ["308","328","348","f355","360","f430","458","488","roma"]) assert.match(modelEncyclopedia, new RegExp('id:"' + model + '"' ), "encyclopedia should include " + model);
assert.match(modelEncyclopedia, /Identify before applying guidance/, "profiles must explain applicability checks");
assert.match(modelEncyclopedia, /Research sources/, "profiles must link research sources");
assert.match(modelEncyclopedia, /CavallinoModelEncyclopedia/, "model profiles should be exposed to the PPI guidance module");
assert.match(modelPpiGuidance, /Model-specific research prompts/, "PPI should display model-specific research prompts");
assert.match(modelPpiGuidance, /Add prompts to report summary/, "PPI prompts should be optionally included in report summary");

for (const asset of ["./index.html", "./manifest.json", "./specialist-center.js", "./prepurchase-inspection.js", "./inspection-photo-evidence.js", "./service-history-enhancements.js", "./model-encyclopedia.js", "./model-ppi-guidance.js"]) {
  assert.ok(sw.includes("'" + asset + "'"), "service worker must cache " + asset);
}
assert.match(specialist, /cavallino_specialist_center_v1/, "Specialist Center must use its isolated storage key");
assert.match(ppi, /cavallino_ppi_v1/, "PPI must use its isolated storage key");
assert.doesNotMatch(ppi, /cavallino_v2/, "PPI must not write the Garage/Service Log storage key");

console.log("App integration smoke checks passed.");
