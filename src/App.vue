<script setup>
import { getCurrentInstance } from "vue"
import { RouterView } from "vue-router"
import { Toaster } from "@/components/ui/sonner"
import AppShell from "@/layouts/AppShell.vue"
import ComparePage from "@/pages/ComparePage.vue"
import ExportPage from "@/pages/ExportPage.vue"
import { useTheme } from "@/composables/useTheme"
import { useTuningConfig } from "@/composables/useTuningConfig"

const http = getCurrentInstance().appContext.config.globalProperties.$http
const { isDark, toggleTheme } = useTheme()
const {
  isLoading,
  fullResponse,
  exportedResponse,
  pgVersion,
  currentEnv,
  setForm,
  setExportForm,
} = useTuningConfig(http)
</script>

<template>
  <AppShell
    :is-loading="isLoading"
    :is-dark="isDark"
    @toggle-theme="toggleTheme"
    @form-change="setForm"
  >
    <RouterView v-slot="{ route }">
      <ExportPage
        v-if="route.name === 'export'"
        :exported-response="exportedResponse"
        :pg-version="pgVersion"
        @changing-form="setExportForm"
      />
      <ComparePage
        v-else
        :full-response="fullResponse"
        :pg-version="pgVersion"
        :current-env="currentEnv"
      />
    </RouterView>
  </AppShell>

  <Toaster />
</template>
