<template>
  <v-container class="stake_background" style="padding: 0">
    <!-- <div class="header-title">
      <h1>My Account</h1>
      <div class="title-detailed">Details about your account, balances, and voting</div>
    </div> -->
    <v-card :class="dark ? 'night account-header' : 'daytime account-header header-back'">
      <v-row>
        <v-col cols="12" md="7">
          <div class="left-address">
            <div>
              <!-- <v-img src="../assets/images/rei.svg" width="80" height="80"></v-img> -->
              <jazzicon class="identicon" :address="connection.address" :diameter="60"></jazzicon>
            </div>
            <div class="my-address">{{ this.connection.address | addr }}</div>
            <v-icon size="16">mdi-content-copy</v-icon>
          </div>
        </v-col>
        <v-col cols="12" md="4" class="balance">
          <div class="title">
            <div>Balance</div>
            <v-btn
              icon
              @click="getBalance()"
              color="#FFF"
            >
              <v-icon>mdi-sync</v-icon>
            </v-btn>
          </div>
          <h2>${{totalAmount | asset(5)}}</h2>
        </v-col>
      </v-row>
    </v-card>
    <v-tabs v-model="tab1" align-with-title :class="dark ? 'tab-dark' : 'tab-light'" background-color="background">
        <v-tab key="11">Portfolio</v-tab>
        <v-tab key="12">NFTs</v-tab>
        <v-tab key="13">DAOs</v-tab>
      </v-tabs>
    <v-tabs-items v-model="tab1">
      <v-row :class="dark ? 'night' : 'daytime'">
        <v-col class="myAccount">
          <v-tab-item key="11">
            <v-card class="wallet-table">
              <v-row justify="space-between">
                <v-col>
                  <span class="title">Wallet</span>
                  <v-tooltip right color="start_unstake">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="wallet-icon" v-bind="attrs" v-on="on" dense size="16" style="margin-bottom: 6px"> mdi-help-circle-outline </v-icon>
                    </template>
                    <span>Stake $REI to earn Crude as Gas</span>
                  </v-tooltip>
                  <!-- <v-icon size="16" class="wallet-icon" style="margin-bottom: 6px">mdi-help-circle-outline</v-icon> -->
                </v-col>
                <!-- <v-col style="text-align: right">
                  <v-icon size="16" class="wallet-icon">mdi-arrow-up-thin-circle-outline</v-icon>
                  <span class="font-grey">Submit a token support here</span>
                </v-col> -->
              </v-row>
              <v-data-table :headers="headers" :items="assetList" class="elevation-0" hide-default-footer :items-per-page="itemsPerPage" :loading="getListLoading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="page" @page-count="pageCount = $event">
                <template v-slot:item.assets="{ item }">
                  <v-row align="center">
                    <div class="asset-logo">
                      <v-img :src="item.logo" width="30" height="30"></v-img>
                    </div>
                    <div>{{ item.symbol }}</div>
                  </v-row>
                </template>
                <template v-slot:item.price="{ item }">
                  <span>${{ item.price | asset(5) }}</span>
                </template>
                <template v-slot:item.balance="{ item }">
                  <span>{{ item.balance | asset(4) }}</span>
                </template>
                <template v-slot:item.value="{ item }">
                  <span>${{ item.value | asset(5) }}</span>
                </template>
              </v-data-table>
              <div class="text-center pt-2" v-if="assetList.length > 10">
                <v-pagination v-model="page" :length="pageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
              </div>
            </v-card>
          </v-tab-item>
          <v-tab-item key="12">
            <v-row>
              <v-col>
                <MyAccountNFT></MyAccountNFT>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item key="13">
            <v-row>
              <v-col>
                <MyAccountBalance></MyAccountBalance>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col>
                <MyAccountCrude></MyAccountCrude>
              </v-col>
            </v-row> -->
          </v-tab-item>
        </v-col>
      </v-row>
    </v-tabs-items>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */

import Web3 from 'web3';
import abiERC20 from '../abis/abiERC20';
import MyAccountBalance from '../components/MyAccountBalance';
import MyAccountNFT from '../components/MyAccountNFT';
import { getPrice } from '../service/CommonService'
import { mapGetters } from 'vuex';
import Jazzicon from 'vue-jazzicon';
import find from 'lodash/find';

