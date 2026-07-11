<script setup>
import { useRouter } from "vue-router"
import ConfigFilters from "@/components/filters/ConfigFilters.vue"
import NavSecondary from "@/components/layout/NavSecondary.vue"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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
    <SidebarHeader class="px-2 py-3">
      <button
        type="button"
        class="flex w-full cursor-pointer justify-center rounded-lg border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        @click="goHome"
      >
        <div class="mx-auto w-[85%]">
          <AspectRatio :ratio="1025 / 904">
            <img
              src="/pgconfig.svg"
              alt="PostgreSQL Configuration Tool"
              class="size-full object-contain"
            />
          </AspectRatio>
        </div>
      </button>
    </SidebarHeader>

    <SidebarContent>
      <ConfigFilters @changing-form="emit('form-change', $event)" />
    </SidebarContent>

    <SidebarFooter>
      <NavSecondary :is-dark="isDark" @toggle-theme="emit('toggle-theme')" />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
