<template>
  <v-container :class="dark?'badges-nft dashboard':'badges-nft back-linear dashboard'">
    <div class="header-title">
      <div class="title-detailed">
        <span><a class="back-voting" @click="routeLinkAsset()">Assets / </a></span><span v-if="symbol"><a class="back-voting" @click="routeLink()">{{symbol}}</a> / </span> <span class="rei-fans">{{ nodeName }}</span>
      </div>
    </div>
    <MyNftDetails></MyNftDetails>
  </v-container>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Web3 from 'web3';
import MyNftDetails from '../components/MyNftDetails';
import { mapGetters } from 'vuex';
import find from 'lodash/find';

export default {
  name: 'AssetsInfo',
  components:{
    MyNftDetails
  },
  data() {
    return {
      detail:'',
      nodeName:this.$route.query.name,
      symbol:this.$route.query.symbol,
    };
  },
   computed: {
    ...mapGetters({
      dark: 'dark',
    })
  },
  mounted(){
  },

  methods:{
    routeLinkAsset(){
      this.$router.push('/asset')
    },
    routeLink(){
        this.$router.back();
    },
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
.badges-nft {
  padding: 28px 0 28px 0;
  margin-bottom: 28px;
  margin-top: -28px;
  max-width: 100% !important;
}
.back-linear{
  background: linear-gradient(180deg, #d6e3ff 0%, #ffffff 50%);
}
.dashboard{
  padding-left:40px;
  padding-right:40px;
}
.back-voting{
  color: #868E9E ;
  font-size: 16px;
}
a:hover{
    color: #6979f8;
}
@media screen and (max-width: 900px) {
  .dashboard{
    padding-left:20px;
    padding-right:20px;
  }
}
</style>
