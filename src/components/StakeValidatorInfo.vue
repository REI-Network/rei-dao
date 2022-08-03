<template>
  <v-container>
    <h3>Validator Info</h3>
    <v-row class="mt-5">
        <v-col class="rei-fans">
            <div>
                <v-img :src="detail.logo" width="42" height="42"/>
            </div>
            <div class="fans-right">
                <v-row align="center">
                    <h3>REI FANs</h3>
                    <div class="active">Active</div>
                    <div class="three-img">
                        <v-img class="img-icon" src="../assets/images/twitter.svg" width="20" height="20"/>
                        <v-img class="img-icon" src="../assets/images/circle-icon.svg" width="20" height="20"/>
                        <v-img class="img-icon" src="../assets/images/telegram.svg" width="20" height="20"/>
                    </div>
                </v-row>
                <v-row>
                    <span class="font-grey">{{detail.nodeAddress}}</span>
                      <v-icon size="14">mdi-content-copy</v-icon>
                </v-row>
            </div>
        </v-col>
        <v-col class="vote-btn">
            <v-btn small color="vote_button" class="mr-4 font-btn" height="32">
                {{ $t('stake.staking') }}
            </v-btn>
            <v-btn small color="start_unstake" class="mr-4 unstake_btn" height="32" style="margin-right:0 !important;">
                {{ $t('stake.claim') }}
            </v-btn>
        </v-col>
    </v-row>
    <div class="font-grey fans-content">
        REI FANs is a professional node service provider with years of technical experience and strong business resources.REI FANs is a professional 
        node service provider with years of technical experience and strong business resources.
    </div>
    <v-card outlined class="vote-number">
        <v-row justify="space-between">
            <!-- <v-col cols="12" sm="3">
                <div class="font-grey">Voting Power ($REI)</div>
                <h2>{{ ValidatorInfo.power | asset(2)}}</h2>
            </v-col> -->
             <!-- <v-col cols="12" sm="3">
                <div class="font-grey"> Rewards to be withdrawn($REI)</div>
                <h2>{{ ValidatorInfo.commissionShare }}</h2>
            </v-col> -->
            <!--  <v-col cols="12" sm="3">
                <div class="font-grey">Commission Rate</div>
                <h2>{{ ValidatorInfo.commissionRate }}%</h2>
            </v-col> -->
        </v-row>
    </v-card>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Web3 from 'web3';
import { mapGetters } from 'vuex';
import filters from '../filters';
import find from 'lodash/find';
import abiConfig from '../abis/abiConfig';
import { getValidatorDetails } from '../service/CommonService'
import abiStakeManager from '../abis/abiStakeManager';
const config_contract = process.env.VUE_APP_CONFIG_CONTRACT;
let client = null;
export default {
  filters,
  data() {
    return {
     detail: '',
     stakeManagerContract:'',
     stakeManageInstance:''
    };
  },
  computed: {
    ...mapGetters({
        connection: 'connection',
        dark: 'dark'
    })
  },
  mounted(){
      this.getReceive()
      this.init()
  },
  methods: {
      async init(){
            let contract = new web3.eth.Contract(abiConfig, config_contract);
            this.stakeManagerContract = await contract.methods.stakeManager().call();
            let stake_contract = new web3.eth.Contract(abiStakeManager, this.stakeManagerContract);
            this.stakeManageInstance = stake_contract;
      },
    async getReceive(){
       let Details = await getValidatorDetails();
       let address = this.$route.query.id;
       let ValidatorInfo = Details.data.data
       this.detail = find(ValidatorInfo, (item) => item.nodeAddress == address);
       console.log('detail',this.detail)
       console.log('12',this.$route.params.data );
    }
  }
};
</script>

<style scoped lang="scss">
.font-btn.v-btn.v-btn--has-bg {
  color: #fff;
  background: #6979f8;
}
.unstake_btn.theme--dark.v-btn.v-btn--has-bg {
  background: #595777;
}
.v-btn {
  text-transform: none !important;
}
.v-sheet--outlined{
    border: none;
    border-radius: 6px;
}
.font-grey{
    color: #868E9E ;
    font-size: 14px;
}
.rei-fans{
    padding-top: 8px;
    display: flex;
    align-items: center;
    .fans-right{
        margin-left: 20px;
    }
    .active {
        height: 18px;
        background-color: #FC9354;
        border-radius: 15px;
        margin-left: 8px;
        padding: 0 10px;
        color: #fff;
        font-size: 14px;
    }
    .three-img{
        display:flex;
        .img-icon{
            margin: 0 4px;
        }
    }
}
.vote-btn{
    text-align: right;
}
.fans-content{
    margin: 28px 0;
}
.theme--light.vote-number{
    background-color: #F7F7F7;
    padding: 12px 20px;
}
.theme--dark.vote-number{
    background-color: #13112B;
    padding: 12px 20px;
}
</style>
