<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue"
import { toast } from "vue-sonner"
import hljs from "highlight.js/lib/core"
import yaml from "highlight.js/lib/languages/yaml"
import sql from "highlight.js/lib/languages/sql"
import ini from "highlight.js/lib/languages/ini"
import { RiFileCopyLine } from "@remixicon/vue"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

hljs.registerLanguage("yaml", yaml)
hljs.registerLanguage("sql", sql)
hljs.registerLanguage("ini", ini)

const props = defineProps({
  exportedResponse: {
    type: Object,
    required: true,
  },
  pgVersion: {
    type: String,
    required: true,
  },
  layout: {
    type: String,
    default: "page",
    validator: (value) => ["page", "split"].includes(value),
  },
})

const emit = defineEmits(["changing-form"])

const codeBlock = ref(null)

const exportForm = reactive({
  format: "conf",
  include_pgbadger: true,
  log_format: "",
})

const formatOptions = [
  { value: "alter_system", label: "ALTER SYSTEM commands" },
  { value: "conf", label: "UNIX-like config file" },
  { value: "stackgres", label: "StackGres-like YAML file" },
]

const supportsJsonLog = computed(() => parseFloat(props.pgVersion) >= 15)

const logFormatOptions = computed(() => {
  const opts = [
    { value: "stderr", label: "Standard Error output" },
    { value: "csvlog", label: "Comma-separated values" },
    { value: "syslog", label: "Syslog daemon" },
  ]
  if (supportsJsonLog.value) {
    opts.push({ value: "jsonlog", label: "JSON Log" })
  }
  return opts
})

const showLogFormat = computed(() => !exportForm.include_pgbadger)

const highlightLang = computed(() => {
  switch (exportForm.format) {
    case "alter_system":
      return "sql"
    case "stackgres":
      return "yaml"
    case "json":
      return "json"
    default:
      return "ini"
  }
})

function formatExportOutput(output) {
  if (output == null || output === "") return ""
  if (typeof output === "string") return output
  return JSON.stringify(output, null, 2)
}

const exportText = computed(() =>
  formatExportOutput(props.exportedResponse.output)
)

function highlightCode() {
  if (!codeBlock.value) return
  const output = exportText.value
  if (!output) {
    codeBlock.value.textContent = ""
    return
  }
  const result = hljs.highlight(output, { language: highlightLang.value })
  codeBlock.value.innerHTML = result.value
}

async function copyToClipboard() {
  const output = exportText.value
  if (!output) {
    toast.error("Nothing to copy")
    return
  }
  try {
    await navigator.clipboard.writeText(output)
    toast.success("Copied to clipboard")
  } catch (e) {
    toast.error("Failed to copy", { description: String(e) })
  }
}

watch(
  () => props.pgVersion,
  (newVersion) => {
    const version = parseFloat(newVersion)
    const defaultLogFormat = version >= 15 ? "jsonlog" : "csvlog"

    if (version < 15 && exportForm.log_format === "jsonlog") {
      exportForm.log_format = "csvlog"
    } else if (version >= 15 && exportForm.log_format === "csvlog") {
      exportForm.log_format = "jsonlog"
    } else if (!exportForm.log_format) {
      exportForm.log_format = defaultLogFormat
    }
  },
  { immediate: true }
)

watch(
  exportForm,
  (newForm) => {
    emit("changing-form", { ...newForm })
    nextTick(() => highlightCode())
  },
  { immediate: true, deep: true }
)

watch(
  () => props.exportedResponse,
  () => {
    nextTick(() => highlightCode())
  },
  { deep: true }
)

watch(exportText, () => {
  nextTick(() => highlightCode())
})

onMounted(() => {
  highlightCode()
})
</script>

<template>
  <div
    :class="
      layout === 'split'
        ? 'flex h-full min-h-0 min-w-0 w-full max-w-full flex-col gap-3'
        : 'flex min-h-0 min-w-0 w-full max-w-full flex-col gap-4'
    "
  >
    <div
      :class="
        layout === 'split'
          ? 'grid min-w-0 shrink-0 gap-2'
          : 'grid min-w-0 gap-4 border-b pb-4 sm:grid-cols-2'
      "
    >
      <div class="grid min-w-0 gap-2">
        <label
          for="export-format"
          class="text-xs font-medium text-muted-foreground"
        >
          Export Format
        </label>
        <Select v-model="exportForm.format">
          <SelectTrigger id="export-format" class="w-full">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="opt in formatOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="grid min-w-0 gap-2">
        <label
          for="export-log-format"
          class="text-xs font-medium text-muted-foreground"
        >
          Log Format
        </label>
        <Select v-model="exportForm.log_format" :disabled="showLogFormat">
          <SelectTrigger id="export-log-format" class="w-full">
            <SelectValue placeholder="Select log format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="opt in logFormatOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <label
        for="include-pgbadger"
        :class="
          layout === 'split'
            ? 'flex min-w-0 items-center gap-2'
            : 'flex h-8 min-w-0 items-center gap-2 sm:col-span-2'
        "
      >
        <Switch
          id="include-pgbadger"
          v-model:checked="exportForm.include_pgbadger"
          class="shrink-0"
        />
        <span class="text-sm leading-snug text-foreground">
          Include PGBadger log configuration
        </span>
      </label>
    </div>

    <section
      :class="
        layout === 'split'
          ? 'flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden rounded-none border bg-card text-card-foreground shadow-sm'
          : 'flex min-h-0 min-w-0 w-full max-w-full flex-col overflow-hidden rounded-none border bg-card text-card-foreground shadow-sm'
      "
    >
      <div
        class="flex items-center justify-between gap-3 border-b px-3 py-2"
      >
        <span class="text-xs font-medium text-muted-foreground">
          Generated configuration
        </span>
        <Button
          variant="outline"
          size="sm"
          :disabled="!exportText"
          @click="copyToClipboard"
        >
          <RiFileCopyLine />
          Copy
        </Button>
      </div>

      <pre
        v-if="exportText"
        :class="['export-code', layout === 'split' && 'export-code--split']"
      ><code ref="codeBlock" :class="['hljs', highlightLang]"></code></pre>
      <p
        v-else
        class="px-4 py-8 text-center text-sm text-muted-foreground"
      >
        Configuration output will appear here.
      </p>
    </section>
  </div>
</template>

<style scoped>
@reference "../../assets/globals.css";

pre.export-code {
  @apply m-0 min-h-[10rem] max-h-[min(75vh,36rem)] w-full max-w-full min-w-0 overflow-auto bg-muted;
}

pre.export-code--split {
  @apply min-h-0 max-h-none min-w-0 flex-1 overflow-x-auto overflow-y-auto;
}

pre.export-code--split :deep(code.hljs) {
  @apply block w-max min-w-full max-w-none;
}

pre.export-code :deep(code.hljs) {
  @apply block w-max min-w-full bg-transparent p-4 text-xs leading-relaxed text-foreground;
  white-space: pre;
  tab-size: 2;
}
</style>