import filters from '../filters';
export default {
  components: {
    MyAccountBalance,
    MyAccountNFT,
    [Jazzicon.name]: Jazzicon
  },
  filters,
  data() {
    return {
      tab1: null,
      page: 1,
      pageCount: 0,
      itemsPerPage: 6,
      getListLoading: false,
      totalAmount:0,
      headers: [
        { text: 'Assets', value: 'assets' },
        { text: 'Price', value: 'price' },
        { text: 'Balance', value: 'balance' },
        { text: 'Value', value: 'value' }
      ],
      assetList: [
      ],
      tokenInfoList:[
        {
          decimals: "8",
          erc20Address: "0x8059E671Be1e76f8db5155bF4520f86ACfDc5561",
          logo: "https://static.rei.network/imgs/WBTC.png",
          name:"Wrapped BTC",
          symbol:"WBTC"
        },
        {
          decimals: "6",
          erc20Address: "0x988a631Caf24E14Bb77EE0f5cA881e8B5dcfceC7",
          logo: "https://static.rei.network/imgs/USDT.png",
          name:"Tether USD",
          symbol:"USDT"
        },
        {
          decimals: "6",
          erc20Address: "0x8d5E1225981359E2E09A3AB8F599A51486f53314",
          logo: "https://static.rei.network/imgs/USDC.png",
          name:"USD Coin",
          symbol:"USDC"
        },
        {
          decimals: "18",
          erc20Address: "0x7a5313468c1C1a3Afb2Cf5ec46558A7D0fc2884A",
          logo: "https://static.rei.network/imgs/WETH.png",
          name:"Wrapped Ether",
          symbol:"WETH"
        },
        {
          decimals: "18",
          erc20Address: "0x0ba85980B122353D77fBb494222a10a46E4FB1f6",
          logo: "https://static.rei.network/imgs/DAI.png",
          name:"Dai Stablecoin",
          symbol:"DAI"
        },
        {
          decimals: "18",
          erc20Address: "0x02CD448123E3Ef625D3A3Eb04A30E6ACa29C7786",
          logo: "https://static.rei.network/imgs/BUSD.png",
          name:"Binance USD",
          symbol:"BUSD"
        }
      ]
    };
  },
  watch: {
    '$store.state.connection': function() {
      if(this.connection && this.connection.network){
          this.connect();
          this.getBalance();
      }
    },
  },
  computed: {
    ...mapGetters({
      connection: 'connection',
      dark: 'dark'
    }),
    
  },
  mounted() {
    this.connect();
    this.getBalance();
  },
  methods: {
    connect() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
    },
    async getBalance(){
      let asset = [], assetArr = ['REI']
      if(!this.connection.address) return;
      this.getListLoading = true;
      let reiBalance = await web3.eth.getBalance(this.connection.address);
      asset.push({
        symbol: 'REI',
        logo: 'https://static.rei.network/media/currency_logo.png',
        balance: web3.utils.fromWei(web3.utils.toBN(reiBalance)),
        price: 0,
        value: 0
      })


      for(let i = 0; i < this.tokenInfoList.length; i++){
        let token = this.tokenInfoList[i];
        let contract = new web3.eth.Contract(abiERC20, token.erc20Address);
        let balance = await contract.methods.balanceOf(this.connection.address).call();
        let decimals = token.decimals;

        let _balance = balance/10**decimals;
        if(_balance !=0){
          asset.push({
            symbol: token.symbol,
            logo: token.logo,
            balance: _balance,
            price: 0,
            value: 0
          })
          assetArr.push(token.symbol);
        }
        
      }
      let { data: priceList} = await getPrice({symbols:assetArr.join()});
      let totalAmount = 0;
      let assetList = asset.map(item=>{
        let _asset = find(priceList.data, (items) => items.symbol.toUpperCase() == item.symbol);
        let value = _asset.current_price*item.balance;
        totalAmount += value;
        return {
          symbol: item.symbol,
          logo: item.logo,
          balance: item.balance,
          price: _asset.current_price,
          value
        }
      })

      this.assetList = assetList;
      this.totalAmount = totalAmount
      this.getListLoading = false;


    }
  }
};
</script>

<style scoped lang="scss">
.v-tabs {
  // margin-top: 20px;
}
.v-tab {
  text-transform: none !important;
}
.daytime {
  background-color: #f3f4fa;
}
.night {
  background-color: #100d22;
}
.theme--light.v-slide-group__content {
  background-color: #f3f4fa !important;
}
.header-back{
  background: linear-gradient(180deg, #D6E3FF 0%, #FFFFFF 100%);
}
.header-title {
  margin: 1.5rem 0;
  .title-detailed {
    font-size: 14px;
    color: #868e9e;
  }
}
.myAccount {
  padding: 52px;
}
.account-header {
  padding-top: 60px;
  padding-left: 40px;
  padding-bottom: 20px;
  .left-address {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .my-address {
      font-weight: bold;
      margin: 0 10px;
    }
  }
  .balance {
    padding: 26px;
    color: #fff;
    background-color: #6979f8;
    border-radius: 6px;
    .title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
    }
  }
}
.font-grey {
  font-size: 14px;
  color: #868e9e;
}
.wallet-table {
  padding: 40px;
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
  .myAccount {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
