<template>
  <v-container class="dashboard stake_background">
     <div class="header-title">
      <h1>Bridges Asset Management</h1>
      <div class="title-detailed">Easier Management of Bridge Assets on REI Network</div>
    </div>
    <BridgeUser></BridgeUser>
  </v-container>
</template>

<script>
import BridgeUser from '../components/BridgeUser';

export default { 
  components:{
   BridgeUser,
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
.dashboard{
  padding-left:40px;
  padding-right:40px;
}
@media screen and (max-width: 900px) {
  .dashboard{
    padding-left:20px;
    padding-right:20px;
  }
}
</style>
