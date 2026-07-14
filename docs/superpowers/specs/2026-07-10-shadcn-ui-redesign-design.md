# PGConfig UI Redesign — Design Spec

**Date:** 2026-07-10  
**Status:** Approved  
**Scope:** Dedicated PR — full UI rewrite, same repo

---

## Summary

Replace the current Bulma/Buefy layout with a **shadcn-vue + Tailwind** interface inspired by the Shadcn sidebar pattern. Business logic (`services/`, `utils/`, `http/`, tests) stays untouched. Only the presentation layer is rewritten from scratch within the existing repository.

---

## Goals

- Modern, dark-first UI aligned with Shadcn design language
- Sidebar-driven layout with filters on the left, results on the right
- Preserve URL query-param sharing (`?cpus=2&total_ram=4&...`)
- Preserve active-profile column highlight in comparison table
- Remove Buefy/Bulma entirely by end of PR

## Non-Goals

- API changes
- New tuning profiles or export formats
- Refactoring business logic unless required by template changes
- New repository or greenfield project scaffold

---

## Layout

### Overview

```
┌─ SIDEBAR (collapsible) ──┐  ┌─ HEADER BAR ───────────────────────────────────────┐
│  [PG] or expanded branding │  │ Configuration › Profile Comparison    [Export]     │
│                            │  ├────────────────────────────────────────────────────┤
│  ┌─ Server ─────────────┐  │  │                                                    │
│  │ OS, Arch, Storage     │  │  │  Comparison tables (full width)                    │
│  │ CPUs, RAM, Connections│  │  │  - Memory Configuration                            │
│  └───────────────────────┘  │  │  - Checkpoint Related Configuration                │
│  ┌─ Database ───────────┐  │  │  - Network Related Configuration                   │
│  │ Application profile   │  │  │  - ...                                             │
│  │ PostgreSQL Version    │  │  │                                                    │
│  └───────────────────────┘  │  │  Column matching selected profile is highlighted   │
│                            │  │                                                    │
│  (flex spacer)             │  │                                                    │
│                            │  │                                                    │
│  ────────────────────────  │  │                                                    │
│  Home                      │  │                                                    │
│  Contribute (GitHub ↗)     │  │                                                    │
│  Documentation ↗           │  │                                                    │
│  Theme toggle (☀/🌙)       │  │                                                    │
└────────────────────────────┘  └────────────────────────────────────────────────────┘
```

### Sidebar

| Zone | Content | Notes |
|------|---------|-------|
| **Top** | Server + Database filter form | Same fields as today: OS, Arch, Storage, CPUs, RAM, Max connections, Application profile, PG Version |
| **Middle** | Flex spacer | Visual breathing room |
| **Bottom** | Home, Contribute, Documentation, Theme toggle | Moved from current hero navbar |

**Collapsed state:** Sidebar shrinks to icon-only width. Filters hidden. Display **"PG"** branding mark (text or logo abbreviation). Footer icons remain accessible (Home, GitHub, Docs, Theme).

**Expanded state:** Full filter form visible.

### Main Pane — Profile Comparison (default route)

| Zone | Content |
|------|---------|
| **Header left** | Breadcrumb: `Configuration › Profile Comparison` — segments are clickable |
| **Header right** | **Export** button — navigates to export page |
| **Body** | Full-width comparison tables grouped by category |

### Main Pane — Export Config (`/export`)

| Zone | Content |
|------|---------|
| **Header left** | Breadcrumb: `Configuration › Export Config` — click `Configuration` to return |
| **Header right** | **Compare** button — navigates back to comparison view (replaces Export; no duplicate Export button) |
| **Body** | Export format select, log format select, PGBadger switch, syntax-highlighted code block with Copy |

### Navigation Model

| Action | Result |
|--------|--------|
| Load `/` or `/tuning` | Comparison view (default) |
| Load `/export?...` | Export view with same query params |
| Click **Export** in header | Navigate to `/export` preserving query string |
| Click **Compare** in header | Navigate to `/` preserving query string |
| Click **Home** in sidebar footer | Navigate to comparison view |
| Click breadcrumb segment | Navigate to that level |
| Change filter in sidebar | Update query params, re-fetch API, update active view |

**No tabs.** The current centered tabs (Profile Comparison / Export Config) are removed.

---

## Comparison Table — Column Highlight

Maintain existing behavior: the column matching the selected **Application profile** (e.g. WEB) is visually highlighted with the primary/accent color (teal in current UI, mapped to shadcn `--primary` token).

- Profile selected in sidebar → corresponding column gets filled background
- Other environment columns (OLTP, DW, Mixed, Desktop) remain neutral
- Expandable rows (chevron → documentation detail) preserved
- Data formatting unchanged (`formatters.js`)

---

## Component Mapping

