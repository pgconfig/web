<script setup>
import { computed } from "vue"
import { useMediaQuery } from "@vueuse/core"
import { useRouter } from "vue-router"
import { FileDown, PanelRightClose } from "@lucide/vue"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import ProfileSelect from "@/components/filters/ProfileSelect.vue"
import ConfigToolbar from "@/components/filters/ConfigToolbar.vue"
import ComparisonTable from "@/components/comparison/ComparisonTable.vue"
import ExportPanel from "@/components/export/ExportPanel.vue"
import { useExportPanel } from "@/composables/useExportPanel"

defineProps({
  fullResponse: { type: Array, required: true },
  exportedResponse: { type: Object, required: true },
  pgVersion: { type: String, required: true },
  currentEnv: { type: String, required: true },
})

const emit = defineEmits(["changing-form"])

const router = useRouter()
const {
  open: exportOpen,
  widthCss,
  isResizing,
  toggle: toggleExportPanel,
  startResize,
} = useExportPanel()
const isDesktop = useMediaQuery("(min-width: 1024px)")
const exportPanelHidden = computed(() => isDesktop.value && !exportOpen.value)

const tableAreaStyle = computed(() => {
  if (!exportOpen.value || !isDesktop.value) return undefined
  return { paddingRight: widthCss.value }
})

function goExportPage() {
  router.push({ name: "export", query: router.currentRoute.value.query })
}
</script>

<template>
  <Teleport to="#page-header">
    <Breadcrumb class="hidden min-w-0 flex-1 overflow-hidden md:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Profile Comparison</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <div class="flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-none md:shrink-0">
      <ProfileSelect />
      <Button
        variant="outline"
        size="icon-sm"
        class="shrink-0 lg:hidden"
        title="Export"
        @click="goExportPage"
      >
        <FileDown class="size-4" />
        <span class="sr-only">Export</span>
      </Button>
    </div>
  </Teleport>

  <div class="compare-split relative w-full min-w-0 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
    <div
      class="min-w-0 w-full lg:min-h-0 lg:flex-1 lg:overflow-auto lg:px-4 lg:pb-4"
      :class="!isResizing ? 'lg:transition-[padding-right] lg:duration-200 lg:ease-linear' : ''"
      :style="tableAreaStyle"
    >
      <ConfigToolbar class="mb-4" />
      <ComparisonTable
        :full-response="fullResponse"
        :pg-version="pgVersion"
        :current-env="currentEnv"
      />
    </div>

    <aside
      v-if="isDesktop"
      id="export-panel"
      class="export-panel fixed top-16 right-0 z-30 flex h-[calc(100svh-4rem)] max-w-[40rem] flex-col border-l bg-background shadow-sm"
      :class="[
        exportOpen
          ? 'translate-x-0'
          : 'pointer-events-none translate-x-full',
        !isResizing ? 'transition-transform duration-200 ease-linear' : '',
      ]"
      :style="{ width: widthCss }"
      :aria-hidden="exportPanelHidden"
    >
      <button
        type="button"
        aria-label="Resize export panel"
        class="export-panel-resize absolute inset-y-0 left-0 z-10 w-2 -translate-x-1/2 cursor-col-resize touch-none after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-border hover:after:bg-primary/60 active:after:bg-primary"
        @pointerdown="startResize"
      />

      <div class="flex h-12 shrink-0 items-center gap-2 border-b px-3">
        <FileDown class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span class="min-w-0 flex-1 truncate text-sm font-medium">
          Export
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          :aria-expanded="true"
          aria-controls="export-panel"
          @click="toggleExportPanel"
        >
          <PanelRightClose class="size-4" />
          <span class="sr-only">Close export panel</span>
        </Button>
      </div>

      <div class="flex min-h-0 flex-1 flex-col overflow-hidden p-3">
        <ExportPanel
          layout="split"
          :exported-response="exportedResponse"
          :pg-version="pgVersion"
          @changing-form="emit('changing-form', $event)"
        />
      </div>
    </aside>

    <button
      v-if="isDesktop && !exportOpen"
      type="button"
      class="fixed top-1/2 right-0 z-20 flex -translate-y-1/2 flex-col items-center gap-1 rounded-l-md border border-r-0 bg-background px-2 py-3 shadow-sm transition-colors hover:bg-muted"
      aria-controls="export-panel"
      :aria-expanded="false"
      title="Open export panel"
      @click="toggleExportPanel"
    >
      <FileDown class="size-4 text-muted-foreground" aria-hidden="true" />
      <span class="text-[11px] font-medium leading-none text-muted-foreground">
        Export
      </span>
      <span class="sr-only">Open export panel</span>
    </button>
  </div>
</template>

<style scoped>
.export-panel-resize:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
</style>
