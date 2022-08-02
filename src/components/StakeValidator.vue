<template>
  <v-container class="dashboard stake_background">
     <div class="header-title">
      <div class="title-detailed"><span class="font-grey"><a href="/stake">Voting</a></span> / <span class="rei-fans">REI FANs</span></div>
    </div>
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-card class="flex-column mt-2">
           <StakeValidatorInfo></StakeValidatorInfo>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-card class="flex-column mt-2">
           <StakeValidatorList></StakeValidatorList>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import StakeValidatorInfo from '../components/StakeValidatorInfo';
import StakeValidatorList from '../components/StakeValidatorList';

export default { 
  components:{
    StakeValidatorInfo,
    StakeValidatorList
  },
  data() {
    return {
    };
  },
  mounted(){
  },

  methods:{
  }
};
</script>

<style scoped lang="scss">
.header-title{
  margin: 1.5rem 0;
    .title-detailed{
      font-size: 24px;
    }
    .rei-fans{
        font-weight: bolder;
    }
    .font-grey{
        color: #868E9E;
    }
}
.dashboard{
  padding-left:40px;
  padding-right:40px;
}
a{
  color:#868E9E;
}
@media screen and (max-width: 900px) {
  .dashboard{
    padding-left:20px;
    padding-right:20px;
  }
}
</style>
