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
            <v-row class="head-chips">
                <v-subheader class="sub-title"><h3>Trends</h3></v-subheader>
                <v-row align="center" style="margin-right:20px;justify-content: flex-end;">
                    <v-chip-group active-class="chip_group" v-model="model">
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
            <div class="trends-head">
                <v-tabs v-model="tab" 
                    background-color="background"
                    hide-slider 
                    class="trend-tab"
                    >
                    <v-radio-group
                        v-model="radios"
                        mandatory
                        row
                        dense
                        style="margin-top:0;"
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
                                label="Total Voting Stake"
                                value="2"
                                >
                            </v-radio>
                        </v-tab>
                        <v-tab key="3">
                            <v-radio
                                label="Total Gas Stake"
                                value="3"
                                >
                            </v-radio>
                        </v-tab>
                        <v-tab key="4">
                            <v-radio
                                label="Amount Of Gas Saved For Users"
                                value="4"
                                >
                            </v-radio>
                        </v-tab>
                    </v-radio-group>
                </v-tabs>
                </div>
                <v-tabs-items v-model="tab">
                    <v-tab-item key="1">
                        <div ref="chart"  style="height:400px"></div>
                    </v-tab-item>
                    <v-tab-item key="2">
                        <div ref="chart2"  style="height:400px"></div>
                    </v-tab-item>
                    <v-tab-item key="3">
                        <div ref="chart3"  style="height:400px"></div>
                    </v-tab-item>
                    <v-tab-item key="4">
                        <div ref="chart4"  style="height:400px"></div>
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
import { mapActions, mapGetters } from 'vuex';
import { client } from '../service/ApolloClient'
import { gql } from '@apollo/client/core'
import dayjs from 'dayjs';
import web3 from 'web3';
import util from '../utils/util';


const totalStakes = gql`
  query totalStakes{
   totalStakes(first:25,orderBy:id,orderDirection:desc) {
        id
        blockNumber
        timestamp
        feeStake
        voteStake
    }
  }
`
const ONE_DAY_UNIX = 24 * 60 * 60
const ONE_HOUR_UNIX = 60 * 60

