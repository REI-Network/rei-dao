<template>
  <v-container>
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <v-row>
      <v-col class="charts-faq"> 
        <div class="total-charts">
          <v-card
            class="mx-auto"
            rounded="4"
            color="background"
            style="margin-top:12px;height:480px"
          >
            <v-row class="head-chips" justify="space-between">
                 <v-subheader class="sub-title"><h3>Charts</h3></v-subheader>
                 <v-chip-group active-class="chip_group" v-model="model" mandatory>
                        <v-chip
                            class="ma-3"    
                            x-small
                            v-for="tag in tags"
                            :key="tag" 
                            >
                            {{tag}}
                        </v-chip>
                    </v-chip-group>
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
                    </v-radio-group>
                </v-tabs>
               </div>
                
                    <div ref="chartPrice"  style="height:376px"></div> 
                    
                    <!-- <div class="update-time" style="margin-top:-20px">
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
        <div class="faq-get" style="width:38%">
            <v-card
                class="mx-auto"     
                rounded="4"
                color="background"
                style="height:480px"
            >
                <v-subheader class="price-more sub-title">
                    <h3>Price And Market Stats</h3>
                    <a href="https://www.coingecko.com/en/coins/rei-network" class="title-detailed" target="_blank">more></a>
                </v-subheader>
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
                            <v-list-item-subtitle>{{folder.sub}}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action class="list-price" >
                            <v-list-item-subtitle>{{folder.coin}}<strong class="folder-number ">{{folder.number}}</strong></v-list-item-subtitle>
                        </v-list-item-action>
                    </v-list-item>
               </v-list>
               <!-- <div class="update-time">
                    <v-icon
                        color="primary"
                        size="12"
                    >
                       mdi-clock-time-ten-outline
                    </v-icon>
                    1h Ago
                </div>  -->
            </v-card>
        </div>
      </v-col>
     </v-row>   
    </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import { getAssetPrice } from '../service/CommonService'
import dayjs from 'dayjs'
import util from '../utils/util'

