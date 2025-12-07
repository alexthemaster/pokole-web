import "./assets/base.css";

import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import { setPokoleUrl } from "./utils/config";

const app = createApp(App);

app.use(router);
setPokoleUrl(window.location.origin);

app.mount("#app");
