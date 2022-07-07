<template>
  <v-container style="padding: 0">
    <v-card class="bridge-user">
      <v-row justify="space-between">
        <v-col cols="12" md="5"><h3>Bridge asset Management on REI Network</h3></v-col>
        <v-col class="title-right" cols="12" md="6">
          <v-row>
            <v-btn text outlined color="validator">
              <span class="iconfont">&#xe619;</span>
            Submit Token Info
          </v-btn>
          <v-btn text outlined color="validator" @click="openGrantRole()">
            <span class="iconfont">&#xe618;</span>
            Add minter
          </v-btn>
          <v-btn text outlined color="validator" @click="openGreatToken()">
            <span class="iconfont">&#xe601;</span>
            Create your token
          </v-btn>
          </v-row>
        </v-col>
      </v-row>
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
                        <span class="label-text">{{ item.name }}</span>
                        <v-icon size="16">mdi-open-in-new</v-icon>
                    </div>
                  </template>
                  <template v-slot:item.target="{ item }">
                     <div class="bridge-label">
                        <div class="left-img">
                          <v-img src="../assets/images/total.png" class="logo-img"  height="24" width="24"/>
                        </div>
                        <span class="label-text">{{ item.targetChain }}</span>
                    </div>
                  </template>
                   <template v-slot:item.address="{ item }">
                     <span class="minter-address">{{ item.mintAddress | addr }}</span>
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
                  <template v-slot:item.operation="{ item }">
                  <v-btn  small color="vote_button" class="mr-2" style="color: #fff" @click="openMinterCap(item)" height="32">
                      Set Minter Cap
                    </v-btn>
                    <v-btn  small color="start_unstake" class="mr-2" @click="openRevoke(item)" height="32">
                      Revoke
                    </v-btn>
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
                      <div :style="{marginLeft:item.menuUp+'%'}" class="minter-item">
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
      <v-dialog v-model="setMinterCupDialog" width="500">
        <v-card class="minter-card">
          <v-row justify="space-between" class="dialog-title">
            <v-col cols="12" md="10">
              <h3>Set Minter Cap</h3>
            </v-col>
           <v-col cols="12" md="1" @click="cancelMinterCap()" class="close-dialog">
              <v-icon>mdi-close</v-icon>
            </v-col>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Token</span>
            <strong>Binance USD (BUSD) </strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Target Chain</span>
            <strong>BNB Smart Chain</strong>
          </v-row>
          <v-row justify="space-between" class="set-minter">
            <div>
              <span class="left-title">Used Amount:</span> 
              <strong> 360,510.69 </strong>
            </div>
            <div>
              <span class="left-title">Max:</span> 
              <strong> 10M </strong> 
              <span class="left-title">USDT</span>
            </div>
          </v-row>
          <v-progress-linear color="#6979F8" rounded background-color="#F5F5F5" value="70%"></v-progress-linear>
          <div class="">
            <div>0</div>
            <div  class="minter-item" style="margin-left:70%">
              <v-icon color="#6979F8">mdi-menu-up</v-icon>
              <span>70%</span>
            </div>
          </div>
          <div class="min-minter ">
            <span class="left-title">Min Minter Cap:</span> 
            <strong> 360,510,69 </strong>
            <span class="left-title">USDT</span>
          </div>
          <v-row class="from-voting" justify="space-between">
              <v-col  cols="12" md="2">
                <div class="input-title">Minter Cap</div>
              </v-col>
                <v-col cols="12" md="10">
                  <v-text-field 
                    required
                    outlined 
                    background-color="input_other" 
                    class="text-filed"
                    :rules="addressRules"
                  >
                </v-text-field>
                </v-col>
            </v-row>
            <div class="submit-btn">
            <v-btn  small color="vote_button" class="mr-4" style="color: #fff" height="32" width="120">
                Set 
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="RevokeDialog" width="500">
        <v-card class="minter-card">
          <v-row justify="space-between" class="dialog-title">
            <v-col cols="12" md="10">
              <h3>Do you want to revoke this Minter ?</h3>
            </v-col>
            <v-col cols="12" md="1" @click="cancelRevoke()" class="close-dialog">
              <v-icon>mdi-close</v-icon>
            </v-col>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Token</span>
            <strong>Binance USD (BUSD) </strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Minter Cap</span>
            <strong>10M</strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Target Chain</span>
            <strong>BNB Smart Chain</strong>
          </v-row>
          <v-divider class="revoke-divider" />
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Minter Address</span>
            <strong>0xADbBf74bc8d9CFfeC78526169cd81FdcBbA35eC2</strong>
          </v-row>
          <div class="text-center">
             <v-btn  small outlined color="#868E9E" class="mr-4 revoke-btn" height="32" width="80">
                no
            </v-btn>
            <v-btn  small color="vote_button" class="mr-4 revoke-btn" style="color: #fff" height="32" width="80">
                yes  
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="grantRoleDialog" width="580">
        <v-card class="minter-card">
          <v-row justify="space-between" class="dialog-title" no-gutters>
            <v-col cols="12" md="10">
              <h3>Grant Role</h3>
            </v-col>
            <v-col cols="12" md="1" @click="cancelGrantRole()" class="close-dialog">
              <v-icon>mdi-close</v-icon>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="3" class="left-title contract">Contract Address</v-col>
            <v-col cols="12" md="9">
              <v-combobox
               outlined
               label="Address"
               :items="ContractItems"
               v-model="contractAddress"
               >
               </v-combobox>
            </v-col>
          </v-row>
          <div style="display:none;">
            <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Token</span>
            <strong>Binance USD (BUSD) </strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Target Chain</span>
            <strong>BNB Smart Chain</strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Decimals</span>
            <strong>18 </strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Total Supply</span>
            <strong>1,000,000.00</strong>
          </v-row>
          </div>
          <v-row no-gutters>
            <v-col cols="12" md="3" class="left-title contract">Minter Address</v-col>
            <v-col cols="12" md="9">
              <v-row no-gutters>
                <v-col cols="12" md="10">
                  <v-combobox
                    outlined
                    label="Address"
                    :items="items"
                    v-model="minterAddress"
                  >
                  </v-combobox>
                </v-col>
                <v-col cols="12" md="2">
                 <v-img src="../assets/images/add.png"  class="add-plus" />
               </v-col>
              </v-row>
            </v-col>
            <!-- <v-col cols="12" md="1">
             <v-img src="../assets/images/add.png"  class="add-plus" />
            </v-col> -->
          </v-row>
          <div style="display:none;">
             <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Token</span>
            <strong>Binance USD (BUSD) </strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Target Chain</span>
            <strong>BNB Smart Chain</strong>
          </v-row>
          </div>
          <div class="submit-btn">
            <v-btn  small color="vote_button" class="mr-4" style="color: #fff" height="32" width="120">
                Grant 
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="greatTokenDialog" width="500">
        <v-card class="minter-card">
          <v-row justify="space-between" class="dialog-title">
            <v-col cols="12" md="10">
              <h3>Create Your Token</h3>
            </v-col>
           <v-col cols="12" md="1" @click="cancelGreatToken()" class="close-dialog">
              <v-icon>mdi-close</v-icon>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div class="create-field">
                <div class="left-title">Contract Address</div>
                <v-text-field 
                  label="1-16 characters" 
                  required 
                  outlined 
                  background-color="input_other" 
                  class="text-filed from-voting"
                  :rules="addressRules"
                  >
                </v-text-field>
              </div>
              <div class="create-field">
                <div class="left-title">Token Name</div>
                <v-text-field 
                  label="1-16 characters" 
                  required 
                  outlined 
                  background-color="input_other" 
                  class="text-filed from-voting"
                  :rules="TokenRules"
                  >
                </v-text-field>
              </div>
              <div class="create-field">
                <div class="left-title">Decimals</div>
                <v-text-field 
                  label="Default value : 18" 
                  required 
                  outlined 
                  background-color="input_other" 
                  class="text-filed from-voting"
                  :rules="addressRules"
                  >
                </v-text-field>
              </div>
            </v-col>
          </v-row>
          <v-row justify="space-between">
            <div>
              <span class="left-title">Services Fees : </span>
              <strong class="service-fees">10 </strong>
              <span class="left-title">REI</span>
            </div>
            <v-btn  small color="vote_button" class="mr-4" style="color: #fff" height="32" width="120">
                Great 
            </v-btn>
          </v-row>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { mapActions, mapGetters } from 'vuex';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core'
