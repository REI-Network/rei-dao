<template>
  <v-container class="dashboard stake_background">
     <div class="header-title">
      <h1>Bridge</h1>
      
    </div>
    <BridgeAsset></BridgeAsset>
    
  </v-container>
</template>

<script>
import BridgeAsset from '../components/BridgeAsset';

export default { 
  components:{
   BridgeAsset,
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
