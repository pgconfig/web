<script setup>
import { computed, reactive, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import lodash from "lodash"
import { RiDatabase2Line, RiServerLine } from "@remixicon/vue"
import { inject } from "vue"
import { parseFormQuery } from "@/utils/formQuery"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const emit = defineEmits(["changing-form"])

const setForm = inject("setForm", null)

const route = useRoute()
const router = useRouter()

const form = reactive({
  max_connections: 100,
  pg_version: 18,
  environment_name: "WEB",
  total_ram: 4,
  cpus: 2,
  drive_type: "SSD",
  arch: "x86-64",
  os_type: "linux",
})

const osOptions = [
  { value: "linux", label: "GNU/Linux Based" },
  { value: "windows", label: "Windows Based" },
  { value: "unix", label: "Unix Based" },
]

const archOptions = [
  { value: "x86-64", label: "64 Bits (x86-64)" },
  { value: "386", label: "32 Bits (386)" },
]

const driveTypeOptions = [
  { value: "HDD", label: "HDD Storage" },
  { value: "SSD", label: "SSD Storage" },
  { value: "SAN", label: "Network Storage - NAS/SAN" },
]

const environmentOptions = [
  { value: "WEB", label: "General web applications" },
  { value: "OLTP", label: "ERP or long transaction applications" },
  { value: "DW", label: "DataWare house and BI Applications" },
  { value: "Mixed", label: "DB and APP on the same server" },
  { value: "Desktop", label: "Developer local machine" },
]

const pgVersionOptions = [
  { value: 18, label: "18 (Latest)" },
  { value: 17, label: "17" },
  { value: 16, label: "16" },
  { value: 15, label: "15" },
  { value: 14, label: "14" },
  { value: 13, label: "13 (EOL)" },
  { value: 12, label: "12 (EOL)" },
  { value: 11, label: "11 (EOL)" },
  { value: 10, label: "10 (EOL)" },
  { value: "9.6", label: "9.6 (EOL)" },
  { value: "9.5", label: "9.5 (EOL)" },
  { value: "9.4", label: "9.4 (EOL)" },
  { value: "9.3", label: "9.3 (EOL)" },
  { value: "9.2", label: "9.2 (EOL)" },
  { value: "9.1", label: "9.1 (EOL)" },
]

const valuesFromURL = computed(() => parseFormQuery(route.query))

function syncFormFromRoute() {
  const fromUrl = valuesFromURL.value
  form.max_connections = fromUrl.max_connections
  form.pg_version = fromUrl.pg_version
  form.environment_name = fromUrl.environment_name
  form.total_ram = fromUrl.total_ram
  form.cpus = fromUrl.cpus
  form.drive_type = fromUrl.drive_type
  form.arch = fromUrl.arch
  form.os_type = fromUrl.os_type
}

watch(() => route.fullPath, syncFormFromRoute, { immediate: true })

watch(
  form,
  (newForm) => {
    const formWithoutGetters = { ...form }

    if (!lodash.isEqual(formWithoutGetters, valuesFromURL.value)) {
      router
        .push({
          query: formWithoutGetters,
        })
        .catch((failure) => {
          console.log(failure)
        })
    }
    const payload = { ...form }
    emit("changing-form", payload)
    setForm?.(payload)
  },
  { deep: true, immediate: true }
)

function updateNumberField(field, value) {
  form[field] = parseInt(String(value), 10) || 1
}

function updatePgVersion(value) {
  form.pg_version = parseFloat(String(value))
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <SidebarGroup>
      <SidebarGroupLabel class="flex items-center gap-2">
        <RiServerLine class="size-4" />
        Server
      </SidebarGroupLabel>
      <SidebarGroupContent class="space-y-3">
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-sidebar-foreground/70">
            Operating system
          </label>
          <Select v-model="form.os_type">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select OS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="opt in osOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-medium text-sidebar-foreground/70">
            Architecture
          </label>
          <Select v-model="form.arch">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select architecture" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="opt in archOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-medium text-sidebar-foreground/70">
            Storage type
          </label>
          <Select v-model="form.drive_type">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select storage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="opt in driveTypeOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-medium text-sidebar-foreground/70">
            Number of CPUs
          </label>
          <Input
            type="number"
            min="1"
            :model-value="form.cpus"
            @update:model-value="updateNumberField('cpus', $event)"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-medium text-sidebar-foreground/70">
            Total Memory (GB)
          </label>
          <Input
            type="number"
            min="1"
            :model-value="form.total_ram"
            @update:model-value="updateNumberField('total_ram', $event)"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-medium text-sidebar-foreground/70">
            Max connections
          </label>
          <Input
            type="number"
            min="1"
            :model-value="form.max_connections"
            @update:model-value="updateNumberField('max_connections', $event)"
          />
        </div>
      </SidebarGroupContent>
    </SidebarGroup>

    <Separator class="my-2" />

    <SidebarGroup>
      <SidebarGroupLabel class="flex items-center gap-2">
        <RiDatabase2Line class="size-4" />
        Database
      </SidebarGroupLabel>
      <SidebarGroupContent class="space-y-3">
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-sidebar-foreground/70">
            Application profile
          </label>
          <Select v-model="form.environment_name">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="opt in environmentOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-medium text-sidebar-foreground/70">
            PostgreSQL Version
          </label>
          <Select
            :model-value="String(form.pg_version)"
            @update:model-value="updatePgVersion"
          >
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="opt in pgVersionOptions"
                :key="String(opt.value)"
                :value="String(opt.value)"
              >
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  </div>
</template>
