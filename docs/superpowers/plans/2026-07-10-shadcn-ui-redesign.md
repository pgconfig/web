# PGConfig Shadcn UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the PGConfig web UI with shadcn-vue + Tailwind — sidebar filters, full-width comparison table, export page via header button — while preserving URL sharing, API behavior, and existing unit tests.

**Architecture:** Keep `services/`, `utils/`, `http/` untouched. Extract API orchestration from `App.vue` into a composable. Build `AppShell` layout (collapsible sidebar + header). Route `/` → ComparePage, `/export` → ExportPage. Replace Buefy components incrementally; remove Buefy in final task.

**Tech Stack:** Vue 3.5, Vite 6, vue-router 4, shadcn-vue, Tailwind CSS 4, Reka UI, TanStack Vue Table, lucide-vue-next, highlight.js, axios

**Spec:** `docs/superpowers/specs/2026-07-10-shadcn-ui-redesign-design.md`

**Theme note:** Use shadcn default palette for now. Final theme/colors are **deferred** — only wire `--primary` for column highlight.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `package.json` | Modify | Add tailwind/shadcn deps; remove buefy at end |
| `vite.config.js` | Modify | Tailwind plugin, `@` alias |
| `components.json` | Create | shadcn-vue config |
| `tailwind.config.js` | Create | Content paths, theme extend |
| `postcss.config.js` | Create | Tailwind postcss |
| `src/assets/globals.css` | Create | shadcn CSS variables + Tailwind directives |
| `src/lib/utils.js` | Create | `cn()` helper |
| `src/components/ui/*` | Create | shadcn generated primitives |
| `src/composables/useTheme.js` | Create | dark/light toggle, localStorage |
| `src/composables/useTuningConfig.js` | Create | form state, API calls, responses |
| `src/layouts/AppShell.vue` | Create | Sidebar + header slot + footer nav |
| `src/components/filters/ConfigFilters.vue` | Create | Server/Database form (from Form.vue logic) |
| `src/components/comparison/ComparisonTable.vue` | Replace | TanStack table + row expansion |
| `src/components/export/ExportPanel.vue` | Create | Export UI (from ExportConfig.vue logic) |
| `src/pages/ComparePage.vue` | Create | Breadcrumb + Export btn + table |
| `src/pages/ExportPage.vue` | Create | Breadcrumb + Compare btn + export panel |
| `src/App.vue` | Rewrite | Slim: composable + AppShell + router-view |
| `src/main.js` | Modify | Remove Buefy; import globals.css |
| `index.html` | Modify | Theme flash script → `class="dark"` |
| `src/components/Tabs.vue` | Delete | Replaced by routes |
| `src/components/Form.vue` | Delete | Replaced by ConfigFilters |
| `src/components/DropdownSelect.vue` | Delete | Replaced by shadcn Select |
| `src/components/ExportConfig.vue` | Delete | Replaced by ExportPanel |
| `src/assets/theme-overrides.css` | Delete | Replaced by globals.css |

---

## Task 1: Tailwind + shadcn-vue Foundation

**Files:**
- Modify: `package.json`, `vite.config.js`, `index.html`
- Create: `components.json`, `postcss.config.js`, `tailwind.config.js`, `src/assets/globals.css`, `src/lib/utils.js`

- [ ] **Step 1: Install dependencies**

Run from repo root:

```bash
npm install -D tailwindcss @tailwindcss/vite
npm install class-variance-authority clsx tailwind-merge lucide-vue-next reka-ui @tanstack/vue-table
npx shadcn-vue@latest init
```

When prompted:
- TypeScript: **No**
- Style: **Default**
- Base color: **Zinc** (placeholder — theme TBD later)
- CSS file: `src/assets/globals.css`
- CSS variables: **Yes**
- Tailwind config: `tailwind.config.js`
- Components alias: `@/components`
- Utils alias: `@/lib/utils`

- [ ] **Step 2: Configure Vite alias and Tailwind plugin**

Replace `vite.config.js`:

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8080,
  },
});
```

- [ ] **Step 3: Create `src/lib/utils.js`**

```js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Ensure `src/assets/globals.css` imports Tailwind**

