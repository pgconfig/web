<script setup lang="ts">
import AppSidebar from "@/components/layout/AppSidebar.vue"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

defineProps<{
  isLoading?: boolean
  isDark: boolean
}>()

const emit = defineEmits<{
  "toggle-theme": []
  "form-change": [form: unknown]
  "export-form-change": [exportForm: unknown]
}>()

function onFormChange(formValue) {
  emit("form-change", formValue)
}
</script>

<template>
  <SidebarProvider :default-open="false" class="h-svh overflow-hidden">
    <AppSidebar
      :is-dark="isDark"
      @toggle-theme="emit('toggle-theme')"
      @form-change="onFormChange"
    />

    <SidebarInset class="min-h-0 min-w-0 overflow-hidden">
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator
          orientation="vertical"
          class="mr-2 h-4 shrink-0 self-center"
        />
        <div
          id="page-header"
          class="flex min-w-0 flex-1 items-center justify-between gap-4 overflow-hidden"
        />
      </header>

      <div class="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-auto p-4">
        <slot />
      </div>
    </SidebarInset>

    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        class="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
      />
    </div>
  </SidebarProvider>
</template>
