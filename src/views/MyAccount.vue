<template>
  <v-container class="stake_background" style="padding: 0">
    <!-- <div class="header-title">
      <h1>My Account</h1>
      <div class="title-detailed">Details about your account, balances, and voting</div>
    </div> -->
    <v-card :class="dark ? 'night account-header' : 'daytime account-header header-back'">
      <v-row justify="space-between">
        <div>
          <div class="left-address">
            <div>
              <!-- <v-img src="../assets/images/rei.svg" width="80" height="80"></v-img> -->
              <jazzicon class="identicon" :address="connection.address" :diameter="60"></jazzicon>
            </div>
            <div>
              <v-row>
                <Address class="my-address" :val="this.connection.address"></Address>
              </v-row>
              <div class="register">
                <v-btn @click="openRegister()"> Register BLS public key </v-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="balance">
          <div class="title">
            <div>Balance</div>
            <v-btn icon :loading="getListLoading" @click="getBalance()" color="#FFF">
              <v-icon>mdi-sync</v-icon>
            </v-btn>
          </div>
          <h2>${{ totalAmount | asset(5) }}</h2>
        </div>
      </v-row>
    </v-card>
    <v-tabs v-model="tab1" align-with-title background-color="background">
      <v-tab key="11" to="/myAccount/portfolio">Portfolio</v-tab>
      <v-tab key="12" to="/myAccount/nfts">NFTs</v-tab>
      <v-tab key="13" to="/myAccount/daos">DAOs</v-tab>
      <v-tab key="14" to="/myAccount/history">History</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab2">
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
                    <span
                      >Wallet supports REI, WBTC, USDT, USDC, WETH,<br />
                      DAI, BUSD, OORT, HONEY and other assets on REI Network</span
                    >
                  </v-tooltip>
                  <!-- <v-icon size="16" class="wallet-icon" style="margin-bottom: 6px">mdi-help-circle-outline</v-icon> -->
                </v-col>
                <v-col style="text-align: right">
                  <span class="font-grey hideButton" @click="handleHideAsset">
                    <v-icon size="16" :color="checkStatusColor" class="wallet-icon">mdi-checkbox-marked-circle</v-icon>
                    <span>Hide 0 balance</span>
                  </span>
                  <span>
                    <v-icon size="16" class="wallet-icon">mdi-arrow-up-thin-circle-outline</v-icon>
                    <a class="font-grey" href="https://github.com/REI-Network/rei-dao/tree/main/info/rei-token-profile" target="_blank">Submit a token support here</a>
                  </span>
                </v-col>
              </v-row>
              <v-data-table :headers="headers" :items="assetList" class="elevation-0" hide-default-footer :items-per-page="itemsPerPage" :loading="getListLoading" :no-data-text="$t('msg.nodatatext')" loading-text="" :page.sync="page" @page-count="pageCount = $event">
                <template v-slot:item.assets="{ item }">
                  <v-row align="center" class="assets-list" @click="walletDetails(item)">
                    <div class="asset-logo">
                      <v-lazy class="logoWrap">
                        <v-img :src="$IpfsGateway(item.logo)" lazy-src="../assets/images/logo_bg_small.png" width="30" height="30"></v-img>
                      </v-lazy>
                    </div>
                    <div class="name-hover">{{ item.symbol }}</div>
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
              <v-sheet>
                <v-skeleton-loader v-if="skeletonLoading == true" class="skeleton" :loading="skeletonLoading" type="table-tbody,actions"></v-skeleton-loader>
              </v-sheet>
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
          </v-tab-item>
          <v-tab-item key="14">
            <v-row>
              <v-col>
                <MyAccountHistory ref="child"></MyAccountHistory>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-col>
      </v-row>
    </v-tabs-items>
    <v-dialog v-model="dialog" width="650" class="register-key">
      <v-card :class="dark ? 'dialog-night' : 'dialog-daytime'">
        <div class="dialog-validator">
          <v-card-title class="dialog-title">Register BLS public key
            <a href="https://docs.rei.network/rei-dao/guides/about-bls-public-key-registration" target="_blank"  class="tutorial-link">Tutorial ></a>
          </v-card-title>
          <div @click="cancelRegister()" class="close-btn"><v-icon>mdi-close</v-icon></div>
        </div>
        <v-list rounded class="ma-dialog start_unstake public-field">
          <div class="font-grey">Please enter the BLS public key</div>
          <v-form ref="blsForm" lazy-validation>
            <v-text-field :rules="blsRules" v-model="publicKey" dense required outlined clearable background-color="input_other"> </v-text-field>
          </v-form>
          <div class="dialog-btn">
            <v-btn @click="setRegisterbls" :loading="registerLoading">Register BLS public key</v-btn>
          </div>
           <div class="update-list">
            <v-btn icon :loading="blsListLoading" @click="getPublicBls()">
              <v-icon color="">mdi-sync</v-icon>
            </v-btn>
            <span class="font-grey">update</span>
           </div>
          <v-data-table :headers="blsHeaders" :items="blsList" class="elevation-0 bls-public-list" hide-default-footer :loading="blsListLoading" :items-per-page="blsPerPage" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="blsPage" @page-count="blsCount = $event">
            <template v-slot:item.key="{ item }">
              <Address :val="item.blsPublicKey"></Address>
            </template>
            <template v-slot:item.timestamp="{ item }">
              <span>{{ (item.timestamp * 1000) | dateFormat('YYYY-MM-dd hh:mm:ss') }}</span>
            </template>
            <template v-slot:item.tx="{ item }">
               <a :class="dark ? 'link-dark' : 'link-light'" :href="`https://scan.rei.network/tx/${item.transactionHash}`" target="_blank"
                    > <span>{{ item.transactionHash | addr }}</span></a
                  >
            </template>
            <template v-slot:item.status="{ item }">
              <div class="active-bls" v-if="item.status == 'Active'">{{ item.status }}</div>
              <div :class="dark ? 'inactive-dark' : 'inactive-light'" v-else>{{ item.status }}</div>
            </template>
          </v-data-table>
          <v-skeleton-loader v-if="blsListLoading == true" class="skeleton" :loading="blsListLoading" type="table-tbody,actions"></v-skeleton-loader>
          <div class="text-center pt-2" v-if="blsList.length > 10">
            <v-pagination v-model="blsPage" :length="blsCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
          </div>
        </v-list>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */

