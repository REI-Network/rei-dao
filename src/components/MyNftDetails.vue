<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="12" sm="4">
        <v-card class="nft-dialog">
          <video v-if="!imageShow" controls preload="meta" class="video-play" :src="this.badgeNFTImg" :poster="poster"></video>
          <v-img v-else :src="this.badgeNFTImg" lazy-src="../assets/images/logo_bg.png" />
        </v-card>
      </v-col>
      <v-col cols="12" sm="8" class="right-content">
        <v-row no-gutters justify="space-between">
          <div class="rei-dao" v-if="standard=='ERC-1155'">REI DAO<v-icon size="14" class="star" color="orange">mdi-star</v-icon></div>
        </v-row>
        <div class="genesis">{{ nftName }}</div>
        <v-row class="ownersWrap">
          <div class="owners" v-if="standard=='ERC-1155'">
            <v-img src="../assets/images/total.png" width="17" height="17" />
            <span> &nbsp;&nbsp;{{ totalSupply }} total</span>
          </div>
        </v-row>
        <v-card class="about-genesis" style="margin-top: 10px">
          <div class="title">{{nftName}}</div>
          <div class="content">{{ this.description }}</div>
        </v-card>
        <v-card class="about-genesis" background-color="" style="margin-top: 20px">
          <div class="title">Details</div>
          <v-row>
            <v-col cols="12" sm="6" class="details-right">
              <v-row justify="space-between" no-gutters class="detail">
            <div class="font-grey">Contract address</div>
            <a :href="`https://scan.rei.network/address/${nftConfig}`" target="_blank">
              <div class="right-content">{{ nftConfig | addr }}</div></a
            >
          </v-row>
          <v-row justify="space-between" no-gutters class="detail">
            <div class="font-grey">Token standard</div>
            <div class="right-content">{{ standard }}</div>
          </v-row>
            </v-col>
            <v-col cols="12" sm="6">
              <v-row justify="space-between" no-gutters class="detail">
            <div class="font-grey">Metadate</div>
            <a :href="url" target="_blank"><div class="right-content">IPFS</div></a>
          </v-row>
          <v-row justify="space-between" no-gutters class="detail">
            <div class="font-grey">BlockChain</div>
            <div class="right-content">REI Network</div>
          </v-row>
            </v-col>
          </v-row>
        </v-card>
        <v-card class="about-genesis" :class="dark ? 'bg-dark' : 'bg-light'" v-if="standard=='ERC-721'" style="margin-top: 20px">
          <div class="title">Trait</div>
          <v-row justify="space-between" >
            <template >
              <v-col cols="4" sm="4" v-for="(item, i) in attributes" :key="i" >
                <div class="trait-wrap">
                  <div class="nft-subtitle-2"> {{item.trait_type}} </div>
                  <div class="nft-subtitle"> {{item.value}} </div>
                </div>
              </v-col>
            </template>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="wallet-table" v-if="standard=='ERC-1155'">
      <v-row justify="space-between">
        <v-col>
          <span class="title">All Holders</span>
        </v-col>
      </v-row>
      <v-data-table :headers="headers" :items="holderList" class="elevation-0" hide-default-footer :items-per-page="itemsPerPage" :loading="getListLoading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="page" @page-count="pageCount = $event">
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
      <div class="text-center pt-2" v-if="holderList.length > 0">
        <v-pagination v-model="page" :length="pageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
      </div>
    </v-card>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Web3 from 'web3';
import abiBadgesNFT from '../abis/abiBadgesNFT';
import abiERC721 from '../abis/abiERC721';
import { mapActions, mapGetters } from 'vuex';
import filters from '../filters';
import AddressTag from '../components/AddressTag';
import { getNftHolder } from '../service/CommonService'
import find from 'lodash/find';

