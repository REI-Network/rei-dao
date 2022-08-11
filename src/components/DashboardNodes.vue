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
                        <div class="node-number">{{ blockHeight | asset(0)}}</div>
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
                            <v-col cols="12" md="9" >
                                <div class="miner">
                                   {{ miner | addr }} 
                                </div>
                                <v-progress-linear
                                    indeterminate
                                    height="10"
                                    color="#2115E5"
                                    striped
                                ></v-progress-linear>
                            </v-col>
                        </v-row>
                    </div>
                    <div class="block">
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
                    </div>
                </v-col>
                <v-col cols="12" md="9">
                    <!-- <v-img src="../assets/images/map.svg"></v-img> -->
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
                        <div class="node-number">01/01/2022</div>
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
                        <div class="font-grey">Total Txns</div>
                        <div class="node-number">{{ stats.totalTransaction | asset(2) }} <span class="font-grey">txns</span></div>
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
                        <div class="font-grey">Contract Addresses</div>
                        <div class="node-number">
                            {{ stats.totalContract | asset(0) }}
                            <!-- <span class="font-green">+36</span> -->
                        </div>
                    </div>
                    <div class="block">
                        <div class="font-grey">Wallet Addresses</div>
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
                            {{ stats.totalToken | asset(0) }}
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
import { getReiSatistic , getValidatorList } from '../service/CommonService'
import { postRpcRequest } from '../service/CommonService'
export default {
filters,
  data() {
    return {
        blockHeight:'',
        miner:'',
        stats:{},
        validatorList:[],
    };
  },
  computed: {
    ...mapGetters({
        connection: 'connection',
        apiUrl: 'apiUrl',
        dark: 'dark'
    })
  },
  mounted(){
      this.myCharts();
      this.connect();
      this.getRei()
      this.getBlock();
      setInterval(() => {
          this.getBlock();
      },3000);
  },

  methods: {   
    connect() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
    },
    myCharts(){
        var chartDom = document.getElementById('myCharts');
        var myChart = echarts.init(chartDom);
        var option;
       $.get(require('../assets/images/map.svg'), function (svg) {
        echarts.registerMap('iceland_svg', { svg: svg });
        option = {
            tooltip: {},
            geo: {
                tooltip: {
                    show: false,
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
                        [367.291, 281.14]
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
                    data: [
                        [71.053, 92.736],
                        [327.939, 99.475],
                        [367.291, 281.14],
                        [489.245, 171.008],
                        [686.313, 106.537],
                        [758.796, 284.843]
                    ]
                }
            ]
        };
        myChart.setOption(option)
        window.addEventListener("resize", function() {
            resizeMyChartContainer();
            myChart.resize();
          })
        });
        this.$on('hook:destroyed',()=>{
          window.removeEventListener("resize", function() {
            this.myChart.resize();
          });
        })
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
        // console.log('this.miner',this.miner)
        let list = await getValidatorList();
        this.validatorList = list.data.data.activeList;

    },
    async getRei(){
        let ReiSatistic = await getReiSatistic();
        this.stats = ReiSatistic.data.row.json;
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
}
</style>
