<template>
  <v-container>
    <h3>Validator Info</h3>
    <v-row class="mt-5 mb-5">
      <v-col class="rei-validator">
        <div>
          <v-img v-if="detail && detail.logo" :src="$IpfsGateway(detail.logo)" width="42" height="42" />
          <v-img v-else src="../assets/images/rei.svg" width="42" height="42" />
        </div>
        <div class="fans-right">
          <v-row align="center">
            <h3 class="validator-nodename" v-if="detail && detail.nodeName">{{ detail.nodeName }}</h3>
            <div v-if="detailData" :class="detailData.active?'active':'not-active'">{{ status[detailData.active] }}</div>
            <div class="three-img">
              <!-- <v-img class="img-icon" src="../assets/images/twitter.svg" width="20" height="20"/> -->
              <a v-if="detail && detail.website" :href="detail.website" target="_blank"><v-img class="img-icon" src="../assets/images/circle-icon.svg" width="20" height="20" /></a>

              <!-- <v-img class="img-icon" src="../assets/images/telegram.svg" width="20" height="20"/> -->
            </div>
          </v-row>
          <v-row class="validator-address">
            <span class="font-grey" v-if="detail && detail.nodeAddress">{{ detail && detail.nodeAddress }}</span>
            <span class="font-grey" v-else>{{ detailData && detailData.address }}</span>
            <v-btn class="copy-btn" @click="copyAddr(detailData.address)">
              <v-icon small color="#868E9E">{{ addrCopying ? 'mdi-checkbox-marked-circle-outline' : 'mdi-content-copy' }}</v-icon>
            </v-btn>
          </v-row>
        </div>
      </v-col>
      <v-col class="vote-btn">
        <div>
          <v-btn small color="vote_button" v-if="inDefaultList()" class="mr-4 font-btn" height="32" @click="handleStaking()">
            {{ $t('stake.staking') }}
          </v-btn>
          <v-btn small color="start_unstake" class="mr-4 unstake_btn" height="32" @click="handleClaim()" style="margin-right: 0 !important">
            {{ $t('stake.claim') }}
          </v-btn>
        </div>
        <div v-if="detailData.active">
          <v-btn width="196" small color="start_unstake" class="calculate-btn unstake_btn" height="32" @click="setCalculation()">
            <span class="iconfont">&#xe619;</span><span style="font-size:12px;">Calculate Rewards</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <div class="font-grey fans-content" v-if="detail && detail.nodeDesc">
      {{ detail.nodeDesc }}
    </div>
    <v-card outlined class="vote-number">
      <v-row justify="space-between">
        <v-col cols="12" sm="3">
          <div class="font-grey">Voting Power ($REI)</div>
          <h2>{{ votingPower | asset(2) }}</h2>
        </v-col>
        <v-col cols="12" sm="3">
          <div class="font-grey">Commission Rate</div>
          <h2 v-if="detailData.commissionRate">{{ detailData.commissionRate }}%</h2>
          <h2 v-else>0%</h2>
        </v-col>
        <v-col cols="12" sm="3">
          <div class="font-grey">
            APR
             <v-tooltip left color="start_unstake">
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="right_icon" v-bind="attrs" v-on="on" dense size="16" style="margin:0 0 4px 4px"> mdi-help-circle-outline </v-icon>
              </template>
              <span>It's a theoretical rate of return. The actual reward is<br/> affected by the network block production duration <br/>and the validator response rate, the actual rate of<br/> return shall prevail.</span>
            </v-tooltip>
          </div>
          <h2>{{ apr | asset(2) }}%</h2>
        </v-col>
         <v-col cols="12" sm="3">
          <div class="font-grey">Response Rate <v-tooltip right v-if="minedInfo">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        size="14"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-help-circle-outline
                      </v-icon>
                    </template>
                    <span>
                        Block produced: {{ minedInfo.minerMessage&&minedInfo.minerMessage.minedNumber}}<br>
                        Block missed(All):{{ minedInfo.minerMissRecordNumber }}<br>
                        Block missed(7day): {{ minedInfo.minerMissRecordNumberDay7 }}<br>
                        Block missed(1day): {{ minedInfo.minerMissRecordNumberDay1 }}
                    </span>
                  </v-tooltip></div>
          <h2>{{ responseRate | asset(2) }}%</h2>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="dialog" width="500" class="dialog-card">
      <v-card :class="dark ? 'dialog-night' : 'dialog-daytime'">
        <div class="dialog-validator">
          <v-card-title class="dialog-title">{{ $t('stake.staking_info') }}</v-card-title>
          <div @click="cancelStaking" class="close-btn"><v-icon>mdi-close</v-icon></div>
        </div>
        <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-dialog start_unstake">
          <v-form ref="stakeform" lazy-validation>
            <div class="pb-1 text-body-1">
              <span class="font-color">{{ $t('stake.node') }}</span
              >: <Address :val="validatorAddress"></Address>
            </div>
            <div class="pb-1 text-body-1 text-bod">
              <span class="font-color">{{ $t('stake.wallet_balance') }}:</span>
              <span style="font-weight: bold">{{ connection.balance | asset(2) }}</span>
              <span class="font-color"> REI</span>
            </div>
            <v-row>
              <v-col class="from-voting">
                <div class="input-title">Amount</div>
                <v-text-field v-model="form.amount" :label="$t('stake.amount')" required :rules="amountRules" outlined background-color="input_other" class="text-filed">
                  <template v-slot:append>
                    <v-btn text x-small @click="setAll('form')">
                      {{ $t('stake.max') }}
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <div class="text-center">
              <v-btn @click="cancelStaking" class="mr-4 cancel-btn" outlined color="btn_button">
                {{ $t('stake.btn_cancel') }}
              </v-btn>
              <v-btn :loading="stakeLoading" @click="submitStaking" color="vote_button" class="font-btn">
                {{ $t('stake.btn_submit') }}
              </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="claimDialog" width="500" class="dialog-card">
      <v-card :class="dark ? 'dialog-night' : 'dialog-daytime'">
        <div class="dialog-validator">
          <v-card-title class="dialog-title">{{ $t('stake.claim_info') }}</v-card-title>
          <div @click="cancelClaim" class="close-btn"><v-icon>mdi-close</v-icon></div>
        </div>
        <v-list rounded class="ma-dialog start_unstake">
          <v-form ref="claimform" lazy-validation>
            <div class="pb-1 text-body-1">
              <span class="font-color">{{ $t('stake.node') }}:</span>
              <Address :val="validatorAddress"></Address>
            </div>
            <div class="pb-1 text-body-1 share-rei">
              <span class="font-color">{{ $t('stake.commonnsion_share_balance') }}</span>
              <span style="font-weight: bold">{{ myCommissionShareBalance | asset(2) }}</span>
            </div>
            <v-row>
              <v-col class="from-voting">
                <div class="input-title">Amount</div>
                <v-text-field v-model="claimForm.amount" :label="$t('stake.amount')" v-on:keyup="calculateAmount" required :rules="amountRules" outlined background-color="input_other" class="text-filed" height="24">
                  <template v-slot:append>
                    <v-btn text x-small @click="claimAll()">
                      {{ $t('stake.max') }}
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <div class="text-center">
              <v-btn class="mr-4 font-btn" color="vote_button" v-if="!approved" :loading="approveLoading" @click="submitApprove">
                {{ $t('stake.approve') }}
              </v-btn>
              <v-btn @click="cancelClaim" color="btn_button" outlined class="mr-4 cancel-btn">
                {{ $t('stake.btn_cancel') }}
              </v-btn>
              <v-btn color="vote_button" class="font-btn" :disabled="!approved" :loading="claimLoading" @click="submitClaim">
                {{ $t('stake.btn_submit') }}
              </v-btn>
            </div>
            <div :class="dark ? 'pb-3 text-day' : 'pb-3 text-caption'">
              <strong>{{ $t('stake.tips_claim_info', { unstakeDelay: timeToFormat(unstakeDelay) }) }}</strong>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="calculationDialog" width="580">
      <v-card class="calculation-card">
        <v-row justify="space-between">
          <v-col cols="12" md="10">
            <h3><span class="iconfont">&#xe619;&nbsp;&nbsp;</span>Calculate Voting Rewards<v-tooltip right color="start_unstake">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="right_icon" v-bind="attrs" v-on="on" dense size="16" style="margin-left: 4px"> mdi-alert-circle-outline </v-icon>
                </template>
                <span>This calculation of earnings is for reference only<br />
                  and does not represent the final earnings, please<br />
                  refer to the actual results.</span>
              </v-tooltip></h3>
          </v-col>
          <v-col cols="12" md="1" @click="cancelCalculation()" class="close-dialog">
            <v-icon>mdi-close</v-icon>
          </v-col>
        </v-row> 
        <v-row>
          <v-col>
            <v-card outlined :class="dark ? 'dark-nodes node-details' : 'light-nodes node-details'">
              <v-row align="center" class="node-name">
                <h3 v-if="detail && detail.nodeName">{{ detail.nodeName }}&nbsp;&nbsp;</h3>
                <div class="active">Active</div>
                <div class="font-grey">&nbsp;&nbsp;Commission Rate: {{ detailData.commissionRate }}%</div>
              </v-row>
              <v-row>
                <div class="calculate-address">{{ detail.nodeAddress  }}</div>
                <v-btn @click="copyAddr(detail.address)" style="margin-top:8px;">
                  <v-icon small color="#868E9E">{{ addrCopying ? 'mdi-checkbox-marked-circle-outline' : 'mdi-content-copy' }}</v-icon>
                </v-btn>
              </v-row>
            </v-card>
            <v-row class="calculate-input" style="margin-top:30px;">
                <span class="subheading mr-1">Vote</span>
                <!-- <span :class="dark ? 'dark-amount' : 'light-amount'">{{ stake | asset() }}</span> -->
                <div style="width:200px;"><v-text-field v-model="stake" :rules="calculateRules" color="#6979F8" :class="dark ? 'dark-amount' : 'light-amount'"></v-text-field></div>               
                <span class="subheading mr-1 "> REI</span>
            </v-row>
            <!-- <v-slider v-model="stake" track-color="#F5F5F5" track-fill-color="#6979F8" thumb-color="#6979F8" tick-size="10" loader-height="10" always-dirty min="0" max="2000000"> </v-slider>
            <v-row justify="space-between" class="slider-num font-grey">
              <v-col>0</v-col>
              <v-col style="text-align: right">2M</v-col>
            </v-row> -->
            <v-row class="" justify="space-between">
              <v-col class="text-left">
                <span class=" mr-1">Locking $REI for</span>
                <span :class="dark ? 'dark-amount' : 'light-amount'">{{ this.days }}</span>
                <span class=" mr-1"> days</span>
              </v-col>
            </v-row>
            <v-slider v-model="days" track-color="#F5F5F5" track-fill-color="#6979F8" thumb-color="#6979F8" always-dirty min="0" max="365" tick-size="8"> </v-slider>
            <v-row justify="space-between" class="slider-num">
              <v-col>0 D</v-col>
              <v-col style="text-align: right">365D</v-col>
            </v-row>
            <v-row justify="space-between">
              <v-col class="">
                <div>Estimated rewards</div>
                <div>
                  <span :class="dark ? 'dark-amount' : 'light-amount'">{{ userRewardsYear | asset(2) }}</span> REI
                </div>
              </v-col>
              <v-col class="" style="text-align: right">
                <div>Current APR</div>
                <div>
                  <span :class="dark ? 'dark-amount' : 'light-amount'">{{ current | asset(2) }}</span> %
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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
import find from 'lodash/find';
import util from '../utils/util';
import dayjs from 'dayjs';
import Address from '../components/Address';
import abiConfig from '../abis/abiConfig';
import abiStakeManager from '../abis/abiStakeManager';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { getValidatorDetails, getValidatorMinedInfo } from '../service/CommonService';
import abiCommissionShare from '../abis/abiCommissionShare';

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT;

