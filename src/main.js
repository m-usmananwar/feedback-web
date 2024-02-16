import { createApp } from 'vue'
import App from './App.vue'
import axiosConfig from './config/axios-config';
import router from "./router";
import toasterMixin from './mixins/toasterMixin';
import store from './store/store';

const app = createApp(App);
app.mixin(toasterMixin);
app.use(router);
app.use(store);
app.config.globalProperties.$axios = axiosConfig;

app.mount('#app');
