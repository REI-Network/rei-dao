<template>
  <v-container class="stake_background">
     <div class="header-title">
      <h3>Gas Stake</h3>
      <a href="https://docs.rei.network/guides/stake-for-free-gas" class="title-detailed">How To Get Crude By Stake REI?</a>
    </div>
    <v-row>
      <v-col>
          <GasStakeTotal></GasStakeTotal>
      </v-col>
    </v-row>
    <!-- <v-row>
      <v-col>
         <v-card class="background">
           <GasStakeList></GasStakeList>
         </v-card>
      </v-col>
    </v-row> -->
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
// import GasStakeList from '../components/GasStakeList';

export default {
  components:{
    StakeForFreeGas,
    GasStakeTotal,
    // GasStakeList
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
