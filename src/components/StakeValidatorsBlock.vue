<template>
  <v-container class="dashboard stake_background">
    <v-row>
      <v-col cols="12" sm="6" style="padding-left: 0;padding-bottom:0;">
        <v-card class="date-card">
          <h3>Validator Voting Power</h3>
          <div ref="validatorChart" style="height: 348px"></div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" style="padding-right: 0;padding-bottom:0;">
        <v-card class="date-card">
          <v-row align="center" justify="space-between">
            <h3 style="margin-left: 10px">Block Loss</h3>
            <v-chip-group active-class="chip_group" v-model="intervalModel" mandatory>
              <v-chip class="ma-3" x-small v-for="tag in tags" :key="tag">
                {{ tag }}
              </v-chip>
            </v-chip-group>
          </v-row>
              <div ref="blockChart" style="height: 348px"></div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { mapGetters } from 'vuex';
import util from '../utils/util'

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT;

const ONE_DAY_UNIX = 24 * 60 * 60;

let client = null;
export default {
  components: {},
  props:['msg'],
  data() {
    return {
      myChart: {},
      myChart2: {},
      tags: ['D', 'W'],
      intervalModel: 0,
      nodeList: [],
      stakeManagerContract: '',
      stakeManageInstance: '',
      nodeListRaw:[],
      activeList: [],
      notActiveList: [],
      indexedNodeList: [],
      isNode: false,
      detailsList: [],
      validatorRewardPoolContract: '',
      commissionRateInterval: 0,
      minIndexVotingPower: 0,
      unstakeDelay: 0,
      blockLossList:[],
    };
  },
  computed: {
    ...mapGetters({
      dark: 'dark',
      connection: 'connection',
      apiUrl: 'apiUrl'
    }),
  },
  watch :{
      intervalModel:{
            handler(val){
                this.changeInterval(val);
            }
        },
        msg:function(newMsg,oldMsg){
            this.nodeList = newMsg;
            this.myCharts();
            this.myCharts2();
            this.changeInterval()
        }
  },
  mounted() {
    this.myCharts();
    this.myCharts2();
    this.changeInterval();
  },
  methods: {
    changeInterval(val){
        if(this.msg.length == 0){
                this.myChart.showLoading();
                this.myChart2.showLoading();
            }else{
                this.myChart.hideLoading();
                this.myChart2.hideLoading();
            }
        let array = this.nodeList.map((item,index) => {
          return Object.assign({},{'name':item.nodeName,'address':item.address,'minerInfo':item.minerInfo})
       })
      let minerInfoList = []
      for (let i = 0; i < array.length; i++) {
          let item = array[i];
          if(item.minerInfo){
              let _obj = {
                  name:item.name,
                  address:item.address,
                  minerMissRecordNumberDay1:item.minerInfo.minerMissRecordNumberDay1,
                  minerMissRecordNumberDay7:item.minerInfo.minerMissRecordNumberDay7,
                  minerMintedBlockNumberDay1:item.minerInfo.minerMintedBlockNumberDay1,
                  minerMintedBlockNumberDay7:item.minerInfo.minerMintedBlockNumberDay7,
              }
              minerInfoList.push(_obj)
          }
      }
    //    console.log('minerInfo',minerInfoList)
      if(val == 1){
         this.blockLossList=[];
         minerInfoList.forEach((item)=>{
          if(item.minerMissRecordNumberDay7!=0){
            let obj = Object.assign({},{'name':item.name,'address':item.address,'value':item.minerMissRecordNumberDay7,'produced':item.minerMintedBlockNumberDay7})
            this.blockLossList.push(obj)
          }
         })
      }else{
        this.blockLossList=[];
        minerInfoList.forEach((item)=>{
          if(item.minerMissRecordNumberDay1!=0){
            let obj = Object.assign({},{'name':item.name,'address':item.address,'value':item.minerMissRecordNumberDay1,'produced':item.minerMintedBlockNumberDay1})
            this.blockLossList.push(obj)
          }
        })
      }
      this.myCharts2() 
    },
    myCharts() {
      const chart = this.$refs.validatorChart;
      let data = this.nodeList.map((item) => {
          return Object.assign({},{'value':item.votingPowerPercent,'power':item.power,'name':item.nodeName,'address':item.address})
      })
      if (chart) {
        this.myChart = this.$echarts.init(chart);
        var option = {
          baseOption: {
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                let votingPowerPercent = util.asset(params.data.value, 2);
                let power = util.asset(params.data.power,2)
                let name = '';
                if(params.data.name){
                    name = params.data.name;
                }else{
                    name = util.addr(params.data.address)
                }
                return name + ' <br/> ' + 'Voting Power Rate'+':'+ votingPowerPercent + '%' + '<br/>' + 'Voting Power'+ ':'+ power;
              }
            },
            query: {
              maxAspectRatio: 1 // 当长宽比小于1时。
            },
            color: ['#74d2e7', '#48a9c5', '#0085ad', '#8db9ca', '#4298b5', '#005670','#00205b','#009f4d', '#84bd00', '#efdf00', '#fe5000', '#e4002b', '#da1884','#a51890','#0077c8','#008eaa', '#caccd1', '#C0EEE4', '#F8F988', '#FFCAC8', '#FF9E9E'],
            series: [
              {
                name: '',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '42%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    // show: true,
                    fontSize: '24',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: data
              }
            ]
          },
          media: [
            {
              query: {
                maxWidth: 450
              },
              option: {
                graphic: {
                  type: 'text',
                  left: '36%',
                  top: '51%',
                  style: {
                    text: 'Validator Voting Power',
                    fill: '#868e9e',
                    textAlign: 'center',
                    fontSize: 12
                  }
                },
                legend: false,
                series: [
                  {
                    radius: ['24%', '40%'],
                    center: ['24%', '50%']
                  }
                ]
              }
            }
          ]
        };
        this.myChart.setOption(option);
        window.addEventListener('resize',()=> {
          this.myChart.resize();
        });
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize',() => {
          this.myChart.resize();
        });
      });
    },
    myCharts2() {
      const chart2 = this.$refs.blockChart;
      let data = this.blockLossList;
    //   console.log('blockLossList',data)
      if (chart2) {
        this.myChart2 = this.$echarts.init(chart2);
        var option2 = {
          tooltip: {
              trigger: 'item',
              formatter: function (params) {
                let produced = util.asset(params.data.produced,0);
                let value = params.data.value;
                let rate = params.data.value/(params.data.produced+params.data.value);
                let lossRate = util.asset(rate,4);
                let name = '';
                if(params.data.name){
                    name = params.data.name;
                }else{
                    name = util.addr(params.data.address)
                }
                return name + ' <br/> ' + 'Block Loss Rate'+':'+ lossRate + '%' + '<br/>' +
                 'Block Loss:'+value+'<br/>'+'Block Produced:' + produced;
              }
            },
          xAxis: {
            type: 'category',
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(134,142,158,.6)'
              }
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: 'rgba(134,142,158, 0.1)',
                width: '1'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(134,142,158, 0.1)'
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(134,142,158,.6)'
              }
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: 'rgba(134,142,158, 0.1)',
                width: '1'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(134,142,158, 0.1)'
              }
            }
          },
          color: ['#74d2e7', '#48a9c5', '#0085ad', '#8db9ca', '#4298b5', '#005670','#00205b','#009f4d', '#84bd00', '#efdf00', '#fe5000', '#e4002b', '#da1884','#a51890','#0077c8','#008eaa', '#caccd1', '#C0EEE4', '#F8F988', '#FFCAC8', '#FF9E9E'],
          series: [
            {
              name: 'REI',
              type: 'bar',
              data:data,
              // itemStyle:{
              //     color:function(params){
              //         let color = '';
              //         if(params.data.value <= 100){
              //             color = '#FFDDDD'
              //         }else if( params.data.value >100 && params.data.value<=200){
              //              color = '#FF9494'
              //         }else if( params.data.value >200 && params.data.value<=300){
              //              color = '#F85454'
              //         }else{
              //              color = '#B20909'
              //         }
              //         return color;
              //     }
              // },
              barMaxWidth: '40%',
              barWidth: '18',
              barMinWidth: '10%',
              barGap: '40%',
            }
          ]
        };
        this.myChart2.setOption(option2);
        window.addEventListener('resize', () => {
          this.myChart2.resize();
        });
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', () => {
          this.myChart2.resize();
        });
      });
    }
  }
};
</script>

<style scoped lang="scss">
.date-card {
  padding: 20px;
  margin-top: 28px;
}
.v-chip-group .v-chip--active {
  color: #fff;
}
.theme--dark.v-chip:not(.v-chip--active) {
  background: #1d1a36;
}
.theme--light.v-chip:not(.v-chip--active) {
  background: transparent;
}
.theme--light.sub-title {
  color: #000;
}
.theme--light.v-application .chip_group {
  background-color: rgb(105, 121, 248) !important;
  border-color: rgb(105, 121, 248) !important;
}
.theme--dark.v-chip:not(.v-chip--active) {
  background-color: transparent;
}
.theme--dark.v-tabs-items {
  background-color: transparent;
}
.title{
    font-size: 14px;
    color: rgba(134,142,158,.6);
    line-height: 18px;
    transform: rotate(90deg);
}
@media screen and (max-width: 900px) {
}
</style>
