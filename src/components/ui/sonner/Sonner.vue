<script lang="ts" setup>
import {
  RiCheckboxCircleLine,
  RiInformationLine,
  RiAlertLine,
  RiCloseCircleLine,
  RiLoader4Line,
  RiCloseLine,
} from '@remixicon/vue';


import type { ToasterProps } from "vue-sonner"
import { Toaster as Sonner } from "vue-sonner"
import { cn } from "@/lib/utils"

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
      '--gray2': 'hsl(var(--popover) / 0.9)',
      '--gray3': 'var(--border)',
      '--gray4': 'var(--border)',
      '--gray5': 'var(--border)',
      '--gray12': 'var(--popover-foreground)',
    }"
    :toast-options="{
      classes: {
        toast: 'rounded-none',
      },
    }"
    v-bind="props"
  >
    <template #success-icon>
      <RiCheckboxCircleLine class="size-4" />
    </template>
    <template #info-icon>
      <RiInformationLine class="size-4" />
    </template>
    <template #warning-icon>
      <RiAlertLine class="size-4" />
    </template>
    <template #error-icon>
      <RiCloseCircleLine class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <RiLoader4Line class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <RiCloseLine class="size-4" />
    </template>
  </Sonner>
</template>
