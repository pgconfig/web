export const DEFAULT_FORM = {
  max_connections: 100,
  pg_version: 18,
  environment_name: "WEB",
  total_ram: 4,
  cpus: 2,
  drive_type: "SSD",
  arch: "x86-64",
  os_type: "linux",
};

const PARSERS = {
  max_connections: parseInt,
  pg_version: parseFloat,
  total_ram: parseInt,
  cpus: parseInt,
};

function parserBy(key) {
  return PARSERS[key] || ((value) => value);
}

export function parseFormQuery(query) {
  const parsed = Object.entries(query).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: parserBy(key)(value) }),
    {}
  );
  return { ...DEFAULT_FORM, ...parsed };
}

export function buildUrlArgs(formValue) {
  if (!formValue) return "";
  return Object.entries(formValue)
    .map(([k, v]) => (k === "total_ram" ? `${k}=${v}GB` : `${k}=${v}`))
    .join("&");
}
