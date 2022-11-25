<template>
  <v-container :class="dark ? 'night stake' : 'daytime stake'">
    <div class="header-title">
      <h1>Asset</h1>
      <span class="font-grey"> Token Assets on REI Network. Including ERC20, ERC1155, ERC721</span>
    </div>
    <v-row>
      <v-col>
        <v-card class="asset-card">
          <h3>Token Assets</h3>
          <v-row>
            <v-col>
              <v-tabs v-model="tab1" align-with-title hide-slider class="erc-tabs" background-color="background">
                <v-radio-group v-model="radios" mandatory row dense style="margin-top: 0" class="trend-tab">
                  <v-tab key="11">
                    <v-radio label="REI" value="1" class="trends-radio"> </v-radio>
                  </v-tab>
                  <v-tab key="12">
                    <v-radio label="ERC20" value="2" class="trends-radio"> </v-radio>
                  </v-tab>
                </v-radio-group>
              </v-tabs>
            </v-col>
            <!-- <v-col cols="12" md="4">
              <v-text-field label="" outlined dense></v-text-field>
            </v-col> -->
          </v-row>
          <v-tabs-items v-model="tab1">
            <v-row>
              <v-col>
                <v-tab-item key="11">
                  <v-card outlined class="vote-number">
                    <v-row justify="space-between">
                      <v-col>
                        <div class="font-grey">Price</div>
                        <h3>${{ current_price | asset(5) }}</h3>
                      </v-col>
                      <v-col>
                        <div class="font-grey">Total Supply</div>
                        <h3>1000,000,000 REI</h3>
                      </v-col>
                      <v-col>
                        <div class="font-grey">Holders</div>
                        <h3>{{ this.totalSupply | asset() }}</h3>
                      </v-col>
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
                      <v-data-table :headers="accountHeaders" :items="holderList" class="elevation-0" hide-default-footer :items-per-page="reiPerPage" :loading="loading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="reiPage" @page-count="reiPageCount = $event">
                        <template v-slot:item.rank="{ item }">
                          <span>{{ item.rank }}</span>
                        </template>
                        <template v-slot:item.address="{ item }">
                          <span v-if="item.contractName "><a :class="dark ? 'link-dark' : 'link-light'" :href="`https://scan.rei.network/address/${item.address}`" target="_blank"> {{ item.contractName }}({{ item.address | addr }})</a></span>
                          <span v-else ><a :class="dark?'link-dark':'link-light'" :href="`https://scan.rei.network/address/${item.address}`" target="_blank"> {{ item.address }}</a></span>
                        </template>
                        <template v-slot:item.balance="{ item }">
                          <span>{{ item.balance | asset(5) }}</span>
                        </template>
                        <template v-slot:item.percentage="{ item }">
                          <span>{{ item.percentage | asset(3) }} %</span>
                          <v-progress-linear color="#2115E5" rounded :value="item.percentage"></v-progress-linear>
                        </template>
                      </v-data-table>
                      <div class="turn-pages" align-content="end" v-if="holderList.length>0">
                        <v-btn elevation="3" :disabled="disabled" @click="ForwardPage" class="turn-btn">
                          <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-btn elevation="3" @click="BackwardPage" class="turn-btn">
                          <v-icon>mdi-chevron-right</v-icon>
                        </v-btn>
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
            <v-row style="margin-top:0;">
              <v-col style="margin-top:-12px;">
                <v-tab-item key="12">
                  <div class="submit-here">
                    <v-icon size="16" class="wallet-icon font-grey">mdi-arrow-up-thin-circle-outline</v-icon>
                    <a class="font-grey" href="https://github.com/REI-Network/rei-dao/tree/main/info/rei-token-profile" target="_blank">Submit a token support here</a>
                  </div>
                  <v-data-table :headers="headers" :items="list" class="elevation-0 data-table" hide-default-footer :items-per-page="itemsPerPage" :loading="getListLoading" @click:row="assetsDetails" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="page" @page-count="pageCount = $event">
                    <template v-slot:item.assets="{ item }">
                      <v-row align="center" class="assets-list">
                        <div class="asset-logo">
                          <v-img :src="$IpfsGateway(item.logo)" width="30" height="30"></v-img>
                        </div>
                        <div>{{ item.symbol }}</div>
                      </v-row>
                    </template>
                    <template v-slot:item.price="{ item }">
                      <span>${{ item.price | asset(5) }}</span>
                    </template>
                    <template v-slot:item.address="{ item }">
                      <a :href="`https://scan.rei.network/token/${item.address}`" target="_blank" :class="dark?'link-dark':'link-light'"><div>{{ item.address | addr }}</div></a>
                    </template>
                    <template v-slot:item.totalSupply="{ item }">
                      <span>${{ item.totalSupply }} {{ item.symbol }}</span>
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

