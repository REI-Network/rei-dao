<template>
  <v-container class="dashboard stake_background">
    <div class="header-title">
      <h1>Dashboards</h1>
      <div class="title-detailed">Get more information about REI Network</div>
    </div>
    <v-row>
      <v-col>
        <DashboardNodes></DashboardNodes>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DashboardActivity></DashboardActivity>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DashboardReward></DashboardReward>
      </v-col>
    </v-row>
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
import DashboardReward from '../components/DashboardReward';
import DashboardTrends from '../components/DashboardTrends';
import DashboardPrice from '../components/DashboardPrice';
import DashboardTokenFAQ from '../components/DashboardTokenFAQ';
import DashboardNodes from '../components/DashboardNodes';
import DashboardActivity from '../components/DashboardActivity';

export default {
  components: {
    DashboardReward,
    DashboardNodes,
    DashboardTrends,
    DashboardPrice,
    DashboardActivity,
    DashboardTokenFAQ
  },
  data() {
    return {};
  }
};
</script>

<style scoped lang="scss">
.header-title {
  margin: 1.5rem 0;
  .title-detailed {
    font-size: 14px;
    color: #868e9e;
  }
}
.dashboard {
  padding-left: 40px;
  padding-right: 40px;
}
@media screen and (max-width: 900px) {
  .dashboard {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
