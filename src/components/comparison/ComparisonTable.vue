<script setup>
import { computed, defineComponent, h, onMounted, ref } from "vue"
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useVueTable,
} from "@tanstack/vue-table"
import { marked } from "marked"
import { ChevronDown, ChevronRight, FileText, Lightbulb } from "lucide-vue-next"
import { toast } from "vue-sonner"
import { formatConfigs } from "@/services/formatters"
import { configureMarked } from "@/utils/markdownAlerts"
import { valueUpdater } from "@/components/ui/table/utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import "@/assets/github-alerts.css"

configureMarked(marked)

const ALL_ENVS = ["web", "oltp", "dw", "mixed", "desktop"]

const props = defineProps({
  fullResponse: {
    type: Array,
    required: true,
  },
  pgVersion: {
    type: String,
    required: true,
  },
  currentEnv: {
    type: String,
    required: true,
  },
})

const formattedConfigs = computed(() => {
  if (!Array.isArray(props.fullResponse) || props.fullResponse.length === 0) return []
  return formatConfigs(props.fullResponse)
})

onMounted(() => {
  toast.info(
    `Comparing the ${props.currentEnv.toUpperCase()} profile against all profiles.`
  )
})

function confURL(param) {
  return `https://postgresqlco.nf/en/doc/param/${param}/${props.pgVersion}/`
}

function renderMarkdown(text) {
  if (!text) return ""
  return marked(text, { breaks: true })
}

function isSelected(env, currentEnv) {
  return env.toUpperCase() === currentEnv.toUpperCase()
}

function headerClass(column, currentEnv) {
  const meta = column.columnDef.meta
  if (meta?.columnType === "default") return "comparison-col-default"
  if (meta?.env && isSelected(meta.env, currentEnv)) {
    return "comparison-col-selected"
  }
  return ""
}

function cellClass(column, currentEnv) {
  const meta = column.columnDef.meta
  if (meta?.columnType === "default") {
    return cn("comparison-col-default", "font-mono")
  }
  if (meta?.env && isSelected(meta.env, currentEnv)) {
    return cn("comparison-col-selected", "font-mono")
  }
  if (meta?.env) return "font-mono"
  return ""
}

function renderDetailPanel(row, pgVersion) {
  const documentation = row.original.documentation
  if (!documentation) return null

  const recommendations = documentation.recomendations
    ? Object.entries(documentation.recomendations).map(([desc, url]) =>
        h("li", { key: desc }, [
          h(
            "a",
            { href: url, target: "_blank", class: "text-primary underline" },
            desc
          ),
        ])
      )
    : null

  return h("div", { class: "grid grid-cols-1 gap-4 md:grid-cols-2" }, [
    h("div", { class: "prose prose-sm max-w-none dark:prose-invert" }, [
      h("div", {
        class: "abstract-text",
        innerHTML: renderMarkdown(documentation.abstract),
      }),
      recommendations
        ? [
            h("p", "Suggested readings:"),
            h("ul", recommendations),
          ]
        : null,
    ]),
    h("div", { class: "rounded-lg border bg-card p-4 text-card-foreground" }, [
      h("div", { class: "space-y-3" }, [
        h("div", [
          h("strong", row.original.name),
          h(
            "small",
            { class: "text-muted-foreground" },
            ` (${documentation.type})`
          ),
        ]),
        ...(documentation.details || []).map((detail) =>
          h("p", { key: detail, class: "text-sm" }, detail)
        ),
        h("div", { class: "flex flex-wrap gap-2" }, [
          h(
            Button,
            {
              as: "a",
              href: confURL(row.original.name),
              target: "_blank",
            },
            () => [
              h(Lightbulb, { class: "size-4" }),
              h("span", [
                "Learn more on Postgresql",
                h("strong", "co.nf"),
              ]),
            ]
          ),
          documentation.url
            ? h(
                Button,
                {
                  as: "a",
                  variant: "outline",
                  href: documentation.url,
                  target: "_blank",
                },
                () => [
                  h(FileText, { class: "size-4" }),
                  h("span", "Check the docs"),
                ]
              )
            : null,
        ]),
      ]),
    ]),
  ])
}

