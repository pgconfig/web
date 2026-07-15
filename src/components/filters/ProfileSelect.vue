<script setup>
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { ENVIRONMENT_OPTIONS } from "@/constants/environmentOptions"
import { parseFormQuery } from "@/utils/formQuery"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const route = useRoute()
const router = useRouter()

const environmentName = computed({
  get() {
    return parseFormQuery(route.query).environment_name
  },
  set(value) {
    router.push({
      query: {
        ...route.query,
        environment_name: value,
      },
    })
  },
})

const profileSelectWidth = computed(() => {
  const longestLabelLength = ENVIRONMENT_OPTIONS.reduce(
    (max, { label }) => Math.max(max, label.length),
    0
  )
  // Match open dropdown width: longest label + horizontal padding & icons
  return `calc(${longestLabelLength}ch + 3.75rem)`
})
</script>

<template>
  <div class="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
    <label class="hidden shrink-0 text-sm font-medium text-muted-foreground sm:inline">
      Application profile
    </label>
    <Select v-model="environmentName">
      <SelectTrigger
        class="profile-select-trigger w-full min-w-0 max-w-none focus-visible:border-input focus-visible:ring-0"
      >
        <SelectValue placeholder="Select profile" />
      </SelectTrigger>
      <SelectContent class="profile-select-content">
        <SelectItem
          v-for="opt in ENVIRONMENT_OPTIONS"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<style scoped>
.profile-select-trigger:focus,
.profile-select-trigger:focus-visible {
  box-shadow: none;
  outline: none;
}

@media (min-width: 640px) {
  .profile-select-trigger {
    width: v-bind(profileSelectWidth);
    min-width: v-bind(profileSelectWidth);
  }

  .profile-select-content {
    min-width: v-bind(profileSelectWidth);
  }
}
</style>
