<template>
  <v-container :class="dark ? 'night stake' : 'daytime stake'">
    <div class="header-title">
      <h1>Asset</h1>
      <a class="title-detailed" target="_blank" href=""> REI Network. Including ERC20, ERC1155, ERC721</a>
    </div>
    <v-row>
      <v-col>
        <v-card class="asset-card">
          <h3>Total Token Assets</h3>
          <v-row>
            <v-tabs v-model="tab1" align-with-title hide-slider class="erc-tabs" background-color="background">
              <v-radio-group v-model="radios" mandatory row dense style="margin-top: 0" class="trend-tab">
                <v-tab key="11">
                  <v-radio label="REI" value="1" class="trends-radio"> </v-radio>
                </v-tab>
                 <v-tab key="12">
                  <v-radio label="ERC20" value="2" class="trends-radio"> </v-radio>
                </v-tab>
                 <!-- <v-tab key="13">
                  <v-radio label="ERC721" value="3" class="trends-radio"> </v-radio>
                </v-tab>
                 <v-tab key="14">
                  <v-radio label="ERC1155" value="4" class="trends-radio"> </v-radio>
                </v-tab> -->
              </v-radio-group>
              <!-- <v-tab style="margin-left: 12px" key="11">REI</v-tab>
              <v-tab key="12">ERC20</v-tab>
              <v-tab key="13">ERC721</v-tab>
              <v-tab key="14">ERC1155</v-tab> -->
            </v-tabs>
          </v-row>
          <v-tabs-items v-model="tab1">
            <v-row>
              <v-col>
                <v-tab-item key="11">
                  <v-card outlined class="vote-number">
                    <v-row justify="space-between">
                      <v-col>
                        <div class="font-grey">Price</div>
                        <h3>${{ assetObj.price | asset(5) }}</h3>
                      </v-col>
                      <v-col>
                        <div class="font-grey">Total Supply</div>
                        <h3>1000,000,000 REI</h3>
                      </v-col>
                      <v-col>
                        <div class="font-grey">Holders</div>
                        <h3>{{ this.holderList.length }}</h3>
                      </v-col>
                      <!-- <v-col>
                        <div class="font-grey">Transfers</div>
                        <h3>838</h3>
                      </v-col> -->
                      <v-col>
                        <div class="font-grey">Decimals</div>
                        <h3>18</h3>
                      </v-col>
                    </v-row>
                  </v-card>
                  <!-- <v-card class="card-list"> -->
                  <v-tabs v-model="tab2" align-with-title class="vote-list" background-color="background">
                    <v-tab style="margin-left: 0" key="11" class="v-tab-left">Token Holders</v-tab>
                    <!-- <v-tab key="12" class="v-tab-left">Token Transfers</v-tab> -->
                  </v-tabs>
                  <v-divider class="faq_border" />
                  <v-tabs-items v-model="tab2">
                    <v-tab-item key="11">
                      <v-data-table :headers="holderHeaders" :items="holderList" class="elevation-0" hide-default-footer :items-per-page="reiPerPage" :loading="loading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="reiPage" @page-count="reiPageCount = $event">
                        <template v-slot:item.rank="{ item }">
                          <span>{{ item.rank }}</span>
                        </template>
                        <template v-slot:item.balance="{ item }">
                          <span>{{ item.balance | asset(5) }}</span>
                        </template>
                        <template v-slot:item.percentage="{ item }">
                          <span>{{ item.percentage | asset(3) }} %</span>
                          <v-progress-linear color="#2115E5" rounded :value="item.percentage"></v-progress-linear>
                        </template>
                      </v-data-table>
                      <div class="text-center pt-2" v-if="holderList.length > 0">
                        <v-pagination v-model="reiPage" :length="reiPageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
                      </div>
                    </v-tab-item>
                    <v-tab-item key="12">
                      <v-data-table :headers="transferHeaders" :items="transferList" class="elevation-0" hide-default-footer :items-per-page="transferPerPage" :loading="transferLoading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="transferPage" @page-count="transferCount = $event">
                        <template v-slot:item.time="{ item }">
                          <span>{{ (item.time * 1000) | dateFormat('YYYY-MM-dd hh:mm:ss') }}</span>
                        </template>
                        <template v-slot:item.amount="{ item }">
                          <span>+{{ item.amount | asset(2) }}</span>
                        </template>
                      </v-data-table>
                      <div class="text-center pt-2" v-if="transferList.length > 0">
                        <v-pagination v-model="transferPage" :length="transferCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
                      </div>
                    </v-tab-item>
                  </v-tabs-items>

                  <!-- </v-card> -->
                </v-tab-item>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-tab-item key="12">
                  <v-data-table :headers="headers" :items="assetList" class="elevation-0" hide-default-footer :items-per-page="itemsPerPage" :loading="getListLoading" @click:row="walletDetails" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="page" @page-count="pageCount = $event">
                    <template v-slot:item.assets="{ item }">
                      <v-row align="center">
                        <div class="asset-logo">
                          <v-img :src="$IpfsGateway(item.logo)" width="30" height="30"></v-img>
                        </div>
                        <div>{{ item.symbol }}</div>
                      </v-row>
                    </template>
                    <template v-slot:item.price="{ item }">
                      <span>${{ item.price | asset(5) }}</span>
                    </template>
                    <template v-slot:item.balance="{ item }">
                      <span
                        >{{ item.balance | asset(4) }}
                        <v-tooltip right v-if="item.symbol == 'REI'">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                              <v-icon size="14">mdi-help-circle-outline</v-icon>
                            </v-btn>
                          </template>
                          <span>
                            Wallet: {{ assetFromWei(reiBalance) | asset(4) }}<br />
                            Voting: {{ assetFromWei(myTotalStake) | asset(4) }}<br />
                            Gas stake: {{ assetFromWei(totalGasAmount) | asset(4) }}
                          </span>
                        </v-tooltip>
                      </span>
                    </template>
                    <template v-slot:item.value="{ item }">
                      <span>${{ item.value | asset(5) }}</span>
                    </template>
                  </v-data-table>
                  <div class="text-center pt-2" v-if="assetList.length > 10">
                    <v-pagination v-model="page" :length="pageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
                  </div>
                </v-tab-item>
              </v-col>
            </v-row>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col> </v-col>
    </v-row>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { mapActions, mapGetters } from 'vuex';
