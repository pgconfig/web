<template>
  <div>
    <div class="columns box">
      <div class="column is-three-quarters">
        <h2 class="bd-notification form-header">
          <span class="icon is-medium">
            <i class="fas fa-server"></i>
          </span>
          Server
        </h2>
        <div class="columns is-desktop">
          <div class="column">
            <dropdown-select
              label="Operating system"
              v-model="form.os_type"
              :options="[
                { value: 'linux', label: 'GNU/Linux Based' },
                { value: 'windows', label: 'Windows Based' },
                { value: 'unix', label: 'Unix Based' },
              ]"
            ></dropdown-select>
          </div>
          <div class="column">
            <dropdown-select
              label="Architecture"
              v-model="form.arch"
              :options="[
                { value: 'x86-64', label: '64 Bits (x86-64)' },
                { value: '386', label: '32 Bits (386)' },
              ]"
            ></dropdown-select>
          </div>
          <div class="column">
            <dropdown-select
              label="Storage type"
              v-model="form.drive_type"
              :options="[
                { value: 'HDD', label: 'HDD Storage' },
                { value: 'SSD', label: 'SSD Storage' },
                { value: 'SAN', label: 'Network Storage - NAS/SAN' },
              ]"
            ></dropdown-select>
          </div>
        </div>
        <div class="columns is-desktop">
          <div class="column">
            <b-field label="Number of CPUs" label-position="inside">
              <b-numberinput
                min="1"
                controls-position="compact"
                v-model="form.cpus"
              ></b-numberinput>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Total Memory (GB)" label-position="inside">
              <b-numberinput
                min="1"
                controls-position="compact"
                v-model="form.total_ram"
              ></b-numberinput>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Max connections" label-position="inside">
              <b-numberinput
                min="1"
                controls-position="compact"
                v-model="form.max_connections"
              ></b-numberinput>
            </b-field>
          </div>
        </div>
      </div>
      <div class="column">
        <h2 class="bd-notification form-header">
          <span class="icon is-medium">
            <i class="fas fa-database"></i>
          </span>
          Database
        </h2>
        <div class="columns is-mobile">
          <div class="column">
            <dropdown-select
              label="Application profile"
              v-model="form.environment_name"
              :options="[
                { value: 'WEB', label: 'General web applications' },
                { value: 'OLTP', label: 'ERP or long transaction applications' },
                { value: 'DW', label: 'DataWare house and BI Applications' },
                { value: 'Mixed', label: 'DB and APP on the same server' },
                { value: 'Desktop', label: 'Developer local machine' },
              ]"
            ></dropdown-select>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column">
            <dropdown-select
              label="PostgreSQL Version"
              v-model="form.pg_version"
              :parser="parseFloat"
              :options="[
                { value: 18, label: '18 (Latest)' },
                { value: 17, label: '17' },
                { value: 16, label: '16' },
                { value: 15, label: '15' },
                { value: 14, label: '14' },
                { value: 13, label: '13 (EOL)' },
                { value: 12, label: '12 (EOL)' },
                { value: 11, label: '11 (EOL)' },
                { value: 10, label: '10 (EOL)' },
                { value: '9.6', label: '9.6 (EOL)' },
                { value: '9.5', label: '9.5 (EOL)' },
                { value: '9.4', label: '9.4 (EOL)' },
                { value: '9.3', label: '9.3 (EOL)' },
                { value: '9.2', label: '9.2 (EOL)' },
                { value: '9.1', label: '9.1 (EOL)' },
              ]"
            ></dropdown-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lodash from "lodash";
import DropdownSelect from "./DropdownSelect.vue";

export default {
  name: "Form",
  components: {
    DropdownSelect,
  },
  data() {
    return {
      form: {
        max_connections: 100,
        pg_version: 18,
        environment_name: "WEB",
        total_ram: 4,
        cpus: 2,
        drive_type: "SSD",
        arch: "x86-64",
        os_type: "linux",
      },
    };
  },
  computed: {
    valuesFromURL() {
      return this.parseQuery(this.$route.query);
    },
  },
  watch: {
    $route() {
      if (this.valuesFromURL) {
        this.form.max_connections = this.valuesFromURL.max_connections;
        this.form.pg_version = this.valuesFromURL.pg_version;
        this.form.environment_name = this.valuesFromURL.environment_name;
        this.form.total_ram = this.valuesFromURL.total_ram;
        this.form.cpus = this.valuesFromURL.cpus;
        this.form.drive_type = this.valuesFromURL.drive_type;
        this.form.arch = this.valuesFromURL.arch;
        this.form.os_type = this.valuesFromURL.os_type;
      }
    },
    form: {
      deep: true,
      immediate: true,
      handler(newForm) {
        const formWithoutGetters = { ...this.form };

        if (!lodash.isEqual(formWithoutGetters, this.valuesFromURL)) {
          this.$router
            .push({
              query: formWithoutGetters,
            })
            .catch((failure) => {
              console.log(failure);
            });
        }
        this.$emit("changingForm", newForm);
      },
    },
  },
  methods: {
    parserBy(key) {
      const parsers = {
        max_connections: parseInt,
        pg_version: parseFloat,
        total_ram: parseInt,
        cpus: parseInt,
      };
      const defaultParser = (value) => value;
      return parsers[key] || defaultParser;
    },
    parseQuery(query) {
      const parsedValues = Object.entries(query).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: this.parserBy(key)(value) }),
        {}
      );
      return parsedValues;
    },
  },
};
</script>

<style scoped>
.form-header {
  margin-bottom: 0.5em;
  font-size: 1.2em;
  /* color: #7957d5; */
  font-weight: bold;
}
</style>
