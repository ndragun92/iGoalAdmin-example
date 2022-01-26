import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";

// Custom Package Registrations
import VueImageChooser from "vue-image-chooser";
Vue.use(VueImageChooser);
import Notifications from "vue-notification";
Vue.use(Notifications);
// End

Vue.config.productionTip = false;

axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL;
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "accessToken"
)}`;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
