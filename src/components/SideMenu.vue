<template>
  <v-navigation-drawer app permanent v-if="$vuetify.breakpoint.mdAndUp" class="background side-menu">
    <v-sheet class="d-flex pa-4 align-center" color="background">
      <router-link to="/">
        <!-- <v-avatar class="mr-4" color="grey" size="64" rounded="true"> -->
            <v-img v-if="dark"
                class="mr-4" 
                max-height="64"
                max-width="144"
                src="../assets/images/REI-DAO-Night.svg"
                ></v-img>
                <v-img v-else
                class="mr-4" 
                max-height="64"
                max-width="144"
                src="../assets/images/REI-DAO.svg"
                ></v-img>
        <!-- </v-avatar> -->
      </router-link>
      <!-- <div class="d-flex flex-column">
        <span>{{ $t('app.name') }}</span>
        <small class="text--secondary">{{ version }}</small>
      </div> -->
    </v-sheet>
    <!-- <v-divider></v-divider> -->
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
          icon: '&#xe61d;',
          text: 'Dashboards',
          link: '/dashboards',
          name: 'dashboards',
          show: true,
        },
        {
          icon: '&#xe620;',
          text: 'My Account',
          link: '/myAccount',
          name: 'myAccount',
          show: true,
        },
        {
          icon: '&#xe623;',
          text: 'stake.staking',
          link: '/stake',
          name: 'stake',
          show: true,
        },
        {
          icon: '&#xe61f;',
          text: 'stakeforgas.title',
          link: '/stakeforgas',
          name: 'stakeforgas',
          show: true,
        },
        {
          icon: '&#xe61e;',
          text: 'Governance',
          link: '/governance',
          name: 'governance',
          show: true,
        },
        {
          icon: '&#xe621;',
          text: 'Bridges',
          link: '/bridge',
          name: 'bridge',
          show: true,
        },
        {
          icon: '&#xe622;',
          text: 'Grants',
          link: '/grants',
          name: 'grants',
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
.theme--light.side-menu{
   box-shadow: 0 0 20px #ddd !important;
}
.v-list .v-list-item--active{
  color: white;
  background:#6979f8 ;
}

.theme--dark.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled){
  color: #868e9e;
}
.iconfont{
  font-size: 18px;
}
</style>
