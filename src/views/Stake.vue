<template>
  <v-container class="stake stake_background">
    <div class="header-title">
      <h1>Voting</h1>
      <a href="https://docs.rei.network/guides/become-a-validator" target="_blank" class="title-detailed">How to become a node validator?</a>
    </div>
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-card class="flex-column mt-2">
          <StakeOverview></StakeOverview>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-card class="flex-column mt-2">
            <!-- <v-tabs v-model="tabNav" centered>
                <v-tab key="1">{{$t('stake.staking')}}</v-tab>
                <v-tab key="2">{{$t('unstake.title')}}</v-tab> 
            </v-tabs>
            <v-divider /> -->
            <!-- <v-tabs-items v-model="tabNav">
                <v-tab-item key="1"> -->
                  <StakeToValidator></StakeToValidator>
                <!-- </v-tab-item>
                <v-tab-item key="2"> -->
                  <!-- <UnstakeToValidator></UnstakeToValidator> -->
                <!-- </v-tab-item>
          </v-tabs-items> -->
        </v-card>
      </v-col>
    </v-row>
    <StakeChartsFAQ></StakeChartsFAQ>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Web3 from 'web3';
import { mapActions, mapGetters } from 'vuex';
import abiConfig from '../abis/abiConfig';
import abiStakeManager from '../abis/abiStakeManager'
import abiCommissionShare from '../abis/abiCommissionShare'
import abiValidatorRewardPool from '../abis/abiValidatorRewardPool'
import filters from '../filters';
import find from 'lodash/find';
import util from '../utils/util'
import StakeToValidator from '../components/StakeToValidator';
import StakeOverview from '../components/StakeOverview';
import StakeChartsFAQ from '../components/StakeChartsFAQ';

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT

export default {
  components:{
    StakeToValidator,
    // UnstakeToValidator,
    StakeOverview,
    StakeChartsFAQ
  },
  filters,
  data() {
    return {
        isNode: false,
        tabNav: null,
    };
  },
  computed: {
    ...mapGetters({
      dark: 'dark',
      connection: 'connection'
    })
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
.stake{
  padding-left:40px;
  padding-right:40px;
}
@media screen and (max-width: 900px) {
  .stake{
    padding-left:20px;
    padding-right:20px;
  }
}
</style>
