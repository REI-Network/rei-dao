<template>
  <v-container style="padding: 0">
    <v-card class="bridge-user">
      <v-row justify="space-between">
        <v-col cols="12" md="5"><h3>Bridges Asset Management on REI Network</h3></v-col>
        <v-col class="title-right">
          <v-row justify="end" no-gutters>
            <v-btn text outlined color="validator" v-if="this.connection.address != admin">
              <v-img src="../assets/images/light token info.svg" class="icon-logo" width="16" height="16" />
            Submit Token Info
          </v-btn>
          <v-btn text outlined color="validator" @click="openGrantRole()" v-if="this.connection.address == admin">
            <v-img src="../assets/images/light add minter.svg" class="icon-logo" width="16" height="16" />
            Add minter
          </v-btn>
          <v-btn text outlined color="validator" style="padding-right:4px;" @click="openCreateToken()">
            <v-img src="../assets/images/light create token.svg" class="icon-logo" width="16" height="16" />
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
                  <template v-slot:item.symbol="{ item }">
                    <div class="bridge-label">
                        <div class="left-img">
                          <v-img src="../assets/images/token logo.svg" class="logo-img"  height="32" width="32"/>
                        </div>
                        <span class="label-text">{{ item.symbol }}</span>
                        <v-icon size="16">mdi-open-in-new</v-icon>
                    </div>
                  </template>
                  <template v-slot:item.target="{ item }">
                     <div class="bridge-label">
                        <!-- <div class="left-img">
                          <v-img src="../assets/images/total.png" class="logo-img"  height="24" width="24"/>
                        </div> -->
                        <span >{{ item.targetChain }}</span>
                    </div>
                  </template>
                   <template v-slot:item.address="{ item }">
                     <span class="minter-address">{{ item.mintAddress | addr }}</span>
                  </template>
                  <template v-slot:item.minter="{ item }">
                    <v-row justify="space-between" class="minter-cap">
                      <span>Used Amount: {{ item.total | asset(2) }}</span>
                      <span>Max: {{ item.cap | asset(2) }}USDT</span>
                    </v-row>
                    <v-progress-linear color="#6979F8" rounded background-color="#E2E4EA" :value="item.minter"></v-progress-linear>
                    <div class="process">
                      <!-- <div>0</div> -->
                      <div :style="{marginLeft:item.minter+'%'}">
                        <!-- <v-icon color="#6979F8">mdi-menu-up</v-icon> -->
                        <span>{{item.minter}}%</span>
                      </div>
                    </div>
                  </template>
                  <template v-slot:item.operation="{ item }">
                  <v-btn  small color="#6979F8" class="mr-2" style="color: #fff" @click="openMinterCap(item)" height="32">
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
                  :items="chainList"
                  class="background elevation-0"
                  hide-default-footer
                  :items-per-page="itemsPerPage"
                  :loading="stakeListLoading"
                  :loading-text="$t('msg.loading')"
                  :page.sync="page"
                  @page-count="pageCount = $event"
                >
                  <template v-slot:item.symbol="{ item }">
                    <div class="bridge-label">
                        <div class="left-img">
                          <v-img src="../assets/images/token logo.svg" class="logo-img"  height="32" width="32"/>
                        </div>
                        <span class="label-text">{{ item.symbol }}</span>
                        <v-icon size="16">mdi-open-in-new</v-icon>
                    </div>
                  </template>
                  <template v-slot:item.target="{ item }">
                     <div class="bridge-label">
                        <!-- <div class="left-img">
                          <v-img src="../assets/images/total.png" class="logo-img"  height="24" width="24"/>
                        </div> -->
                        <span>{{ item.targetChain }}</span>
                    </div>
                  </template>
                   <template v-slot:item.address="{ item }">
                     <span class="minter-address">{{ item.mintAddress | addr }}</span>
                  </template>
                  <template v-slot:item.minter="{ item }">
                    <v-row justify="space-between" class="minter-cap">
                      <span>Used Amount: {{ item.total | asset(2) }}</span>
                      <span>Max: {{ item.cap | asset(2) }}USDT</span>
                    </v-row>
                    <v-progress-linear color="#6979F8" rounded background-color="#E2E4EA" :value="item.minter"></v-progress-linear>
                    <div class="process">
                      <!-- <div>0</div> -->
                      <div v-if="item.minter>0" :style="{marginLeft:item.minter+'%'}">
                        <!-- <v-icon color="#6979F8">mdi-menu-up</v-icon> -->
                        <span>{{item.minter}}%</span>
                      </div>
                    </div>
                  </template>
                  <template v-slot:item.operation="{ item }">
                  <v-btn  small color="#6979F8" class="mr-2" style="color: #fff" @click="openMinterCap(item)" height="32">
                      Set Minter Cap
                    </v-btn>
                    <v-btn  small color="start_unstake" class="mr-2" @click="openRevoke(item)" height="32">
                      Revoke
                    </v-btn>
                  </template>
                </v-data-table>
                <div class="text-pagination pt-2" v-if="chainList.length > 0">
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
      <v-dialog v-model="setMinterCapDialog" width="500">
        <v-card class="minter-card" >
          <v-row justify="space-between" class="dialog-title">
            <div>
              <h3>Set Minter Cap</h3>
            </div>
           <div @click="cancelMinterCap()" class="close-dialog">
              <v-icon>mdi-close</v-icon>
            </div>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Token</span>
            <strong>{{ setMinterItem.symbol }} </strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Target Chain</span>
            <strong>{{ setMinterItem.targetChain }}</strong>
          </v-row>
          <v-row justify="space-between" class="set-minter">
            <div>
              <span class="left-title">Used Amount:</span> 
              <strong> {{ setMinterItem.total | asset(2) }} </strong>
            </div>
            <div>
              <span class="left-title">Max:</span> 
              <strong> {{ setMinterItem.cap | asset(2) }} </strong> 
              <span class="left-title">USDT</span>
            </div>
          </v-row>
          <v-progress-linear color="#6979F8" rounded background-color="#E2E4EA" :value="setMinterItem.minter+'%'"></v-progress-linear>
          <div class="">
            <!-- <div>0</div> -->
            <div v-if="setMinterItem.minter > 0" class="minter-item" :style="{marginLeft:setMinterItem.minter+'%'}">
              <!-- <v-icon color="#6979F8">mdi-menu-up</v-icon> -->
              <span>{{setMinterItem.minter}}%</span>
            </div>
          </div>
          <div class="min-minter ">
            <span class="left-title" style="text-align:left">Min Minter Cap:</span> 
            <strong> {{ setMinterItem.total | asset(2) }} </strong>
            <span class="left-title">USDT</span>
          </div>
           <v-form ref="setMinterERCForm" lazy-validation>
          <div class="from-voting" >
              <!-- <v-col  class="cap-name"> -->
                <div class="input-title ">Minter Cap</div>
              <!-- </v-col> -->
                <!-- <v-col> -->
                  <v-text-field 
                    required
                    outlined 
                    background-color="input_other" 
                    class="text-filed"
                    :rules="minterRules"
                    v-model="minterCap"
                  >
                </v-text-field>
                <!-- </v-col> -->
            </div>
            <div class="submit-btn">
            <v-btn  small color="#6979F8" @click="setMintCap()"  style="color: #fff" height="36" width="120">
                Set 
            </v-btn>
          </div>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog v-model="revokeDialog" width="500">
        <v-card class="minter-card">
          <v-row justify="space-between" class="dialog-title">
            <div>
              <h3>Do you want to revoke this Minter ?</h3>
            </div>
            <div @click="cancelRevoke()" class="close-dialog">
              <v-icon>mdi-close</v-icon>
            </div>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Token</span>
            <strong>{{revoke.symbol}} </strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Minter Cap</span>
            <strong>{{ revoke.cap | asset(2) }}</strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Target Chain</span>
            <strong>{{revoke.targetChain}}</strong>
          </v-row>
          <v-divider class="revoke-divider" />
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Minter Address</span>
            <strong  v-if="width > 900 ">{{revoke.mintAddress}}</strong>
            <strong  v-else>{{revoke.mintAddress}}</strong>
          </v-row>
          <div class="text-center">
             <v-btn  small outlined color="#868E9E" class="mr-4 revoke-btn" @click="cancelRevoke()" height="36" width="80">
                NO
            </v-btn>
            <v-btn  small color="#6979F8" class="revoke-btn" style="color: #fff" @click="revokeRole()" height="36" width="80">
                YES 
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="grantRoleDialog" width="580">
        <v-card class="minter-card">
          <v-row justify="space-between" class="dialog-title" no-gutters>
            <div>
              <h3>Grant Role</h3>
            </div>
            <div cols="12" md="1" @click="cancelGrantRole()" class="close-dialog">
              <v-icon>mdi-close</v-icon>
            </div>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="3" class="left-title contract">Contract Address</v-col>
            <v-col cols="12" md="9">
              <v-autocomplete
               outlined
               label="Address"
               :items="contractItems"
               v-model="selectContractAddress"
               item-text="erc20Address"
               item-value="erc20Address"
               @change="selectContractChange"
               >
                  <template v-slot:selection="data">
                      <div>{{ data.item.erc20Address | addr }}</div>
                  </template>
                  <template v-slot:item="data">
                    <div v-if="width>900">{{ data.item.erc20Address }}</div>
                    <div v-else>{{ data.item.erc20Address | addr}}</div>
                  </template>
               </v-autocomplete>
            </v-col>
          </v-row>
          <div v-if="this.selectContractAddressInfo">
            <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Token</span>
            <strong>{{ this.selectContractAddressInfo.name }} </strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Symbol</span>
            <strong>{{ this.selectContractAddressInfo.symbol }}</strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Decimals</span>
            <strong>{{ this.selectContractAddressInfo.decimals }} </strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters v-if="this.selectContractAddressInfo.totalSupply">
            <span class="left-title">Total Supply</span>
            <strong>{{ this.selectContractAddressInfo.totalSupply }}</strong>
          </v-row>
          </div>
          <v-row no-gutters>
            <v-col cols="12" md="3" class="left-title contract">Minter Address</v-col>
            <v-col cols="12" md="9">
              <v-row no-gutters>
                <v-col cols="12" md="10">
                  <v-autocomplete
                    outlined
                    label="Address"
                    :items="minterItems"
                    @change="selectMintAddrChange"
                    item-text="mintAddress"
                    item-value="mintAddress"
                    v-model="minterAddress"
                  >
                  <template v-slot:selection="data">
                    <div>{{ data.item.mintAddress | addr }}</div>
                  </template>
                  <template #item="{ item }">
                    <div v-if="width > 900">{{ item.mintAddress }}</div>
                    <div v-else>{{ item.mintAddress | addr}}</div>
                  </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="2">
                 <v-img src="../assets/images/add_link_normal.svg"  class="add-plus" />
                 <!-- <div class="add-plus"></div> -->
               </v-col>
              </v-row>
            </v-col>
            <!-- <v-col cols="12" md="1">
             <v-img src="../assets/images/add.png"  class="add-plus" />
            </v-col> -->
          </v-row>
          <div v-if="this.selectMintAddressInfo">
             <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Bridges</span>
            <strong>{{ this.selectMintAddressInfo.bridges }} </strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Target Chain</span>
            <strong>{{ this.selectMintAddressInfo.targetChain }}</strong>
          </v-row>
          </div>
          <div class="submit-btn">
            <v-btn  small color="#6979F8" @click="grantRole()" :loading="grantLoading" :disabled="grantBtnDisable" style="color: #fff" height="36" width="120">
                Grant 
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="createTokenDialog" width="500">
        <v-card class="minter-card">
          <v-form ref="creatERCForm" lazy-validation>
            <v-row justify="space-between" class="dialog-title">
              <div>
                <h3>Create Your Token</h3>
              </div>
            <div @click="cancelCreateToken()" class="close-dialog">
                <v-icon>mdi-close</v-icon>
              </div>
            </v-row>
            <v-row>
              <v-col>
                <div class="create-field">
                  <div class="left-title">Token Name</div>
                  <v-text-field 
                    label="1-16 characters" 
                    required 
                    outlined 
                    background-color="input_other" 
                    class="text-filed from-voting"
                    v-model="createForm.name"
                    :rules="tokenNameRules"
                    >
                  </v-text-field>
                </div>
                <div class="create-field">
                  <div class="left-title">Token symbol</div>
                  <v-text-field 
                    label="1-16 characters" 
                    required 
                    outlined 
                    background-color="input_other" 
                    class="text-filed from-voting"
                    v-model="createForm.symbol"
                    :rules="tokenSymbolRules"
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
                    v-model="createForm.decimals"
                    :rules="tokenDecimalsRules"
                    >
                  </v-text-field>
                </div>
              </v-col>
            </v-row>
            <v-row justify="space-between" no-gutters>
              <div>
                <span class="left-title">  Services Fees : </span>
                <strong class="service-fees">10 </strong>
                <span class="left-title">REI</span>
              </div>
              <v-btn @click="createrERC20" small color="vote_button"  :loading="createLoading" class="font-btn" height="36" width="120">
                  Create 
              </v-btn>
            </v-row>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog v-model="createSuccessDialog" width="500">
        <v-card class="minter-card">
          <v-row justify="space-between" class="dialog-title">
            <div>
              <h3>Created Successfully</h3>
            </div>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Token Name</span>
          </v-row>
           <v-row justify="space-between" class="title-row" no-gutters>
            <strong>{{tokenResult.name}} </strong>
          </v-row>
         
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Contract Address</span>
          </v-row>
           <v-row justify="space-between" class="title-row" no-gutters>
            <strong>
              {{tokenResult.contractAddress}}
              <a class="text-body-2 text-decoration-none" :href="`https://scan.rei.network/address/${tokenResult.contractAddress}`" target="_blank"><v-icon small color="primary" class="mr-1">mdi-open-in-new</v-icon></a>
            </strong>
          </v-row>
          <div class="text-center">
            <v-btn small color="#6979F8" class="revoke-btn" style="color: #fff" @click="closeSucessDialog()" height="32" width="80">
                OK  
            </v-btn>
          </div>
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
const adminAddress ="0x5C8FB2f2681955A17981cA66171C2E38EfB7862f"

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
      minterCap:"",
      grantFrom:{},
      createForm:{
        name:'',
        symbol:'',
        decimals:''
      },
      menuUp:0,
      width:0,
      stakeListLoading: false,
      setMinterCapDialog:false,
      revokeDialog:false,
      grantRoleDialog:false,
      createTokenDialog:false,
      createSuccessDialog:false,
      selectContractAddress: '',
      selectContractAddressInfo:'',
      minterAddress:"",
      selectMintAddressInfo:'',
      grantLoading:false,
      revoke:"",
      setMinterItem:"",
      createLoading: false,
      grantBtnDisable:false,
      admin:"",
      headers: [
          {text:'Symbol', value: 'symbol'},
          { text: 'Target Chain', value: 'target' },
          { text: 'Minter Cap', value: 'minter' },
          { text: 'Address', value: 'address' },
      ],
      bridgeList:[],
      chainList:[],
      contractItems:[],
      minterItems:[],
      tokenResult:{
        name:'',
        contractAddress:''
      },
      minterRules: [(v) => !!v || "Please enter the Minter Cap",(v)=>(v && util.isNumber(v) && v > this.setMinterItem.total) || "Please enter a number greater than Min Minter Cap"],
      tokenRules:[(v) => !!v || "Please enter the token"],
      tokenNameRules: [(v) => !!v || "Please enter the Token Name"],
      tokenSymbolRules: [(v) => !!v || "Please enter the Token symbol"],
      tokenDecimalsRules:  [(v) => !!v || "Please enter the Token Decimals"],
    };
  },
  watch: {
    '$store.state.connection': function() {
      this.switchAccount();
    },
  },
  mounted() {
    this.connect();
    this.getdata();
    this.windowWidth();
    this.switchAccount();
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
       this.stakeListLoading = true;
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
        // this.grantRole()
        //this.setMintCap()
        //this.createrERC20()
        this.minterItems = mintAddress.data
        this.contractItems = resultList
        
        let arr = [];
        for(let i = 0;i < resultList.length; i++){
          let list =  await this.getTokenInfo(resultList[i].erc20Address);
          console.log('list',list)
          arr = arr.concat(list)
        }
        arr.map((item) => {
          if(item.bridges == "Cbridges"){
           this.bridgeList.push(item)
          }else{
            this.chainList.push(item)
          }
        })
        this.chainList = this.chainList.map((item) => {
          let total = web3.utils.fromWei(web3.utils.toBN(item.total))
          let cap = web3.utils.fromWei(web3.utils.toBN(item.cap))
          let minter =(total/cap)*100
          return{
            ...item,
            total:total,
            cap:cap,
            minter:minter,
          }
        })
        this.bridgeList = this.bridgeList.map((item) => {
          let total = web3.utils.fromWei(web3.utils.toBN(item.total))
          let cap = web3.utils.fromWei(web3.utils.toBN(item.cap))
          let minter =(total/cap)*100
          return{
            ...item,
            total:total,
            cap:cap,
            minter:minter,
          }
        })
        console.log(arr)
       
      } catch(e){
        console.log(e)
      }
       this.stakeListLoading = false;
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
     async getMintInfo(){
      this.grantLoading = true;
      let contractAddress = this.selectContractAddressInfo.erc20Address;
      let mintAddress = this.minterAddress;
      let contract = new web3.eth.Contract(abiBridgedERC20, contractAddress);
      const MINTER_ROLE = await contract.methods.MINTER_ROLE().call();
      const roleNumber = await contract.methods.getRoleMemberCount(MINTER_ROLE).call();
      let flag = false; 
      for (var i = 0; i < Number(roleNumber); i++) {
        let member = await contract.methods.getRoleMember(MINTER_ROLE, i).call(); 
        if(member == mintAddress){
          flag = true;
          break;
        } else {
          flag = false;
        }
      }
      this.grantLoading = false;
      this.grantBtnDisable = flag;
    },
    selectMintAddrChange(){
      this.selectMintAddressInfo = find(mintAddress.data,(item)=> item.mintAddress == this.minterAddress)
      this.getMintInfo()
    },
    selectContractChange(){
      this.selectContractAddressInfo = find(this.contractItems,(item)=> item.erc20Address == this.selectContractAddress)
      if(this.minterAddress){
        this.getMintInfo()
      }
    },
    async grantRole(){
      try {
        this.grantRoleDialog = false;
        let contract = new web3.eth.Contract(abiBridgedERC20, this.selectContractAddress);
        const MINTER_ROLE = await contract.methods.MINTER_ROLE().call();
        let mintAddress = this.minterAddress;
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
           this.grantRoleDialog = false;
        }
      } catch(e){
        this.grantRoleDialog = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
    },
    async revokeRole(){
      try {
        let contract = new web3.eth.Contract(abiBridgedERC20,  this.revoke.contractAddress);
        const MINTER_ROLE = await contract.methods.MINTER_ROLE().call();
        let mintAddress =  this.revoke.mintAddress;
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
         if (!this.$refs.setMinterERCForm.validate()) return;
        let contract = new web3.eth.Contract(abiBridgedERC20, this.setMinterItem.contractAddress);
        let mintAddress = this.setMinterItem.mintAddress;
        let res = await contract.methods.setMinterCap(mintAddress,  web3.utils.numberToHex(web3.utils.toWei(this.minterCap))).send(
            {
              from: this.connection.address
            })
            console.log('res',res)
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
        if (!this.$refs.creatERCForm.validate()) return;
        this.createLoading = true;
        let newERC20 = this.createForm;
        let contract = new web3.eth.Contract(abiFactory,testFactory);
        let res = await contract.methods.create(newERC20.name, newERC20.symbol, newERC20.decimals).send({
            from: this.connection.address,
            value: web3.utils.numberToHex(web3.utils.toWei('10'))
        });
       
        if(res.transactionHash) {
            console.log(res);
            let tx = await web3.eth.getTransactionReceipt(res.transactionHash)
            let contractAddress = this.getLogsTopicRes(tx);
            this.tokenResult = {
              name: newERC20.name,
              contractAddress
            }
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
            this.createTokenDialog = false;
            this.createSuccessDialog = true;
            this.createLoading = false;
        }
      } catch(e){
        this.createTokenDialog = false;
        this.createLoading = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
    },
    switchAccount(){
      this.admin = adminAddress
      if(this.connection.address == this.admin){
        this.headers = [
          {text:'Symbol', value: 'symbol'},
          { text: 'Target Chain', value: 'target' },
          { text: 'Minter Cap', value: 'minter' },
          { text: 'Address', value: 'address' },
          { text: 'Operation', value: 'operation' },
       ]
      }
    },
    windowWidth() {
      const that = this;
      that.width = window.innerWidth;
    },
    getLogsTopicRes(tx){
      let addr = '';
      let hashStr = web3.utils.sha3("CreateERC20(address,address,string,string,uint8,address)")
      if(tx.logs.length>0){
        let topics = tx.logs[2] && tx.logs[2].topics;
        if(topics[0] == hashStr){
          addr = '0x'+ topics[2].substr(26)
        }
      }
      return addr;
    },
    openMinterCap(value){
      this.setMinterCapDialog = true;
      this.setMinterItem = value;
    },
    cancelMinterCap(){
      this.setMinterCapDialog = false;
    },
    openRevoke(value){
      this.revokeDialog = true;
      this.revoke = value;
    },
    cancelRevoke(){
      this.revokeDialog = false;
    },
    openGrantRole(){
      this.grantRoleDialog = true;
    },
    cancelGrantRole(){
      this.grantRoleDialog = false;
    },
    openCreateToken(){
      this.createTokenDialog = true;
    },
    cancelCreateToken(){
      this.createTokenDialog = false;
    },
    closeSucessDialog(){
      this.createSuccessDialog = false;
    }
  }
};
</script>

