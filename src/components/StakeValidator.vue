<template>
  <v-container class="dashboard stake_background">
     <div class="header-title">
      <div class="title-detailed"><span><a class="back-voting" @click="routeLink()">Voting</a></span> / <span class="rei-fans" >{{nodeName}}</span></div>
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
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Web3 from 'web3';
import StakeValidatorInfo from '../components/StakeValidatorInfo';
import StakeValidatorList from '../components/StakeValidatorList';
import { getValidatorDetails } from '../service/CommonService';
import find from 'lodash/find';

export default {
  name: 'StakeValidator',
  components:{
    StakeValidatorInfo,
    StakeValidatorList
  },
  data() {
    return {
      detail:'',
      nodeName:this.$route.query.id
    };
  },
  mounted(){
    this.getNodeName();
  },

  methods:{
    routeLink(){
      this.$router.back()
    },
    async getNodeName(){
      let validatorDetails = await getValidatorDetails();
      let address = this.$route.query.id;
      let validatorInfo = validatorDetails.data.data
      this.detail = find(validatorInfo, (item) => web3.utils.toChecksumAddress(item.nodeAddress) == web3.utils.toChecksumAddress(address));
      this.nodeName = this.detail.nodeName
      if(!detail){
        this.nodeName = this.$route.query.id;
      }
    }
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
.back-voting{
  color: #868E9E !important;
  font-size: 16px;
}
@media screen and (max-width: 900px) {
  .dashboard{
    padding-left:20px;
    padding-right:20px;
  }
}
</style>
