<template>
  <v-container class="dashboard stake_background">
    <v-row>
      <v-col cols="12" sm="6" style="padding-left: 0">
        <v-card class="date-card">
          <h3>validators Date</h3>
          <div ref="validatorChart" style="height: 348px"></div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" style="padding-right: 0">
        <v-card class="date-card">
          <h3>Block loss rate</h3>
          <div ref="blockChart" style="height: 348px"></div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      myChart: {},
      myChart2: {}
    };
  },
  mounted() {
    this.myCharts();
    this.myCharts2();
  },
  methods: {
    myCharts() {
      const chart = this.$refs.validatorChart;
      if (chart) {
        this.myChart = this.$echarts.init(chart);
        var option = {
          baseOption: {
            tooltip: {
              trigger: 'item',
              formatter: '{a} {b} :{d}%'
            },
            query: {
              maxAspectRatio: 1 // 当长宽比小于1时。
            },
            color: ['#F46F6F', '#64B5FF', '#FF9743', '#4CC7B6', '#1BD9e6', '#946e8F'],
            series: [
              {
                name: '',
                type: 'pie',
                radius: ['45%', '70%'],
                center: ['50%', '50%'],
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
                data: [
                  { value: '60', name: 'Circulated' },
                  { value: '15', name: 'REIecosystem' },
                  { value: '5', name: 'Marketing' },
                  { value: '5', name: 'Node Rewards' },
                  { value: '5', name: 'Rewards' },
                  { value: '10', name: 'Node' }
                ]
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
                  text: '1B',
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
                  itemWidth: 8, // 图例图形宽度
                  itemHeight: 8,
                  textStyle: {
                    //图例文字的样式
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
        this.myChart.setOption(option);
        window.addEventListener('resize', function () {
          this.myChart.resize();
        });
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', function () {
          this.myChart.resize();
        });
      });
    },
    myCharts2() {
      const chart2 = this.$refs.blockChart;
      if (chart2) {
        this.myChart2 = this.$echarts.init(chart2);
        var option2 = {
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            selectedMode: false,
            top: 'bottom',
            itemWidth: 16,
            itemHeight: 16,
            textStyle: {
              fontSize: 16,
              color: 'rgba(134,142,158,.6)'
            }
          },
          xAxis: {
            type: 'time',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
          series: [
            {
              name: 'REI FANs',
              type: 'bar',
              data:  [120, 200, 150, 80, 70, 110, 130],
              barMaxWidth: '40%',
              barWidth: '40',
              barMinWidth: '10%',
              barGap: '40%',
              itemStyle: {
                color: '#F85454'
              }
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
@media screen and (max-width: 900px) {
}
</style>
