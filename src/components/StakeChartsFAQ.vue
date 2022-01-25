<template>
  <v-container style="margin-top:28px" class="stake_background">
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <v-row>
      <v-col cols="12" md="12" sm="12" class="charts-faq"> 
        <div class="total-charts">
          <v-card
            class="mx-auto card-charts"
            tile
            color="background"
          >
          <v-subheader><h3>Charts</h3></v-subheader>
          <!-- <v-subheader> -->
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
              10D
            </v-btn>
          </div>
          <!-- </v-subheader> -->
          <div id="myCharts" ref="echart" style="height:348px"></div>
          <div class="update-time" style="margin-top:-20px;">
                <v-icon
                    color="primary"
                    size="12"
                  >
                    mdi-clock-time-ten-outline
                </v-icon>
                    1h Ago
            </div>
          </v-card>          
        </div>
        <div class="faq-get">
          <v-card
            class="mx-auto card-charts"     
            tile
            color="background"
          >
          <v-subheader><h3>FAQ</h3></v-subheader>
          <v-card class="ma-8 list-card" outlined>
            <v-list-item class="item-list">
                <v-list-item-content>
                  <v-list-item-subtitle>
                    How To Vote Stake To Get Get R Stake To Get Get
                  </v-list-item-subtitle>  
                </v-list-item-content>
                <v-icon
                  color="primary"
                  dark
                  style="margin-left:20px"
                >
                  mdi-arrow-right-circle
                </v-icon>
            </v-list-item>
          </v-card>
          <v-card class="ma-8 list-card" outlined>
            <v-list-item class="item-list">
                <v-list-item-content>
                  <v-list-item-subtitle>
                    How To Vote Stake To Get Get R Stake To Get Get
                  </v-list-item-subtitle>  
                </v-list-item-content>
                <v-icon
                  color="primary"
                  dark
                  style="margin-left:20px"
                >
                  mdi-arrow-right-circle
                </v-icon>
            </v-list-item>
          </v-card>

         <v-card class="ma-8 list-card" outlined>
            <v-list-item class="item-list">
                <v-list-item-content>
                  <v-list-item-subtitle>
                    How To Vote Stake To Get Get R Stake To Get Get
                  </v-list-item-subtitle>  
                </v-list-item-content>
                <v-icon
                  color="primary"
                  dark
                  style="margin-left:20px"
                >
                  mdi-arrow-right-circle
                </v-icon>
            </v-list-item>
          </v-card>

         <v-card class="ma-8 list-card" outlined>
            <v-list-item class="item-list">
                <v-list-item-content>
                  <v-list-item-subtitle>
                    How To Vote Stake To Get Get R Stake To Get Get
                  </v-list-item-subtitle>  
                </v-list-item-content>
                <v-icon
                  color="primary"
                  dark
                  style="margin-left:20px"
                >
                  mdi-arrow-right-circle
                </v-icon>
            </v-list-item>
          </v-card>
        </v-card>
        </div>
      </v-col>
    </v-row>   
    </v-container>
</template>
<script>
/* eslint-disable no-undef */
import * as echarts from 'echarts';
export default {
  data() {
    return {
        radios:'Total Voting Stake',
    };
  },
  watch: {
  
  },
  mounted() {
    this.myCharts()
  },
  destroyed() {
    
  },
  methods: {
    myCharts(){
        const echart = this.$refs.echart;
        if(echart){
          const myChart = this.$echarts.init(echart);
          var option = {
            xAxis: {
              type: 'category',
              data: ['Oct/18', 'Oct/19', 'Oct/20', 'Oct/21', 'Oct/22', 'Oct/23', 'Oct/24', 'Oct/25', 'Oct/26', 'Oct/27', 'Oct/28'],
              //刻度线
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#2C2752', //坐标线的颜色
                  width: '1' //坐标线的宽度
                }
              },
              axisLabel: {
                textStyle: {
                fontSize: 12,
                }
              },         
            },
            yAxis: {
              type: 'value',
              data:[0,150,300,450,600],
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#2C2752', //左边线的颜色
                  width: '1' //坐标线的宽度
                },
              },
              splitLine: {
                  show: false,
                  lineStyle: {
                    color: 'rgba(104, 180, 221, 0.1)',
                    type: 'dashed',
                  }
                },
              },
              legend: {
                selectedMode: false,
                itemWidth: 16,
                itemHeight: 16,
                top: 'bottom',
                textStyle: {
                  fontSize: 16,
                  color:'#2C2752'
                },
              },
            series: [
              {
                name:'Total Voting Stake',
                data: [120, 200, 150, 80, 70, 110, 130,80,90,130,120],
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
          myChart.setOption(option)
          window.addEventListener("resize", function() {
            myChart.resize()
          })
        }
        this.$on('hook:destroyed',()=>{
         window.removeEventListener("resize", function() {
            myChart.resize();
        });
      })
    }
  },
  computed: {
   
  }
};
</script>

<style scoped lang="scss">
.charts-faq{
    display: flex;
    justify-content: space-between;
    // align-items: center;
    padding: 0;
    .total-charts{
      width: 60%;
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
  .card-charts{
    height: 460px;
  }
  .list-card{
    background-color: transparent !important;
  }
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
