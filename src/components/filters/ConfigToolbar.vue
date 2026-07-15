<script setup>
import {
  ARCH_OPTIONS,
  DRIVE_TYPE_OPTIONS,
  OS_OPTIONS,
  PG_VERSION_OPTIONS,
} from "@/constants/configFilterOptions"
import { useConfigForm } from "@/composables/useConfigForm"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const { form, updateNumberField, updatePgVersion } = useConfigForm()
</script>

<template>
  <section
    class="config-toolbar -mx-4 border-b bg-background px-4 pb-4"
    aria-label="Server and database configuration"
  >
    <div
      class="grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7"
    >
      <div class="min-w-0 space-y-1.5">
        <label
          for="config-os"
          class="text-xs font-medium text-muted-foreground"
        >
          OS
        </label>
        <Select v-model="form.os_type">
          <SelectTrigger id="config-os" class="w-full min-w-0">
            <SelectValue placeholder="OS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="opt in OS_OPTIONS"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="min-w-0 space-y-1.5">
        <label
          for="config-arch"
          class="text-xs font-medium text-muted-foreground"
        >
          Architecture
        </label>
        <Select v-model="form.arch">
          <SelectTrigger id="config-arch" class="w-full min-w-0">
            <SelectValue placeholder="Arch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="opt in ARCH_OPTIONS"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="min-w-0 space-y-1.5">
        <label
          for="config-storage"
          class="text-xs font-medium text-muted-foreground"
        >
          Storage
        </label>
        <Select v-model="form.drive_type">
          <SelectTrigger id="config-storage" class="w-full min-w-0">
            <SelectValue placeholder="Storage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="opt in DRIVE_TYPE_OPTIONS"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="min-w-0 space-y-1.5">
        <label
          for="config-cpus"
          class="text-xs font-medium text-muted-foreground"
        >
          CPUs
        </label>
        <Input
          id="config-cpus"
          type="number"
          min="1"
          :model-value="form.cpus"
          @update:model-value="updateNumberField('cpus', $event)"
        />
      </div>

      <div class="min-w-0 space-y-1.5">
        <label
          for="config-ram"
          class="text-xs font-medium text-muted-foreground"
        >
          RAM (GB)
        </label>
        <Input
          id="config-ram"
          type="number"
          min="1"
          :model-value="form.total_ram"
          @update:model-value="updateNumberField('total_ram', $event)"
        />
      </div>

      <div class="min-w-0 space-y-1.5">
        <label
          for="config-connections"
          class="text-xs font-medium text-muted-foreground"
        >
          Connections
        </label>
        <Input
          id="config-connections"
          type="number"
          min="1"
          :model-value="form.max_connections"
          @update:model-value="updateNumberField('max_connections', $event)"
        />
      </div>

      <div class="min-w-0 space-y-1.5">
        <label
          for="config-pg-version"
          class="text-xs font-medium text-muted-foreground"
        >
          PostgreSQL
        </label>
        <Select
          :model-value="String(form.pg_version)"
          @update:model-value="updatePgVersion"
        >
          <SelectTrigger id="config-pg-version" class="w-full min-w-0">
            <SelectValue placeholder="PG version" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="opt in PG_VERSION_OPTIONS"
              :key="String(opt.value)"
              :value="String(opt.value)"
            >
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </section>
</template>
