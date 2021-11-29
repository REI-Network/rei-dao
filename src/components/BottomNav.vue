<template>
  <v-bottom-navigation app class="d-md-none" color="primary">
    <v-btn v-for="link in links" @click="go($event, link.link)" :key="link.text">
      <span>{{ $t(link.text) }}</span>
      <v-icon>{{ link.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
<script>
export default {
  methods: {
    go(e, link) {
      if (link != this.$route.path) {
        this.$router.replace(link);
      } else {
        e.preventDefault();
      }
    }
  },
  data() {
    return {
      links: [
        {
          icon: 'mdi-text-box-check-outline',
          text: 'stake.staking',
          link: '/stake'
        },
        {
          icon: 'mdi-sack',
          text: 'stakeforgas.title',
          link: '/stakeforgas'
        }
      ]
    };
  }
};
</script>
