<template>
  <v-container class="overview">
      <h3>Overview</h3>
       <v-card outlined class="overview-card">
           <v-row justify="space-between">
                <v-col cols="12" sm="3">
                    <div class="font-grey">Total Voting Power ($REI)</div>
                    <h2>21,185,112.71</h2>
                </v-col>
                <v-col cols="12" sm="3">
                    <div class="font-grey">Total Rewards to be withdrawn ($REI)</div>
                    <h2>68,158.59</h2>
                </v-col>
                <v-col cols="12" sm="3">
                    <div class="font-grey">Active Nodes</div>
                    <h2>21</h2>
                </v-col>
            </v-row>
            <v-row justify="space-between">
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
            </v-row>
       </v-card>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import { getCalculation } from '../service/CommonService'
export default {
  data() {
    return {
     totalAmount:"",
    };
  },
  computed: {
    ...mapGetters({
        connection: 'connection',
        dark: 'dark'
    })
  },
  mounted(){
      this.getOverview();
  },
  methods: {
    async getOverview(){
        let OverviewData = await getCalculation();
        this.totalAmount  = OverviewData.data.data.totalAmount;
        console.log('OverviewData',OverviewData)
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