import Web3 from 'web3';
import abiERC20 from '../abis/abiERC20';
import MyAccountBalance from '../components/MyAccountBalance';
import MyAccountHistory from '../components/MyAccountHistory';
import abiConfig from '../abis/abiConfig';
import abiStakeManager from '../abis/abiStakeManager';
import abiCommissionShare from '../abis/abiCommissionShare';
import MyAccountNFT from '../components/MyAccountNFT';
import { getPrice, postRpcRequest } from '../service/CommonService';
import Address from '../components/Address';
import { mapGetters, mapActions } from 'vuex';
import Jazzicon from 'vue-jazzicon';
import find from 'lodash/find';
import abiBlsRegister from '../abis/abiBlsRegister';
import util from '../utils/util';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT;
let bls_contract = process.env.VUE_APP_BLS_CONTRACT;
let client = null;
let client_bls = null;

import filters from '../filters';
export default {
  components: {
    Address,
    MyAccountBalance,
    MyAccountNFT,
    MyAccountHistory,
    [Jazzicon.name]: Jazzicon
  },
  filters,
  data() {
    return {
      skeletonLoading: true,
      tab1: 0,
      tab2: 1,
      type: '',
      page: 1,
      status: 'Active',
      pageCount: 0,
      itemsPerPage: 10,
      blsPage: 1,
      blsCount: 0,
      blsPerPage: 10,
      publicKey: '',
      dialog: false,
      getListLoading: false,
      blsListLoading: false,
      registerLoading: false,
      totalAmount: 0,
      checkStatus: false,
      myTotalStake: 0,
      stakeManagerContract: null,
      stakeManageInstance: null,
      totalGasAmount: 0,
      reiBalance: 0,
      routerMap: {
        portfolio: {
          index: 0
        },
        nfts: {
          index: 1
        },
        daos: {
          index: 2
        },
        history: {
          index: 3
        }
      },
      headers: [
        { text: 'Assets', value: 'assets' },
        { text: 'Price', value: 'price' },
        { text: 'Balance', value: 'balance' },
        { text: 'Value', value: 'value' }
      ],
      blsHeaders: [
        { text: 'BLS public key', value: 'key' },
        { text: 'Timestamp', value: 'timestamp' },
        { text: 'Tx', value: 'tx' },
        { text: 'Status', value: 'status' }
      ],
      blsList: [],
      assetList: [],
      assetNotZeroList: [],
      assetZeroList: [],
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
      ],
      typeFilter: '',
      tokenFilter: '',
      startDate: '',
      endDate: '',
      blsRules: [(v) => !!v || this.$t('msg.please_input_bls')]
    };
  },
  watch: {
    '$store.state.connection': function () {
      if (this.connection && this.connection.network) {
        this.connect();
        this.getBalance();
      }
    },
    tab1: function () {
      let type = this.$route.params.type;
      this.type = type;
      if (!type) {
        this.tab2 = 0;
      } else {
        this.tab2 = this.routerMap[type].index;
      }
      if (type == 'history') {
        const childComponent = this.$refs.child;
        this.typeFilter = childComponent.typeFilter;
        this.tokenFilter = childComponent.tokenFilter;
        this.startDate = childComponent.startDate;
        this.endDate = childComponent.endDate;
        // console.log(childComponent.typeFilter, childComponent.tokenFilter);
        var _this = this;
        let obj = JSON.parse(JSON.stringify(_this.$router.currentRoute.query));
        if (this.typeFilter) {
          Object.assign(obj, { type: this.typeFilter });
        }
        if (this.tokenFilter) {
          Object.assign(obj, { token: this.tokenFilter });
        }
        if (this.startDate) {
          Object.assign(obj, { startTime: this.startDate });
        }
        if (this.endDate) {
          Object.assign(obj, { endTime: this.endDate });
        }
        _this.$router.push({
          query: obj
        });
      }
    }
  },
  computed: {
    ...mapGetters({
      connection: 'connection',
      apiUrl: 'apiUrl',
      dark: 'dark'
    }),
    checkStatusColor() {
      if (this.checkStatus) {
        return 'green';
      } else {
        return 'gray';
      }
    }
  },
  mounted() {
    this.connect();
    this.getBalance();
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
      let contract = new web3.eth.Contract(abiConfig, config_contract);
      this.stakeManagerContract = await contract.methods.stakeManager().call();
      this.stakeManageInstance = new web3.eth.Contract(abiStakeManager, this.stakeManagerContract);
      await this.getMyStakeInfo();
      await this.getTotalGasStake();
    },
    handleHideAsset() {
      if (this.checkStatus == false) {
        localStorage.setItem('hideAsset', true);
        this.checkStatus = true;
        this.assetList = this.assetNotZeroList;
      } else {
        localStorage.setItem('hideAsset', '');
        this.checkStatus = false;
        this.assetList = this.assetNotZeroList.concat(this.assetZeroList);
      }
    },
    async getMyStakeInfo() {
      try {
        let url = this.apiUrl.graph;
        client = new ApolloClient({
          uri: `${url}chainMonitorEvent`,
          cache: new InMemoryCache()
        });
        const myStakesInfo = gql`
            query stakeInfos {
            stakeInfos(where:{
                to:"${this.connection.address}"
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
      } catch (e) {
        console.log(e);
        this.$dialog.notify.warning(e.message);
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
      let asset = [],
        assetAllArr = [],
        assetZeroArr = [],
        assetArr = [];
      if (!this.connection.address) return;
      this.getListLoading = true;
      let _assetObj = {};
      await this.init();

      let tokenInfoList = this.tokenInfoList;
      if (this.connection && this.connection.network){
          if (this.connection.network == 'REI Testnet') {
            let _arr = [];
            _arr.push(tokenInfoList[0]);
            tokenInfoList = _arr;
          }
      }
      for (let i = 0; i < tokenInfoList.length; i++) {
        let token = tokenInfoList[i];
        if (token.symbol == 'REI') {
          let reiBalance = await web3.eth.getBalance(this.connection.address);
          this.reiBalance = reiBalance;
          let totalBalance = web3.utils.toBN(reiBalance).add(web3.utils.toBN(this.myTotalStake)).add(web3.utils.toBN(this.totalGasAmount));
          _assetObj = {
            symbol: token.symbol,
            logo: token.logo,
            balance: web3.utils.fromWei(totalBalance),
            price: 0,
            value: 0,
            address: 'rei'
          };
        } else {
          let contract = new web3.eth.Contract(abiERC20, token.erc20Address);
          let balance = await contract.methods.balanceOf(this.connection.address).call();
          let decimals = token.decimals;

          let _balance = balance / 10 ** decimals;
          _assetObj = {
            symbol: token.symbol,
            logo: token.logo,
            balance: _balance,
            price: 0,
            value: 0,
            address: token.erc20Address
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
            value
          });
        } else {
          assetZeroArr.push({
            symbol: item.symbol,
            logo: item.logo,
            balance: item.balance,
            price: _asset.current_price,
            address: item.address,
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
      this.skeletonLoading = false;
      // console.log('assetList',this.assetList)
    },
    assetFromWei(item) {
      return item > 0 ? web3.utils.fromWei(item) : 0;
    },
    walletDetails(value) {
      // this.validatorDialog = true;
      if (!this.type) {
        this.$router.push({
          name: 'MyAccountWallet',
          params: {
            type: 'portfolio',
            token: value.address
          }
        });
      } else {
        this.$router.push({
          name: 'MyAccountWallet',
          params: {
            type: this.type,
            token: value.address
          }
        });
      }
    },
    openRegister() {
      this.dialog = true;
      this.getPublicBls();
    },
    async setRegisterbls() {
      try {
        if (!this.$refs.blsForm.validate()) return;
        if (this.publicKey.slice(0, 2) !== '0x') {
          this.publicKey = '0x' + this.publicKey;
        }
        this.registerLoading = true;
        if (this.connection && this.connection.network){
          if (this.connection.network == 'REI Testnet') {
            let blockHeight = await web3.eth.getBlockNumber();
            if(blockHeight > process.env.VUE_APP_BLS_HARDFORK_HEIGHT_TESTNET){
              bls_contract = process.env.VUE_APP_BLS_HARDFORK_CONTRACT;
            }
          } else if (this.connection.network == 'REI Network') {
            let blockHeight = await web3.eth.getBlockNumber();
            if(blockHeight > process.env.VUE_APP_BLS_HARDFORK_HEIGHT_MAINNET){
              bls_contract = process.env.VUE_APP_BLS_HARDFORK_CONTRACT;
            }
            
          }
        }
        let contract = new web3.eth.Contract(abiBlsRegister, bls_contract);
        const res = await contract.methods.setBLSPublicKey(this.publicKey).send({
          from: this.connection.address
        });
        if (res.transactionHash) {
          this.addTx({
            tx: {
              txid: res.transactionHash,
              type: 'setBLSPublicKey',
              status: 'PENDING',
              data: {
                publicKey: util.addr(this.publicKey)
              },
              timestamp: new Date().getTime()
            }
          });
        }
        this.registerLoading = false;
      } catch (e) {
        console.log(e);
        this.$dialog.notify.warning(e.message);
        this.registerLoading = false;
      }
      this.dialog = false;
      this.registerLoading = false;
    },
    async getPublicBls() {
      this.blsListLoading = true;
      let url = this.apiUrl.graph;
      if (!client_bls) {
        client_bls = new ApolloClient({
          uri: `${url}chainMonitorEvent`,
          cache: new InMemoryCache()
        });
      }
      let address = this.connection.address.toLowerCase();
      const getBlsInfos = gql`
        query blsValidators{
          blsValidators (where: { id: "${address}"}){
            id
            lastBLSPublicKey
            lastSetBlockNumber
            setTime
            setRecord (orderBy: timestamp, orderDirection: desc){
              id
              timestamp
              validator
              blsPublicKey
              blockNumber
              transactionHash
            }
          }
        }
      `;
      const { data: blsData } = await client_bls.query({
        query: getBlsInfos,
        variables: {},
        fetchPolicy: 'network-only'
      });
      let list = blsData.blsValidators;
      if (list.length > 0) {
        this.blsList = list[0].setRecord;
        let max = this.blsList.map((elem) => elem.timestamp).reduce((a, b) => Math.max(a, b));
        this.blsList = this.blsList.map((item) => {
          if (item.timestamp == max) {
            this.status = 'Active';
          } else {
            this.status = 'Inactive';
          }
          return {
            blsPublicKey: item.blsPublicKey,
            timestamp: item.timestamp,
            transactionHash: item.transactionHash,
            status: this.status
          };
        });
      }
      // console.log('blsData', list, this.blsList);
      this.blsListLoading = false;
    },
    cancelRegister() {
      this.dialog = false;
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  max-width: 100% !important;
}
.assets-list:hover {
  cursor: pointer;
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
.dialog-night {
  background-color: #595777;
  padding: 20px 0;
}
.dialog-daytime {
  background-color: #fff;
  padding: 20px 0;
}
.theme--light.v-slide-group__content {
  background-color: #f3f4fa !important;
}
.header-back {
  background: linear-gradient(180deg, #d6e3ff 0%, #ffffff 100%);
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
  padding-left: 50px;
  padding-bottom: 20px;
  .left-address {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .my-address {
      font-weight: bold;
      margin-right: 12px;
      margin-left: 20px;
    }
  }
  .balance {
    margin-right: 60px;
    padding: 26px;
    color: #fff;
    background-color: #6979f8;
    border-radius: 6px;
    width: 30%;
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
.name-hover:hover {
  color: #4856c0;
  text-decoration: underline;
}
.update-list{
  text-align: right;
  margin-bottom:-20px;
}
.hideButton {
  cursor: pointer;
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
.skeleton {
  margin-top: -68px;
}
.register {
  text-align: center;
  margin-left: 10px;
  margin-top: 16px;
  .theme--light.v-btn {
    text-transform: initial !important;
    color: #4696eb;
    background-color: #dde5fc;
  }
  .theme--dark.v-btn {
    text-transform: initial !important;
    color: #868e9e;
    background-color: #4c4a68;
  }
}
.tutorial-link{
  color: #868e9e;
  font-size:14px;
  font-weight: normal;
  margin-left:12px;
}
.tutorial-link:hover{
  color: #4696eb;
  text-decoration: underline;
}
.dialog-btn {
  text-align: center;
  .v-btn {
    text-transform: initial !important;
    color: #fff;
    background-color: #6979f8;
    border-radius: 20px;
    padding: 0 20px;
  }
}
.dialog-validator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .dialog-title {
    margin-left: 12px;
  }
  .close-btn {
    margin-right: 16px;
    padding: 0;
    background-color: transparent;
    cursor: pointer;
  }
}
.public-field {
  margin-left: 20px;
  margin-right: 10px;
}
.bls-public-list {
  margin-top: 30px;
}
.active-bls {
  background-color: #fd9557;
  color: #fff;
  border-radius: 20px;
  padding: 6px 18px;
  text-align: center;
}
.inactive-light {
  background-color: #f2f2f2 !important;
  border-radius: 20px;
  padding: 6px 18px;
  text-align: center;
}
.inactive-dark {
  background-color: #adadad;
  color: #fff;
  border-radius: 4px;
  padding: 6px 18px;
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
@media screen and (max-width: 900px) {
  .myAccount {
    padding-left: 20px;
    padding-right: 20px;
  }
  .balance {
    margin-top: 20px;
    margin-right: 40px !important;
    width: 100%;
  }
}
.logoWrap {
  display: inline;
}
</style>
