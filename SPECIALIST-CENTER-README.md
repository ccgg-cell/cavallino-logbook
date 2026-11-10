# Cavallino Logbook — Specialist Center

## What this adds
The Specialist Center is an optional tab integrated into the existing single-page app. It provides:
- Search and category filtering for knowledge notes.
- User-entered notes with a source/reference field and explicit unverified status.
- Diagnostic and inspection note capture.
- JSON export.
- A separate browser storage key: `cavallino_specialist_center_v1`.

Existing Garage, Schedule, Service Log and Provenance storage keys are not intentionally read or modified by this module.

## Data and privacy
Data is stored in the current browser's local storage. It does not automatically sync between devices or browsers. Export JSON regularly and keep a separate backup. Clearing browser/site data can erase locally stored entries.

## Technical accuracy policy
This starter library deliberately contains only general documentation/process notes. It does not claim factory service intervals, known defects, part numbers, torque values, fluid specifications or repair procedures.

Before publishing a model-specific entry:
1. Identify model, model year, market, VIN range and drivetrain/option variant where relevant.
2. Cite the applicable Ferrari owner/workshop documentation, service bulletin, campaign/recall, or a named specialist source.
3. Label the evidence type: factory publication, safety/campaign notice, independent specialist recommendation, or unverified owner observation.
4. Record publication/revision date and the date checked.
5. Have safety-critical procedures reviewed by a qualified Ferrari specialist.

Do not infer factory requirements from forum anecdotes or aftermarket maintenance schedules.

## Files
- `specialist-center.js`: UI and local-storage module.
- `specialist-center.schema.json`: JSON Schema for exported data.
- `index.html`: tab integration and styles.
- `sw.js`: service-worker cache version and asset list.

## Testing checklist
- Open the app and navigate to Specialist Center.
- Search notes and change category filters.
- Add a knowledge note; reload and confirm it persists.
- Add an inspection note; reload and confirm it persists.
- Export JSON and validate it against the schema.
- Confirm existing Garage, Schedule, Service Log and Provenance entries remain intact.
- Test offline after the service worker has installed.
- Test on mobile and desktop widths.

## Current limitations
- Browser-local data only; no cloud account, multi-device sync or role-based access.
- No automatic VIN decoding.
- No live recall/campaign lookup.
- No authoritative Ferrari service database integration.
- No model-specific technical claims are preloaded.
- Import, attachments/photos, PDF reports, and user authentication are not implemented in this starter.
