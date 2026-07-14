export const ALERT_TYPES = {
  NOTE: { slug: "note", title: "Note" },
  TIP: { slug: "tip", title: "Tip" },
  IMPORTANT: { slug: "important", title: "Important" },
  WARNING: { slug: "warning", title: "Warning" },
  CAUTION: { slug: "caution", title: "Caution" },
}

export function getAlertMeta(alertType) {
  return ALERT_TYPES[alertType] ?? null
}
