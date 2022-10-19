<template>
  <v-container :class="dark?'badges-nft':'badges-nft back-linear'">
     <div class="header-title">
      <div class="title-detailed">
        <span><a class="back-link" @click="routeLink()">NFTs</a></span> / <span class="link-title">{{token.symbol}}</span>
      </div>
      <v-row class="nft-collect-wrap">
        <v-col cols="1" sm="1">
          <v-card class="">
            <v-img :src="$IpfsGateway(token.image)" />
          </v-card>
        </v-col>
        <v-col cols="6" sm="6">
          <div class="genesis">{{token.symbol}}</div>
          <div> {{token.description}}</div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="4" sm="4" class="right-content">
          <v-card class="nft-collect-right">
            <v-row no-gutters justify="space-between" >
              <v-col cols="4" sm="4">
                <div> Holder </div>
                <div> 123 </div>
              </v-col>
              <v-col cols="4" sm="4">
                <div> Total supply </div>
                <div> {{token.totalSupply}} </div>
              </v-col>
              <v-col cols="4" sm="4">
                <div> Network </div>
                <div> REI Network </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-tabs v-model="tab1" align-with-title :class="dark ? 'tab-dark' : 'tab-light'" background-color="background">
        <v-tab key="11">Mine</v-tab>
        <v-tab key="12">All Holders</v-tab>
      </v-tabs>
    <v-tabs-items v-model="tab1">
      <v-tab-item key="11">
        <v-card class="collect-content">
          <v-row justify="space-between" class="nft-header">
            <v-col class="nft-title">
              <span class="title">{{token.balance}}NFTs</span>
            </v-col>
            <v-col style="text-align: right">
              
            </v-col>
          </v-row>
          <v-row justify="start" no-gutters style="padding: 0 4px">
            <v-data-iterator :items="nftList" :page.sync="page" @page-count="pageCount = $event" :items-per-page.sync="itemsPerPage" hide-default-footer :loading="loading" :loading-text="$t('msg.loading')" :class="this.nftList.length !== 0 ? 'data-list' : 'data-nft'">
              <template v-slot:item="{ item }">
                <v-col cols="6" md="4" class="rei-genesis">
                  <v-card outlined class="nftList" @click="openNftInfo(item)">
                    <video v-if="!item.imageShow" controls preload="meta" :src="$IpfsGateway(item.image)" :poster="poster" style="width: 100%"></video>
                    <v-img v-else :src="$IpfsGateway(item.image)" />
                    <div class="nft-text">
                      <div style="font-size: 18px">{{ item.name }}</div>
                    </div>
                  </v-card>
                </v-col>
              </template>
            </v-data-iterator>
          </v-row>
          <div class="pagination" v-if="nftList.length > 6">
            <v-pagination v-model="page" :length="pageCount" total-visible="7" color="vote_button"></v-pagination>
          </div>
        </v-card>
      </v-tab-item>
      <v-tab-item key="12">
        <v-card class="wallet-table">
          <v-row justify="space-between">
            <v-col>
              <span class="title">All Holders</span>
            </v-col>
          </v-row>
          <v-data-table :headers="headers" :items="holderList" class="elevation-0" hide-default-footer :items-per-page="itemsPerPage2" :loading="getListLoading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="page2" @page-count="pageCount2 = $event">
            <template v-slot:item.address="{ item }">
              <v-row align="center">
                <div class="asset-logo">
                  <v-img src="../assets/images/rei.svg" width="30" height="30"></v-img>
                </div>
                <Address :val="item.address"></Address>
              </v-row>
            </template>
            <template v-slot:item.balance="{ item }">
              <span>{{ item.balance }}</span>
            </template>
          </v-data-table>
          <div class="text-center pt-2" v-if="holderList.length > 0">
            <v-pagination v-model="page2" :length="pageCount2" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
          </div>
        </v-card>
      </v-tab-item>

    </v-tabs-items>
    
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Web3 from 'web3';
import abiBadgesNFT from '../abis/abiBadgesNFT';
import abiERC721 from '../abis/abiERC721';
import { mapActions, mapGetters } from 'vuex';
import { getNftHolder } from '../service/CommonService'
import filters from '../filters';
import Address from '../components/Address';