<style scoped lang="scss">
.vote-list{
  margin-top:30px;
}
.icon-logo{
  margin-right: 6px;
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
  .v-btn.v-btn--outlined.v-btn--text{
    border:none;
  }
  .right-row{
    text-align: right;
  }
}
.theme--light.v-progress-linear{
  background-color:#f5f5f5;
}
  .theme--dark.v-application .text-pagination[data-v-b6724c44][data-v-b6724c44]{
    background-color:#1d1a36;
  }
  .bridge-label{
    display: flex;
    align-items: center;
    .left-img{
      margin-left:-6px;
    }
    .label-text{
      margin-left: 10px;
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
}
 .minter-cap{
    padding: 12px;
    font-size: 12px;
    width: 340px;
  }
  .minter-item{
    // margin-top:-28px;
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
  .input-title {
    color: #868e9e;
      text-align: left !important;
    }
  .cap-name{
    padding:0 ;
    margin-bottom: -10px;
  }
.font-btn.v-btn.v-btn--has-bg {
  color: #fff;
  background: #6979f8;
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
    background-image: url("../assets/images/add_link_normal.svg") center center no-repeat;
  }
}
@media screen and (max-width: 900px) {
  .bridge-user{
    margin-bottom: 20px;
  }
  .minter-cap{
    width: 240px;
  }
  // .from-voting {
  //   .input-title {
  //     margin-left: 12px;
  //     text-align: left !important;
  //   }
  // }
  // .cap-name{
  //   padding:0 ;
  //   margin-bottom: -20px;
  // }
}
</style>
