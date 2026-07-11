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
import {
  RiBookOpenLine,
  RiDatabase2Line,
  RiGithubFill,
  RiHomeLine,
  RiMoonLine,
  RiSunLine,
} from "@remixicon/vue"
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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" @click="goHome">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <RiDatabase2Line class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">PGConfig</span>
                <span class="truncate text-xs">PostgreSQL tuning</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent class="group-data-[collapsible=icon]:hidden">
        <ConfigFilters @changing-form="onFormChange" />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Home" @click="goHome">
              <RiHomeLine />
              <span>Home</span>
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
                <span>Contribute</span>
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
                <span>Documentation</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Toggle theme" @click="emit('toggle-theme')">
              <RiSunLine v-if="isDark" />
              <RiMoonLine v-else />
              <span>Theme</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>

    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex min-w-0 flex-1 items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
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