export default {
  components: {
    AddressTag
  },
  filters,
  data() {
    return {
      poster: require('../assets/images/Genesis.png'),
      page: 1,
      pageCount: 1,
      itemsPerPage:20,
      pageSize: 6,
      loading: false,
      badgeNFTDialog: false,
      badgeNFTBalance: '',
      badgeNFTImg: 'bafkreigguc4dlfohzo6upgyiewvfwb5pmbaostgecuceje4corvp3e5m4e',
      pageVisible: 7,
      totalPage: 0,
      description: '',
      nftConfig: this.$route.params.address,
      tokenId: this.$route.params.tokenid,
      totalSupply: 0,
      nftList: [],
      nftName: '',
      symbol:'',
      standard: '',
      imageShow: true,
      url: '',
      getListLoading: false,
      attributes:[],
      headers: [
        { text: 'Address', value: 'address' },
        { text: 'Amount', value: 'balance' }
      ],
      holderList: []
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
  },
  computed: {
    ...mapGetters({
      connection: 'connection',
      apiUrl: 'apiUrl',
      dark: 'dark',
      nftInfo: 'nftInfo'
    })
  },
  methods: {
    ...mapActions({
      addTx: 'addTx'
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
      this.standard = this.$route.params.standard?this.$route.params.standard.toUpperCase():'';

      if(this.$route.params.standard == 'erc-721'){
          let contract = new web3.eth.Contract(abiERC721, this.nftConfig);
          let tokenInfo = await contract.methods.tokenURI(this.$route.params.tokenid).call();
          this.symbol = await contract.methods.symbol().call();

          this.url = tokenInfo
          
            const { data } = await this.$axios.get(this.url);
            this.imageShow = false;
            if (/(jpg|jpeg|png|GIF|JPG|PNG)$/.test(data.image)) {
              this.imageShow = true;
            }
            this.nftName = data.name;
            this.badgeNFTImg = this.$IpfsGateway(data.image);
            this.description = data.description;
            this.attributes = data.attributes;
            this.standard = this.$route.params.standard?this.$route.params.standard.toUpperCase():'';
          this.loading = false;
      } else {
        if(this.nftInfo.length>0){
          let info = find(this.nftInfo,(item)=> 
            web3.utils.toChecksumAddress(item.address) == web3.utils.toChecksumAddress(this.nftConfig) && item.tokenId == this.tokenId
            
            )
          this.url = info.url;
          this.totalSupply = info.totalSupply;
          this.nftName = info.name;
          this.badgeNFTImg = info.image;
          this.imageShow = info.imageShow;
          this.description = info.description;
          this.loading = false;
        } else {
          let contract = new web3.eth.Contract(abiBadgesNFT, this.nftConfig);
          this.badgeNFTBalance = await contract.methods.balanceOf(this.connection.address, this.tokenId).call();
          this.url = await contract.methods.uri(this.tokenId).call();
          this.totalSupply = await contract.methods.totalSupply(this.tokenId).call();
          this.standard = this.$route.params.standard?this.$route.params.standard.toUpperCase():'';

          // if (this.badgeNFTBalance > 0) {
            const { data } = await this.$axios.get(this.url);
            const imgdata  = await this.$axios.get(data.image);
            this.imageShow = false;
            if (/(jpg|jpeg|png|GIF|JPG|PNG)$/.test(imgdata.headers['content-type'])) {
              this.imageShow = true;
            }
            this.nftName = data.name;
            this.badgeNFTImg = data.image;
            this.description = data.description;
          // }
          this.loading = false;
        }
        this.getHolderList();
      }
    },
    async getHolderList() {
      let params = {
        contract: this.$route.params.address,
        tokenId: this.$route.params.tokenid,
      }
      this.getListLoading = true;
      const { data: holderList } = await getNftHolder(params);
      this.holderList = holderList;
      this.getListLoading = false;
    },
    routeLink() {
      this.$router.back();
    },
    routeLinkAccount(){
      this.$router.push('/myAccount')
    }
  }
};
</script>

<style scoped lang="scss">
.badges-nft {
  padding: 28px 0 28px 0;
  margin-bottom: 28px;
  margin-top: -28px;
  max-width: 100% !important;
}
.back-linear{
  background: linear-gradient(180deg, #d6e3ff 0%, #ffffff 50%);
}
.theme--light.sub-title {
  color: #000;
}
.theme--dark.sub-title {
  color: #fff;
}
.nft-header {
  margin: 20px;
  .title {
    font-weight: 500;
  }
  .wallet-icon {
    margin: 0 8px;
  }
}
.font-grey {
  font-size: 14px;
  color: #868e9e;
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
.back-voting {
  color: #868e9e !important;
  font-size: 16px;
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
.trait-wrap{
  background-color:#f5f5f7;
  border-radius: 4px;
  padding: 15px 20px;
}
.bg-dark .trait-wrap{
  background-color:#252243;
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

.nft-dialog {
  padding: 20px 28px;
  margin-left: 40px;
  margin-right: 20px;
  width: 100%;
  .video-play {
    width: 100%;
  }
}
.right-content{
  padding-left:60px;
  .rei-dao{
    color: #868e9e;
  }
}
.about-genesis {
  padding: 12px 20px;
  margin: 40px 40px 0 0;
}
.genesis {
  font-size: 26px;
  font-weight: bold;
}
.ownersWrap{
  min-height: 1.5rem;
}
.owners {
  display: flex;
  align-items: center;
  margin: 15px 20px 20px 10px;
  color: #868e9e;
}
.title {
  font-size: 20px;
  // color: #121C32;
}
.nft-subtitle-2{
  font-size: 1rem;
  color: #858ea0;
}
.nft-subtitle{
  font-size: 1.2rem;
  line-height: 180%;
  font-weight: bold;
}
.content {
  color: #858ea0;
  font-size: 14px;
  line-height: 26px;
}
.detail {
  margin: 10px 0;
}
.details-right{
  // border-right: 1px #858ea0 solid;
}
.font-grey {
  color: #858ea0;
  font-size: 14px;
}
.right-content {
  font-size: 14px;
  // color: #000;
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
.asset-logo {
  margin: 0 12px;
}
@media screen and (max-width: 900px) {
  .theme--light.nftList {
    width: 100%;
  }
  .rei-genesis {
    flex: 0 0 auto !important;
    max-width: 100% !important;
  }
  .nft-dialog{
    margin-left: 10px;
    width:94% !important;
  }
  .right-content{
    padding-left: 24px;
  }
  .about-genesis{
    margin-right:12px !important;
  }
  .video-play {
    width: 100% !important;
  }
}
</style>
