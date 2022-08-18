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
                                    <v-img src="../assets/images/rei.svg" height="36" width="36"></v-img>
                               </div>
                            </v-col>
                            <v-col cols="12" md="9">
                                <v-row justify="space-between" class="progress-miner">
                                    <div class="font-name">{{ currentNode.nodeName |addr}}</div>
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
                    <!-- <div class="block">
                        <div class="font-grey">Total Txns</div>
                        <div class="node-number">{{ stats.totalTransaction | asset(2) }} <span class="font-grey">txns</span></div>
                    </div> -->
                    <!-- <div class="block">
                        <div class="font-grey">Nodes</div>
                        <v-row>
                            <v-col class="map-nodes">
                                <div class="nodes-item">
                                    <div v-for="(item,index) in validatorList" :key ="index">
                                        <div v-if="index < 4">
                                            <v-img v-if="item.img" :src="item.img" height="36" width="36"></v-img>
                                            <v-img v-else src="../assets/images/rei.svg" height="36" width="36"></v-img>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <v-icon size="42">mdi-dots-horizontal-circle</v-icon>
                                </div>
                            </v-col>
                        </v-row>
                    </div> -->
                </v-col>
                <v-col cols="12" md="9">

                    <div class="map-content">
                        <div id="myCharts" ref="chart" class="dispribution" style="width:100%;height:100%"></div>
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
import * as echarts from 'echarts';
import { mapGetters } from 'vuex';
import { recoverMinerAddress } from '../service/RecoverMinerAddress'
import { getReiSatistic , getValidatorList, getValidatorDetails } from '../service/CommonService'
import { postRpcRequest } from '../service/CommonService'
import find from 'lodash/find';
export default {
filters,
  data() {
    return {
        blockHeight:'',
        miner:'',
        stats:{},
        validatorList:[],
        interval: {},
        value: 0,
        currentNode:'',

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
      clearInterval(this.interval)
    },
  mounted(){
      this.myCharts();
      this.connect();
      this.getRei()
      this.getBlock();
      this.getInterval();
    },

  methods: {   
    connect() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
    },
    getInterval(){
         this.interval = setInterval(() => {
        if (this.value === 100) {
          return (this.value = 0)
        }
        this.value += 5
      }, 150)
    },
    myCharts(){
        var chartDom = document.getElementById('myCharts');
        var myChart = echarts.init(chartDom);
        let self = this;
        var option;
        var data = [
                        {
                            name: "Canada", 
                            value: [31.053, 32.736],
                            address:"0x0efe0da2b918412f1009337FE86321d88De091fb"
                        },
                        {   
                            name: "United States", 
                            value: [52.939, 112.475],
                            address:"0x2957879B3831b5AC1Ef0EA1fB08Dd21920f439b4"
                        },
                        { 
                            name: "United Kingdom",
                            value: [312.939, 49.475],
                            address:"0xb7a19F9b6269C26C5Ef901Bd128c364Dd9dDc53a"
                        },
                        { 
                            name: "Singapore", 
                            value: [666.313, 226.537],
                            address:"0x1b0885d33B43A696CD5517244A4Fcb20B929F79D"
                        },
                        { 
                            name: "Australia", 
                            value:  [748.796, 334.843],
                            address:"0xaA714ecc110735B4E114C8B35F035fc8706fF930"
                        },

                    ]
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
                        fontFamily: 'sans-serif',
                        fontSize: 14,
                    },
                    formatter:function(params){
                        let str = `${self.miner}`+'<br/>'+`${params.data.value}`+'<br/>'
                        return str
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
                        {
                            name: "United States", 
                            value: [52.939, 112.475]
                        },
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
                    data: data,
                }
            ]
        };
        myChart.setOption(option)
        window.addEventListener("resize", function() {
            myChart.resize();
          })
        });
        this.$on('hook:destroyed',()=>{
          window.removeEventListener("resize", function() {
            myChart.resize();
          });
        })
        setInterval(() => {
            this.getBlock();
            let i = Math.round(Math.random()*4)
            var lightData = data[i]
            // console.log(i,lightData)
            myChart.setOption(
                option = {
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
        }, 3000);
    },
    async getBlockNumberInfo(){
      let apiUrl = this.apiUrl.rpc;
      let param = {
            method:'eth_blockNumber',
        }
      let res = await postRpcRequest(apiUrl,param);
      return res;
    },
    async getBlock(){
        let { data: resBlock } = await this.getBlockNumberInfo();
        this.blockHeight = web3.utils.hexToNumber(resBlock.result);
        let block = await web3.eth.getBlock(this.blockHeight);
        let blockNumber = resBlock.result;
        
        // console.log('blockNumber', block)
        let _miner = recoverMinerAddress(blockNumber,block.hash,block.extraData);
        this.miner = web3.utils.toChecksumAddress(_miner)
        let  validatorDetails = await getValidatorDetails();
        let detailsList = validatorDetails.data.data;
        this.currentNode = find(detailsList, (item) => web3.utils.toChecksumAddress(item.nodeAddress) == web3.utils.toChecksumAddress(this.miner));
        // console.log('this.miner',this.miner)
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
    color: #868E9E ;
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
