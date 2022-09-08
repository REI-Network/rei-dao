<template>
  <v-container class="badges-nft">
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <v-card>
      <!-- <v-subheader>
        <h3 class="sub-title">My Badge NFTs</h3>
        <v-tooltip right color="start_unstake">
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" dense size="14" style="margin-left: 4px"> mdi-alert-circle-outline </v-icon>
          </template>
          <span>Get badges through participation and contributions in governance</span>
        </v-tooltip>
      </v-subheader> -->
      <v-row justify="space-between" class="nft-header">
        <v-col class="nft-title">
          <span class="title">My NFTs</span>
          <!-- <v-icon size="16" class="wallet-icon" style="margin-bottom: 6px">mdi-help-circle-outline</v-icon> -->
        </v-col>
        <v-col style="text-align: right">
          <span >
            <v-icon size="16" class="wallet-icon">mdi-arrow-up-thin-circle-outline</v-icon>
            <a class="font-grey" href="https://github.com/REI-Network/rei-token-profile" target="_blank">Submit a token support here</a>
          </span>
        </v-col>
      </v-row>
      <v-row justify="start" no-gutters style="padding: 0 4px">
        <v-data-iterator :items="nftList" :page.sync="page" @page-count="pageCount = $event" :items-per-page.sync="itemsPerPage" hide-default-footer :loading="loading" :loading-text="$t('msg.loading')" :class="this.nftList.length !== 0 ? 'data-list' : 'data-nft'">
          <template v-slot:item="{ item }">
            <v-col cols="6" md="4" class="rei-genesis">
              <v-card outlined class="nftList" @click="openNftInfo(item)">
                <video v-if="!item.imageShow" controls preload="meta" :src="item.image" :poster="poster" style="width: 100%"></video>
                <v-img v-else :src="item.image" />
                <div class="nft-text">
                  <div class="rei-text">REI DAO<v-icon size="14" class="star" color="orange">mdi-star</v-icon></div>
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
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Web3 from 'web3';
import abiBadgesNFT from '../abis/abiBadgesNFT';
import { mapActions, mapGetters } from 'vuex';
import filters from '../filters';

const nft_contract_test = '0xe917cd524261D27dbF7d629C86eDAC8fd7b7885d';
const nft_contract_prod = '0x4035374c2c157F46effeA16e71A62b8992F2AD1b';

export default {
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
      imageShow: true,
      url: '',
      testConfigList: [
        {
          address: '0xe917cd524261D27dbF7d629C86eDAC8fd7b7885d'
        },
      ],
      prodConfigList: [
        {
          address: '0x479a57Bb8Dd14FCa3Beeb63825126ebE16f2Ff2d'
        },
        {
          address: '0x490b641A3B87c3C769E24e850163E9aAb23b4E8B'
        },
        {
          address: '0x4035374c2c157F46effeA16e71A62b8992F2AD1b'
        },
      ]
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
      nftInfo: 'nftInfo'
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
      if (this.connection.network == 'REI Testnet' || this.connection.network == 'REI Devnet') {
        this.nftConfig = this.testConfigList;
      } else {
        this.nftConfig = this.prodConfigList;
      }
      this.nftList = [];
      if(this.nftInfo.length>0){
        this.nftList = this.nftInfo;
        this.loading = false;
        return;
      }
      for (let i = 0; i < this.nftConfig.length; i++) {
        let contract = new web3.eth.Contract(abiBadgesNFT, this.nftConfig[i].address);
        let addr = this.connection.address;
        for (let j = 0; ;j++){
          let flag = await contract.methods.exists(j).call();
          if(flag){
            let badgeNFTBalance = await contract.methods.balanceOf(addr, j).call();
            let url = await contract.methods.uri(j).call();
            let totalSupply = await contract.methods.totalSupply(j).call();
            if (badgeNFTBalance > 0) {
              let imageShow = false;
              const { data } = await this.$axios.get(url);
              const imgdata  = await this.$axios.get(data.image);
              if (/(jpg|jpeg|png|GIF|JPG|PNG)$/.test(imgdata.headers['content-type'])) {
                imageShow = true;
              }
              let address = this.nftConfig[i].address;
              let nftDetail = {
                ...data,
                address,
                url,
                totalSupply,
                imageShow,
                tokenId:j
              }

              for (let index = 0; index < badgeNFTBalance; index++) {
                this.nftList.push(nftDetail);
              }
            }
          } else {
            break
          }
        }
        
        this.setNftInfo({nftInfo: this.nftList})
      }
      this.loading = false;
    },

    openNftInfo(item) {
      // this.badgeNFTDialog = true;
      this.$router.push({
        name: 'NftDetails',
        query: {
          id: item.address,
          tokenid: item.tokenId
        }
      });
    },
  }
};
</script>

<style scoped lang="scss">
.container{
 max-width:100% !important;
}
.badges-nft {
  padding: 0 0 28px 0;
  margin-bottom:28px;
  margin-top:-20px;
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
