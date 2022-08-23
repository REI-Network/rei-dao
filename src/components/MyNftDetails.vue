<template>
  <v-container class="badges-nft">
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
        <v-card class="nft-dialog">
          <v-row>
            <v-col cols="12" sm="6">
              <!-- <v-img  :src="this.badgeNFTImg"/> -->
              <video controls preload="meta" class="video-play" :src="this.badgeNFTImg" :poster="poster"></video>
            </v-col>
            <v-col cols="12" sm="6">
              <v-row no-gutters justify="space-between">
                <div>REI DAO<v-icon size="14" class="star" color="orange">mdi-star</v-icon></div>
                <v-icon size="22" @click="cancelProposal()">mdi-close</v-icon>
              </v-row>
              <div class="genesis">{{ this.nftName }}</div>
              <v-row>
                <!-- <div class="owners">
                                <v-img src="../assets/images/owners.png" width="17" height="17" />
                                <span> 150 owners</span>
                            </div> -->
                <div class="owners">
                  <v-img src="../assets/images/total.png" width="17" height="17" />
                  <span> &nbsp;&nbsp;{{ totalSupply }} total</span>
                </div>
              </v-row>
              <v-card outlined class="about-genesis">
                <div class="title">About Genesis Proposal Badges NFT</div>
                <div class="content">{{ this.description }}</div>
              </v-card>
              <v-card outlined class="about-genesis" background-color="" style="margin-top: 20px">
                <div class="title">Details</div>
                <v-row justify="space-between" no-gutters class="detail">
                  <div class="font-grey">Contract address</div>
                  <a :href="`https://scan.rei.network/address/${nftConfig}`" target="_blank">
                    <div class="right-content">{{ nftConfig | addr }}</div></a
                  >
                </v-row>
                <!-- <v-row justify="space-between" no-gutters class="detail">
                                <div class="font-grey">Token ID</div>
                                <div class="right-content">436133...3123</div>
                            </v-row> -->
                <v-row justify="space-between" no-gutters class="detail">
                  <div class="font-grey">Token standard</div>
                  <div class="right-content">ERC-1155</div>
                </v-row>
                <v-row justify="space-between" no-gutters class="detail">
                  <div class="font-grey">Metadate</div>
                  <a :href="url" target="_blank"><div class="right-content">IPFS</div></a>
                </v-row>
                <v-row justify="space-between" no-gutters class="detail">
                  <div class="font-grey">BlockChain</div>
                  <div class="right-content">REI Network</div>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
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
      url: ''
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
      apiUrl: 'apiUrl'
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
      if (this.connection.network == 'REI Testnet' || this.connection.network == 'REI Devnet') {
        this.nftConfig = nft_contract_test;
      } else {
        this.nftConfig = nft_contract_prod;
      }
      let contract = new web3.eth.Contract(abiBadgesNFT, this.nftConfig);
      this.badgeNFTBalance = await contract.methods.balanceOf(this.connection.address, 0).call();
      if (this.badgeNFTBalance > 0) {
        this.url = await contract.methods.uri(0).call();
        this.totalSupply = await contract.methods.totalSupply(0).call();
        const { data } = await this.$axios.get(this.url);
        this.nftName = data.name;
        this.badgeNFTImg = data.image;
        this.description = data.description;
        this.nftList = [];
        this.nftList.push(data);
      }
      this.loading = false;
    },
  }
};
</script>

<style scoped lang="scss">
.badges-nft {
  padding: 0 0 28px 0;
  margin-bottom: 28px;
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
