<script setup>
import { RiFileCopyLine, RiFileTextLine, RiLightbulbLine } from "@remixicon/vue"
import { marked } from "marked"
import { configureMarked } from "@/utils/markdownAlerts"
import { Button } from "@/components/ui/button"
import "@/assets/markdown-alert-content.css"

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
        class="text-sm leading-relaxed text-foreground/90"
        v-html="renderMarkdown(row.documentation.abstract)"
      />
      <div v-if="row.documentation.recomendations" class="space-y-2">
        <p class="text-sm font-medium text-foreground">Suggested readings:</p>
        <ul class="list-disc space-y-1 pl-5 text-sm">
          <li
            v-for="(url, desc) in row.documentation.recomendations"
            :key="desc"
          >
            <a
              :href="url"
              target="_blank"
              rel="noreferrer"
              class="text-primary underline-offset-4 hover:underline"
            >
              {{ desc }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="comparison-detail-meta min-w-0 rounded-none border bg-card p-5 text-card-foreground shadow-sm">
      <div class="space-y-3">
        <div>
          <strong class="text-base">{{ row.name }}</strong>
          <small class="text-muted-foreground">&nbsp;({{ row.documentation.type }})</small>
        </div>
        <p
          v-for="detail in row.documentation.details"
          :key="detail"
          class="text-sm leading-relaxed text-muted-foreground"
        >
          {{ detail }}
        </p>
        <div class="flex flex-wrap gap-2 pt-1">
          <Button as-child>
            <a
              :href="confURL(row.name)"
              target="_blank"
              rel="noreferrer"
            >
              <RiLightbulbLine />
              <span>
                Learn more on Postgresql<strong>co.nf</strong>
              </span>
            </a>
          </Button>
          <Button v-if="row.documentation.url" variant="outline" as-child>
            <a
              :href="row.documentation.url"
              target="_blank"
              rel="noreferrer"
            >
              <RiFileTextLine />
              <span>Check the docs</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
