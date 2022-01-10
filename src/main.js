import 'babel-polyfill'
import "url-search-params-polyfill"; //让ie支持URLSearchParams
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui"; //导入element UI
import "element-ui/lib/theme-chalk/index.css";
import "font-awesome/css/font-awesome.min.css";
import "normalize.css/normalize.css"; //css重置
import "@/styles/index.scss";
import "@/assets/css/common/mtStyle.scss";

Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
   router,
   store,
   render: h => h(App)
}).$mount("#app");
