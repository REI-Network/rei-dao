<template>
  <v-navigation-drawer app permanent v-if="$vuetify.breakpoint.mdAndUp" class="background">
    <v-sheet class="d-flex pa-4 align-center" color="background">
      <router-link to="/">
        <!-- <v-avatar class="mr-4" color="grey" size="64" rounded="true"> -->
            <v-img v-if="dark"
                class="mr-4" 
                max-height="54"
                max-width="164"
                src="../assets/images/REI DAOwhite.svg"
                ></v-img>
                <v-img v-else
                class="mr-4" 
                max-height="54"
                max-width="164"
                src="../assets/images/REI DAO.svg"
                ></v-img>
        <!-- </v-avatar> -->
      </router-link>
      <!-- <div class="d-flex flex-column">
        <span>{{ $t('app.name') }}</span>
        <small class="text--secondary">{{ version }}</small>
      </div> -->
    </v-sheet>
    <v-divider></v-divider>
    <v-list>
      <template v-for="{ icon, text, link, show } in links">
        <v-list-item :key="text" link :to="link" v-if="show">
            <v-list-item-icon>
            <!-- <v-icon class="iconfont">{{ icon }}</v-icon> -->
            <span class="iconfont" v-html="icon"></span>
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
      showItem:false,
      version: process.env.VUE_APP_VERSION,
      links: [
        {
          icon: '&#xe604;',
          text: 'Dashboards',
          link: '/dashboards',
          name: 'dashboards',
          show: true,
        },
        {
          icon: '&#xe603;',
          text: 'My Account',
          link: '/myAccount',
          name: 'myAccount',
          show: true,
        },
        {
          icon: '&#xe601;',
          text: 'stake.staking',
          link: '/stake',
          name: 'stake',
          show: true,
        },
        {
          icon: '&#xe605;',
          text: 'stakeforgas.title',
          link: '/stakeforgas',
          name: 'stakeforgas',
          show: true,
        },
        {
          icon: '&#xe615;',
          text: 'Governance',
          link: '/governance',
          name: 'governance',
          show: true,
        },
        {
          icon: '&#xe615;',
          text: 'Bridge',
          link: '/bridge',
          name: 'bridge',
          show: true,
        }
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
  }
};
</script>
<style scoped lang="scss">
.v-list .v-list-item--active{
  color: white;
  background:#6979f8 ;
}

.theme--dark.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled){
  color: #868e9e;
}
</style>
