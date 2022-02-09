<template>
  <v-container class="stake_background">
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->   
  <v-row>
        <v-col cols="12" md="12" sm="12" style="padding:0px">
            <v-card
                class="mx-auto"
                tile
                color="background"
                style="padding-bottom:20px"
            >
            <v-subheader><h3>Trends</h3></v-subheader>
            <div class="trends-head">
                <v-tabs v-model="tab" 
                    background-color="background"
                    hide-slider 
                    class="trend-tab"
                    align-with-title
                    >
                    <v-radio-group
                        v-model="radios"
                        mandatory
                        row
                        dense
                    >
                        <v-tab key="1">
                            <v-radio
                                label="Total Stake"
                                value="1"
                                class="trends-radio"
                                >
                            </v-radio>
                        </v-tab>
                        <v-tab key="2">
                            <v-radio
                                label="Saving On Gas For Users"
                                value="2"
                                >
                            </v-radio>
                        </v-tab>
                    </v-radio-group>
                </v-tabs>
                <v-row align="center" style="margin:0;">
                        <v-chip
                            class="ma-2"
                            filter
                            x-small
                            >
                            24H
                        </v-chip>
                        <v-chip
                            class="ma-2"
                            filter
                            x-small
                            >
                            7D
                        </v-chip>
                        <v-chip
                            class="ma-2"
                            filter
                            x-small
                            >
                            30D
                        </v-chip>
                    </v-row>
                </div>
                <v-tabs-items v-model="tab">
                    <v-tab-item key="1">
                        <div ref="chart"  style="height:400px"></div>
                    </v-tab-item>
                    <v-tab-item key="2">
                        <div ref="chart2"  style="height:400px"></div>
                    </v-tab-item>
                </v-tabs-items>
                <!-- <div ref="chart2"  style="height:400px"></div> -->
            </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable no-undef */
export default {
  data() {
    return {
       radios: null,
       tab: "1",
       flag:0,
    };
  },
  watch: {
       tab:{
           handler(newValue){
               this.tab = newValue;
            //    console.log('oldValue',oldValue)
               setTimeout(() => {
                    this.trendsCharts(); 
                }, 200);
            }
        }
    },
  mounted() {
    //   setTimeout(() => {
    //     this.trendsCharts(); 
    //     // this.trendsCharts2(); 
    //   }, 500);
  },
  methods: {
    trendsCharts(){
        if(this.tab===0){
            const chart = this.$refs.chart;
        if(chart){
        const myChart = this.$echarts.init(chart)
        var option = {
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: ['Gas Stake', 'Voting Stake', 'Total Stake'],
                top: 'bottom',
                itemWidth: 16,
                itemHeight: 16,
                textStyle: {
                    fontSize: 16,
                    color:'#2C2752'
                },
            },
            xAxis:       
                {
                    type: 'category',
                    data: ['Oct/18', 'Oct/19', 'Oct/20', 'Oct/21', 'Oct/22', 'Oct/23', 'Oct/24','Oct/25','Oct/26','Oct/27','Oct/28','Oct/29','Oct/30','Oct/31','Nov/1'],
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#2C2752', //坐标线的颜色
                            width: '1' //坐标线的宽度
                        }
                    },
                    splitLine: {
                        lineStyle: {
                        color: 'rgba(104, 180, 221, 0.1)',
                        type: 'dashed',
                      }
                    },
                },
            yAxis: {
                    type: 'value',
                    axisLine: {
                    lineStyle: {
                        show: true,
                        type: 'solid',
                        color: '#2C2752', //左边线的颜色
                        width: '1' //坐标线的宽度
                        },
                    },
                    splitLine: {
                        lineStyle: {
                        color: 'rgba(104, 180, 221, 0.1)',
                        type: 'dashed',
                      }
                    },
            },
            
            series: [
                {       
                    name: 'Gas Stake',
                    type: 'bar',
                    data: [
                        12,24,23,54,32,18,54,33,22,44,33,23,45,26,90
                    ],
                    barWidth:'12',
                    barGap: '40%',
                    itemStyle:{
                        color:'#28AA91'
                    }
                },
            {
                name: 'Voting Stake',
                type: 'bar',
                data: [
                        12,64,23,50,32,18,54,33,28,14,33,23,45,66,90
                    ],
                barWidth:'12',
                barGap: '40%',
                itemStyle:{
                        color:'#2F86F6'
                    }
            },
            {
                name: 'Total Stake',
                type: 'line',
                data: [
                        12,24,23,14,32,18,54,53,22,44,33,73,45,26,90
                    ],
                barWidth:'10',
                itemStyle:{
                    color:'#EC733C'
                }
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
        }else{
        const chart2 = this.$refs.chart2;
        if(chart2){
        const myChart2 = this.$echarts.init(chart2)
        var option2 = {
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: [ 'Savings On Gas For User', 'Total Stake'],
                top: 'bottom',
                itemWidth: 16,
                itemHeight: 16,
                textStyle: {
                    fontSize: 16,
                    color:'#2C2752'
                },
            },
            xAxis:       
                {
                    type: 'category',
                    data: ['Oct/18', 'Oct/19', 'Oct/20', 'Oct/21', 'Oct/22', 'Oct/23', 'Oct/24','Oct/25','Oct/26','Oct/27','Oct/28','Oct/29','Oct/30','Oct/31','Nov/1'],
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#2C2752', //坐标线的颜色
                            width: '1' //坐标线的宽度
                        }
                    },
                    splitLine: {
                        lineStyle: {
                        color: 'rgba(104, 180, 221, 0.1)',
                        type: 'dashed',
                      }
                    },
                },
            yAxis: {
                    type: 'value',
                    axisLine: {
                    lineStyle: {
                        show: true,
                        type: 'solid',
                        color: '#2C2752', //左边线的颜色
                        width: '1' //坐标线的宽度
                        },
                    },
                    splitLine: {
                        lineStyle: {
                        color: 'rgba(104, 180, 221, 0.1)',
                        type: 'dashed',
                      }
                    },
            },
            series: [
                {       
                    name: 'Savings On Gas For User',
                    type: 'bar',
                    data: [
                        12,24,23,54,32,18,54,33,22,44,33,23,45,26,90
                    ],
                    barWidth:'12',
                    barGap: '40%',
                    itemStyle:{
                        color:'#28AA91'
                    }
                },
            {
                name: 'Total Stake',
                type: 'line',
                data: [
                        12,24,23,14,32,18,54,53,22,44,33,73,45,26,90
                    ],
                barWidth:'6',
                itemStyle:{
                    color:'#EC733C'
                }
            }
        ]
    };
        myChart2.setOption(option2)
        window.addEventListener("resize", function() {
          myChart2.resize()
        })
    }
    this.$on('hook:destroyed',()=>{
         window.removeEventListener("resize", function() {
            myChart2.resize();
        });
    })
        }
        
},      
  },
  computed: {
   
  }
};
</script>

<style scoped lang="scss">
.trends-radio{
    margin-left: 20px;
    label{
        font-size: 12px;
    }
}
.trend-tab{
    width:80%;
}
.theme--dark.v-chip:not(.v-chip--active){
    background-color:#9F9DB9;
   }
.theme--dark.v-tabs-items{
    background-color:transparent;      
}
.trends-head{
    display: flex;
    justify-content: space-between;
}
.v-tab{
       text-transform: none !important;
   }
@media screen and (max-width: 900px) {
    .trend-tab{
        width:100%;
    }
   .trends-head{
        display: inline !important;
   }
   .v-tab{
       padding: 0 !important;
   }
}
</style>
