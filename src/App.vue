<script setup>
import { provide } from "vue"
import { RouterView } from "vue-router"
import { Toaster } from "@/components/ui/sonner"
import AppShell from "@/layouts/AppShell.vue"
import { useTheme } from "@/composables/useTheme"
import { useTuningConfig } from "@/composables/useTuningConfig"
import http from "@/http"

const { isDark, toggleTheme } = useTheme()
const tuning = useTuningConfig(http)

provide("setForm", tuning.setForm)

const {
  isLoading,
  fullResponse,
  exportedResponse,
  pgVersion,
  currentEnv,
  setForm,
  setExportForm,
} = tuning
</script>

<template>
  <AppShell
    :is-loading="isLoading"
    :is-dark="isDark"
    @toggle-theme="toggleTheme"
    @form-change="setForm"
  >
    <RouterView v-slot="{ Component, route }">
      <component
        :is="Component"
        v-if="route.name === 'export'"
        :exported-response="exportedResponse"
        :pg-version="pgVersion"
        @changing-form="setExportForm"
      />
      <component
        :is="Component"
        v-else
        :full-response="fullResponse"
        :pg-version="pgVersion"
        :current-env="currentEnv"
      />
    </RouterView>
  </AppShell>

  <Toaster />
</template>
