# Valenero CRM — Local-Only Implementation Plan

This plan keeps the CRM strictly local-first and removes Supabase dependencies while preserving the existing browser-powered workflow.

## Goal

Run the CRM as a **single-user static web app** backed only by browser storage (`localStorage` now, optional IndexedDB later), with no auth/sync/realtime backend.

## Scope (Now)

- Keep all core CRM pages and renderers.
- Keep per-business local data separation.
- Keep dialer/call overlay/speech recognition behavior.
- Keep CSV/XLSX/script import tools.
- Remove Supabase/auth/invite/realtime/sync UX and logic.
- Add JSON backup/restore controls for data portability.

---

## 1) Remove Supabase Layer

1. Remove Supabase SDK script tags from HTML head.
2. Remove or no-op Supabase initialization code.
3. Remove auth gates (sign in/sign up/OTP flow).
4. Remove workspace connection/config panel.
5. Remove invite and membership sync workflows.
6. Remove dirty queue push logic and realtime subscriptions.
7. Remove background sync loop and sync indicator UI.

### Guardrail

Keep `saveState()` pure local and synchronous to local storage. If a sync call currently hangs off `saveState()`, remove it (or hard-disable behind a constant like `LOCAL_ONLY = true`).

---

## 2) Make Local Mode the Default Runtime

1. Boot directly into CRM render path (`bootCRM()`) on load.
2. Remove auth prerequisite checks.
3. Ensure `loadState()` always initializes from local storage/default seed.
4. Keep existing first-run seeding and admin workspace fallback.

---

## 3) Preserve Existing Core Behavior

Do not regress:

- Business switching and per-business data buckets.
- Leads/pipeline/deals/tasks/callbacks/calendar flows.
- Call outcome logging and lead field updates.
- Objection detection/coaching and win-loss tracking.
- Speech recognition mic lifecycle and restart guards.
- Analytics, billing, onboarding, ideas, ROI, research tools.

---

## 4) Add Backup / Restore (Required for Local-Only Safety)

Add UI actions in Settings:

- **Export Backup (JSON):** download full app state (single file).
- **Import Backup (JSON):** validate schema version, then restore state.
- **Reset to Seed Data:** optional, explicit confirmation.

### Backup format

```json
{
  "version": 1,
  "exportedAt": "ISO-8601",
  "app": "valenero-crm",
  "state": { "...": "existing app state" }
}
```

### Restore safety checks

- Reject invalid JSON.
- Verify required top-level keys.
- If shape mismatch, surface a clear error and abort.
- Call `saveState()` + full re-render after successful import.

---

## 5) Hosting (Local / Droplet Static)

### Local machine

Serve as static files (examples):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

### VPS / Droplet (static only)

- Serve with Nginx.
- No Node backend required.
- Use HTTPS if externally reachable.

---

## 6) Immediate Implementation Checklist

- [ ] Remove Supabase script include(s).
- [ ] Remove auth boot gating.
- [ ] Remove sync/realtime/invite UI + logic.
- [ ] Confirm app cold-starts into Overview with seeded local data.
- [ ] Add backup export/import controls.
- [ ] Verify all major pages still render.
- [ ] Verify call overlay + mic controls still function in Chrome.

---

## 7) Optional Next Improvements (Still Local)

1. Migrate storage to IndexedDB if record volume grows.
2. Add periodic auto-backup prompt (download JSON every N days).
3. Add lightweight data validation on every state save.
4. Split single-file app into modules for maintainability while remaining static.

---

## Definition of Done (Local-Only)

- App runs without any Supabase credentials.
- No login/auth screens block entry.
- No runtime errors from removed sync/auth code.
- All CRM workflows function from local browser state.
- Backup export/import verified end-to-end.
