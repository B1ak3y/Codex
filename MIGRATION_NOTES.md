# Migration Notes: Supabase to Local-Only

## Removed Supabase-Specific Pieces
- Removed all Supabase SDK usage and backend coupling.
- Removed auth/sign-in/sign-up/OTP gating and workspace invite/sync patterns.
- Removed realtime sync and remote DB push assumptions.

## Local Replacements Added
- Local-first state persistence via `localStorage` (`valenero_crm_local_v1`).
- Full JSON backup export/import with:
  - structural validation,
  - malformed JSON rejection,
  - overwrite confirmation prompt,
  - version metadata in export.
- Local imports for leads (CSV/XLSX) and objections/scripts (JSON).

## Functional Impact
- Multi-user realtime sync is intentionally removed because local-only mode has no backend.
- All CRM feature domains are preserved as local workflows/pages and persist per browser profile.
