<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-tabs v-model="tab1" align-with-title class="vote-list" background-color="background">
          <v-tab key="11" class="v-tab-left">All Delegators</v-tab>
          <v-tab key="12" class="v-tab-left">My Votes</v-tab>
          <v-tab key="13" class="v-tab-left">My Withdrawals</v-tab>
        </v-tabs>
        <v-divider class="faq_border" />
        <v-tabs-items v-model="tab1">
          <v-tab-item key="11">
              <v-data-table 
                :headers="headers" 
                :items="delegatorList" 
                class="elevation-0" 
                hide-default-footer 
                :items-per-page="itemsPerPage" 
                :loading="stakeListLoading" 
                :no-data-text="$t('msg.nodatatext')" 
                :loading-text="$t('msg.loading')"
                :page.sync="page" 
                @page-count="pageCount = $event">
                <template v-slot:item.delegator="{ item }">
                    <Address :val="item.delegator"></Address>
                </template>
              </v-data-table>
                <div class="text-center pt-2" v-if="delegatorList.length > 0">
                  <v-pagination 
                    v-model="page" 
                    :length="pageCount" 
                    color="vote_button" 
                    background-color="start_unstake" 
                    class="v-pagination" 
                    total-visible="6">
                    </v-pagination>
                    <v-btn class="down">download <v-icon size="16">mdi-tray-arrow-down</v-icon></v-btn>
                </div>
          </v-tab-item>
          <v-tab-item key="12">
              <v-data-table 
                :headers="myVotesHeaders" 
                :items="myVotesList" 
                class="elevation-0" 
                hide-default-footer 
                :items-per-page="itemsPerPage" 
                :loading="stakeListLoading" 
                :no-data-text="$t('msg.nodatatext')" 
                :loading-text="$t('msg.loading')"
                page.sync="page" 
                @page-count="pageCount = $event">
                <template v-slot:item.time="{ item }">
                    <span>{{ item.time }}</span>
                </template>
                <template v-slot:item.amount="{ item }">
                    <span>+{{ item.amount | asset(2) }}</span>
                </template>
              </v-data-table>
              <div class="text-center pt-2" v-if="myVotesList.length > 0">
                  <v-pagination 
                    v-model="page" 
                    :length="pageCount" 
                    color="vote_button" 
                    background-color="start_unstake" 
                    class="v-pagination" 
                    total-visible="6">
                    </v-pagination>
                </div>
          </v-tab-item>
          <v-tab-item key="13">
              <v-data-table 
                :headers="myWithHeaders" 
                :items="myWithdrawalsList" 
                class="elevation-0" 
                hide-default-footer 
                :items-per-page="itemsPerPage" 
                :loading="stakeListLoading" 
                :no-data-text="$t('msg.nodatatext')" 
                :loading-text="$t('msg.loading')"
                page.sync="page" 
                @page-count="pageCount = $event">
                <template v-slot:item.time="{ item }">
                    <v-img :src="item.img" weight="24" height="24" />
                    <span>{{ item.time }}</span>
                </template>
                 <template v-slot:item.amount="{ item }">
                    - <span>{{ item.amount }}</span>
                </template>
              </v-data-table>
              <div class="text-center pt-2" v-if="myWithdrawalsList.length > 0">
                  <v-pagination 
                    v-model="page" 
                    :length="pageCount" 
                    color="vote_button" 
                    background-color="start_unstake" 
                    class="v-pagination" 
                    total-visible="6">
                    </v-pagination>
                </div>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Web3 from 'web3';
import { mapActions,mapGetters } from 'vuex';
import filters from '../filters';
import Address from '../components/Address';
import abiConfig from '../abis/abiConfig';
import abiStakeManager from '../abis/abiStakeManager';
import abiCommissionShare from '../abis/abiCommissionShare';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT;
let client = null;

