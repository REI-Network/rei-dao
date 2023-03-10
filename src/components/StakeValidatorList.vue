<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-tabs v-model="tab1" align-with-title class="vote-list" background-color="background">
          <v-tab key="11" class="v-tab-left" :to="`/stake/validator/${url}/delegator`"
            >All Delegators<span :class="dark ? 'total-dark total' : 'total-light total'">{{ delegatorList.length }}</span></v-tab
          >
          <v-tab key="12" class="v-tab-left" :to="`/stake/validator/${url}/myvote`">My Votes</v-tab>
          <v-tab key="13" class="v-tab-left" :to="`/stake/validator/${url}/withdrawals`">My Withdrawals</v-tab>
          <v-tab key="14" class="v-tab-left" :to="`/stake/validator/${url}/jail`">
            <v-row>
              <div>History of Jail</div>
              <v-menu open-on-hover top offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon size="14" v-bind="attrs" v-on="on">mdi-help-circle-outline</v-icon>
                </template>
                <v-list class="history-list">
                  <p class="history-help">According to the Jail Nechanism, the validator will be banned from producing blocks and be thrown into the Jail if it loses ≥300 blocks during 24 hours.</p>
                  <p class="history-help">The validator needs to pay a fine of 20,000 REI before re-participating in producing blocks .</p>
                </v-list>
              </v-menu>
            </v-row>
          </v-tab>
          <v-tab key="15" class="v-tab-left" :to="`/stake/validator/${url}/slash`">
            <v-row>
              <div>History of Slash</div>
              <v-menu open-on-hover top offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon size="14" v-bind="attrs" v-on="on">mdi-help-circle-outline</v-icon>
                </template>
                <v-list class="history-list">
                  <p class="history-help">In the REI Network's Slash mechanism, if there is double signing behavior by validators, the penalty rate is 20%, which means that all users who voted for the penalized node and the node itself will lose 20% of the REI.</p>
                </v-list>
              </v-menu>
            </v-row>
          </v-tab>
        </v-tabs>
        <v-divider class="faq_border" />
        <v-tabs-items v-model="tab2">
          <v-tab-item key="11">
            <v-data-table :headers="headers" :items="delegatorList" class="elevation-0" hide-default-footer :items-per-page="itemsPerPage" :loading="stakeListLoading" :no-data-text="$t('msg.nodatatext')" loading-text="" :page.sync="page" @page-count="pageCount = $event">
              <template v-slot:item.delegator="{ item }">
                <span> {{ item.addressName }} </span>
                <Address :val="item.delegator" :brackets="!!item.addressName"></Address>
                <span class="mine" v-if="item.delegator == connection.address">mine</span>
              </template>
              <template v-slot:item.amount="{ item }">
                <span>{{ item.amount | asset(2) }}</span>
              </template>
            </v-data-table>
            <v-skeleton-loader class="skeleton" v-if="skeletonLoading == true" :loading="skeletonLoading" type="table-tbody,actions"></v-skeleton-loader>
            <div class="text-center pt-2" v-if="delegatorList.length > 0">
              <v-pagination v-model="page" :length="pageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
              <v-btn class="down" @click="handleDownload">Download <v-icon size="16">mdi-tray-arrow-down</v-icon></v-btn>
            </div>
          </v-tab-item>
          <v-tab-item key="12">
            <v-data-table :headers="myVotesHeaders" :items="myVotesList" class="elevation-0" hide-default-footer :items-per-page="votePerPage" :loading="stakeListLoading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :sort-by.sync="sortByVote" :sort-desc.sync="sortDescVote" :page.sync="votePage" @page-count="votePageCount = $event">
              <template v-slot:item.time="{ item }">
                <span>{{ (item.time * 1000) | dateFormat('YYYY-MM-dd hh:mm:ss') }}</span>
              </template>
              <template v-slot:item.amount="{ item }">
                <span>+{{ item.amount | asset(2) }}</span>
              </template>
            </v-data-table>
            <div class="text-center pt-2" v-if="myVotesList.length > 0">
              <v-pagination v-model="votePage" :length="votePageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
            </div>
          </v-tab-item>
          <v-tab-item key="13">
            <v-data-table :headers="myWithHeaders" :items="myWithdrawalsList" class="elevation-0" hide-default-footer :items-per-page="withdrawalsPerPage" :loading="stakeListLoading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :sort-by.sync="sortByWithdrawals" :sort-desc.sync="sortDescWithdrawals" :page.sync="withdrawalsPage" @page-count="withdrawalsPageCount = $event">
              <template v-slot:item.time="{ item }">
                <v-img :src="item.img" weight="24" height="24" />
                <span>{{ (item.time * 1000) | dateFormat('YYYY-MM-dd hh:mm:ss') }}</span>
              </template>
              <template v-slot:item.amount="{ item }">
                - <span>{{ item.amount | asset(2) }}</span>
              </template>
            </v-data-table>
            <div class="text-center pt-2" v-if="myWithdrawalsList.length > 0">
              <v-pagination v-model="withdrawalsPage" :length="withdrawalsPageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
            </div>
          </v-tab-item>
          <v-tab-item key="14">
            <v-data-table :headers="historyHeaders" :items="historyList" class="elevation-0" hide-default-footer :items-per-page="historyPerPage" :loading="jailLoading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="historyPage" @page-count="historyPageCount = $event">
              <template v-slot:item.timestamp="{ item }">
                <div>{{ (item.timestamp * 1000) | dateFormat('YYYY-MM-dd hh:ss:mm') }}</div>
              </template>
              <template v-slot:item.unjailedTimestamp="{ item }">
                <div v-if="item.unjailedTimestamp">{{ (item.unjailedTimestamp * 1000) | dateFormat('YYYY-MM-dd hh:ss:mm') }}</div>
                <div v-if="!item.unjailedTimestamp">-</div>
              </template>
              <template v-slot:item.unjailedForfeit="{ item }">
                <div>{{ item.unjailedForfeit | asset(2) }}</div>
              </template>
            </v-data-table>
            <div class="text-center pt-2" v-if="historyList.length > 10">
              <v-pagination v-model="historyPage" :length="historyPageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
            </div>
          </v-tab-item>
          <v-tab-item key="15">
            <v-data-table :headers="slashHeaders" :items="slashList" class="elevation-0" hide-default-footer :items-per-page="slashPerPage" :loading="slashLoading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="slashPage" @page-count="slashPageCount = $event">
              <template v-slot:item.slashBlockHeight="{ item }">
                <a :class="dark ? 'block-dark block-link' : 'block-light block-link'" :href="`https://scan.rei.network/block/${item.slashBlockHeight}/transactions`" target="_blank">
                  <span> {{ item.slashBlockHeight }}</span>
                </a>
              </template>
              <template v-slot:item.timestamp="{ item }">
                <span> {{ (item.slashBlockTimestamp * 1000) | dateFormat('YYYY-MM-dd hh:mm:ss') }}</span>
              </template>
              <template v-slot:item.reason="{ item }">
                <v-btn class="reason-list" @click="openProof(item)">
                  <span style="font-size: 12px"> {{ item.reason }} ></span>
                </v-btn>
              </template>
              <template v-slot:item.amount="{ item }">
                <span> {{ item.amount | asset(2) }}</span>
              </template>
            </v-data-table>
            <div class="text-center pt-2" v-if="slashList.length > 10">
              <v-pagination v-model="slashPage" :length="slashPageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <v-dialog v-model="setProofDialog" width="580">
      <v-card class="dialog-card" :class="dark ? 'dialog-night' : 'dialog-daytime'">
        <div class="dialog-validator">
          <div class="proof-title">Evidence</div>
          <div @click="cancelProof" class="close-btn"><v-icon>mdi-close</v-icon></div>
        </div>
        <h4>voting1</h4>
        <v-list dense>
          <v-list-item>
            <v-list-item-icon>
              <v-list-item-title>ChainId</v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ voteAJson.chainId }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-list-item-title>Type</v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ voteAJson.type }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-list-item-title>Height</v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ voteAJson.height }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-list-item-title>Round</v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ voteAJson.round }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-list-item-title>Hash</v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <Address :val="voteAJson.hash"></Address>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-list-item-title>Index</v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ voteAJson.index }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-list-item-title>Signature</v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <Address :val="voteAJson.signature"></Address>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <h4>voting2</h4>
        <v-list dense>
          <v-list-item>
            <v-list-item-icon>
              <v-list-item-title>ChainId</v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ voteBJson.chainId }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-list-item-title>Type</v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ voteBJson.type }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-list-item-title>Height</v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ voteBJson.height }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-list-item-title>Round</v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ voteBJson.round }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-list-item-title>Hash</v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <Address :val="voteBJson.hash"></Address>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-list-item-title>Index</v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ voteBJson.index }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-list-item-title>Signature</v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <Address :val="voteBJson.signature"></Address>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Web3 from 'web3';
