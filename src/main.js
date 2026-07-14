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
    { path: "/", name: "compare", component: ComparePage, alias: ["/tuning"] },
    { path: "/export", name: "export", component: ExportPage },
  ],
});

app.use(router);

app.config.globalProperties.$http = http;

app.mount("#app");
