<template>
  <v-container class="stake_background">
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <v-row>
      <v-col class="accout-item"> 
        <!-- <div class="balance-card">
          <v-card
            class="mx-auto secend-card"
            rounded="4"
            color="background"
          >
          <v-subheader class="sub-title">
            <h3>Balance</h3>
            <v-tooltip right color="start_unstake">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="right_icon"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    dense
                    size="14"
                    style="margin-left:4px"
                  >
                    mdi-alert-circle-outline
                  </v-icon>
                </template>
                 <span> Freely usable $REI, excluding $REI staked for voting and gas</span>
            </v-tooltip>
          </v-subheader>
          <v-subheader class="total-banlance sub-title " v-if='connection.address'>{{ connection.balance | asset(4) }}<span class="rei">REI</span></v-subheader>
          <div v-if='!connection.address' class="not-connection">
                —
          </div>
          <v-subheader v-if='connection.address' style="height:16px">
            <div class="add-price" style="margin-top:12px;">
               <div>${{assetToCurrency(connection.balance,assetInfo.current_price) | asset(2)}}</div>
               <div :class="assetChange(assetInfo.price_change_percentage_24h)">{{assetInfo.price_change_percentage_24h|asset(2) }}%</div>
            </div>
 
          </v-subheader>
          <div v-if='!connection.address' class="not-connection">
              -
           </div>
          <div id="myCharts" ref="chart" style="height:280px"></div>
          </v-card>          
        </div> -->         
        <div class="voting-card">
          <v-card
            class="secend-card"     
            rounded="4"
            color="background"
          >
          <v-subheader class="sub-title title">Voting</v-subheader>
          <div class="chips-tow">
            <v-card
            class="voting-stake"
            label
            outlined
          >
             <div class="content-left">
                <v-subheader class="total-rei sub-title" v-if='connection.address'>{{ myTotalStake | asset(4) }}<span class="rei">REI</span></v-subheader>
                <div v-if='!connection.address' class="not-connection">
                    —
                </div>
                <v-subheader v-if='connection.address' class="middle-hei">
                    <div class="add-price" >
                        <div>${{assetToCurrency(myTotalStake,assetInfo.current_price)| asset(2)}}</div>
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
                  Validator voting staked
                  <v-tooltip right color="start_unstake">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="right_icon"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          dense
                          size="14"
                          style="margin-left:4px"
                        >
                          mdi-alert-circle-outline
                        </v-icon>
                      </template>
                 <span>If you cancel the voting,<br /> $REI can be withdrawn after 7 days</span>
                </v-tooltip>
              </v-subheader>
             </div>
             <a @click="routeLink()">
                 <v-icon
                    color="right_icon"
                    dark
                    size="22"
                    class="icon-right"
                    v-if='connection.address' 
                  >
                  mdi-arrow-right-circle-outline
                </v-icon>
                </a>
                <div v-if='!connection.address' ></div>
            </v-card>
           <v-card
            class="voting-stake"
            label
            outlined
            color="faq_border"
          >
             <div class="content-left">
                <v-subheader class="total-rei sub-title" v-if='connection.address'>{{ myTotalUnStake | asset(4) }}<span class="rei">REI</span></v-subheader>
                <div v-if='!connection.address' class="not-connection">
                    —
                </div>
                <v-subheader v-if='connection.address' class="middle-hei">
                    <div class="add-price">
                        <div>${{assetToCurrency(myTotalUnStake,assetInfo.current_price)| asset(2)}}</div>
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
                  Pending unstaked
                  <v-tooltip right color="start_unstake">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="right_icon"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          dense
                          size="14"
                          style="margin-left:4px"
                        >
                          mdi-alert-circle-outline
                        </v-icon>
                      </template>
                 <span>Stake $REI and earn more</span>
                </v-tooltip>
              </v-subheader>
             </div>
             <a @click="routeLink()">
                 <v-icon
                    color="right_icon"
                    dark
                    size="22"
                    class="icon-right"
                    v-if='connection.address'
                  >
                   mdi-arrow-right-circle-outline
                </v-icon>
                </a>
                <div v-if='!connection.address'></div>
            </v-card>
          </div>   
        </v-card>
        </div>
        <div class="voting-card">
       <MyAccountCrude></MyAccountCrude>
    </div>  
      </v-col>
    </v-row> 
    </v-container>
