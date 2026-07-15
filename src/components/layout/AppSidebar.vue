<script setup>
import { computed, inject } from "vue"
import { useRoute, useRouter } from "vue-router"
import { RiEqualizerLine } from "@remixicon/vue"
import NavSecondary from "@/components/layout/NavSecondary.vue"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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

const emit = defineEmits(["toggle-theme"])
const route = useRoute()
const router = useRouter()

const isCompareActive = computed(() => route.name === "compare")
const apiVersion = inject("apiVersion", null)

const apiVersionLabel = computed(() => {
  const raw = apiVersion?.value
  if (!raw) return null
  const semver = String(raw).split(" (")[0].trim()
  return `api (${semver})`
})

function goCompare() {
  router.push({ name: "compare", query: route.query })
}
</script>

<template>
  <Sidebar collapsible="offcanvas">
    <SidebarHeader class="px-2 py-3">
      <button
        type="button"
        class="flex w-full cursor-pointer justify-center rounded-lg border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        @click="goCompare"
      >
        <div class="mx-auto w-[85%]">
          <AspectRatio :ratio="1025 / 904">
            <img
              src="/pgconfig.svg"
              alt="pgconfig"
              class="size-full object-contain"
            />
          </AspectRatio>
        </div>
      </button>
      <div
        class="mx-auto mt-4 w-[85%] group-data-[collapsible=icon]:sr-only"
      >
        <p
          v-if="apiVersionLabel"
          class="mb-2 max-w-full truncate text-left font-mono-brand text-[10px] leading-snug text-sidebar-foreground/40"
          :title="apiVersionLabel"
        >
          {{ apiVersionLabel }}
        </p>
        <h1>
          <span
            class="inline-flex items-baseline font-mono-brand text-[1.5rem] leading-none tracking-tight"
          >
            <span class="font-medium text-sidebar-foreground/50">pg</span><span class="font-bold text-sidebar-foreground">config</span><span class="font-medium text-sidebar-foreground/45">=#</span><span
              class="terminal-cursor ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.04em] bg-sidebar-foreground"
              aria-hidden="true"
            />
          </span>
        </h1>
      </div>
    </SidebarHeader>

    <SidebarContent class="flex flex-1 flex-col gap-2">
      <SidebarGroup class="p-0">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                :is-active="isCompareActive"
                tooltip="Profile Comparison"
                @click="goCompare"
              >
                <RiEqualizerLine />
                <span>Profile Comparison</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <div class="flex-1" />
    </SidebarContent>

    <SidebarFooter>
      <NavSecondary :is-dark="isDark" @toggle-theme="emit('toggle-theme')" />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>

<style scoped>
.terminal-cursor {
  animation: terminal-cursor-blink 1.06s step-end infinite;
}

@media (prefers-reduced-motion: reduce) {
  .terminal-cursor {
    animation: none;
  }
}

@keyframes terminal-cursor-blink {
  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}
</style>
