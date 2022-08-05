<template>
  <v-container class="overview">
      <h3>Overview</h3>
       <v-card outlined class="overview-card">
           <v-row justify="space-between">
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
                    <div class="font-grey">Inactive Nodes</div>
                    <h2>{{ inActiveList.length }}</h2>
                </v-col>
            </v-row>
            <!-- <v-row justify="space-between">
                <v-col cols="12" sm="3">
                    <div class="font-grey">Votes/Circulation</div>
                    <h2>12.78 <span class="font-grey">%</span></h2>
                </v-col>
                <v-col cols="12" sm="3">
                    <div class="font-grey">Node Rewards to be withdrawn($REI)</div>
                    <h2>2,156,811.59</h2>
                </v-col>
                <v-col cols="12" sm="3">
                    <div class="font-grey">Total Delegators</div>
                    <h2>617</h2>
                </v-col>
            </v-row> -->
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
     totalStakeAmount:''
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
        this.circulation = (this.totalAmount/chartInfoData)*100;
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
</style>
