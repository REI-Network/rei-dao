<template>
  <v-container class="stake_background">
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <v-row>
      <v-col cols="12" md="12" sm="12" class="charts-faq"> 
        <div class="total-charts">
          <v-card
            class="mx-auto card-charts"
            tile
            color="background"
          >
          <v-subheader><h3>Token Distribution</h3></v-subheader>
            <div id="myCharts" ref="chart" style="height:348px;" class="dispribution"></div>
            <div class="update-time" style="margin-top:-20px">
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
          <v-card class="ma-6 list-card" outlined>
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
          <v-card class="ma-6 list-card" outlined>
            <v-list-item class="item-list">
                <v-list-item-content style="width:72%">
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

         <v-card class="ma-6 list-card" outlined>
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
         <v-card class="ma-6 list-card" outlined>
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
      const chart = this.$refs.chart;
      if(chart){
        const myChart = this.$echarts.init(chart);
        var option = {
          baseOption:{
            tooltip: {
              trigger: 'item'
            },
            query: {
            maxAspectRatio: 1 // 当长宽比小于1时。
            },
            legend: {
              selectedMode: false,
              orient: 'vertical',
              icon:'circle',
              right: '15%',
              top: '16%',
              itemGap: 40,
              itemWidth: 12,             // 图例图形宽度
              itemHeight: 12,
              formatter:function(name){
                var index = 0;
                var clientlabels = ['Circulated','Dev Ecology','Dev Rewards','Maketing','Node Rewards'];
                var clientcounts = ['750,000,000','250,000,000','150,000,000','50,000,000','50,000,000'];
                clientlabels.forEach(function(value,i){
                  if(value == name){
                    index = i;
                  }
                });
                return name + "  " + clientcounts[index];
              }
            },
            color:['#F46F6F', '#64B5FF', '#FF9743','#7A7AB3','#4CC7B6'],
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: ['35%', '60%'],
                center: ['30%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center',
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 1048, name: 'Circulated' },
                    { value: 735, name: 'Dev Ecology' },
                    { value: 580, name: 'Dev Rewards' },
                    { value: 484, name: 'Maketing' },
                    { value: 300, name: 'Node Rewards' }
                ],
              }
            ]
          },
          media:[
            {
              query:{
                maxWidth:420
              },
              option:{
                legend:{
                  right: '2%',
                },
                series:[
                  {
                    radius: ['24%', '40%'],
                    center: ['24%', '50%'],
                  }
                ]
              }
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
    .chart-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
    .v-btn-total{
      width: 28px;
      height: 24px;
      font-size: 12px;
      border-radius: 15px;
      position: relative;
      right: -380px;
    }
  }
}
.faq-get{
  width:38%
}
.card-charts{
    height: 420px;
  }
  .list-card{
    background-color: transparent !important;
  }
// .item-list[data-v-1c928091]{
//     margin:10px 20px;
// }
 .item-list{
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   border-radius: 6px;
 }  
.update-time{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    font-size: 12px;
    margin-right: 20px;
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
      width: 100% !important;
      margin-top: 20px;
    }
  }
  .card-charts{
    overflow-x: scroll;
    max-width: 100%;
  }
  .dispribution{
    max-width: 100%;
  }
}
</style>
