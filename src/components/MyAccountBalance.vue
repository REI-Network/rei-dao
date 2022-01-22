<template>
  <v-container class="stake_background">
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <v-row>
      <v-col class="accout-item"> 
        <div class="balance-card">
          <v-card
            class="mx-auto secend-card"
            tile
            color="background"
          >
          <v-subheader>
            <h3>balance</h3>
            <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    dense
                    style="margin-left:8px"
                  >
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                 <span>Freely Usable REI,Excluding Stakes IN Vote,Gas Stake</span>
            </v-tooltip>
          </v-subheader>
          <v-subheader class="total-rei">127,322,423.00<span class="rei">REI</span></v-subheader>
          <v-subheader style="height:16px">
            <div class="add-price" style="border-right:2px solid;padding-right:12px">
               <div>$13,434.00</div>
               <div style="color:#65BB67;">+15.16%</div>
            </div>
            <div class="add-price" style="margin-left:12px">
               <div>24H</div>
               <div class="update-time">
                <v-icon
                    color="primary"
                    size="12"
                  >
                    mdi-clock-time-ten-outline
                </v-icon>
                    1h Ago
            </div>
            </div>
          </v-subheader>
          <div id="myCharts" ref="chart" style="height:280px"></div>
          <!-- <div class="update-time" style="margin-top:-20px;">
                <v-icon
                    color="primary"
                    size="12"
                  >
                    mdi-clock-time-ten-outline
                </v-icon>
                    1h Ago
            </div> -->
          </v-card>          
        </div>
        <div class="voting-card">
          <v-card
            class="mx-auto secend-card"     
            tile
            color="background"
          >
          <v-subheader><h3>Voting</h3></v-subheader>
          <div class="chips-tow">
            <v-card
            class="ma-4 voting-stake"
            label
            outlined
          >
             <div class="content-left">
                <v-subheader class="total-rei">127,322,423.00<span class="rei">REI</span></v-subheader>
                <v-subheader>
                    <div class="add-price" style="border-right:2px solid;padding-right:12px">
                        <div>$13,434.00</div>
                        <div style="color:#65BB67;">+15.16%</div>
                    </div>
                    <div class="add-price" style="margin-left:12px">
                      <div>24H</div>
                      <div class="update-time">
                        <v-icon
                            color="primary"
                            size="12"
                        >
                          mdi-clock-time-ten-outline
                      </v-icon>
                    1h Ago
                      </div>
                    </div>
              </v-subheader>
              <v-subheader>
                  Validator Voting Stake
                  <v-tooltip right>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="primary"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          dense
                          style="margin-left:8px"
                        >
                          mdi-help-circle-outline
                        </v-icon>
                      </template>
                 <span>Freely Usable REI,Excluding Stakes IN Vote,Gas Stake</span>
                </v-tooltip>
              </v-subheader>
             </div>
                 <v-icon
                    color="primary"
                    dark
                    size="22"
                    class="icon-right"
                  >
                  mdi-arrow-right-circle
                </v-icon>
            </v-card>
           <v-card
            class="ma-4 voting-stake"
            label
            outlined
          >
             <div class="content-left">
                <v-subheader class="total-rei">127,322,423.00<span class="rei">REI</span></v-subheader>
                <v-subheader>
                    <div class="add-price" style="border-right:2px solid;padding-right:12px">
                        <div>$13,434.00</div>
                        <div style="color:#65BB67;">+15.16%</div>
                    </div>
                    <div class="add-price" style="margin-left:12px">
                      <div>24H</div>
                      <div class="update-time">
                        <v-icon
                            color="primary"
                            size="12"
                        >
                          mdi-clock-time-ten-outline
                      </v-icon>
                    1h Ago
                      </div>
                    </div>
              </v-subheader>
              <v-subheader>
                  Validator Voting Stake
                  <v-tooltip right>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="primary"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          dense
                          style="margin-left:8px"
                        >
                          mdi-help-circle-outline
                        </v-icon>
                      </template>
                 <span>Freely Usable REI,Excluding Stakes IN Vote,Gas Stake</span>
                </v-tooltip>
              </v-subheader>
             </div>
                 <v-icon
                    color="primary"
                    dark
                    size="22"
                    class="icon-right"
                  >
                  mdi-arrow-right-circle
                </v-icon>
            </v-card>
          </div>   
        </v-card>
        </div>
      </v-col>
    </v-row>   
    </v-container>
</template>
<script>
/* eslint-disable no-undef */
import * as echarts from 'echarts';
export default {
  data() {
    return {
        radios:'Total Voting Stake',
    };
  },
  watch: {
  
  },
  mounted() {
    this.myCharts()
  },
  destroyed() {
    
  },
  methods: {
    myCharts(){
      const chart = this.$refs.chart;
      if(chart){
        const myChart = this.$echarts.init(chart);
        var option = {
          xAxis: {
            type: 'category',
            data: ['Oct/18', 'Oct/19', 'Oct/20', 'Oct/21', 'Oct/22', 'Oct/23', 'Oct/24'],
            //刻度线
            axisTick: {
              show: false
            },
            axisLine: {
              show:false,
            },
            axisLabel: {
              textStyle: {
                fontSize: 12,
              }
            },         
          },
          yAxis: {
            type: 'value',
            data:[0,150,300,450,600],
          
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
                lineStyle: {
                  color: 'rgba(104, 180, 221, 0.1)',
                  type: 'dashed',
                }
              },
            },
        // legend: {
        //         selectedMode: false,
        //         itemWidth: 16,
        //         itemHeight: 16,
        //         top: 'bottom',
        //         textStyle: {
        //             fontSize: 16,
        //             color:'#2C2752'
        //         },
        //     },
          series: [
            {
               name:'Total Voting Stake',
              data: [120, 200, 150, 80, 70, 110, 130],
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
          myChart.setOption(option)
          window.addEventListener("resize", function() {
            myChart.resize()
          })
        }
      this.$on('hook:destroyed',()=>{
         window.removeEventListener("resize", function() {
            myChart.resize();
        });
    })
    }
  },
  computed: {
   
  }
};
</script>

<style scoped lang="scss">
.accout-item{
  display: flex;
  justify-content: space-between;
  padding: 0;
  .balance-card{
    width: 49%;
  }
  .voting-card{
    width: 49%;
  }
  .secend-card{
    height: 430px;
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
  .chips-tow{
    display: flex;
    flex-direction: column;
  }
  .voting-stake{
    height:150px;
    display: inline-flex;
    justify-content: space-between !important;
    background-color: transparent !important;
      .content-left{
        width:350px;
        margin:12px 0;
      }
      .icon-right{
        margin-right:20px;
      }
    }
  .add-price{
      width: 50%;
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
    .icon-right{
      }
  }
}
</style>
