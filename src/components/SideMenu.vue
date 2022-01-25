<template>
  <v-navigation-drawer app permanent v-if="$vuetify.breakpoint.mdAndUp" class="background">
    <v-sheet class="d-flex pa-4 align-center">
      <router-link to="/">
        <!-- <v-avatar class="mr-4" color="grey" size="64" rounded="true"> -->
            <v-img
                class="mr-4" 
                max-height="48"
                max-width="48"
                src="../assets/images/REI DAO.svg"
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
      <template v-for="{ icon, text, link, name } in links">
        <v-list-item :key="text" link :to="link" v-if="hideItem(name)">
            <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
            <v-list-item-title>{{ $t(text) }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      version: process.env.VUE_APP_VERSION,
      links: [
        {
          icon: 'mdi-alpha-m-box-outline',
          text: 'Dashboards',
          link: '/dashboards',
          name: 'dashboards'
        },
        {
          icon: 'mdi-calendar-account-outline',
          text: 'MyAccount',
          link: '/myAccount',
          name: 'myAccount'
        },
        {
          icon: 'mdi-text-box-check-outline',
          text: 'stake.staking',
          link: '/stake',
          name: 'stake'
        },
        {
          icon: 'mdi-sack',
          text: 'stakeforgas.title',
          link: '/stakeforgas',
          name: 'stakeforgas'
        },
      ]
    };
  },
  computed: {
    ...mapGetters({
        connection: 'connection',
        dark: 'dark'
    })
  },
  methods: {
    hideItem(item) {
        if(item =='stakeforgas' && this.connection.network == 'REI Network'){
            return false
        }
        return true
    }
  }
};
</script>
