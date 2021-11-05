<template>
  <v-navigation-drawer app permanent v-if="$vuetify.breakpoint.mdAndUp">
    <v-sheet class="d-flex pa-4 align-center">
      <router-link to="/">
        <!-- <v-avatar class="mr-4" color="grey" size="64" rounded="true"> -->
            <v-img
                class="mr-4" 
                max-height="48"
                max-width="48"
                src="../assets/images/icon.png"
                ></v-img>
          
        <!-- </v-avatar> -->
      </router-link>
      <div class="d-flex flex-column">
        <span>{{ $t('app.name') }}</span>
        <small class="text--secondary">{{ version }}</small>
      </div>
    </v-sheet>
    <v-divider></v-divider>
    <v-list>
      <v-list-item v-for="{ icon, text, link } in links" :key="text" link :to="link">
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t(text) }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  data() {
    return {
      version: process.env.VUE_APP_VERSION,
      links: [
        {
          icon: 'mdi-text-box-check-outline',
          text: 'stake.staking',
          link: '/stake'
        },
        {
          icon: 'mdi-sack',
          text: 'unstake.title',
          link: '/unstake'
        }
      ]
    };
  }
};
</script>
