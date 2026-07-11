/**
 * Alert markup classes for markdown rendering (v-html).
 * Keep in sync with alertVariants in @/components/ui/alert/index.ts
 */

const ALERT_BASE =
  "grid gap-0.5 rounded-lg border px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*=size-])]:size-4 group/alert relative my-3 w-full"

const ALERT_VARIANTS = {
  default: `${ALERT_BASE} bg-card text-card-foreground`,
  destructive: `${ALERT_BASE} text-destructive bg-card *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current`,
}

export function getAlertClasses(variant = "default") {
  return ALERT_VARIANTS[variant] ?? ALERT_VARIANTS.default
}

export function alertVariantForType(alertType) {
  if (alertType === "CAUTION" || alertType === "WARNING") {
    return "destructive"
  }
  return "default"
}
