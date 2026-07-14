export const ENVIRONMENT_OPTIONS = [
  { value: "WEB", label: "General web applications" },
  { value: "OLTP", label: "ERP or long transaction applications" },
  { value: "DW", label: "DataWare house and BI Applications" },
  { value: "Mixed", label: "DB and APP on the same server" },
  { value: "Desktop", label: "Developer local machine" },
]

export const ENV_COLUMN_TO_PROFILE = {
  web: "WEB",
  oltp: "OLTP",
  dw: "DW",
  mixed: "Mixed",
  desktop: "Desktop",
}

export function profileLabelFor(value) {
  return (
    ENVIRONMENT_OPTIONS.find(
      (option) => option.value.toUpperCase() === String(value ?? "").toUpperCase()
    )?.label ?? value
  )
}

export function profileColumnLabel(value) {
  return (
    ENVIRONMENT_OPTIONS.find(
      (option) => option.value.toUpperCase() === String(value ?? "").toUpperCase()
    )?.value ?? value
  )
}