const ComparisonCategoryTable = defineComponent({
  name: "ComparisonCategoryTable",
  props: {
    title: {
      type: String,
      required: true,
    },
    params: {
      type: Array,
      required: true,
    },
    currentEnv: {
      type: String,
      required: true,
    },
    pgVersion: {
      type: String,
      required: true,
    },
  },
  setup(categoryProps) {
    const expanded = ref({})

    const columns = [
      {
        id: "expand",
        header: () => "",
        size: 40,
        cell: ({ row }) =>
          h(
            Button,
            {
              variant: "ghost",
              size: "icon",
              class: "size-8",
              onClick: () => row.toggleExpanded(),
            },
            () =>
              h(row.getIsExpanded() ? ChevronDown : ChevronRight, {
                class: "size-4",
              })
          ),
      },
      {
        accessorKey: "name",
        header: () => "",
        cell: ({ row }) =>
          h(
            "span",
            { class: "font-mono font-semibold" },
            row.original.name
          ),
      },
      {
        id: "default_value",
        accessorFn: (row) => row.documentation?.default_value ?? "",
        header: () => "Default Value",
        meta: { columnType: "default" },
        cell: (info) => h("span", String(info.getValue() ?? "")),
      },
      ...ALL_ENVS.map((env) => ({
        accessorKey: env,
        header: () => env.toUpperCase(),
        meta: { env },
        cell: (info) => h("span", String(info.getValue() ?? "")),
      })),
    ]

    const table = useVueTable({
      get data() {
        return categoryProps.params
      },
      columns,
      state: {
        get expanded() {
          return expanded.value
        },
      },
      onExpandedChange: (updater) => valueUpdater(updater, expanded),
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      getRowCanExpand: () => true,
    })

    return () => {
      const rows = table.getRowModel().rows

      return h("div", { class: "mb-8" }, [
        h("h3", { class: "mb-3 text-lg font-semibold" }, categoryProps.title),
        h(Table, null, {
          default: () => [
            h(TableHeader, null, {
              default: () =>
                table.getHeaderGroups().map((headerGroup) =>
                  h(TableRow, { key: headerGroup.id }, {
                    default: () =>
                      headerGroup.headers.map((header) =>
                        h(
                          TableHead,
                          {
                            key: header.id,
                            class: headerClass(
                              header.column,
                              categoryProps.currentEnv
                            ),
                          },
                          {
                            default: () =>
                              header.isPlaceholder
                                ? null
                                : h(FlexRender, {
                                    render: header.column.columnDef.header,
                                    props: header.getContext(),
                                  }),
                          }
                        )
                      ),
                  })
                ),
            }),
            h(TableBody, null, {
              default: () =>
                rows.flatMap((row) => {
                  const mainRow = h(TableRow, { key: row.id }, {
                    default: () =>
                      row.getVisibleCells().map((cell) =>
                        h(
                          TableCell,
                          {
                            key: cell.id,
                            class: cellClass(
                              cell.column,
                              categoryProps.currentEnv
                            ),
                          },
                          {
                            default: () =>
                              h(FlexRender, {
                                render: cell.column.columnDef.cell,
                                props: cell.getContext(),
                              }),
                          }
                        )
                      ),
                  })

                  if (!row.getIsExpanded()) {
                    return [mainRow]
                  }

                  const detailRow = h(
                    TableRow,
                    { key: `${row.id}-detail` },
                    {
                      default: () =>
                        h(
                          TableCell,
                          {
                            colspan: row.getVisibleCells().length,
                            class: "p-4",
                          },
                          {
                            default: () =>
                              renderDetailPanel(row, categoryProps.pgVersion),
                          }
                        ),
                    }
                  )

                  return [mainRow, detailRow]
                }),
            }),
          ],
        }),
      ])
    }
  },
})
</script>

<template>
  <div v-if="formattedConfigs.length > 0">
    <ComparisonCategoryTable
      v-for="item in formattedConfigs"
      :key="item.name"
      :title="item.name"
      :params="item.params"
      :pg-version="pgVersion"
      :current-env="currentEnv"
    />
  </div>
  <p v-else class="text-sm text-muted-foreground py-8 text-center">
    Loading configuration comparison…
  </p>
</template>

<style scoped>
.abstract-text {
  margin-top: 10px;
  margin-bottom: 1rem;
}
</style>
