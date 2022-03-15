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
        secondary: '#FFF',
        accent: colors.shades.black,
        error: colors.red.accent3,
        background: "#FFF" ,
        vote_button:'#6979F8',
        // start_unstake:'#E2E4EA',
        chips:"#E2E4EA",
        input_other:'#F5F5F7',
        current_wallet:"#6979F8",
        // input_other:'#F5F5F7',
        validator:'#868E9E',
        btn_button:'#868E9E',
        chip_group:'#6979F8',
        right_icon:'#868E9E',
        header_account:'#D3D3D3',
        faq_border:"#E2E4EA"
      },
      dark: {
        primary: '#FFF',
        secondary: '#1D1A36',
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
        validator:'#868E9E',
        right_icon:'#5c5a7a',
        header_account:'#6979F8',
        faq_border:"#504985"
      },
    },
    options: {
      customProperties: true
    },
  },
})

