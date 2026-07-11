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
  <SidebarProvider :default-open="true" class="h-svh overflow-hidden bg-muted">
    <AppSidebar
      :is-dark="isDark"
      @toggle-theme="emit('toggle-theme')"
      @form-change="onFormChange"
    />

    <SidebarInset
      class="bg-background flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:my-2 md:mr-2 md:ml-0 md:max-h-[calc(100svh-1rem)] md:rounded-xl md:shadow-sm md:peer-data-[state=collapsed]:ml-2"
    >
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex min-w-0 flex-1 items-center gap-2 px-4">
          <div class="flex items-center gap-2">
            <SidebarTrigger class="-ml-1" />
            <Separator
              orientation="vertical"
              class="h-4 self-center"
            />
          </div>
          <div
            id="page-header"
            class="flex min-w-0 flex-1 items-center justify-between gap-4 overflow-hidden"
          />
        </div>
      </header>

      <div class="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-auto p-4 pt-0">
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
