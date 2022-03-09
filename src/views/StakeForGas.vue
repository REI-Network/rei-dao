<template>
  <v-container style="padding-left:40px;padding-right:40px;" class="stake_background">
     <div class="header-title">
      <h1>Gas Stake</h1>
      <a href="https://docs.rei.network/guides/stake-for-free-gas" class="title-detailed">How To Get Crude By Stake REI?</a>
    </div>
    <v-row>
      <v-col>
          <GasStakeTotal></GasStakeTotal>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="flex-column">
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
import GasStakeTotal from '../components/GasStakeTotal';

export default {
  components:{
    StakeForFreeGas,
    GasStakeTotal
  },
  data() {
    return {
        isNode: false,
        tabNav: null,
    };
  }
};
</script>

<style scoped lang="scss">
.header-title{
  margin: 1.5rem 0;
    .title-detailed{
      font-size: 14px;
      color: #868E9E;
    }
}
</style>