import Web3 from 'web3';
import { mapActions, mapGetters } from 'vuex';
import filters from '../filters';
import abiConfig from '../abis/abiConfig';
import abiStakeManager from '../abis/abiStakeManager';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import abiERC20 from '../abis/abiERC20';
import abiCommissionShare from '../abis/abiCommissionShare';
import { getPrice, postRpcRequest, getReiSatistic, getTokenHolder, getHistoryData } from '../service/CommonService';
import find from 'lodash/find';
import Address from '../components/Address';

export default {
  components: {
  },
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
      current_price: 0,
      totalSupply: 0,
      lastAddress: '',
      lastBalance: '',
      count: 50,
      countPage: 0,
      disabled: true,
      totalList:[],
      list:[],
      accountList:[],
      holderList:[],
      accountHeaders: [
        { text: 'Rank', value: 'rank' },
        { text: 'Address', value: 'address' },
        { text: 'Balance(REI)', value: 'balance' },
        // { text: 'Txn Count', value: 'count' },
        { text: 'Percentage', value: 'percentage' }
      ],
      transferHeaders: [],
      transferList: [],
      headers: [
        { text: 'Assets', value: 'assets' },
        { text: 'Price', value: 'price' },
        { text: 'Address', value: 'address' },
        { text: 'Circulation Supply', value: 'totalSupply' },
        { text: 'Address count', value: 'count' }
      ],

      assetList: [],
      tokenInfoList: [
        {
          decimals: '18',
          logo: 'bafkreiavru5i3kdvsgqqjru2n6t7mgf724jinllip3gaj74drhkvm7swiy',
          symbol: 'REI'
        },
        {
          decimals: '8',
          erc20Address: '0x8059E671Be1e76f8db5155bF4520f86ACfDc5561',
          logo: 'bafkreiakvobel6nvizg4krw7kmtdzsf5amvxz3gnubexl7md6izzce2hay',
          name: 'Wrapped BTC',
          symbol: 'WBTC'
        },
        {
          decimals: '6',
          erc20Address: '0x988a631Caf24E14Bb77EE0f5cA881e8B5dcfceC7',
          logo: 'bafkreia4f3h4rqekqineqopsvyg7dwdznkg7em4ttnjxwtrgkfh2j6irsy',
          name: 'Tether USD',
          symbol: 'USDT'
        },
        {
          decimals: '6',
          erc20Address: '0x8d5E1225981359E2E09A3AB8F599A51486f53314',
          logo: 'bafkreidncrqb2cyrbecg4ntfsk4mb4sw76yhl5urqc3f3xozpltglve7ty',
          name: 'USD Coin',
          symbol: 'USDC'
        },
        {
          decimals: '18',
          erc20Address: '0x7a5313468c1C1a3Afb2Cf5ec46558A7D0fc2884A',
          logo: 'bafkreicsv5dhrd2rutq3zdqk3gunix5idx6z5lyixv5nkkr3mgi4qxdye4',
          name: 'Wrapped Ether',
          symbol: 'WETH'
        },
        {
          decimals: '18',
          erc20Address: '0x0ba85980B122353D77fBb494222a10a46E4FB1f6',
          logo: 'bafkreidzpyhertnzgzvjuxtzrq5lkdtbzzslbfzrtnq4fdtvgynmk3psny',
          name: 'Dai Stablecoin',
          symbol: 'DAI'
        },
        {
          decimals: '18',
          erc20Address: '0x02CD448123E3Ef625D3A3Eb04A30E6ACa29C7786',
          logo: 'bafkreia2l332gaw25wrkyj37xtixyqezwyhkouhz5qjrfkwi4wjjcaakl4',
          name: 'Binance USD',
          symbol: 'BUSD'
        },
        {
          decimals: '18',
          erc20Address: '0x3d1bbd0ec9af25e8f12383d9f6a6bbfa6dfef06f',
          logo: 'ipfs/QmRWhZk1jkD4wLCaYv8STyzhDPhcHdX21xZChH2F23tJyW/oort.png',
          name: 'Oort Token',
          symbol: 'OORT'
        },
        {
          decimals: '18',
          erc20Address: '0xa30de46d08340a6900464f437078491f95a6559a',
          logo: 'ipfs/QmRWhZk1jkD4wLCaYv8STyzhDPhcHdX21xZChH2F23tJyW/sugar.png',
          name: 'HONEY Token',
          symbol: 'HONEY'
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      dark: 'dark',
      connection: 'connection',
      apiUrl: 'apiUrl'
    })
  },
  watch: {
    '$store.state.connection': function () {
      if (this.connection && this.connection.network) {
        this.connect();
        this.getBalance();
      }
    },
    count(newVal, oldVal) {
      this.getWalletInfo();
        for (let i = 0; i < this.holderList.length; i++) {
          const item = this.holderList[i];
          item.rank += this.count - 50;
      }
      console.log(oldVal)
      if(newVal > 50){
        this.disabled = false;
      }else{
        this.disabled = true;
      }
    },
  },
  mounted() {
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
      this.loading = true;
      let asset = [],
        assetAllArr = [],
        assetZeroArr = [],
        assetArr = [];
      if (!this.connection.address) return;
      this.getListLoading = true;
      let _assetObj = {};
      for (let i = 0; i < this.tokenInfoList.length; i++) {
        let token = this.tokenInfoList[i];
        if (token.symbol == 'REI') {
          let reiBalance = await web3.eth.getBalance(this.connection.address);
          this.reiBalance = reiBalance;
          let totalBalance = web3.utils.toBN(reiBalance).add(web3.utils.toBN(this.myTotalStake)).add(web3.utils.toBN(this.totalGasAmount));
          let { data: priceList } = await getPrice({ symbols: 'REI' });
          this.current_price = priceList.data[0].current_price;
          _assetObj = {
            symbol: token.symbol,
            logo: token.logo,
            balance: web3.utils.fromWei(totalBalance),
            price:0,
            address: token.erc20Address,
            decimals: token.decimals,
            totalSupply: 1000000000,
            value: 0
          };
        } else {
          let contract = new web3.eth.Contract(abiERC20, token.erc20Address);
          let balance = await contract.methods.balanceOf(this.connection.address).call();
          let decimals = token.decimals;
          let _balance = balance / 10 ** decimals;
          let total = await contract.methods.totalSupply().call();
          let totalSupply = total / 10 ** decimals;
          _assetObj = {
            symbol: token.symbol,
            logo: token.logo,
            balance: _balance,
            price: 0,
            address: token.erc20Address,
            decimals: token.decimals,
            totalSupply: totalSupply,
            value: 0
          };
        }
        assetAllArr.push(token.symbol);
        asset.push(_assetObj);
      }
      let { data: priceList } = await getPrice({ symbols: assetAllArr.join() });
      let totalAmount = 0;

      for (let i = 0; i < asset.length; i++) {
        let item = asset[i];
        let _asset = find(priceList.data, (items) => items.symbol.toUpperCase() == item.symbol);
        let value = _asset.current_price * item.balance;
        totalAmount += value;
        if (item.balance > 0) {
          assetArr.push({
            symbol: item.symbol,
            logo: item.logo,
            balance: item.balance,
            price: _asset.current_price,
            address: item.address,
            decimals: item.decimals,
            totalSupply: item.totalSupply,
            value
          });
        } else {
          assetZeroArr.push({
            symbol: item.symbol,
            logo: item.logo,
            balance: item.balance,
            price: _asset.current_price,
            address: item.address,
            decimals: item.decimals,
            totalSupply: item.totalSupply,
            value
          });
        }
      }

      if (!localStorage.getItem('hideAsset')) {
        this.assetList = assetArr.concat(assetZeroArr);
        this.checkStatus = false;
      } else {
        this.assetList = assetArr;
        this.checkStatus = true;
      }

      this.assetNotZeroList = assetArr;
      this.assetZeroList = assetZeroArr;

      this.totalAmount = totalAmount;
      this.getListLoading = false;
      this.list = this.assetList;
      this.list.shift();
      this.getAccountList();
      this.getAddressCount();
      this.loading = false;
    },
    async getAccountList() {
      let data = await getTokenHolder('');
      this.accountList = data.data.data;
      this.getWalletInfo();
      let amount = await getReiSatistic();
      this.totalSupply = amount.data.row.json.totalAddress;
      let lastItem = this.accountList[this.accountList.length - 1];
      this.lastAddress = lastItem.address;
      this.lastBalance = lastItem.balance;
      this.totalList.push(this.accountList);
    },
    async BackwardPage() {
      this.loading = true;
      let data = await getTokenHolder(`?balance=${this.lastBalance}&hash=${this.lastAddress}&count=${this.count}`);
      this.accountList = data.data.data;
      for (let i = 0; i < this.accountList.length; i++) {
        let lastItem = this.accountList[this.accountList.length - 1];
        this.lastAddress = lastItem.address;
        this.lastBalance = lastItem.balance;
      }
      this.count += 50;
      this.countPage++;
      this.totalList.push(this.accountList)
      this.loading = false;
    },
    ForwardPage() {
      this.count -= 50;
      this.countPage--;
      this.totalList.pop();
      this.accountList = this.totalList[this.countPage]
      for (let i = 0; i < this.accountList.length; i++) {
        let lastItem = this.accountList[this.accountList.length - 1];
        this.lastAddress = lastItem.address;
        this.lastBalance = lastItem.balance;
      }
    },
    async getWalletInfo() {
      this.holderList = this.accountList.map((item, index) => {
        let rank = index + 1;
        let balance = parseFloat(item.balance) / 1e18;
        let percentage = (balance / 1000000000) * 100;
        return {
          ...item,
          address: item.address,
          rank: rank,
          balance: balance,
          percentage: percentage
        };
      });
    },
    async getAddressCount(){
      let countList = [];
      for (let i = 0; i < this.list.length; i++) {
        let item = this.list[i];
        let data = await getHistoryData(`module=token&action=getTokenHolders&contractaddress=${item.address}&offset=1000`);
        let list = data.data.result
        let _address = {
          address:item.address,
          data:list
        }
        countList.push(_address);
      }
      this.list=this.list.map((item) =>{
        let details = find(countList, (items) => web3.utils.toChecksumAddress(items.address)==  web3.utils.toChecksumAddress(item.address));
        let count = details.data.length;
        return{
          ...item,
          count:count
        }
      })
    },
    assetsDetails(value) {
      console.log(value);
      this.$router.push({
        name: 'AssetsInfo',
        query: {
          id: value.symbol
        }
      });
    }
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
    margin-top: 20px;
  }
}
.font-grey {
  color: #868e9e;
  font-size: 14px;
}
.theme--light.vote-number {
  background-color: #f7f7f7;
  padding: 20px;
  margin-top: -10px;
}
.theme--dark.vote-number {
  background-color: #13112b;
  padding: 20px;
  margin-top: -10px;
}
.v-sheet--outlined {
  border: none !important;
}
.vote-list {
  margin-top: 20px;
}
.asset-logo {
  margin-right: 10px;
}
.data-table{
  cursor: pointer;
}
.turn-pages {
  margin: 20px 0;
  text-align: right;
  .turn-btn {
    margin-right: 12px;
  }
  .v-icon {
    color: #868e9e;
  }
  .v-btn:not(.v-btn--round).v-size--default{
    min-width: 36px;
  }
}
.link-light{
  cursor: pointer;
  color: #000 ;
}
.link-light:hover{
  color: #6979f8;
  text-decoration: underline;
}
.link-dark:hover{
  color: #6979f8;
  text-decoration: underline;
}
.link-dark{
  cursor: pointer;
  color: #FFF;
}
.theme--light.v-btn.v-btn--has-bg {
  background-color: transparent;
}
.submit-here{
  text-align:right;
  margin-bottom:10px;
}
.wallet-icon{
  margin-right:8px;
}
@media screen and (max-width: 900px) {
  .stake {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
