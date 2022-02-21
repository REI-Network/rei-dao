<template>
  <v-container>
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <v-row>
      <v-col cols="12" md="12" sm="12" class="charts-faq"> 
        <div class="total-charts">
          <v-card
            class="mx-auto"
            tile
            style="padding-bottom:24px;margin-top:12px;"
            color="background"
          >
            <v-row class="head-chips">
                 <v-subheader><h3>Charts</h3></v-subheader>
                <v-row align="center" style="margin-right:20px;justify-content: flex-end;">
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
                        <v-chip
                            class="ma-2"
                            filter
                            x-small
                            >
                            All
                        </v-chip>
                    </v-row>
            </v-row>
            <div class="trend-head">
                <v-tabs class="trend-tab" background-color="background" v-model="tab" hide-slider>
                    <v-radio-group
                        v-model="radios"
                        mandatory
                        row
                        dense
                        style="margin-top:0;"
                        >
                        <v-tab key="1">
                            <v-radio
                                label="Price"
                                value="1"
                                class="trends-radio"
                            >
                            </v-radio>
                        </v-tab>
                        <v-tab key="2">
                            <v-radio
                            label="Market Cap"
                            value="2"
                            >
                            </v-radio>
                        </v-tab>   
                    </v-radio-group>
                </v-tabs>
               </div>
                <v-tabs-items v-model="tab">
                    <v-tab-item key="1">
                        <div ref="chartPrice"  style="height:400px"></div> 
                    </v-tab-item>
                    <v-tab-item key="2">
                        <div ref="chartPrice2"  style="height:400px"></div>
                    </v-tab-item>
                    <div class="update-time" style="margin-top:-20px">
                        <v-icon
                            color="primary"
                            size="12"
                            >
                                mdi-clock-time-ten-outline
                            </v-icon>
                                1h Ago
                        </div>
                </v-tabs-items>
          </v-card>          
        </div>
        <div class="faq-get" style="width:38%">
            <v-card
                class="mx-auto"     
                tile
                style="padding-bottom:32px;height:506px;"
                color="background"
            >
                <v-subheader class="price-more"><h3>Price And Market Stats</h3><div>More>></div></v-subheader>
                <v-list
                    subheader
                    two-line
                    style="margin-top:4px"   
                >
                    <v-list-item
                        v-for="folder in folders"
                        :key="folder.index"
                    >
                        <v-list-item-content>
                            <v-list-item-subtitle>{{folder.subtitle}}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action class="list-price" >
                            <v-list-item-subtitle>{{folder.coin}}{{folder.number}}</v-list-item-subtitle>
                        </v-list-item-action>
                    </v-list-item>
               </v-list>
               <div class="update-time">
                    <v-icon
                        color="primary"
                        size="12"
                    >
                       mdi-clock-time-ten-outline
                    </v-icon>
                    1h Ago
                </div> 
            </v-card>
        </div>
      </v-col>
     </v-row>   
    </v-container>
