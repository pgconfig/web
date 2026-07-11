<script setup lang="ts">
import { useRouter } from "vue-router"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { RiBookOpenLine, RiGithubFill, RiHomeLine, RiMoonLine, RiSunLine } from "@remixicon/vue"
import ConfigFilters from "@/components/filters/ConfigFilters.vue"

defineProps<{
  isLoading?: boolean
  isDark: boolean
}>()

const emit = defineEmits<{
  "toggle-theme": []
  "form-change": [form: unknown]
  "export-form-change": [exportForm: unknown]
}>()

const router = useRouter()

function goHome() {
  router.push({ path: "/", query: router.currentRoute.value.query })
}
function onFormChange(formValue) {
  emit("form-change", formValue)
}

</script>

<template>
  <SidebarProvider :default-open="true">
    <Sidebar collapsible="icon">
      <SidebarHeader
        class="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-4"
      >
        <span class="font-bold text-lg group-data-[collapsible=icon]:hidden">PGConfig</span>
        <span
          class="hidden font-semibold text-sm tracking-wide text-sidebar-foreground group-data-[collapsible=icon]:flex [writing-mode:vertical-rl] [text-orientation:mixed]"
          aria-label="PGConfig"
        >
          PGConfig
        </span>
      </SidebarHeader>

      <SidebarContent class="group-data-[collapsible=icon]:hidden overflow-y-auto">
        <ConfigFilters @changing-form="onFormChange" />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Home" @click="goHome">
              <RiHomeLine />
              <span class="group-data-[collapsible=icon]:hidden">Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton as-child tooltip="Contribute">
              <a
                href="https://github.com/pgconfig/api"
                target="_blank"
                rel="noreferrer"
              >
                <RiGithubFill />
                <span class="group-data-[collapsible=icon]:hidden">Contribute</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton as-child tooltip="Documentation">
              <a
                href="https://docs.pgconfig.org"
                target="_blank"
                rel="noreferrer"
              >
                <RiBookOpenLine />
                <span class="group-data-[collapsible=icon]:hidden">Documentation</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Toggle theme" @click="emit('toggle-theme')">
              <RiSunLine v-if="isDark" />
              <RiMoonLine v-else />
              <span class="group-data-[collapsible=icon]:hidden">Theme</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>

    <SidebarInset>
      <header
        class="flex h-14 shrink-0 items-center gap-2 border-b px-4"
      >
        <SidebarTrigger class="-ml-1" />
        <div
          id="page-header"
          class="flex min-w-0 flex-1 items-center justify-between gap-4"
        />
      </header>
      <div class="flex min-h-0 flex-1 flex-col overflow-auto p-6">
        <slot />
      </div>
    </SidebarInset>

    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  </SidebarProvider>
</template>
