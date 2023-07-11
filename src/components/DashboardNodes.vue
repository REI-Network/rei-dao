<template>
  <v-container style="padding:0;"> 
      <v-card 
        class="mx-auto dashboard-nodes"
        rounded="4"
        color="background"
        >
            <v-row>
                <v-col cols="12" md="3">
                    <div class="block">
                        <div class="font-grey">Block Height</div>
                        <div class="node-number" style="font-size:40px">{{ blockHeight | asset(0)}}</div>
                    </div>
                    <div class="block">
                        <div class="font-grey">Validators</div>
                        <div class="node-number">{{ validatorList.length }}</div>
                    </div>
                    <div class="block">
                        <div class="font-grey">Current Node</div>
                        <v-row align="center" style="margin-top:2px;">
                            <v-col cols="12" md="3">
                               <div>
                                    <v-img v-if="currentNode.logo" :src="$IpfsGateway(currentNode.logo)" lazy-src="../assets/images/logo_bg_small.png" height="36" width="36"></v-img>
                                    <v-img v-else src="../assets/images/rei.svg" height="36" width="36"></v-img>
                               </div>
                            </v-col>
                            <v-col cols="12" md="9" style="padding-left:0;">
                                <v-row justify="space-between" class="progress-miner">
                                    <div class="font-name">{{ currentNode.nodeName }}</div>
                                    <div class="miner">
                                        {{ miner | addr }} 
                                    </div>
                                </v-row>
                                <v-progress-linear   
                                    height="10"
                                    color="#2115E5"
                                    striped
                                    :value="value"
                                ></v-progress-linear>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="12" md="9">

                    <div class="map-content">
                        <div id="myValidatorCharts" ref="myValidatorCharts" class="dispribution" style="width:100%;height:100%"></div>
                    </div>
                </v-col>
            </v-row>
        </v-card>
        <v-row justify="space-between">
            <v-col cols="12" sm="3">
                <v-card class="rei-card">
                    <h3>REI Network</h3>
                    <div class="block">
                        <div class="font-grey">Issue Date</div>
                        <div class="node-number">30/12/2021 <span class="font-grey">12:00 UTC</span></div>
                    </div>
                    <div class="block">
                        <div class="font-grey">Consensus</div>
                        <div class="node-number">DPOS</div>
                    </div>
                    <div class="block">
                        <div class="font-grey">Average Block Time</div>
                        <div class="node-number">{{ stats.averageBlockTime | asset(2) }} <span class="font-grey">s</span></div>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="3">
                <v-card class="rei-card">
                    <h3>Transactions</h3>
                    <div class="block">
                        <div class="font-grey">
                                Total Txns
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
                                    <span>Total transactions on the REI Network</span>
                                </v-tooltip>
                            </div>
                        <div class="node-number">{{ stats.totalTransaction | asset(2) }} <span class="font-grey">Txns</span></div>
                    </div>
                    <!-- <div class="block">
                        <div class="font-grey">Pending Transactions</div>
                        <div class="node-number">48,443 <span class="font-grey">txns</span></div>
                    </div> -->
                </v-card>
            </v-col>
            <v-col cols="12" sm="3">
                <v-card class="rei-card">
                    <h3>Addresses</h3>
                    <div class="block">
                        <div class="font-grey">
                            Contract Addresses
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
                                    <span>The number of smart contracts on REI Network</span>
                                </v-tooltip>
                        </div>
                        <div class="node-number">
                            {{ stats.totalContract | asset(0) }}
                            <!-- <span class="font-green">+36</span> -->
                        </div>
                    </div>
                    <div class="block">
                        <div class="font-grey">
                            Wallet Addresses
                            <!-- <v-tooltip right color="start_unstake">
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
                                    <span>The number of addresses holding the native token <br/>of this blockchain and The number of addresses that <br/>have interacted with this blockchain. </span>
                                </v-tooltip> -->
                        </div>
                        <div class="node-number">
                            {{ stats.totalAddress | asset(0) }}
                            <!-- <span class="font-green">+47</span> -->
                            </div>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="3">
                <v-card class="rei-card">
                    <h3>Token</h3>
                    <div class="block">
                        <div class="font-grey">Total Token Number</div>
                        <div class="node-number">
                            <a :class="dark?'dark-link':'light-link'" href="https://scan.rei.network/tokens" target="_blank">{{ stats.totalToken | asset(0) }}</a>
                            <!-- <span class="font-green">+117</span> -->
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */

import Web3 from 'web3';
import filters from '../filters';
import util from '../utils/util'
import * as echarts from 'echarts';
import { mapGetters } from 'vuex';
import { recoverMinerAddress } from '../service/RecoverMinerAddress'
import { getReiSatistic , getValidatorList, getValidatorDetails } from '../service/CommonService'
import { postRpcRequest } from '../service/CommonService'
import locationData from '../service/location/locationData'
import Address from '../components/Address';
import find from 'lodash/find';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
let client = null;

