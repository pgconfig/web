<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
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
}>()

const chromeRef = ref<HTMLElement | null>(null)
const pageToolbarRef = ref<HTMLElement | null>(null)
const chromeHeight = ref("4rem")
const hasPageToolbar = ref(false)

let toolbarObserver: MutationObserver | null = null
let chromeObserver: ResizeObserver | null = null

function updateToolbarVisibility() {
  hasPageToolbar.value = (pageToolbarRef.value?.childElementCount ?? 0) > 0
  updateChromeHeight()
}

function updateChromeHeight() {
  if (chromeRef.value) {
    chromeHeight.value = `${chromeRef.value.offsetHeight}px`
  }
}

onMounted(() => {
  if (pageToolbarRef.value) {
    updateToolbarVisibility()
    toolbarObserver = new MutationObserver(updateToolbarVisibility)
    toolbarObserver.observe(pageToolbarRef.value, { childList: true, subtree: true })
  }

  if (chromeRef.value) {
    updateChromeHeight()
    chromeObserver = new ResizeObserver(updateChromeHeight)
    chromeObserver.observe(chromeRef.value)
  }
})

onUnmounted(() => {
  toolbarObserver?.disconnect()
  chromeObserver?.disconnect()
})
</script>

<template>
  <SidebarProvider :default-open="true" class="h-svh overflow-hidden">
    <AppSidebar
      :is-dark="isDark"
      @toggle-theme="emit('toggle-theme')"
    />

    <SidebarInset
      class="min-h-0 min-w-0 overflow-hidden"
      :style="{ '--app-chrome-height': chromeHeight }"
    >
      <header ref="chromeRef" class="shrink-0 border-b">
        <div class="flex h-16 items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator
            orientation="vertical"
            class="mr-2 h-4 shrink-0 data-[orientation=vertical]:!self-center"
          />
          <div
            id="page-header"
            class="flex min-w-0 flex-1 items-center justify-between gap-4 overflow-hidden"
          />
        </div>

        <div
          v-show="hasPageToolbar"
          class="border-t border-border/80 bg-muted/20 px-4 py-2 lg:py-1.5"
        >
          <div
            id="page-toolbar"
            ref="pageToolbarRef"
            class="w-full min-w-0"
          />
        </div>
      </header>

      <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pb-4 pt-2 lg:pt-4">
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