/* eslint-disable no-undef */
export default {
  data() {
    return {
        radios:1,
        tab:0,
        myChart:null,
        myChart2:null,
        folders: [],
        marketData: [],
        priceData: [],
        tags:['24H'],
        model:0,
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
        if(this.connection&&this.connection.network){
            this.getPriceChart()
        }
    },
    '$store.state.assetInfo': function() {
        this.getAssetInfo();
    },
  },
  computed: {
    ...mapGetters({
      connection: 'connection',
      apiUrl: 'apiUrl',
      assetInfo: 'assetInfo'
    })
  },
  mounted() {
    setTimeout(() => {
                this.myCharts(); 
            }, 1000);
    this.getAssetInfo();
    this.getPriceChart();
  },
  destroyed() {
    
  },
  methods: {
    async getAssetInfo(){
        let chartInfoData = this.assetInfo;
        let needObject=[
            {
                subtitle:'current_price',
                sub:this.$t('dashborad.current_price'),
                number:0,
                currency:'$'
            },
            {
                subtitle:'market_cap',
                sub:this.$t('dashborad.market_cap'),
                number:0,
                currency:'$'
            },
            {
                subtitle:'total_volume',
                sub:this.$t('dashborad.total_volume'),
                number:0,
                currency:'$'
            },

            {
                subtitle:'total_supply',
                sub:this.$t('dashborad.total_supply')
            },
            {
                subtitle:'high_24h',
                sub:this.$t('dashborad.high'),
                number:0,
                currency:'$'
            },
            {
                subtitle:'low_24h',
                sub:this.$t('dashborad.low'),
                number:0,
                currency:'$'
            },
            {
                subtitle:'price_change_percentage_24h',
                sub:this.$t('dashborad.price_change')
            },

            {
                subtitle:'circulating_supply',
                sub:this.$t('dashborad.circulating_supply')
            },
        ]
        this.folders = needObject.map((item)=>{
            return {
                subtitle:item.subtitle,
                number:util.numFormat(chartInfoData[item.subtitle]||0),
                sub:item.sub,
                coin: item.currency
            }
        })
    },
    async getPriceChart(){
        this.myChart.showLoading();
        let apiUrl = this.apiUrl.chart;
        let chartData = await getAssetPrice(apiUrl);
        
        // let needObject = ['current_price','market_cap','total_volume','total_supply','high_24h','low_24h','price_change_percentage_24h','circulating_supply']
        //  let needObject = [this.$t('dashborad.current_price'),this.$t('dashborad.market_cap'),this.$t('dashborad.total_volume'),this.$t('dashborad.total_supply'),this.$t('dashborad.high'),this.$t('dashborad.low'),this.$t('dashborad.price_change'),this.$t('dashborad.circulating_supply')]
       

        this.chartData = chartData.data.data;
        let priceData = this.chartData.prices.map((item,index)=>{
            if(index < this.chartData.prices.length-1){
                return {
                    "value": [
                        dayjs(item[0]).format('YYYY-MM-DD HH:00'),
                        item[1]
                    ]
                }
            }
            
        })
        let marketData = this.chartData.market_caps.map((item,index)=>{
            if(index < this.chartData.market_caps.length-1){
                return {
                    "value": [
                        dayjs(item[0]).format('YYYY-MM-DD HH:00'),
                        item[1]
                    ]
                }
            }
            
        })
        this.priceData = priceData;
        this.marketData = marketData;
        console.log('priceData',priceData)
        console.log('marketData',marketData)
        this.myChart.hideLoading();
        // this.myChart.setOption({
        //     series: [
        //       {
        //         data: priceData
        //       },
        //       {
        //         data: marketData
        //       },
        //     ]
        // });
        // console.log('folders',this.folders)
    },
    myCharts(){
            const chartPrice = this.$refs.chartPrice;
            if(chartPrice){
                this.myChart = this.$echarts.init(chartPrice);
                // var option = {
                //     tooltip:{
                //         trigger:'axis',
                //         formatter(params) {
                //             var relVal = params[0].value[0]+'<br>';
                //             for (var i = 0, l = params.length; i < l; i++) {
                //                 var yValue = Number(params[i].value[1]).toFixed(5);
                //                 relVal +=params[i].marker + params[i].seriesName +':'+yValue;
                //             }
                //             return relVal;
                //         },
                //     },
                //     xAxis: {
                //         type: 'time',
                //         boundaryGap:false,
                //         axisLabel: {
                //             show: true,
                //             textStyle: {
                //                 color: "rgba(134,142,158)",
                //               }
                //             },
                //         axisLine: {
                //             lineStyle: {
                //                 type: 'solid',
                //                 color: 'rgba(134,142,158)', 
                //                 width: '1' 
                //             }
                //         },
                //         data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                //         splitLine:{show: false}
                //     },
                //     yAxis:[
                //       {
                //           position: 'right',
                //           name:'price',
                //           type: 'value',
                //           splitLine: {
                //               show:false,
                //           },
                //           axisLabel: {
                //             formatter: '${value}',
                //             textStyle: {
                //                 color: "rgba(134,142,158,.6)",
                //             },
                //           },
                //           axisLine: {
                //             show:true,
                //               lineStyle: {
                //                   type: 'solid',
                //                   color: 'rgba(134,142,158,.1)', 
                //                   width: '1' 
                //               }
                //           },
                //       },
                //       {
                //           position: 'left',
                //           name: 'marketcap',
                //           type: 'value',
                //           axisLabel:{
                //               formatter: '${value}'
                //           },
                //           axisLine: {
                //               lineStyle: {
                //                   type: 'solid',
                //                   color: 'rgba(134,142,158, 0.1)', 
                //                   width: '1' 
                //               }
                //           },
                //       }
                //     ], 
                //     series: [
                //         {
                //             name:'price',
                //             data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                //             type: 'line',
                //             symbol: "none",
                //             itemStyle:{
                //                 color:'#2F86F6'
                //             },
                            
                //         },
                //         {
                //             name:'marketcap',
                //             data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
                //             type: 'line',
                //             symbol: "none",
                //             itemStyle:{
                //                 color:'rgb(253,131,53)'
                //             }
                //         }
                //     ],
                // }
                const colors = ['#5470C6', '#91CC75', '#EE6666'];
                let option = {
                  color: colors,
                  tooltip: {
                    trigger: 'axis',
                    formatter(params) {
                            var relVal = params[0].value[0]+'<br>';
                            for (var i = 0, l = params.length; i < l; i++) {
                              var yValue = Number(params[i].value[1]).toFixed(5);
                              if(params[i].seriesName == 'marketcap'){
                                yValue = Number(params[i].value[2]).toFixed(5);
                              }
                                
                                relVal +=params[i].marker + params[i].seriesName +':'+yValue;
                            }
                            return relVal;
                        },
                    axisPointer: {
                      type: 'cross'
                    }
                  },
                  grid: {
                    right: '20%'
                  },
                  legend: {
                    data: ['price', 'marketcap']
                  },
                  xAxis: [
                    {
                      type: 'time',
                      axisTick: {
                        alignWithLabel: true
                      },
                      // prettier-ignore
                      // data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    }
                  ],
                  yAxis: [
                    {
                      type: 'value',
                      name: 'price',
                      position: 'left',
                      alignTicks: true,
                      axisLine: {
                        show: true,
                        lineStyle: {
                          color: colors[0]
                        }
                      },
                      axisLabel: {
                        formatter: '{value}'
                      }
                    },
                    {
                      type: 'value',
                      name: '温度',
                      position: 'right',
                      alignTicks: false,
                      axisLine: {
                        show: true,
                        lineStyle: {
                          color: colors[2]
                        }
                      },
                      axisLabel: {
                        show:true,
                      }
                    }
                  ],
                  series: [
                    {
                      name: 'price',
                      type: 'line',
                      data: [
    {
        "value": [
            "2022-08-23 00:00",
            "0.036285468047869"
        ]
    },
    {
        "value": [
            "2022-08-23 01:00",
            "0.036449631528134"
        ]
    },
    {
        "value": [
            "2022-08-23 02:00",
            "0.036157027159372"
        ]
    },
    {
        "value": [
            "2022-08-23 03:00",
            "0.035852906669757"
        ]
    },
    {
        "value": [
            "2022-08-23 04:00",
            "0.035949727954392"
        ]
    },
    {
        "value": [
            "2022-08-23 05:00",
            "0.036248146346933"
        ]
    },
    {
        "value": [
            "2022-08-23 06:00",
            "0.036238885970094"
        ]
    },
    {
        "value": [
            "2022-08-23 07:00",
            "0.036162312215211"
        ]
    },
    {
        "value": [
            "2022-08-23 08:00",
            "0.036436655032834"
        ]
    },
    {
        "value": [
            "2022-08-23 09:00",
            "0.036279753641945"
        ]
    },
    {
        "value": [
            "2022-08-23 10:00",
            "0.036414531392927"
        ]
    },
    {
        "value": [
            "2022-08-23 11:00",
            "0.036395055809282"
        ]
    },
    {
        "value": [
            "2022-08-23 12:00",
            "0.036144784933474"
        ]
    },
    {
        "value": [
            "2022-08-23 13:00",
            "0.036212100840928"
        ]
    },
    {
        "value": [
            "2022-08-23 14:00",
            "0.035642018489813"
        ]
    },
    {
        "value": [
            "2022-08-23 15:00",
            "0.035615413148266"
        ]
    },
    {
        "value": [
            "2022-08-23 16:00",
            "0.036197083278299"
        ]
    },
    {
        "value": [
            "2022-08-23 17:00",
            "0.036525599219562"
        ]
    },
    {
        "value": [
            "2022-08-23 18:00",
            "0.036717566607263"
        ]
    },
    {
        "value": [
            "2022-08-23 19:00",
            "0.036567426545945"
        ]
    },
    {
        "value": [
            "2022-08-23 20:00",
            "0.036551835761686"
        ]
    },
    {
        "value": [
            "2022-08-23 21:00",
            "0.036475325051139"
        ]
    },
    {
        "value": [
            "2022-08-23 22:00",
            "0.036867618311171"
        ]
    },
    {
        "value": [
            "2022-08-23 23:00",
            "0.036933898789927"
        ]
    }
]
                    },
                    {
                      name: 'marketcap',
                      type: 'line',
                      data: [
    {
        "value": [
            "2022-08-23 00:00",
            0.0346,
            34692091.79564028,
        ]
    },
    {
        "value": [
            "2022-08-23 01:00",
            0.0348,
            34822944.504281774
        ]
    },
    {
        "value": [
            "2022-08-23 02:00",
            0.0345,
            34582433.6890437
        ]
    },
    {
        "value": [
            "2022-08-23 03:00",
            0.0342,
            34294540.69750997
        ]
    },
    {
        "value": [
            "2022-08-23 04:00",
            0.0343,
            34389850.12494004
        ]
    },
    {
        "value": [
            "2022-08-23 05:00",
            0.0347,
            34734139.65717202
        ]
    },
    {
        "value": [
            "2022-08-23 06:00",
            0.0346,
            34606564.45212001
        ]
    },
    {
        "value": [
            "2022-08-23 07:00",
            0.0345,
            34578802.03311309
        ]
    },
    {
        "value": [
            "2022-08-23 08:00",
            0.0348,
            34815026.41292196
        ]
    },
    {
        "value": [
            "2022-08-23 09:00",
            0.0348,
            34839047.821307085
        ]
    },
    {
        "value": [
            "2022-08-23 10:00",
            0.0347,
            34798006.389450416
        ]
    },
    {
        "value": [
            "2022-08-23 11:00",
            0.0348,
            34845872.98094326
        ]
    },
    {
        "value": [
            "2022-08-23 12:00",
            0.0348,
            34810714.34901686
        ]
    },
    {
        "value": [
            "2022-08-23 13:00",
            0.0346,
            34634169.507754266
        ]
    },
    {
        "value": [
            "2022-08-23 14:00",
            0.0340,
            34027035.430603504
        ]
    },
    {
        "value": [
            "2022-08-23 15:00",
            0.0341,
            34104173.57046509
        ]
    },
    {
        "value": [
            "2022-08-23 16:00",
            0.0346,
            34664460.978460506
        ]
    },
    {
        "value": [
            "2022-08-23 17:00",
            0.0350,
            35041936.06123904
        ]
    },
    {
        "value": [
            "2022-08-23 18:00",
            0.0351,
            35178039.87873727
        ]
    },
    {
        "value": [
            "2022-08-23 19:00",
            0.0349,
            34937538.98856331
        ]
    },
    {
        "value": [
            "2022-08-23 20:00",
            0.0348,
            34877001.30121278
        ]
    },
    {
        "value": [
            "2022-08-23 21:00",
            0.0348,
            34885953.24964613
        ]
    },
    {
        "value": [
            "2022-08-23 22:00",
            0.0350,
            35066001.127835125
        ]
    },
    {
        "value": [
            "2022-08-23 23:00",
            0.0353,
            35393615.59372673
        ]
    }
]
                    }
                  ]
                };
            
                
                this.myChart.setOption(option);
                // this.myChart.setOption({
                //     series: [
                //         {
                //           data: this.priceData
                //         },
                //         {
                //           data: this.marketData
                //         }
                //     ]
                // });
                window.addEventListener("resize", function() {
                    this.myChart.resize()
                })
            }
            this.$on('hook:destroyed',()=>{
                window.removeEventListener("resize", function() {
                    this.myChart.resize();
                });
            })
            
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
        height: 480px;
        padding-top:16px;
    .total-charts{
        width: 58.5%;
    }
    .head-chips{
        padding:0 12px;
        padding-bottom: 8px;
    }
    .trend-head{
        display: flex;
        justify-content: space-between;
  }
  .v-chip-group .v-chip--active{
    color: #FFF;
}
.charts-faq .theme--dark.v-chip:not(.v-chip--active){
    background-color:transparent !important;
}
.theme--dark.v-chip:not(.v-chip--active){
    background-color:transparent !important;
}
.theme--light.v-chip:not(.v-chip--active){
    background: transparent;
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
        .title-detailed{
            font-size: 16px;
            color: #868E9E;
        }
        .title-detailed:hover{
            color: #6979F8;
            text-decoration:underline;
        }
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
    .theme--light.folder-number{
        color:#000;

    }
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
        height: auto;
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