export default {
filters,
Address,
  data() {
    return {
        blockHeight:'',
        miner:'',
        stats:{},
        validatorList:[],
        interval: {},
        value: 0,
        currentNode:'',
        detailsList:[],
        locationData:[],
        myChart:null,
        intervalNode: null
    };
  },
  computed: {
    ...mapGetters({
        connection: 'connection',
        apiUrl: 'apiUrl',
        dark: 'dark'
    })
  },
  beforeDestroy () {
      clearInterval(this.interval);
      clearInterval(this.intervalNode);
    },
  mounted(){
      this.connect();
      this.getRei();
      this.myCharts();
      this.getBlock();
    },

  methods: {   
    connect() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.web3 = new Web3('https://rpc.rei.network');
        }
    },
    getInterval(averageBlockTime){
        let intervalTime = averageBlockTime/20*1000;
        this.interval = setInterval(() => {
        if (this.value >= 100) {
          return (this.value = 0)
        }
        this.value += 5
      }, intervalTime)
    },
    async getValidator(){
      try{
      let blockHeight = await web3.eth.getBlockNumber();
      let url = this.apiUrl.graph;
      client = new ApolloClient({
        uri: `${url}chainMonitorBlock`,
        cache: new InMemoryCache()
      });
      const getValidatorsInfos = gql`
         query validators($blockHeight: String) {
            validators(where:{id:$blockHeight}){
              id,
              Validator(orderBy:votingPower,orderDirection:desc){
                id
                address
                votingPower
                commissionRate
                commissionAddress
                active
              }
            }
          }
        `;
      let getValidatorList = async function(blockHeight){
        let getData = async function(blockHeight){
          const { data: { validators }} = await client.query({
            query: getValidatorsInfos,
            variables: {
              blockHeight: String(blockHeight)
            },
            fetchPolicy: 'cache-first'
          });
          return validators;
        }
        let _validator = await getData(blockHeight);
        if(!_validator.length){
          await util.sleep(500);
          _validator = await getValidatorList(blockHeight-1);
        }
        return _validator
      }
      
      let _validators = await getValidatorList(blockHeight);
      let validators = _validators[0].Validator;
      let activeList = [];
      for(let i = 0; i < validators.length; i++){
        if(validators[i].active){
          activeList.push(validators[i])
        }
      }

      return activeList;
      } catch(e){
        console.log(e)
      }
    },
    async myCharts(){
        let activeValidator = await this.getValidator();
        let validatorDetails = await getValidatorDetails();
        this.detailsList = validatorDetails.data.data;
        const chartDom = this.$refs.myValidatorCharts;
        let myChart =  this.$echarts.init(chartDom);
        this.myChart = myChart;
        let option;

        let _activeValidator = activeValidator.map((item)=>{
          let detail = find(this.detailsList, (_items) => web3.utils.toChecksumAddress(_items.nodeAddress) == web3.utils.toChecksumAddress(item.address));
          let location = find(locationData, (_items) => web3.utils.toChecksumAddress(_items.address) == web3.utils.toChecksumAddress(item.address));
          if(!detail){
            detail = {
              nodeAddress: item.address,
              nodeDesc: '',
              nodeName: 'Validator',
              logo: 'bafkreiavru5i3kdvsgqqjru2n6t7mgf724jinllip3gaj74drhkvm7swiy'
            }
          }
          if(!location){
            location = {
              address:item.address,
              name: "Hong kong", 
              value: [717.3811, 154.5073]
            }
          }
          return{
                ...location,
                nodeDesc:detail.nodeDesc,
                nodeName:detail.nodeName,
            }
        })
        this.locationData = _activeValidator;
        $.get(require('../assets/images/map.svg'), function (svg) {
          echarts.registerMap('iceland_svg', { svg: svg });
          option = {
              tooltip: {},
              geo: {
                  tooltip: {
                      show: true,
                      trigger:'item',
                      enterable: true,
                      backgroundColor: 'rgb(255,255,255)', 
                      extraCssText: 'box-shadow: 0 0 20px #ddd;',
                      padding: 12,
                      textStyle: {
                          color: '#000',
                          fontStyle: 'normal',
                          fontWeight: 'normal',
                          fontSize: 14,
                      },
                      formatter:function(params){
                          let nodeAddress = util.addr(params.data.address)
                          let str = '<span style="font-weight:bold;">'+`${params.data.nodeName}`+'</span>'
                          +'<br/>'+'<span>'+ nodeAddress +'</span>'+'<br/>'
                          +'<div style="color: #868E9E;max-width:30rem;text-overflow:ellipsis;overflow:hidden;-webkit-line-clamp:2;">'+`${params.data.nodeDesc}`+'</div>'
                          +'<i data-v-8e64a00a aria-hidden="true" style="font-size:16px;" class="v-icon notranslate mdi mdi-map-marker theme--light"></i>'
                          +'<span style="color: #868E9E;margin-left:8px;">'+ `${params.data.name}`+'</span>'
                          return `<div style="max-width:30rem;">${str}</div>`
                      }
                    
                  },
                  show:false,
                  type:"map",
                  map: 'iceland_svg',
                  roam: false,
                  aspectScale:1,
                  layoutSize:['70%'],
              },
              series: [
                  {
                      type: 'effectScatter',
                      coordinateSystem: 'geo',
                      geoIndex: 0,
                      symbolSize: 20,
                      itemStyle: {
                          color: '#2115E5'
                      },
                      encode: {
                          tooltip: 2
                      },
                      data: [
                      ]
                  },
                  {
                      type: 'scatter',
                      coordinateSystem: 'geo',
                      geoIndex: 0,
                      symbolSize:12,
                      itemStyle: {
                          color: '#2115E5'
                      },
                      encode: {
                          tooltip: 2
                      },
                      data: _activeValidator,
                  }
              ]
          };
          myChart.setOption(option);
          //myChart.getZr().on('click', function (params) {
          // var pixelPoint = [params.offsetX, params.offsetY];
          // var dataPoint = myChart.convertFromPixel({ geoIndex: 0 }, pixelPoint);
          // console.log(dataPoint);
          // });
        });
        window.addEventListener("resize", () =>  {
            this.myChart.resize();
        })
        this.$on('hook:destroyed',()=>{
          window.removeEventListener("resize", ()=> {
            myChart.resize();
          });
        })
        let averageBlockTime = this.stats.averageBlockTime || 3;
        this.getInterval(averageBlockTime);
        this.getCurrentNodeInfo();
        this.intervalNode = setInterval(() => {
            this.getCurrentNodeInfo()
        }, averageBlockTime*1000);
    },
    async getCurrentNodeInfo(){
      let blockInfo = await this.getBlock();
      this.blockHeight = blockInfo.blockHeight;
      this.miner = blockInfo.miner;
      this.currentNode = find(this.detailsList, (item) => web3.utils.toChecksumAddress(item.nodeAddress) == web3.utils.toChecksumAddress(this.miner));
      if(!this.currentNode){
        this.currentNode = {
          nodeAddress: this.miner,
          nodeDesc: '',
          nodeName: 'Validator',
          logo: 'bafkreiavru5i3kdvsgqqjru2n6t7mgf724jinllip3gaj74drhkvm7swiy'
        }
      }
      let lightData = find(this.locationData, (items) => web3.utils.toChecksumAddress(items.address) == web3.utils.toChecksumAddress(this.miner));
      // console.log('detail',lightData)
      this.myChart.setOption(
         {
            series:[
                {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    geoIndex: 0,
                    symbolSize: 20,
                    itemStyle: {
                        color: '#2115E5'
                    },
                    encode: {
                        tooltip: 2
                    },
                    data:[ lightData ]
                },
            ]
      })
    },
    async getBlockNumberInfo(){
      let apiUrl = this.apiUrl.rpc;
      let res = await postRpcRequest(apiUrl,{
        method:'eth_getBlockByNumber',
        params:["latest",true]
      });
      console.log(res);
      return res;
    },
    async getBlock(){
        let { data: resBlock } = await this.getBlockNumberInfo();
        let blockHeight = web3.utils.hexToNumber(resBlock.result.number);
        let block = resBlock.result;
        
        let _miner = recoverMinerAddress(blockHeight,block.hash,block.extraData);
        let miner = web3.utils.toChecksumAddress(_miner)
        return {
          blockHeight,
          miner
        }
    },
    async getRei(){
        let ReiSatistic = await getReiSatistic();
        this.stats = ReiSatistic.data.row.json;
        let list = await getValidatorList();
        this.validatorList = list.data.data.activeList;
    }
  }
};
</script>

<style scoped lang="scss">
.dashboard-nodes{
    margin-bottom: 40px;
    padding: 20px;
}
.font-grey{
    color: #868E9E;
    font-size: 14px;
}
.font-green{
    color: #41BF5C ;
    font-size: 18px;
}
.node-number{
    font-size: 24px;
    font-weight: bolder;
}
.light-link{
    color: #000;
}
.dark-link{
    color: #FFF;
 }
a:hover{
    color:#6979f8;
    text-decoration: underline;
}
.block{
    margin-top: 26px;
    margin-bottom: 20px;
}
.rei-card{
    margin-bottom: 28px;
    padding: 20px;
    height: 360px;
}
.v-progress-linear{
    border-radius: 8px;
}

.map-content {
    height: 100%;
    width: 100%;
    // background: url('../assets/images/map.svg') no-repeat center;
    // background-size: 100% 100%!important;
}
.dispribution{
    background: url('../assets/images/map.svg') no-repeat center;
    background-size: 100% 100%!important;
}
.map-nodes{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .nodes-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 86%;
    }
}
.miner{
    text-align: right;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 12px;
}
.font-name{
    text-align: right;
    font-size: 14px;
    font-weight: 500;
}
.progress-miner{
    padding: 0 12px;
}
</style>
