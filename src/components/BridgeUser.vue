<template>
  <v-container style="padding: 0">
    <v-card class="bridge-user">
      <h3>Bridge asset Management on REI Network</h3>
      <v-tabs v-model="tab" align-with-title hide-slider class="vote-list" background-color="background">
        <v-radio-group v-model="radios" mandatory row dense style="margin-top: 0" class="trend-tab">
          <v-tab key="1"> <v-radio label="Cbridge" value="1" class="trends-radio"> </v-radio></v-tab>
          <v-tab key="2"> <v-radio label="Multichain" value="2" class="trends-radio"> </v-radio></v-tab>
        </v-radio-group>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item key="1" >
          <v-row class="background">
            <v-col>
               <v-data-table
                  :headers="headers"
                  :items="bridgeList"
                  class="background elevation-0"
                  hide-default-footer
                  :items-per-page="itemsPerPage"
                  :loading="stakeListLoading"
                  :loading-text="$t('msg.loading')"
                  :page.sync="page"
                  @page-count="pageCount = $event"
                >
                  <template v-slot:item.label="{ item }">
                    <div class="bridge-label">
                        <div class="left-img">
                          <v-img src="../assets/images/rei.svg" class="logo-img"  height="24" width="24"/>
                        </div>
                        <span class="label-text">{{ item.label }}</span>
                        <v-icon size="16">mdi-open-in-new</v-icon>
                    </div>
                  </template>
                  <template v-slot:item.target="{ item }">
                     <div class="bridge-label">
                        <div class="left-img">
                          <v-img src="../assets/images/total.png" class="logo-img"  height="24" width="24"/>
                        </div>
                        <span class="label-text">{{ item.target }}</span>
                    </div>
                  </template>
                  <template v-slot:item.minter="{ item }">
                    <v-row justify="space-between" class="minter-cap">
                      <span>Used Amount: 360,510.69</span>
                      <span>Max: 10M USDT</span>
                    </v-row>
                    <v-progress-linear color="#6979F8" rounded background-color="#F5F5F5" :value="item.minter"></v-progress-linear>
                    <div class="process">
                      <div>0</div>
                      <div :style="{marginLeft:item.menuUp+'%'}">
                        <v-icon color="#6979F8">mdi-menu-up</v-icon>
                        <span>{{item.minter}}%</span>
                      </div>
                    </div>
                  </template>
                  <!-- <template v-slot:item="{ item }">
     
                  </template> -->
                </v-data-table>
                <div class="text-pagination pt-2" v-if="bridgeList.length > 0">
                  <v-pagination
                    v-model="page"
                    :length="pageCount"
                    color="vote_button"
                    background-color="start_unstake"
                    class="v-pagination"
                    total-visible="6"
                   ></v-pagination>
               </div>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item key="2" >
          <v-row class="background">
            <v-col>
               <v-data-table
                  :headers="headers"
                  :items="bridgeList"
                  class="background elevation-0"
                  hide-default-footer
                  :items-per-page="itemsPerPage"
                  :loading="stakeListLoading"
                  :loading-text="$t('msg.loading')"
                  :page.sync="page"
                  @page-count="pageCount = $event"
                >
                  <template v-slot:item.label="{ item }">
                    <div class="bridge-label">
                        <div class="left-img">
                          <v-img src="../assets/images/rei.svg" class="logo-img"  height="24" width="24"/>
                        </div>
                        <span class="label-text">{{ item.label }}</span>
                        <v-icon size="16">mdi-open-in-new</v-icon>
                    </div>
                  </template>
                  <template v-slot:item.target="{ item }">
                     <div class="bridge-label">
                        <div class="left-img">
                          <v-img src="../assets/images/total.png" class="logo-img"  height="24" width="24"/>
                        </div>
                        <span class="label-text">{{ item.target }}</span>
                    </div>
                  </template>
                  <template v-slot:item.minter="{ item }">
                    <v-row justify="space-between" class="minter-cap">
                      <span>Used Amount: 360,510.69</span>
                      <span>Max: 10M USDT</span>
                    </v-row>
                    <v-progress-linear color="#6979F8" rounded background-color="#F5F5F5" :value="item.minter"></v-progress-linear>
                    <div class="process">
                      <div>0</div>
                      <div :style="{marginLeft:item.menuUp+'%'}">
                        <v-icon color="#6979F8">mdi-menu-up</v-icon>
                        <span>{{item.minter}}%</span>
                      </div>
                    </div>
                  </template>
                </v-data-table>
                <div class="text-pagination pt-2" v-if="bridgeList.length > 0">
                  <v-pagination
                    v-model="page"
                    :length="pageCount"
                    color="vote_button"
                    background-color="start_unstake"
                    class="v-pagination"
                    total-visible="6"
                   ></v-pagination>
               </div>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { mapActions, mapGetters } from 'vuex';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core'
import abiBridgedERC20 from '../abis/abiBridgedERC20'
import dayjs from 'dayjs';
import Web3 from 'web3';
import find from 'lodash/find';
const mintAddress = require('../bridges/mintAddress/index.json')

const tokenList = gql`
  query getTokenList{
    createNewErc20Results(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      creator
      erc20Address
      name
      symbol
      decimals
      value
      admin
      txHash
      timestamp
    }
  }
`
let client = null;

