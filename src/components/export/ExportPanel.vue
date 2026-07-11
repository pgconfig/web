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

function highlightCode() {
  if (codeBlock.value && props.exportedResponse.output) {
    const output = String(props.exportedResponse.output)
    const result = hljs.highlight(output, { language: highlightLang.value })
    codeBlock.value.innerHTML = result.value
  }
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(String(props.exportedResponse.output))
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

onMounted(() => {
  highlightCode()
})
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-none border bg-card p-4 text-card-foreground shadow-sm">
      <div class="grid gap-4 md:grid-cols-3 md:items-end">
        <div class="space-y-2">
          <label class="text-xs font-medium text-muted-foreground">
            Export Format
          </label>
          <Select v-model="exportForm.format">
            <SelectTrigger class="w-full">
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

        <div class="space-y-2">
          <label class="text-xs font-medium text-muted-foreground">
            Log Format
          </label>
          <Select v-model="exportForm.log_format" :disabled="showLogFormat">
            <SelectTrigger class="w-full">
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

        <div class="flex items-center gap-2 pb-2">
          <Switch
            id="include-pgbadger"
            v-model:checked="exportForm.include_pgbadger"
          />
          <label for="include-pgbadger" class="text-sm text-foreground">
            Include PGBadger log configuration
          </label>
        </div>
      </div>
    </section>

    <section class="relative overflow-hidden rounded-none border bg-card shadow-sm">
      <Button
        variant="outline"
        size="sm"
        class="absolute top-2 right-2 z-10"
        @click="copyToClipboard"
      >
        <RiFileCopyLine />
        Copy
      </Button>
      <pre class="export-code"><code ref="codeBlock" :class="['hljs', highlightLang]"></code></pre>
    </section>
  </div>
</template>

<style scoped>
@reference "../../assets/globals.css";

pre.export-code {
  @apply bg-muted overflow-x-auto rounded-none border-0;
}

pre.export-code :deep(.hljs) {
  @apply bg-transparent text-foreground;
  padding: 1em;
}
</style>
