<template>
  <v-container class="stake_background wallet">
    <v-row>
      <v-col>
        <v-card class="info-header">
          <v-row align="center">
            <v-col cols="12" md="9">
              <v-row align="center">
                <div>
                  <v-img v-if="details.logo" class="img" :src="$IpfsGateway(details.logo)" width="48" height="48" />
                  <v-img v-else class="img" src="../assets/images/rei.svg" width="48" height="48" />
                </div>
                <div>
                  <h3>{{ details.symbol }}</h3>
                  <div v-if="details.address">
                    <a :href="`https://scan.rei.network/token/${details.address}`" target="_blank">
                      <span class="font-grey">{{ details.address | addr }}</span>
                    </a>
                    <v-btn class="copy-btn" @click="copyAddr(details.address)">
                      <v-icon small color="#868E9E">{{ addrCopying ? 'mdi-checkbox-marked-circle-outline' : 'mdi-content-copy' }}</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-row>
            </v-col>
            <!-- <v-col cols="12" md="3" style="text-align: right">
              <v-btn small color="start_unstake" class="mr-4 add-btn" height="32">Add Token to Metamask</v-btn>
            </v-col> -->
          </v-row>
          <v-card outlined class="vote-number">
            <v-row justify="space-between">
              <v-col cols="12" md="3">
                <div class="font-grey">Price</div>
                <h3>${{ details.price | asset(5) }}</h3>
              </v-col>
              <v-col>
                <div class="font-grey" v-if="id == 'REI'">Total Supply</div>
                <div class="font-grey" v-else>
                  Circulation Supply
                  <v-tooltip right color="start_unstake">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="right_icon" v-bind="attrs" v-on="on" dense size="14" style="margin-left: 4px"> mdi-alert-circle-outline </v-icon>
                    </template>
                    <span>Circulation Supply on REI Network</span>
                  </v-tooltip>
                </div>
                <h3>{{ details.totalSupply | asset(2) }} {{ details.symbol }}</h3>
              </v-col>
              <v-col v-if="id == 'REI'">
                <div class="font-grey">Holders</div>
                <h3>{{ totalSupply | asset() }}</h3>
              </v-col>
              <v-col v-else>
                <div class="font-grey">Holders</div>
                <h3>{{ holderList.length }}</h3>
              </v-col>
              <!-- <v-col>
                <div class="font-grey">Transfers</div>
                <h3>838</h3>
              </v-col> -->
              <v-col>
                <div class="font-grey">Decimals</div>
                <h3>{{ details.decimals }}</h3>
              </v-col>
            </v-row>
          </v-card>
        </v-card>
        <v-card class="card-list">
          <v-tabs v-model="tab1" align-with-title class="vote-list" background-color="background">
            <v-tab style="margin-left: 0" key="11" class="v-tab-left">Token Holders</v-tab>
            <v-tab key="12" class="v-tab-left" v-if="id != 'REI'">Token Transfers</v-tab>
          </v-tabs>
          <v-divider class="faq_border" />
          <v-tabs-items v-model="tab1">
            <v-tab-item key="11">
              <v-data-table :headers="holderHeaders" :items="holderList" class="elevation-0" hide-default-footer :items-per-page="itemsPerPage" :loading="loading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="page" @page-count="pageCount = $event">
                <template v-slot:item.rank="{ item }">
                  <span>{{ item.rank }}</span>
                </template>
                <template v-slot:item.address="{ item }">
                  <a :class="dark ? 'link-dark' : 'link-light'" :href="`https://scan.rei.network/address/${item.address}`" target="_blank"><AddressTag :val="item.address"></AddressTag></a>
                </template>
                <template v-slot:item.balance="{ item }">
                  <span>{{ item.balance | asset(5) }}</span>
                  <!--<v-tooltip right color="start_unstake">
                     <template v-slot:activator="{ on, attrs }">
                      <v-icon color="right_icon" v-bind="attrs" v-on="on" dense size="14" style="margin-left: 4px"> mdi-alert-circle-outline </v-icon>
                    </template>
                    <span>{{ item.balance }}</span>
                  </v-tooltip> -->
                </template>
                <template v-slot:item.percentage="{ item }">
                  <span>{{ item.percentage | asset(3) }} %</span>
                  <v-progress-linear color="#2115E5" rounded :value="item.percentage"></v-progress-linear>
                </template>
              </v-data-table>
              <v-skeleton-loader v-if="skeletonLoading == true" class="skeleton" :loading="skeletonLoading" type="table-tbody,actions"></v-skeleton-loader>
              <div class="text-center pt-2" v-if="holderList.length > 0 && id != 'REI'">
                <v-pagination v-model="page" :length="pageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
              </div>
              <div v-else>
                <div class="turn-pages" align-content="end" v-if="holderList.length > 0">
                  <v-btn elevation="3" :disabled="disabled" @click="ForwardPage" class="turn-btn">
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn elevation="3" @click="BackwardPage" class="turn-btn">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-tab-item>
            <v-tab-item key="12">
              <v-data-table :headers="transferHeaders" :items="transferList" class="elevation-0" hide-default-footer :items-per-page="transferPerPage" :loading="transferLoading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="transferPage" @page-count="transferCount = $event">
                <template v-slot:item.txhash="{ item }">
                  <span>{{ item.txhash | addr }}</span>
                </template>
                <template v-slot:item.label="{ item }">
                  <span :class="dark ? 'dark-method' : 'light-method'">{{ item.label }}</span>
                </template>
                <template v-slot:item.fromAddress="{ item }">
                  <span>{{ item.fromAddress | addr }}</span>
                </template>
                <template v-slot:item.toAddress="{ item }">
                  <span>{{ item.fromAddress | addr }}</span>
                </template>
                <template v-slot:item.value="{ item }">
                  <span>{{ item.value | asset(2) }}</span>
                </template>
              </v-data-table>
              <v-skeleton-loader v-if="transferSkeletonLoading == true" class="skeleton" :loading="transferSkeletonLoading" type="table-tbody,actions"></v-skeleton-loader>
              <!-- <div class="text-center pt-2" v-if="transferList.length > 0">
                <v-pagination v-model="transferPage" :length="transferCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
              </div> -->
              <div class="turn-pages" align-content="end" v-if="transferList.length > 0">
                <v-btn elevation="3" :disabled="transferDisabled" @click="transferForwardPage" class="turn-btn">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn elevation="3" :disabled="transferDisabled2" @click="transferBackwardPage" class="turn-btn">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */

