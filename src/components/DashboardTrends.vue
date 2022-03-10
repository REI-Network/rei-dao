<template>
  <v-container class="stake_background" >
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->   
    <v-row>
      <v-col style="padding:0;">
        <v-card
            class="mx-auto"
            color="background"
            style="padding-bottom:20px"
            rounded="4"
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
                        <v-tab key="3" v-if="showMenu">
                            <v-radio
                                label="Total Gas Stake"
                                value="3"
                                >
                            </v-radio>
                        </v-tab>
                        <v-tab key="4" v-if="showMenu">
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
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core'
import dayjs from 'dayjs';
import web3 from 'web3';
import util from '../utils/util';


const totalStakes = gql`
  query totalStakes{
   totalStakes(first:192,orderBy:id,orderDirection:desc) {
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

let client = null;

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
       resTotalDataSeven:[],
       resVotingDataSeven:[],
       resFeeStakeDataSeven:[],
       resFeeUsageDataSeven:[],
       resFeeUsageSumDataSeven:[],
       myChart: {},
       myChart2: {},
       myChart3: {},
       myChart4: {},
       tags:['24H','7D'],
       intervalModel:0,
    };
  },
  computed: {
    ...mapGetters({
      totalStakes: 'totalStakes',
      connection: 'connection',
      apiUrl: 'apiUrl'
    }),
    showMenu:function(){
        if(this.connection.network == 'REI Testnet'||this.connection.network == 'REI Devnet'){
           return true;
        }
        return false
    }
  },
  watch: {
       tab:{
           handler(newValue){
               this.tab = newValue;
               setTimeout(() => {
                    this.trendsCharts(); 
                }, 200);
            }
        },
        intervalModel:{
            handler(val){
                this.changeInterval(val);
            }
        },
        '$store.state.connection': function() {
            if(this.connection && this.connection.network){
                this.getdata();
                if(this.connection.network == 'REI Testnet'||this.connection.network == 'REI Devnet'){
                    this.getGasSaveData();
                    this.getGasSaveDataSeven();
                }
            }
        },
    },
  mounted() {
      setTimeout(() => {
            this.trendsCharts(); 
            this.getdata();
            if(this.connection.network == 'REI Testnet'||this.connection.network == 'REI Devnet'){
                this.getGasSaveData();
                this.getGasSaveDataSeven();
            }
        }, 200);
  },
  methods: {
    ...mapActions({
      setTotalStakes: 'setTotalStakes',
    }),
    async getdata(){
        let url = this.apiUrl.graph;
        client = new ApolloClient({
            uri: `${url}chainmonitor`,
            cache: new InMemoryCache(),
        })
        let data7d = [];
        let data24h = [];
        let data = [];
        let dataVoting = [];
        let dataFeeStake = [];

        //let charts = []
        this.myChart.showLoading();
        const {data:charData} = await client.query({
            query: totalStakes,
            variables: {
            },
            fetchPolicy: 'cache-first',
        })
        this.setTotalStakes({totalStakes:charData})
        data24h = data24h.concat(charData.totalStakes).splice(0,25);
        data7d = data7d.concat(charData.totalStakes).splice(0);

        let _totalDataMap = {}
        for(let i = 0; i < data7d.length; i++){
            let index = dayjs.unix(data7d[i].timestamp).format('YYYY-MM-DD HH:00');
            _totalDataMap[index] = data7d[i];
        }

        let eightDayBefore = dayjs().subtract(8, 'day').endOf('day');
        let totalDataSeven = [];
        if(data7d.length>0){
            for(let i = 0; i < 8; i++){
                let dayMill = dayjs(eightDayBefore).add(i, 'day').endOf('day');
                let dayIndex = dayMill.format('YYYY-MM-DD HH:00');
                
                if(_totalDataMap[dayIndex]){
                    totalDataSeven.push(_totalDataMap[dayIndex]);
                } else {
                    totalDataSeven.push(data7d[data7d.length-1]);
                }
            }
        }

        let _data = data.concat(data24h).reverse();
        _data.shift();
        if(_data.length>0){
            this.resTotalData = _data.map((item)=>{
                let total = 0;
                if(item.feeStake){
                    total = web3.utils.fromWei(web3.utils.toBN(item.voteStake).add(web3.utils.toBN(item.feeStake)))
                } else {
                    total = web3.utils.fromWei(web3.utils.toBN(item.voteStake));
                }
                return {
                    "value": [
                        dayjs.unix(item.timestamp).format('YYYY-MM-DD HH:00'),
                        total
                    ]
                }
            })
        }

        let dataSeven = [];
        let dataVotingSeven = [];
        let dataFeeStakeSeven = [];
        let _dataSeven = dataSeven.concat(totalDataSeven);
        _dataSeven.shift();
        
        if(_dataSeven.length>0){
            this.resTotalDataSeven = _dataSeven.map((item)=>{
                let total = 0;
                if(item.feeStake){
                    total = web3.utils.fromWei(web3.utils.toBN(item.voteStake).add(web3.utils.toBN(item.feeStake)))
                } else {
                    total = web3.utils.fromWei(web3.utils.toBN(item.voteStake));
                }
                return {
                    "value": [
                        dayjs.unix(item.timestamp).format('YYYY-MM-DD HH:00'),
                        total
                    ]
                }
            })
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
            });
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
        
        let _dataVoting = dataVoting.concat(data24h).reverse();
        if(_dataVoting.length>0){
            this.resVotingData = _dataVoting.map(function(item,i){
                return {
                    "value": [
                        dayjs.unix(item.timestamp).format('YYYY-MM-DD HH:00'),
                        web3.utils.fromWei(web3.utils.toBN(item.voteStake).sub(web3.utils.toBN(_dataVoting[i>0?i-1:0].voteStake)))
                    ]
                    }
                }).slice(1)
        }
        let _dataVotingSeven = dataVotingSeven.concat(totalDataSeven);
        this.resVotingDataSeven = _dataVotingSeven.map(function(item,i){
            return {
                "value": [
                    dayjs.unix(item.timestamp).format('YYYY-MM-DD HH:00'),
                    web3.utils.fromWei(web3.utils.toBN(item.voteStake).sub(web3.utils.toBN(_dataVotingSeven[i>0?i-1:0].voteStake)))
                ]
                }
            }).slice(1)


        let _dataFeeStake = dataFeeStake.concat(data24h).reverse();
        this.resFeeStakeData = _dataFeeStake.map(function(item,i){
            return {
                "value": [
                    dayjs.unix(item.timestamp).format('YYYY-MM-DD HH:00'),
                    web3.utils.fromWei(web3.utils.toBN(item.feeStake).sub(web3.utils.toBN(_dataFeeStake[i>0?i-1:0].feeStake)))
                ]
                }
            }).slice(1)
        
        let _dataFeeStakeSeven = dataFeeStakeSeven.concat(totalDataSeven);
        this.resFeeStakeDataSeven = _dataFeeStakeSeven.map(function(item,i){
            return {
                "value": [
                    dayjs.unix(item.timestamp).format('YYYY-MM-DD HH:00'),
                    web3.utils.fromWei(web3.utils.toBN(item.feeStake).sub(web3.utils.toBN(_dataFeeStakeSeven[i>0?i-1:0].feeStake)))
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
            if(dataGasSave.length>0){
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
    async getGasSaveDataSeven(){
        this.resFeeUsageData = [];
        this.resFeeUsageSumData = [];
        const endTimestamp = dayjs().unix();
        const startTimestamp = endTimestamp-ONE_DAY_UNIX*7;
        const gasSaves = gql`
          query gasSaves {
            gasSaves(
                first: 168
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
            if(dataGasSave.length>0){
                for(let i = 0; i< 7; i++){
                    let dayTime = '';
                    if(i<6){
                        dayTime = dayjs.unix(startTimestamp).add(i, 'day').endOf('day').format('YYYY-MM-DD HH:00');
                    } else {
                        dayTime = dayjs.unix(endTimestamp).startOf('hour').format('YYYY-MM-DD HH:00');
                    }
                    this.resFeeUsageDataSeven.push({
                        "value": [
                            dayTime,
                            web3.utils.fromWei(web3.utils.toBN(dataGasSave[0].feeUsage))
                        ]
                    })
                    this.resFeeUsageSumDataSeven.push({
                        "value": [
                            dayTime,
                            web3.utils.fromWei(web3.utils.toBN(dataGasSave[0].feeUsageSum))
                        ]
                    })
                }
            }
        } else {
            let totalSaved = [], sevenDayBefore = dayjs().subtract(7, 'day').startOf('hour');
            let _totalSaved = totalSaved.concat(charData.gasSaves).reverse();
            let firstData = dayjs.unix(_totalSaved[0].timestamp).startOf('hour');
            let beforeDayFirstData = '';
            if(!dayjs(sevenDayBefore).isSame(dayjs(firstData))){
                
                const gasSavesBeforefirst = gql`
                    query gasSavesBeforefirst {
                        gasSaves(first: 1
                            orderBy: id
                            orderDirection: desc
                            where: { timestamp_lt: ${sevenDayBefore.unix()} }) {
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
                let index = dayjs.unix(_totalSaved[i].timestamp).format('YYYY-MM-DD');
                _totalSavedMap[index] = _totalSaved[i];
            }
            
            for(let i = 0; i < 7; i++){
                let totalGasSave = '';
                let dayMill = dayjs(sevenDayBefore).add(i, 'day').endOf('day');
                let dayIndex = dayMill.format('YYYY-MM-DD');
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
                this.resFeeUsageDataSeven.push({
                     "value": [
                        dayjs.unix(totalGasSave.timestamp).format('YYYY-MM-DD'),
                        web3.utils.fromWei(web3.utils.toBN(totalGasSave.feeUsage))
                    ]
                })
                this.resFeeUsageSumDataSeven.push({
                     "value": [
                        dayjs.unix(totalGasSave.timestamp).format('YYYY-MM-DD'),
                        web3.utils.fromWei(web3.utils.toBN(totalGasSave.feeUsageSum))
                    ]
                })
            }
        }
        

    },
    changeInterval(val){
        let dataTotal = null;
        let dataVoting = null;
        let dataGasStake = null;
        let dataGasSaved = null;
        let dataGasSavedSum = null;
        if(!val){
            dataTotal = this.resTotalData;
            dataVoting = this.resVotingData;
            dataGasStake = this.resFeeStakeData;
            dataGasSaved = this.resFeeUsageData;
            dataGasSavedSum = this.resFeeUsageSumData;
        } else {
            dataTotal = this.resTotalDataSeven;
            dataVoting = this.resVotingDataSeven;
            dataGasStake = this.resFeeStakeDataSeven;
            dataGasSaved = this.resFeeUsageDataSeven;
            dataGasSavedSum = this.resFeeUsageSumDataSeven;
        }
        let title = {
                show: true,
                textStyle:{
                    color:'#bcbcbc'
                },
                text: 'No Data',
                left: 'center',
                top: 'center'
            }
        if(this.tab === 0){
            let option1 = {
                series: [
                    {
                        data: dataTotal
                    }
                ]
            };
            if(dataTotal.length==0){
                option1.title = title;
            }
            this.myChart.setOption(option1);
        }
        if(this.tab === 1){
            let option2 = {
                series: [
                    {
                        data: dataVoting
                    }
                ]
            };
            if(dataVoting.length==0){
                option2.title = title;
            }
            this.myChart2.setOption(option2);
        }
        if(this.tab === 2){
            let option3 = {
                series: [
                    {
                        data: dataGasStake
                    }
                ]
            };
            if(dataGasStake.length==0){
                option3.title = title;
            }
            this.myChart3.setOption(option3);
        }
        if(this.tab === 3){
            let option4 = {
                series: [
                    {
                        data: dataGasSaved
                    },
                    {
                        data: dataGasSavedSum
                    }
                ]
            };
            if(dataGasSaved.length==0 && dataGasSavedSum.length==0){
                option4.title = title;
            }
            this.myChart4.setOption(option4);
        }
        
    },
    assetFormat(value,precision) {
        return util.asset(value,precision)
    },
    trendsCharts(){
        if(this.tab === 0){
            const chart = this.$refs.chart;
            if(chart){
                this.myChart = this.$echarts.init(chart)
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
                    legend: {
                        name:"",
                        selectedMode: false,
                        top: 'bottom',
                        itemWidth: 16,
                        itemHeight: 16,
                        textStyle: {
                            fontSize: 16,
                            color:'rgba(134,142,158,.6)'
                        },
                    },
                    xAxis:       
                        {
                            type: 'time',
                            axisLabel: {//x轴文字的配置
                                show: true,
                                textStyle: {
                                color: "rgba(134,142,158,.6)",
                              }
                            },
                            axisLine: {
                                lineStyle: {
                                    type: 'solid',
                                    color: 'rgba(134,142,158, 0.1)', //坐标线的颜色
                                    width: '1' //坐标线的宽度
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(134,142,158, 0.1)',
                                }
                            },
                        },
                    yAxis: 
                        {
                            type: 'value',
                            axisLabel: {//x轴文字的配置
                                show: true,
                                textStyle: {
                                color: "rgba(134,142,158,.6)",
                              }
                            },
                            axisLine: {
                                lineStyle: {
                                    type: 'solid',
                                    color: 'rgba(134,142,158, 0.1)', //坐标线的颜色
                                    width: '1' //坐标线的宽度
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(134,142,158, 0.1)',
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
                    this.myChart.setOption(option);
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
                    legend: {
                        selectedMode: false,
                        top: 'bottom',
                        itemWidth: 16,
                        itemHeight: 16,
                        textStyle: {
                            fontSize: 16,
                            color:'rgba(134,142,158,.6)'
                        },
                    },
                    xAxis:{
                        type: 'time',
                         axisLabel: {//x轴文字的配置
                                show: true,
                                textStyle: {
                                color: "rgba(134,142,158,.6)",
                              }
                            },
                        axisLine: {
                                lineStyle: {
                                    type: 'solid',
                                    color: 'rgba(134,142,158, 0.1)', //坐标线的颜色
                                    width: '1' //坐标线的宽度
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(134,142,158, 0.1)',
                                }
                            },
                    },
                    yAxis: {
                        type: 'value',
                         axisLabel: {//x轴文字的配置
                                show: true,
                                textStyle: {
                                color: "rgba(134,142,158,.6)",
                              }
                            },
                        axisLine: {
                                lineStyle: {
                                    type: 'solid',
                                    color: 'rgba(134,142,158, 0.1)', //坐标线的颜色
                                    width: '1' //坐标线的宽度
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(134,142,158, 0.1)',
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
                    legend: {
                        selectedMode: false,
                        top: 'bottom',
                        itemWidth: 16,
                        itemHeight: 16,
                        textStyle: {
                            fontSize: 16,
                            color:'rgba(134,142,158,.6)'
                        },
                    },
                    xAxis:{
                        type: 'time',
                        axisLabel: {//x轴文字的配置
                                show: true,
                                textStyle: {
                                color: "rgba(134,142,158,.6)",
                              }
                            },
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: 'rgba(134,142,158, 0.1)', //坐标线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                        splitLine: {
                                lineStyle: {
                                    color: 'rgba(134,142,158, 0.1)',
                                }
                            },
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {//x轴文字的配置
                                show: true,
                                textStyle: {
                                color: "rgba(134,142,158,.6)",
                              }
                            },
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: 'rgba(134,142,158, 0.1)', //坐标线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                        splitLine: {
                                lineStyle: {
                                    color: 'rgba(134,142,158, 0.1)',
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
                        trigger:'axis',
                        formatter(params) {
                            var relVal = params[0].name;
                            for (var i = 0, l = params.length; i < l; i++) {
                                var yValue = Number(params[i].value[1]).toFixed(5)
                                relVal +=params[i].marker + params[i].seriesName +':'+yValue+'<br/>';
                            }
                            return relVal;
                        },
                    },
                    legend: {
                        data: [ 'Savings On Gas For User', 'Total Stake'],
                        top: 'bottom',
                        itemWidth: 16,
                        itemHeight: 16,
                        textStyle: {
                            fontSize: 16,
                            color:'rgba(134,142,158,.6)'
                        },
                    },
                    xAxis:{
                        type: 'time',
                        //data: ['Oct/18', 'Oct/19', 'Oct/20', 'Oct/21', 'Oct/22', 'Oct/23', 'Oct/24','Oct/25','Oct/26','Oct/27','Oct/28','Oct/29','Oct/30','Oct/31','Nov/1'],
                        axisPointer: {
                            type: 'shadow'
                        },
                         axisLabel: {//x轴文字的配置
                                show: true,
                                textStyle: {
                                color: "rgba(134,142,158,.6)",
                              }
                            },
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: 'rgba(134,142,158, 0.1)', //坐标线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(134,142,158, 0.1)',
                            }
                        },
                    },
                    yAxis: {
                        type: 'value',
                         axisLabel: {//x轴文字的配置
                                show: true,
                                textStyle: {
                                color: "rgba(134,142,158,.6)",
                              }
                            },
                        axisLine: {
                            lineStyle: {
                                show: true,
                                type: 'solid',
                                color: 'rgba(134,142,158, 0.1)', //左边线的颜色
                                width: '1' //坐标线的宽度
                            },
                        },
                        splitLine: {
                            lineStyle: {
                            color: 'rgba(134,142,158, 0.1)'
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
        this.changeInterval(this.intervalModel);
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
.toolDiv{
    width:200px;
}
.head-chips{
    padding-left: 12px;
    padding-bottom: 8px;
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
   .theme--dark.v-tabs > .v-tabs-bar{
       background: #1D1A36;
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
