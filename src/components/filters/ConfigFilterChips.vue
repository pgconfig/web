<script setup>
import {
  RiCpuLine,
  RiDatabase2Line,
  RiHardDrive2Line,
  RiLinksLine,
  RiServerLine,
  RiStackLine,
} from "@remixicon/vue"
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

const chipClass =
  "flex w-full min-w-0 items-center gap-2 rounded-sm border border-border/60 bg-background px-2.5 py-2 text-xs transition-colors hover:bg-muted/40 lg:gap-1.5 lg:px-2 lg:py-1"
const labelClass = "w-14 shrink-0 text-muted-foreground lg:w-auto"
const selectTriggerClass =
  "chip-value-trigger h-6 min-h-0 min-w-0 flex-1 gap-1 border-0 bg-transparent p-0 text-xs font-medium shadow-none focus-visible:ring-0 [&_[data-slot=select-value]]:truncate"
const numberInputClass =
  "chip-number-input h-6 w-full min-w-0 flex-1 border-0 bg-transparent p-0 text-center text-xs font-medium shadow-none focus-visible:ring-0"
</script>

<template>
  <div
    class="grid w-full min-w-0 grid-cols-1 gap-2 lg:grid-cols-7 lg:gap-2"
  >
    <span :class="chipClass">
      <RiServerLine class="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span :class="labelClass">OS</span>
      <Select v-model="form.os_type">
        <SelectTrigger :class="selectTriggerClass" aria-label="Operating system">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="opt in OS_OPTIONS" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </span>

    <span :class="chipClass">
      <RiCpuLine class="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span :class="labelClass">Arch</span>
      <Select v-model="form.arch">
        <SelectTrigger :class="selectTriggerClass" aria-label="Architecture">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="opt in ARCH_OPTIONS" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </span>

    <span :class="chipClass">
      <RiHardDrive2Line class="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span :class="labelClass">Storage</span>
      <Select v-model="form.drive_type">
        <SelectTrigger :class="selectTriggerClass" aria-label="Storage type">
          <SelectValue />
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
    </span>

    <span :class="chipClass">
      <RiCpuLine class="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span :class="labelClass">CPUs</span>
      <Input
        type="number"
        min="1"
        :class="numberInputClass"
        aria-label="Number of CPUs"
        :model-value="form.cpus"
        @update:model-value="updateNumberField('cpus', $event)"
      />
    </span>

    <span :class="chipClass">
      <RiStackLine class="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span :class="labelClass">RAM</span>
      <Input
        type="number"
        min="1"
        :class="numberInputClass"
        aria-label="Total memory in gigabytes"
        :model-value="form.total_ram"
        @update:model-value="updateNumberField('total_ram', $event)"
      />
      <span class="shrink-0 font-medium">GB</span>
    </span>

    <span :class="chipClass">
      <RiLinksLine class="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span :class="labelClass">Conn.</span>
      <Input
        type="number"
        min="1"
        :class="numberInputClass"
        aria-label="Max connections"
        :model-value="form.max_connections"
        @update:model-value="updateNumberField('max_connections', $event)"
      />
    </span>

    <span :class="chipClass">
      <RiDatabase2Line class="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span :class="labelClass">PG</span>
      <Select
        :model-value="String(form.pg_version)"
        @update:model-value="updatePgVersion"
      >
        <SelectTrigger :class="selectTriggerClass" aria-label="PostgreSQL version">
          <SelectValue />
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
    </span>
  </div>
</template>

<style scoped>
.chip-value-trigger:focus,
.chip-value-trigger:focus-visible,
.chip-number-input:focus,
.chip-number-input:focus-visible {
  box-shadow: none;
  outline: none;
}

.chip-number-input::-webkit-inner-spin-button,
.chip-number-input::-webkit-outer-spin-button {
  margin: 0;
}
</style>
