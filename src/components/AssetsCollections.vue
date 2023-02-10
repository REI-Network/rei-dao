<template>
  <v-container :class="dark ? 'badges-nft' : 'badges-nft back-linear'">
    <div class="header-title">
      <div class="title-detailed">
        <span><a class="back-link" @click="routeLink()">Assets</a></span> / <span class="link-title">{{ token.symbol }}</span>
      </div>
      <v-row class="nft-collect-wrap">
        <v-col>
          <v-card class="">
            <v-img :src="$IpfsGateway(token.image)" lazy-src="../assets/images/logo_bg.png" width="128" height="128"/>
          </v-card>
        </v-col>
        <v-col cols="6" sm="6">
          <div class="genesis">{{ token.symbol }}</div>
          <div>{{ token.description }}</div>
          <v-row style="margin-left:1px;margin-top:20px;" align="center">
            <span class="font-grey">Contract Address:</span>
            <a :href="`https://scan.rei.network/token/${contractAddress}`" target="_blank">
              <span class="address-link" > {{ contractAddress | addr }}</span>
            </a>
            <v-btn class="copy-btn" @click="copyAddr(contractAddress)">
              <v-icon small color="#868E9E">{{ addrCopying ? 'mdi-checkbox-marked-circle-outline' : 'mdi-content-copy' }}</v-icon>
            </v-btn>
          </v-row>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="4" sm="4" class="right-content">
          <v-card :class="dark ? 'chip-dark' : 'chip-light'" class="nft-collect-right">
            <v-row no-gutters justify="space-between">
              <v-col cols="4" sm="4">
                <div class="nft-subtitle-2">Holder</div>
                <div class="nft-subtitle">{{ holderList.length }}</div>
              </v-col>
              <v-col cols="4" sm="4">
                <div class="nft-subtitle-2">Total supply</div>
                <div class="nft-subtitle">{{ token.totalSupply }}</div>
              </v-col>
              <v-col cols="4" sm="4">
                <div class="nft-subtitle-2">Network</div>
                <div class="nft-subtitle">REI Network</div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-tabs v-model="tab1" align-with-title :class="dark ? 'tab-dark' : 'tab-light'" background-color="background">
      <v-tab key="11">All Holders</v-tab>
      <v-tab key="12">Token ID List</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab1">
      <v-tab-item key="11">
        <v-card class="wallet-table">
          <v-row justify="space-between">
            <v-col>
              <span class="title">All Holders</span>
            </v-col>
          </v-row>
          <v-data-table :headers="headers" :items="holderList" class="elevation-0" hide-default-footer :items-per-page="itemsPerPage2" :loading="getListLoading" :no-data-text="$t('msg.nodatatext')" loading-text="" :page.sync="page2" @page-count="pageCount2 = $event">
            <template v-slot:item.address="{ item }">
              <v-row align="center">
                <div class="asset-logo">
                  <v-img src="../assets/images/rei.svg" width="30" height="30"></v-img>
                </div>
                <a :class="dark ? 'link-dark' : 'link-light'" :href="`https://scan.rei.network/address/${item.address}`" target="_blank"><AddressTag :val="item.address"></AddressTag></a>

              </v-row>
            </template>
            <template v-slot:item.balance="{ item }">
              <span>{{ item.balance }}</span>
            </template>
          </v-data-table>
           <v-skeleton-loader class="skeleton" v-if="skeletonLoading == true" :loading="skeletonLoading" type="table-tbody,actions"></v-skeleton-loader>
          <div class="text-center pt-2" v-if="holderList.length > 0">
            <v-pagination v-model="page2" :length="pageCount2" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
          </div>
        </v-card>
      </v-tab-item>
      <v-tab-item key="12">
        <v-card class="id-list">
          <v-data-iterator :items="nftList" :page.sync="page" @page-count="pageCount = $event" :items-per-page.sync="itemsPerPage" hide-default-footer :loading="loading" :loading-text="$t('msg.loading')" :class="this.nftList.length !== 0 ? 'data-list' : 'data-nft'">
            <template v-slot:item="{ item }">
              <v-col cols="12" md="2" class="rei-genesis">
                <v-card outlined class="nftList" @click="openNftInfo(item)">
                  <!-- <video v-if="!item.imageShow" controls preload="meta" :src="item.image" :poster="poster" style="width: 100%"></video> -->
                  <div class="collect-img-wrap" :class="dark ? 'bg-dark' : 'bg-light'">
                    <v-img v-if="!item.image" src="../assets/images/logo_bg_small.png" lazy-src="../assets/images/logo_bg_small.png" />
                    <v-lazy v-else class="logoWrap">
                      <v-img :src="$IpfsGateway(item.image)" lazy-src="../assets/images/logo_bg_small.png" />
                    </v-lazy>
                  </div>
                  <div class="nft-text">
                    <div style="font-size: 13px">{{ item.name }}</div>
                  </div>
                </v-card>
              </v-col>
            </template>
          </v-data-iterator>
          <div class="pagination" v-if="nftList.length > 18">
            <v-pagination v-model="page" :length="pageCount" total-visible="7" color="vote_button"></v-pagination>
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
import { getNftHolder, getAssetTokenList } from '../service/CommonService';
import filters from '../filters';
import AddressTag from '../components/AddressTag';

