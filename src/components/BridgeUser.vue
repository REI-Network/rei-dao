<template>
  <v-container style="padding: 0">
    <v-row class="bridge-asset">
      <v-col cols="12" sm="6">
        <v-card :loading="cBridgeLoading" class="asset-charts">
          <h3>cBridge Asset Distribution</h3>
          <div ref="cBridgeChart" style="height: 348px"></div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card class="asset-charts">
          <h3>Multichain Asset Distribution</h3>
          <div ref="MultichainChart" style="height: 348px"></div>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="bridge-user">
      <v-row justify="space-between">
        <v-col cols="12" md="5"><h3>Bridges Asset Management on REI Network</h3></v-col>
        <v-col class="title-right">
          <v-row justify="end" no-gutters>
            <v-btn text outlined color="validator" href="https://github.com/REI-Network/rei-dao" target="_blank" v-if="this.connection.address != admin">
              <v-img src="../assets/images/light-token-info.svg" class="icon-logo" width="16" height="16" />
              Submit Token Info
            </v-btn>
            <v-btn text outlined color="validator" @click="openGrantRole()" v-if="this.connection.address == admin">
              <v-img src="../assets/images/light-add-minter.svg" class="icon-logo" width="16" height="16" />
              Add minter
            </v-btn>
            <v-btn text outlined color="validator" style="padding-right: 4px" @click="openCreateToken()">
              <v-img src="../assets/images/light-create-token.svg" class="icon-logo" width="16" height="16" />
              Create your token
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
      <v-tabs v-model="tab" align-with-title hide-slider class="vote-list" background-color="background">
        <v-radio-group v-model="radios" mandatory row dense style="margin-top: 0" class="trend-tab">
          <v-tab key="1"> <v-radio label="cBridge" value="1" class="trends-radio"> </v-radio></v-tab>
          <v-tab key="2"> <v-radio label="Multichain" value="2" class="trends-radio"> </v-radio></v-tab>
        </v-radio-group>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item key="1">
          <v-row class="background">
            <v-col>
              <v-data-table :headers="headers" :items="bridgeList" class="background elevation-0" hide-default-footer :items-per-page="itemsPerPage" :loading="getListLoading" :loading-text="$t('msg.loading')" :page.sync="page" @page-count="pageCount = $event">
                <template v-slot:item.symbol="{ item }">
                  <div class="bridge-label">
                    <div class="left-img">
                      <v-img v-if="item.logo" :src="item.logo" class="logo-img" height="32" width="32" />
                      <v-img v-else src="../assets/images/token-logo.svg" class="logo-img" height="32" width="32" />
                    </div>
                    <span class="label-text"> {{ item.symbol }}</span>
                    <a :href="gotocBridgeUrl(item)" target="_blank">
                      <v-icon size="16">mdi-open-in-new</v-icon>
                    </a>
                    <span class="pl-1" v-if="item.type == 'new'"><v-icon color="red" size="24">mdi-new-box</v-icon> </span>
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
                    <span>Used Amount: {{ item.total | asset(4) }}</span>
                    <span>Max: {{ item.cap | asset(2) }} {{ item.symbol }}</span>
                  </v-row>
                  <v-progress-linear color="#6979F8" rounded background-color="#E2E4EA" :value="item.percent"></v-progress-linear>
                  <div class="process">
                    <!-- <div>0</div> -->
                    <div :style="{ marginLeft: item.percent + '%' }">
                      <!-- <v-icon color="#6979F8">mdi-menu-up</v-icon> -->
                      <span>{{ item.percent | asset(3) }}%</span>
                    </div>
                  </div>
                </template>
                <template v-slot:item.operation="{ item }">
                  <v-btn small color="#6979F8" class="mr-2" style="color: #fff" @click="openMinterCap(item)" height="32"> Set Minter Cap </v-btn>
                  <v-btn small color="start_unstake" class="mr-2" @click="openRevoke(item)" height="32"> Revoke </v-btn>
                </template>
              </v-data-table>
              <div class="text-pagination pt-2" v-if="bridgeList.length > 0">
                <v-pagination v-model="page" :length="pageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"></v-pagination>
              </div>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item key="2">
          <v-row class="background">
            <v-col>
              <v-data-table :headers="headers" :items="chainList" class="background elevation-0" hide-default-footer :items-per-page="itemsPerPage" :loading="getListLoading" :loading-text="$t('msg.loading')" :page.sync="page2" @page-count="pageCount2 = $event">
                <template v-slot:item.symbol="{ item }">
                  <div class="bridge-label">
                    <div class="left-img">
                      <v-img v-if="item.logo" :src="item.logo" class="logo-img" height="32" width="32" />
                      <v-img v-else src="../assets/images/token-logo.svg" class="logo-img" height="32" width="32" />
                    </div>
                    <span class="label-text">{{ item.symbol }}</span>
                    <a :href="gotocMultichainUrl(item)" target="_blank">
                      <v-icon size="16">mdi-open-in-new</v-icon>
                    </a>
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
                    <span>Used Amount: {{ item.total | asset(4) }}</span>
                    <span>Max: {{ item.cap | asset(2) }} {{ item.symbol }}</span>
                  </v-row>
                  <v-progress-linear color="#6979F8" rounded background-color="#E2E4EA" :value="item.percent"></v-progress-linear>
                  <div class="process">
                    <!-- <div>0</div> -->
                    <div :style="{ marginLeft: item.percent + '%' }">
                      <!-- <v-icon color="#6979F8">mdi-menu-up</v-icon> -->
                      <span>{{ item.percent | asset(3) }}%</span>
                    </div>
                  </div>
                </template>
                <template v-slot:item.operation="{ item }">
                  <v-btn small color="#6979F8" class="mr-2" style="color: #fff" @click="openMinterCap(item)" height="32"> Set Minter Cap </v-btn>
                  <v-btn small color="start_unstake" class="mr-2" @click="openRevoke(item)" height="32"> Revoke </v-btn>
                </template>
              </v-data-table>
              <div class="text-pagination pt-2" v-if="chainList.length > 0">
                <v-pagination v-model="page2" :length="pageCount2" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"></v-pagination>
              </div>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
      <v-dialog v-model="setMinterCapDialog" width="500">
        <v-card class="minter-card">
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
              <strong> {{ setMinterItem.cap | asset(4) }} </strong>
              <span class="left-title">{{ setMinterItem.symbol }}</span>
            </div>
          </v-row>
          <v-progress-linear color="#6979F8" rounded background-color="#E2E4EA" :value="setMinterItem.percent"></v-progress-linear>
          <div class="">
            <!-- <div>0</div> -->
            <div class="minter-item" :style="{ marginLeft: setMinterItem.percent - 5 + '%' }">
              <!-- <v-icon color="#6979F8">mdi-menu-up</v-icon> -->
              <span>{{ setMinterItem.percent | asset(3) }}%</span>
            </div>
          </div>
          <div class="min-minter">
            <span class="left-title" style="text-align: left">Min Minter Cap:</span>
            <strong> {{ setMinterItem.total | asset(4) }} </strong>
            <span class="left-title">{{ setMinterItem.symbol }}</span>
          </div>
          <v-form ref="setMinterERCForm" lazy-validation>
            <div class="from-voting">
              <div class="input-title">Minter Cap</div>
              <v-text-field required outlined background-color="input_other" class="text-filed" :rules="minterRules" v-model="minterCap"> </v-text-field>
              <div class="submit-btn">
                <v-btn small color="#6979F8" @click="setMintCap()" style="color: #fff" height="36" width="120"> Set </v-btn>
              </div>
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
            <strong>{{ revoke.symbol }} </strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Minter Cap</span>
            <strong>{{ revoke.cap | asset(4) }}</strong>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Target Chain</span>
            <strong>{{ revoke.targetChain }}</strong>
          </v-row>
          <v-divider class="revoke-divider" />
          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Minter Address</span>
            <strong v-if="width > 900">{{ revoke.mintAddress }}</strong>
            <strong v-else>{{ revoke.mintAddress }}</strong>
          </v-row>
          <div class="text-center">
            <v-btn small outlined color="#868E9E" class="mr-4 revoke-btn" @click="cancelRevoke()" height="36" width="80"> NO </v-btn>
            <v-btn small color="#6979F8" :loading="revokeLoading" :disabled="revokeLoading" class="revoke-btn" style="color: #fff" @click="revokeRole()" height="36" width="80"> YES </v-btn>
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
              <v-autocomplete outlined label="Address" :items="contractItems" v-model="selectContractAddress" item-text="erc20Address" item-value="erc20Address" @change="selectContractChange">
                <template v-slot:selection="data">
                  <div>{{ data.item.erc20Address | addr }}</div>
                </template>
                <template v-slot:item="data">
                  <div v-if="width > 900">{{ data.item.erc20Address }}</div>
                  <div v-else>{{ data.item.erc20Address | addr }}</div>
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
                  <v-autocomplete outlined label="Address" :items="minterItems" @change="selectMintAddrChange" item-text="minterAddress" item-value="id">
                    <template v-slot:selection="data">
                      <div>{{ data.item.mintAddress | addr }}</div>
                    </template>
                    <template #item="{ item }">
                      <div v-if="width > 900">{{ item.mintAddress }}</div>
                      <div v-else>{{ item.mintAddress | addr }}</div>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="2">
                  <a href="https://github.com/REI-Network/rei-dao" target="_blank">
                    <v-img src="../assets/images/add_link_normal.svg" class="add-plus" />
                  </a>
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
            <v-btn small color="#6979F8" @click="grantRole()" :loading="grantLoading" :disabled="grantBtnDisable" style="color: #fff" height="36" width="120"> Grant </v-btn>
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
                  <v-text-field label="1-16 characters" required outlined background-color="input_other" class="text-filed from-voting" v-model="createForm.name" :rules="tokenNameRules"> </v-text-field>
                </div>
                <div class="create-field">
                  <div class="left-title">Token symbol</div>
                  <v-text-field label="1-16 characters" required outlined background-color="input_other" class="text-filed from-voting" v-model="createForm.symbol" :rules="tokenSymbolRules"> </v-text-field>
                </div>
                <div class="create-field">
                  <div class="left-title">Decimals</div>
                  <v-text-field label="Default value : 18" required outlined background-color="input_other" class="text-filed from-voting" v-model="createForm.decimals" :rules="tokenDecimalsRules"> </v-text-field>
                </div>
              </v-col>
            </v-row>
            <v-row justify="space-between" no-gutters>
              <div>
                <span class="left-title"> Services Fees : </span>
                <strong class="service-fees">10 </strong>
                <span class="left-title">REI</span>
              </div>
              <v-btn @click="createrERC20" small color="vote_button" :loading="createLoading" class="font-btn" height="36" width="120"> Create </v-btn>
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
            <strong>{{ tokenResult.name }} </strong>
          </v-row>

          <v-row justify="space-between" class="title-row" no-gutters>
            <span class="left-title">Contract Address</span>
          </v-row>
          <v-row justify="space-between" class="title-row" no-gutters>
            <strong>
              {{ tokenResult.contractAddress }}
              <a class="text-body-2 text-decoration-none" :href="`https://scan.rei.network/address/${tokenResult.contractAddress}`" target="_blank"><v-icon small color="primary" class="mr-1">mdi-open-in-new</v-icon></a>
            </strong>
          </v-row>
          <div class="text-center">
            <v-btn small color="#6979F8" class="revoke-btn" style="color: #fff" @click="closeSucessDialog()" height="32" width="80"> OK </v-btn>
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
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import abiBridgedERC20 from '../abis/abiBridgedERC20';
import abiFactory from '../abis/abiFactory';
import dayjs from 'dayjs';
import util from '../utils/util';
import filters from '../filters';
import Web3 from 'web3';
import find from 'lodash/find';
import { getPrice } from '../service/CommonService';
const mintAddress = require('../bridgesInfo/minterList.json');
const tokenProfileList = require('../bridgesInfo/tokenList.json');
const tokenChainList = require('../bridgesInfo/tokenChainList.json');

