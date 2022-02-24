<template>
  <v-container class="stake_background">
     <div class="header-title">
      <h3>My Account</h3>
      <div class="title-detailed">REI.DAO</div>
    </div>
    <v-row>
      <v-col>
          <MyAccountBalance></MyAccountBalance>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <MyAccountCrude></MyAccountCrude>
      </v-col>
    </v-row>
    <!-- <v-row>
      <v-col>
        <MyAccountProposals></MyAccountProposals>
      </v-col>
    </v-row> -->
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import MyAccountBalance from '../components/MyAccountBalance';
import MyAccountCrude from '../components/MyAccountCrude';
// import MyAccountProposals from '../components/MyAccountProposals';

export default {
  components:{
    MyAccountBalance,
    MyAccountCrude,
    // MyAccountProposals
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
    }
}
</style>