export default {
  components: {
    AddressTag
  },
  filters,
  data() {
    return {
      poster: require('../assets/images/Genesis.png'),
      skeletonLoading:true,
      page: 1,
      pageCount: 1,
      itemsPerPage: 18,
      pageSize: 6,
      loading: false,
      badgeNFTDialog: false,
      addrCopying: false,
      badgeNFTBalance: '',
      badgeNFTImg: '',
      pageVisible: 7,
      totalPage: 0,
      description: '',
      nftName: '',
      nftConfig: '',
      totalSupply: 0,
      nftList: [],
      contractAddress:this.$route.query.address,
      imageShow: false,
      tab1: '11',
      token: {
        balance: 0,
        symbol: '',
        image: 'bafkreigguc4dlfohzo6upgyiewvfwb5pmbaostgecuceje4corvp3e5m4e',
        description: '',
        holder: '',
        totalSupply: ''
      },
      headers: [
        { text: 'Address', value: 'address' },
        { text: 'Amount', value: 'balance' }
      ],
      holderList: [],
      page2: 1,
      pageCount2: 1,
      itemsPerPage2: 20,
      pageSize2: 6,
      getListLoading: false
    };
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
      dark: 'dark',
      nftCollect: 'nftCollect'
    })
  },
  methods: {
    ...mapActions({
      addTx: 'addTx',
      setNftInfo: 'setNftInfo',
      setNftCollect: 'setNftCollect'
    }),
    connect() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.web3 = new Web3('https://rpc.rei.network');
      }
    },
    async init() {
      this.loading = true;
      let contract2 = new web3.eth.Contract(abiERC721, this.$route.query.address);
      this.token.totalSupply = await contract2.methods.totalSupply().call();
      this.token.symbol = await contract2.methods.symbol().call();
      let params = {
        id: this.$route.query.address
      };
      let tokenList = await getAssetTokenList(params);
      this.nftList = tokenList.data.data;
      for (let i = 0; i < this.nftList.length; i++) {
        this.token.description = this.nftList[0].description;
        this.token.image = this.nftList[0].image;
        if (/(jpg|jpeg|png|GIF|JPG|PNG)$/.test(this.token.image)) {
          this.imageShow = true;
        }
      }
      // console.log('nftList', this.nftList);
      this.loading = false;
    },

    openNftInfo(item) {
      // this.badgeNFTDialog = true;
      this.$router.push({
        name: 'AssetsTokenList',
        query: {
          id: this.$route.query.address,
          tokenid: item.edition,
          name: item.name,
          symbol: this.token.symbol,
          standard: 'erc-721'
        }
      });
    },
    async getHolderList() {
      let params = {
        contract: this.$route.query.address
      };
      this.getListLoading = true;
      const { data: holderList } = await getNftHolder(params);
      this.holderList = holderList;
      this.getListLoading = false
      this.skeletonLoading = false;
    },
    openNftHelp() {
      this.nftHelpDialog = true;
    },
    cancelNftHelp() {
      this.nftHelpDialog = false;
    },
    routeLink() {
      this.$router.back();
    },
    copyToClipboard(str) {
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
    },
     sleep(timestamp) {
      return new Promise((resolve) => {
        setTimeout(resolve, timestamp);
      });
    },
    async copyAddr(addr) {
      try {
        window.navigator.clipboard.writeText(addr);
        this.copyToClipboard(addr);
      } catch (ex) {
        console.log(ex);
      } finally {
        this.addrCopying = true;
        await this.sleep(500);
        this.addrCopying = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  max-width: 100% !important;
}
.address-link{
  font-size: 14px;
  color: #858ea0;
}
.address-link:hover{
  color: #6979f8 !important;
  text-decoration:underline ;
}
.badges-nft {
  padding: 28px 0 28px 0;
  margin-bottom: 28px;
  margin-top: -28px;
  max-width: 100% !important;
}
.collect-content {
  margin: 40px;
  padding: 28px;
  max-width: 100% !important;
}
.theme--light.sub-title {
  color: #000;
}
.theme--dark.sub-title {
  color: #fff;
}
.nft-header {
  margin: 0px 20px 0 20px;
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
.link-light {
  cursor: pointer;
  color: #000;
}
.link-light:hover {
  color: #6979f8;
  text-decoration: underline;
}
.link-dark:hover {
  color: #6979f8;
  text-decoration: underline;
}
.link-dark {
  cursor: pointer;
  color: #fff;
}
// .back-linear{
//   background: linear-gradient(180deg, #d6e3ff 0%, #ffffff 50%);
// }
.copy-btn.v-btn.v-btn--has-bg {
    background-color: transparent !important;
    min-width: 0 !important;
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
.collect-img-wrap {
  position: relative;
  .collect-img-number {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #f5f5f7;
    border-radius: 5px;
    padding: 0 10px;
  }
}
.bg-dark .collect-img-number {
  background-color: #252243;
}
.star {
  margin: 0 0 4px 4px;
}
.pagination {
  padding: 0 24px 24px 0;
}
a:hover {
  // text-decoration: underline;
  color: #6979f8 !important;
}
.nft-collect-wrap {
  padding: 20px 0;
}
.nft-collect-right {
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
.id-list {
  padding: 28px;
  margin: 40px;
}
.asset-logo {
  margin: 0 12px;
}
.nft-title {
  padding-left: 0;
  padding-bottom: 0;
}
.nft-subtitle-2 {
  font-size: 0.75rem;
  color: #858ea0;
}
.nft-subtitle {
  font-size: 1rem;
  line-height: 180%;
  font-weight: bold;
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
.v-tab {
  text-transform: none !important;
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
.skeleton{
  margin-top:-68px;
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
