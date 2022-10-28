<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-tabs v-model="tab1" align-with-title class="vote-list" background-color="background">
          <v-tab key="11" class="v-tab-left">All Delegators<span :class="dark?'total-dark total':'total-light total'">{{delegatorList.length}}</span></v-tab>
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
                    <span class="mine" v-if="item.delegator == connection.address">mine</span>
                </template>
                <template v-slot:item.amount="{ item }">
                    <span>{{ item.amount | asset(2) }}</span>
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
                    <v-btn class="down" @click="handleDownload">Download <v-icon size="16">mdi-tray-arrow-down</v-icon></v-btn>
                </div>
          </v-tab-item>
          <v-tab-item key="12">
              <v-data-table 
                :headers="myVotesHeaders" 
                :items="myVotesList" 
                class="elevation-0" 
                hide-default-footer 
                :items-per-page="votePerPage" 
                :loading="stakeListLoading" 
                :no-data-text="$t('msg.nodatatext')" 
                :loading-text="$t('msg.loading')"
                :sort-by.sync="sortByVote"
                :sort-desc.sync="sortDescVote"
                :page.sync="votePage" 
                @page-count="votePageCount = $event">
                <template v-slot:item.time="{ item }">
                    <span>{{ item.time*1000 | dateFormat('YYYY-MM-dd hh:mm:ss') }}</span>
                </template>
                <template v-slot:item.amount="{ item }">
                    <span>+{{ item.amount | asset(2) }}</span>
                </template>
              </v-data-table>
              <div class="text-center pt-2" v-if="myVotesList.length > 0">
                  <v-pagination 
                    v-model="votePage" 
                    :length="votePageCount" 
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
                :items-per-page="withdrawalsPerPage" 
                :loading="stakeListLoading" 
                :no-data-text="$t('msg.nodatatext')" 
                :loading-text="$t('msg.loading')"
                :sort-by.sync="sortByWithdrawals"
                :sort-desc.sync="sortDescWithdrawals"
                :page.sync="withdrawalsPage" 
                @page-count="withdrawalsPageCount = $event">
                <template v-slot:item.time="{ item }">
                    <v-img :src="item.img" weight="24" height="24" />
                    <span>{{ item.time*1000 | dateFormat('YYYY-MM-dd hh:mm:ss')}}</span>
                </template>
                 <template v-slot:item.amount="{ item }">
                    - <span>{{ item.amount | asset(2) }}</span>
                </template>
              </v-data-table>
              <div class="text-center pt-2" v-if="myWithdrawalsList.length > 0">
                  <v-pagination 
                    v-model="withdrawalsPage" 
                    :length="withdrawalsPageCount" 
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
import Papa from 'papaparse';

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
     votePage: 1,
     votePageCount: 0,
     votePerPage: 20,
     withdrawalsPage: 1,
     withdrawalsPageCount: 0,
     withdrawalsPerPage: 20,
     stakeListLoading: false,
     voteListLoading: false,
     stakeManageInstance:'',
     commissionShareInstance:'',
     allStakeListLoading:false,
     allStakeList:[],
     delegator:"",
     fields: ['delegator', 'amount'],
     createCsvFile:'',
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
     sortByVote:'time',
     sortDescVote:true,
     myVotesList:[
     ],
     myWithHeaders:[
        { text: "Time", value: 'time' },
        { text: "Amount ($REI)", value: 'amount' },
     ],
     sortByWithdrawals:'time',
     sortDescWithdrawals:true,
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
        
        this.getAllStakeList();
        this.getMyVotesList();
        this.getMyWithdrawList();
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
        var arr = [];
        for (let i = 0; i < delegatorList.length; i++) {
          arr.push({
            delegator: web3.utils.toChecksumAddress(delegatorList[i].from),
            amount: web3.utils.fromWei(web3.utils.toBN(balanceOfShare[i].balance))
          });
        }
        this.delegatorList = arr;
      }
       function sortArr(attr){
          return function(a,b){
            return b[attr]-a[attr]
          }
        }
      this.delegatorList = this.delegatorList.sort(sortArr('amount'));
        this.delegatorList.map((item,index) => {
          if(item.delegator  == this.connection.address){
            this.delegatorList.unshift(this.delegatorList.splice(index , 1)[0]);
          }
        })
      this.stakeListLoading = false;
    },
    async getMyVotesList(){
      this.voteListLoading = true;
      let url = this.apiUrl.graph;
      let client = new ApolloClient({
        uri: `${url}onlystakeinfoMore`,
        cache: new InMemoryCache()
      });
      const getMyVoteInfos = gql`
         query stakeInfoMores {
            stakeInfoMores(first:1000, where: { validator: "${this.$route.query.id}",from: "${this.connection.address}"  }) {
                id
                from
                timestamp
                validator
                shares
            }
        }
        `;
      const { data: { stakeInfoMores }} = await client.query({
        query: getMyVoteInfos,
        variables: {},
        fetchPolicy: 'cache-first'
      });
      
      this.myVotesList = stakeInfoMores.map((item) => {
          return {
            from: item.from,
            time: item.timestamp,
            validator: item.validator,
            amount: web3.utils.fromWei(web3.utils.toBN(item.shares))
          }
        })
        console.log('myVoteInfos',this.myVotesList)
      
      this.voteListLoading = false;
    },
    async getMyWithdrawList(){
      this.withdrawListLoading = true;
      let url = this.apiUrl.graph;
      let client = new ApolloClient({
        uri: `${url}chainmonitor`,
        cache: new InMemoryCache()
      });
      const getMyWithdrawInfos = gql`
         query unStakeInfos {
            unStakeInfos(where: { from: "${this.connection.address}", validator: "${this.$route.query.id}" }) {
              id
              from
              to
              values
              shares
              validator
              timestamp
              state
              amount
            }
          }
        `;
      const { data: { unStakeInfos }} = await client.query({
        query: getMyWithdrawInfos,
        variables: {},
        fetchPolicy: 'cache-first'
      });
      
      this.myWithdrawalsList = unStakeInfos.map((item) => {
          return {
            time: item.timestamp,
            amount: web3.utils.fromWei(web3.utils.toBN(item.shares))
          }
        })
        console.log('unStakeInfos',this.myWithdrawalsList)
      
      this.withdrawListLoading = false;
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
    handleDownload() {
      if (!this.isSupportDownload() || !this.delegatorList.length) return;
      try {
        this.createCsvFile = Papa.unparse({
            fields: this.fields,
            data: this.delegatorList
        });
      } catch (err) {
        console.error(err);
      }
      let csvName = `${this.$route.query.id}.csv`
      this.funDownload(this.createCsvFile, csvName);
    },
    funDownload(content, filename) {
      let eleLink = document.createElement('a');
      eleLink.download = filename;
      eleLink.style.display = 'none';
      // The character content is converted to a blob address.
      let blob = new Blob([content]);
      eleLink.href = URL.createObjectURL(blob);
      // trigger click
      document.body.appendChild(eleLink);
      eleLink.click();
      // remove
      document.body.removeChild(eleLink);
    },
    isSupportDownload() {
      if ('download' in document.createElement('a')) {
        return true;
      } else {
        this.$dialog.notify.warning('Browser does not support');
        return false;
      }
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
.total{
  padding: 4px 8px;
  border-radius: 20px;
  margin-left: 8px;
  color: white;
}
.total-light{
 background-color: #E2E4EA;
}
.total-dark{
 background-color: #13112b;
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
