<template>
  <v-container style="padding: 0">
    <v-card class="flex-column mt-2 overview">
        <h3>Grants Overview</h3>
        <v-row justify="space-between">
            <v-col cols="12" sm="6">
                <v-card :class="dark?'chip-dark grants-chart':'chip-light elevation-0 grants-chart'">
                    <div id="myCharts" ref="chart" style="height:348px;" class="dispribution"></div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6">
                <v-card :class="dark?'chip-dark partners':'chip-light elevation-0 partners'">
                    <v-row>
                        <v-col cols="12" sm="6">
                            <div class="number-color">500,000  <span class="font-grey">REI</span></div>
                            <div class="font-grey">$REI for ecosystem partners</div>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <div class="number-color">6  <span class="font-grey">REI</span></div>
                            <div class="font-grey">Ecosystem partners have been sponsored</div>
                        </v-col>
                    </v-row>
                </v-card>
                <v-card :class="dark?'chip-dark support':'chip-light elevation-0 support'">
                    <v-row>
                        <v-col cols="12" sm="6">
                            <div class="number-color">3,602,500  <span class="font-grey">REI</span></div>
                            <div class="font-grey">$REI for supporting validators</div>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <div class="number-color">16  <span class="font-grey">REI</span></div>
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

export default {
  filters,
  data() {
    return {};
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
      this.myCharts()
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
            maxAspectRatio: 1
            },
            legend: {
              selectedMode: false,
              orient: 'vertical',
              icon:'circle',
              right: '5%',
              top: 'center',
              itemGap: 50,
              itemWidth: 16, 
              itemHeight: 12,
              textStyle: {
                    fontSize: 16,
                    color:'#868e9e'
                },
            },
            color:['#64B5FF','#7A7AB3','#4CC7B6'],
            title:{
                text:'1B',
                left:"22%",
                top:"41%",
                textStyle:{
                    color:"#868e9e",
                    fontSize:20,
                    fontWeight:700,
                    align:"center"
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
                    { value: '30', name: '$REI for supporting validators' },
                    { value: '30', name: '$REI for ecosystem partners' },
                    { value: '40', name: 'Remaining $REI' },
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
                  text:"1B",
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
            // myChart.resize();
        });
      })
    }
  }
};
</script>

<style scoped lang="scss">
.overview{
    padding: 20px;
}
.chip-dark{
    background-color: #13112B;
}
.chip-light{
    background-color: #F5F5F7;
}
.grants-chart{
    margin: 12px 0;
    height: 324px;
}
.partners{
    margin-top: 12px;
    height: 150px;
    padding: 24px;
}
.support{
    margin-top: 24px;
    height: 150px;
    padding: 24px;
}
.number-color{
    font-size: 30px;
    font-weight: bolder;
}
.font-grey{
    color: #868E9E;
    font-size: 14px;
    margin-top: 12px;
    font-weight: normal;
}
</style>