const testFactory = '0xb2C9dCC0604A379E65F0C7B4288C6663144B12C7';
const testAdminAddress = '0x5C8FB2f2681955A17981cA66171C2E38EfB7862f';
const mainFactory = '0xF0FceDF9ab45edF14F5C15299E2E0CBE2D41661c';
const mainAdminAddress = '0xF4954Eb3A4689EEf8F42dbBA33b8BcB9822771Df';

let factoryAddress = mainFactory;
let adminAddress = mainAdminAddress;

const tokenList = gql`
  query getTokenList {
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
`;
let client = null;

export default {
  filters,
  data() {
    return {
      tab: '1',
      radios: null,
      page: 1,
      pageCount: 0,
      page2: 1,
      pageCount2: 0,
      itemsPerPage: 20,
      cBridgeTotalAmount: 0,
      multichainTotalAmount: 0,
      cBridgeTotalMillion:0,
      multichainTotalMillion:0,
      cBridgeLoading:false,
      bridgeArr: [],
      chainArr:[],
      currentItem: {},
      capForm: {},
      minterCap: '',
      grantFrom: {},
      createForm: {
        name: '',
        symbol: '',
        decimals: ''
      },
      menuUp: 0,
      width: 0,
      getListLoading: false,
      revokeLoading: false,
      setMinterCapDialog: false,
      revokeDialog: false,
      grantRoleDialog: false,
      createTokenDialog: false,
      createSuccessDialog: false,
      selectContractAddress: '',
      selectContractAddressInfo: '',
      minterAddress: '',
      selectMintAddressInfo: '',
      grantLoading: false,
      revoke: '',
      setMinterItem: '',
      createLoading: false,
      grantBtnDisable: false,
      admin: '',
      headers: [
        { text: 'Symbol', value: 'symbol' },
        { text: 'Target Chain', value: 'target' },
        { text: 'Minter Cap', value: 'minter' }
      ],
      bridgeList: [],
      chainList: [],
      contractItems: [],
      minterItems: [],
      tokenResult: {
        name: '',
        contractAddress: ''
      },
      val: false,
      //  minterRules:[],
      minterRules: [(v) => !!v || 'Please enter the Minter Cap', (v) => (v && util.isNumber(v) && v > this.setMinterItem.total) || 'Please enter a number greater than Min Minter Cap'],
      tokenRules: [(v) => !!v || 'Please enter the token'],
      tokenNameRules: [(v) => !!v || 'Please enter the Token Name'],
      tokenSymbolRules: [(v) => !!v || 'Please enter the Token symbol'],
      tokenDecimalsRules: [(v) => !!v || 'Please enter the Token Decimals'],
      tokenInfoList: [
        {
          decimals: '8',
          erc20Address: '0x8059E671Be1e76f8db5155bF4520f86ACfDc5561',
          name: 'Wrapped BTC',
          symbol: 'WBTC'
        },
        {
          decimals: '6',
          erc20Address: '0x988a631Caf24E14Bb77EE0f5cA881e8B5dcfceC7',
          name: 'Tether USD',
          symbol: 'USDT'
        },
        {
          decimals: '6',
          erc20Address: '0x8d5E1225981359E2E09A3AB8F599A51486f53314',
          name: 'USD Coin',
          symbol: 'USDC'
        },
        {
          decimals: '18',
          erc20Address: '0x7a5313468c1C1a3Afb2Cf5ec46558A7D0fc2884A',
          name: 'Wrapped Ether',
          symbol: 'WETH'
        },
        {
          decimals: '18',
          erc20Address: '0x0ba85980B122353D77fBb494222a10a46E4FB1f6',
          name: 'Dai Stablecoin',
          symbol: 'DAI'
        },
        {
          decimals: '18',
          erc20Address: '0x02CD448123E3Ef625D3A3Eb04A30E6ACa29C7786',
          name: 'Binance USD',
          symbol: 'BUSD'
        }
      ],
      myChart:{},
      myChart2:{},
    };
  },
  watch: {
    '$store.state.finishedTxs': function () {
      this.getdata();
    },
    '$store.state.connection': function () {
      this.init();
      this.switchAccount();
      this.getdata();
    }
  },
  mounted() {
    this.connect();
    this.init();
    this.myCharts();
    this.myCharts2();
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
    init() {
      if (this.connection.network == 'REI Network') {
        factoryAddress = mainFactory;
        adminAddress = mainAdminAddress;
      } else if (this.connection.network == 'REI Testnet') {
        factoryAddress = testFactory;
        adminAddress = testAdminAddress;
      }
    },
    async getdata() {
      this.getListLoading = true;
      this.myChart.showLoading();
      this.myChart2.showLoading();
      try {
        let url = this.apiUrl.graph;
        client = new ApolloClient({
          uri: `${url}erc20-factory`,
          cache: new InMemoryCache()
        });

        let {
          data: { createNewErc20Results: resultList }
        } = await client.query({
          query: tokenList,
          variables: {},
          fetchPolicy: 'cache-first'
        });
        if (this.connection.network == 'REI Network') {
          resultList = resultList.concat(this.tokenInfoList);
        }
        this.minterItems = mintAddress.data.map((item) => {
          return {
            ...item,
            id: item.mintAddress + encodeURIComponent(item.targetChain)
          };
        });
        this.contractItems = resultList;

        let arr = [];
        let bridgeList = [];
        let chainList = [];
        for (let i = 0; i < resultList.length; i++) {
          let list = await this.getTokenInfo(resultList[i].erc20Address, resultList[i]);
          arr = arr.concat(list);
        }
        arr.map((item) => {
          if (item.bridges == 'cBridge') {
            bridgeList.push(item);
          } else {
            chainList.push(item);
          }
        });
        this.bridgeList = bridgeList;
        this.chainList = chainList;
        this.getListLoading = false;
      } catch (e) {
        this.getListLoading = false;
        this.$dialog.notify.warning(e.message);
        console.log(e);
      }
      this.getPrice();
      this.myChart.hideLoading();
      this.myChart2.hideLoading();
    },
    async getTokenInfo(contractAddress, token) {
      let contract = new web3.eth.Contract(abiBridgedERC20, contractAddress);
      let tokenProfile = find(tokenProfileList.data, (item) => item.address == contractAddress);
      let tokenChainInfo = find(tokenChainList.data, (item) => item.tokenAddress == contractAddress);
      const MINTER_ROLE = await contract.methods.MINTER_ROLE().call();
      let totalSupply = await contract.methods.totalSupply().call();
      let symbol = token.symbol;
      let name = token.name;
      let decimals = token.decimals;
      const roleNumber = await contract.methods.getRoleMemberCount(MINTER_ROLE).call();
      let members = [];
      for (var i = 0; i < Number(roleNumber); i++) {
        let member = await contract.methods.getRoleMember(MINTER_ROLE, i).call();
        let mintSupply = await contract.methods.minterSupply(member).call();

        let cap = mintSupply.cap / 10 ** decimals;

        let total = mintSupply.total / 10 ** decimals;
        let percent = (total / cap) * 100;

        let mintAddressInfo = find(mintAddress.data, (item) => {
          return item.mintAddress == member && item.targetChain == tokenChainInfo.targetChain;
        });

        if (!mintAddressInfo) {
          mintAddressInfo = {
            mintAddress: member
          };
        }
        let obj = {
          ...mintAddressInfo,
          cap,
          total,
          percent,
          totalSupply,
          symbol,
          name,
          decimals,
          contractAddress,
          logo: tokenProfile?.logo || ''
        };
        members.push(obj);
      }
      return members;
    },
    async getMintInfo() {
      this.grantLoading = true;
      let contractAddress = this.selectContractAddressInfo.erc20Address;
      let mintAddress = this.minterAddress;
      let contract = new web3.eth.Contract(abiBridgedERC20, contractAddress);
      const MINTER_ROLE = await contract.methods.MINTER_ROLE().call();
      const roleNumber = await contract.methods.getRoleMemberCount(MINTER_ROLE).call();
      let flag = false;
      for (var i = 0; i < Number(roleNumber); i++) {
        let member = await contract.methods.getRoleMember(MINTER_ROLE, i).call();
        if (member == mintAddress) {
          flag = true;
          break;
        } else {
          flag = false;
        }
      }
      this.grantLoading = false;
      this.grantBtnDisable = flag;
    },
    selectMintAddrChange(e) {
      this.selectMintAddressInfo = find(this.minterItems, (item) => item.id == e);
      this.minterAddress = this.selectMintAddressInfo.mintAddress;
      this.getMintInfo();
    },
    selectContractChange() {
      this.selectContractAddressInfo = find(this.contractItems, (item) => item.erc20Address == this.selectContractAddress);
      if (this.minterAddress) {
        this.getMintInfo();
      }
    },
    async grantRole() {
      try {
        this.grantLoading = true;
        let contract = new web3.eth.Contract(abiBridgedERC20, this.selectContractAddress);
        const MINTER_ROLE = await contract.methods.MINTER_ROLE().call();
        let mintAddress = this.minterAddress;
        let res = await contract.methods.grantRole(MINTER_ROLE, mintAddress).send({
          from: this.connection.address
        });
        if (res.transactionHash) {
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
          this.grantLoading = false;
        }
      } catch (e) {
        this.grantRoleDialog = false;
        this.grantLoading = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
    },
    async revokeRole() {
      try {
        this.revokeLoading = true;
        let contract = new web3.eth.Contract(abiBridgedERC20, this.revoke.contractAddress);
        const MINTER_ROLE = await contract.methods.MINTER_ROLE().call();
        let mintAddress = this.revoke.mintAddress;
        let res = await contract.methods.revokeRole(MINTER_ROLE, mintAddress).send({
          from: this.connection.address
        });
        if (res.transactionHash) {
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
          this.revokeDialog = false;
          this.revokeLoading = false;
        }
      } catch (e) {
        this.revokeDialog = false;
        this.revokeLoading = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
    },
    async setMintCap() {
      try {
        if (!this.$refs.setMinterERCForm.validate()) return;
        let contract = new web3.eth.Contract(abiBridgedERC20, this.setMinterItem.contractAddress);
        let mintAddress = this.setMinterItem.mintAddress;
        let res = await contract.methods.setMinterCap(mintAddress, web3.utils.numberToHex(web3.utils.toWei(this.minterCap))).send({
          from: this.connection.address
        });
        console.log('res', res);
        if (res.transactionHash) {
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
          this.setMinterCapDialog = false;
        }
        console.log(res);
      } catch (e) {
        this.setMinterCapDialog = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
    },
    async createrERC20() {
      try {
        if (!this.$refs.creatERCForm.validate()) return;
        this.createLoading = true;
        let newERC20 = this.createForm;
        let contract = new web3.eth.Contract(abiFactory, factoryAddress);
        let res = await contract.methods.create(newERC20.name, newERC20.symbol, newERC20.decimals).send({
          from: this.connection.address,
          value: web3.utils.numberToHex(web3.utils.toWei('10'))
        });

        if (res.transactionHash) {
          console.log(res);
          let tx = await web3.eth.getTransactionReceipt(res.transactionHash);
          let contractAddress = this.getLogsTopicRes(tx);
          this.tokenResult = {
            name: newERC20.name,
            contractAddress
          };
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
      } catch (e) {
        this.createTokenDialog = false;
        this.createLoading = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
    },
    switchAccount() {
      this.admin = adminAddress;
      if (this.connection.address == this.admin) {
        this.headers = [
          { text: 'Symbol', value: 'symbol' },
          { text: 'Target Chain', value: 'target' },
          { text: 'Minter Cap', value: 'minter' },
          { text: 'Minter Address', value: 'address' },
          { text: 'Operation', value: 'operation' }
        ];
      }
    },
    windowWidth() {
      const that = this;
      that.width = window.innerWidth;
    },
    getLogsTopicRes(tx) {
      let addr = '';
      let hashStr = web3.utils.sha3('CreateERC20(address,address,string,string,uint8,address)');
      if (tx.logs.length > 0) {
        let topics = tx.logs[2] && tx.logs[2].topics;
        if (topics[0] == hashStr) {
          addr = '0x' + topics[2].substr(26);
        }
      }
      return addr;
    },
    openMinterCap(value) {
      this.setMinterCapDialog = true;
      this.setMinterItem = value;
    },
    cancelMinterCap() {
      this.setMinterCapDialog = false;
    },
    openRevoke(value) {
      this.revokeDialog = true;
      this.revoke = value;
    },
    cancelRevoke() {
      this.revokeDialog = false;
    },
    openGrantRole() {
      if (!this.selectContractAddress && !this.minterAddress) {
        this.grantBtnDisable = true;
      }
      this.grantRoleDialog = true;
    },
    cancelGrantRole() {
      this.grantRoleDialog = false;
    },
    openCreateToken() {
      this.createTokenDialog = true;
    },
    cancelCreateToken() {
      this.createTokenDialog = false;
    },
    closeSucessDialog() {
      this.createSuccessDialog = false;
    },
    gotocBridgeUrl(token) {
      let url = '';
      if (token.targetChain == 'Ethereum Mainnet') {
        url = `https://cbridge.celer.network/#/transfer?sourceChainId=47805&destinationChainId=1&tokenSymbol=${token.symbol}`;
      } else if (token.targetChain == 'BNB Chain') {
        url = `https://cbridge.celer.network/#/transfer?sourceChainId=47805&destinationChainId=56&tokenSymbol=${token.symbol}`;
      }
      return url;
    },
    gotocMultichainUrl(token) {
      return `https://app.multichain.org/#/router?bridgetoken=${token.contractAddress}&network=47805`;
    },
    async getPrice() {
      let arr = ['REI', 'WBTC', 'USDT', 'USDC', 'WETH', 'DAI', 'BUSD'];
      let { data: priceList } = await getPrice({ symbols: arr.join() });
      this.bridgeList = this.bridgeList.map((item) => {
        let _asset = find(priceList.data, (items) => items.symbol.toUpperCase() == item.symbol);
        if (_asset) {
          var unitPrice = _asset.current_price;
        }
        let amount = item.total * unitPrice;
        return {
          ...item,
          amount: amount
        };
      });
      for (let i = 0; i < this.bridgeList.length; i++) {
        this.cBridgeTotalAmount += this.bridgeList[i].amount;
      }
      this.chainList = this.chainList.map((item) => {
        let _asset = find(priceList.data, (items) => items.symbol.toUpperCase() == item.symbol);
        if (_asset) {
          var unitPrice = _asset.current_price;
        }
        let amount = item.total * unitPrice;
        return {
          ...item,
          amount: amount
        };
      });
      for (let i = 0; i < this.chainList.length; i++) {
        this.multichainTotalAmount += this.chainList[i].amount;
      }
      this.myCharts();
      this.myCharts2();
    },
    myCharts() {
      this.bridgeArr = this.bridgeList.map((item) => {
            let value = util.asset(item.amount / this.cBridgeTotalAmount*100,2)
            return {
              name: item.symbol,
              amount: item.amount,
              value: value
            };
          });
          this.cBridgeTotalMillion = util.asset(this.cBridgeTotalAmount/1000000,2)
      const chart = this.$refs.cBridgeChart;
      let data = this.bridgeArr;
      if (chart) {
        this.myChart = this.$echarts.init(chart);
        var option = {
          baseOption: {
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                  let value = util.asset(params.data.value,2)
                  let amount = util.asset(params.data.amount,2)
                  return params.data.name + '                          ' + value + '%' + '<br/>' + '$' + amount;
                }
            },
            query: {
              maxAspectRatio: 1
            },
            legend: {
              selectedMode: false,
              orient: 'vertical',
              icon: 'circle',
              right: '12%',
              top: 'center',
              itemGap: 50,
              itemWidth: 16,
              itemHeight: 12,
              textStyle: {
                fontSize: 16,
                color: '#868e9e'
              },
            },
            color: ['#F46F6F', '#64B5FF', '#7A7AB3', '#4CC7B6','#6979f8','#FC9153'],
            title: {
              text: this.cBridgeTotalMillion+'M',
              left: '19%',
              top: '41%',
              textStyle: {
                // color: '#868e9e',
                fontSize: 20,
                fontWeight: 700,
                align: 'center'
              }
            },
            series: [
              {
                name: '',
                type: 'pie',
                radius: ['30%', '60%'],
                center: ['25%', '46%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    // show: true,
                    fontSize: '24',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: data
              }
            ]
          },
          media: [
            {
              query: {
                maxWidth: 450
              },
              option: {
                title: {
                  text: '1.30M',
                  left: '18%',
                  top: '43%',
                  textStyle: {
                    fontSize: 16
                  }
                },
                graphic: {
                  type: 'text',
                  left: '14%',
                  top: '51%',
                  style: {
                    text: 'Total Supply',
                    fill: '#868e9e',
                    textAlign: 'center',
                    fontSize: 12
                  }
                },
                legend: {
                  right: '1%',
                  itemWidth: 8,
                  itemHeight: 8,
                  textStyle: {
                    fontSize: 13
                  }
                },
                series: [
                  {
                    radius: ['24%', '40%'],
                    center: ['24%', '50%']
                  }
                ]
              }
            }
          ]
        };
        this.myChart.setOption(option);
        window.addEventListener('resize', function () {
          this.myChart.resize();
        });
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', function () {
          this.myChart.resize();
        });
      });
    },

    myCharts2() {
      this.chainArr = this.chainList.map((item) => {
            let value = util.asset(item.amount / this.multichainTotalAmount*100,2)
            return {
              name: item.symbol,
              amount: item.amount,
              value: value
            };
          });
          this.multichainTotalMillion = util.asset(this.multichainTotalAmount/1000000,2)
      const chart = this.$refs.MultichainChart;
      let data = this.chainArr;
      console.log('data', data);
      if (chart) {
        this.myChart2 = this.$echarts.init(chart);
        var option = {
          baseOption: {
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                  let value = util.asset(params.data.value,2)
                  let amount = util.asset(params.data.amount,2)
                  return params.data.name  +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ value + '%' + '<br/>' + '$' + amount;
                }
            },
            query: {
              maxAspectRatio: 1
            },
            legend: {
              selectedMode: false,
              orient: 'vertical',
              icon: 'circle',
              right: '18%',
              top: 'center',
              itemGap: 50,
              itemWidth: 16,
              itemHeight: 12,
              textStyle: {
                fontSize: 16,
                color: '#868e9e'
              },
            },
            color: ['#F46F6F', '#64B5FF', '#7A7AB3', '#4CC7B6','#FC9153'],
            title: {
              text: this.multichainTotalMillion+'M',
              left: '19%',
              top: '41%',
              textStyle: {
                // color: '#868e9e',
                fontSize: 20,
                fontWeight: 700,
                align: 'center'
              }
            },
            series: [
              {
                name: '',
                type: 'pie',
                radius: ['30%', '60%'],
                center: ['25%', '46%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    // show: true,
                    fontSize: '24',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: data
              }
            ]
          },
          media: [
            {
              query: {
                maxWidth: 450
              },
              option: {
                title: {
                  text: '1.30M',
                  left: '18%',
                  top: '43%',
                  textStyle: {
                    fontSize: 16
                  }
                },
                legend: {
                  right: '1%',
                  itemWidth: 8,
                  itemHeight: 8,
                  textStyle: {
                    fontSize: 13
                  }
                },
                series: [
                  {
                    radius: ['24%', '40%'],
                    center: ['24%', '50%']
                  }
                ]
              }
            }
          ]
        };
        this.myChart2.setOption(option);
        window.addEventListener('resize', function () {
          this.myChart2.resize();
        });
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', function () {
          this.myChart2.resize();
        });
      });
    }
  }
};
</script>

