<script setup>
import {
  RiBookOpenLine,
  RiGithubFill,
  RiMoonLine,
  RiSunLine,
} from "@remixicon/vue"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

defineProps({
  isDark: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(["toggle-theme"])
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
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
    </SidebarGroupContent>
  </SidebarGroup>
</template>
