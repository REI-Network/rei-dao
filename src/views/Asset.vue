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
                <v-radio-group mandatory row dense style="margin-top: 0" class="trend-tab" v-model="radios">
                  <v-tab key="11" to="/asset/rei">
                    <v-radio  value="1" class="trends-radio"> </v-radio> REI
                  </v-tab>
                  <v-tab key="12" to="/asset/erc20">
                    <v-radio  value="2" class="trends-radio"> </v-radio> ERC20
                  </v-tab>
                  <v-tab key="13" to="/asset/erc1155">
                    <v-radio value="3" class="trends-radio">  </v-radio> ERC1155
                  </v-tab>
                  <v-tab key="14" to="/asset/erc721">
                    <v-radio  value="4" class="trends-radio"> </v-radio> ERC721
                  </v-tab>
                </v-radio-group>
              </v-tabs>
            </v-col>
            <!-- <v-col cols="12" md="4">
              <v-text-field label="" outlined dense></v-text-field>
            </v-col> -->
          </v-row>
          <v-tabs-items v-model="tab2">
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
                  <v-tabs  align-with-title class="vote-list" background-color="background">
                    <v-tab style="margin-left: 0" key="11" class="v-tab-left">Token Holders</v-tab>
                    <!-- <v-tab key="12" class="v-tab-left">Token Transfers</v-tab> -->
                  </v-tabs>
                  <v-divider class="faq_border" />
                    <v-data-table :headers="accountHeaders" :items="holderList" class="elevation-0" hide-default-footer :items-per-page="reiPerPage" :loading="loading" :no-data-text="$t('msg.nodatatext')" loading-text="" :page.sync="reiPage" @page-count="reiPageCount = $event">
                      <template v-slot:item.rank="{ item }">
                        <span>{{ item.rank }}</span>
                      </template>
                      <template v-slot:item.address="{ item }">
                        <a :class="dark ? 'link-dark' : 'link-light'" :href="`https://scan.rei.network/address/${item.address}`" target="_blank"><AddressTag :val="item.address" :contractName="item.contractName"></AddressTag></a>
                      </template>
                      <template v-slot:item.balance="{ item }">
                        <span>{{ item.balance | asset(5) }}</span>
                      </template>
                      <template v-slot:item.percentage="{ item }">
                        <span>{{ item.percentage | asset(3) }} %</span>
                        <v-progress-linear color="#2115E5" rounded :value="item.percentage"></v-progress-linear>
                      </template>
                    </v-data-table>
                    <v-skeleton-loader class="skeleton" v-if="skeletonLoading == true" :loading="skeletonLoading" type="table-tbody,actions"></v-skeleton-loader>
                    <div class="turn-pages" align-content="end" v-if="holderList.length > 0">
                      <v-btn elevation="3" :disabled="disabled" @click="ForwardPage" class="turn-btn">
                        <v-icon>mdi-chevron-left</v-icon>
                      </v-btn>
                      <v-btn elevation="3" @click="BackwardPage" class="turn-btn">
                        <v-icon>mdi-chevron-right</v-icon>
                      </v-btn>
                    </div>
                  <!-- </v-card> -->
                </v-tab-item>
              </v-col>
            </v-row>
            <v-row style="margin-top: 0">
              <v-col style="margin-top: -12px">
                <v-tab-item key="12">
                  <div class="submit-here">
                    <v-icon size="16" class="wallet-icon font-grey">mdi-arrow-up-thin-circle-outline</v-icon>
                    <a class="font-grey" href="https://github.com/REI-Network/rei-dao/tree/main/info/rei-token-profile" target="_blank">Submit a token support here</a>
                  </div>
                  <v-data-table :headers="headers" :items="list" class="elevation-0 data-table" hide-default-footer :items-per-page="itemsPerPage" :loading="getListLoading" :no-data-text="$t('msg.nodatatext')" loading-text="" :page.sync="page" @page-count="pageCount = $event">
                    <template v-slot:item.assets="{ item }">
                      <v-row align="center" class="assets-list" @click="assetsDetails(item)">
                        <div class="asset-logo">
                          <v-img :src="$IpfsGateway(item.logo)" width="30" height="30"></v-img>
                        </div>
                        <div class="name-hover">{{ item.symbol }}</div>
                      </v-row>
                    </template>
                    <template v-slot:item.price="{ item }">
                      <span>${{ item.price | asset(5) }}</span>
                    </template>
                    <template v-slot:item.address="{ item }">
                      <a :href="`https://scan.rei.network/token/${item.address}`" target="_blank" :class="dark ? 'link-dark' : 'link-light'"
                        ><div>{{ item.address | addr }}</div></a
                      >
                    </template>
                    <template v-slot:item.totalSupply="{ item }">
                      <span>${{ item.totalSupply }} {{ item.symbol }}</span>
                    </template>
                    <template v-slot:item.value="{ item }">
                      <span>${{ item.value | asset(5) }}</span>
                    </template>
                  </v-data-table>
                  <v-skeleton-loader v-if="nftSkeletonLoading == true" class="skeleton" :loading="nftSkeletonLoading" type="table-tbody,actions"></v-skeleton-loader>
                  <div class="text-center pt-2" v-if="assetList.length > 10">
                    <v-pagination v-model="page" :length="pageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
                  </div>
                </v-tab-item>
              </v-col>
            </v-row>
            <v-row style="margin-top: 0">
              <v-col style="margin-top: -12px">
                <v-tab-item key="13">
                  <div class="submit-here">
                    <v-icon size="16" class="wallet-icon font-grey">mdi-arrow-up-thin-circle-outline</v-icon>
                    <a class="font-grey" href="https://github.com/REI-Network/rei-dao/tree/main/info/rei-token-profile" target="_blank">Submit a token support here</a>
                  </div>
                  <v-data-table :headers="nftHeaders" :items="nftList" class="elevation-0 data-table" hide-default-footer :items-per-page="nftPerPage" :loading="getNftListLoading" :no-data-text="$t('msg.nodatatext')" loading-text="" :page.sync="nftPage" @page-count="nftPageCount = $event">
                    <template v-slot:item.assets="{ item }">
                      <v-row align="center" class="assets-list" @click="assetsNft(item)">
                        <div class="asset-logo">
                          <!-- <video v-if="!item.imageShow" controls preload="meta" class="video-play" :src="item.image" :poster="poster"></video> -->
                          <v-img :src="$IpfsGateway(item.image)" width="40" height="40" lazy-src="../assets/images/logo_bg.png"></v-img>
                        </div>
                        <div class="name-hover">{{ item.name }}</div>
                      </v-row>
                    </template>
                    <template v-slot:item.address="{ item }">
                      <a :href="`https://scan.rei.network/token/${item.address}`" target="_blank" :class="dark ? 'link-dark' : 'link-light'"
                        ><div>{{ item.address | addr }}</div></a
                      >
                    </template>
                    <template v-slot:item.totalSupply="{ item }">
                      <span>{{ item.totalSupply }}</span>
                    </template>
                  </v-data-table>
                  <v-skeleton-loader class="skeleton" v-if="nftSkeletonLoading2 == true" :loading="nftSkeletonLoading2" type="table-tbody,actions"></v-skeleton-loader>
                  <div class="text-center pt-2" v-if="nftList.length > 10">
                    <v-pagination v-model="nftPage" :length="nftPageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
                  </div>
                </v-tab-item>
              </v-col>
            </v-row>
            <v-row style="margin-top: 0">
              <v-col style="margin-top: -12px">
                <v-tab-item key="14">
                  <div class="submit-here">
                    <v-icon size="16" class="wallet-icon font-grey">mdi-arrow-up-thin-circle-outline</v-icon>
                    <a class="font-grey" href="https://github.com/REI-Network/rei-dao/tree/main/info/rei-token-profile" target="_blank">Submit a token support here</a>
                  </div>
                  <v-data-table :headers="nftHeaders2" :items="nftList2" class="elevation-0 data-table" hide-default-footer :items-per-page="nftPerPage2" :loading="getNft721ListLoading" :no-data-text="$t('msg.nodatatext')" loading-text="" :page.sync="nftPage2" @page-count="nftPageCount2 = $event">
                    <template v-slot:item.assets="{ item }">
                      <v-row align="center" class="assets-list" @click="getNftCollection(item)">
                        <div class="asset-logo">
                          <!-- <video v-if="!item.imageShow" controls preload="meta" class="video-play" :src="item.image" :poster="poster"></video> -->
                          <v-img :src="$IpfsGateway(item.image)" width="40" height="40" lazy-src="../assets/images/logo_bg.png"></v-img>
                        </div>
                        <div class="name-hover">{{ item.name }}</div>
                      </v-row>
                    </template>
                    <template v-slot:item.address="{ item }">
                      <a :href="`https://scan.rei.network/token/${item.address}`" target="_blank" :class="dark ? 'link-dark' : 'link-light'"
                        ><div>{{ item.address | addr }}</div></a
                      >
                    </template>
                    <template v-slot:item.totalSupply="{ item }">
                      <span>{{ item.totalSupply }}</span>
                    </template>
                  </v-data-table>
                  <v-skeleton-loader class="skeleton" v-if="nftSkeletonLoading3 == true" :loading="nftSkeletonLoading3" type="table-tbody,actions"></v-skeleton-loader>
                  <div class="text-center pt-2" v-if="nftList2.length > 10">
                    <v-pagination v-model="nftPage2" :length="nftPageCount2" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
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
import AddressTag from '../components/AddressTag';
import filters from '../filters';
import abiERC20 from '../abis/abiERC20';
import abiBadgesNFT from '../abis/abiBadgesNFT';
import abiCommissionShare from '../abis/abiCommissionShare';
import abiERC721 from '../abis/abiERC721';
import { getPrice, postRpcRequest, getReiSatistic, getTokenHolder, getHistoryData, getNftHolder } from '../service/CommonService';
import find from 'lodash/find';

