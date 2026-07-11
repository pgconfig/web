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
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-4 border-b pb-4">
      <Breadcrumb>
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
      <Button @click="goExport">Export</Button>
    </div>

    <ComparisonTable
      :full-response="fullResponse"
      :pg-version="pgVersion"
      :current-env="currentEnv"
    />
  </div>
</template>
