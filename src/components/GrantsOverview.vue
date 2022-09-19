<template>
  <v-container style="padding: 0">
    <v-card class="flex-column mt-2 overview">
      <h3>Grants Overview</h3>
      <v-row justify="space-between">
        <v-col cols="12" sm="6">
          <v-card :class="dark ? 'chip-dark grants-chart' : 'chip-light elevation-0 grants-chart'">
            <div id="myGranntsCharts" ref="grantChart" style="height: 348px" class="dispribution"></div>
            <div class="support-icon">
              <v-tooltip left color="start_unstake">
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="right_icon" v-bind="attrs" v-on="on" dense size="16" style="margin-left: 4px"> mdi-help-circle-outline </v-icon>
              </template>
              <span>$REI used to support validators will not back to <br/> market circulation but be gradually reclaimed by <br/>foundation in the future</span>
            </v-tooltip>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card :class="dark ? 'chip-dark partners' : 'chip-light elevation-0 partners'">
            <v-row>
              <v-col cols="12" sm="6">
                <div class="number-color">{{ totalProjectAmount | asset(2) }} <span class="font-grey">REI</span></div>
                <div class="font-grey">$REI for ecosystem partners</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="number-color">{{ projectNumber }}</div>
                <div class="font-grey">Partners have been sponsored</div>
              </v-col>
            </v-row>
          </v-card>
          <v-card :class="dark ? 'chip-dark support' : 'chip-light elevation-0 support'">
            <v-row>
              <v-col cols="12" sm="6">
                <div class="number-color">{{ grantsAmount.supportValidatorAmount | asset(2) }} <span class="font-grey">REI</span></div>
                <div class="font-grey">$REI for supporting validators</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="number-color">{{ grantsAmount.supportValidatorNumber }}</div>
                <div class="font-grey">Validators have been supported</div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import filters from '../filters';
import util from '../utils/util';
const projectsList = require('../grantsInfo/projectList.json');

export default {
  filters,
  data() {
    return {
      totalGrants: 150000000,
      totalProjectAmount: 0,
      projectNumber: 0,
      grantsAmount: {
        supportValidatorAmount: 70740449,
        supportValidatorNumber: 24
      },
      remainingNumber: 0,
      percentProject: 0,
      percentValidator: 0
    };
  },
  watch: {},
  computed: {
    ...mapGetters({
      connection: 'connection',
      dark: 'dark',
      assetInfo: 'assetInfo'
    })
  },
  mounted() {
    this.init();
    this.myCharts();
  },
  methods: {
    init() {
      let totalProjectAmount = 0;
      for (let i = 0; i < projectsList.list.length; i++) {
        let data = projectsList.list[i];
        totalProjectAmount += data.sponsored_amount * 1;
      }
      this.totalProjectAmount = totalProjectAmount;
      this.projectNumber = projectsList.list.length;
      this.percentProject = (((totalProjectAmount * 1) / this.totalGrants) * 100).toFixed(2);
      this.percentValidator = (((this.grantsAmount.supportValidatorAmount * 1) / this.totalGrants) * 100).toFixed(2);
      this.percentRemain = (100 - this.percentProject - this.percentValidator).toFixed(2);
      this.remainingNumber = ((this.totalGrants * this.percentRemain) / 100).toFixed(2);
    },
    myCharts() {
      const chart = this.$refs.grantChart;
      let data = [
        { value: this.percentProject, amount: this.totalProjectAmount, name: '$REI for ecosystem partners' },
        { value: this.percentValidator, amount: this.grantsAmount.supportValidatorAmount, name: '$REI for supporting validators ' },
        { value: this.percentRemain, amount: this.remainingNumber, name: 'Remaining $REI' }
      ];
      if (chart) {
        const myChart = this.$echarts.init(chart);
        var option = {
          baseOption: {
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                let amount = util.asset(params.data.amount, 2);
                return params.data.name + ' : ' + params.data.value + '%' + '<br/>' + amount;
              }
            },
            query: {
              maxAspectRatio: 1
            },
            legend: {
              selectedMode: false,
              orient: 'vertical',
              icon: 'circle',
              right: '5%',
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
            color: ['#64B5FF', '#7A7AB3', '#4CC7B6'],
            title: {
              text: '150M',
              left: '19%',
              top: '41%',
              textStyle: {
                color: '#868e9e',
                fontSize: 20,
                fontWeight: 700,
                align: 'center'
              }
            },
            graphic: {
              type: 'text',
              left: '12%',
              top: '80%',
              style: {
                text: 'Distribution Of Grants',
                textAlign: 'center',
                fill: '#868e9e',
                fontSize: 14
              }
            },
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
    }
  }
};
</script>

<style scoped lang="scss">
.overview {
  padding: 20px;
}
.chip-dark {
  background-color: #13112b;
}
.chip-light {
  background-color: #f5f5f7;
}
.grants-chart {
  margin: 12px 0;
  height: 324px;
}
.partners {
  margin-top: 12px;
  height: 150px;
  padding: 24px;
}
.support {
  margin-top: 24px;
  height: 150px;
  padding: 24px;
}
.number-color {
  font-size: 26px;
  font-weight: bolder;
}
.font-grey {
  color: #868e9e;
  font-size: 14px;
  margin-top: 12px;
  font-weight: normal;
}
.support-icon{
  position: absolute;
  right: 8px;
  top:96px;
}
</style>
