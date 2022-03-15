<template>
   <v-container class="stake_background">
  <!-- 为 ECharts 准备一个定义了宽高的 DOM --> 
       <v-row>
            <v-col class="accout-item">
              <v-card color="background">
                <v-subheader class="sub-title"><h3>Gas stake</h3></v-subheader>
                <v-card class="balance-card" outlined color="background">
                     <v-card
                        class="voting-stake"
                        label
                        outlined
                    >
                        <div class="content-left">
                            <v-subheader class="total-rei sub-title" v-if='connection.address'>{{gasStakeTotalAmount | asset(4) }}<span class="rei">REI</span></v-subheader>
                             <div v-if='!connection.address' class="not-connection">
                                 —
                            </div>
                            <v-subheader v-if='connection.address' class="middle-hei">
                                <div class="add-price">
                                    <div>${{assetToCurrency(gasStakeTotalAmount, assetInfo.current_price) | asset(2)}}</div>
                                    <!-- <div :class="assetChange(assetInfo.price_change_percentage_24h)">{{assetInfo.price_change_percentage_24h|asset(2) }}%</div> -->
                                </div>
                                <div class="time-price" style="margin-left:12px">
                                    <!-- <div>24H</div> -->
                                    <!-- <div class="update-time">
                                        <v-icon
                                            color="right_icon"
                                            size="12"
                                        >
                                        mdi-clock-time-ten-outline
                                    </v-icon>
                                        1h Ago
                                    </div> -->
                                </div>
                            </v-subheader>
                             <div v-if='!connection.address' class="not-connection">
                                -
                            </div>
                            <v-subheader>
                                Total Stake
                                <v-tooltip right color="start_unstake">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                            color="right_icon"
                                            v-bind="attrs"
                                            v-on="on"
                                            dense
                                            size="14"
                                            style="margin-left:4px"
                                        >
                                         mdi-alert-circle-outline
                                        </v-icon>
                                    </template>
                                    <span>Stake REI,Earn Crude As Gas</span>
                                </v-tooltip>
                            </v-subheader>
                            </div>
                            <a @click="routeLink()">
                            <v-icon
                                size="22"
                                class="icon-right"
                                color="right_icon"
                                v-if='connection.address'
                            >
                            mdi-arrow-right-circle-outline
                            </v-icon>
                            </a>
                            <div v-if='!connection.address'></div>
                    </v-card>
                    <v-card
                        class="voting-stake"
                        label
                        outlined
                    >
                        <div class="content-left">
                            <v-subheader class="total-rei sub-title" style="margin-top:16px" v-if='connection.address'>{{ leftCrude | asset(4) }}</v-subheader>
                            <div v-if='!connection.address' class="not-connection">
                                —
                            </div>
                            <v-subheader class="">
                                Left Crude
                                <v-tooltip right color="start_unstake">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                            v-bind="attrs"
                                            v-on="on"
                                            color="right_icon"
                                            dense
                                            size="14"
                                            style="margin-left:4px"
                                        >
                                            mdi-alert-circle-outline
                                        </v-icon>
                                    </template>
                                    <span>Remaining available gas, 1CRUDE ≈ 1e9 Gwei</span>
                                </v-tooltip>
                             </v-subheader>
                        </div>
                        <a @click="routeLink()">
                            <v-icon
                                size="22"
                                v-if='connection.address'
                                class="icon-right"
                                color="right_icon"
                            >
                            mdi-arrow-right-circle-outline
                            </v-icon>
                        </a>
                    </v-card>
                </v-card>
             </v-card>
          </v-col>
       </v-row>  
   </v-container>
</template>
<script>

import Web3 from 'web3';
import { mapGetters, mapActions } from 'vuex';
import filters from '../filters';
import { postRpcRequest } from '../service/CommonService'
/* eslint-disable no-undef */
export default {
  filters,
  data() {
    return {}
  },
  watch: {
  '$store.state.connection': function() {
      this.init()
    },
  },
  mounted() {
      this.connect();
      this.init();
  },
  computed: {
   ...mapGetters({
      connection: 'connection',
      gasStakeTotalAmount: 'gasStakeTotalAmount',
      leftCrude: 'leftCrude',
      assetInfo: 'assetInfo',
      apiUrl: 'apiUrl',
      dark: 'dark'
    }),
  },
  methods: {
    ...mapActions({
      addTx: 'addTx',
      setGasStakeTotalAmount: 'setGasStakeTotalAmount',
      setLeftCrude: 'setLeftCrude',
    }),
    connect() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
    },
    init(){
        this.getTotalStake();
        this.getLeftCrude();
    },
    async getTotalStake(){
         let apiUrl = this.apiUrl.rpc;
         let arr = [];
         arr.push(this.connection.address);
         arr.push('latest')
         let param = {
             method:'rei_getTotalAmount',
             params:arr
         }
        let res = await postRpcRequest(apiUrl,param);
        this.totalAmount = web3.utils.fromWei(web3.utils.toBN(res.data.result));
        this.setGasStakeTotalAmount({
            gasStakeTotalAmount: this.totalAmount
        })
    },
    async getLeftCrude(){
         let apiUrl = this.apiUrl.rpc;
         let arr = [];
         arr.push(this.connection.address);
         arr.push('latest')
         let param = {
             method:'rei_getCrude',
             params:arr
         }
        let res = await postRpcRequest(apiUrl,param);
        let leftCrude = web3.utils.fromWei(web3.utils.toBN(res.data.result));
        this.setLeftCrude({
            leftCrude: leftCrude
        })
    },
    assetChange(item){
        if(item>0){
            return 'gain'
        } else if(item<0){
            return 'drop'
        } else {
            return ''
        }
    },
    assetToCurrency(item,price){
        return item*price
    },
    routeLink(){
      this.$router.push('/stakeforgas')
    }
  },
};
</script>

<style scoped lang="scss">
.accout-item{
  padding:0;
  margin-top:12px;
  margin-bottom:28px;
  .balance-card{
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    border:none;
  }
  .total-rei{
    font-size: 28px;
    font-weight: 700;
    .rei{
       font-size: 12px;
       font-weight: normal;
       margin-left: 8px;
    }
  }
  .gain{
    color: #65BB67;
  }
  .drop{
    color: red;
  }
  .voting-stake{
    width: 47%;
    height:150px;
    display: inline-flex;
    justify-content: space-between !important;
    background-color: transparent !important;
    margin: 0 16px 16px 16px;
      .content-left{
        width:350px;
        margin:12px 0; 
      }
      .icon-right{
        margin-right:20px;
        margin-top: 64px;
      }
    }
    .middle-hei{
      height: 32px;
    }
  .add-price{
      width: 56%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .time-price{
      width: 44%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  .update-time{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    font-size: 12px;
    // margin-right: 20px;
  }
  .not-connection{
    margin: 12px 36px;
    font-weight: 500;
  }
}
@media screen and (max-width: 900px) {
    .accout-item{
    flex-direction: column;
    margin-bottom:8px;
    margin-top: 0;
    .balance-card{
        display: flex;
        flex-direction: column;
    }
    .voting-stake{
        width: 91% !important;
    }
    .content-left{
        width:350px;
        margin:12px 0;
      }
  }
}
</style>
