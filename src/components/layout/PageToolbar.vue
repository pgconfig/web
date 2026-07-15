<script setup>
import { useMediaQuery } from "@vueuse/core"

const isDesktop = useMediaQuery("(min-width: 1024px)")
</script>

<template>
  <Teleport v-if="isDesktop" to="#page-toolbar">
    <slot />
  </Teleport>

  <div
    v-else
    class="-mx-4 border-b border-border/80 bg-muted/20 px-4 py-2"
    aria-label="Environment filters"
  >
    <slot />
  </div>
</template>
