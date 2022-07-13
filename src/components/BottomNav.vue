<template>
  <v-bottom-navigation app class="d-md-none" color="primary" background-color="background" v-model="value">
      <template v-for="link in links">
        <v-btn  @click="go($event, link.link)" :key="link.text" v-if="link.show" :value="link.name">
        <!-- <span>{{ $t(link.text) }}</span> -->
        <span class="iconfont" v-html="link.icon"></span>
        </v-btn>
     </template>
  </v-bottom-navigation>
</template>
<script>
import { mapGetters } from 'vuex';
import find from 'lodash/find';
export default {
  data() {
    return {
      value:'',
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
          text: 'MyAccount',
          link: '/myAccount',
          name: 'myAccount',
          show: true
        },
        {
          icon: '&#xe601;',
          text: 'stake.staking',
          link: '/stake',
          name: 'stake',
          show: true
        },
        {
          icon: '&#xe605;',
          text: 'stakeforgas.title',
          link: '/stakeforgas',
          name: 'stakeforgas',
          show: true
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
  mounted(){
   this.getRoute()
  },
  methods: {
    getRoute(){
        let path = find(this.links, (item) => item.link == this.$route.path);
        this.value = path.name;
    },
    go(e, link) {
      if (link != this.$route.path) {
        this.$router.replace(link);
      } else {
        e.preventDefault();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.v-item-group.v-bottom-navigation .v-btn.v-btn--active{
  color: #6979f8;
  background:transparent;
}
.theme--dark.v-bottom-navigation .v-btn:not(.v-btn--active){
   color: #868e9e;
}
.theme--dark.v-bottom-navigation{
  background-color: #1D1a36;
}
</style>
