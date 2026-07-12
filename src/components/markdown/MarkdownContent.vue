<script setup>
import { computed, markRaw } from "vue"
import { marked } from "marked"
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  LightbulbIcon,
  MessageSquareWarningIcon,
} from "@lucide/vue"
import { getAlertMeta } from "@/utils/alertConfig"
import { parseMarkdownBlocks } from "@/utils/parseMarkdownBlocks"
import "@/assets/markdown-alert-content.css"

const props = defineProps({
  source: {
    type: String,
    default: "",
  },
})

const ALERT_ICONS = {
  NOTE: markRaw(InfoIcon),
  TIP: markRaw(LightbulbIcon),
  IMPORTANT: markRaw(MessageSquareWarningIcon),
  WARNING: markRaw(AlertTriangleIcon),
  CAUTION: markRaw(AlertCircleIcon),
}

const blocks = computed(() => parseMarkdownBlocks(props.source))

function renderMarkdown(content) {
  if (!content) return ""
  return marked(content, { breaks: true })
}
</script>

<template>
  <div class="grid w-full items-start gap-4">
    <template v-for="(block, index) in blocks" :key="index">
      <aside
        v-if="block.type === 'alert' && getAlertMeta(block.alertType)"
        :class="[
          'github-alert',
          `github-alert-${getAlertMeta(block.alertType).slug}`,
        ]"
        role="note"
      >
        <p class="github-alert-title">
          <component :is="ALERT_ICONS[block.alertType]" class="size-4 shrink-0" />
          <span>{{ getAlertMeta(block.alertType).title }}</span>
        </p>
        <div
          v-if="block.content"
          class="github-alert-body markdown-alert-content"
          v-html="renderMarkdown(block.content)"
        />
      </aside>
      <div
        v-else-if="block.type === 'markdown'"
        class="comparison-markdown min-w-0 text-sm leading-relaxed text-foreground/90"
        v-html="renderMarkdown(block.content)"
      />
    </template>
  </div>
</template>