export default {
  components: {
    Address
  },
  filters,
  data() {
    return {
      poster: require('../assets/images/Genesis.png'),
      page: 1,
      pageCount: 1,
      itemsPerPage: 6,
      pageSize: 6,
      loading: false,
      badgeNFTDialog: false,
      badgeNFTBalance: '',
      badgeNFTImg: '',
      pageVisible: 7,
      totalPage: 0,
      description: '',
      nftName: '',
      nftConfig: '',
      totalSupply: 0,
      nftList: [],
      tab1:'11',
      token:{
        balance:0,
        symbol:'',
        image: '',
        description: '',
        holder:'',
        totalSupply:''
      },
      headers: [
        { text: 'Address', value: 'address' },
        { text: 'Amount', value: 'balance' }
      ],
      holderList: [],
      page2: 1,
      pageCount2: 1,
      itemsPerPage2:20,
      pageSize2: 6,
      getListLoading: false,
    };
  },
  watch: {
    '$store.state.connection': function () {
      this.init();
    }
  },
  mounted() {
    this.connect();
    this.init();
    this.getHolderList();
  },
  computed: {
    ...mapGetters({
      connection: 'connection',
      apiUrl: 'apiUrl',
      dark: 'dark'
    })
  },
  methods: {
    ...mapActions({
      addTx: 'addTx',
      setNftInfo: 'setNftInfo'
    }),
    connect() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      }
    },
    async init() {
      this.loading = true;
      this.nftList = [];

      let _myAddress = this.connection.address;
      let contract2 = new web3.eth.Contract(abiERC721, this.$route.query.address);
      this.token.totalSupply = await contract2.methods.totalSupply().call();
      this.token.symbol = await contract2.methods.symbol().call();

      let _balance = await contract2.methods.balanceOf(_myAddress).call();
      this.token.balance = _balance;

      if(_balance>0){
        for(let i = 0; i < _balance; i++){
          let token = await contract2.methods.tokenOfOwnerByIndex(_myAddress,i).call();
          let tokenUrl = await contract2.methods.tokenURI(token).call();

          let imageShow = false;
          const { data } = await this.$axios.get(tokenUrl);
          if(i==0){
            console.log(data)
            this.token.description = data.description;
            this.token.image = data.image;
          }
          if (/(jpg|jpeg|png|GIF|JPG|PNG)$/.test(data.image)) {
            imageShow = true;
          }
          let address = this.$route.query.address;
          let nftDetail = {
            name: data.name,
            image: data.image,
            tokenid: token,
            address,
            imageShow
          }
          this.nftList.push(nftDetail);
        }
        
      }
        //this.setNftInfo({nftInfo: this.nftList})
      this.loading = false;
    },

    openNftInfo(item) {
      // this.badgeNFTDialog = true;
      this.$router.push({
        name: 'NftDetails',
        query: {
          id: item.address,
          tokenid: item.tokenid,
          standard: 'erc-721'
        }
      });
    },
    async getHolderList() {
      let params = {
        contract: this.$route.query.address
      }
      this.getListLoading = true;
      const { data: holderList } = await getNftHolder(params);
      this.holderList = holderList;
      this.getListLoading = false;
    },
    openNftHelp(){
      this.nftHelpDialog = true;
    },
    cancelNftHelp(){
      this.nftHelpDialog = false;
    },
    routeLink() {
      this.$router.back();
    }
  }
};
</script>

<style scoped lang="scss">
.container{
 max-width:100% !important;
}
.badges-nft {
  padding: 28px 0 28px 0;
  margin-bottom: 28px;
  margin-top: -28px;
  max-width: 100% !important;
}
.collect-content{
  margin:0 28px;
  padding:0 28px;
  margin-bottom: 28px;
  margin-top: -28px;
  max-width: 100% !important;
}
.theme--light.sub-title {
  color: #000;
}
.theme--dark.sub-title {
  color: #fff;
}
.nft-header {
  margin:20px 20px 0 20px;
  .title {
    font-weight: 500;
  }
  .wallet-icon {
    margin: 0 8px;
  }
}
.header-title {
  margin: 1.5rem 2.2rem;
  .title-detailed {
    font-size: 24px;
  }
  .rei-fans {
    font-weight: bolder;
  }
}
.back-link {
  color: #868e9e !important;
  font-size: 16px;
}
.font-grey {
  font-size: 14px;
  color: #868e9e;
}
.data-nft {
  display: flex;
  width: 99%;
  justify-content: center;
  flex-wrap: wrap;
  color: #868e9e;
  margin-bottom: 28px;
}
.data-list {
  display: flex;
  width: 100%;
  // justify-content: space-between;
  flex-wrap: wrap;
}
.theme--light.nftList {
  // width: 31%;
  background-color: #f7f8ff;
  border: none;
  margin: 12px 0;
  padding: 0px;
  border-radius: 5px;
}
.theme--dark.nftList {
  // width: 31%;
  background-color: #13112b;
  border: none;
  margin-top: 28px;
  padding: 0px;
  border-radius: 5px;
}
.nft-text {
  padding: 20px 12px;
  .rei-text {
    color: #868e9e;
    vertical-align: middle;
    margin-bottom: 6px;
  }
}
.star {
  margin: 0 0 4px 4px;
}
.pagination {
  padding: 0 24px 24px 0;
}
a:hover {
  text-decoration: underline;
  color: #289eff;
}
.nft-collect-wrap{
  padding:20px 0
}
.nft-collect-right{
  background-color: #fff;
  padding: 28px;
}
.wallet-table {
  padding: 40px;
  margin: 40px;
  .title {
    font-weight: 500;
  }
  .wallet-icon {
    margin: 0 8px;
  }
}

.nft-title{
  padding-left:0;
  padding-bottom:0;
}
.nft-dialog {
  padding: 25px;
  .genesis {
    font-size: 26px;
    font-weight: bold;
  }
  .video-play {
    width: 460px;
  }
  .owners {
    display: flex;
    align-items: center;
    margin: 20px 20px 20px 10px;
    color: #868e9e;
  }
  .theme--light.about-genesis {
    background-color: #f7f8ff;
    border: none;
    border-radius: 6px;
    padding: 15px 20px;
  }
  .theme--dark.about-genesis {
    background-color: #4c4a68;
    border: none;
    border-radius: 6px;
    padding: 15px 20px;
  }
  .title {
    font-size: 20px;
    // color: #121C32;
  }
  .content {
    color: #858ea0;
    font-size: 14px;
    line-height: 20px;
    margin-top: 10px;
  }
  .detail {
    margin: 8px 0;
  }
  .font-grey {
    color: #858ea0;
    font-size: 14px;
  }
  .right-content {
    font-size: 14px;
    // color: #000;
  }
}
.dialog-nft-help {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .dialog-title {
    // margin-left: 12px;
  }
  .close-btn {
    margin-right: 16px;
    padding: 0;
    background-color: transparent;
    cursor: pointer;
  }
}
@media screen and (max-width: 900px) {
  .theme--light.nftList {
    width: 100%;
  }
  .rei-genesis {
    flex: 0 0 auto !important;
    max-width: 100% !important;
  }
  .video-play {
    width: 100% !important;
  }
}
</style>
