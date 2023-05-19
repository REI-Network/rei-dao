<template>
  <v-container class="stake_background">
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <v-row>
      <v-col style="padding: 0">
        <v-card class="mx-auto reward" color="background" rounded="4" style="width: 100%">
          <v-subheader class="sub-title"><h3>Block Rewards For Validator</h3></v-subheader>
          <div class="font-grey">Total block rewards for validator</div>
          <div class="node-number">1,2520,236.56</div>
          <div ref="chart" id="myChart" style="height: 420px; width: 100%"></div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable no-undef */

import { mapActions, mapGetters } from 'vuex';
// import * as echarts from 'echarts';

export default {
  data() {
    return {
      myChart: {}
    };
  },
  computed: {
    ...mapGetters({
      totalStakes: 'totalStakes',
      connection: 'connection',
      apiUrl: 'apiUrl'
    })
  },
  watch: {},
  mounted() {
    this.myCharts();
  },
  methods: {
    ...mapActions({
      setTotalStakes: 'setTotalStakes'
    }),

    myCharts() {
      const chart = this.$refs.chart;
      if (chart) {
        this.myChart = this.$echarts.init(chart);
        var option = {
          tooltip: {},
          toolbox: {
            show: false,
            feature: {
              dataZoom: {
                zoomLock: true
              }
            }
          },
          color: ['#0f44f1', '#0f78f1', '#189ef1', '#3699e5', '#59b9f9', '#87cefa', '#0f44f1', '#0f78f1', '#189ef1', '#3699e5', '#59b9f9', '#87cefa'],
          series: [
            {
              type: 'treemap',
              width:'100%',
              height:'90%',
              roam: false,
              nodeClick:false,
              data: [
                {
                  name: 'nodeAa',
                  value: 12
                },
                {
                  name: 'nodeAb',
                  value: 8
                },
                {
                  name: 'nodeAc',
                  value: 15
                },
                {
                  name: 'nodeAd',
                  value: 7
                },
                {
                  name: 'nodeAe',
                  value: 5
                },
                {
                  name: 'nodeAf',
                  value: 10
                },
                {
                  name: 'nodeAa',
                  value: 19
                },
                {
                  name: 'nodeAb',
                  value: 7
                },
                {
                  name: 'nodeAc',
                  value: 11
                },
                {
                  name: 'nodeAd',
                  value: 4
                },
                {
                  name: 'nodeAe',
                  value: 9
                },
                {
                  name: 'nodeAf',
                  value: 17
                }
              ],
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
        window.addEventListener('resize', () => {
          this.myChart.resize();
        });
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', () => {
          this.myChart.resize();
        });
      });
    }
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
    padding-left:0;
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
</style>
