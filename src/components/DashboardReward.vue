<template>
  <v-container class="stake_background">
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <v-row>
      <v-col style="padding: 0">
        <v-card class="mx-auto reward" color="background" rounded="4" style="width: 100%">
          <v-subheader class="sub-title"><h3>Block Rewards For Validator</h3></v-subheader>
          <div class="font-grey">Total block rewards for validator</div>
          <div class="node-number">{{ totalValue | asset(2) }}</div>
          <div ref="chart" id="myChart" style="height: 420px; width: 100%"></div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Web3 from 'web3';
import { mapActions, mapGetters } from 'vuex';
import { getMinerRewards, getValidatorList, getAddressTag } from '../service/CommonService';
import util from '../utils/util';
import find from 'lodash/find';
import filters from '../filters';
import * as echarts from 'echarts';

export default {
  filters,
  data() {
    return {
      myChart: {},
      totalValue: 0,
      nodeList: [],
      validatorList: [],
      detailsList: []
    };
  },
  computed: {
    ...mapGetters({
      totalStakes: 'totalStakes',
      connection: 'connection',
      apiUrl: 'apiUrl',
      dark: 'dark'
    })
  },
  watch: {},
  mounted() {
    this.myCharts();
    this.toggleTheme();
  },
  methods: {
    ...mapActions({
      setTotalStakes: 'setTotalStakes'
    }),

    async myCharts() {
      // this.myChart.showLoading();
      let minerRewards = await getMinerRewards();
      let list = await getValidatorList();
      this.validatorList = list.data.data.activeList;
      let nodeRewardsList = minerRewards.data.data;
      for (let i = 0; i < this.validatorList.length; i++) {
        const element = this.validatorList[i];
        let nodeList = find(nodeRewardsList, (items) => web3.utils.toChecksumAddress(items.miner) == web3.utils.toChecksumAddress(element.address));
        this.nodeList.push(nodeList);
      }
      let addressTag = await getAddressTag();
      this.detailsList = addressTag.data.data;
      let data = this.nodeList.map((item) => {
        let detail = find(this.detailsList, (items) => web3.utils.toChecksumAddress(items.address) == web3.utils.toChecksumAddress(item.miner));
        let nodeName = '';
        if (detail) {
          nodeName = detail.addressName;
        }
        let name = util.addr(item.miner);
        let value = web3.utils.fromWei(web3.utils.toBN(item.allReward));
        this.totalValue += parseFloat(value);
        return {
          unclaimedReward: web3.utils.fromWei(web3.utils.toBN(item.unclaimedReward)),
          claimedReward: web3.utils.fromWei(web3.utils.toBN(item.claimedReward)),
          name: name,
          nodeName: nodeName,
          value: value
        };
      });
      // this.myChart.hideLoading();
      // console.log('data',data)
      const chart = this.$refs.chart;
      var option;
      if (chart) {
        this.myChart = this.$echarts.init(chart);
        option = {
          tooltip: {
            show: true,
            trigger: 'item',
            enterable: true,
            backgroundColor: 'rgb(255,255,255)',
            extraCssText: 'box-shadow: 0 0 20px #ddd;',
            padding: 12,
            textStyle: {
              color: '#000',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: 14
            },
            formatter: function (params) {
              let claimedReward = util.asset(params.data.claimedReward, 2);
              let unclaimedReward = util.asset(params.data.unclaimedReward, 2);
              let str = '<div style="width:10px;height:10px; border-radius:10px;display: inline-block;background-color:' + params.color + '"></div>' + ' ' + '<span>' + 'Withdrawn block rewards' + ': ' + claimedReward + '</span>' + '<br/>' + '<div style="width:10px;height:10px; border-radius:10px;display: inline-block;background-color:' + params.color + '"></div>' + ' ' + '<span>' + 'Unwithdrawn block rewards' + ': ' + unclaimedReward + '</span>';
              return `<div style="max-width:30rem;">${str}</div>`;
            }
          },
          toolbox: {
            show: false,
            feature: {
              dataZoom: {
                zoomLock: true
              }
            }
          },
          color: ['#1D4EE4', '#2554E6', '#3561E9', '#456EEC', '#6587F2', '#3070FE', '#2179ff', '#3d8bff', '#5498ff', '#189ef1', '#3699e5', '#21affd', '#90CBFF', '#399bdc', '#46bdfd', '#59b9f9', '#5cb0cf', '#6bcafe', '#82b4ff', '#64c7fe', '#87cefa'],
          series: [
            {
              type: 'treemap',
              width: '100%',
              height: '90%',
              roam: false,
              nodeClick: false,
              data: data,
              label: {
                show: true,
                formatter: function (params) {
                  return params.name + '\n' + params.data.nodeName;
                }
              },
              breadcrumb: {
                show: false
              },
              itemStyle: {
                gapWidth: 3,
                gapHeight: 3
              }
            }
          ]
        };

        this.myChart.setOption(option);
        if (this.dark) {
          this.myChart.setOption({
            theme: {
              tooltip: {
                backgroundColor: 'red'
              }
            }
          });
          console.log('this.dark', this.dark);
        } else {
          this.myChart.setOption({
            theme: {
              tooltip: {
                show: true,
                trigger: 'item',
                enterable: true,
                backgroundColor: 'rgb(255,255,255)',
                extraCssText: 'box-shadow: 0 0 20px #ddd;',
                padding: 12,
                textStyle: {
                  color: '#000',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: 14
                }
              }
            }
          });
          console.log('this.dark', this.dark);
        }
        window.addEventListener('resize', () => {
          this.myChart.resize();
        });
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', () => {
          this.myChart.resize();
        });
      });
    },
    toggleTheme() {}
  }
};
</script>

<style scoped lang="scss">
.container {
  padding: 0 12px 40px 12px;
}
.reward {
  padding: 20px 20px 40px 20px;
  .theme--light.sub-title {
    color: #000;
    padding-left: 0;
  }
  .node-number {
    font-size: 30px;
    font-weight: bolder;
    // padding-left: 20px;
  }
  .font-grey {
    color: #868e9e;
    font-size: 14px;
    margin-top: 10px;
    // padding-left: 20px;
  }
}

.tooltip div {
  width: 10px;
  height: 10px;
  border-radius: 10px;
  display: inline;
}
</style>