The shadcn init creates this file. Verify it contains:

```css
@import "tailwindcss";
```

Do **not** remove the `:root` / `.dark` variable blocks shadcn generates.

- [ ] **Step 5: Update `index.html` theme flash script**

Replace the inline script body:

```html
<script>
  (function () {
    var theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  })();
</script>
```

- [ ] **Step 6: Import globals in `main.js` (keep Buefy for now)**

Add as first CSS import:

```js
import "./assets/globals.css";
```

- [ ] **Step 7: Verify dev server starts**

Run: `npm run serve`  
Expected: App loads (still Buefy-styled) with no console errors about Tailwind.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vite.config.js components.json \
  postcss.config.js tailwind.config.js src/assets/globals.css src/lib/utils.js \
  index.html src/main.js
git commit -m "chore: add tailwind and shadcn-vue foundation"
```

---

## Task 2: Install shadcn-ui Primitives

**Files:**
- Create: `src/components/ui/button.vue`, `sidebar/*`, `breadcrumb/*`, `select/*`, `input/*`, `switch/*`, `separator/*`, `collapsible/*`, `table/*`, `sonner/*`, `alert-dialog/*`, `skeleton/*`

- [ ] **Step 1: Add required shadcn components**

```bash
npx shadcn-vue@latest add button sidebar breadcrumb select input switch separator collapsible table sonner alert-dialog skeleton tooltip sheet
```

- [ ] **Step 2: Add Sonner to `App.vue` temporarily**

At root of template (inside `#app`), add:

```vue
<Toaster />
```

Import: `import { Toaster } from '@/components/ui/sonner'`

This replaces `$buefy.snackbar` later.

- [ ] **Step 3: Verify components exist**

Run: `ls src/components/ui/`  
Expected: `button`, `sidebar`, `breadcrumb`, etc.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ src/App.vue
git commit -m "chore: add shadcn-vue ui primitives"
```

---

## Task 3: Theme Composable

**Files:**
- Create: `src/composables/useTheme.js`

- [ ] **Step 1: Create composable**

```js
import { ref, onMounted } from 'vue';

export function useTheme() {
  const isDark = ref(false);

  function applyTheme(dark) {
    isDark.value = dark;
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  function toggleTheme() {
    applyTheme(!isDark.value);
  }

  onMounted(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') applyTheme(true);
    else if (saved === 'light') applyTheme(false);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme(true);
  });

  return { isDark, toggleTheme, applyTheme };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useTheme.js
git commit -m "feat: add useTheme composable for shadcn dark mode"
```

---

## Task 4: API Composable (extract from App.vue)

**Files:**
- Create: `src/composables/useTuningConfig.js`
- Reference: `src/App.vue` (current API logic)

- [ ] **Step 1: Create composable with existing logic**

```js
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

export function useTuningConfig(http) {
  const route = useRoute();
  const router = useRouter();

  const isLoading = ref(false);
  const form = ref(null);
  const exportForm = ref(null);
  const fullResponse = ref([]);
  const exportedResponse = ref({ output: {} });

  const pgVersion = computed(() => form.value?.pg_version?.toString() ?? '');
  const currentEnv = computed(() => form.value?.environment_name ?? '');

  const urlArgs = computed(() => {
    if (!form.value) return '';
    return Object.entries(form.value)
      .map(([k, v]) => (k === 'total_ram' ? `${k}=${v}GB` : `${k}=${v}`))
      .join('&');
  });

  const exportArgs = computed(() => {
    if (!exportForm.value) return '';
    return Object.entries(exportForm.value)
      .filter(([, v]) => v !== false)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
  });

  async function callAPI(url, opts, args) {
    isLoading.value = true;
    let output = {};
    try {
      const response = await http.get(`${url}?${opts}&${args}`);
      output = response.data.data;
      if (typeof response.data === 'string') output = response.data;
    } catch (e) {
      toast.error('Could not get data from the API', {
        description: String(e),
      });
    }
    isLoading.value = false;
    return output;
  }

  async function updateComparisonResponse(args) {
    if (args === '') return;
    fullResponse.value = await callAPI('/get-config-all-environments', 'show_doc=true&format=json', args);
  }

  async function updateExportResponse(opts) {
    if (opts === '') return;
    exportedResponse.value.output = await callAPI('/get-config', opts, urlArgs.value);
  }

  function setForm(newForm) {
    form.value = newForm;
  }

  function setExportForm(newExportForm) {
    exportForm.value = newExportForm ?? [];
  }

  watch(urlArgs, (args) => {
    updateComparisonResponse(args);
    updateExportResponse(exportArgs.value);
  });

  watch(exportArgs, (opts) => {
    updateExportResponse(opts);
    updateComparisonResponse(urlArgs.value);
  });

  return {
    isLoading,
    form,
    exportForm,
    fullResponse,
    exportedResponse,
    pgVersion,
    currentEnv,
    setForm,
    setExportForm,
    route,
    router,
  };
}
```

- [ ] **Step 2: Run existing tests (unchanged logic)**

Run: `npm test`  
Expected: PASS (composable doesn't affect tests yet)

- [ ] **Step 3: Commit**

```bash
git add src/composables/useTuningConfig.js
git commit -m "refactor: extract tuning API logic into composable"
```

---

## Task 5: AppShell Layout

**Files:**
- Create: `src/layouts/AppShell.vue`

- [ ] **Step 1: Create AppShell with sidebar structure**

```vue
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Home, Github, BookOpen, Sun, Moon } from 'lucide-vue-next';
import ConfigFilters from '@/components/filters/ConfigFilters.vue';

defineProps({
  isLoading: { type: Boolean, default: false },
  isDark: { type: Boolean, required: true },
});

const emit = defineEmits(['toggle-theme', 'form-change', 'export-form-change']);

const router = useRouter();

function goHome() {
  router.push({ path: '/', query: router.currentRoute.value.query });
}
</script>

<template>
  <SidebarProvider default-open>
    <Sidebar collapsible="icon">
      <SidebarHeader class="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <span class="font-bold text-lg group-data-[collapsible=icon]:hidden">PGConfig</span>
        <span class="hidden font-bold text-lg group-data-[collapsible=icon]:block">PG</span>
      </SidebarHeader>

      <SidebarContent class="group-data-[collapsible=icon]:hidden overflow-y-auto">
        <ConfigFilters @changing-form="emit('form-change', $event)" />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton @click="goHome" tooltip="Home">
              <Home />
              <span class="group-data-[collapsible=icon]:hidden">Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton as-child tooltip="Contribute">
              <a href="https://github.com/pgconfig/api" target="_blank" rel="noreferrer">
                <Github />
                <span class="group-data-[collapsible=icon]:hidden">Contribute</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton as-child tooltip="Documentation">
              <a href="https://docs.pgconfig.org" target="_blank" rel="noreferrer">
                <BookOpen />
                <span class="group-data-[collapsible=icon]:hidden">Documentation</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton @click="emit('toggle-theme')" tooltip="Toggle theme">
              <Sun v-if="isDark" />
              <Moon v-else />
              <span class="group-data-[collapsible=icon]:hidden">Theme</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>

    <main class="flex flex-1 flex-col min-h-svh">
      <header class="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <slot name="header" />
      </header>
      <div class="flex-1 overflow-auto p-4">
        <slot />
      </div>
    </main>
  </SidebarProvider>
</template>
```

Note: `ConfigFilters` is imported here but created in Task 6. During Task 5, use a placeholder `<div>Filters placeholder</div>` then wire in Task 6.

- [ ] **Step 2: Verify sidebar renders**

Run: `npm run serve` — temporarily mount AppShell in App.vue with placeholder slot.  
Expected: Collapsible sidebar, "PG" when collapsed, footer icons visible.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/AppShell.vue
git commit -m "feat: add AppShell with collapsible sidebar"
```

---

## Task 6: ConfigFilters (migrate Form.vue)

**Files:**
- Create: `src/components/filters/ConfigFilters.vue`
- Reference: `src/components/Form.vue` (copy query-sync logic verbatim)
- Delete later: `src/components/Form.vue`, `src/components/DropdownSelect.vue`

- [ ] **Step 1: Create ConfigFilters with shadcn Select + Input**

Port the `data()`, `watch` (form → router.push → emit), and `parseQuery` from `Form.vue`. Replace:
- `dropdown-select` → shadcn `Select` + `SelectTrigger/SelectContent/SelectItem`
- `b-numberinput` → `Input type="number"` with min="1" (or Number Field if added)

Form default values (unchanged):

```js
{
  max_connections: 100,
  pg_version: 18,
  environment_name: 'WEB',
  total_ram: 4,
  cpus: 2,
  drive_type: 'SSD',
  arch: 'x86-64',
  os_type: 'linux',
}
```

Layout inside sidebar — two sections with labels **Server** and **Database**, stacked vertically (sidebar is narrow).

- [ ] **Step 2: Wire ConfigFilters into AppShell**

Replace placeholder with `<ConfigFilters @changing-form="..." />`.

- [ ] **Step 3: Manual test — URL sync**

1. Open `http://localhost:8080/?cpus=4&total_ram=8`
2. Expected: filters show cpus=4, total_ram=8
3. Change RAM → URL updates without full page reload

- [ ] **Step 4: Commit**

```bash
git add src/components/filters/ConfigFilters.vue src/layouts/AppShell.vue
git commit -m "refactor: migrate filters to sidebar ConfigFilters"
```

---

## Task 7: Routes + ComparePage

**Files:**
- Create: `src/pages/ComparePage.vue`
- Modify: `src/main.js`, `src/App.vue`

- [ ] **Step 1: Update router in `main.js`**

```js
import ComparePage from './pages/ComparePage.vue';
import ExportPage from './pages/ExportPage.vue';
import App from './App.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: App,
      children: [
        { path: '', component: ComparePage, name: 'compare' },
        { path: 'tuning', redirect: { name: 'compare' } },
        { path: 'export', component: ExportPage, name: 'export' },
      ],
    },
  ],
});
```

- [ ] **Step 2: Create ComparePage**

```vue
<script setup>
import { useRouter } from 'vue-router';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import ComparisonTable from '@/components/comparison/ComparisonTable.vue';

defineProps({
  fullResponse: { type: Array, required: true },
  pgVersion: { type: String, required: true },
  currentEnv: { type: String, required: true },
});

const router = useRouter();

function goExport() {
  router.push({ name: 'export', query: router.currentRoute.value.query });
}
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Configuration</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Profile Comparison</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <Button @click="goExport">Export</Button>
  </div>

  <ComparisonTable
    :full-response="fullResponse"
    :pg-version="pgVersion"
    :current-env="currentEnv"
  />
</template>
```

Header slot in AppShell receives this via named slot from App.vue (see Task 9).

- [ ] **Step 3: Commit**

```bash
git add src/pages/ComparePage.vue src/main.js
git commit -m "feat: add ComparePage with Export header button"
```

---

## Task 8: ComparisonTable (TanStack)

**Files:**
- Create: `src/components/comparison/ComparisonTable.vue`
- Delete later: old `src/components/ComparisonTable.vue`

- [ ] **Step 1: Create table with TanStack Vue Table**

Port logic from current `ComparisonTable.vue`:
- `formatConfigs(fullResponse)` for data
- Columns: `name`, `documentation.default_value`, `web`, `oltp`, `dw`, `mixed`, `desktop`
- Highlight column where `col === currentEnv.toLowerCase()`:

```js
const isSelected = (env) => env.toUpperCase() === props.currentEnv.toUpperCase();
// cell/header class: isSelected ? 'bg-primary text-primary-foreground' : ''
```

- Row expansion: click chevron → show markdown abstract + detail panel (port existing `#detail` template)
- Replace `$buefy.snackbar` with one-time toast on mount:

```js
import { toast } from 'vue-sonner';
onMounted(() => {
  toast.info(`Comparing the ${props.currentEnv.toUpperCase()} profile against all profiles.`);
});
```

Use shadcn `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` wrappers.

- [ ] **Step 2: Add comparison table styles to `globals.css`**

```css
.comparison-col-default {
  @apply bg-muted;
}
.comparison-col-selected {
  @apply bg-primary text-primary-foreground;
}
```

- [ ] **Step 3: Manual test**

1. Set profile to OLTP → OLTP column highlighted
2. Expand a row → markdown renders
3. Switch profile → highlight moves

- [ ] **Step 4: Commit**

```bash
git add src/components/comparison/ComparisonTable.vue src/assets/globals.css
git commit -m "refactor: migrate ComparisonTable to TanStack and shadcn"
```

---

## Task 9: Rewrite App.vue (wire everything)

**Files:**
- Rewrite: `src/App.vue`

- [ ] **Step 1: Slim App.vue**

```vue
<script setup>
import { getCurrentInstance } from 'vue';
import { RouterView } from 'vue-router';
import { Toaster } from '@/components/ui/sonner';
import { Skeleton } from '@/components/ui/skeleton';
import AppShell from '@/layouts/AppShell.vue';
import ComparePage from '@/pages/ComparePage.vue';
import ExportPage from '@/pages/ExportPage.vue';
import { useTheme } from '@/composables/useTheme';
import { useTuningConfig } from '@/composables/useTuningConfig';

const http = getCurrentInstance().appContext.config.globalProperties.$http;
const { isDark, toggleTheme } = useTheme();
const {
  isLoading, fullResponse, exportedResponse,
  pgVersion, currentEnv, setForm, setExportForm,
} = useTuningConfig(http);
</script>

<template>
  <AppShell
    :is-loading="isLoading"
    :is-dark="isDark"
    @toggle-theme="toggleTheme"
    @form-change="setForm"
  >
    <template #header>
      <RouterView name="header" />
    </template>

    <RouterView
      v-slot="{ Component, route }"
    >
      <component
        :is="route.name === 'export' ? ExportPage : ComparePage"
        v-if="route.name === 'export'"
        :exported-response="exportedResponse"
        :pg-version="pgVersion"
        @changing-form="setExportForm"
      />
      <component
        :is="ComparePage"
        v-else
        :full-response="fullResponse"
        :pg-version="pgVersion"
        :current-env="currentEnv"
      />
    </RouterView>
  </AppShell>

  <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
    <Skeleton class="h-8 w-8 rounded-full" />
  </div>
  <Toaster />
</template>
```

Adjust routing/slot pattern as needed so ComparePage/ExportPage header (breadcrumb + button) renders inside AppShell's `#header` slot. Simplest approach: pass header content via nested route components or move breadcrumb into each page above content (drop separate header slot if simpler).

**Recommended simplification:** Each page renders its own breadcrumb row at top (inside main content, below SidebarTrigger row). Merge AppShell header to only contain `<SidebarTrigger />` — pages own their breadcrumb + action button.

- [ ] **Step 2: Remove old hero, footer, Form, Tabs from App.vue**

Delete all Bulma hero/nav/footer markup.

- [ ] **Step 3: Manual smoke test**

Run through spec testing checklist items 1–4, 8, 11.

- [ ] **Step 4: Commit**

```bash
git add src/App.vue
git commit -m "refactor: wire AppShell, pages, and composables in App.vue"
```

---

## Task 10: ExportPage + ExportPanel

**Files:**
- Create: `src/pages/ExportPage.vue`, `src/components/export/ExportPanel.vue`
- Delete later: `src/components/ExportConfig.vue`

- [ ] **Step 1: Create ExportPanel**

Port logic from `ExportConfig.vue`:
- `exportForm` state (format, log_format, include_pgbadger)
- `pgVersion` watcher for log format defaults
- highlight.js rendering (keep same language registration)
- `copyToClipboard` → `toast.success('Copied to clipboard')`
- shadcn Select for format/log, Switch for pgbadger, Button for copy

Replace Bulma CSS vars in `<pre>` styling:

```css
pre {
  @apply bg-muted border rounded-md overflow-x-auto;
}
```

- [ ] **Step 2: Create ExportPage**

```vue
<script setup>
import { useRouter } from 'vue-router';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import ExportPanel from '@/components/export/ExportPanel.vue';

defineProps({
  exportedResponse: { type: Object, required: true },
  pgVersion: { type: String, required: true },
});

const emit = defineEmits(['changing-form']);
const router = useRouter();

function goCompare() {
  router.push({ name: 'compare', query: router.currentRoute.value.query });
}
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink as-child>
            <button type="button" @click="goCompare">Configuration</button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Export Config</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <Button variant="outline" @click="goCompare">Compare</Button>
  </div>

  <ExportPanel
    :exported-response="exportedResponse"
    :pg-version="pgVersion"
    @changing-form="emit('changing-form', $event)"
  />
</template>
```

- [ ] **Step 3: Manual test export flow**

1. From compare → click Export
2. URL is `/export?cpus=2&...`
3. Code block renders and Copy works
4. Compare button returns to `/`
5. Breadcrumb "Configuration" link works

- [ ] **Step 4: Commit**

```bash
git add src/pages/ExportPage.vue src/components/export/ExportPanel.vue
git commit -m "feat: add ExportPage and ExportPanel"
```

---

## Task 11: Remove Buefy + Legacy Files

**Files:**
- Modify: `package.json`, `src/main.js`, `index.html`
- Delete: `src/components/Tabs.vue`, `Form.vue`, `DropdownSelect.vue`, `ExportConfig.vue`, old `ComparisonTable.vue`, `src/assets/theme-overrides.css`

- [ ] **Step 1: Remove Buefy from main.js**

Delete:

```js
import Buefy from "buefy";
import "buefy/dist/css/buefy.css";
import "./assets/theme-overrides.css";
// app.use(Buefy, ...)
```

- [ ] **Step 2: Uninstall buefy**

```bash
npm uninstall buefy
```

- [ ] **Step 3: Remove Font Awesome from index.html (optional)**

Icons now use lucide-vue-next. Remove the Font Awesome `<link>` unless still referenced somewhere.

- [ ] **Step 4: Delete legacy component files**

```bash
rm src/components/Tabs.vue src/components/Form.vue src/components/DropdownSelect.vue \
   src/components/ExportConfig.vue src/components/ComparisonTable.vue \
   src/assets/theme-overrides.css
```

- [ ] **Step 5: Run full verification**

```bash
npm test
npm run build
npm run lint
```

Expected: all pass, no references to `buefy`, `bulma`, or `$buefy`.

- [ ] **Step 6: Manual test full checklist**

Run every item in spec Testing Checklist.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: remove buefy and legacy ui components"
```

---

## Task 12: Polish + hljs Theme

**Files:**
- Modify: `src/assets/hljs-dark.css`, `src/components/export/ExportPanel.vue`

- [ ] **Step 1: Update highlight.js theme imports in ExportPanel**

Use `highlight.js/styles/github.css` for light, keep `hljs-dark.css` override for `.dark pre code`.

- [ ] **Step 2: Final build check**

Run: `npm run build && npm run preview`  
Expected: production bundle builds, sidebar + table + export work.

- [ ] **Step 3: Commit**

```bash
git add src/assets/hljs-dark.css src/components/export/ExportPanel.vue
git commit -m "style: align syntax highlighting with shadcn theme"
```

---

## Spec Coverage Check

| Spec requirement | Task |
|------------------|------|
| shadcn-vue + Tailwind | 1, 2 |
| Sidebar with filters | 5, 6 |
| Footer nav (Home, GitHub, Docs, theme) | 5 |
| Collapsed "PG" branding | 5 |
| Compare view default | 7, 9 |
| Export via header button | 7 |
| Compare button on export page | 10 |
| Clickable breadcrumb | 10 |
| Column highlight | 8 |
| URL query preserved | 6, 7, 10 |
| Remove Buefy | 11 |
| Theme deferred | 1 (zinc default) |
| Existing tests pass | 11 |

---

## Manual Test Script (final)

```
1. Open /
2. Confirm sidebar filters + comparison table
3. Change Application profile → column highlight moves
4. Collapse sidebar → "PG" visible, icons in footer
5. Click Export → /export?...
6. Copy code → toast appears
7. Click Compare → back to /
8. Click Configuration breadcrumb on export → back to /
9. Toggle theme → persists on reload
10. Open shared URL in new tab → same config loads
11. npm test && npm run build
```
