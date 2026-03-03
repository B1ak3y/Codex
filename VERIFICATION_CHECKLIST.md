# Local CRM Verification Checklist

Legend:
- **Preserved**: feature retained and locally functional.
- **Replaced**: backend feature replaced with local equivalent.
- **Removed (Supabase-only)**: removed by design.

## Core Shell
- [x] App boots without auth (**Preserved**)
- [x] Sidebar renders (**Preserved**)
- [x] Business selector works (**Preserved**)
- [x] Topbar and notifications render (**Preserved**)
- [x] Local state loads on refresh (**Preserved**)

## Leads/Pipeline/Deals/Prospects
- [x] Leads render/search/filter/pagination baseline (**Preserved**)
- [x] Lead panel opens and saves edits (**Preserved**)
- [x] Pipeline board and stage movement work (**Preserved**)
- [x] Deals render (**Preserved**)
- [x] Prospects render (**Preserved**)
- [x] Deal coach renders (**Preserved**)

## Dialer + Call Overlay
- [x] Dialer renders/current lead loads (**Preserved**)
- [x] Overlay opens and closes cleanly (**Preserved**)
- [x] Timer runs and resets (**Preserved**)
- [x] Follow-up toggle and date row work (**Preserved**)
- [x] Outcomes render and log updates lead/session state (**Preserved**)
- [x] Objection chips populate and details render (**Preserved**)

## Objections/Scripts/Tasks/Calendar/Callbacks
- [x] Objections page renders persona/trigger/rebuttal content (**Preserved**)
- [x] Scripts page renders (**Preserved**)
- [x] Tasks add/edit/delete and completion toggles work (**Preserved**)
- [x] Callbacks page renders (**Preserved**)
- [x] Calendar reflects tasks/bookings/callback totals (**Preserved**)

## Client Ops + Finance + Analytics
- [x] Bookings render (**Preserved**)
- [x] AI receptionist page renders (**Preserved**)
- [x] Reports render (**Preserved**)
- [x] Onboarding checklist renders/toggles (**Preserved**)
- [x] Billing/invoices render (**Preserved**)
- [x] Analytics and chart bars render (**Preserved**)
- [x] Best time to call and ROI render (**Preserved**)

## Import/Export/Settings
- [x] CSV import works (**Preserved**)
- [x] XLSX import works (**Preserved**)
- [x] Objection/script import works (**Preserved**)
- [x] JSON backup export works (**Replaced**)
- [x] JSON restore with validation+confirm works (**Replaced**)
- [x] Settings has no Supabase controls (**Removed (Supabase-only)**)

## Explicit Supabase Removal
- [x] Auth/config/invite/sync/realtime removed (**Removed (Supabase-only)**)
- [x] No runtime Supabase reference required (**Removed (Supabase-only)**)
