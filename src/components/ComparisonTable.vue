<template>
  <div v-if="formattedConfigs.length > 0">
    <div v-for="item in formattedConfigs" :key="item.name" class="container content">
      <h3 class="subtitle">{{ item.name }}</h3>
      <b-table :data="item.params" detailed detail-key="name" :columns="columns" :hoverable="true">
        <template #detail="props">
          <div class="columns is-mobile">
            <div class="column content">
              <div class="abstract-text" v-html="renderMarkdown(props.row.documentation.abstract)"></div>
              <div v-if="props.row.documentation.recomendations">
                <p>Suggested readings:</p>
                <ul>
                  <li v-for="(url,desc) in props.row.documentation.recomendations" :key="desc">
                    <a :href="url" target="_blank">{{ desc }}</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="column">
              <div class="box">
                <article class="media">
                  <div class="media-content">
                    <div class="content">
                      <strong>{{ props.row.name }}</strong>
                      <small>&nbsp;({{ props.row.documentation.type }})</small>
                      <p v-for="row in props.row.documentation.details" :key="row">{{ row }}</p>
                      <div class="buttons">
                        <a
                          :href="confURL(props.row.name)"
                          target="_blank"
                          class="button is-primary"
                        >
                          <b-icon icon="lightbulb" size="is-small"></b-icon>
                          <span>
                            Learn more on Postgresql<strong>co.nf</strong>
                          </span>
                        </a>
                        <a
                          :href="props.row.documentation.url"
                          target="_blank"
                          class="button is-light"
                        >
                          <b-icon icon="file-alt" size="is-small"></b-icon>
                          <span>Check the docs</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { formatConfigs } from "../services/formatters";
import { marked } from "marked";
import { configureMarked } from "../utils/markdownAlerts";
import "../assets/github-alerts.css";

// Configure marked with GitHub alerts extension
configureMarked(marked);

export default {
  name: "ParamsTable",
  props: {
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
  },
  watch: {},
  computed: {
    columns() {
      this.$buefy.snackbar.open({
        message: `Comparing the <b>${this.currentEnv.toUpperCase()}</b> profile against all profiles.`,
        actionText: null,
        type: 'is-info',
      });
      var out = [
        {
          field: "name",
          cellClass: "is-family-code has-text-weight-semibold",
        },
        {
          field: "documentation.default_value",
          label: "Default Value",
          width: "200",
          headerClass: "is-default-column",
          cellClass: "is-default-column is-family-code",
        },
      ];

      const allEnvs = ["web", "oltp", "dw", "mixed", "desktop"];

      for (let i = 0; i < allEnvs.length; i++) {
        var newCol = {
          field: allEnvs[i],
          label: allEnvs[i].toUpperCase(),
          width: 100,
        };

        if (allEnvs[i].toUpperCase() === this.currentEnv.toUpperCase()) {
          Object.assign(newCol, {
            headerClass: "is-selected-column",
            cellClass: "is-selected-column is-family-code",
          });
        } else {
          newCol.cellClass = "is-family-code";
        }
        out.push(newCol);
      }

      return out;
    },
    formattedConfigs() {
      if (!this.fullResponse) return [];
      return formatConfigs(this.fullResponse);
    },
  },
  methods: {
    confURL(param) {
      return `https://postgresqlco.nf/en/doc/param/${param}/${this.pgVersion}/`;
    },
    renderMarkdown(text) {
      if (!text) return '';
      return marked(text, { breaks: true });
    },
  },
};
</script>

<style>
.is-selected-column {
  background: var(--bulma-primary) !important;
  color: var(--bulma-primary-invert) !important;
}
.is-default-column {
  background: var(--bulma-scheme-main-bis) !important;
}
.abstract-text {
  margin-top: 10px;
  margin-bottom: 1rem;
}
</style>
