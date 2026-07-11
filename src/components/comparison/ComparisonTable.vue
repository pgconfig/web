<script setup>
import { computed, defineComponent, h, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useVueTable,
} from "@tanstack/vue-table"
import { RiArrowDownSLine, RiArrowRightSLine } from "@remixicon/vue"
import { toast } from "vue-sonner"
import { formatConfigs } from "@/services/formatters"
import { ENV_COLUMN_TO_PROFILE } from "@/constants/environmentOptions"
import { valueUpdater } from "@/components/ui/table/utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import ComparisonRowDetail from "@/components/comparison/ComparisonRowDetail.vue"
import { Skeleton } from "@/components/ui/skeleton"
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
            h(row.getIsExpanded() ? RiArrowDownSLine : RiArrowRightSLine, {
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
          { class: "font-medium break-all" },
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

const route = useRoute()
const router = useRouter()

function selectProfile(env) {
  const environment_name = ENV_COLUMN_TO_PROFILE[env]
  if (!environment_name) return
  router.push({
    query: {
      ...route.query,
      environment_name,
    },
  })
}

function envColumnProps(column) {
  const meta = column.columnDef.meta
  if (!meta?.env) return {}
  return {
    onClick: () => selectProfile(meta.env),
  }
}

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
    return cn("comparison-col-selected-header", "cursor-pointer")
  }
  if (meta?.env) return "cursor-pointer"
  return ""
}

function cellClass(column, currentEnv) {
  const meta = column.columnDef.meta
  if (meta?.columnType === "default") {
    return "comparison-col-default tabular-nums"
  }
  if (meta?.env && isSelected(meta.env, currentEnv)) {
    return cn("comparison-col-selected", "tabular-nums", "cursor-pointer")
  }
  if (meta?.env) return cn("tabular-nums", "cursor-pointer")
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

      return h("section", { class: "space-y-4" }, [
        h(
          "h2",
          {
            class:
              "border-b pb-4 text-sm font-medium leading-none",
          },
          categoryProps.title
        ),
        h(Table, { class: "table-fixed border-0" }, {
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
                            ...envColumnProps(header.column),
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
                  const mainRow = h(TableRow, {
                    key: row.id,
                    class: "hover:bg-muted/50 data-[state=selected]:bg-muted",
                  }, {
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
                            ...envColumnProps(cell.column),
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
                            class: "bg-muted/40 p-4",
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
  <div v-if="formattedConfigs.length > 0" class="comparison-tables min-w-0 max-w-full space-y-8">
    <ComparisonCategoryTable
      v-for="item in formattedConfigs"
      :key="item.name"
      :title="item.name"
      :params="item.params"
      :pg-version="pgVersion"
      :current-env="currentEnv"
    />
  </div>
  <div v-else class="space-y-3 py-8">
    <Skeleton class="h-8 w-48" />
    <Skeleton class="h-40 w-full" />
    <Skeleton class="h-40 w-full" />
  </div>
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

.comparison-detail-docs :deep(p) {
  margin-bottom: 0.75rem;
}

.comparison-detail-docs :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
