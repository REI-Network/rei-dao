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
import { mapGetters } from 'vuex';
import { getAssetPrice, getAssetInfo } from '../service/CommonService'
import dayjs from 'dayjs'

/* eslint-disable no-undef */
export default {
  data() {
    return {
        radios:1,
        tab:"1",
        myChart:null,
        myChart2:null,
        folders: [],
        marketData: [],
        priceData: []
    };
  },
  watch: {
    tab:{
        handler(newValue){
            this.tab = newValue;
            setTimeout(() => {
                this.myCharts(); 
            }, 200);
        }
    },
    '$store.state.connection': function() {
      this.getPriceChart()
    },
  },
  computed: {
    ...mapGetters({
      connection: 'connection',
    })
  },
  mounted() {
    setTimeout(() => {
          this.myCharts()
      },500 
    ); 
    this.getPriceChart()
  },
  destroyed() {
    
  },
  methods: {
    getApiUrl(){
        let api = ''
        if(this.connection.network == 'REI Devnet'){
            api = process.env.VUE_APP_DEV_SERVER_API;
        } else if(this.connection.network == 'REI Testnet'){
             api = process.env.VUE_APP_TEST_SERVER_API
        } else {
            api = process.env.VUE_APP_SERVER_API;
        }
        return api;
    },
    async getPriceChart(){
        let apiUrl = this.getApiUrl();
        let chartData = await getAssetPrice(apiUrl);
        let { data: { data:chartInfoData}} = await getAssetInfo(apiUrl);

        let needObject = ['current_price','market_cap','total_volume','total_supply','high_24h','low_24h','price_change_percentage_24h','circulating_supply']
        console.log(chartInfoData);
        this.folders = needObject.map((item)=>{
            return {
                subtitle:item,
                number:chartInfoData[item]
            }
        })


        this.chartData = chartData.data.data;
        console.log('this.chartData',this.chartData)
        let priceData = this.chartData.prices.map((item,index)=>{
            if(index < this.chartData.prices.length){
                return {
                    "value": [
                        dayjs(item[0]).format('YYYY-MM-DD HH:00'),
                        item[1]
                    ]
                }
            }
            
        })
        let marketData = this.chartData.market_caps.map((item,index)=>{
            if(index < this.chartData.market_caps.length){
                return {
                    "value": [
                        dayjs(item[0]).format('YYYY-MM-DD HH:00'),
                        item[1]
                    ]
                }
            }
            
        })
        console.log(priceData)
        this.priceData = priceData;
        this.marketData = marketData
        this.myChart.setOption({
            series: [
              {
                data: priceData
              }
            ]
        });
    },
    myCharts(){
        if(this.tab===0){
            const chartPrice = this.$refs.chartPrice;
        if(chartPrice){
        this.myChart = this.$echarts.init(chartPrice) 
        var option = {
            tooltip:{
                trigger:'axis'
            },
            xAxis: {
                type: 'time',
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
                    color:'#868e9e'
                },
            },
            series: [
                {
                    name:'USD',
                    data: [],
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
        this.myChart.setOption(option)
         this.myChart.setOption({
            series: [
              {
                data: this.priceData
              }
            ]
        });
        this.myChart.setOption({
            series: [
            {
                data: this.resFeeStakeData
            }
            ]
        });
        window.addEventListener("resize", function() {
          this.myChart.resize()
        })
    }
    this.$on('hook:destroyed',()=>{
         window.removeEventListener("resize", function() {
            this.myChart.resize();
        });
    })
        }else{
        const chartPrice2 = this.$refs.chartPrice2;
        if(chartPrice2){
        this.myChart2= this.$echarts.init(chartPrice2) 
        var option2 = {
            tooltip:{
                trigger:'axis'
            },
            xAxis: {
                type: 'time',
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
                    color:'#868e9e'
                },
            },
            series: [
                {
                    name:'USD',
                    data: [],
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
        this.myChart2.setOption(option2)
        this.myChart2.setOption({
            series: [
              {
                data: this.marketData
              }
            ]
        });
        window.addEventListener("resize", function() {
          this.myChart2.resize()
        })
    }
    this.$on('hook:destroyed',()=>{
         window.removeEventListener("resize", function() {
           this.myChart2.resize();
        });
    })

        }
    }
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
