<template>
  <v-container style="padding-left:40px;padding-right:40px;" class="stake_background">
     <div class="header-title">
      <h1>My Account</h1>
      <div class="title-detailed">Get More Information About Your Personal Account,About Balances,Voting,Etc.</div>
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
      color: #868E9E;
    }
}
</style>
