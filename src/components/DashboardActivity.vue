<template>
  <v-container>
    <v-row>
      <v-col class="charts-faq">
        <div class="total-charts">
          <v-card class="mx-auto" rounded="4" color="background" style="margin-top: 12px; height: 480px">
            <v-row class="head-chips" justify="space-between">
              <v-subheader class="sub-title"><h3>REI Network Activity</h3></v-subheader>
              <v-chip-group active-class="chip_group" v-model="model" mandatory>
                <v-chip class="ma-3" x-small v-for="tag in tags" :key="tag">
                  {{ tag }}
                </v-chip>
              </v-chip-group>
            </v-row>
            <div ref="chartPrice" style="height: 376px"></div>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import { getActivity } from '../service/CommonService';
import util from '../utils/util';

/* eslint-disable no-undef */
export default {
  data() {
    return {
      radios: 1,
      tab: 0,
      myChart: null,
      myChart2: null,
      folders: [],
      marketData: [],
      priceData: [],
      tags: ['7D'],
      model: 0,
      rawCache: []
    };
  },
  watch: {
    model() {
      this.getActivityChart();
    },
    '$store.state.connection': function () {
      if (this.connection && this.connection.network) {
        this.getActivityChart();
      }
    }
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
    this.getActivityChart();
  },
  destroyed() {},
  methods: {
    async getActivityChart() {
      this.myChart.showLoading();
      const days = this.model === 0 ? 7 : 30;
      const { data: res } = await getActivity({ day: days });
      const raw = res.data;
      raw.splice(days);

      raw.sort((a, b) => new Date(a.date) - new Date(b.date));
      const barData = raw.map((item) => [item.date, item.totalTransactions]);
      const lineData = raw.map((item) => [item.date, item.uniqueAddressCount]);
      this.myChart.hideLoading();
      this.myChart.setOption({
        series: [
          {
            data: barData
          },
          {
            data: lineData
          }
        ]
      });
      // console.log('folders',this.folders)
    },
    myCharts() {
      const chartPrice = this.$refs.chartPrice;
      if (chartPrice) {
        this.myChart = this.$echarts.init(chartPrice);
        var option = {
          tooltip: {
            trigger: 'axis',
            formatter: (p) => {
              let html = p[0].value[0] + '<br/>';
              p.forEach((i) => {
                html += `${i.marker}${i.seriesName}: ${util.numFormat(i.value[1])}<br/>`;
              });
              return html;
            }
          },
          legend: {
            show: true,
            bottom: 0,
            left: 'center',
            textStyle: {
              color: '#868e9e',
              fontSize: 12
            },
            itemGap: 24,
            icon: 'circle',
            data: ['unique Address','total Transactions']
          },
          xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(134,142,158,.6)'
              }
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: 'rgba(134,142,158,.6)',
                width: '1'
              }
            },
            splitLine: { show: false }
          },
          yAxis: [
            {
              position: 'left',
              type: 'value',
              splitLine: {
                show: false
              },
              axisLabel: {
                formatter: function (value) {
                  var txt = [];
                  if (value >= 10 * 6) {
                    txt.push(value / 10 ** 6 + 'M');
                  } else {
                    txt.push(value);
                  }
                  return txt;
                },
                textStyle: {
                  color: 'rgba(134,142,158,.6)'
                }
              },
              axisLine: {
                show: true,
                lineStyle: {
                  type: 'solid',
                  color: 'rgba(134,142,158,.1)',
                  width: '1'
                }
              }
            },
            {
              position: 'right',
              type: 'value',
              axisLabel: {
                formatter: '${value}'
              },
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: 'rgba(134,142,158, 0.1)',
                  width: '1'
                }
              }
            }
          ],
          series: [
            {
              name: 'total Transactions',
              data: [],
              type: 'bar',
              symbol: 'none',
              barWidth: 21,
              itemStyle: {
                color: '#5B57E7'
              }
            },
            {
              name: 'unique Address',
              data: [],
              symbol: 'circle',
              type: 'line',
              itemStyle: {
                color: '#FF952C'
              }
            }
          ]
        };

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
.charts-faq {
  display: flex;
  justify-content: space-between;
  padding: 0;
  background-color: transparent;
  height: 480px;
  margin-bottom: 24px;
  margin-top: -12px;
  .total-charts {
    width: 100%;
  }
  .head-chips {
    padding: 0 12px;
    padding-bottom: 8px;
  }
  .trend-head {
    display: flex;
    justify-content: space-between;
  }
  .v-chip-group .v-chip--active {
    color: #fff;
  }
  .charts-faq .theme--dark.v-chip:not(.v-chip--active) {
    background-color: transparent !important;
  }
  .theme--dark.v-chip:not(.v-chip--active) {
    background-color: transparent !important;
  }
  .theme--light.v-chip:not(.v-chip--active) {
    background: transparent;
  }
  .trends-radio {
    margin-left: 20px;
    label {
      font-size: 12px;
    }
  }
  .theme--dark.v-chip:not(.v-chip--active) {
    background-color: #9f9db9;
  }
}
.v-tab {
  padding: 0 !important;
}
.faq-get {
  .price-more {
    display: flex;
    justify-content: space-between;
    .title-detailed {
      font-size: 16px;
      color: #868e9e;
    }
    .title-detailed:hover {
      color: #6979f8;
      text-decoration: underline;
    }
  }
}
.theme--dark.v-tabs-items {
  background-color: transparent;
}
.theme--dark.v-list {
  background-color: transparent;
}
.list-price {
  display: flex;
  flex-direction: row;
  .theme--light.folder-number {
    color: #000;
  }
}
.v-list--two-line .v-list-item,
.v-list-item--two-line {
  min-height: 51px;
}
.update-time {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  font-size: 12px;
  margin-right: 20px;
}
.v-tab {
  text-transform: none !important;
}

@media screen and (max-width: 900px) {
  //     .trend-head{
  //         display: flex;
  //         flex-direction: column;
  //    }
  .charts-faq {
    display: flex;
    flex-direction: column;
    padding: 0;
    height: auto;
    .total-charts {
      width: 100%;
    }
    .faq-get {
      width: 100% !important;
      margin-top: 20px;
    }
  }
}
</style>
