<template>
  <v-app-bar app flat :class="dark ? 'background' : 'background'">
    <span class="d-sm-flex d-md-none flex-sm-column flex-xs-row align-center justify-center">
      <router-link to="/">
        <!-- <v-avatar color="grey" size="25"> -->
          <v-img 
            class="mr-4" 
            max-height="25"
            max-width="25"
            src="../assets/images/rei.svg" >
          </v-img>
        <!-- </v-avatar> -->
      </router-link>
    </span>
    <v-spacer></v-spacer>
    <account-dialog />
    <settings-dialog />
  </v-app-bar>
</template>
<script>
import { mapGetters } from 'vuex';
import AccountDialog from './AccountDialog';
import SettingsDialog from './SettingsDialog';
export default {
  components: {
    AccountDialog,
    SettingsDialog
  },
  computed: {
    ...mapGetters({
      dark: 'dark'
    })
  },
  methods: {
    go(link) {
      this.$router.replace(link);
    }
  },
  data() {
    return {
      version: process.env.VUE_APP_VERSION
    };
  }
};
</script>
<style scoped lang="scss">
.theme--dark.v-app-bar.v-toolbar.v-sheet{
  background: #1D1A36;
}
.theme--light.v-app-bar.v-toolbar.v-sheet{
  background: #FFFFFF;
}
</style>