import abiBridgedERC20 from '../abis/abiBridgedERC20'
import abiFactory from '../abis/abiFactory'
import dayjs from 'dayjs';
import util from '../utils/util';
import filters from '../filters';
import Web3 from 'web3';
import find from 'lodash/find';
const mintAddress = require('../bridges/mintAddress/index.json')

const testFactory = '0xb2C9dCC0604A379E65F0C7B4288C6663144B12C7'

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
  filters,
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
      setMinterCupDialog:false,
      RevokeDialog:false,
      grantRoleDialog:false,
      greatTokenDialog:false,
      contractAddress:"",
      minterAddress:"",
      headers: [
            {text:'Label', value: 'label'},
            { text: 'Target Chain', value: 'target' },
            { text: 'Minter Cap', value: 'minter' },
            { text: 'Address', value: 'address' },
            { text: 'Operation', value: 'operation' },
        ],
        bridgeList:[
          // {
          //   name:"USDT",
          //   targetChain:"Binance Smart Chain",
          //   mintAddress:"gdt61...83265",
          //   minter:60,
          // },
          // {
          //   name:"USDT",
          //   targetChain:"Binance Smart Chain",
          //   mintAddress:"gd003...r3216",
          //   minter:88,
          // }
        ],
        ContractItems:["1k3o348brr40kk092933","00000yu8760k67234333"],
        items:["1q2w3e4r5t6y7u8iou","0a9s8d7f6gh5j4k3l"],
        addressRules: [(v) => !!v || this.$t('msg.please_input_address')],
        TokenRules:[(v) => !!v || "Please enter the token"]
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
        //this.createrERC20()
        console.log('resultList',resultList)
        let arr = [];
        for(let i = 0;i < resultList.length; i++){
          console.log(resultList[i].erc20Address)
          let list =  await this.getTokenInfo(resultList[i].erc20Address);
          console.log('list',list)
          arr = arr.concat(list)
        }
        this.bridgeList = arr;
        console.log('bridgeList',this.bridgeList)
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
      console.log('token',symbol,name)
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
    },
    async createrERC20(){
      try {
        let newERC20 = {
          name: 't USD',
          symbol: 'TUSD',
          decimals: 18
        }
        let contract = new web3.eth.Contract(abiFactory,testFactory);
        let res = await contract.methods.create(newERC20.name, newERC20.symbol, newERC20.decimals).send({
            from: this.connection.address,
            value: web3.utils.numberToHex(web3.utils.toWei('10'))
        });
        if(res.transactionHash) {
            console.log(res);
            this.addTx({
              tx: {
                txid: res.transactionHash,
                type: 'issue',
                status: 'PENDING',
                data: {
                  name: newERC20.symbol
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
    openMinterCap(value){
      this.setMinterCupDialog = true;
      console.log('value',value)
    },
    cancelMinterCap(){
      this.setMinterCupDialog = false;
    },
    openRevoke(value){
      this.RevokeDialog = true;
      console.log('value2',value)
    },
    cancelRevoke(){
      this.RevokeDialog = false;
    },
     openGrantRole(){
      this.grantRoleDialog = true;
    },
    cancelGrantRole(){
      this.grantRoleDialog = false;
    },
    openGreatToken(){
      this.greatTokenDialog = true;
    },
    cancelGreatToken(){
      this.greatTokenDialog = false;
    }
  }
};
</script>

<style scoped lang="scss">
.vote-list{
  margin-top:30px;
}
.v-btn {
  text-transform: none !important;
  }
.bridge-user {
  padding: 20px;
  .v-tab {
    text-transform: none !important;
    margin-left: 0 !important;
  }
.title-right{
  margin-top: 10px;
  .v-btn.v-btn--outlined.v-btn--text{
    border:none;
  }
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
      margin-right: 12px;
    }
    .minter-address{
      font-size: 12px;
      color: lightgray;
      
    }
  }
}
.submit-btn{
  text-align: right;
  margin-top:20px;
}
 .minter-cap{
    padding: 12px;
    font-size: 12px;
    width: 340px;
  }
  .set-minter{
    padding: 12px;
  }
  .process{
    font-size: 12px;
    display: flex;
  }
  .left-title{
    color: #868E9E;
  }
.minter-card{
  padding: 30px;
  .dialog-title{
    margin-bottom: 20px;
  }
  .title-row{
    margin: 8px 0;
  }
  .revoke-divider{
    margin: 16px 0;
  }
  .min-minter{
    text-align: right; 
  }
  .create-field{
    margin-top:8px;
  }
  .from-voting {
  margin-top: 12px;
  .input-title {
    color: #868e9e;
    margin-top: 15px;
    text-align: center;
    height: 40px;
    }
  }
.text-center{
  margin-top:20px;
  text-align: right !important;
  }
  .service-fees{
    font-size: 28px;
  }
  .contract{
    margin-top: 12px;
  }
  .add-plus{
    text-align: right;
    width:56px;
    margin-left: 8px;
  }
}
@media screen and (max-width: 900px) {
}
</style>
