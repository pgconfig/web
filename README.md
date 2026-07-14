# pgconfig.org UI

[![Netlify Status](https://api.netlify.com/api/v1/badges/52729dd5-3d3b-4314-867f-6f71b94c9002/deploy-status)](https://app.netlify.com/sites/pgconfig-ui-v2/deploys) [![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=flat-square&maxAge=2592000)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=L2MUTTNAQ57KN)

![pgconfig logo](public/pgconfig.svg "Logo")

> Logo by [@stefanitattoo](https://www.instagram.com/stefanitattoo/)

This is the new UI version, wrote from scratch using vuejs.

Thanks [@ramon-src](https://github.com/ramon-src) for the support and guidance on this project.

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Theme (shadcn-vue)

The UI uses [shadcn-vue](https://shadcn-vue.com) with Tailwind CSS 4. Theme tokens live in `src/assets/globals.css`; component config is in `components.json`.

**Use the Vue CLI, not the React one:**

```bash
# Wrong (React)
npx shadcn@latest apply --preset ...

# Correct (Vue)
npx shadcn-vue@latest apply --preset a64LKtAe
```

### First-time setup

If `components.json` is missing or invalid:

```bash
npx shadcn-vue@latest init --preset <preset-code> --template vite
```

Use a preset code from [shadcn-vue.com/create](https://shadcn-vue.com/create). Codes from [ui.shadcn.com](https://ui.shadcn.com) (React) do not work here.

Keep `"typescript": true` in `components.json`. With `"typescript": false`, `apply` can break Vue files during install.

### Change theme / preset

**Quick way (recommended):**

```bash
npm run theme:update -- <preset-code-or-name>
# examples:
npm run theme:update -- a64LKtAe
npm run theme:update -- maia -y   # skip dirty-tree prompt
```

The script runs `shadcn-vue apply`, sets `iconLibrary` to `remixicon`, reinstalls UI components, fixes `Sonner.vue` toast icons, and runs `npm run build`.

**Manual steps:**

1. Pick a preset on [shadcn-vue.com/create](https://shadcn-vue.com/create), or use a named style: `vega`, `nova`, `maia`, `lyra`, `mira`, `luma`, `sera`.

2. Apply it to the project:

```bash
npx shadcn-vue@latest apply --preset <preset-code> -y
# or
npx shadcn-vue@latest apply --preset maia -y
```

3. Reinstall Lucide (registry components import `@lucide/vue`):

```bash
npm install @lucide/vue
```

4. Restart the dev server:

```bash
npm run serve
```

`apply` updates `components.json`, CSS variables in `globals.css`, and reinstalls files under `src/components/ui/`.

### Icons

- **UI primitives** (`src/components/ui/`): default is **Lucide** (`@lucide/vue`) after `apply`.
- **App code** (sidebar footer, filters, export, etc.): **Remix Icon** (`@remixicon/vue`).

To switch UI icons from Lucide to Remix Icon:

```bash
npx shadcn-vue@latest migrate icons
# from: @lucide/vue
# to:   @remixicon/vue
```

After `migrate icons`, check `src/components/ui/sonner/Sonner.vue`. The CLI often leaves Lucide names (`CircleCheckIcon`, `InfoIcon`, etc.) mixed with Remix imports and the dev server will fail. Replace them with Remix exports, for example:

- `CircleCheckIcon` → `RiCheckboxCircleLine`
- `InfoIcon` → `RiInformationLine`
- `TriangleAlertIcon` → `RiAlertLine`
- `OctagonXIcon` → `RiCloseCircleLine`

Other libraries (e.g. Hugeicons) are listed in the preset, but the CLI may still leave Lucide imports in `.vue` files—keep `@lucide/vue` installed unless you migrate icons manually.

### Verify

```bash
npm run build
npm test
```

### Troubleshooting

| Error                                                       | Fix                                                                           |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `Failed to resolve import "@lucide/vue"`                    | Run `npm install @lucide/vue` after `apply`                                   |
| `Invalid preset: …` with a React site code                  | Generate the preset on [shadcn-vue.com/create](https://shadcn-vue.com/create) |
| `Opening tag "nav" not terminated` / `use strict` in `.vue` | Set `"typescript": true` in `components.json`, then run `apply` again         |
| `CircleCheckIcon` is not exported by `@remixicon/vue`       | Fix icon names in `src/components/ui/sonner/Sonner.vue` (see Icons section) |
| `npx shadcn@latest` says invalid `components.json`          | Use `shadcn-vue`, not `shadcn`                                                |