export default {
  components: {
    AddressTag
  },
  filters,
  data() {
    return {
      poster: require('../assets/images/Genesis.png'),
      skeletonLoading:true,
      nftSkeletonLoading:true,
      nftSkeletonLoading2:true,
      nftSkeletonLoading3:true,
      tab1: 0,
      tab2: 1,
      radios: 1,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      nftPage: 1,
      nftPageCount: 0,
      nftPerPage: 50,
      nftPage2: 1,
      nftPageCount2: 0,
      nftPerPage2: 50,
      reiPage: 1,
      reiPageCount: 0,
      reiPerPage: 50,
      transferPage: 1,
      transferCount: 0,
      transferPerPage: 20,
      transferLoading: false,
      loading: false,
      getListLoading: false,
      getNftListLoading: false,
      getNft721ListLoading: false,
      stakeManagerContract: null,
      stakeManageInstance: null,
      imageShow: true,
      myTotalStake: 0,
      reiBalance: 0,
      totalGasAmount: 0,
      current_price: 0,
      totalSupply: 0,
      lastAddress: '',
      lastBalance: '',
      count: 50,
      countPage: 0,
      nftConfig: [],
      dataList: [],
      disabled: true,
      totalList: [],
      list: [],
      accountList: [],
      holderList: [],
      type:'',
      routerMap:{
        'rei': {
          index: 0,
          value: '1'
        },
        'erc20': {
          index: 1,
          value: '2'
        },
        'erc1155': {
          index: 2,
          value: '3'
        },
        'erc721': {
          index: 3,
          value: '4'
        }
      },
      accountHeaders: [
        { text: 'Rank', value: 'rank' },
        { text: 'Address', value: 'address' },
        { text: 'Balance(REI)', value: 'balance' },
        // { text: 'Txn Count', value: 'count' },
        { text: 'Percentage', value: 'percentage' }
      ],
      transferHeaders: [
        { text: 'Txn Hash', value: 'hash' },
        { text: 'Method', value: 'method' },
        { text: 'Block', value: 'block' },
        { text: 'From', value: 'from' },
        { text: 'To', value: 'to' },
        { text: 'Amount', value: 'amount' }
      ],
      transferList: [],
      headers: [
        { text: 'Assets', value: 'assets' },
        { text: 'Price', value: 'price' },
        { text: 'Contract Address', value: 'address' },
        { text: 'Circulation Supply', value: 'totalSupply' },
        { text: 'Address count', value: 'count' }
      ],
      nftHeaders: [
        { text: 'Assets', value: 'assets' },
        { text: 'Contract Address', value: 'address' },
        { text: 'Total Supply', value: 'totalSupply' },
        // { text: 'Tx', value: 'tx' },
        { text: 'Holders', value: 'holders' }
      ],
      nftHeaders2: [
        { text: 'Assets', value: 'assets' },
        { text: 'Contract Address', value: 'address' },
        { text: 'Total Supply', value: 'totalSupply' },
        // { text: 'Tx', value: 'tx' },
        { text: 'Holders', value: 'holders' }
      ],
      nftList: [],
      nftList2: [],
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
      ],
      testConfigList: [
        {
          address: '0xe917cd524261D27dbF7d629C86eDAC8fd7b7885d',
          image: 'bafkreiccsx2nsqufbopovi6y7dkhmxign46hjqbnhtryvrfvvm7pps7o4u',
          name: 'Genesis Proposal Badges NFT',
          organization: 'REI DAO'
        }
      ],
      prodConfigList: [
        {
          address: '0x4035374c2c157F46effeA16e71A62b8992F2AD1b',
          image: 'bafkreiccsx2nsqufbopovi6y7dkhmxign46hjqbnhtryvrfvvm7pps7o4u',
          name: 'Genesis Proposal Badges NFT',
          organization: 'REI DAO',
          token_standard: 'ERC-1155'
        },
        {
          address: '0x479a57Bb8Dd14FCa3Beeb63825126ebE16f2Ff2d',
          image: 'bafkreih6tkghnjtb3mdemvemr4t6htzhxckuq3aizmebuw6b6adhncz4ga',
          name: 'Korean Community NFT',
          organization: 'REI DAO',
          token_standard: 'ERC-1155'
        },
        // {
        //   address: '0x490b641A3B87c3C769E24e850163E9aAb23b4E8B',
        //   image: 'bafkreibzg4wuxoke3lcepdtwqq2y55aprzvtbw6qwntrsf2yvq73iy3gee',
        //   name: 'ReiFans NFT',
        //   organization: 'REI DAO',
        //   token_standard: 'ERC-1155'
        // },
        {
          address: '0xE4EDC855717281b994A6E2E43c98791dBCE497DA',
          image: 'bafkreieajvu4ze4tpb7k2zsvb2ow7haqv6datq5gilj2jq746xsefopwwi',
          name: 'beeHive NFT',
          organization: 'beeHive',
          token_standard: 'ERC-721'
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      dark: 'dark',
      connection: 'connection',
      nftInfo: 'nftInfo',
      apiUrl: 'apiUrl',
      addressTags: 'addressTags'
    })
  },
  watch: {
    '$store.state.connection': function () {
      if (this.connection && this.connection.network) {
        this.connect();
        this.getBalance();
        this.getNFTList();
        this.getNFTList721();
      }
    },
    tab1: function(){
        let type = this.$route.params.type;
        this.type = type;
        if(!type){
          this.tab2 = 0;
          this.radios = '1';
        } else {
            this.tab2 = this.routerMap[type].index;
            this.radios = this.routerMap[type].value;
        }
    },
    count(newVal, oldVal) {
      this.getWalletInfo();
      for (let i = 0; i < this.holderList.length; i++) {
        const item = this.holderList[i];
        item.rank += this.count - 50;
      }
      console.log(oldVal);
      if (newVal > 50) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    }
  },
  mounted() {
    this.connect();
    this.getBalance();
    this.getNFTList();
    this.getNFTList721();
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
      } else {
        window.web3 = new Web3('https://rpc.rei.network');
      }
    },

    async getBalance() {
      this.loading = true;
      let asset = [],
        assetAllArr = [],
        assetArr = [];
      this.getListLoading = true;
      let _assetObj = {};
      for (let i = 0; i < this.tokenInfoList.length; i++) {
        let token = this.tokenInfoList[i];
        if (token.symbol == 'REI') {
          _assetObj = {
            symbol: token.symbol,
            logo: token.logo,
            price: 0,
            decimals: token.decimals,
            totalSupply: 1000000000,
            value: 0
          };
        } else {
          let contract = new web3.eth.Contract(abiERC20, token.erc20Address);
          let decimals = token.decimals;
          let total = await contract.methods.totalSupply().call();
          let totalSupply = total / 10 ** decimals;
          _assetObj = {
            symbol: token.symbol,
            logo: token.logo,
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
      for (let i = 0; i < asset.length; i++) {
        let item = asset[i];
        let _asset = find(priceList.data, (items) => items.symbol.toUpperCase() == item.symbol);
        if (item.symbol == 'REI') {
          this.current_price = _asset.current_price;
        } else {
          assetArr.push({
            symbol: item.symbol,
            logo: item.logo,
            price: _asset.current_price,
            address: item.address,
            decimals: item.decimals,
            totalSupply: item.totalSupply
          });
        }
      }

      this.getListLoading = false;
      this.list = assetArr;
      this.getAccountList();
      this.getAddressCount();
      this.loading = false;
      this.skeletonLoading = false;
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
      let parameter = Object.keys(this.$route.query).length;
      if(parameter > 0 ){
        this.count = this.$route.query.count;
        this.countPage = this.$route.query.page-1;
      }
    },
    async BackwardPage() {
      this.loading = true;
      let data = await getTokenHolder({balance:this.lastBalance,hash:this.lastAddress,count:this.count});
      this.accountList = data.data.data;
      for (let i = 0; i < this.accountList.length; i++) {
        let lastItem = this.accountList[this.accountList.length - 1];
        this.lastAddress = lastItem.address;
        this.lastBalance = lastItem.balance;
      }
      this.count += 50;
      this.countPage++;
      this.totalList.push(this.accountList);
      this.loading = false;
      let urlPage = this.countPage+1;
      var _this = this;
      let obj = JSON.parse(JSON.stringify(_this.$router.currentRoute.query));
      Object.assign(obj, { page:urlPage,count: this.count });
      _this.$router.push({
        query: obj
      });
      this.skeletonLoading = false;
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
      let urlPage = this.countPage+1;
      var _this = this;
      let obj = JSON.parse(JSON.stringify(_this.$router.currentRoute.query));
      Object.assign(obj, { page:urlPage,count: this.count });
      _this.$router.push({
        query: obj
      });
    },
    async getWalletInfo() {
      this.holderList = this.accountList.map((item, index) => {
        let rank = index + 1;
        let balance = parseFloat(item.balance) / 1e18;
        let percentage = (balance / 1000000000) * 100;
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
    async getAddressCount() {
      let countList = [];
      for (let i = 0; i < this.list.length; i++) {
        let item = this.list[i];
        let params = {
          module: 'token',
          action: 'getTokenHolders',
          contractaddress: item.address,
          offset: 1000,
        };
        let data = await getHistoryData(params);
        let list = data.data.result;
        let _address = {
          address: item.address,
          data: list
        };
        countList.push(_address);
      }
      this.list = this.list.map((item) => {
        let details = find(countList, (items) => web3.utils.toChecksumAddress(items.address) == web3.utils.toChecksumAddress(item.address));
        let count = details.data.length;
        return {
          ...item,
          count: count
        };
      });
      this.nftSkeletonLoading = false;
    },
    assetsDetails(value) {
      console.log(value);
      this.$router.push({
        name: 'AssetsInfo',
        params: {
          token: value.address,
          type: this.type,
        }
      });
    },
    async getNFTList() {
      this.getNftListLoading = true;
      if (this.connection.network == 'REI Testnet' || this.connection.network == 'REI Devnet') {
        this.nftConfig = this.testConfigList;
      } else {
        this.nftConfig = this.prodConfigList;
      }
      this.nftList = [];
      let nftItems = [];
      for (let i = 0; i < this.nftConfig.length; i++) {
        if (this.nftConfig[i].token_standard == 'ERC-1155') {
          let contract = new web3.eth.Contract(abiBadgesNFT, this.nftConfig[i].address);
          for (let j = 0; ; j++) {
            let flag = await contract.methods.exists(j).call();
            if (flag) {
              let totalSupply = await contract.methods.totalSupply(j).call();
              let address = this.nftConfig[i].address;
              let nftDetail = {
                address,
                organization: this.nftConfig[i].organization,
                totalSupply,
                image: this.nftConfig[i].image,
                tokenId: j,
                token_standard: this.nftConfig[i].token_standard
              };
              nftItems.push(nftDetail);
            } else {
              break;
            }
          }
          let countList = [];
          for (let i = 0; i < nftItems.length; i++) {
            let item = nftItems[i];
            let params = {
              contract: item.address
              // tokenId: item.tokenId
            };
            const { data: holderList } = await getNftHolder(params);
            let list = holderList;
            // console.log('list', list);
            let _address = {
              address: item.address,
              data: list
            };
            countList.push(_address);
          }
          nftItems = nftItems.map((item) => {
            let details = find(countList, (items) => items.address == item.address);
            let holders = details.data.length;
            return {
              ...item,
              holders: holders
            };
          });
          this.nftList = nftItems;
        }
      }
      this.nftSkeletonLoading2 = false;
      this.getNftListLoading = false;
    },
    async getNFTList721() {
      this.getNft721ListLoading = true;
      if (this.connection.network == 'REI Testnet' || this.connection.network == 'REI Devnet') {
        this.nftConfig = this.testConfigList;
      } else {
        this.nftConfig = this.prodConfigList;
      }
      this.nftList2 = [];
      let nftItems2 = [];
      for (let i = 0; i < this.nftConfig.length; i++) {
        if (this.nftConfig[i].token_standard == 'ERC-721') {
          let contract2 = new web3.eth.Contract(abiERC721, this.nftConfig[i].address);
          let totalSupply = await contract2.methods.totalSupply().call();
          let address = this.nftConfig[i].address;
          let nftDetail = {
            name: this.nftConfig[i].name,
            image: this.nftConfig[i].image,
            organization: this.nftConfig[i].organization,
            address,
            totalSupply,
            token_standard: this.nftConfig[i].token_standard
          };
          nftItems2.push(nftDetail);
          let countList = [];
          for (let i = 0; i < nftItems2.length; i++) {
            let item = nftItems2[i];
            let params = {
              contract: item.address
            };
            const { data: holderList } = await getNftHolder(params);
            let list = holderList;
            let _address = {
              address: item.address,
              data: list
            };
            countList.push(_address);
          }
          nftItems2 = nftItems2.map((item) => {
            let details = find(countList, (items) => items.address == item.address);
            let holders = details.data.length;
            return {
              ...item,
              holders: holders
            };
          });
          this.nftList2 = nftItems2;
        }
      }
      // console.log('nftList2', this.nftList2);
      // console.log('nftList', this.nftList);
      this.nftSkeletonLoading3 = false;
      this.getNft721ListLoading = false;
    },
    assetsNft(item) {
      this.$router.push({
        name: 'AssetNft',
        params: {
          address: item.address,
          tokenid: item.tokenId,
          standard: 'erc-1155',
          name: item.name
        }
      });
    },
    getNftCollection(item) {
      this.$router.push({
        name: 'AssetsCollections',
        params: {
          address: item.address
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
.trends-radio {
  margin-right: 0px !important;
  font-size: 16px;
}
.v-tab {
  text-transform: none;
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
.video-play {
  width: 40px !important;
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
.data-table {
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
  .v-btn:not(.v-btn--round).v-size--default {
    min-width: 36px;
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
.theme--light.v-btn.v-btn--has-bg {
  background-color: transparent;
}
.submit-here {
  text-align: right;
  margin-bottom: 10px;
}
.wallet-icon {
  margin-right: 8px;
}
.name-hover:hover {
  color: #4856c0;
  text-decoration: underline;
}
.skeleton {
  margin-top: -68px;
}
@media screen and (max-width: 900px) {
  .stake {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
