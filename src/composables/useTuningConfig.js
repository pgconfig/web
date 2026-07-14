import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import lodash from "lodash";
import { toast } from "vue-sonner";
import { buildUrlArgs, parseFormQuery } from "@/utils/formQuery";

export function useTuningConfig(http) {
  const route = useRoute();
  const isLoading = ref(false);
  const form = ref(null);
  const exportForm = ref(null);
  const fullResponse = ref([]);
  const exportedResponse = ref({ output: {} });

  const pgVersion = computed(() => form.value?.pg_version?.toString() ?? "");
  const currentEnv = computed(() => form.value?.environment_name ?? "");

  const urlArgs = computed(() => buildUrlArgs(form.value));

  const exportArgs = computed(() => {
    if (!exportForm.value) return "";
    return Object.entries(exportForm.value)
      .filter(([, v]) => v !== false)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
  });

  async function callAPI(url, opts, args) {
    isLoading.value = true;
    let output = {};
    try {
      const response = await http.get(`${url}?${opts}&${args}`);
      output = response.data.data;
      if (typeof response.data === "string") output = response.data;
    } catch (e) {
      toast.error("Could not get data from the API", {
        description: String(e),
      });
    }
    isLoading.value = false;
    return output;
  }

  async function updateComparisonResponse(args) {
    if (args === "") return;
    const result = await callAPI(
      "/get-config-all-environments",
      "show_doc=true&format=json",
      args
    );
    fullResponse.value = Array.isArray(result) ? result : [];
  }

  async function updateExportResponse(opts) {
    if (opts === "") return;
    exportedResponse.value.output = await callAPI(
      "/get-config",
      opts,
      urlArgs.value
    );
  }

  function setForm(newForm) {
    if (form.value && lodash.isEqual(form.value, newForm)) return;
    form.value = newForm;
    const args = buildUrlArgs(newForm);
    if (args) {
      updateComparisonResponse(args);
      updateExportResponse(exportArgs.value);
    }
  }

  function setExportForm(newExportForm) {
    exportForm.value = newExportForm ?? [];
    if (urlArgs.value) {
      updateExportResponse(exportArgs.value);
    }
  }

  function bootstrapFromRoute() {
    setForm(parseFormQuery(route.query));
  }

  onMounted(() => {
    if (!form.value) {
      bootstrapFromRoute();
    }
  });

  watch(
    () => route.query,
    (query) => {
      const parsed = parseFormQuery(query);
      if (form.value && lodash.isEqual(form.value, parsed)) return;
      setForm(parsed);
    },
    { deep: true }
  );

  watch(exportArgs, (opts) => {
    if (opts && urlArgs.value) {
      updateExportResponse(opts);
    }
  });

  return {
    isLoading,
    form,
    exportForm,
    fullResponse,
    exportedResponse,
    pgVersion,
    currentEnv,
    setForm,
    setExportForm,
  };
}
