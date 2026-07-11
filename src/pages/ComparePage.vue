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
          <BreadcrumbPage>Configuration</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Profile Comparison</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <Button class="shrink-0" @click="goExport">Export</Button>
  </Teleport>

  <ComparisonTable
    :full-response="fullResponse"
    :pg-version="pgVersion"
    :current-env="currentEnv"
  />
</template>
