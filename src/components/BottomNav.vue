<template>
  <v-bottom-navigation app class="d-md-none" color="primary" background-color="background" v-model="value">
      <template v-for="link in links">
        <v-btn  @click="go($event, link.link)" :key="link.text" :value="link.name">
               <!-- <span>{{ $t(link.text) }}</span> -->
        <span class="iconfont" v-html="link.icon"></span>
        </v-btn>
     </template>
      <v-menu
      top
      :offset-y="offset"
      color="primary"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
        >
            <v-icon>mdi-dots-horizontal</v-icon>
        </v-btn>
      </template>
      <template v-for="link in items">
        <div class="more-btn" @click="go($event, link.link)" :key="link.text" v-if="link.show">
          <v-btn >
        <!-- <span>{{ $t(link.text) }}</span> -->
            <!-- <span class="iconfont" v-html="link.icon"></span> -->
            <span>{{ link.name }}</span>
         </v-btn>
        </div>
     </template>
    </v-menu>
  </v-bottom-navigation>
</template>
<script>
import { mapGetters } from 'vuex';
import find from 'lodash/find';
export default {
  data() {
    return {
      value:'',
      offset:true,
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
      ],
        items:[
        {
          icon: '&#xe605;',
          text: 'stakeforgas.title',
          link: '/stakeforgas',
          name: 'Gas Stake',
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
          icon: '&#xe61c;',
          text: 'Bridge',
          link: '/bridge',
          name: 'bridge',
          show: true,
        },
        {
          icon: '&#xe60c;',
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
  watch: {
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
.theme--light.v-btn.v-btn--has-bg{
  background-color: #FFF;
}
.more-btn{
  .v-btn{
    width: 160px;
    justify-content: flex-start !important;
    text-transform: capitalize;
  }
}
</style>
