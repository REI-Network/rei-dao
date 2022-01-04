<template>
  <v-bottom-navigation app class="d-md-none" color="primary">
      <template v-for="link in links">
        <v-btn  @click="go($event, link.link)" :key="link.text" v-if="hideItem(link.name)">
        <span>{{ $t(link.text) }}</span>
        <v-icon>{{ link.icon }}</v-icon>
        </v-btn>
     </template>
  </v-bottom-navigation>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      links: [
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
    go(e, link) {
      if (link != this.$route.path) {
        this.$router.replace(link);
      } else {
        e.preventDefault();
      }
    },
    hideItem(item) {
        if(item =='stakeforgas' && this.connection.network == 'REI Network'){
            return false
        }
        return true
    }
  }
};
</script>
