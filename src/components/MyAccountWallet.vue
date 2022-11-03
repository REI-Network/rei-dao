<template>
  <v-container class="stake_background wallet">
    <div class="header-title">
      <div class="title-detailed">
        <span><a class="back-voting" @click="routeLink()">Wallet</a></span> / <span class="rei-fans">RDoge</span>
      </div>
    </div>
    <v-row>
      <v-col>
        <v-card class="info-header">
          <v-row align="center">
            <v-col cols="12" md="9">
              <v-row>
                <div>
                  <v-img class="img" src="../assets/images/rei.svg" width="48" height="48" />
                </div>
                <div>
                  <h3>RDoge</h3>
                  <div>
                    <span class="font-grey">Contract address:0xADbBf74bc8d9CFfeC78526169cd81FdcBbA352eC2</span>
                    <v-btn class="copy-btn" @click="copyAddr()">
                      <v-icon small color="#868E9E">{{ addrCopying ? 'mdi-checkbox-marked-circle-outline' : 'mdi-content-copy' }}</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-row>
            </v-col>
            <v-col cols="12" md="3" style="text-align: right">
              <v-btn small color="start_unstake" class="mr-4 font-btn" height="32">Add Token to Metamask</v-btn>
            </v-col>
          </v-row>
          <v-card outlined class="vote-number">
            <v-row justify="space-between">
              <v-col>
                <div class="font-grey">Price</div>
                <h2>$0.03</h2>
              </v-col>
              <v-col cols="12" md="4">
                <div class="font-grey">Total Supply</div>
                <h2>132,670,764,300 RDoge</h2>
              </v-col>
              <v-col>
                <div class="font-grey">Holders</div>
                <h2>124</h2>
              </v-col>
              <v-col>
                <div class="font-grey">Transfers</div>
                <h2>838</h2>
              </v-col>
              <v-col>
                <div class="font-grey">Decimals</div>
                <h2>9</h2>
              </v-col>
            </v-row>
          </v-card>
        </v-card>
        <v-card class="card-list">
          <v-tabs v-model="tab1" align-with-title class="vote-list" background-color="background">
            <v-tab style="margin-left: 0" key="11" class="v-tab-left">Token Holders</v-tab>
            <v-tab key="12" class="v-tab-left">Token Transfers</v-tab>
          </v-tabs>
          <v-divider class="faq_border" />
          <v-tabs-items v-model="tab1">
            <v-tab-item key="11">
              <v-data-table :headers="holderHeaders" :items="holderList" class="elevation-0" hide-default-footer :items-per-page="itemsPerPage" :loading="loading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="page" @page-count="pageCount = $event">
                <template v-slot:item.delegator="{ item }">
                  <Address :val="item.delegator"></Address>
                  <span class="mine" v-if="item.delegator == connection.address">mine</span>
                </template>
                <template v-slot:item.amount="{ item }">
                  <span>{{ item.amount | asset(2) }}</span>
                </template>
              </v-data-table>
              <div class="text-center pt-2" v-if="holderList.length > 0">
                <v-pagination v-model="page" :length="pageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
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
import { getPrice, postRpcRequest } from '../service/CommonService';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core'
import find from 'lodash/find';

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT;
let client = null;

export default {
  filters,
  components: {},
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      transferPage: 1,
      transferCount: 0,
      transferPerPage: 20,
      loading: false,
      transferLoading: false,
      addrCopying: false,
      tab1: null,
      stakeManagerContract:null,
      stakeManageInstance:null,
      myTotalStake:0,
      holderHeaders: [
        { text: 'Rank', value: 'rak' },
        { text: 'Address', value: 'address' },
        { text: 'Balance(REI)', value: 'balance' },
        { text: 'Txn Count', value: 'count' },
        { text: 'Percentage', value: 'percentage' }
      ],
      holderList: [],
      transferHeaders: [],
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
      '$store.state.connection': function() {
      if(this.connection && this.connection.network){
          this.connect();
          this.getBalance();
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
      dark: 'dark'
    })
  },
  methods: {
      connect() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
    },
     async init(){
        let contract = new web3.eth.Contract(abiConfig,config_contract); 
        this.stakeManagerContract = await contract.methods.stakeManager().call();
        this.stakeManageInstance = new web3.eth.Contract(abiStakeManager,this.stakeManagerContract);
        await this.getMyStakeInfo();
        await this.getTotalGasStake();
    },
    
     async getMyStakeInfo() {
        let url = this.apiUrl.graph;
        client = new ApolloClient({
            uri: `${url}chainmonitor`,
            cache: new InMemoryCache(),
        })
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
        }`
        const {data:{stakeInfos}} = await client.query({
            query: myStakesInfo,
            variables: {
            },
            fetchPolicy: 'cache-first',
        })
        if(stakeInfos.length>0){
            let myStakeValidatorMap = stakeInfos.map((item)=>{
                return this.stakeManageInstance.methods.validators(item.validator).call()
            })

            let validators = await Promise.all(myStakeValidatorMap);
            let balanceOfShareMap = validators.map(item => {
                return this.getBalanceOfShare(item);
            })
            let balanceOfShare = await Promise.all(balanceOfShareMap);
            let total = 0;
            for(let i = 0;i < balanceOfShare.length;i++){
                total = web3.utils.toBN(total).add(web3.utils.toBN(balanceOfShare[i].amount))
            }
            this.myTotalStake = total;
        }
    },
    async getBalanceOfShare(activeValidatorsShare) {
        let commissionShare = new web3.eth.Contract(abiCommissionShare,activeValidatorsShare[1]);
        let balance = 0;
        let amount = 0;
        if(this.connection.address){
            balance = await commissionShare.methods.balanceOf(this.connection.address).call();
            if(balance>0){
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
    async getTotalGasStake(){
         let apiUrl = this.apiUrl.rpc;
         let arr = [];
         arr.push(this.connection.address);
         arr.push('latest')
         let param = {
             method:'rei_getTotalAmount',
             params:arr
         }
        let res = await postRpcRequest(apiUrl,param);
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
            value: 0
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
            value
          });
        } else {
          assetZeroArr.push({
            symbol: item.symbol,
            logo: item.logo,
            balance: item.balance,
            price: _asset.current_price,
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

      console.log('assetList', this.assetList);
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
.wallet {
  padding-left: 40px;
  padding-right: 40px;
}
.v-tab {
  text-transform: none !important;
}
.info-header {
  padding: 28px;
  .img {
    margin-right: 12px;
  }
  .copy-btn.v-btn.v-btn--has-bg {
    background-color: transparent !important;
    margin-top: -8px;
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
@media screen and (max-width: 900px) {
  .wallet {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
