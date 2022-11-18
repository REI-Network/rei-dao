<template>
  <v-container class="dashboard stake_background">
    <div class="header-title">
      <div class="title-detailed">
        <span @click="routeLink()" class="font-grey">Assets</span> / <span class="rei-fans">{{ this.nodeName }}</span>
      </div>
    </div>
    <MyAccountWalletInfo></MyAccountWalletInfo>
  </v-container>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Web3 from 'web3';
import MyAccountWalletInfo from '../components/MyAccountWalletInfo';
import find from 'lodash/find';

export default {
  name: 'AssetsInfo',
  components:{
    MyAccountWalletInfo
  },
  data() {
    return {
      detail:'',
      nodeName:this.$route.query.id
    };
  },
  mounted(){
    this.getData();
  },

  methods:{
    routeLink(){
      this.$router.back()
    },
    getData(){

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
        font-size: 16px;
        cursor: pointer;
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
