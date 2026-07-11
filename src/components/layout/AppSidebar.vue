<script setup>
import { useRouter } from "vue-router"
import ConfigFilters from "@/components/filters/ConfigFilters.vue"
import NavSecondary from "@/components/layout/NavSecondary.vue"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

defineProps({
  isDark: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(["toggle-theme", "form-change"])
const router = useRouter()

function goHome() {
  router.push({ path: "/", query: router.currentRoute.value.query })
}
</script>

<template>
  <Sidebar collapsible="offcanvas">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" class="justify-center" @click="goHome">
            <img
              src="/pgconfig.svg"
              alt="PostgreSQL Configuration Tool"
              class="h-10 w-auto"
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <ConfigFilters @changing-form="emit('form-change', $event)" />
      <NavSecondary
        class="mt-auto"
        :is-dark="isDark"
        @toggle-theme="emit('toggle-theme')"
      />
    </SidebarContent>

    <SidebarRail />
  </Sidebar>
</template>
