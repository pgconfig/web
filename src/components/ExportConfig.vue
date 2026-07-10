<template>
  <div>
    <div class="columns is-desktop is-vcentered">
      <div class="column">
        <dropdown-select
          label="Export Format"
          v-model="exportForm.format"
          :options="[
            { value: 'alter_system', label: 'ALTER SYSTEM commands' },
            { value: 'conf', label: 'UNIX-like config file' },
            { value: 'stackgres', label: 'StackGres-like YAML file' },
          ]"
        ></dropdown-select>
      </div>
      <div class="column">
        <dropdown-select
          label="Log Format"
          v-model="exportForm.log_format"
          :disabled="showLogFormat"
          :options="logFormatOptions"
        ></dropdown-select>
      </div>
      <div class="column">
        <b-switch v-model="exportForm.include_pgbadger"
          >Include PGBadger log configuration</b-switch
        >
      </div>
    </div>
    <div class="columns">
      <div class="container code-container">
        <b-button
          type="is-primary is-light"
          @click="copyToClipboard"
          size="is-small"
          class="copy-button"
        >
          <b-icon icon="copy" size="is-small"></b-icon>
          <span>&nbsp;Copy</span>
        </b-button>
        <pre><code ref="codeBlock" :class="highlightLang"></code></pre>
      </div>
    </div>
  </div>
</template>

<script>
// https://github.com/Inndy/vue-clipboard2
import hljs from 'highlight.js/lib/core';
import yaml from 'highlight.js/lib/languages/yaml';
import sql from 'highlight.js/lib/languages/sql';
import ini from 'highlight.js/lib/languages/ini';
import DropdownSelect from './DropdownSelect.vue';

hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('ini', ini);

export default {
  name: "ExportConfig",
  components: {
    DropdownSelect,
  },
  props: {
    exportedResponse: {
      type: Object,
      required: true,
    },
    pgVersion: {
      type: String,
      required: true,
    },
  },

  watch: {
    pgVersion: {
      immediate: true,
      handler(newVersion) {
        // Update log_format when PostgreSQL version changes
        const version = parseFloat(newVersion);
        const defaultLogFormat = version >= 15 ? "jsonlog" : "csvlog";

        // If version < 15 and current format is jsonlog, switch to csvlog
        if (version < 15 && this.exportForm.log_format === "jsonlog") {
          this.exportForm.log_format = "csvlog";
        }
        // If version >= 15 and current format is csvlog, switch to jsonlog
        else if (version >= 15 && this.exportForm.log_format === "csvlog") {
          this.exportForm.log_format = "jsonlog";
        }
        // On initial load, set the default
        else if (!this.exportForm.log_format) {
          this.exportForm.log_format = defaultLogFormat;
        }
      },
    },
    exportForm: {
      immediate: true,
      deep: true,
      handler(newForm) {
        this.$emit("changingForm", newForm);
        this.$nextTick(() => {
          this.highlightCode();
        });
      },
    },
    exportedResponse: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.highlightCode();
        });
      },
    },
  },
  mounted() {
    this.highlightCode();
  },
  data() {
    return {
      exportForm: {
        format: "conf",
        include_pgbadger: true,
        log_format: "", // Will be set by pgVersion watcher
      },
    };
  },
  methods: {
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(String(this.exportedResponse.output));
        this.onCopy();
      } catch (e) {
        this.onError(e);
      }
    },
    onCopy: function () {
      this.$buefy.snackbar.open({
        message: `Copied to clipboard`,
        actionText: null,
        type: "is-info",
      });
    },
    onError: function (e) {
      alert(`Failed to copy texts: ${e}`);
    },
    highlightCode() {
      if (this.$refs.codeBlock && this.exportedResponse.output) {
        const output = String(this.exportedResponse.output);
        const result = hljs.highlight(output, { language: this.highlightLang });
        this.$refs.codeBlock.innerHTML = result.value;
      }
    },
  },
  computed: {
    logFormatOptions() {
      const opts = [
        { value: 'stderr', label: 'Standard Error output' },
        { value: 'csvlog', label: 'Comma-separated values' },
        { value: 'syslog', label: 'Syslog daemon' },
      ];
      if (this.supportsJsonLog) {
        opts.push({ value: 'jsonlog', label: 'JSON Log' });
      }
      return opts;
    },
    supportsJsonLog() {
      return parseFloat(this.pgVersion) >= 15;
    },
    showLogFormat() {
      return !this.exportForm.include_pgbadger;
    },
    highlightLang() {
      switch (this.exportForm.format) {
        case "alter_system":
          return "sql";
        case "stackgres":
          return "yaml";
        case "json":
          return "json";
        default:
          return "ini";
      }
    },
  },
};
</script>

<style scoped>
.hljs {
  padding: 1em;
}
pre {
  background: var(--bulma-scheme-main-ter);
  border: 1px solid var(--bulma-border-weak);
  border-radius: 6px;
  padding: 0;
  overflow-x: auto;
}
.code-container {
  position: relative;
}
.copy-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
</style>
