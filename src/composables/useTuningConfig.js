import { ref, computed, watch } from 'vue';
import { toast } from 'vue-sonner';

export function useTuningConfig(http) {
  const isLoading = ref(false);
  const form = ref(null);
  const exportForm = ref(null);
  const fullResponse = ref([]);
  const exportedResponse = ref({ output: {} });

  const pgVersion = computed(() => form.value?.pg_version?.toString() ?? '');
  const currentEnv = computed(() => form.value?.environment_name ?? '');

  const urlArgs = computed(() => {
    if (!form.value) return '';
    return Object.entries(form.value)
      .map(([k, v]) => (k === 'total_ram' ? `${k}=${v}GB` : `${k}=${v}`))
      .join('&');
  });

  const exportArgs = computed(() => {
    if (!exportForm.value) return '';
    return Object.entries(exportForm.value)
      .filter(([, v]) => v !== false)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
  });

  async function callAPI(url, opts, args) {
    isLoading.value = true;
    let output = {};
    try {
      const response = await http.get(`${url}?${opts}&${args}`);
      output = response.data.data;
      if (typeof response.data === 'string') output = response.data;
    } catch (e) {
      toast.error('Could not get data from the API', { description: String(e) });
    }
    isLoading.value = false;
    return output;
  }

  async function updateComparisonResponse(args) {
    if (args === '') return;
    fullResponse.value = await callAPI('/get-config-all-environments', 'show_doc=true&format=json', args);
  }

  async function updateExportResponse(opts) {
    if (opts === '') return;
    exportedResponse.value.output = await callAPI('/get-config', opts, urlArgs.value);
  }

  function setForm(newForm) { form.value = newForm; }
  function setExportForm(newExportForm) { exportForm.value = newExportForm ?? []; }

  watch(urlArgs, (args) => {
    updateComparisonResponse(args);
    updateExportResponse(exportArgs.value);
  });

  watch(exportArgs, (opts) => {
    updateExportResponse(opts);
    updateComparisonResponse(urlArgs.value);
  });

  return {
    isLoading, form, exportForm, fullResponse, exportedResponse,
    pgVersion, currentEnv, setForm, setExportForm,
  };
}
