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
                        <div class="node-number">21</div>
                    </div>
                    <div class="block">
                        <div class="font-grey">Current Node</div>
                        <v-row align="center" style="margin-top:2px;">
                            <v-col cols="12" md="3">
                                <v-img src="../assets/images/rei.svg" height="36" width="36"></v-img>
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
                                <div>
                                    <v-img src="../assets/images/rei.svg" height="36" width="36"></v-img>
                                </div>
                                <div>
                                    <v-img src="../assets/images/rei.svg" height="36" width="36"></v-img>
                                </div>
                                <div>
                                    <v-img src="../assets/images/rei.svg" height="36" width="36"></v-img>
                                </div>
                                <div>
                                    <v-img src="../assets/images/rei.svg" height="36" width="36"></v-img>
                                </div>
                                <div>
                                    <v-img src="../assets/images/rei.svg" height="36" width="36"></v-img>
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="12" md="9">
                    <!-- <v-img src="../assets/images/map.svg"></v-img> -->
                    <!-- <div class="map-content"> -->
                        <div id="myCharts" ref="chart" class="dispribution" style="height:100%"></div>
                    <!-- </div> -->
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
                        <div class="node-number">159,166 <span class="font-grey">txns</span></div>
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
export default {
filters,
  data() {
    return {
     blockHeight:'',
     miner:'',
     stats:{}
    };
  },
  computed: {
    ...mapGetters({
        connection: 'connection',
        dark: 'dark'
    })
  },
  mounted(){
      this.myCharts();
      this.connect();
      this.getBlock();
  },
  methods: {   
      connect() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
    },
    //  myCharts(){
    //   const chart = this.$refs.chart;
    //   if(chart){
    //     this.myChart = this.$echarts.init(chart);
    //      var option = {
    //             xAxis: {
    //                 axisTick: {
    //                     show: false
    //                 },
    //                 axisLine: {
    //                     show:false,
    //                 },
    //                 axisLabel:{
    //                     show:false,
    //                 },
    //                 splitLine: {
    //                     show: false,
    //                 },
    //             },
    //             yAxis: {
    //                 data:[],
    //                 axisTick: {
    //                     show: false
    //                 },
    //                 axisLine: {
    //                     show:false,
    //                 },
    //                 axisLabel:{
    //                     show:false,
    //                 },
    //                 splitLine: {
    //                     show: false,
    //                 },
    //             },
    //             series: [
    //                 {
                        
    //                     type: 'effectScatter',
    //                     symbolSize: 20,
    //                     data: [
    //                         [18.22, 6.82],
    //                     ],
    //                     itemStyle:{
    //                             color:'#2115E5'
    //                         },
    //                     },
    //                 {
    //                     data: [
    //                         [3.0, 9.04],
    //                         [5.07, 6.55],
    //                         [16.22, 7.58],
    //                         [16.65, 6.41],
    //                         [18.22, 6.82],
    //                         [27.55, 7.72],
    //                         [29.99, 6.45]
    //                     ],
    //                     itemStyle:{
    //                             color:'#2135E5'
    //                         },
    //                     type: 'scatter',
    //                 }
    //             ]
    //         }
    //       this.myChart.setOption(option)
    //       window.addEventListener("resize", function() {
    //         this.myChart.resize()
    //       })
    //     }
    //   this.$on('hook:destroyed',()=>{
    //      window.removeEventListener("resize", function() {
    //         this.myChart.resize();
    //     });
    // })
    // },
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
                show: true
            },
            map: 'iceland_svg',
            roam: false,
            },
            series: {
            type: 'scatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            symbolSize: 14,
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
        };
        myChart.setOption(option);
        myChart.getZr().on('click', function (params) {
            var pixelPoint = [params.offsetX, params.offsetY];
            var dataPoint = myChart.convertFromPixel({ geoIndex: 0 }, pixelPoint);
            console.log(dataPoint);
        });
        });

option && myChart.setOption(option);
     },
   async getBlock(){
        this.blockHeight = await web3.eth.getBlockNumber();
        let block = await web3.eth.getBlock(this.blockHeight);
        this.miner = block.miner
        console.log('blockNumber', this.miner)
        try {
            const { data } = await this.$axios.get('https://gateway.rei.network/api/reistats')
            this.stats = data.row.json;
            console.log('this.stats',this.stats)
        } catch (error) {
            console.log(error)
        }
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
    font-size: 32px;
    font-weight: bolder;
}
.block{
    margin-top: 16px;
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
    background: url('../assets/images/map.svg') no-repeat center;
    background-size: 100% 100%!important;
}
.map-nodes{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.miner{
    text-align: right;
    font-size: 14px;
}
</style>