<style scoped lang="scss">
.bridge-asset {
  margin-bottom: 28px;
}
.asset-charts {
  padding: 20px;
}
.vote-list {
  margin-top: 30px;
}
.icon-logo {
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
  .title-right {
    .v-btn.v-btn--outlined.v-btn--text {
      border: none;
    }
    .right-row {
      text-align: right;
    }
  }
  .theme--light.v-progress-linear {
    background-color: #f5f5f5;
  }
  .theme--dark.v-application .text-pagination[data-v-b6724c44][data-v-b6724c44] {
    background-color: #1d1a36;
  }
  .bridge-label {
    display: flex;
    align-items: center;
    .left-img {
      margin-left: -6px;
    }
    .label-text {
      margin-left: 10px;
      margin-right: 12px;
    }
    .minter-address {
      font-size: 12px;
      color: lightgray;
    }
  }
}
.submit-btn {
  text-align: right;
}
.minter-cap {
  padding: 12px;
  font-size: 12px;
  width: 100%;
}
.minter-item {
  // margin-top:-28px;
}
.set-minter {
  padding: 12px;
}
.process {
  font-size: 12px;
  display: flex;
}
.left-title {
  color: #868e9e;
}
.minter-card {
  padding: 30px;
  .dialog-title {
    margin-bottom: 20px;
  }
  .title-row {
    margin: 8px 0;
  }
  .revoke-divider {
    margin: 16px 0;
  }
  .min-minter {
    text-align: right;
  }
  .create-field {
    margin-top: 8px;
  }
  .input-title {
    color: #868e9e;
    text-align: left !important;
  }
  .cap-name {
    padding: 0;
    margin-bottom: -10px;
  }
  .font-btn.v-btn.v-btn--has-bg {
    color: #fff;
    background: #6979f8;
  }
  .text-center {
    margin-top: 20px;
    text-align: right !important;
  }
  .service-fees {
    font-size: 28px;
  }
  .contract {
    margin-top: 12px;
  }
  .add-plus {
    text-align: right;
    width: 56px;
    margin-left: 8px;
    background-image: url('../assets/images/add_link_normal.svg') center center no-repeat;
  }
}
@media screen and (max-width: 900px) {
  .bridge-user {
    margin-bottom: 20px;
  }
  .minter-cap {
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
