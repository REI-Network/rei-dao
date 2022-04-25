<template>
  <v-container class="gas-list background">
    <v-tabs v-model="tab1" align-with-title class="vote-list" background-color="background">
        <v-tab key="1">My Gas Stake</v-tab>
        <v-tab key="2">Staking to Me by Others</v-tab> 
    </v-tabs>
    <v-tabs-items v-model="tab1">
        <v-tab-item key="1" >
            <v-row class="background">
                <v-col>
                    <v-data-table
                        :headers="headers"
                        :items="nodeList"
                        class="background elevation-0"
                        hide-default-footer
                        :items-per-page="itemsPerPage"
                        :loading="stakeListLoading"
                        :loading-text="$t('msg.loading')"
                        :page.sync="page"
                        @page-count="pageCount = $event"
                    >
                        <template v-slot:item.address="{ item }">
                        <!-- <Address :val="item.address"></Address> -->
                            {{ item.address | addr }}
                        </template>
                        <template v-slot:item.amount="{ item }">
                            {{ item.amount | asset(2) }}
                        </template>
                        <template v-slot:item.deposit="{ item }">
                            {{ item.timestamp*1000 | dateFormat('YYYY-MM-dd hh:mm:ss') }}
                        </template>
                        <template v-slot:item.withdraw="{ item }">
                            {{ item.availableTime}}
                        </template>
                        <!-- <template v-slot:item.isActive="{ item }">
                            {{ status[item.isActive] }}
                        </template> -->
                        <template v-slot:item.operation="{ item }">
                            <v-btn
                            tile
                            small
                            color='vote_button'
                            class="mr-4 withdraw"
                            :disabled="item.availableTimePercent<1"
                            v-if='connection.address'
                            @click="handleWithdraw(item)"
                            height="32"
                            >
                                Withdraw
                            </v-btn>
                            <v-btn
                            small
                            color="start_unstake"
                            class="mr-4 unstake_btn"
                            v-if='connection.address'
                            @click="deposit(item)"
                            height="32"
                            >
                                Stake more
                            </v-btn>
                            <v-btn
                            v-if="item.address==connection.address"
                            small
                            color="success"
                            class="mr-4 withdraw"
                            @click="handleReward(item)"
                            height="32"
                            >
                                {{$t('stake.get_reward')}}
                            </v-btn>
                            <span v-if='!connection.address'>
                                -
                            </span>
                        </template>
                    </v-data-table>
                    <div class="text-pagination pt-2">
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
                        :headers="headersOther"
                        :items="nodeListOther"
                        class="background"
                        hide-default-footer
                        :items-per-page="itemsPerPage"
                        :loading="stakeListLoading"
                        :loading-text="$t('msg.loading')"
                        :page.sync="page"
                        @page-count="pageCount = $event"
                    >
                        <template v-slot:item.by="{ item }">
                        <!-- <Address :val="item.address"></Address> -->
                            {{ item.by | addr }}
                        </template>
                        <template v-slot:item.to="{ item }">
                        <!-- <Address :val="item.address"></Address> -->
                            {{ item.to | addr }}
                        </template>
                        <template v-slot:item.amount="{ item }">
                            {{ formatAsset(item.amount) | asset(2) }}
                        </template>
                        <template v-slot:item.deposit="{ item }">
                            {{ item.timestamp*1000 | dateFormat('YYYY-MM-dd hh:mm:ss') }}
                        </template>
                    </v-data-table>
                    <div class="text-pagination pt-2">
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

    <v-dialog v-model="depositDialog" width="500">
      <v-card :class="dark?'dialog-night':'dialog-daytime'" style="padding-bottom:4px">
            <div class="dialog-validator"> 
                <v-card-title class="dialog-title">{{$t('stakeforgas.stake_info')}}</v-card-title>
                <div @click="cancelStaking" class="close-btn"><v-icon>mdi-close</v-icon></div>   
            </div> 
        <v-list rounded class="ma-2 start_unstake">
          <v-form 
            ref="stakeform"
            lazy-validation
            class="start_unstake"
          >
          <v-row class="from-voting" justify="start" >
            <div class="input-title">Address</div>
            <v-col cols="12" md="10">
                        <v-text-field
                            v-model="form.address"
                            :label="$t('stake.address')"
                            outlined
                            background-color="input_other"
                            class="text-filed"
                            color="chips"
                        >
                    </v-text-field>
              </v-col>
          </v-row>
            <div class="pb-1 text-body-1" style="text-align:right">
                <span class="font-color"> {{$t('stake.wallet_balance')}}: </span>
                <span style="font-weight:bold;">{{ connection.balance | asset(8) }}</span>
                <span class="font-color">{{symbol}}</span>
            </div>
            <v-row class="from-voting">
              <!-- <div class="from-voting"> -->
                  <div class="input-title">Amount</div>
                  <v-col cols="12" md="10">
                        <v-text-field
                        v-model="form.amount"
                        :label="$t('stake.amount')"
                        required
                        :rules="amountRules"
                        outlined
                        background-color="input_other"
                        class="text-filed"
                        height="24"
                    ><template v-slot:append>
                        <v-btn
                        text
                        x-small
                        @click="setAll('form')">
                        {{ $t('stake.max') }}
                        </v-btn>
                    </template>
            </v-text-field>
            </v-col>
              <!-- </div> -->
          </v-row>
            <div class="text-center">
                <v-btn 
                color="btn_button"
                @click="cancelStaking"
                class="mr-4"
                outlined>
                {{$t('stake.btn_cancel')}}
                </v-btn>
                <v-btn
                color="vote_button"
                :loading="stakeLoading"
                @click="submitStaking"
                class="font-btn"
                >
                {{$t('stake.btn_submit')}}
                </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="withdrawDialog" width="500">
      <v-card :class="dark?'dialog-night':'dialog-daytime'">
          <v-card-title>{{$t('stakeforgas.withdraw_info')}}</v-card-title>
          <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-4 start_unstake">
          <v-form 
            ref="withdrawform"
            lazy-validation
            class="start_unstake"
          >
            <div class="pb-1 text-body-1" style="text-align:right">
                <span class="font-color">{{$t('stakeforgas.estimate_withdraw')}}: </span>
                <span style="font-weight:bold">{{ estimateWithdrawableAmount | asset(8) }} </span>
               <span class="font-color"> REI</span>
            </div>
            <v-row class="from-voting" >
                <div class="input-title">Amount</div>
                <v-col cols="12" md="10">  
                    <v-text-field
                        v-model="withdrawForm.amount"
                        :label="$t('stake.amount')"
                        required
                        :rules="amountRules"
                        outlined
                        background-color="input_other"
                        class="text-filed"
                        height="24"
                    ><template v-slot:append>
                        <v-btn
                         text
                        x-small
                        @click="setWithdrawAll()">
                        {{ $t('stake.max') }}
                        </v-btn>  
                    </template>
                 </v-text-field>
                </v-col>
            </v-row>
            
            <div class="text-center">
                <v-btn 
                class="mr-4"
                color="btn_button"
                @click="cancelWithdraw"
                outlined
                >
                {{$t('stake.btn_cancel')}}
                </v-btn>
                <v-btn
                color="vote_button"
                :loading="withdrawLoading"
                @click="submitWithdraw"
                class="font-btn"
                >
                {{$t('stake.btn_submit')}}
                </v-btn>
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
import { mapActions, mapGetters } from 'vuex';
import abiConfig from '../abis/abiConfig';
import abiFreeFee from '../abis/abiFreeFee'
import abiFee from '../abis/abiFee'
import abiCommissionShare from '../abis/abiCommissionShare'
import abiValidatorRewardPool from '../abis/abiValidatorRewardPool'
import filters from '../filters';
import find from 'lodash/find';
import util from '../utils/util'
import { postRpcRequest } from '../service/CommonService'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core'

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT
let client = null;