import { mapActions, mapGetters } from 'vuex';
import filters from '../filters';
import Address from '../components/Address';
import abiConfig from '../abis/abiConfig';
import abiStakeManager from '../abis/abiStakeManager';
import abiCommissionShare from '../abis/abiCommissionShare';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import Papa from 'papaparse';
import { getAddressTag, getSlashRecords } from '../service/CommonService';

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT;
let client = null;

export default {
  components: {
    Address
  },
  filters,
  data() {
    return {
      skeletonLoading: true,
      tab1: 0,
      tab2: 1,
      url:this.$route.query.id,
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      votePage: 1,
      votePageCount: 0,
      votePerPage: 20,
      withdrawalsPage: 1,
      withdrawalsPageCount: 0,
      withdrawalsPerPage: 20,
      historyPage: 1,
      historyPageCount: 0,
      historyPerPage: 20,
      stakeListLoading: false,
      voteListLoading: false,
      jailLoading: false,
      slashPage: 1,
      slashPageCount: 0,
      slashPerPage: 20,
      slashLoading: false,
      setProofDialog: false,
      addrCopying: false,
      stakeManageInstance: '',
      commissionShareInstance: '',
      allStakeListLoading: false,
      routerMap: {
        delegator: {
          index: 0
        },
        myvote: {
          index: 1
        },
        withdrawals: {
          index: 2
        },
        jail: {
          index: 3
        },
         slash: {
          index: 4
        }
      },
      allStakeList: [],
      delegator: '',
      fields: ['delegator', 'amount'],
      createCsvFile: '',
      headers: [
        { text: 'Delegators', value: 'delegator' },
        { text: 'Amount ($REI)', value: 'amount' }
      ],
      historyHeaders: [
        // { text: 'Delegators', value: 'delegator' },
        { text: 'Time in Jail', value: 'timestamp' },
        { text: 'Time of Paying fine', value: 'unjailedTimestamp' },
        { text: 'Amount ($REI)', value: 'unjailedForfeit' }
      ],
      historyList: [],
      delegatorList: [],
      myVotesHeaders: [
        { text: 'Time', value: 'time' },
        { text: 'Amount ($REI)', value: 'amount' }
      ],
      sortByVote: 'time',
      sortDescVote: true,
      myVotesList: [],
      myWithHeaders: [
        { text: 'Time', value: 'time' },
        { text: 'Amount ($REI)', value: 'amount' }
      ],
      sortByWithdrawals: 'time',
      sortDescWithdrawals: true,
      myWithdrawalsList: [
        {
          time: '2022-12-19 12:30',
          amount: 121545.0
        },
        {
          time: '2022-12-19 12:30',
          amount: 121545.0
        }
      ],
      slashHeaders: [
        { text: 'Block Height', value: 'slashBlockHeight' },
        { text: 'Timestamp', value: 'timestamp' },
        { text: 'Reason', value: 'reason' },
        { text: 'Slash amount ($REI)', value: 'amount' }
      ],
      slashList: [
        {
          slashBlockHeight: '9185063',
          timestamp: '2022/12/03 12:26:18',
          reason: 'double signatures >',
          amount: '560,000.00'
        }
      ],
      voteAJson: [],
      voteBJson: []
    };
  },
  watch: {
    tab1: function () {
      console.log('url',this.url)
      let type = this.$route.params.type;
      if (!type) {
        this.tab2 = 0;
      } else {
        this.tab2 = this.routerMap[type].index;
      }
    }
  },
  computed: {
    ...mapGetters({
      connection: 'connection',
      dark: 'dark',
      apiUrl: 'apiUrl'
    })
  },
  mounted() {
    this.connect();
    this.init();
    this.getHistoryJail();
    this.getSlashData();
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
      if (this.$route.query.id) {
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
        uri: `${url}chainMonitorOnlyForStake`,
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
        let {
          data: { data: addressTag }
        } = await getAddressTag();
        let addressTagMap = {};
        for (let i = 0; i < addressTag.length; i++) {
          let key = web3.utils.toChecksumAddress(addressTag[i].address);
          addressTagMap[key] = addressTag[i];
        }
        let balanceOfShare = await Promise.all(balanceOfShareMap);
        var arr = [];
        for (let i = 0; i < delegatorList.length; i++) {
          let _addressName = '';
          let _address = web3.utils.toChecksumAddress(delegatorList[i].from);
          if (addressTagMap[_address]) {
            _addressName = addressTagMap[_address].addressName;
          }
          arr.push({
            delegator: _address,
            amount: web3.utils.fromWei(web3.utils.toBN(balanceOfShare[i].balance)),
            addressName: _addressName
          });
        }
        this.delegatorList = arr;
      }
      function sortArr(attr) {
        return function (a, b) {
          return b[attr] - a[attr];
        };
      }
      this.delegatorList = this.delegatorList.sort(sortArr('amount'));
      this.delegatorList.map((item, index) => {
        if (item.delegator == this.connection.address) {
          this.delegatorList.unshift(this.delegatorList.splice(index, 1)[0]);
        }
      });
      this.skeletonLoading = false;
      this.stakeListLoading = false;
    },
    async getMyVotesList() {
      this.voteListLoading = true;
      let url = this.apiUrl.graph;
      let client = new ApolloClient({
        uri: `${url}chainMonitorOnlyForStake`,
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
      const {
        data: { stakeInfoMores }
      } = await client.query({
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
        };
      });

      this.voteListLoading = false;
    },
    async getMyWithdrawList() {
      this.withdrawListLoading = true;
      let url = this.apiUrl.graph;
      let client = new ApolloClient({
        uri: `${url}chainMonitorOnlyForStake`,
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
      const {
        data: { unStakeInfos }
      } = await client.query({
        query: getMyWithdrawInfos,
        variables: {},
        fetchPolicy: 'cache-first'
      });

      this.myWithdrawalsList = unStakeInfos.map((item) => {
        return {
          time: item.timestamp,
          amount: web3.utils.fromWei(web3.utils.toBN(item.shares))
        };
      });

      this.withdrawListLoading = false;
    },
    async getBalanceOfShare(item) {
      let balance = 0;
      if (item.from) {
        balance = await this.commissionShareInstance.methods.balanceOf(item.from).call({ from: this.connection.address });
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
      let csvName = `${this.$route.query.id}.csv`;
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
    async getHistoryJail() {
      this.jailLoading = true;
      let url = this.apiUrl.graph;

      client = new ApolloClient({
        uri: `${url}chainMonitorBetterPos`,
        cache: new InMemoryCache()
      });

      const getJailInfos = gql`
        query jailRecords {
          jailRecords(where: { address: "${this.$route.query.id}" }) {
            id
            address
            blockNumber
            timestamp
            unjailedBlockNumber
            unjailedTimestamp
            unjailedForfeit
            __typename
          }
        }
      `;
      const {
        data: { jailRecords }
      } = await client.query({
        query: getJailInfos,
        fetchPolicy: 'cache-first'
      });
      this.historyList = jailRecords.map((item) => {
        let unjailedForfeit = item.unjailedForfeit ? web3.utils.fromWei(web3.utils.toBN(item.unjailedForfeit)) : 0;
        return {
          ...item,
          unjailedForfeit: unjailedForfeit
        };
      });
      this.jailLoading = false;
    },
    async getSlashData() {
      this.slashLoading = true;
      let data = await getSlashRecords({ miner: this.$route.query.id });
      this.slashList = data.data;
      this.slashList = this.slashList.map((item) => {
        let amount = web3.utils.fromWei(web3.utils.toBN(item.slashAmount));
        return {
          ...item,
          amount: amount
        };
      });
      this.slashLoading = false;
    },
    openProof(value) {
      this.setProofDialog = true;
      this.voteAJson = value.voteAJson;
      this.voteBJson = value.voteBJson;
    },
    cancelProof() {
      this.setProofDialog = false;
    }
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
.total {
  padding: 4px 8px;
  border-radius: 20px;
  margin-left: 8px;
  color: white;
}
.skeleton {
  margin-top: -68px;
}
.total-light {
  background-color: #e2e4ea;
}
.total-dark {
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
.mine {
  background-color: #fc9354;
  padding: 1px 8px;
  color: #fff;
  border-radius: 12px;
}
.down {
  margin-top: 4px;
}
.history-list {
  padding: 20px;
  width: 320px;
  color: #868e9e;
  font-size: 14px;
}
.history-help {
  text-indent: 2em;
}
.reason-list {
  font-size: 14px !important;
  background-color: #ffcdcd !important;
}
.dialog-night {
  background-color: #595777;
}
.dialog-daytime {
  background-color: #fff;
}
.dialog-card {
  padding: 20px;
}
.v-list-item {
  color: #8b8b8b;
}
.theme--light.v-list-item:nth-child(odd) {
  background-color: #f0f0f0;
}
.theme--dark.v-list-item:nth-child(odd) {
  background-color: #393560;
}
h4 {
  margin-top: 20px;
}
.proof-title {
  font-size: 20px;
  font-weight: bold;
}
.dialog-validator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .close-btn {
    margin-right: 16px;
    padding: 0;
    background-color: transparent;
    cursor: pointer;
  }
}
.v-btn {
  font-weight: normal !important;
}
.block-dark {
  color: #fff;
}
.block-light {
  color: #000;
}
.block-light:hover {
  color: #6979f8 !important;
  text-decoration: underline;
}
.theme--dark.v-list {
  background: #504985 !important;
}
.v-tab {
  padding: 0 24px;
}
</style>
