<script setup>
import { computed, defineComponent, h, onMounted, ref } from "vue"
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useVueTable,
} from "@tanstack/vue-table"
import { ChevronDown, ChevronRight } from "lucide-vue-next"
import { toast } from "vue-sonner"
import { formatConfigs } from "@/services/formatters"
import { valueUpdater } from "@/components/ui/table/utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import ComparisonRowDetail from "@/components/comparison/ComparisonRowDetail.vue"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ALL_ENVS = ["web", "oltp", "dw", "mixed", "desktop"]

// Fixed column widths so every category table aligns vertically.
const COLUMN_WIDTHS = {
  expand: "3%",
  name: "26%",
  default_value: "13%",
  env: "11.6%",
}

function buildColumns() {
  return [
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
          { class: "font-mono font-semibold break-all" },
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
}

function renderColgroup() {
  return h("colgroup", null, [
    h("col", { style: { width: COLUMN_WIDTHS.expand } }),
    h("col", { style: { width: COLUMN_WIDTHS.name } }),
    h("col", { style: { width: COLUMN_WIDTHS.default_value } }),
    ...ALL_ENVS.map(() => h("col", { style: { width: COLUMN_WIDTHS.env } })),
  ])
}

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
    const columns = buildColumns()

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
        h(Table, { class: "table-fixed" }, {
          default: () => [
            renderColgroup(),
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
                            class: "comparison-detail-cell p-4",
                          },
                          {
                            default: () =>
                              h(ComparisonRowDetail, {
                                row: row.original,
                                pgVersion: categoryProps.pgVersion,
                              }),
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
  <div v-if="formattedConfigs.length > 0" class="comparison-tables">
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

.comparison-tables :deep([data-slot="table"]) {
  table-layout: fixed;
}

.comparison-tables :deep(th),
.comparison-tables :deep(td) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.comparison-tables :deep(th:first-child),
.comparison-tables :deep(td:first-child) {
  width: 2.5rem;
}

.comparison-tables :deep(td.comparison-detail-cell) {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}

.comparison-detail-btn-primary {
  background-color: #00d1b2;
  color: #fff;
}

.comparison-detail-btn-primary:hover {
  background-color: #00c4a7;
}

.comparison-detail-btn-secondary {
  background-color: var(--card);
  color: var(--foreground);
  border-color: var(--border);
}

.comparison-detail-btn-secondary:hover {
  background-color: var(--muted);
}

.comparison-detail-docs :deep(p) {
  margin-bottom: 0.75rem;
}

.comparison-detail-docs :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
