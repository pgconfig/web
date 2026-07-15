import { computed, inject, reactive, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import lodash from "lodash"
import { parseFormQuery } from "@/utils/formQuery"

export function useConfigForm() {
  const setForm = inject("setForm", null)
  const route = useRoute()
  const router = useRouter()

  const form = reactive({
    max_connections: 100,
    pg_version: 18,
    environment_name: "WEB",
    total_ram: 4,
    cpus: 2,
    drive_type: "SSD",
    arch: "x86-64",
    os_type: "linux",
  })

  const valuesFromURL = computed(() => parseFormQuery(route.query))

  function syncFormFromRoute() {
    const fromUrl = valuesFromURL.value
    form.max_connections = fromUrl.max_connections
    form.pg_version = fromUrl.pg_version
    form.environment_name = fromUrl.environment_name
    form.total_ram = fromUrl.total_ram
    form.cpus = fromUrl.cpus
    form.drive_type = fromUrl.drive_type
    form.arch = fromUrl.arch
    form.os_type = fromUrl.os_type
  }

  watch(() => route.fullPath, syncFormFromRoute, { immediate: true })

  watch(
    form,
    () => {
      const formWithoutGetters = { ...form }

      if (!lodash.isEqual(formWithoutGetters, valuesFromURL.value)) {
        router
          .push({
            query: formWithoutGetters,
          })
          .catch((failure) => {
            console.log(failure)
          })
      }
      setForm?.({ ...form })
    },
    { deep: true, immediate: true }
  )

  function updateNumberField(field, value) {
    form[field] = parseInt(String(value), 10) || 1
  }

  function updatePgVersion(value) {
    form.pg_version = parseFloat(String(value))
  }

  return {
    form,
    updateNumberField,
    updatePgVersion,
  }
}
