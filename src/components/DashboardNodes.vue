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
                        <div class="node-number">5,799,097</div>
                    </div>
                    <div class="block">
                        <div class="font-grey">Validators</div>
                        <div class="node-number">21</div>
                    </div>
                    <div class="block">
                        <div class="font-grey">Current Node</div>
                        <v-row align="center">
                            <v-col cols="12" md="3">
                                <v-img src="../assets/images/rei.svg"></v-img>
                            </v-col>
                            <v-col cols="12" md="9">
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
                            <v-col
                                v-for="n in 5"
                                :key="n"
                                cols="12" md="2"
                            >
                                <v-img src="../assets/images/rei.svg"></v-img>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="12" md="9">
                    <!-- <v-img src="../assets/images/map.svg"></v-img> -->
                    <div class="map-content">
                        <div id="myCharts" ref="chart" class="dispribution" style="height:400px"></div>
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
                        <div class="node-number">3.10 <span class="font-grey">s</span></div>
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
                    <div class="block">
                        <div class="font-grey">Pending Transactions</div>
                        <div class="node-number">48,443 <span class="font-grey">txns</span></div>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="3">
                <v-card class="rei-card">
                    <h3>Addresses</h3>
                    <div class="block">
                        <div class="font-grey">Contract Addresses</div>
                        <div class="node-number">9,166 <span class="font-green">+36</span></div>
                    </div>
                    <div class="block">
                        <div class="font-grey">Wallet Addresses</div>
                        <div class="node-number">6,451 <span class="font-green">+47</span></div>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="3">
                <v-card class="rei-card">
                    <h3>Token</h3>
                    <div class="block">
                        <div class="font-grey">Total Token Number</div>
                        <div class="node-number">159,166 <span class="font-green">+117</span></div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import * as echarts from 'echarts';
export default {
  data() {
    return {
     
    };
  },
  computed: {
    ...mapGetters({
        connection: 'connection',
        dark: 'dark'
    })
  },
  mounted(){
      this.myCharts()
  },
  methods: {
    //   myCharts(){
    //     const chart = this.$refs.chart;
    //     if(chart){  
    //         const myChart = this.$echarts.init(chart);
    //         var option = {
    //             xAxis: {},
    //             yAxis: {},
    //             series: [
    //                 {
    //                 symbolSize: 20,
    //                 data: [
    //                     [10.0, 8.04],
    //                     [8.07, 6.95],
    //                     [13.0, 7.58],
    //                     [9.05, 8.81],
    //                     [11.0, 8.33],
    //                     [14.0, 7.66],
    //                     [13.4, 6.81],
    //                     [10.0, 6.33],
    //                     [14.0, 8.96],
    //                     [12.5, 6.82],
    //                     [9.15, 7.2],
    //                     [11.5, 7.2],
    //                     [3.03, 4.23],
    //                     [12.2, 7.83],
    //                     [2.02, 4.47],
    //                     [1.05, 3.33],
    //                     [4.05, 4.96],
    //                     [6.03, 7.24],
    //                     [12.0, 6.26],
    //                     [12.0, 8.84],
    //                     [7.08, 5.82],
    //                     [5.02, 5.68]
    //                 ],
    //                 type: 'scatter'
    //                 }
    //             ]
    //         }
    //         myChart.setOption(option)
    //         window.addEventListener("resize", function() {
    //             myChart.resize()
    //         })
    //     }
    //      this.$on('hook:destroyed',()=>{
    //      window.removeEventListener("resize", function() {
    //         // myChart.resize();
    //     });
    //   })
    //  }   
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
    font-size: 40px;
    font-weight: bolder;
}
.block{
    margin-top: 12px;
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
</style>
