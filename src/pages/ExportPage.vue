<script setup>
import { watch } from "vue"
import { useMediaQuery } from "@vueuse/core"
import { useRouter } from "vue-router"
import { FileDown } from "@lucide/vue"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import ProfileSelect from "@/components/filters/ProfileSelect.vue"
import ConfigToolbar from "@/components/filters/ConfigToolbar.vue"
import PageToolbar from "@/components/layout/PageToolbar.vue"
import ExportPanel from "@/components/export/ExportPanel.vue"
import { useExportPanel } from "@/composables/useExportPanel"

defineProps({
  exportedResponse: { type: Object, required: true },
  pgVersion: { type: String, required: true },
})

const emit = defineEmits(["changing-form"])
const router = useRouter()
const isDesktop = useMediaQuery("(min-width: 1024px)")
const { setOpen } = useExportPanel()

watch(
  isDesktop,
  (desktop) => {
    if (desktop) {
      setOpen(true)
      router.replace({ name: "compare", query: router.currentRoute.value.query })
    }
  },
  { immediate: true }
)

function goCompare() {
  router.push({ name: "compare", query: router.currentRoute.value.query })
}
</script>

<template>
  <Teleport to="#page-header">
    <Breadcrumb class="hidden min-w-0 flex-1 overflow-hidden md:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Export</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <div class="flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-none md:shrink-0">
      <ProfileSelect />
      <Button variant="outline" size="sm" class="shrink-0" @click="goCompare">
        Compare
      </Button>
    </div>
  </Teleport>

  <PageToolbar>
    <ConfigToolbar />
  </PageToolbar>

  <div v-if="!isDesktop" class="export-page w-full min-w-0 max-w-full">
    <div class="mb-4 flex items-center gap-2">
      <FileDown class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <h1 class="text-base font-semibold">Export</h1>
    </div>

    <ExportPanel
      layout="page"
      :exported-response="exportedResponse"
      :pg-version="pgVersion"
      @changing-form="emit('changing-form', $event)"
    />
  </div>
</template>
