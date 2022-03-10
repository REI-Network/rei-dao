<template>
  <v-container class="stake_background">
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <v-row>
      <v-col class="charts-faq"> 
        <div class="total-charts">
          <v-card
            class="mx-auto card-charts"
            rounded="4"
            color="background"
            style="margin-top:12px;"
          >
          <v-row class="head-chips">
                <v-subheader class="sub-title"><h3>Trends</h3></v-subheader>
                <v-row align="center" style="margin-right:20px;justify-content: flex-end;">
                    <v-chip-group active-class="chip_group" v-model="intervalModel" mandatory>
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
            </v-row>
          <!-- <v-subheader class="sub-title"><h3>Charts</h3></v-subheader>
            <div class="chart-title">
            <v-radio-group v-model="radios">
              <v-radio
                label="Total Voting Stake"
                value="Total Voting Stake"
                class="v-radio"
                color="radio_day"
              ></v-radio>
            </v-radio-group>
            <v-btn
              text
              outlined
              color="radio_day"
              class="v-btn-total"
            >
              7D
            </v-btn>
          </div> -->
          <div id="myCharts" ref="echart" style="height:348px"></div>
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
        <div class="faq-get">
          <v-card
            class="card-charts"     
            rounded="4"
            color="background"
          >
            <v-subheader class="sub-title"><h3>FAQ</h3></v-subheader>
            <v-list class="background" style="padding-top:0">
              <v-list-item-group>
                <v-list-item 
                  class="item-list" 
                  v-for="(item, i) in faqList"
                  :key="i">
                  <a :href='item.url' target="_blank">
                    <v-card class="ma-4 list-card" outlined color="faq_border">
                    <v-list-item-content class=“text-truncate”>
                      <v-list-item-title v-text="item.title"></v-list-item-title>
                      <v-list-item-subtitle v-text="item.content">   
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon
                        color="right_icon"
                        style="margin-left:20px"
                        size="22"
                      >
                         mdi-arrow-right-circle-outline
                      </v-icon>
                    </v-list-item-action>
                  </v-card>
                 </a>
                </v-list-item>           
              </v-list-item-group>    
            </v-list>
          </v-card>
        </div>
      </v-col>
    </v-row>   
    </v-container>
</template>
<script>
/* eslint-disable no-undef */
import Web3 from 'web3';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { mapGetters } from 'vuex';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core'