| Current (Buefy/Bulma) | New (shadcn-vue) |
|-----------------------|------------------|
| Hero + navbar | `Sidebar` + header bar |
| `Form.vue` in main column | Filter panel inside sidebar |
| `Tabs.vue` | Removed — replaced by routes + header buttons |
| `ComparisonTable.vue` (`b-table`) | TanStack `Data Table` with row expansion |
| `ExportConfig.vue` | shadcn `Select`, `Switch`, `Button` + code block |
| `DropdownSelect.vue` | shadcn `Select` |
| `b-numberinput` | shadcn `Number Field` or `Input` |
| `b-loading` | Spinner overlay or Skeleton |
| `buefy.dialog.alert` | `AlertDialog` or Sonner toast |
| `theme-overrides.css` | shadcn CSS variables + Tailwind dark mode |

---

## File Structure (target)

```
src/
├── components/
│   ├── ui/                    # shadcn-vue generated primitives
│   ├── filters/
│   │   └── ConfigFilters.vue  # Server + Database form (sidebar)
│   ├── comparison/
│   │   └── ComparisonTable.vue
│   └── export/
│       └── ExportPanel.vue
├── layouts/
│   └── AppShell.vue           # Sidebar + header + router-view
├── pages/
│   ├── ComparePage.vue
│   └── ExportPage.vue
├── services/                  # UNCHANGED
├── utils/                     # UNCHANGED
├── http/                      # UNCHANGED
├── assets/
│   ├── github-alerts.css      # UNCHANGED
│   └── hljs theme overrides   # Update wrapper only
├── App.vue                    # Slim orchestrator
└── main.js                    # Tailwind + shadcn setup
```

**Removed:**
- `src/components/Tabs.vue`
- `src/components/DropdownSelect.vue`
- `src/components/Form.vue` (replaced by `ConfigFilters.vue`)
- `src/assets/theme-overrides.css`
- `buefy` dependency

---

## Theme Strategy

### Tokens

Use shadcn default dark theme as base. Map PGConfig accent to `--primary` for column highlight and interactive elements.

### Dark / Light Mode

- Toggle in sidebar footer (same behavior as today)
- Persist preference in `localStorage` key `theme`
- Apply via `class="dark"` on `<html>` (shadcn convention)
- Remove Bulma `data-theme` attribute and `theme-overrides.css`

### Migration Safety

1. Add Tailwind + shadcn **before** removing Buefy
2. Build new shell alongside old layout (feature-flag or direct swap in single PR)
3. Keep props/events between filters ↔ App ↔ results unchanged during migration
4. Remove Buefy only after all views are migrated
5. Verify shared URL after each logical commit

---

## State & Data Flow

Unchanged from current architecture:

```
ConfigFilters (sidebar)
  └─ emits form changes
       └─ App.vue updates query string via router
            └─ triggers API calls (get-config-all-environments, get-config)
                 ├─ ComparePage ← fullResponse
                 └─ ExportPage  ← exportedResponse
```

Query param parsing logic moves from `Form.vue` to `ConfigFilters.vue` without behavior change.

---

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | ComparePage | Default — comparison tables |
| `/tuning` | ComparePage | Alias (existing) |
| `/export` | ExportPage | Export config output |

All routes accept the same query parameters.

---

## Implementation Order (commits)

1. `chore: add tailwind, shadcn-vue, and design tokens`
2. `feat: add AppShell layout with collapsible sidebar`
3. `refactor: migrate filters to sidebar (ConfigFilters)`
4. `feat: add ComparePage with header bar and Export button`
5. `refactor: migrate ComparisonTable to TanStack Data Table`
6. `feat: add ExportPage with Compare button in header`
7. `refactor: migrate ExportPanel to shadcn components`
8. `chore: remove buefy, bulma, and legacy theme files`

---

## Testing Checklist

- [ ] Shared URL loads same config on compare view
- [ ] Shared URL with `/export` path opens export view
- [ ] Filter changes update table and export output
- [ ] Active profile column is highlighted correctly for each profile
- [ ] Row expansion shows documentation markdown
- [ ] Copy button works on export code block
- [ ] Theme toggle persists across reload
- [ ] Sidebar collapse shows "PG" and footer icons
- [ ] External links (GitHub, Docs) open in new tab
- [ ] Existing unit tests pass (`formatters.spec.js`, `markdownAlerts.test.js`)
- [ ] Light and dark mode render correctly

---

## Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| UI library | shadcn-vue + Tailwind | Fidelity to target design |
| Repo strategy | UI rewrite in same repo | Preserves tests, CI, infra |
| Form placement | Sidebar | User vision — table gets full main area |
| Compare/Export nav | Header buttons + routes | Cleaner than tabs; Export only on compare view |
| Export page header | Compare button (not Export) | Avoid duplicate Export button |
| Breadcrumb | Clickable segments | Additional navigation path back |
| Column highlight | Keep current pattern | Core UX for profile comparison |
| Sidebar collapsed | Show "PG" branding | User request |
| Tabs | Removed | Replaced by route-based views |
