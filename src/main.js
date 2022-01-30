import { createApp } from 'vue';
import VueAxios from 'vue-axios';
import VueSweetalert2 from 'vue-sweetalert2';
import CKEditor from '@ckeditor/ckeditor5-vue';
import store from './store';
import App from './App.vue';
import router from './router';
import VeeValidatePlugin from './includes/validation';
import axios from './includes/axiosConfig';
import './assets/custom.css';

/* import fontawesome Library */
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all';

/* bootstrap 5 */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

/* sweet alert 2 */
// eslint-disable-next-line import/no-extraneous-dependencies
import 'sweetalert2/dist/sweetalert2.min.css';

function createVueInstance() {
  const app = createApp(App);

  app.use(CKEditor);
  app.use(store);
  app.use(router);
  app.use(VeeValidatePlugin);
  app.use(VueAxios, axios);
  app.use(VueSweetalert2);

  app.mount('#app');
}

if (localStorage.getItem('IS-token') != null) {
  store.dispatch('restoreSession').then(() => {
    createVueInstance();
  });
} else {
  createVueInstance();
}