// const ONE_DAY_UNIX = 24 * 60 * 60
// const ONE_HOUR_UNIX = 60 * 60
export default {
  data() {
    return {
        radios:'Total Voting Stake',
        tags:['7D'],
        faqList:[
          {
            title:'How to become a node validator?',
            content:'A validator is a participant in the network who runs validator nodes to run and secure the network.',
            url:'https://docs.rei.network/guides/become-a-validator'
          },
          {
            title:'How to vote for a node validator?',
            content:'Once you login you will find this on the Validator of the Staking Dashboard. Here you will see an Unstake button for each of the validators.',
            url:'https://docs.rei.network/guides/voting-for-a-validator'
          },
          {
            title:'Introduction to the total voting stake chart？',
            content:'he graph of total voting stake shows nodal voting data for the following time periods: hourly, daily, weekly, monthly.',
            url:''
          }
        ],
        myChart: null,
        resTotalData: [],
        intervalModel: ''
    };
  },
  watch: {
    '$store.state.connection': function() {
        if(this.connection&&this.connection.network){
            this.getStakeList()
        }
    },
  },
  mounted() {
    this.connect();
    this.getStakeList();
    this.myCharts()
  },
  destroyed() {
    
  },
  methods: {
    connect() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
    },
    async getStakeList() {

        let url = this.apiUrl.graph;
        let client = new ApolloClient({
            uri: `${url}chainmonitor`,
            cache: new InMemoryCache(),
        })
        let blockNumber = await web3.eth.getBlockNumber();
        let arr = [];
        let now = Date.now();
        let day = dayjs().startOf('day');
        let blockDiff = Math.ceil((now-day+3600000*1)/3000);
        let startblock = blockNumber-blockDiff;
        for(let i = 0; i < 7; i++){
            arr.push(startblock-28800*i)
        }
        const totalStakesQl = gql`
         query totalStakes{
            totalStakes(first:168,orderBy:id,orderDirection:desc) {
                    id
                    blockNumber
                    timestamp
                    feeStake
                    voteStake
                }
            }
        `
        this.myChart.showLoading();
        const {data:{totalStakes}} = await client.query({
            query: totalStakesQl,
            variables: {
            },
            fetchPolicy: 'cache-first',
        })

        let hour = dayjs().hour();
        
        let todayStart = dayjs().startOf('day');

        if(totalStakes.length>0){
            let totalStakeDay = [totalStakes[0]];
            let startIndex = dayjs.unix(totalStakes[hour].timestamp).isBefore(todayStart) ? hour: hour*1+1;
            
            let i = startIndex;
            while(i<totalStakes.length){
                totalStakeDay.push(totalStakes[i]);
                i+=24;
            }
            let _totalStakeDay = totalStakeDay.reverse();

            this.resTotalData = _totalStakeDay.map((item,i)=>{
                return {
                    "value": [
                        dayjs.unix(item.timestamp).format('YYYY-MM-DD HH:00'),
                        web3.utils.fromWei(web3.utils.toBN(item.voteStake).sub(web3.utils.toBN(_totalStakeDay[i>0?i-1:0].voteStake)))
                    ]
                }
            }).slice(1)
        }
         this.myChart.hideLoading();
        if(this.resTotalData.length>0){
            this.myChart.setOption({
                title:{
                    text:''
                },
                series: [
                    {
                        data: this.resTotalData
                    }
                ]
            })
        } else {
            this.myChart.setOption({
                title: {
                    show: true,
                    textStyle:{
                        color:'#bcbcbc'
                    },
                    text: 'No Data',
                    left: 'center',
                    top: 'center'
                }
            });
        }
        
    },
    myCharts(){
        const echart = this.$refs.echart;
        if(echart){
          this.myChart = this.$echarts.init(echart);
          var option = {
            tooltip:{
              trigger:'axis',
              formatter(params) {
                var relVal = params[0].name;
                  for (var i = 0, l = params.length; i < l; i++) {
                    var yValue = Number(params[i].value[1]).toFixed(5)
                    relVal +=params[i].marker + params[i].seriesName +':'+yValue;
                  }
                  return relVal;
            },
            },
            xAxis: {
              type: 'time',
              //data: ['Oct/18', 'Oct/19', 'Oct/20', 'Oct/21', 'Oct/22', 'Oct/23', 'Oct/24', 'Oct/25', 'Oct/26', 'Oct/27', 'Oct/28'],
              //刻度线
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#868e9e', //坐标线的颜色
                  width: '1' //坐标线的宽度
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
                lineStyle: {
                  type: 'solid',
                  color: '#868e9e', //左边线的颜色
                  width: '1' //坐标线的宽度
                },
              },
              splitLine: {
                  show: false,
                  // lineStyle: {
                  //   color: 'rgba(104, 180, 221, 0.1)',
                  //   type: 'dashed',
                  // }
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
                name:'Total Voting Stake',
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
          this.myChart.setOption({
                    series: [
                        {
                            data: this.resTotalData
                        }
                    ]
                })
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
  },
  computed: {
   ...mapGetters({
      apiUrl: 'apiUrl',
      connection:'connection',
      dark: 'dark'
    }),
  },
};
</script>

<style scoped lang="scss">
.charts-faq{
    display: flex;
    justify-content: space-between;
    margin-top:40px;
    margin-bottom:28px;
    padding: 0;
    .head-chips{
    padding-left: 12px;
    padding-bottom: 8px;
    .v-application .align-center{
        display: flex;
        justify-content: flex-end;
    }
}
    .total-charts{
      width: 58.5%;
    }
    .faq-get{
      width:38%;
    }
    .chart-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .v-radio{
        margin-left: 20px;
      }
    .v-btn-total{
      width: 28px;
      height: 24px;
      font-size: 12px;
      border-radius: 15px;
      margin-right:20px;
    }
  }
  .v-input--selection-controls{
    margin-top: 0;
    padding: 0;
  }
  .v-chip-group .v-chip--active{
    color:#FFF;
  }
  .card-charts{
    height: 420px;
  }
  .list-card{
    padding:0 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent !important;
  }
}
.v-list-item__subtitle[data-v-271c5252]{
    overflow: hidden !important;
    text-overflow:ellipsis !important;
    display:-webkit-box;
    -webkit-box-orient:vertical;  
    -webkit-line-clamp:2;  
}
.update-time{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    font-size: 12px;
    margin-right: 20px;
}
 .item-list{
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   border-radius: 6px;
 } 
 .v-list-item__title, .v-list-item__subtitle{
  overflow: visible !important;
  white-space: normal !important;
}
@media screen and (max-width: 900px) {
    .charts-faq{
    display: flex;
    flex-direction: column;
    padding: 0;
    margin-top: 20px;
    margin-bottom: 40px;
    .total-charts{
      width: 100%;
    }
    .faq-get{
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>
