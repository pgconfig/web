<script setup>
import { Lightbulb, FileText } from "lucide-vue-next"
import { marked } from "marked"
import { configureMarked } from "@/utils/markdownAlerts"
import "@/assets/github-alerts.css"

configureMarked(marked)

const props = defineProps({
  row: { type: Object, required: true },
  pgVersion: { type: String, required: true },
})

function confURL(param) {
  return `https://postgresqlco.nf/en/doc/param/${param}/${props.pgVersion}/`
}

function renderMarkdown(text) {
  if (!text) return ""
  return marked(text, { breaks: true })
}
</script>

<template>
  <div class="comparison-detail grid grid-cols-1 gap-6 lg:grid-cols-2">
    <div class="comparison-detail-docs min-w-0 space-y-4">
      <div
        class="abstract-text text-sm leading-relaxed"
        v-html="renderMarkdown(row.documentation.abstract)"
      />
      <div v-if="row.documentation.recomendations" class="space-y-2">
        <p class="text-sm font-medium">Suggested readings:</p>
        <ul class="list-disc space-y-1 pl-5 text-sm">
          <li
            v-for="(url, desc) in row.documentation.recomendations"
            :key="desc"
          >
            <a
              :href="url"
              target="_blank"
              rel="noreferrer"
              class="text-teal-700 underline hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
            >
              {{ desc }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="comparison-detail-meta min-w-0 rounded-lg border bg-card p-5 shadow-sm">
      <div class="space-y-3">
        <div>
          <strong class="text-base">{{ row.name }}</strong>
          <small class="text-muted-foreground">&nbsp;({{ row.documentation.type }})</small>
        </div>
        <p
          v-for="detail in row.documentation.details"
          :key="detail"
          class="text-sm leading-relaxed text-foreground/90"
        >
          {{ detail }}
        </p>
        <div class="flex flex-wrap gap-2 pt-1">
          <a
            :href="confURL(row.name)"
            target="_blank"
            rel="noreferrer"
            class="comparison-detail-btn-primary inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
          >
            <Lightbulb class="size-4" />
            <span>
              Learn more on Postgresql<strong>co.nf</strong>
            </span>
          </a>
          <a
            v-if="row.documentation.url"
            :href="row.documentation.url"
            target="_blank"
            rel="noreferrer"
            class="comparison-detail-btn-secondary inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
          >
            <FileText class="size-4" />
            <span>Check the docs</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
