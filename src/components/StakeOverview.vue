<template>
      <v-container style="padding:0;">
          <v-card class="flex-column mt-2 overview">
            <h3>Overview</h3>
            <v-card outlined class="overview-card">
                <v-row justify="start">
                        <v-col cols="12" sm="3">
                            <div class="font-grey">Total Voting Power ($REI)</div>
                            <h2>{{ totalStakeAmount | asset(2) }}</h2>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <div class="font-grey">Votes/Circulation</div>
                            <h2>{{circulation | asset(2) }} <span class="font-grey">%</span></h2>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <div class="font-grey">Active Nodes</div>
                            <h2>{{ activeList.length }}</h2>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <div class="font-grey">Total Delegators</div>
                            <h2>{{ stats.totalDelegatorNumber | asset(0)}}</h2>
                        </v-col>
                    </v-row>
            </v-card>
       </v-card>
    </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import { getValidatorList,getReiSatistic } from '../service/CommonService';
import filters from '../filters';
export default {
filters,
  data() {
    return {
     totalAmount:"",
     activeList:"",
     inActiveList:"",
     circulation:"",
     totalStakeAmount:'',
     stats:"",
     value:0,
     inactiveTotalPower:0,
    };
  },
   watch: {
    '$store.state.assetInfo': function() {
        this.getOverview();
    },
  },
  computed: {
    ...mapGetters({
        connection: 'connection',
        dark: 'dark',
        assetInfo: 'assetInfo'
    })
  },
  mounted(){
      this.getOverview();
  },
  methods: {
    async getOverview(){
        let OverviewData = await getValidatorList();
        let reistate = await getReiSatistic();
        this.totalStakeAmount = reistate.data.row.json.totalStake;
        this.activeList = OverviewData.data.data.activeList;
        this.inActiveList = OverviewData.data.data.inActiveList;
        this.totalAmount  = OverviewData.data.data.totalAmount;
        let chartInfoData = this.assetInfo.circulating_supply;
        let totalStakeAmountNumber = this.totalStakeAmount.replaceAll(',' ,'');
        this.circulation = (totalStakeAmountNumber/chartInfoData)*100;
        this.stats = reistate.data.row.json;
        
        function sortArr(attr){
          return function(a,b){
            return b[attr]-a[attr]
          }
        }
        this.inactiveTotalPower = 0;
        let list = this.inActiveList.sort(sortArr('power'));
        for (let i = 0; i < list.length; i++) {
            if(i < 21){
                this.inactiveTotalPower+=Number(list[i].power)
            } 
        }
        this.value = (this.inactiveTotalPower/100000000)*100
    },
    
  }
};
</script>

<style scoped lang="scss">
.font-grey{
    color: #868E9E ;
    font-size: 14px;
}
.v-sheet--outlined{
    border: none;
}
.overview{
    padding: 20px;
}
.overview-card{
    margin: 30px 0;
}
.progress-miner{
    padding: 0 12px;
    margin-top: 0px;
}
.v-progress-linear{
    border-radius: 8px;
    margin-top: 10px;
}
.miner{
    text-align: right;
    font-size: 14px;
    margin-bottom: 12px;
    color: #868E9E ;
}
</style>
