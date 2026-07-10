<template>
  <div id="app">
    <section class="hero is-small is-dark is-bold">
      <div class="hero-body is-align-items-stretch">
        <div class="container">
          <div class="columns">
            <div class="column">
              <div class="logo">
                <img
                  src="/pgconfig.svg"
                  style="
                    max-width: 120px;
                    max-height: 120px;
                    float: left;
                    padding-right: 10px;
                  "
                  alt="dashboard logo"
                />
              </div>
              <p class="title" style="padding-top: 15px">PostgreSQL</p>
              <p class="subtitle">Configuration Builder</p>
            </div>
            <div class="column">
              <nav
                role="navigation"
                aria-label="main navigation"
                class="navbar"
              >
                <div class="container">
                  <div class="navbar-menu is-active">
                    <div class="navbar-end">
                      <a class="navbar-item is-active">Home</a>
                      <a
                        rel="noreferrer"
                        href="https://github.com/pgconfig/api"
                        target="_blank"
                        class="navbar-item"
                        ><i class="fa-fw fab fa-github mr-2"></i> Contribute
                      </a>
                      <a
                        rel="noreferrer"
                        href="https://docs.pgconfig.org"
                        target="_blank"
                        class="navbar-item"
                        ><i class="fa-fw fas fa-book mr-2"></i> Documentation
                      </a>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <config-form v-on:changingForm="formChange"></config-form>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <tabs
              v-on:changingForm="formExportChange"
              :fullResponse="fullResponse"
              :exportedResponse="exportedResponse"
              :pgVersion="pgVersion"
              :currentEnv="currentEnv"
            ></tabs>
          </div>
        </div>
      </div>
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>PGConfig.org</strong> code available on
          <a href="https://github.com/pgconfig">GitHub</a>.
        </p>
      </div>
    </footer>
    <b-loading
      :is-full-page="true"
      v-model="isLoading"
      :can-cancel="false"
    ></b-loading>
  </div>
</template>

<script>
import ConfigForm from "./components/Form.vue";
import Tabs from "./components/Tabs.vue";

export default {
  name: "App",
  data() {
    return {
      isLoading: false,
      form: undefined,
      exportForm: undefined,
      fullResponse: [],
      exportedResponse: {
        output: {},
      },
    };
  },
  components: {
    ConfigForm,
    Tabs,
  },
  watch: {
    urlArgs: {
      immediate: true,
      async handler(args) {
        this.updateComparizonResponse(args);
        this.updateExportResponse(this.exportArgs);
      },
    },
    exportArgs: {
      immediate: true,
      async handler(opts) {
        this.updateExportResponse(opts);
        this.updateComparizonResponse(this.urlArgs);
      },
    },
  },
  computed: {
    pgVersion() {
      if (!this.form) return "";
      return this.form.pg_version.toString();
    },
    currentEnv() {
      if (!this.form) return "";
      return this.form.environment_name;
    },
    urlArgs() {
      if (!this.form) return "";

      const args = Object.entries(this.form).map(function ([k, v]) {
        if (k === "total_ram") {
          return `${k}=${v}GB`;
        }

        return `${k}=${v}`;
      });

      return args.join("&");
    },
    exportArgs() {
      if (!this.exportForm) return "";

      const args = Object.entries(this.exportForm).map(function ([k, v]) {
        if (v !== false) {
          return `${k}=${v}`;
        }
      });

      return args.join("&");
    },
  },
  methods: {
    tableIsLoading(val) {
      this.isLoading = val;
    },
    formChange(form) {
      // debugger;
      this.form = form;

      // this.$router
      //   .push({
      //     // path: '/',
      //     query: form,
      //   })
      //   .catch((failure) => {
      //     console.log(failure);
      //     // if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
      //     //   // show a small notification to the user
      //     //   showToast("Login in order to access the admin panel");
      //     // }
      //   });
    },
    async formExportChange(exportForm) {
      if (!exportForm) {
        this.exportForm = [];
        return;
      }

      this.exportForm = exportForm;
    },
    async updateComparizonResponse(args) {
      var url = "/get-config-all-environments";
      var opts = "show_doc=true&format=json";

      if (args === "") return;

      this.fullResponse = await this.callAPI(url, opts, args);
    },
    async updateExportResponse(opts) {
      var url = "/get-config";

      if (opts === "") return;

      this.exportedResponse.output = await this.callAPI(
        url,
        opts,
        this.urlArgs
      );
    },
    async callAPI(url, opts, args) {
      this.isLoading = true;

      var output = {};

      try {
        const response = await this.$http.get(`${url}?${opts}&${args}`);

        output = response.data.data;

        if (typeof response.data === "string") {
          output = response.data;
        }
      } catch (e) {
        this.$buefy.dialog.alert({
          title: "Error",
          message: `Could not get data from the API: <pre>${e}</pre>`,
          type: "is-danger",
          hasIcon: false,
          icon: "times-circle",
          iconPack: "fa",
          ariaRole: "alertdialog",
          ariaModal: true,
        });
      }

      this.isLoading = false;

      return output;
    },
  },
};
</script>

<style>
</style>
