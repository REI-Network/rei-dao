import Vue from 'vue';
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib';
// import VuetifyToast from 'vuetify-toast-snackbar-ng';
import VuetifyDialog from 'vuetify-dialog';
import 'vuetify-dialog/dist/vuetify-dialog.css';
// import store from '../store';

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon
  }
});
const vuetify = new Vuetify({});

Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
});

export default vuetify;