export default {
  filters,
  data() {
    return {
        symbol:'REI',
        isNode: false,
        totalAmount:0,
        tab1: '1',
        depositDialog: false,
        withdrawDialog: false,
        stakeLoading: false,
        withdrawLoading: false,
        page: 1,
        pageCount: 0,
        itemsPerPage: 10,
        stakeListLoading: false,
        headers: [
            {
                text:'Address',
                align: 'start',
                sortable: false,
                value: 'address',
            },
            { text: 'Amount', value: 'amount' },
            { text: 'Deposit Time', value: 'deposit' },
            { text: 'Withdraw Countdown', value: 'withdraw' },
            // { text: this.$t('stake.status'), value: 'isActive' },
            { text: 'Operation', value: 'operation', sortable: false },
            // { text: '10', value: 'ten'}
        ],
        headersOther: [
            {
                text:'From',
                align: 'start',
                sortable: false,
                value: 'by',
            },
            {
                text:'To',
                align: 'start',
                sortable: false,
                value: 'to',
            },
            { text: 'Amount', value: 'amount' },
            { text: 'Deposit Time', value: 'deposit' }
        ],
        nodeList: [
        ],
        nodeListOther: [],

        form:{
            address: '',
            amount: 0
        },
        withdrawForm:{
            amount: 0
        },
        freeFeeContract: null,
        feeContract: null,
        estimateFee:0,
        estimateFreeFee: 0,
        userFreeFeeLimit: 0,
        estimateWithdrawableAmount: 0,
        userUsage: '',
        usagePercent: 0,
        userDeposit:{},
        estimateUsage:0,
        estimateUsagePercent:0,

        currentItem: '',
        currentAddress: {},
        leftCrude:0,
        usedCrude:0,
        
        approved: true,
        rateRules: [(v) => !!v || this.$t('msg.please_input_number'), (v) => (v && util.isNumber(v) && v >= 1 && v <= 100) || this.$t('msg.please_input_1_100_num')],
        amountRules: [(v) => !!v || this.$t('msg.please_input_amount'), (v) => (v && util.isNumber(v)) || this.$t('msg.please_input_correct_num'), (v) => (v && v>0) || this.$t('msg.please_input_not_zero')],
        addressRules: [(v) => !!v || this.$t('msg.please_input_address')]
    };
  },
  watch: {
    '$store.state.finishedTxs': function() {
      this.init()
    },
    '$store.state.connection': function() {
      this.init()
    },
  },
  mounted() {
      this.connect()
      this.init()
  },
  methods: {
    ...mapActions({
      addTx: 'addTx',
      setGasStakeTotalAmount: 'setGasStakeTotalAmount',
      setLeftCrude: 'setLeftCrude',
      setUsedCrude: 'setUsedCrude',
      setLeftCrudePercent: 'setLeftCrudePercent',
      setUsedCrudePercent: 'setUsedCrudePercent'
    }),
    connect() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
    },
    async init() {
        this.stakeListLoading = true;
        let contract = new web3.eth.Contract(abiConfig,config_contract);
        
        //let freeFeeContractAddress = await contract.methods.freeFee().call();
        let feeContractAddress = await contract.methods.fee().call();
        this.feeContract = new web3.eth.Contract(abiFee,feeContractAddress);

        this.getTotalStake();
        this.getLeftCrude();
        //this.getUsedCrude();
        this.getDepositList();
        this.getMystakeByOther();
        this.stakeListLoading = false;
    },
    async getDepositList() {
        let url = this.apiUrl.graph;
        client = new ApolloClient({
            uri: `${url}chainmonitor`,
            cache: new InMemoryCache(),
        })
        const deposit = gql`
         query depositInfos {
            deposits(where: { by: "${this.connection.address}" }) {
                id
                by
                to
                timestamp
                amount
            }
        }
        `
        const {data:{deposits}} = await client.query({
            query: deposit,
            variables: {
            },
            fetchPolicy: 'cache-first',
        })
        this.depositList = deposits;
        let depositsList = deposits.map(async (item) => {
            let feeUserDeposit = await this.feeContract.methods.userDeposit(item.by,item.to).call()
            let nowTime = Date.now();
            let availableTime = feeUserDeposit.timestamp*1000+3*24*3600*1000
            let passTime = this.timeDiff(availableTime,nowTime);

            let passedTime = nowTime - feeUserDeposit.timestamp*1000
            let passTimepercent = passedTime/(3*24*3600*1000);
            let availableTimePercent = passTimepercent>1 ? 1 : passTimepercent
            return {
                by:item.by,
                address:item.to,
                amount: web3.utils.fromWei(web3.utils.toBN(feeUserDeposit.amount)),
                timestamp: feeUserDeposit.timestamp,
                availableTime: passTime,
                availableTimePercent: availableTimePercent
            }
        })
        let res = await Promise.all(depositsList);
        this.nodeList = res;
    },
    async getMystakeByOther(){
        let url = this.apiUrl.graph;
        client = new ApolloClient({
            uri: `${url}chainmonitor`,
            cache: new InMemoryCache(),
        })
        const depositByOther = gql`
         query depositInfos {
            deposits(where: { to: "${this.connection.address}",by_not: "${this.connection.address}" }) {
                id
                by
                to
                timestamp
                amount
            }
        }
        `
        const {data:{deposits:depositsByOtherData}} = await client.query({
            query: depositByOther,
            variables: {
            },
            fetchPolicy: 'cache-first',
        })

        this.nodeListOther = depositsByOtherData;
    },
    async getTotalStake(){
         let apiUrl = this.apiUrl.rpc;
         let arr = [];
         arr.push(this.connection.address);
         arr.push('latest')
         let param = {
             method:'rei_getTotalAmount',
             params:arr
         }
        let res = await postRpcRequest(apiUrl,param);
        this.totalAmount = web3.utils.fromWei(web3.utils.toBN(res.data.result));
        this.setGasStakeTotalAmount({
            gasStakeTotalAmount: this.totalAmount
        })
    },
    async getLeftCrude(){
         let apiUrl = this.apiUrl.rpc;
         let arr = [];
         arr.push(this.connection.address);
         arr.push('latest')
         let param = {
             method:'rei_getCrude',
             params:arr
         }
        let res = await postRpcRequest(apiUrl,param);
        let leftCrude = !res.data.result ? 0 : web3.utils.fromWei(web3.utils.toBN(res.data.result));
        this.leftCrude = leftCrude;
        this.setLeftCrude({
            leftCrude: leftCrude
        })
    
         let arrused = [];
         arrused.push(this.connection.address);
         arrused.push('latest')
         let paramused = {
             method:'rei_getUsedCrude',
             params:arrused
         }
        let resused = await postRpcRequest(apiUrl,paramused);
        let usedCrude = !resused.data.result? 0 : web3.utils.fromWei(web3.utils.toBN(resused.data.result));
        this.usedCrude = usedCrude;
        this.setUsedCrude({
            usedCrude: usedCrude
        })
        let totalCrude = leftCrude*1+usedCrude*1;
        let leftPercent =  !totalCrude ? 0 : util.numberPrecision(leftCrude/(leftCrude*1+usedCrude*1)*100,2)
        let usedPercennt = !totalCrude ? 0 : util.numberPrecision(usedCrude/(leftCrude*1+usedCrude*1)*100,2)
        this.setLeftCrudePercent({
            leftCrudePercent: leftPercent
        })
        this.setUsedCrudePercent({
            usedCrudePercent: usedPercennt
        })
    },
    async handleWithdraw(item){
        this.currentItem = item;
        this.estimateWithdrawableAmount = item.amount;
        this.withdrawDialog = true;
    },
    async submitWithdraw(){
        try{
            if(!this.$refs.withdrawform.validate()) return;
            this.withdrawLoading = true;
            const withdrawRes = await this.feeContract.methods.withdraw(this.currentItem.address,web3.utils.toWei(this.withdrawForm.amount)).send({
            from: this.connection.address
        })
            if(withdrawRes.transactionHash){
                this.addTx({
                  tx: {
                    txid: withdrawRes.transactionHash,
                    type: 'withdraw',
                    status: 'PENDING',
                    data: {
                      amount: this.withdrawForm.amount,
                      symbol: this.symbol,
                      to: util.addr(this.connection.address)
                    },
                    timestamp: new Date().getTime()
                  }
                });
                this.withdrawDialog = false;
            }
        } catch (e){
            console.log(e)
            this.$dialog.notify.warning(e.message);
        }
        this.withdrawLoading = false;
    },
    cancelWithdraw(){
        this.withdrawDialog = false;
    },
    deposit(item){
        this.currentItem = item;
        this.form.address = item.address;
        this.depositDialog = true;
    },
    async submitStaking(){
         try{
            if(!this.$refs.stakeform.validate()) return;
            this.stakeLoading = true;
            const stakeRes = await this.feeContract.methods.deposit(this.currentItem.address).send({
            from: this.connection.address,
            value: web3.utils.numberToHex(web3.utils.toWei(this.form.amount))
        })
            if(stakeRes.transactionHash){
                console.log(stakeRes)
                this.addTx({
                  tx: {
                    txid: stakeRes.transactionHash,
                    type: 'deposit',
                    status: 'PENDING',
                    data: {
                      amount: this.form.amount,
                      symbol: this.symbol,
                      to: util.addr(this.currentItem.address)
                    },
                    timestamp: new Date().getTime()
                  }
                });
                this.depositDialog = false;
            }
        } catch (e){
            this.depositDialog = false;
            console.log(e)
            this.$dialog.notify.warning(e.message);
        }
        this.stakeLoading = false;
    },
    setAll(obj) {
        this[obj].amount = this.connection.balance;
    },
    setWithdrawAll(){
        this.withdrawForm.amount = this.estimateWithdrawableAmount;
    },
    cancelStaking() {
        this.depositDialog = false;
    },
    addressToShort(str){
        return util.addr(str);
    },
    formatAsset(val) {
        return web3.utils.fromWei(web3.utils.toBN(val))
    },
    timeDiff (a, b) {
        if(a<b) return '0H:0M'
        let endDate = new Date(a);//结束时间
        let now = new Date(b);//开始时间
        let endTime = endDate.getTime();//结束时间
        let startTime = now.getTime();//开始时间
        let timeDiff = endTime - startTime;
        let days = parseInt(timeDiff/ (1000 * 60 * 60 * 24));
        let hours = parseInt((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = parseInt((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = ((timeDiff % (1000 * 60)) / 1000).toFixed();
        hours < 10 ? hours='0'+hours : hours; //小时格式化
        minutes < 10 ? minutes='0'+minutes : minutes; //分钟格式化
        seconds < 10 ? seconds='0'+seconds : seconds; //秒钟格式化
    
        let k = days+'D: '+hours+'H: '+minutes+'M';
        // return k;
        if("0" > seconds){
            return "--"
        }else{
            return k;
        }
    }
  },
  computed: {
    ...mapGetters({
      dark: 'dark',
      connection: 'connection',
      apiUrl:'apiUrl'
    })
  }
};
</script>
<style scoped lang="scss">
.gas-list{
    margin-top:16px;
    margin-bottom:28px;
}
.v-tab{
    text-transform: none !important;
    margin-left: 0 !important;
   }
.withdraw{
    border-radius:4px;
    color:#FFF
}
.dialog-night{
    background-color:#595777;
}
.dialog-daytime{
    background-color: #FFF;
}
.dialog-validator{
    display: flex;
    justify-content: space-between;
    .dialog-title{
        margin-left:12px;
    }
    .close-btn{
        margin-top: 20px;
        margin-right:20px;
        padding: 0;
        background-color: transparent;
        cursor: pointer;
    }
}
.v-application .text-center{
    text-align: right !important;
}
.from-voting{
    display: flex;
    justify-content: space-between;
    padding-bottom:0;
    padding-top:0;
    .input-title{
        margin-left: 22px;
        margin-top:22px;
        text-align: left;
        height:40px;
        color:#868E9E;
    }
 }
  .font-color{
        color:#868E9E;
    }
.v-sheet.v-card{
    padding-bottom: 8px;
}
.font-btn.v-btn.v-btn--has-bg{
    color: #FFF;
    background: #6979f8;
}
.unstake_btn.theme--dark.v-btn.v-btn--has-bg{
    background: #595777;
}
.theme--dark.v-application .text-pagination[data-v-b6724c44][data-v-b6724c44]{
    background-color:#1d1a36;
}
.theme--dark.v-application .text-center[data-v-b6724c44][data-v-b6724c44]{
    background-color:transparent;
}
    @media screen and (max-width: 900px) {
        .gas-list{
            margin-top:-4px;
            margin-bottom:8px;
        }
        .dialog-validator{
            .v-card__subtitle, .v-card__text, .v-card__title{
                padding:0;
            }
            .v-card__title{
                font-size: 1rem;
            }

        }
        .from-voting{
            display: flex;
            flex-direction: column;
            padding-top: 0;
            .input-title{
                margin-top: 0;
                height:24px;
            }
        }
        .from-amount{
            margin-top: -32px;
        }
        .select-card{
            height:40px;
        }
        .text-filed{
            width:300px !important;
        }
    }
</style>
