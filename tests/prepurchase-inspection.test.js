/* Regression tests for the isolated Pre-Purchase Inspection module. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const source=fs.readFileSync("prepurchase-inspection.js","utf8");
const values=new Map();
const context={localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,String(v))},window:{},module:{exports:{}},Date,JSON,Array,String,Map,Set,URL,Blob,console};
vm.runInNewContext(source,context,{filename:"prepurchase-inspection.js"});
const api=context.module.exports;
assert.equal(api.groups.length,5,"five inspection groups should be available");
assert.ok(api.groups.reduce((n,g)=>n+g[1].length,0)>=20,"checklist should cover at least twenty inspection prompts");
assert.deepEqual(Array.from(api.ratings),["not_inspected","good","monitor","attention","not_applicable"]);
assert.equal(values.has("cavallino_v2"),false,"PPI module must not touch Garage storage");
assert.equal(values.has("cavallino_specialist_center_v1"),false,"PPI module must not touch Specialist Center storage");
console.log("Pre-Purchase Inspection regression tests passed.");