export default {
  data() {
    return {
       radios: null,
       tab: 0,
       resTotalData:[],
       resVotingData:[],
       resFeeStakeData:[],
       resFeeUsageData:[],
       resFeeUsageSumData:[],
       myChart: {},
       myChart2: {},
       myChart3: {},
       myChart4: {},
       tags:['24H','7D'],
       model:0,
    };
  },
  computed: {
    ...mapGetters({
      totalStakes: 'totalStakes'
    })
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
      this.getdata();
      this.getGasSaveData();
      setTimeout(() => {
        this.trendsCharts(); 
      }, 500);
  },
  methods: {
    ...mapActions({
      setTotalStakes: 'setTotalStakes',
    }),
    async getdata(){
        let data = [];
        let dataVoting = [];
        let dataFeeStake = [];

        //let charts = []
        const {data:charData} = await client.query({
            query: totalStakes,
            variables: {
            },
            fetchPolicy: 'cache-first',
        })
        this.setTotalStakes({totalStakes:charData})
        let _data = data.concat(charData.totalStakes).reverse();
        _data.shift();
        
       this.resTotalData = _data.map((item)=>{
            return {
                    "value": [
                        dayjs.unix(item.timestamp).format('YYYY-MM-DD HH:00'),
                        web3.utils.fromWei(web3.utils.toBN(item.voteStake).add(web3.utils.toBN(item.feeStake)))
                    ]
                }
        })
    
        let _dataVoting = dataVoting.concat(charData.totalStakes).reverse();
        this.resVotingData = _dataVoting.map(function(item,i){
            return {
                "value": [
                    dayjs.unix(item.timestamp).format('YYYY-MM-DD HH:00'),
                    web3.utils.fromWei(web3.utils.toBN(item.voteStake).sub(web3.utils.toBN(_dataVoting[i>0?i-1:0].voteStake)))
                ]
                }
            }).slice(1)

        let _dataFeeStake = dataFeeStake.concat(charData.totalStakes).reverse();
        this.resFeeStakeData = _dataFeeStake.map(function(item,i){
            return {
                "value": [
                    dayjs.unix(item.timestamp).format('YYYY-MM-DD HH:00'),
                    web3.utils.fromWei(web3.utils.toBN(item.feeStake).sub(web3.utils.toBN(_dataFeeStake[i>0?i-1:0].feeStake)))
                ]
                }
            }).slice(1)

        
    },
    async getGasSaveData(){
        this.resFeeUsageData = [];
        this.resFeeUsageSumData = [];
        const endTimestamp = dayjs().unix()
        const startTimestamp = endTimestamp-ONE_DAY_UNIX
        const gasSaves = gql`
          query gasSaves {
            gasSaves(
                first: 24
                orderBy: id
                orderDirection: desc
                where: { timestamp_gt: ${startTimestamp}, timestamp_lt: ${endTimestamp} }
              ) {
                id
                timestamp
                feeUsage
                feeUsageSum
              }
            }
        `
        const {data:charData} = await client.query({
            query: gasSaves,
            variables: {
            },
            fetchPolicy: 'cache-first',
        })
        if(!charData.gasSaves.length){
            const gasSavesfirst = gql`
              query gasSavesfirst {
                 gasSaves(first: 1, orderBy: id, orderDirection: desc) {
                    id
                    timestamp
                    feeUsage
                    feeUsageSum
                }
              }
            `
            const {data:charDataLatest} = await client.query({
                query: gasSavesfirst,
                variables: {
                },
                fetchPolicy: 'cache-first',
            })
            let dataGasSave = charDataLatest.gasSaves;
            for(let i = 0; i< 24; i++){
                this.resFeeUsageData.push({
                     "value": [
                        dayjs.unix(startTimestamp*1+ONE_HOUR_UNIX*(i+1)).format('YYYY-MM-DD HH:00'),
                        web3.utils.fromWei(web3.utils.toBN(dataGasSave[0].feeUsage))
                    ]
                })
                this.resFeeUsageSumData.push({
                     "value": [
                        dayjs.unix(startTimestamp*1+ONE_HOUR_UNIX*(i+1)).format('YYYY-MM-DD HH:00'),
                        web3.utils.fromWei(web3.utils.toBN(dataGasSave[0].feeUsageSum))
                    ]
                })
            }
        } else {
            
            let totalSaved = [], oneDayBefore = dayjs().subtract(1, 'day').startOf('hour');
            let _totalSaved = totalSaved.concat(charData.gasSaves).reverse();
            let firstData = dayjs.unix(_totalSaved[0].timestamp).startOf('hour');
            let beforeDayFirstData = '';
            if(!dayjs(oneDayBefore).isSame(dayjs(firstData))){
                
                const gasSavesBeforefirst = gql`
                    query gasSavesBeforefirst {
                        gasSaves(first: 1
                            orderBy: id
                            orderDirection: desc
                            where: { timestamp_lt: ${oneDayBefore.unix()} }) {
                            id
                            timestamp
                            feeUsage
                            feeUsageSum
                        }
                    }
                `
                const {data:charDataBeforeFirst} = await client.query({
                    query: gasSavesBeforefirst,
                    variables: {
                    },
                    fetchPolicy: 'cache-first',
                })
                 beforeDayFirstData = charDataBeforeFirst.gasSaves[0];
            }
           
            let _totalSavedMap = {}
            for(let i = 0; i < _totalSaved.length; i++){
                let index = dayjs.unix(_totalSaved[i].timestamp).format('YYYY-MM-DD HH:00');
                _totalSavedMap[index] = _totalSaved[i];
            }
            
            for(let i = 1; i < 25; i++){
                let totalGasSave = '';
                let dayMill = dayjs(oneDayBefore).add(i, 'hour').startOf('hour');
                let dayIndex = dayMill.format('YYYY-MM-DD HH:00');
                if(_totalSavedMap[dayIndex]){
                    beforeDayFirstData = _totalSavedMap[dayIndex];
                    totalGasSave = _totalSavedMap[dayIndex];
                } else {
                    totalGasSave = {
                        feeUsage: 0,
                        feeUsageSum:beforeDayFirstData.feeUsageSum,
                        id: dayMill.unix(),
                        timestamp:dayMill.unix()
                    }
                }
                this.resFeeUsageData.push({
                     "value": [
                        dayjs.unix(totalGasSave.timestamp).format('YYYY-MM-DD HH:00'),
                        web3.utils.fromWei(web3.utils.toBN(totalGasSave.feeUsage))
                    ]
                })
                this.resFeeUsageSumData.push({
                     "value": [
                        dayjs.unix(totalGasSave.timestamp).format('YYYY-MM-DD HH:00'),
                        web3.utils.fromWei(web3.utils.toBN(totalGasSave.feeUsageSum))
                    ]
                })
            }
        }
        

    },
    assetFormat(value,precision) {
        return util.asset(value,precision)
    },
    trendsCharts(){
        // console.log(this.tab)
        if(this.tab === 0){
            const chart = this.$refs.chart;
            if(chart){
                this.myChart = this.$echarts.init(chart)
                var option = {
                    tooltip:{
                        trigger:'axis'
                    },
                    legend: {
                        name:"",
                        selectedMode: false,
                        top: 'bottom',
                        itemWidth: 16,
                        itemHeight: 16,
                        textStyle: {
                            fontSize: 16,
                            color:'#868e9e'
                        },
                    },
                    xAxis:       
                        {
                            type: 'time',
                            axisLine: {
                                lineStyle: {
                                    type: 'solid',
                                    color: '#868e9e', //坐标线的颜色
                                    width: '1' //坐标线的宽度
                                }
                            },
                        },
                    yAxis: 
                        {
                            type: 'value',
                            axisLine: {
                                lineStyle: {
                                    type: 'solid',
                                    color: '#868e9e', //坐标线的颜色
                                    width: '1' //坐标线的宽度
                                }
                            },
                        },
            
                    series: [
                        {       
                            name: 'Total Stake',
                            type: 'line',
                            data: [
                            ],
                        },
                    ]
                };
                this.myChart.setOption(option)
                this.myChart.setOption({
                    series: [
                        {
                            data: this.resTotalData
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
        }else if(this.tab === 1){
            const chart2 = this.$refs.chart2;
            if(chart2){
                this.myChart2 = this.$echarts.init(chart2)
                var option2 = {
                    tooltip:{
                        trigger:'axis'
                    },
                    toolbox: {
                        feature: {
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    legend: {
                        selectedMode: false,
                        top: 'bottom',
                        itemWidth: 16,
                        itemHeight: 16,
                        textStyle: {
                            fontSize: 16,
                            color:'#868e9e'
                        },
                    },
                    xAxis:{
                        type: 'time',
                        axisLine: {
                                lineStyle: {
                                    type: 'solid',
                                    color: '#868e9e', //坐标线的颜色
                                    width: '1' //坐标线的宽度
                                }
                            },
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                                lineStyle: {
                                    type: 'solid',
                                    color: '#868e9e', //坐标线的颜色
                                    width: '1' //坐标线的宽度
                                }
                            },
                    },
                    series: [
                        {       
                            name: 'Total Voting Stake',
                            type: 'bar',
                            data: [
                            ],
                            barWidth:'18',
                            barGap: '40%',
                            itemStyle:{
                                color:'#2F86F6'
                            }
                        },
                    ]
                };
                this.myChart2.setOption(option2)
                this.myChart2.setOption({
                    series: [
                    {
                        data: this.resVotingData
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
        }else if(this.tab === 2){
            const chart3 = this.$refs.chart3;
            if(chart3){
                this.myChart3 = this.$echarts.init(chart3)
                var option3 = {
                    tooltip:{
                        trigger:'axis'
                    },
                    toolbox: {
                        feature: {
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    legend: {
                        selectedMode: false,
                        top: 'bottom',
                        itemWidth: 16,
                        itemHeight: 16,
                        textStyle: {
                            fontSize: 16,
                            color:'#868e9e'
                        },
                    },
                    xAxis:{
                        type: 'time',
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#868e9e', //坐标线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#868e9e', //坐标线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                    },
                    series: [
                        {
                            name: 'Total Gas Stake',
                            type: 'line',
                            data: [
                            
                            ],
                            barWidth:'6',
                            itemStyle:{
                                color:'#EC733C'
                            }
                        }
                    ]
                };
                this.myChart3.setOption(option3)
                this.myChart3.setOption({
                    series: [
                    {
                        data: this.resFeeStakeData
                    }
                    ]
                });
                window.addEventListener("resize", function() {
                    this.myChart3.resize()
                })
            }
            this.$on('hook:destroyed',()=>{
                window.removeEventListener("resize", function() {
                    this.myChart3.resize();
                });
            })
        }else{
            const chart4 = this.$refs.chart4;
            if(chart4){
                this.myChart4 = this.$echarts.init(chart4)
                var option4 = {
                    tooltip:{
                        trigger:'axis'
                    },
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
                            color:'#868e9e'
                        },
                    },
                    xAxis:{
                        type: 'time',
                        //data: ['Oct/18', 'Oct/19', 'Oct/20', 'Oct/21', 'Oct/22', 'Oct/23', 'Oct/24','Oct/25','Oct/26','Oct/27','Oct/28','Oct/29','Oct/30','Oct/31','Nov/1'],
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#868e9e', //坐标线的颜色
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
                            color: '#868e9e', //左边线的颜色
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
                            data: [],
                            barWidth:'18',
                            barGap: '40%',
                            itemStyle:{
                                color:'#28AA91'
                            }
                        },
                        {
                            name: 'Total Savings On Gas For User',
                            type: 'line',
                            data: [],
                            barWidth:'12',
                            itemStyle:{
                                color:'#EC733C'
                            }
                        }
                    ]
                };
                this.myChart4.setOption(option4)
                this.myChart4.setOption({
                    series: [
                        {
                            data: this.resFeeUsageData
                        },
                        {
                            data: this.resFeeUsageSumData
                        }
                    ]
                });
                window.addEventListener("resize", function() {
                    this.myChart4.resize()
                })
            }
            this.$on('hook:destroyed',()=>{
                window.removeEventListener("resize", function() {
                    this.myChart4.resize();
                });
            })
        }   
    },      
  }
};
</script>

<style scoped lang="scss">
.trends-radio{
    label{
        font-size: 12px;
    }
}
.head-chips{
    padding-left: 12px;
    .v-application .align-center{
        display: flex;
        justify-content: flex-end;
    }
}
.v-chip-group .v-chip--active{
    color: #FFF;
}
.theme--dark.v-chip[data-v-ec4e21ac]:not(.v-chip--active){
    background: #1D1A36;
}
.theme--light.v-chip:not(.v-chip--active){
    background: transparent;
}
.theme--light.sub-title{
    color: #000;
}
.trend-head{
  display: flex;
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
   .trends-head{
        // display: inline !important;
   }
   .v-tab{
       padding: 0 !important;
   }
}
</style>
