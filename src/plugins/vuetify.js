import Vue from 'vue';
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib';
// import VuetifyToast from 'vuetify-toast-snackbar-ng';
import VuetifyDialog from 'vuetify-dialog';
import 'vuetify-dialog/dist/vuetify-dialog.css';
import colors from 'vuetify/lib/util/colors'
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

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.blue,
        secondary: colors.grey.darken1,
        accent: colors.shades.black,
        error: colors.red.accent3,
        background: "#FFF" ,
        vote_button:'#6979F8',
        // start_unstake:'#E2E4EA',
        chips:"#E2E4EA",
        input_other:'#FFF',
        current_wallet:"#6979F8",
        // input_other:'#F5F5F7',
      },
      dark: {
        primary: '#FFF',
        vote_button:'#6979F8',
        start_unstake:'#595777',
        radio_day:'#5A5878',
        input_other:'#4C4A68',
        background: "#1D1A36" ,
        stake_background:"#100D22",
        list_title:"#252243",
        btn_button:"#9F9DB9",
        chips:"#504985",
        current_wallet:"#403E59",
      },
    },
    options: {
      customProperties: true
    },
  },
})

