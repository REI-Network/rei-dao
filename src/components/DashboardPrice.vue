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
                                label="Price and Market Cap"
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
        tags:['30D'],
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
    this.myCharts(); 
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
        let chartData = await getAssetPrice(apiUrl,{day:30});
        
        this.chartData = chartData.data.data;
        let priceData = this.chartData.prices.map((item,index)=>{
            if(index < this.chartData.prices.length-1){
                return {
                    "value": [
                        dayjs(item[0]).format('YYYY-MM-DD'),
                        item[1]
                    ]
                }
            }
            
        })
        let marketData = this.chartData.market_caps.map((item,index)=>{
            if(index < this.chartData.market_caps.length-1){
                return {
                    "value": [
                        dayjs(item[0]).format('YYYY-MM-DD'),
                        item[1]/10**9,
                        item[1],
                        
                    ]
                }
            }
            
        })
        this.priceData = priceData;
        this.marketData = marketData;
        this.myChart.hideLoading();
        this.myChart.setOption({
            series: [
              {
                data: priceData
              },
              {
                data: marketData
              },
            ]
        });
        // console.log('folders',this.folders)
    },
    myCharts(){
            const chartPrice = this.$refs.chartPrice;
            if(chartPrice){
                this.myChart = this.$echarts.init(chartPrice);
                var option = {
                    tooltip:{
                        trigger:'axis',
                        formatter(params) {
                            var relVal = params[0].value[0]+'<br>';
                            for (var i = 0, l = params.length; i < l; i++) {
                                var yValue = Number(params[i].value[1]).toFixed(5);
                                if(params[i].seriesName == 'Market Cap'){
                                  yValue = util.numFormat(Number(params[i].value[2]).toFixed(0));
                                }
                                relVal +=params[i].marker + params[i].seriesName +':'+yValue+'<br>';
                            }
                            return relVal;
                        },
                    },
                    xAxis: {
                        type: 'time',
                        boundaryGap:false,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: "rgba(134,142,158,.6)",
                              }
                            },
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: 'rgba(134,142,158,.6)', 
                                width: '1' 
                            }
                        },
                        splitLine:{show: false}
                    },
                    yAxis:[
                      {
                          position: 'left',
                          type: 'value',
                          splitLine: {
                              show:false,
                          },
                          axisLabel: {
                            formatter: '${value}',
                            textStyle: {
                                color: "rgba(134,142,158,.6)",
                            },
                          },
                          axisLine: {
                            show:true,
                              lineStyle: {
                                  type: 'solid',
                                  color: 'rgba(134,142,158,.1)', 
                                  width: '1' 
                              }
                          },
                      },
                      {
                          position: 'right',
                          type: 'value',
                          axisLabel:{
                              formatter: '${value}'
                          },
                          axisLine: {
                              lineStyle: {
                                  type: 'solid',
                                  color: 'rgba(134,142,158, 0.1)', 
                                  width: '1' 
                              }
                          },
                      }
                    ], 
                    series: [
                        {
                            name:'Price',
                            data: [],
                            type: 'line',
                            symbol: "none",
                            itemStyle:{
                                color:'#2F86F6'
                            },
                            
                        },
                        {
                            name:'Market Cap',
                            data: [],
                            type: 'line',
                            symbol: "none",
                            itemStyle:{
                                color:'rgb(253,131,53)'
                            }
                        }
                    ],
                }
            
                
                this.myChart.setOption(option);
                this.myChart.setOption({
                    series: [
                        {
                          data: this.priceData
                        },
                        {
                          data: this.marketData
                        }
                    ]
                });
                window.addEventListener("resize", ()=> {
                    this.myChart.resize()
                })
            }
            this.$on('hook:destroyed',()=>{
                window.removeEventListener("resize", ()=> {
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
