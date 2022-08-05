<template>
  <v-container>
    <h3>Validator Info</h3>
    <v-row class="mt-5 mb-5">
        <v-col class="rei-fans">
            <div>
                <v-img v-if="detail&&detail.logo" :src="detail.logo" width="42" height="42"/>
                <v-img v-else src="../assets/images/rei.svg" width="42" height="42"/>
            </div>
            <div class="fans-right">
                <v-row align="center">
                    <h3 v-if="detail&&detail.nodeName">{{detail.nodeName}}</h3>
                    <div v-if="detailData" class="active">{{status[detailData.isActive]}}</div>
                    <div class="three-img">
                        <!-- <v-img class="img-icon" src="../assets/images/twitter.svg" width="20" height="20"/> -->
                        <a v-if="detail&&detail.website" :href="detail.website" ><v-img class="img-icon" src="../assets/images/circle-icon.svg" width="20" height="20"/></a>
                        
                        <!-- <v-img class="img-icon" src="../assets/images/telegram.svg" width="20" height="20"/> -->
                    </div>
                </v-row>
                <v-row>
                    <span class="font-grey" v-if="detail&&detail.nodeAddress">{{detail&&detail.nodeAddress}}</span>
                    <span class="font-grey" v-else>{{detailData&&detailData.address}}</span>
                    <v-btn class="copy-btn" @click="copyAddr(detailData.address)">
                        <v-icon small color="#868E9E">{{ addrCopying ? 'mdi-checkbox-marked-circle-outline' : 'mdi-content-copy' }}</v-icon>
                    </v-btn>
                </v-row>
            </div>
        </v-col>
        <v-col class="vote-btn">
            <v-btn small color="vote_button" class="mr-4 font-btn" height="32" @click="handleStaking()">
                {{ $t('stake.staking') }}
            </v-btn>
            <v-btn small color="start_unstake" class="mr-4 unstake_btn" height="32" @click="handleClaim()" style="margin-right:0 !important;">
                {{ $t('stake.claim') }}
            </v-btn>
        </v-col>
    </v-row>
    <div class="font-grey fans-content" v-if="detail&&detail.nodeDesc">
        {{detail.nodeDesc}}
    </div>
    <v-card outlined class="vote-number">
        <v-row justify="space-between">
            <v-col cols="12" sm="3">
                <div class="font-grey">Voting Power ($REI)</div>
                <h2>{{ detailData.power | asset(2) }}</h2>
            </v-col>
             <v-col cols="12" sm="3">
                <div class="font-grey">Commission Rate</div>
                <h2>{{ detailData.commissionRate }}%</h2>
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
              <span class="font-color">REI</span>
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
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Web3 from 'web3';
import { mapActions,mapGetters } from 'vuex';
import filters from '../filters';
import find from 'lodash/find';
import util from '../utils/util';
import Address from '../components/Address';
import abiConfig from '../abis/abiConfig';
import abiStakeManager from '../abis/abiStakeManager';
import { getValidatorList,getValidatorDetails } from '../service/CommonService'
import abiCommissionShare from '../abis/abiCommissionShare';

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT;

export default {
  components: {
    Address,
  },
  filters,
  data() {
    return {
     detail: '',
     validatorAddress:this.$route.query.id,
     detailData:'',
     dialog: false,
     claimDialog: false,
     stakeLoading: false,
     claimLoading: false,
     approveLoading: false,
     stakeManageInstance: '',
     stakeManagerContract: '',
     commissionShareInstance:'',
     myCommissionShareBalance:0,
     unstakeDelay: 0,
     receiveBalance: 0,
     approved: true,
     addrCopying: false,
     arr:[],
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
     activeList:[
         {
             address:"0x116F46EB05D5e42b4CD10E70B1b49706942f5948",
             power:"657659.99",
             commissionShare:"123179341",
             commissionRate:20
         }
     ],
     amountRules: [(v) => !!v || this.$t('msg.please_input_amount'), (v) => (v && util.isNumber(v)) || this.$t('msg.please_input_correct_num'), (v) => (v && v > 0) || this.$t('msg.please_input_not_zero')],
    };
  },
  computed: {
    ...mapGetters({
        connection: 'connection',
        dark: 'dark',
        apiUrl: 'apiUrl'
    })
  },
  created(){

  },
  mounted(){
    this.connect();
    this.getValidatorInfo();
    this.init();
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
        if(this.$route.query.id){
          let commissionShareAdd = await this.stakeManageInstance.methods.validators(this.$route.query.id).call();
          this.commissionShareInstance = new web3.eth.Contract(abiCommissionShare, commissionShareAdd[1]);
          let myCommissionShareBalance = await this.getBalanceOfShare();
          this.myCommissionShareBalance = web3.utils.fromWei(web3.utils.toBN(myCommissionShareBalance.balance))
        }
    },
    async getValidatorInfo(){
       let validatorDetails = await getValidatorDetails();
       let address = this.$route.query.id;
       let validatorInfo = validatorDetails.data.data
       this.detail = find(validatorInfo, (item) => web3.utils.toChecksumAddress(item.nodeAddress) == web3.utils.toChecksumAddress(address));
       let validatorData = await getValidatorList();
       console.log('validatorData',validatorData)
       let allValidatorList = [].concat(validatorData.data.data.activeList).concat(validatorData.data.data.inActiveList);
       this.activeList = validatorData.data.data.activeList;
       this.detailData = find(allValidatorList, (item) => web3.utils.toChecksumAddress(item.address) == web3.utils.toChecksumAddress(address));
       
       console.log('this.detailData',this.detailData)
       console.log('this.detail',this.detail)
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
        console.log(balance)
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
        console.log('this.detailData',this.claimForm.amount)
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
      })
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
  }
};
</script>

<style scoped lang="scss">
.font-btn.v-btn.v-btn--has-bg {
  color: #fff;
  background: #6979f8;
}
.unstake_btn.theme--dark.v-btn.v-btn--has-bg {
  background: #595777;
}
.v-btn {
  text-transform: none !important;
}
.v-sheet--outlined{
    border: none;
    border-radius: 6px;
}
.font-grey{
    color: #868E9E ;
    font-size: 14px;
}
.rei-fans{
    padding-top: 8px;
    display: flex;
    align-items: center;
    .fans-right{
        margin-left: 20px;
    }
    .active {
        height: 18px;
        background-color: #FC9354;
        border-radius: 15px;
        margin-left: 8px;
        padding: 0 10px;
        color: #fff;
        font-size: 14px;
    }
    .three-img{
        display:flex;
        .img-icon{
            margin: 0 4px;
        }
    }
}
.vote-btn{
    text-align: right;
}
.fans-content{
    margin: 28px 0;
}
.theme--light.vote-number{
    background-color: #F7F7F7;
    padding: 12px 20px;
}
.theme--dark.vote-number{
    background-color: #13112B;
    padding: 12px 20px;
}
.ma-dialog {
  padding: 16px;
}
.text-center{
    text-align: right !important;
}
.dialog-night {
  background-color: #595777;
  padding:20px 0;
}
.dialog-daytime {
  background-color: #fff;
  padding:20px 0;
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
.copy-btn.v-btn.v-btn--has-bg{
    background-color: transparent !important;
    margin-top:-8px;
}
</style>
