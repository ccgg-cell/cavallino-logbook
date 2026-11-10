/* Cavallino Logbook — local PPI photo evidence add-on.
 * Photos stay in this browser's PPI backup; no upload or external service.
 */
(function () {
  "use strict";
  const KEY = "cavallino_ppi_v1";
  const MAX = 8;
  let staged = [];
  const $ = (id) => document.getElementById(id);
  function readDB() {
    try { const x = JSON.parse(localStorage.getItem(KEY) || "null"); return x && x.version === 1 && Array.isArray(x.items) ? x : null; }
    catch (_) { return null; }
  }
  function compress(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read " + file.name));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Could not open " + file.name));
        img.onload = () => {
          const scale = Math.min(1, 1440 / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Image processing is unavailable."));
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve({ name: file.name.slice(0, 180), caption: "", dataUrl: canvas.toDataURL("image/jpeg", 0.72) });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  function queue() {
    const box = $("ppiPhotoQueue");
    if (!box) return;
    box.innerHTML = staged.map((p, i) =>
      '<div class="sc-item" style="display:inline-block;vertical-align:top;width:170px;margin:5px">' +
      '<img src="' + p.dataUrl + '" alt="Inspection evidence" style="width:100%;height:100px;object-fit:cover;border-radius:6px">' +
      '<div class="sc-meta">' + p.name.replace(/[&<>"]/g, "") + '</div>' +
      '<input data-photo-caption="' + i + '" maxlength="160" placeholder="Caption / location" value="' + p.caption.replace(/[&<>\"]/g, "") + '">' +
      '<button type="button" class="btn btn-ghost btn-sm" data-photo-remove="' + i + '">Remove</button></div>'
    ).join("");
    box.querySelectorAll("[data-photo-caption]").forEach(el => el.oninput = () => { staged[Number(el.dataset.photoCaption)].caption = el.value; });
    box.querySelectorAll("[data-photo-remove]").forEach(el => el.onclick = () => { staged.splice(Number(el.dataset.photoRemove), 1); queue(); });
  }
  function install() {
    const root = $("prePurchaseContent");
    if (!root || $("ppiPhotoEvidence")) return;
    const panel = document.createElement("section");
    panel.className = "sc-item";
    panel.id = "ppiPhotoEvidence";
    panel.innerHTML = '<h3>Photo evidence</h3><p class="sc-meta">Attach up to 8 photos to the next saved inspection. Images are resized on this device and included in JSON backups. Nothing is uploaded.</p><input id="ppiPhotoFiles" type="file" accept="image/*" multiple><div id="ppiPhotoQueue"></div>';
    const save = $("ppiSave");
    if (save && save.parentElement) save.parentElement.parentElement.insertBefore(panel, save.parentElement);
    else root.appendChild(panel);
    $("ppiPhotoFiles").addEventListener("change", async (event) => {
      const files = Array.from(event.target.files || []);
      const room = MAX - staged.length;
      if (files.length > room) alert("A maximum of 8 photos can be attached to one report.");
      for (const file of files.slice(0, room)) {
        if (!file.type.startsWith("image/")) continue;
        try { staged.push(await compress(file)); }
        catch (e) { alert(e.message); }
      }
      event.target.value = "";
      queue();
    });
    if (save) save.addEventListener("click", () => {
      const beforeIds = new Set((readDB()?.items || []).map(item => item.id));
      if (!staged.length) return;
      setTimeout(() => {
        const db = readDB();
        if (!db || !db.items.length) return;
        const target = db.items.slice().reverse().find(item => !beforeIds.has(item.id));
        if (!target) return;
        const existing = Array.isArray(target.photos) ? target.photos : [];
        if (existing.length + staged.length > MAX) {
          alert("This report already has the maximum number of photos. Remove some before adding more.");
          return;
        }
        target.photos = existing.concat(staged);
        try {
          localStorage.setItem(KEY, JSON.stringify(db));
          staged = [];
          queue();
          alert("Photo evidence saved with the inspection report.");
        } catch (_) {
          alert("The browser could not store these photos. Export a backup and try fewer or smaller images.");
        }
      }, 0);
    }, true);
    queue();
  }
  const original = window.renderPrePurchaseInspection;
  if (typeof original === "function") {
    window.renderPrePurchaseInspection = function () { original(); install(); };
    install();
  }
})();
