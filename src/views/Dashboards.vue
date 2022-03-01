<template>
  <v-container class="stake_background">
     <div class="header-title">
      <h3>Dashboard</h3>
      <div class="title-detailed">Get More Information About The Rei Network</div>
    </div>
    <v-row>
      <v-col>
          <DashboardTrends></DashboardTrends>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
           <DashboardPrice></DashboardPrice>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DashboardTokenFAQ></DashboardTokenFAQ>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import DashboardTrends from '../components/DashboardTrends';
import DashboardPrice from '../components/DashboardPrice';
import DashboardTokenFAQ from '../components/DashboardTokenFAQ';

export default {
  components:{
    DashboardTrends,
    DashboardPrice,
    DashboardTokenFAQ
  },
  data() {
    return {
        
    };
  }
};
</script>

<style scoped lang="scss">
.header-title{
  margin: 1.5rem 0;
    .title-detailed{
      font-size: 14px;
      color: #868E9E;
    }
}
</style>
