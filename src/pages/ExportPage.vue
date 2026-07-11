<script setup>
import { useRouter } from "vue-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import ProfileSelect from "@/components/filters/ProfileSelect.vue"
import ExportPanel from "@/components/export/ExportPanel.vue"

defineProps({
  exportedResponse: { type: Object, required: true },
  pgVersion: { type: String, required: true },
})

const emit = defineEmits(["changing-form"])
const router = useRouter()

function goCompare() {
  router.push({ name: "compare", query: router.currentRoute.value.query })
}
</script>

<template>
  <Teleport to="#page-header">
    <Breadcrumb class="min-w-0 flex-1 overflow-hidden">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink as-child>
            <button type="button" @click="goCompare">
              PostgreSQL Configuration Tool
            </button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Export Config</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <div class="flex shrink-0 items-center gap-3">
      <ProfileSelect />
      <Button variant="outline" @click="goCompare">Compare</Button>
    </div>
  </Teleport>

  <ExportPanel
    :exported-response="exportedResponse"
    :pg-version="pgVersion"
    @changing-form="emit('changing-form', $event)"
  />
</template>
