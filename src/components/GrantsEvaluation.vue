<template>
  <v-container>
    <v-card></v-card>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { mapActions, mapGetters } from 'vuex';
import filters from '../filters';

export default {
  components: {
  },
  filters,
  data() {
    return {
      
    };
  },
  computed: {
    ...mapGetters({
      dark: 'dark',
      connection: 'connection'
    })
  },
  methods: {}
};
</script>

<style scoped lang="scss">

@media screen and (max-width: 900px) {
}
</style>
