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
</script>

<template>
  <div class="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
    <label class="hidden shrink-0 text-sm font-medium text-muted-foreground sm:inline">
      Application profile
    </label>
    <Select v-model="environmentName">
      <SelectTrigger class="w-[min(100%,11rem)] sm:w-56">
        <SelectValue placeholder="Select profile" />
      </SelectTrigger>
      <SelectContent>
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
