<template>
  <v-container style="padding: 0">
    <v-row class="bridge-asset">
      <v-col cols="12" sm="6">
        <v-card class="asset-charts">
          <h3>Cbridge Asset Distribution</h3>
          <div ref="CbridgeChart" style="height: 348px"></div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card class="asset-charts">
          <h3>Multichain Asset Distribution</h3>
          <div ref="MultichainChart" style="height: 348px"></div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import filters from '../filters';

export default {
  filters,
  data() {
    return {};
  },
  watch: {},
  computed: {
    ...mapGetters({
      connection: 'connection',
      dark: 'dark'
    })
  },
  mounted() {
    this.init();
    this.myCharts();
    this.myCharts2();
  },
  methods: {
    init() {},
    myCharts() {
      const chart = this.$refs.CbridgeChart;
      let data = [
        { value: 20, amount: 20, name: 'BUSD' },
        { value: 30, amount: 30, name: 'WETH' },
        { value: 40, amount: 40, name: 'USDT' },
        { value: 10, amount: 10, name: 'WBTC' }
      ];
      if (chart) {
        const myChart = this.$echarts.init(chart);
        var option = {
          baseOption: {
            tooltip: {
              trigger: 'item',
              //   formatter: function (params) {
              //     let amount = util.asset(params.data.amount, 2);
              //     return params.data.name + ' : ' + params.data.value + '%' + '<br/>' + amount;
              //   }
            },
            query: {
              maxAspectRatio: 1
            },
            legend: {
              selectedMode: false,
              orient: 'vertical',
              icon: 'circle',
              right: '22%',
              top: 'center',
              itemGap: 50,
              itemWidth: 16,
              itemHeight: 12,
              textStyle: {
                fontSize: 16,
                color: '#868e9e'
              },
              tooltip: {
                trigger: 'item'
              }
            },
            color: ['#F46F6F', '#64B5FF', '#7A7AB3', '#4CC7B6'],
            title: {
              text: '1.30M',
              left: '19%',
              top: '41%',
              textStyle: {
                // color: '#868e9e',
                fontSize: 20,
                fontWeight: 700,
                align: 'center'
              }
            },
            // graphic: {
            //   type: 'text',
            //   left: '12%',
            //   top: '80%',
            //   style: {
            //     text: 'Distribution Of Grants',
            //     textAlign: 'center',
            //     fill: '#868e9e',
            //     fontSize: 14
            //   }
            // },
            series: [
              {
                name: '',
                type: 'pie',
                radius: ['30%', '60%'],
                center: ['25%', '46%'],
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
                title: {
                  text: '1.30M',
                  left: '18%',
                  top: '43%',
                  textStyle: {
                    fontSize: 16
                  }
                },
                graphic: {
                  type: 'text',
                  left: '14%',
                  top: '51%',
                  style: {
                    text: 'Total Supply',
                    fill: '#868e9e',
                    textAlign: 'center',
                    fontSize: 12
                  }
                },
                legend: {
                  right: '1%',
                  itemWidth: 8,
                  itemHeight: 8,
                  textStyle: {
                    fontSize: 13
                  }
                },
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
        myChart.setOption(option);
        window.addEventListener('resize', function () {
          myChart.resize();
        });
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', function () {
          // myChart.resize();
        });
      });
    },

    myCharts2() {
      const chart = this.$refs.MultichainChart;
      let data = [
        { value: 25, amount: 20, name: 'BUSD' },
        { value: 34, amount: 30, name: 'WETH' },
        { value: 28, amount: 40, name: 'USDT' },
        { value: 13, amount: 10, name: 'WBTC' }
      ];
      if (chart) {
        const myChart2 = this.$echarts.init(chart);
        var option = {
          baseOption: {
            tooltip: {
              trigger: 'item',
              //   formatter: function (params) {
              //     let amount = util.asset(params.data.amount, 2);
              //     return params.data.name + ' : ' + params.data.value + '%' + '<br/>' + amount;
              //   }
            },
            query: {
              maxAspectRatio: 1
            },
            legend: {
              selectedMode: false,
              orient: 'vertical',
              icon: 'circle',
              right: '22%',
              top: 'center',
              itemGap: 50,
              itemWidth: 16,
              itemHeight: 12,
              textStyle: {
                fontSize: 16,
                color: '#868e9e'
              },
              tooltip: {
                trigger: 'item'
              }
            },
            color: ['#F46F6F', '#64B5FF', '#7A7AB3', '#4CC7B6'],
            title: {
              text: '1.30M',
              left: '19%',
              top: '41%',
              textStyle: {
                // color: '#868e9e',
                fontSize: 20,
                fontWeight: 700,
                align: 'center'
              }
            },
            // graphic: {
            //   type: 'text',
            //   left: '12%',
            //   top: '80%',
            //   style: {
            //     text: 'Distribution Of Grants',
            //     textAlign: 'center',
            //     fill: '#868e9e',
            //     fontSize: 14
            //   }
            // },
            series: [
              {
                name: '',
                type: 'pie',
                radius: ['30%', '60%'],
                center: ['25%', '46%'],
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
                title: {
                  text: '1.30M',
                  left: '18%',
                  top: '43%',
                  textStyle: {
                    fontSize: 16
                  }
                },
                // graphic: {
                //   type: 'text',
                //   left: '14%',
                //   top: '51%',
                //   style: {
                //     text: 'Total Supply',
                //     fill: '#868e9e',
                //     textAlign: 'center',
                //     fontSize: 12
                //   }
                // },
                legend: {
                  right: '1%',
                  itemWidth: 8,
                  itemHeight: 8,
                  textStyle: {
                    fontSize: 13
                  }
                },
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
        myChart2.setOption(option);
        window.addEventListener('resize', function () {
          myChart2.resize();
        });
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', function () {
          // myChart2.resize();
        });
      });
    }
  }
};
</script>

<style scoped lang="scss">
.bridge-asset {
  margin-bottom: 28px;
}
.asset-charts {
  padding: 20px;
}
</style>
