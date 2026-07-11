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
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-4 border-b pb-4">
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
  </div>
</template>
