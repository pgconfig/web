<script setup>
import { useRouter } from "vue-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import ProfileSelect from "@/components/filters/ProfileSelect.vue"
import ComparisonTable from "@/components/comparison/ComparisonTable.vue"

defineProps({
  fullResponse: { type: Array, required: true },
  pgVersion: { type: String, required: true },
  currentEnv: { type: String, required: true },
})

const router = useRouter()

function goExport() {
  router.push({ name: "export", query: router.currentRoute.value.query })
}
</script>

<template>
  <Teleport to="#page-header">
    <Breadcrumb class="min-w-0 flex-1 overflow-hidden">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>PostgreSQL Configuration Tool</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Profile Comparison</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <div class="flex shrink-0 items-center gap-3">
      <ProfileSelect />
      <Button @click="goExport">Export</Button>
    </div>
  </Teleport>

  <ComparisonTable
    :full-response="fullResponse"
    :pg-version="pgVersion"
    :current-env="currentEnv"
  />
</template>
