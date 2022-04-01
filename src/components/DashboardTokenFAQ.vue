<template>
  <v-container class="stake_background">
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <v-row>
      <v-col class="charts-faq"> 
        <div class="total-charts">
          <v-card
            class="mx-auto card-charts"
            rounded="4"
            color="background"
          >
          <v-subheader class="sub-title">
            <h3>Token Distribution</h3>
            <v-tooltip bottom color="start_unstake">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    color="right_icon"
                    dense
                    size="16"
                    style="margin-left:4px"
                  >
                    mdi-alert-circle-outline
                  </v-icon>
                </template>
                <h3>What is node rewards？</h3>
                <span>Remaining 50M are node rewards, <br/>will be minted over 5 years</span>
             </v-tooltip>
          </v-subheader>
            <div id="myCharts" ref="chart" style="height:348px;" class="dispribution"></div>
            <!-- <div class="update-time" style="margin-top:-20px">
                 <v-icon
                    color="primary"
                    size="12"
                 >
                    mdi-clock-time-ten-outline
                </v-icon>
                    1h Ago
            </div> -->
          </v-card>          
        </div>
        <div class="faq-get">
          <v-card
            class="card-charts"     
            rounded="4"
            color="background"
          >
          <v-subheader class="sub-title"><h3>FAQ</h3></v-subheader>
          <v-list class="background">
              <v-list-item-group>
                <v-list-item 
                  class="item-list" 
                  v-for="(item, i) in faqList"
                  :key="i">
                  <a :href='item.url' target="_blank" style="width: 100% !important;"> 
                    <v-card class="ma-2 list-card" outlined>
                    <v-list-item-content class=“text-truncate”>
                      <v-list-item-title v-text="item.title" class="list-subtitle"></v-list-item-title>
                      <v-list-item-subtitle v-text="item.content" class="list-subtitle"></v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon
                        color="right_icon"
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
            title:'Why We build REI Network?',
            content:'When we had the first idea about blockchain in the year 2016, we wanted to develop a high-performance blockchain that could adapt to the growing business demands.',
            url:'https://docs.rei.network/rei-network/why-we-build-rei-network'
          },
          {
            title:'What is REI DAO?',
            content:'REI DAO is a decentralized governance community, a manifestation of the REI Network blockchain spirit of being more decentralized, open and transparent in its governance model, and returning on-chain governance to each REI holder.',
            url:'https://docs.rei.network/rei-dao/what-is-rei-dao'
          },
          {
            title:'What is REI?',
            content:'REI keeps the REI Network running and secures the REI Network . When you send REI or use an application on the REI Network.',
            url:'https://docs.rei.network/rei-network/introduction-to-rei'
          },
          {
            title:'What is REIcosystem?',
            content:'The Foundation will use the unlocked 250 million REI to incentivize the REI Network`s ecological contributors and developers.',
            url:'https://docs.rei.network/rei-dao/reicosystem'
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
              trigger: 'item',
              formatter: "{a} {b} :{d}%"
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
                var clientlabels = ['Circulated','REIecosystem','Marketing','Node Rewards'];
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
            title:{
                text:"1BN",
                left:"27%",
                top:"41%",
                textStyle:{
                    color:"#868e9e",
                    fontSize:18,
                    fontWeight:700,
                    align:"center"
                }
            },
            graphic:{
                type:"text",
                left:"24%",
                top:"52%",
                style:{
                    text:"Total Supply",
                    textAlign:"center",
                    fill:"#868e9e",
                    fontSize:14,
                }
            },
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
                    // show: true,
                    fontSize: '24',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: '75', name: 'Circulated' },
                    { value: '15', name: 'REIecosystem' },
                    { value: '5', name: 'Marketing' },
                    { value: '5', name: 'Node Rewards' }
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
                title:{
                  text:"1BN",
                  left:"18%",
                  top:"43%",
                  textStyle:{
                    fontSize:16,
                  }
            },
            graphic:{
                type:"text",
                left:"14%",
                top:"51%",
                style:{
                  text:"Total Supply",
                  fill:"#868e9e",
                  textAlign:"center",
                  fontSize:12,
                }
            },
                legend:{
                  right: '1%',
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
    padding:28px 0;
    
    .total-charts{
      width: 58.5%;
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
      margin-bottom: 12px;
    }
  }
  .list-subtitle{
    width:140px;
  }
}
</style>