export default {
  data() {
    return {
      tab: '1',
      radios: null,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      currentItem:{},
      capForm:{},
      grantFrom:{},
      menuUp:0,
      stakeListLoading: false,
      headers: [
            {text:'Label', value: 'label'},
            { text: 'Target Chain', value: 'target' },
            { text: 'Minter Cap', value: 'minter' },
        ],
        bridgeList:[
          {
            label:"USDT",
            target:"Binance Smart Chain",
            minter:60,
          },
          {
            label:"USDT",
            target:"Binance Smart Chain",
            minter:88,
          }
        ]
    };
  },
  watch: {},
  mounted() {
    this.connect();
    this.getdata();
    this.getBridgeList();
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
    async getdata(){
      try{
         let url = this.apiUrl.graph;
        client = new ApolloClient({
            uri: `${url}erc20-factory`,
            cache: new InMemoryCache(),
        })

        //let charts = []
        const {data:{createNewErc20Results:resultList}} = await client.query({
            query: tokenList,
            variables: {
            },
            fetchPolicy: 'cache-first',
        })
        //this.grantRole()
        //this.setMintCap()
        let arr = [];
        for(let i = 0;i < resultList.length; i++){
          console.log(resultList[i].erc20Address)
          let list =  await this.getTokenInfo(resultList[i].erc20Address);
          console.log('list',list)
          arr = arr.concat(list)
        }
        console.log(arr)
       
      } catch(e){
        console.log(e)
      }
    },
    async getTokenInfo(contractAddress){
      let contract = new web3.eth.Contract(abiBridgedERC20, contractAddress);
      const MINTER_ROLE = await contract.methods.MINTER_ROLE().call();
      let totalSupply = await contract.methods.totalSupply().call();
      let symbol = await contract.methods.symbol().call();
      let name = await contract.methods.name().call();
      let decimals = await contract.methods.decimals().call();
      const roleNumber = await contract.methods.getRoleMemberCount(MINTER_ROLE).call();
      let members = [];
      for (var i = 0; i < Number(roleNumber); i++) {
        let member = await contract.methods.getRoleMember(MINTER_ROLE, i).call();
        let mintSupply = await contract.methods.minterSupply(member).call();
        let mintAddressInfo = find(mintAddress.data,(item) => item.mintAddress == member)
        let obj = {
          ...mintAddressInfo,
          cap: mintSupply.cap,
          total: mintSupply.total,
          totalSupply,
          symbol,
          name,
          decimals,
          contractAddress
        }
        members.push(obj);
      }
      return members;
    },
    getBridgeList(){
      this.bridgeList = this.bridgeList.map((item) => {
        let menuUp = item.minter-5
        return{
          ...item,
          menuUp:menuUp
        }
      })
    },
    async grantRole(){
      try {
        let contract = new web3.eth.Contract(abiBridgedERC20, this.grantFrom.contractAddress);
        const MINTER_ROLE = await contract.methods.MINTER_ROLE().call();
        let mintAddress = this.grantFrom.mintAddress;
        let res = await contract.methods.grantRole(MINTER_ROLE, mintAddress).send(
            {
              from: this.connection.address
            })
        if(res.transactionHash) {
            console.log(res);
            this.addTx({
              tx: {
                txid: res.transactionHash,
                type: 'grantRole',
                status: 'PENDING',
                data: {
                  role: 'MINTER_ROLE',
                  to: mintAddress
                },
                timestamp: new Date().getTime()
              }
            });
            //this.dialog = false;
        }
      } catch(e){
        //this.dialog = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
    },
    async revokeRole(){
      try {
        let contract = new web3.eth.Contract(abiBridgedERC20,  this.currentItem.contractAddress);
        const MINTER_ROLE = await contract.methods.MINTER_ROLE().call();
        let mintAddress =  this.currentItem.mintAddress;
        let res = await contract.methods.revokeRole(MINTER_ROLE, mintAddress).send(
            {
              from: this.connection.address
            })
        if(res.transactionHash) {
            console.log(res);
            this.addTx({
              tx: {
                txid: res.transactionHash,
                type: 'revokeRole',
                status: 'PENDING',
                data: {
                  role: 'MINTER_ROLE',
                  to: mintAddress
                },
                timestamp: new Date().getTime()
              }
            });
            //this.dialog = false;
        }
      } catch(e){
        //this.dialog = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
    },
    openSetCap(item){
      this.currentItem = item;
    },
    async setMintCap(){
      try {
        let contract = new web3.eth.Contract(abiBridgedERC20, this.currentItem.contractAddress);
        let mintAddress = this.currentItem.mintAddress;
        let res = await contract.methods.setMinterCap(mintAddress,  web3.utils.numberToHex(web3.utils.toWei(this.capForm.amount))).send(
            {
              from: this.connection.address
            })
        if(res.transactionHash) {
            console.log(res);
            this.addTx({
              tx: {
                txid: res.transactionHash,
                type: 'setMintCap',
                status: 'PENDING',
                data: {
                  to: mintAddress
                },
                timestamp: new Date().getTime()
              }
            });
            //this.dialog = false;
        }
        console.log(res)
      } catch(e){
        //this.dialog = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
    }

  }
};
</script>

<style scoped lang="scss">
.vote-list{
  margin-top:30px;
}
.bridge-user {
  padding: 20px;
  .v-tab {
    text-transform: none !important;
    margin-left: 0 !important;
  }
  .theme--dark.v-application .text-pagination[data-v-b6724c44][data-v-b6724c44]{
    background-color:#1d1a36;
  }
  .bridge-label{
    display: flex;
    align-items: center;
    .left-img{
      height: 24px;
      width: 24px;
    }
    .label-text{
      margin-left: 13px;
      margin-right: 38px;
    }
  }
  .minter-cap{
    padding: 12px;
    font-size: 12px;
  }
  .process{
    font-size: 12px;
    display: flex;
  }
}
@media screen and (max-width: 900px) {
}
</style>