const ONE_DAY_UNIX = 24 * 60 * 60;
let client = null;

export default {
  components: {
    Address
  },
  filters,
  data() {
    return {
      detail: '',
      validatorAddress: this.$route.query.id,
      detailData: '',
      dialog: false,
      claimDialog: false,
      stakeLoading: false,
      claimLoading: false,
      approveLoading: false,
      stakeManageInstance: '',
      stakeManagerContract: '',
      commissionShareInstance: '',
      myCommissionShareBalance: 0,
      unstakeDelay: 0,
      receiveBalance: 0,
      approved: true,
      addrCopying: false,
      calculationDialog: false,
      stake: 0,
      days: 0,
      userRewardsYear: 0,
      current: 0,
      totalAmount: 0,
      apr:0,
      arr: [],
      votingPower:0,
      status: {
        true: this.$t('stake.isActive'),
        false: this.$t('stake.notActive')
      },
      form: {
        amount: 0
      },
      claimForm: {
        amount: 0
      },
      activeInfoList:[],
      validatorList:[],
      activeList: [],
      minedInfo:{},
      responseRate:0,
      calculateRules: [(v) => !!v || this.$t('msg.please_input_number')],
      amountRules: [(v) => !!v || this.$t('msg.please_input_amount'), (v) => (v && util.isNumber(v)) || this.$t('msg.please_input_correct_num'), (v) => (v && v > 0) || this.$t('msg.please_input_not_zero')],
      defaultValidatorList: ['0x0efe0da2b918412f1009337FE86321d88De091fb', '0x1b0885d33B43A696CD5517244A4Fcb20B929F79D', '0x2957879B3831b5AC1Ef0EA1fB08Dd21920f439b4', '0xaA714ecc110735B4E114C8B35F035fc8706fF930', '0xb7a19F9b6269C26C5Ef901Bd128c364Dd9dDc53a']
    };
  },
  computed: {
    ...mapGetters({
      connection: 'connection',
      dark: 'dark',
      apiUrl: 'apiUrl'
    }),
    listenChange() {
      const { stake, days } = this;
      return {
        stake,
        days
      };
    }
  },
  created() {},
  mounted() {
    this.connect();
    this.init();
  },
  watch:{
    listenChange(stake, days) {
      this.Calculation();
    },
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
      this.unstakeDelay = await contract.methods.unstakeDelay().call();
      let stake_contract = new web3.eth.Contract(abiStakeManager, this.stakeManagerContract);
      this.stakeManageInstance = stake_contract;
      if (this.$route.query.id) {
        let commissionShareAdd = await this.stakeManageInstance.methods.validators(this.$route.query.id).call();
        this.commissionShareInstance = new web3.eth.Contract(abiCommissionShare, commissionShareAdd[1]);
        let myCommissionShareBalance = await this.getBalanceOfShare();
        this.myCommissionShareBalance = web3.utils.fromWei(web3.utils.toBN(myCommissionShareBalance.balance));
      }
      let blockHeight = await web3.eth.getBlockNumber();
      let url = this.apiUrl.graph;
      client = new ApolloClient({
        uri: `${url}chainmonitor`,
        cache: new InMemoryCache()
      });
      const getValidatorsInfos = gql`
        query validators($blockHeight: String) {
          validators(where: { id: $blockHeight }) {
            id
            Validator(orderBy: votingPower, orderDirection: desc) {
              id
              address
              votingPower
              commissionRate
              commissionAddress
              active
            }
          }
        }
      `;
      let getValidatorList = async function (blockHeight) {
        let getData = async function (blockHeight) {
          const {
            data: { validators }
          } = await client.query({
            query: getValidatorsInfos,
            variables: {
              blockHeight: String(blockHeight)
            },
            fetchPolicy: 'cache-first'
          });
          return validators;
        };
        let _validator = await getData(blockHeight);
        if (!_validator.length) {
          _validator = await getValidatorList(blockHeight - 1);
        }
        return _validator;
      };

      let validators = await getValidatorList(blockHeight);

      this.validatorList = validators[0].Validator;
      for (let i = 0; i < this.validatorList.length; i++) {
        if(this.validatorList[i].active){
          this.activeInfoList.push(this.validatorList[i])
        }  
      }
      this.getValidatorInfo();
    },
    async getValidatorInfo() {
      let validatorDetails = await getValidatorDetails();
      
      let address = this.$route.query.id;

      // get validator response rate;
      const endTimestamp = dayjs().unix();
      const startTimestampDay1 = endTimestamp - ONE_DAY_UNIX;
      const startTimestampDay7 = endTimestamp - ONE_DAY_UNIX*7;

      let minedInfo = await getValidatorMinedInfo({miner:address});

      let minedInfoDay1 = await getValidatorMinedInfo({miner:address,starttimestamp:startTimestampDay1 });
      let minedInfoDay7 = await getValidatorMinedInfo({miner:address,starttimestamp:startTimestampDay7 });

      this.minedInfo = minedInfo.data ? minedInfo.data[0]: {};

      this.minedInfo.minerMissRecordNumberDay1 = minedInfoDay1.data[0].minerMissRecordNumber;
      this.minedInfo.minerMissRecordNumberDay7 = minedInfoDay7.data[0].minerMissRecordNumber;

      this.responseRate = this.calResponseRate(this.minedInfo);
      let validatorInfo = validatorDetails.data.data;
      this.detail = find(validatorInfo, (item) => web3.utils.toChecksumAddress(item.nodeAddress) == web3.utils.toChecksumAddress(address));
      this.detailData = find(this.validatorList, (item) => web3.utils.toChecksumAddress(item.address) == web3.utils.toChecksumAddress(address));

      this.votingPower =  web3.utils.fromWei(web3.utils.toBN(this.detailData.votingPower));
      
      this.totalAmount = 0;
      for (let i = 0; i < this.activeInfoList.length; i++) {
        let power =  web3.utils.fromWei(web3.utils.toBN(this.activeInfoList[i].votingPower));
        this.totalAmount += parseFloat(power); 
      }
        if(this.detailData.active){
          this.apr = (100000000 / this.totalAmount)*0.1* (this.detailData.commissionRate/100)*100
        }else{
          this.apr = 0
        }
    },
    handleStaking() {
      this.$refs.stakeform && this.$refs.stakeform.reset();
      this.form.amount = 0;
      this.dialog = true;
    },
    async submitStaking() {
      try {
        if (!this.$refs.stakeform.validate()) return;
        this.stakeLoading = true;
        const stakeRes = await this.stakeManageInstance.methods.stake(this.validatorAddress, this.connection.address).send({
          from: this.connection.address,
          value: web3.utils.numberToHex(web3.utils.toWei(this.form.amount))
        });
        if (stakeRes.transactionHash) {
          console.log(stakeRes);
          this.addTx({
            tx: {
              txid: stakeRes.transactionHash,
              type: 'stake',
              status: 'PENDING',
              data: {
                amount: this.form.amount,
                symbol: 'REI',
                to: util.addr(this.validatorAddress)
              },
              timestamp: new Date().getTime()
            }
          });
          this.dialog = false;
        }
      } catch (e) {
        this.dialog = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
      this.stakeLoading = false;
    },
    async getBalanceOfShare() {
      let balance = 0;
      if (this.connection.address) {
        balance = await this.commissionShareInstance.methods.balanceOf(this.connection.address).call();
        console.log(balance);
      }
      return {
        balance
      };
    },
    async handleClaim() {
      let address = this.$route.query.id;

      this.$refs.claimform && this.$refs.claimform.reset();
      this.receiveBalance = 0;
      this.claimForm.amount = 0;
      const allowance = await this.commissionShareInstance.methods.allowance(this.connection.address, this.stakeManagerContract).call();
      if (allowance != 0) {
        this.approved = true;
      } else {
        this.approved = false;
      }
      this.claimDialog = true;
    },
    cancelStaking() {
      this.$refs.stakeform && this.$refs.stakeform.reset();
      this.dialog = false;
    },
    cancelClaim() {
      this.$refs.claimform && this.$refs.claimform.reset();
      this.claimDialog = false;
    },
    setAll(obj) {
      this[obj].amount = this.connection.balance;
    },
    async submitApprove() {
      this.approveLoading = true;
      await this.commissionShareInstance.methods.approve(this.stakeManagerContract, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').send({ from: this.connection.address });
      this.approveLoading = false;
      this.approved = true;
    },
    async submitClaim() {
      this.startUnstake();
    },
    async startUnstake() {
      try {
        if (!this.$refs.claimform.validate()) return;
        this.claimLoading = true;
        const claimRes = await this.stakeManageInstance.methods.startUnstake(this.validatorAddress, this.connection.address, web3.utils.toWei(this.claimForm.amount)).send({
          from: this.connection.address
        });
        console.log(claimRes);
        if (claimRes.transactionHash) {
          this.addTx({
            tx: {
              txid: claimRes.transactionHash,
              type: 'startunstake',
              status: 'PENDING',
              data: {
                amount: this.claimForm.amount,
                symbol: 'REI',
                to: util.addr(this.validatorAddress)
              },
              timestamp: new Date().getTime()
            }
          });
          this.claimDialog = false;
        }
      } catch (e) {
        this.claimDialog = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
      this.claimLoading = false;
    },
    async calculateAmount() {
      if (util.isNumber(this.claimForm.amount) && this.claimForm.amount > 0) {
        const amount = await this.stakeManageInstance.methods.estimateSharesToAmount(this.detailData.address, web3.utils.toWei(this.claimForm.amount)).call();
        this.receiveBalance = web3.utils.fromWei(web3.utils.toBN(amount));
      }
    },
    claimAll() {
      this.claimForm.amount = this.myCommissionShareBalance;
      this.calculateAmount();
    },
    timeToFormat(val) {
      let str = '';
      let resdays = Math.floor(val / 60 / 60 / 24);
      if (resdays > 0) {
        str = resdays + this.$t('msg.days');
      } else if (Math.floor(val / 60 / 60) > 0) {
        str = Math.floor(val / 60 / 60) + this.$t('msg.hour');
      } else {
        str = val / 60 + this.$t('msg.minute');
      }
      return str;
    },
    copyToClipboard(str) {
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
    },
    sleep(timestamp) {
      return new Promise((resolve) => {
        setTimeout(resolve, timestamp);
      });
    },
    async copyAddr(addr) {
      try {
        window.navigator.clipboard.writeText(addr);
        this.copyToClipboard(addr);
      } catch (ex) {
        console.log(ex);
      } finally {
        this.addrCopying = true;
        await this.sleep(500);
        this.addrCopying = false;
      }
    },
    inDefaultList() {
      return !this.defaultValidatorList.includes(web3.utils.toChecksumAddress(this.$route.query.id));
    },
    setCalculation() {
      this.calculationDialog = true;
    },
    async Calculation() {
      let votingRewardsYear = 10000000 * ((parseFloat(this.detailData.votingPower) + this.stake*1 ) / (this.totalAmount*1 + this.stake*1)) * (this.detailData.commissionRate/ 100);
      this.userRewardsYear = ((votingRewardsYear * this.stake) / (parseFloat(this.detailData.votingPower) + this.stake*1) / 365) * this.days;
      this.current = (this.userRewardsYear / (this.stake * 365)) * this.days * 100;
    },
    cancelCalculation() {
      this.calculationDialog = false;
    },
    calResponseRate(item){
      if(!item) return 0;
      let totalBlock = item.minerMessage.minedNumber*1 + item.minerMissRecordNumber*1;
      let percent = item.minerMessage.minedNumber/totalBlock*100
      return percent.toFixed(2)
    }
  }
};
</script>

<style scoped lang="scss">
.font-btn.v-btn.v-btn--has-bg {
  color: #fff;
  background: #6979f8;
  font-size: 12px;
}
.unstake_btn.theme--dark.v-btn.v-btn--has-bg {
  background: #595777;
}
.v-btn {
  text-transform: none !important;
}
.v-sheet--outlined {
  border: none;
  border-radius: 6px;
}
.font-grey {
  color: #868e9e;
  font-size: 14px;
}
.rei-validator {
  padding-top: 8px;
  display: flex;
  align-items: center;
  .validator-nodename {
    margin-right: 8px;
  }
  .fans-right {
    margin-left: 20px;
  }
  .active {
    height: 18px;
    background-color: #fc9354;
    border-radius: 15px;
    padding: 0 10px;
    color: #fff;
    font-size: 14px;
  }
  .three-img {
    display: flex;
    .img-icon {
      margin: 0 4px;
    }
  }
}
.vote-btn {
  text-align: right;
}
.fans-content {
  margin: 28px 0;
}
.theme--light.vote-number {
  background-color: #f7f7f7;
  padding: 12px 20px;
}
.theme--dark.vote-number {
  background-color: #13112b;
  padding: 12px 20px;
}
.ma-dialog {
  padding: 16px;
}
.text-center {
  text-align: right !important;
}
.dialog-night {
  background-color: #595777;
  padding: 20px 0;
}
.dialog-daytime {
  background-color: #fff;
  padding: 20px 0;
}
.dialog-validator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 12px;
  .v-card__subtitle,
  .v-card__text,
  .v-card__title {
    padding: 0;
  }
  .v-card__title {
    font-size: 1rem;
  }
  .close-btn {
    margin-right: 16px;
    padding: 0;
    background-color: transparent;
    cursor: pointer;
  }
}
.from-voting {
  display: flex;
  flex-direction: column;
  .input-title {
    margin-top: 0;
    height: 24px;
  }
}
.from-amount {
  margin-top: -32px;
}
.font-color {
  color: #868e9e;
}
.text-bod {
  text-align: right;
}
.text-caption {
  margin-top: 12px;
  padding: 12px;
  // background-color:#FFF5DB;
  border: 1px #fb7e36 solid;
  color: #fb7e36;
  border-radius: 4px;
}
.text-day {
  margin-top: 12px;
  padding: 12px;
  background-color: transparent;
  border: 1px #9f9db9 solid;
  color: #9f9db9;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 300 !important;
}
.share-rei {
  text-align: right;
  margin: 12px 0;
}
.copy-btn.v-btn.v-btn--has-bg {
  background-color: transparent !important;
  margin-top: -8px;
}
.calculate-btn{
  margin-top:12px;
}
.calculation-card {
  padding: 40px;
}
.subheading{
  height:30px;
  margin-top:20px;
  margin-left:12px
}
.calculation-card.theme--dark.v-sheet {
  background-color: #595777;
}
.close-dialog {
  cursor: pointer;
}
.active {
  line-height: 20px;
  background-color: #43c06d;
  border-radius: 15px;
  margin-left: 8px;
  padding: 2px 8px;
  color: #fff;
}
.not-active {
  line-height: 20px;
  background-color: #5f82ad;
  border-radius: 15px;
  margin-left: 2px;
  padding: 2px 10px;
  color: #fff;
}
.light-amount {
  color: #6979F8;
  font-weight: bolder !important;
  font-size: 22px;
}
.dark-amount {
  color: #fff;
  font-weight: bolder !important;
  font-size: 22px;
}
.light-nodes{
  background-color: #F5F9FD;
}
.dark-nodes{
  background-color: #4C4A68;
  // opacity: 0.5;
}
.node-details{
  padding-top: 12px;
  border-radius: 8px;
  border:none;
  .node-name{
    margin-top: 10px;
    margin-left:20px
  }
  .calculate-address{
    margin-top: 12px;
    margin-left:34px;
    margin-bottom:24px
  }
  .theme--dark.v-btn.v-btn--has-bg{
    background-color: transparent;
  }
}
.slider-num {
  padding: 0 12px;
  margin-top: -40px;
}
.font-blue {
  font-size: 24px;
  font-weight: bolder;
  color: #2116e5;
}
</style>
