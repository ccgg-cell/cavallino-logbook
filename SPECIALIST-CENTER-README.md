# Cavallino Logbook — Specialist Center

## What this adds
The current app also includes owner-facing recordkeeping tools:
- Expanded Service Log entries for parts/fluids, invoice references, record basis and workshop follow-up notes.
- Edit and delete actions for service entries, plus CSV export for the selected vehicle.
- Full local JSON backup and restore covering Garage/service history, Specialist Center notes/records and Pre-Purchase inspections with local photo evidence. Restore validates the backup and requires confirmation because it replaces the current browser's app data.
- Owner-defined maintenance reminders with date and/or odometer targets. These are personal planning entries, not factory service intervals.
The Specialist Center is integrated as a separate tab in the existing single-page app. It provides:
- Search and category filtering without losing keyboard focus.
- User-entered knowledge notes with a source title, optional HTTP(S) source link, and an explicit unverified status.
- Diagnostic and inspection note capture.
- JSON backup export and validated JSON import/merge (duplicate knowledge-note IDs are skipped).
- A dedicated Pre-Purchase tab with a general 27-point condition checklist, VIN/year/market/variant capture, condition ratings, findings, evidence-reference fields and up to 8 resized local photo attachments per report.
- Saved PPI reports with printable buyer-facing summaries, plus isolated JSON backup export/import and duplicate-ID protection.
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

## Initial sourced research entries

The initial model entries are deliberately written as inspection prompts, not factory specifications:
- 308 body/chassis corrosion, variant-specific service history and specialist inspection (Hagerty and Magneto buyer guides).
- 328 maintenance-history, body/electrical and gearbox inspection prompts (Magneto and Classic Trader).
- 348 belt-service evidence, gearbox and chassis inspection prompts (Auto Express and PistonHeads).
- F355 valve-guide history and oil-consumption assessment (Hagerty and Car and Driver buyer-guide sources).
- F355 exhaust-manifold/catalyst inspection (Hagerty and Car and Driver).
- F355 timing-belt history and scope verification (sources differ on service method; no interval is asserted).
- 360 camshaft variator campaign screening note based on a copy of Ferrari North America Technical Information Bulletin 1232 / Service Campaign 97. The copy states an engine-number/VIN range; current VIN applicability and completion must be checked with Ferrari.
- 360 clutch/F1-system condition and diagnostic history.
- 360 suspension ball-joint condition.
- F430 exhaust and F1-system diagnostic history (Octane Files and buyer-guide sources).
- 458 DCT diagnostics, hot road-test and campaign verification (buyer-guide sources; exact VIN must be checked).
- 488 turbo, DCT, brake and recall-history inspection (buyer-guide sources).
- Roma battery/electrical function checks and VIN verification for NHTSA recall 22V-536 (NHTSA recall report and buyer-guide sources).

These are labelled secondary-source research or historical bulletin-copy references. They are not factory-approved repair instructions. The seed library now merges missing seed IDs into existing local data without overwriting user-created entries, so current users receive the new notes after updating the app.

## Files
- `specialist-center.js`: UI, validation, backup import/export and local-storage module.
- `prepurchase-inspection.js`: separate PPI workspace, checklist, local records, safe backup merge and print-ready report.
- `prepurchase-inspection.schema.json`: schema for PPI backup files.
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
- PPI photo attachments are stored in the same browser-local PPI backup as the inspection report. Images are resized in-browser and limited to 8 per report; browser storage quotas still apply. There is no cloud sync, authentication, audit trail, specialist approval workflow or automatic VIN decoding.
- PPI checklist is a general documentation framework, not a Ferrari factory checklist or certification. Model-specific inspection procedures must be reviewed and added only with verified source evidence.
- The existing app's maintenance schedule templates are separate from this knowledge module and should not be treated as factory schedules unless independently verified for the exact vehicle.

## Ferrari Model Encyclopedia

The Specialist Center now includes a searchable first-edition model encyclopedia for the 308, 328, 348, F355, 360, F430, 458, 488 and Roma. Profiles summarize model-family identity, notable variants, identification questions and inspection research prompts, with links to external sources. Model-year spans are approximate reference ranges; confirm the individual VIN, build date, market, options and factory documentation before applying technical guidance. The encyclopedia does not publish unverified factory intervals, torque values, fluids or repair procedures.