</template>
<script>
import * as echarts from 'echarts';
/* eslint-disable no-undef */
export default {
  data() {
    return {
        radios:1,
        tab:"1",
        folders: [
        {
          subtitle: 'REI Price',
          number:'2.00',
          coin:'$'
        },
        {
          subtitle: 'Market Cap',
          number:'150,109,520',
          coin:'$'
        },
        {
          subtitle: 'Holders',
          number:'109,502',
          coin:''
        },
        {
          subtitle: 'Trading Volume',
          number:'244,406,813',
          coin:'$'
        },
        {
          subtitle: 'Volume/Market Cap',
          number:'1.6265',
          coin:''
        },
        {
          subtitle: '24h Low/24h High',
          number:'1.86/$2.26',
          coin:'$'
        },
        {
          subtitle: '7d Low/7d High',
          number:'1.13/$2.69',
          coin:'$'
        },
        {
          subtitle: 'Market Cap Rank',
          number:'#368',
          coin:'$'
        },
      ],
    };
  },
    watch: {
       tab:{
           handler(newValue,oldValue){
               this.tab = newValue;
               console.log('oldValue',oldValue)
               setTimeout(() => {
                    this.myCharts(); 
                }, 200);
            }
        }
    },
  mounted() {
      setTimeout(() => {
          this.myCharts()
      },500 
    ); 
  },
  destroyed() {
    
  },
  methods: {
    myCharts(){
        if(this.tab===0){
            const chartPrice = this.$refs.chartPrice;
        if(chartPrice){
        const myChart = this.$echarts.init(chartPrice) 
        var option = {
            tooltip:{
                trigger:'axis'
            },
            xAxis: {
                type: 'category',
                data: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00','15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00','22:00','23:00','24:00','25:00'],
                boundaryGap:false,
                axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#2C2752', //坐标线的颜色
                            width: '1' //坐标线的宽度
                        }
                    },
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show:false,
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#2C2752', //坐标线的颜色
                            width: '1' //坐标线的宽度
                        }
                    },
            },

            legend: {
                selectedMode: false,
                itemWidth: 16,
                itemHeight: 16,
                top: 'bottom',
                textStyle: {
                    fontSize: 16,
                    color:'#2C2752'
                },
            },
            series: [
                {
                    name:'USD',
                    data: [656,789,983,834,865,890,766,800,900,986,820, 932, 901, 934, 1290, 1330, 1320,1348,],
                    type: 'line',
                    symbol: "none",
                    itemStyle:{
                        color:'#2F86F6'
                    },
                    areaStyle: {
                        //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ 
                            offset: 0,
                            color: 'rgba(80,141,255,0.39)'
                        }, {
                            offset: .34,
                            color: 'rgba(56,155,255,0.25)'
                        },{
                            offset: 1,
                            color: 'rgba(38,197,254,0.00)'
                        }])
                    }
                }
            ],
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
        const chartPrice2 = this.$refs.chartPrice2;
        if(chartPrice2){
        const myChart2= this.$echarts.init(chartPrice2) 
        var option2 = {
            tooltip:{
                trigger:'axis'
            },
            xAxis: {
                type: 'category',
                data: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00','15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00','22:00','23:00','24:00','25:00'],
                boundaryGap:false,
                axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#2C2752', //坐标线的颜色
                            width: '1' //坐标线的宽度
                        }
                    },
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show:false,
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#2C2752', //坐标线的颜色
                            width: '1' //坐标线的宽度
                        }
                    },
            },

            legend: {
                selectedMode: false,
                itemWidth: 16,
                itemHeight: 16,
                top: 'bottom',
                textStyle: {
                    fontSize: 16,
                    color:'#2C2752'
                },
            },
            series: [
                {
                    name:'USD',
                    data: [656,789,983,834,865,890,766,800,900,986,820, 932, 901, 934, 1290, 1330, 1320,1348,],
                    type: 'line',
                    symbol: "none",
                    itemStyle:{
                        color:'rgb(80,14,25)'
                    },
                    areaStyle: {
                        //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ 
                            offset: 0,
                            color: 'rgba(80,14,25,0.39)'
                        }, {
                            offset: .34,
                            color: 'rgba(56,14,25,0.25)'
                        },{
                            offset: 1,
                            color: 'rgba(38,19,25,0.00)'
                        }])
                    }
                }
            ],
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
    }
  },
  computed: {
   
  }
};
</script>

<style scoped lang="scss">
.charts-faq{
        display: flex;
        justify-content: space-between;
        padding: 0;
        background-color:transparent;
    .total-charts{
        width: 60%;
    }
    .trend-head{
        display: flex;
        justify-content: space-between;
  }
  .trends-radio{
        margin-left: 20px;
    label{
        font-size: 12px;
    }  
}
.theme--dark.v-chip:not(.v-chip--active){
    background-color:#9F9DB9;
   }
}
.v-tab{
    padding: 0 !important;
}
.faq-get{
   .price-more{
        display: flex;
        justify-content: space-between;
    } 
}
.theme--dark.v-tabs-items{
    background-color:transparent;
}
.theme--dark.v-list{
    background-color:transparent;
}
.list-price{
    display: flex;
    flex-direction: row;
}
.v-list--two-line .v-list-item, .v-list-item--two-line{
    min-height: 51px;
}
.update-time{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    font-size: 12px;
    margin-right: 20px;
}
.v-tab{
       text-transform: none !important;
   }

@media screen and (max-width: 900px) {
//     .trend-head{
//         display: flex;
//         flex-direction: column;
//    }
    .charts-faq{
        display: flex;
        flex-direction: column;
        padding: 0;
    .total-charts{
        width: 100%;
    }
    .faq-get{
        width: 100% !important;
        margin-top: 20px;
    }
  }
}
</style>
