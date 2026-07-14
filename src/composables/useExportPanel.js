import { computed, ref } from "vue"

export const EXPORT_PANEL_COOKIE_NAME = "export_panel_state"
export const EXPORT_PANEL_WIDTH_COOKIE_NAME = "export_panel_width"
export const EXPORT_PANEL_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const EXPORT_PANEL_DEFAULT_WIDTH = 352
export const EXPORT_PANEL_MIN_WIDTH = 280
export const EXPORT_PANEL_MAX_WIDTH = 640
export const EXPORT_PANEL_TABLE_MIN_WIDTH = 480

const open = ref(readDefaultOpen())
const width = ref(readStoredWidth())
const isResizing = ref(false)

function clampWidth(value) {
  const maxWidth = Math.min(
    EXPORT_PANEL_MAX_WIDTH,
    typeof window !== "undefined"
      ? window.innerWidth - EXPORT_PANEL_TABLE_MIN_WIDTH
      : EXPORT_PANEL_MAX_WIDTH
  )
  return Math.min(Math.max(value, EXPORT_PANEL_MIN_WIDTH), maxWidth)
}

function readDefaultOpen() {
  if (typeof document === "undefined") return true
  return !document.cookie.includes(`${EXPORT_PANEL_COOKIE_NAME}=false`)
}

function readStoredWidth() {
  if (typeof document === "undefined") return EXPORT_PANEL_DEFAULT_WIDTH
  const match = document.cookie.match(
    new RegExp(`${EXPORT_PANEL_WIDTH_COOKIE_NAME}=(\\d+)`)
  )
  if (!match) return EXPORT_PANEL_DEFAULT_WIDTH
  const parsed = Number.parseInt(match[1], 10)
  return Number.isNaN(parsed)
    ? EXPORT_PANEL_DEFAULT_WIDTH
    : clampWidth(parsed)
}

function persistWidth(value) {
  document.cookie = `${EXPORT_PANEL_WIDTH_COOKIE_NAME}=${value}; path=/; max-age=${EXPORT_PANEL_COOKIE_MAX_AGE}`
}

export function useExportPanel() {
  const widthCss = computed(() => `${width.value}px`)

  function setOpen(value) {
    open.value = value
    document.cookie = `${EXPORT_PANEL_COOKIE_NAME}=${value}; path=/; max-age=${EXPORT_PANEL_COOKIE_MAX_AGE}`
  }

  function toggle() {
    setOpen(!open.value)
  }

  function setWidth(value) {
    width.value = clampWidth(value)
    persistWidth(width.value)
  }

  function startResize(event) {
    event.preventDefault()

    const startX = event.clientX
    const startWidth = width.value

    isResizing.value = true
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"

    function onPointerMove(moveEvent) {
      const delta = startX - moveEvent.clientX
      setWidth(startWidth + delta)
    }

    function onPointerUp() {
      isResizing.value = false
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
  }

  return {
    open,
    width,
    widthCss,
    isResizing,
    setOpen,
    toggle,
    setWidth,
    startResize,
  }
}
