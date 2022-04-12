<template>
  <v-container class="myAccount stake_background">
     <div class="header-title">
      <h1>Governance</h1>
      <div class="title-detailed">The REI Token Enables Community Ownership,Join And Start Participating in Governance.</div>
    </div>
          <GovernanceIntroduction></GovernanceIntroduction>
          <GovernanceProposal></GovernanceProposal>
  </v-container>
</template>
<script>
import GovernanceIntroduction from '../components/GovernanceIntroduction';
import GovernanceProposal from '../components/GovernanceProposal';
import { mapGetters } from 'vuex';
// import MyAccountProposals from '../components/MyAccountProposals';

export default {
  components:{
    GovernanceIntroduction,
    GovernanceProposal
  },
  data() {
    return {
  
    };
  },
  computed: {
    ...mapGetters({
      connection: 'connection',
    }),
  },
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
.myAccount{
  padding-left:40px;
  padding-right:40px;
}
@media screen and (max-width: 900px) {
  .myAccount{
    padding-left:20px;
    padding-right:20px;
  }
}
</style>
