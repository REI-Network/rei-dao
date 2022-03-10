<template>
  <v-container class="gasStake stake_background">
     <div class="header-title">
      <h1>Gas Stake</h1>
      <a href="https://docs.rei.network/guides/stake-for-free-gas" target="_blank" class="title-detailed">How to get crude by stake REI?</a>
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
    .title-detailed:hover{
      color: #6979F8;
      text-decoration:underline;
    }
}
.gasStake{
  padding-left:40px;
  padding-right:40px;
}
@media screen and (max-width: 900px) {
  .gasStake{
    padding-left:20px;
    padding-right:20px;
  }
}
</style>
