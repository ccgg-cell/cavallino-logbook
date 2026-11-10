/* Lightweight regression tests for Specialist Center storage migration.
 * Runs the real browser module in a Node VM with a minimal localStorage shim.
 */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("specialist-center.js", "utf8");
const STORE = "cavallino_specialist_center_v1";

function boot(initial) {
  const values = new Map();
  if (initial) values.set(STORE, JSON.stringify(initial));
  const localStorage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); }
  };
  const context = { localStorage, window: {}, document: {}, console, Date, URL, alert() {} };
  vm.runInNewContext(source, context, { filename: "specialist-center.js" });
  return { values, localStorage, window: context.window };
}

// Fresh install receives the expected research starter set and exposes its renderer.
const fresh = boot(null);
const freshData = JSON.parse(fresh.values.get(STORE));
assert.ok(freshData.items.length >= 9, "fresh install should include process notes and F355/360 research seeds");
assert.ok(freshData.items.some(item => item.id === "f355-001"));
assert.ok(freshData.items.some(item => item.id === "360-001"));
assert.equal(typeof fresh.window.renderSpecialistCenter, "function");

// Upgrade preserves user-created notes and inspection records while adding missing seeds.
const existing = {
  items: [{ id: "my-note", title: "My saved note", summary: "Keep this", category: "Engine", sourceUrl: "" }],
  records: [{ vehicle: "My Ferrari", date: "2025-01-02", odo: "12000", area: "Engine", notes: "My inspection record" }]
};
const upgraded = boot(existing);
const upgradedData = JSON.parse(upgraded.values.get(STORE));
assert.ok(upgradedData.items.some(item => item.id === "my-note" && item.summary === "Keep this"));
assert.ok(upgradedData.items.some(item => item.id === "f355-001"));
assert.equal(upgradedData.records.length, 1);
assert.equal(upgradedData.records[0].notes, "My inspection record");

// Re-running the module must not duplicate seeded knowledge IDs or user records.
const rerun = boot(upgradedData);
const rerunData = JSON.parse(rerun.values.get(STORE));
const ids = rerunData.items.map(item => item.id);
assert.equal(ids.length, new Set(ids).size, "knowledge item IDs must remain unique after migration");
assert.equal(rerunData.records.length, 1);

// The Specialist Center uses its own storage namespace.
assert.equal(upgraded.values.has("cavallino_v2"), false);
console.log("Specialist Center regression tests passed.");
