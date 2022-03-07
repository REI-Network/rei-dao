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
          <v-subheader class="sub-title"><h3>Token Distribution</h3></v-subheader>
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
            class="card-charts"     
            tile
            color="background"
          >
          <v-subheader class="sub-title"><h3>FAQ</h3></v-subheader>
          <v-list class="background">
              <v-list-item-group>
                <v-list-item 
                  class="item-list" 
                  v-for="(item, i) in faqList"
                  :key="i">
                  <a :href='item.url'>
                    <v-card class="ma-2 list-card" outlined>
                    <v-list-item-content class=“text-truncate”>
                      <v-list-item-title v-text="item.title" class="list-subtitle"></v-list-item-title>
                      <v-list-item-subtitle v-text="item.content" class="list-subtitle"></v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon
                        color="primary"
                        style="margin-left:20px"
                        size="22"
                      >
                         mdi-arrow-right-circle-outline
                      </v-icon>
                    </v-list-item-action>
                  </v-card>
                 </a>
                </v-list-item>           
              </v-list-item-group>    
            </v-list>
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
        faqList:[
          {
            title:'What is REI DAO?',
            content:'Introduction to REI DAO,about Vision and more...',
            url:''
          },
          {
            title:'What is REI NETWORK?',
            content:'REI Network is not a new project, but an upgraded version of GXChain.',
            url:'https://docs.rei.network/'
          },
          {
            title:'What is the trends chart showing ?',
            content:'The graph of total stake shows nodal voting stats for the following time periods: hourly, daily, weekly, monthly.',
            url:''
          },
          {
            title:'Detailed explanation of token distribution.',
            content:'Get more information about token distribution, etc.',
            url:''
          }
        ],
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
              top: 'center',
              itemGap: 40,
              itemWidth: 12,             // 图例图形宽度
              itemHeight: 12,
              textStyle: {
                    fontSize: 16,
                    color:'#868e9e'
                },
              formatter:function(name){
                var index = 0;
                var clientlabels = ['Circulated','REIecosystem','Maketing','Node Rewards'];
                var clientcounts = ['750,000,000','150,000,000','50,000,000','50,000,000'];
                clientlabels.forEach(function(value,i){
                  if(value == name){
                    index = i;
                  }
                });
                return name + "  " + clientcounts[index];
              }
            },
            color:['#F46F6F', '#64B5FF','#FF9743','#4CC7B6'],
            series: [
              {
                name: '',
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
                    fontSize: '24',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 75, name: 'Circulated' },
                    { value: 15, name: 'REIecosystem' },
                    // { value: 580, name: 'Dev Rewards' },
                    { value: 5, name: 'Maketing' },
                    { value: 5, name: 'Node Rewards' }
                ],
              }
            ]
          },
          media:[
            {
              query:{
                maxWidth:450
              },
              option:{
                legend:{
                  right: '2%',
                  itemWidth: 8,             // 图例图形宽度
                  itemHeight: 8,
                  textStyle: { //图例文字的样式
                    fontSize: 13
                  },
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
    padding: 0;
    .total-charts{
      width: 60%;
    }
  //   .chart-title{
  //     display: flex;
  //     justify-content: space-between;
  //     align-items: center;
  //   .v-btn-total{
  //     width: 28px;
  //     height: 24px;
  //     font-size: 12px;
  //     border-radius: 15px;
  //     position: relative;
  //     right: -380px;
  //   }
  // }
}
.theme--light.sub-title{
    color: #000;
}
.faq-get{
  width:38%
}
.card-charts{
    height: 420px;
  }
  .list-card{
    padding:0 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent !important;
  }
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
.list-subtitle{
    width:160px;
  }
@media screen and (max-width: 920px) {
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
  .list-subtitle{
    width:140px;
  }
}
</style>
