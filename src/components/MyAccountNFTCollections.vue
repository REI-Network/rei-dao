<template>
  <v-container class="badges-nft">
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <v-card>
      <v-row justify="space-between" class="nft-header">
        <v-col class="nft-title">
          <span class="title">My NFTs</span>
        </v-col>
        <v-col style="text-align: right">
          
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
    <v-dialog v-model="nftHelpDialog" width="750" class="dialog-card">
      <v-card :class="dark ? 'dialog-night' : 'dialog-daytime'">
        <div class="dialog-nft-help">
          <v-card-title class="dialog-title">Currently NFTs included</v-card-title>
          <div @click="cancelNftHelp" class="close-btn"><v-icon>mdi-close</v-icon></div>
        </div>
        <v-list rounded class="ma-dialog start_unstake">
          <v-data-iterator :items="prodConfigList"  hide-default-footer class="data-list">
          <template v-slot:item="{ item }">
            <v-col cols="6" md="4" class="rei-genesis">
              <v-card outlined class="nftList">
                <v-img :src="$IpfsGateway(item.image)" />
                <div class="nft-text">
                  <div class="rei-text">{{ item.organization }}<v-icon size="10" class="star" color="orange">mdi-star</v-icon></div>
                  <div style="font-size: 14px">{{ item.name }}</div>
                </div>
              </v-card>
            </v-col>
          </template>
        </v-data-iterator>
        </v-list>
      </v-card>
    </v-dialog>
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
      nftHelpDialog:false,
      testConfigList: [
        {
          "address": '0xe917cd524261D27dbF7d629C86eDAC8fd7b7885d',
          "image":"bafkreiccsx2nsqufbopovi6y7dkhmxign46hjqbnhtryvrfvvm7pps7o4u",
          "name":"Genesis Proposal Badges NFT",
          "organization":"REI DAO"
        },
      ],
      prodConfigList: [
        {
          "address": '0x4035374c2c157F46effeA16e71A62b8992F2AD1b',
          "image":"bafkreiccsx2nsqufbopovi6y7dkhmxign46hjqbnhtryvrfvvm7pps7o4u",
          "name":"Genesis Proposal Badges NFT",
          "organization":"REI DAO",
          "token_standard": "ERC-1155"
        },
        {
          "address": '0x479a57Bb8Dd14FCa3Beeb63825126ebE16f2Ff2d',
          "image":"bafkreih6tkghnjtb3mdemvemr4t6htzhxckuq3aizmebuw6b6adhncz4ga",
          "name":"Korean Community NFT",
          "organization":"REI DAO",
          "token_standard": "ERC-1155"
        },
        {
          "address": '0x490b641A3B87c3C769E24e850163E9aAb23b4E8B',
          "image":"bafkreibzg4wuxoke3lcepdtwqq2y55aprzvtbw6qwntrsf2yvq73iy3gee",
          "name":"ReiFans NFT",
          "organization":"REI DAO",
          "token_standard": "ERC-1155"
        },
        {
          "address": '0xE4EDC855717281b994A6E2E43c98791dBCE497DA',
          "image":"bafkreibzg4wuxoke3lcepdtwqq2y55aprzvtbw6qwntrsf2yvq73iy3gee",
          "name":"beeHive NFT",
          "organization":"beeHive",
          "token_standard": "ERC-721"
        }
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

      let contract2 = new web3.eth.Contract(abiERC721, this.$route.query.address);
      let _balance = await contract2.methods.balanceOf(this.connection.address).call();
      if(_balance>0){
        for(let i = 0; i < _balance; i++){
          let token = await contract2.methods.tokenOfOwnerByIndex(this.connection.address,i).call();
          let tokenInfo = await contract2.methods.tokenURI(token).call();

          console.log('token',token)
          console.log('_balance',_balance);
          console.log('tokenInfo',tokenInfo)

          let imageShow = false;
          const { data } = await this.$axios.get(tokenInfo);
          if (/(jpg|jpeg|png|GIF|JPG|PNG)$/.test(data.image)) {
            imageShow = true;
          }
          let address = this.$route.query.address;
          let nftDetail = {
            name: data.name,
            image: this.$IpfsGateway(data.image),
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
    openNftHelp(){
      this.nftHelpDialog = true;
    },
    cancelNftHelp(){
      this.nftHelpDialog = false;
    }
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