export default {
  components: {
    Address
  },
  filters,
  data() {
    return {
     tab1:null,
     page: 1,
     pageCount: 0,
     itemsPerPage: 20,
     stakeListLoading: false,
     stakeManageInstance:'',
     commissionShareInstance:'',
     allStakeListLoading:false,
     allStakeList:[],
     headers:[
        { text: "Delegators", value: 'delegator' },
        { text: "Amount ($REI)", value: 'amount' },
     ],
     delegatorList:[
     ],
     myVotesHeaders:[
        { text: "Time", value: 'time' },
        { text: "Amount ($REI)", value: 'amount' },
     ],
     myVotesList:[
         {
            time:"2022-12-19 12:30",
            amount:121545.00
         },
          {
            time:"2022-12-19 12:30",
            amount:121545.00
         }
     ],
     myWithHeaders:[
        { text: "Time", value: 'time' },
        { text: "Amount ($REI)", value: 'amount' },
     ],
     myWithdrawalsList:[
         {
            time:"2022-12-19 12:30",
            amount:121545.00
         },
          {
            time:"2022-12-19 12:30",
            amount:121545.00
         }
     ]
    };
  },
  computed: {
    ...mapGetters({
        connection: 'connection',
        dark: 'dark',
        apiUrl: 'apiUrl'
    })
  },
  mounted(){
    this.connect();
    this.init();
  },
  methods: {
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
        this.unstakeDelay = await contract.methods.unstakeDelay().call();
        let stake_contract = new web3.eth.Contract(abiStakeManager, this.stakeManagerContract);
        this.stakeManageInstance = stake_contract;
        if(this.$route.query.id){
          let commissionShareAdd = await this.stakeManageInstance.methods.validators(this.$route.query.id).call();
          this.commissionShareInstance = new web3.eth.Contract(abiCommissionShare, commissionShareAdd[1]);
        }
        
        this.getAllStakeList()
    },
    async getAllStakeList() {
      this.stakeListLoading = true;
      let url = this.apiUrl.graph;
      client = new ApolloClient({
        uri: `${url}chainmonitor`,
        cache: new InMemoryCache()
      });
      const getStakeinfos = gql`
         query stakeInfos {
            stakeInfos(first:1000, where: { validator: "${this.$route.query.id}" }) {
                id
                from
                timestamp
                validator
            }
        }
        `;
      const {
        data: { stakeInfos }
      } = await client.query({
        query: getStakeinfos,
        variables: {},
        fetchPolicy: 'cache-first'
      });
      let delegatorList = stakeInfos;
      if (delegatorList.length > 0) {
        let balanceOfShareMap = delegatorList.map((item) => {
          return this.getBalanceOfShare(item);
        });
        let balanceOfShare = await Promise.all(balanceOfShareMap);
        let arr = [];
        for (let i = 0; i < delegatorList.length; i++) {
          arr.push({
            delegator: delegatorList[i].from,
            amount: web3.utils.fromWei(web3.utils.toBN(balanceOfShare[i].balance))
          });
        }
        this.delegatorList = arr;
      }
      this.stakeListLoading = false;
    },
    async getBalanceOfShare(item) { 
      let balance = 0;
      if (item.from) {
        balance = await this.commissionShareInstance.methods.balanceOf(item.from).call({from:this.connection.address});
      }
      return {
        balance
      };
    },
  }
};
</script>

<style scoped lang="scss">
.vote-list {
  position: relative;
  .v-tab-left {
    margin-left: 0 !important;
  }
}
.v-btn {
  text-transform: none !important;
  }
.v-tab {
  text-transform: none !important;
}
.v-pagination {
  display: inline-flex !important;
  justify-content: flex-end !important;
}
.v-application .text-center {
  display: flex;
  justify-content: flex-start;
  text-align: right !important;
}
.mine{
    background-color: #FC9354;
    padding: 1px 8px;
    color: #fff;
    border-radius: 12px;
}
.down{
  margin-top: 4px;
}
</style>
