# Cavallino Logbook — Specialist Center

## What this adds
The Specialist Center is integrated as a separate tab in the existing single-page app. It provides:
- Search and category filtering without losing keyboard focus.
- User-entered knowledge notes with a source title, optional HTTP(S) source link, and an explicit unverified status.
- Diagnostic and inspection note capture.
- JSON backup export and validated JSON import/merge (duplicate knowledge-note IDs are skipped).
- Direct links to Ferrari TechInfo, Ferrari's VIN campaign lookup, and NHTSA recall resources.
- A separate browser storage key: `cavallino_specialist_center_v1`.

Existing Garage, Schedule, Service Log and Provenance storage keys are not intentionally read or modified by this module.

## Data and privacy
Data is stored in the current browser's local storage. It does not automatically sync between devices or browsers. Export JSON regularly and keep a separate backup. Clearing browser/site data can erase locally stored entries. Imported inspection records are appended; imported knowledge notes with IDs already present are skipped. Import does not replace existing data.

## Technical accuracy policy
The starter library deliberately contains only general documentation/process notes. It does not claim factory service intervals, known defects, part numbers, torque values, fluid specifications or repair procedures.

Before publishing a model-specific entry:
1. Identify model, model year, market, VIN range and drivetrain/option variant where relevant.
2. Cite the applicable Ferrari owner/workshop documentation, service bulletin, campaign/recall, or a named specialist source.
3. Label the evidence type: factory publication, safety/campaign notice, independent specialist recommendation, or unverified owner observation.
4. Record publication/revision date and the date checked.
5. Have safety-critical procedures reviewed by a qualified Ferrari specialist.

Do not infer factory requirements from forum anecdotes or aftermarket maintenance schedules. Ferrari TechInfo describes factory service literature, workshop procedures, wiring diagrams, technical bulletins, campaign information, maintenance and parts information; subscription/access conditions apply. NHTSA's public VIN lookup and model-year recall data are useful U.S. safety-recall references, not a complete Ferrari campaign or repair-history database.

## Files
- `specialist-center.js`: UI, validation, backup import/export and local-storage module.
- `specialist-center.schema.json`: JSON Schema for exported data.
- `index.html`: tab integration and styles.
- `sw.js`: service-worker cache version and runtime asset list.

## Testing checklist
- Open the app and navigate to Specialist Center.
- Type continuously into search and confirm focus stays in the search field.
- Change category filters.
- Add a knowledge note with and without a source URL; reload and confirm it persists.
- Add an inspection note; reload and confirm it persists.
- Export JSON, validate it against the schema, then import it into a test browser profile.
- Confirm existing Garage, Schedule, Service Log and Provenance entries remain intact.
- Test offline after the service worker has installed.
- Test on mobile and desktop widths.
- Verify that external reference links open safely.

## Current limitations
- Browser-local data only; no cloud account, multi-device sync or role-based access.
- No automatic VIN decoding or automated recall result integration.
- No authoritative Ferrari service database integration.
- No model-specific technical claims are preloaded.
- No attachments/photos, per-record PDF export, authentication, audit trail, or specialist approval workflow.
- The existing app's maintenance schedule templates are separate from this knowledge module and should not be treated as factory schedules unless independently verified for the exact vehicle.
