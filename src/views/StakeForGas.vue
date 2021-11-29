<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-card class="flex-column mt-2">
            <StakeForFreeGas></StakeForFreeGas>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import StakeForFreeGas from '../components/StakeForFreeGas';

export default {
  components:{
    StakeForFreeGas
  },
  data() {
    return {
        isNode: false,
        tabNav: null,
    };
  }
};
</script>
