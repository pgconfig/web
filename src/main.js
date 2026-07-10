import { createApp } from "vue";
import "./assets/globals.css";
import { createRouter, createWebHistory } from "vue-router";
import "highlight.js/styles/github.css";
import "./assets/hljs-dark.css";
import http from "./http";
import App from "./App.vue";
import ComparePage from "./pages/ComparePage.vue";
import ExportPage from "./pages/ExportPage.vue";

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: App,
      children: [
        { path: "", component: ComparePage, name: "compare" },
        { path: "tuning", redirect: { name: "compare" } },
        { path: "export", component: ExportPage, name: "export" },
      ],
    },
  ],
});

app.use(router);

app.config.globalProperties.$http = http;

app.mount("#app");