</template>
<script>
/* eslint-disable no-undef */

import Web3 from 'web3';
import abiConfig from '../abis/abiConfig';
import abiStakeManager from '../abis/abiStakeManager'
import abiCommissionShare from '../abis/abiCommissionShare'
import { mapGetters } from 'vuex';
import * as echarts from 'echarts';
import filters from '../filters';
import dayjs from 'dayjs';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core'
import util from '../utils/util';
import MyAccountCrude from '../components/MyAccountCrude';


const config_contract = process.env.VUE_APP_CONFIG_CONTRACT;
let client = null;

export default {
  filters,
  components:{
    MyAccountCrude
  },
  data() {
    return {
        myTotalStake: 0,
        myTotalUnStake: 0,
        stakeManagerContract: null,
        stakeManageInstance: null,
        myChart: null
    };
  },
  watch: {
   '$store.state.connection': function() {
      this.init()
    },
  },
  mounted() {
    this.connect();
    this.myCharts();
    this.init();
  },
  destroyed() {
    
  },
  computed: {
   ...mapGetters({
      connection: 'connection',
      assetInfo: 'assetInfo',
      apiUrl: 'apiUrl',
      dark: 'dark'
    }),
  },
  methods: {
    routeLink(){
      this.$router.push('/stake')
    },
    connect() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.web3 = new Web3('https://rpc.rei.network');
        }
    },
    
    async init(){
        let contract = new web3.eth.Contract(abiConfig,config_contract);
        
        this.stakeManagerContract = await contract.methods.stakeManager().call();
        this.stakeManageInstance = new web3.eth.Contract(abiStakeManager,this.stakeManagerContract);
        this.getMyStakeInfo();
        this.getMyUnstakeInfo();
        //this.getBalanceList();
    },
    async getBalanceList() {
        if(!this.connection.address)return;
        //this.myChart.showLoading();
        let blockNumber = await web3.eth.getBlockNumber()
        let arr = [];
        let now = Date.now();
        for(let i = 0; i < 7; i++){
            arr.push({
                timestamp:now-86400000*i,
                blockNumber: blockNumber-28800*i
            })
        }
        let arrReverse = arr.reverse();
        let arrMap = arrReverse.map(item=>{
            return web3.eth.getBalance(this.connection.address, item.blockNumber);
        })
        let validators = await Promise.all(arrMap);
        let balanceResult = [];
        for(let i = 0; i < validators.length; i++){
            balanceResult.push({
                     "value": [
                        dayjs(arrReverse[i].timestamp).format('YYYY-MM-DD'),
                        web3.utils.fromWei(web3.utils.toBN(validators[i]))
                    ]
                })
        }
        this.myChart.hideLoading();
        this.myChart.setOption({
            series: [
              {
                data: balanceResult
              }
            ]
        })
        

    },
    async getBalanceOfShare(activeValidatorsShare) {
        let commissionShare = new web3.eth.Contract(abiCommissionShare,activeValidatorsShare[1]);
        let balance = 0;
        let amount = 0;
        if(this.connection.address){
            balance = await commissionShare.methods.balanceOf(this.connection.address).call();
            if(balance>0){
              amount = await commissionShare.methods.estimateSharesToAmount(balance).call();
            } else {
              amount = 0;
            }
            
        }
        return {
            balance,
            amount,
            commissionShare
        };
    },
    async getMyStakeInfo() {
        let url = this.apiUrl.graph;
        client = new ApolloClient({
            uri: `${url}chainMonitorEvent`,
            cache: new InMemoryCache(),
        })
        const myStakesInfo = gql`
            query stakeInfos {
            stakeInfos(where:{
                to:"${this.connection.address}"
            }){
                id
                from
                timestamp
                validator
            }
        }`
        const {data:{stakeInfos}} = await client.query({
            query: myStakesInfo,
            variables: {
            },
            fetchPolicy: 'cache-first',
        })
        if(stakeInfos.length>0){
            let myStakeValidatorMap = stakeInfos.map((item)=>{
                return this.stakeManageInstance.methods.validators(item.validator).call()
            })

            let validators = await Promise.all(myStakeValidatorMap);
            let balanceOfShareMap = validators.map(item => {
                return this.getBalanceOfShare(item);
            })
            let balanceOfShare = await Promise.all(balanceOfShareMap);
            let total = 0;
            for(let i = 0;i < balanceOfShare.length;i++){
                total = web3.utils.toBN(total).add(web3.utils.toBN(balanceOfShare[i].amount))
            }
            this.myTotalStake = web3.utils.fromWei(total);
        }
    },
    async getMyUnstakeInfo() {
        const myUnStakesInfo = gql`
            query unStakeInfos {
            unStakeInfos(where:{
                from:"${this.connection.address}"
            }){
                id
                from
                to
                txHash
                values
                shares
                validator
                timestamp
                state
                amount
            }
        }`
        const {data:{unStakeInfos}} = await client.query({
            query: myUnStakesInfo,
            variables: {
            },
            fetchPolicy: 'cache-first',
        })
        if(unStakeInfos.length>0){
            let total = 0;
            for(let i = 0;i < unStakeInfos.length;i++){
                if(unStakeInfos[i].state == true)continue;
                total = web3.utils.toBN(total).add(web3.utils.toBN(unStakeInfos[i].values))
            }
            this.myTotalUnStake = web3.utils.fromWei(total);
        }

    },
    assetFormat(value,precision) {
        return util.asset(value,precision)
    },
    myCharts(){
      const chart = this.$refs.chart;
      if(chart){
        this.myChart = this.$echarts.init(chart);
        var option = {
          tooltip:{
            trigger:'axis',
              formatter(params) {
                var relVal = params[0].value[0]+'<br>';
                for (var i = 0, l = params.length; i < l; i++) {
                  var yValue = Number(params[i].value[1]).toFixed(5)
                    relVal += params[i].seriesName +':'+yValue;
                }
                return relVal;
              },
          },
          xAxis: {
            type: 'time',
            axisTick: {
              show: false
            },
            axisLine: {
              show:false,
              lineStyle: {
                  color: 'rgba(134,142,158,.6)', 
                  width: '1'
                }
            },
            axisLabel: {
              textStyle: {
                fontSize: 12,
              }
            }, 
            splitLine:{show: false}  
                  
          },
          yAxis: {
            type: 'value',
            data:[],
            axisTick: {
              show: false
              },
            axisLine: {
              show:false,
              },
            axisLabel:{
              show:false,
              },
            splitLine: {
              show: false,
              },
            },
          series: [
            {
              name:'Balance',
              data: [],
              type: 'bar',
              itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#46F5AC' },
                { offset: 1, color: '#38ADF1' }
                ])
              },
              barWidth: 20
            }
          ] 
        };
          this.myChart.setOption(option)
          window.addEventListener("resize", function() {
            this.myChart.resize()
          })
        }
      this.$on('hook:destroyed',()=>{
         window.removeEventListener("resize", function() {
            this.myChart.resize();
        });
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
    }
  },
};
</script>

<style scoped lang="scss">
.accout-item{
  display: flex;
  justify-content: space-between;
  padding: 0;
  .balance-card{
    // width: 48.5%;
  }
  .voting-card{
    width: 49%;
  }
  .secend-card{
    height: 380px;
  }
  .total-banlance{
    font-size: 40px;
    font-weight: 700;
    .rei{
       font-size: 16px;
       font-weight: normal;
       margin-left: 8px;
    }
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
  .chips-tow{
    display: flex;
    flex-direction: column;
  }
  .voting-stake{
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
        margin-top:64px;
      }
    }
  .add-price{
      width: 56%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .middle-hei{
      height: 32px;
    }
    .time-price{
      width: 44%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .title {
      font-weight: 500;
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
    .balance-card{
      width: 100%;
    }
    .voting-card{
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>