import Web3 from 'web3';
import abiConfig from '../abis/abiConfig';
import abiStakeManager from '../abis/abiStakeManager';
import { mapGetters } from 'vuex';
import filters from '../filters';
import abiERC20 from '../abis/abiERC20';
import abiCommissionShare from '../abis/abiCommissionShare';
import { getPrice, postRpcRequest, getReiSatistic, getTokenHolder, getHistoryData, getTokenTransfer } from '../service/CommonService';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import find from 'lodash/find';
import AddressTag from '../components/AddressTag';

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT;
let client = null;

export default {
  filters,
  components: {
    AddressTag
  },
  data() {
    return {
      skeletonLoading: true,
      transferSkeletonLoading: true,
      page: 1,
      pageCount: 0,
      itemsPerPage: 50,
      transferPage: 1,
      transferCount: 0,
      transferPerPage: 50,
      nextPage: {
        block_number:'',
        index: 0,
        items_count: 50,
      },
      loading: false,
      transferLoading: false,
      addrCopying: false,
      tab1: null,
      stakeManagerContract: null,
      stakeManageInstance: null,
      myTotalStake: 0,
      totalGasAmount: 0,
      reiBalance: 0,
      details: '',
      totalSupply: 0,
      id: this.$route.query.id,
      holderHeaders: [
        { text: 'Rank', value: 'rank' },
        { text: 'Address', value: 'address' },
        { text: 'Balance', value: 'balance' },
        // { text: 'Txn Count', value: 'count' },
        { text: 'Percentage', value: 'percentage' }
      ],
      lastAddress: '',
      lastBalance: '',
      count: 50,
      countPage: 0,
      disabled: true,
      transferDisabled: true,
      transferDisabled2: true,
      totalList: [],
      totalTransferList: [],
      accountList: [],
      tokenList: [],
      holderList: [],
      transferHeaders: [
        { text: 'Txn Hash', value: 'txhash' },
        { text: 'Method', value: 'label' },
        { text: 'Block', value: 'blockNumber' },
        { text: 'From', value: 'fromAddress' },
        { text: 'To', value: 'toAddress' },
        { text: 'Amount', value: 'value' }
      ],
      transferList: [],
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
  watch: {
    '$store.state.connection': function () {
      if (this.connection && this.connection.network) {
        this.connect();
        this.getBalance();
      }
    },
    count(newVal, oldVal) {
      this.getWalletInfo();
      // if (oldVal < newVal) {
      for (let i = 0; i < this.holderList.length; i++) {
        const item = this.holderList[i];
        item.rank += this.count - 50;
        // }
      }
      console.log(oldVal);
      if (newVal > 50) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
  },
  mounted() {
    this.connect();
    this.getBalance();
  },
  destroyed() {},
  computed: {
    ...mapGetters({
      connection: 'connection',
      assetInfo: 'assetInfo',
      apiUrl: 'apiUrl',
      dark: 'dark',
      addressTags: 'addressTags'
    }),
    nextPage2() {
      const { index, items_count } = this;
      return { index, items_count };
    }
  },
  methods: {
    routeLink() {
      this.$router.back();
    },
    connect() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      }
    },
    async init() {
      let contract = new web3.eth.Contract(abiConfig, config_contract);
      this.stakeManagerContract = await contract.methods.stakeManager().call();
      this.stakeManageInstance = new web3.eth.Contract(abiStakeManager, this.stakeManagerContract);
      await this.getMyStakeInfo();
      await this.getTotalGasStake();
    },

    async getMyStakeInfo() {
      let url = this.apiUrl.graph;
      client = new ApolloClient({
        uri: `${url}chainMonitorOnlyForStake`,
        cache: new InMemoryCache()
      });
      const myStakesInfo = gql`
            query stakeInfos {
            stakeInfos(where:{
                from:"${this.connection.address}"
            }){
                id
                from
                timestamp
                validator
            }
        }`;
      const {
        data: { stakeInfos }
      } = await client.query({
        query: myStakesInfo,
        variables: {},
        fetchPolicy: 'cache-first'
      });
      if (stakeInfos.length > 0) {
        let myStakeValidatorMap = stakeInfos.map((item) => {
          return this.stakeManageInstance.methods.validators(item.validator).call();
        });

        let validators = await Promise.all(myStakeValidatorMap);
        let balanceOfShareMap = validators.map((item) => {
          return this.getBalanceOfShare(item);
        });
        let balanceOfShare = await Promise.all(balanceOfShareMap);
        let total = 0;
        for (let i = 0; i < balanceOfShare.length; i++) {
          total = web3.utils.toBN(total).add(web3.utils.toBN(balanceOfShare[i].amount));
        }
        this.myTotalStake = total;
      }
    },
    async getBalanceOfShare(activeValidatorsShare) {
      let commissionShare = new web3.eth.Contract(abiCommissionShare, activeValidatorsShare[1]);
      let balance = 0;
      let amount = 0;
      if (this.connection.address) {
        balance = await commissionShare.methods.balanceOf(this.connection.address).call();
        if (balance > 0) {
          amount = await commissionShare.methods.estimateSharesToAmount(balance).call();
        } else {
          amount = 0;
        }
      }
      return {
        balance,
        amount,
        commissionShare
      };
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
      await this.init();
      for (let i = 0; i < this.tokenInfoList.length; i++) {
        let token = this.tokenInfoList[i];
        if (token.symbol == 'REI') {
          let reiBalance = await web3.eth.getBalance(this.connection.address);
          this.reiBalance = reiBalance;
          let totalBalance = web3.utils.toBN(reiBalance).add(web3.utils.toBN(this.myTotalStake)).add(web3.utils.toBN(this.totalGasAmount));
          _assetObj = {
            symbol: token.symbol,
            logo: token.logo,
            balance: web3.utils.fromWei(totalBalance),
            price: 0,
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

      this.getAccountList();
      // if (this.id != 'REI') {
        this.getTransferData();
      // }
      this.skeletonLoading = false;
      this.loading = false;
    },
    async getAccountList() {
      this.details = find(this.assetList, (items) => items.symbol == this.id);
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
      let data = await getTokenHolder({ balance: this.lastBalance, hash: this.lastAddress, count: this.count });
      this.accountList = data.data.data;
      for (let i = 0; i < this.accountList.length; i++) {
        let lastItem = this.accountList[this.accountList.length - 1];
        this.lastAddress = lastItem.address;
        this.lastBalance = lastItem.balance;
      }
      this.count += 50;
      this.countPage++;
      this.totalList.push(this.accountList);
    },
    ForwardPage() {
      this.count -= 50;
      this.countPage--;
      this.totalList.pop();
      this.accountList = this.totalList[this.countPage];
      for (let i = 0; i < this.accountList.length; i++) {
        let lastItem = this.accountList[this.accountList.length - 1];
        this.lastAddress = lastItem.address;
        this.lastBalance = lastItem.balance;
      }
    },
    async getWalletInfo() {
      function sortArr(attr) {
        return function (a, b) {
          return b[attr] - a[attr];
        };
      }
      if (this.id == 'REI') {
        this.holderList = this.accountList;
      } else {
        let data = await getHistoryData({ contractaddress: this.details.address, offset: 1000 });
        this.tokenList = data.data.result;
        this.holderList = this.tokenList;
        if (this.holderList.length > 0) {
          this.holderList = this.holderList.sort(sortArr('balance'));
        }
      }

      // console.log('tokenList', this.tokenList);
      this.holderList = this.holderList.map((item, index) => {
        let rank = index + 1;
        let balance = 0;
        if (this.id == 'REI') {
          balance = parseFloat(item.balance) / 10 ** this.details.decimals;
        } else {
          balance = parseFloat(item.value) / 10 ** this.details.decimals;
        }
        let percentage = (balance / this.details.totalSupply) * 100;
        let _address = web3.utils.toChecksumAddress(item.address);
        let addressTags = this.addressTags[_address];

        return {
          ...item,
          address: item.address,
          rank: rank,
          balance: balance,
          percentage: percentage,
          addressName: addressTags ? addressTags.addressName : ''
        };
      });
    },
    async getTransferData() {
      this.transferLoading = true;
      let data = await getTokenTransfer({ token: this.details.address });
      let list = data.data;
      this.transferList = list.data;
      this.nextPage = list.nextPage;
      // this.index = parseInt(this.nextPage.index);
      // this.items_count = parseInt(this.nextPage.items_count);
      // console.log('nextPage+', this.nextPage.index,this.nextPage.items_count );
      this.totalTransferList.push(list);
       if(Object.keys(this.nextPage).length === 0){
         this.transferDisabled2 = true;
      } else {
         this.transferDisabled2 = false;
      }
      this.transferSkeletonLoading = false;
      this.transferLoading = false;
    },
    async transferBackwardPage() {
      let data = await getTokenTransfer({
        token: this.details.address,
        block_number: this.nextPage.block_number,
        index: this.nextPage.index,
        items_count: this.nextPage.items_count
      });
      let list = data.data;
      this.transferList =list.data;
      this.nextPage.count += 50;
      this.nextPage.countPage++;
      this.nextPage = list.nextPage;
      this.nextPage.index = parseInt(this.nextPage.index);
      this.nextPage.items_count = parseInt(this.nextPage.items_count);
      this.totalTransferList.push(list);
      if(this.nextPage.items_count > 50){
        this.transferDisabled = false;
      }else{
        this.transferDisabled = true;
      }
      if(Object.keys(this.nextPage).length === 0){
         this.transferDisabled2 = true;
      } else {
         this.transferDisabled2 = false;
      }
    },
    async transferForwardPage() {
      this.nextPage.items_count -= 50;
      this.totalTransferList.pop();
      let index = this.totalTransferList.length -1;
      let list = this.totalTransferList[ index ];
      this.transferList = list.data;
      this.nextPage = list.nextPage;
      this.nextPage.index = parseInt(this.nextPage.index);
      this.nextPage.items_count = parseInt(this.nextPage.items_count);
      if(this.nextPage.items_count > 50){
        this.transferDisabled = false;
      }else{
        this.transferDisabled = true;
      }
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
.header-title {
  margin: 1.5rem 0;
  .title-detailed {
    font-size: 24px;
  }
  .rei-fans {
    font-weight: bolder;
  }
}
.font-grey {
  color: #868e9e;
  font-size: 14px;
}
a {
  .font-grey:hover {
    text-decoration: underline;
    color: #6979f8;
  }
}
.v-tab {
  text-transform: none !important;
}
.light-method {
  background: #f7f8ff;
  padding: 8px 12px;
  border-radius: 4px;
}
.dark-method {
  background: #595777;
  padding: 8px 12px;
  border-radius: 4px;
}
.info-header {
  padding: 28px;
  .img {
    margin-right: 12px;
  }
  .copy-btn.v-btn.v-btn--has-bg {
    background-color: transparent !important;
  }
  .theme--light.vote-number {
    background-color: #f7f7f7;
    padding: 12px 20px;
    margin-top: 40px;
  }
  .theme--dark.vote-number {
    background-color: #13112b;
    padding: 12px 20px;
    margin-top: 40px;
  }
  .v-sheet--outlined {
    border: none !important;
  }
}
.card-list {
  padding: 24px;
  margin-top: 40px;
}
.back-voting {
  color: #868e9e !important;
  font-size: 16px;
}
.add-btn {
  text-transform: none;
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
  .v-btn:not(.v-btn--round).v-size--default {
    min-width: 36px;
  }
}
.theme--light.v-btn.v-btn--has-bg {
  background-color: transparent;
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
.skeleton {
  margin-top: -68px;
}
@media screen and (max-width: 900px) {
  .wallet {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