import filters from '../filters';
import { postRpcRequest, getPrice } from '../service/CommonService';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

export default {
  components: {},
  filters,
  data() {
    return {
      tab1: null,
      tab2: null,
      radios: null,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      reiPage: 1,
      reiPageCount: 0,
      reiPerPage: 50,
      transferPage: 1,
      transferCount: 0,
      transferPerPage: 20,
      transferLoading: false,
      loading: false,
      getListLoading: false,
      stakeManagerContract: null,
      stakeManageInstance: null,
      myTotalStake: 0,
      reiBalance: 0,
      totalGasAmount: 0,
      assetObj:{},
      holderHeaders: [
        { text: 'Rank', value: 'rank' },
        { text: 'Address', value: 'address' },
        { text: 'Balance(REI)', value: 'balance' },
        // { text: 'Txn Count', value: 'count' },
        { text: 'Percentage', value: 'percentage' }
      ],
      holderList: [],
      transferHeaders: [],
      transferList: [],
      headers: [
        { text: 'Token', value: 'token' },
        { text: 'Price($)', value: 'price' },
        { text: 'Contract Address', value: 'address' },
        { text: 'Total Supply', value: 'total' },
        { text: 'Market Cap($)', value: 'market' },
        { text: 'Address Count', value: 'count' }
      ],
      assetList: []
    };
  },
  computed: {
    ...mapGetters({
      dark: 'dark',
      connection: 'connection',
      apiUrl: 'apiUrl'
    })
  },
  mounted() {
    this.getBalance();
    this.getData();
  },
  methods: {
    walletDetails() {},
    async getTotalGasStake() {
      let apiUrl = this.apiUrl.rpc;
      let arr = [];
      arr.push(this.connection.address);
      arr.push('latest');
      let param = {
        method: 'rei_getTotalAmount',
        params: arr
      };
      let res = await postRpcRequest(apiUrl, param);
      this.totalGasAmount = res.data.result;
    },
    async getBalance() {
      if (!this.connection.address) return;
      this.getListLoading = true;
      let _assetObj = {};
      let reiBalance = await web3.eth.getBalance(this.connection.address);
      this.reiBalance = reiBalance;
      let totalBalance = web3.utils.toBN(reiBalance).add(web3.utils.toBN(this.myTotalStake)).add(web3.utils.toBN(this.totalGasAmount));
      let { data: priceList } = await getPrice({ symbols: 'REI' });
      let price = priceList.data[0].current_price;
      console.log(priceList.data, price);
      this.assetObj = {
        symbol: 'REI',
        balance: web3.utils.fromWei(totalBalance),
        price: price,
        decimals: 18,
        totalSupply: 1000000000,
        value: 0
      };
      console.log('_assetObj', _assetObj);
    },
    async getData(){
      this.getBalance();
      const { data } = await this.$axios.get(`https://gateway.rei.network/api/rei/holder`);
      this.holderList = data.result;
      function sortArr(attr){
          return function(a,b){
            return b[attr]-a[attr]
          }
        }
      this.holderList = this.holderList.sort(sortArr('balance'));
      this.holderList = this.holderList.map((item,index) =>{
          let rank = index +1;
          let balance = parseFloat(item.balance) / 1e18;
          let percentage = balance / 1000000000 * 100;
           return {
          ...item,
          address: item.address,
          rank: rank,
          balance: balance,
          percentage:percentage,
        };
      })
      console.log('holderList', this.holderList);
    },
  }
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
}
.daytime {
  //   background-color: #f3f4fa;
  // background: linear-gradient(180deg, #d6e3ff 0%, rgba(255, 255, 255, 0) 50%);
}
.night {
  background-color: #100d22;
}
.v-tab {
  text-transform: none;
}
.header-title {
  margin: 1.5rem 0;
  .title-detailed {
    font-size: 14px;
    color: #868e9e;
  }
  .title-detailed:hover {
    color: #6979f8;
    text-decoration: underline;
  }
}
.stake {
  padding-left: 40px;
  padding-right: 40px;
}
.asset-card {
  padding: 24px;
  .erc-tabs {
    margin: 20px 0;
  }
}
.font-grey {
  color: #868e9e;
  font-size: 14px;
}
.theme--light.vote-number {
  background-color: #f7f7f7;
  padding: 12px 20px;
  margin-top: 20px;
}
.theme--dark.vote-number {
  background-color: #13112b;
  padding: 12px 20px;
  margin-top: 20px;
}
.v-sheet--outlined {
  border: none !important;
}
.vote-list {
  margin-top: 40px;
}
@media screen and (max-width: 900px) {
  .stake {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
