<template>
  <v-container>
    <v-row class="background">
      <v-col >
        <!-- <v-card-actions>
            <v-card-title>{{$t('stakeforgas.list_title')}}
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn
                text
                outlined
                color="primary"
                @click="deposit"
                >
                {{$t('stakeforgas.title')}}
            </v-btn>
        </v-card-actions>   
        <v-divider /> -->
        <!-- <v-card  
            class="background"
        > -->
        <v-data-table
            :headers="headers"
            :items="nodeList"
            class="background"
            hide-default-footer
            :items-per-page="itemsPerPage"
            :loading="stakeListLoading"
            :loading-text="$t('msg.loading')"
            :page.sync="page"
            @page-count="pageCount = $event"
        >
            <template v-slot:item.address="{ item }">
            <!-- <Address :val="item.address"></Address> -->
                {{ item.address | asset(2)  }}
            </template>
            <template v-slot:item.amount="{ item }">
                {{ item.amount | asset(2)  }}
            </template>
            <template v-slot:item.deposit="{ item }">
                {{ item.deposit }}
            </template>
            <template v-slot:item.withdraw="{ item }">
                {{ item.withdraw | asset(2)  }}
            </template>
            <!-- <template v-slot:item.isActive="{ item }">
                {{ status[item.isActive] }}
            </template> -->
            <template v-slot:item.operation="{ item }">
                <v-btn
                tile
                small
                color='vote_button'
                class="mr-4"
                v-if='connection.address'
                @click="handleWithdraw()(item)"
                style="border-radius:4px"
                >
                    Withdraw
                </v-btn>
                <v-btn
                tile
                small
                color="start_unstake"
                class="mr-4"
                v-if='connection.address'
                @click="deposit(item)"
                style="border-radius:4px"
                >
                    Stake more
                </v-btn>
                <v-btn
                v-if="item.address==connection.address"
                tile
                small
                color="success"
                class="mr-4"
                @click="handleReward(item)"
                >
                    {{$t('stake.get_reward')}}
                </v-btn>
                <span v-if='!connection.address'>
                    -
                </span>
            </template>
        </v-data-table>
        <div class="text-center pt-2">
            <v-pagination
                v-model="page"
                :length="pageCount"
                color="vote_button"
                background-color="start_unstake"
                class="v-pagination"
                total-visible="6"
            ></v-pagination>
        </div>
        <v-card-actions>
            <v-list-item-content>
                <v-card-title>{{$t('stakeforgas.address_resource',{address: addressToShort(connection.address)})}}
                </v-card-title>
            </v-list-item-content>
        </v-card-actions>  
    
            <v-row no-gutters>
                <v-col
                    cols="12"
                    sm="6"
                >
                <v-list class="transparent">
                    <v-list-item>
                        <v-list-item-title>{{$t('stakeforgas.daily_free_fee')}}：</v-list-item-title>
                        <v-list-item-subtitle class="text-right">
                        {{ userFreeFeeLimit }} {{symbol}}
                        </v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item>
                        <v-list-item-title>{{$t('stakeforgas.left_crude')}}：<v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            color="primary"
                            dark
                            v-bind="attrs"
                            v-on="on"
                            >
                            mdi-help-circle-outline
                            </v-icon>
                        </template>
                        <span>1CRUDE ≈ 1e9 Gwei</span>
                    </v-tooltip></v-list-item-title>
                        <v-list-item-subtitle class="text-right">
                        {{ estimateFee | asset(6)}} 
                        </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>{{$t('stakeforgas.usage_crude')}}：</v-list-item-title>
                        <v-list-item-subtitle class="text-right">
                        {{ estimateUsage | asset(6)}} 
                        </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>{{$t('stakeforgas.stake_coin')}}：</v-list-item-title>
                        <v-list-item-subtitle class="text-right">
                        {{userDeposit.amount | asset(6) }} {{symbol}}
                        </v-list-item-subtitle>
                    </v-list-item>
                    
                </v-list>
                    
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                >
                    <v-list-item>
                        <v-list-item-title>
                            <v-progress-linear
                                :value="usagePercent"
                                height="20"
                                readonly
                                rounded
                            >
                                <div class="white--text">{{$t('stakeforgas.left_free_fee')}}{{ usagePercent }}%</div>
                            </v-progress-linear>
                        </v-list-item-title>
                        
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>
                            <v-progress-linear
                                :value="estimateUsagePercent"
                                height="20"
                                readonly
                                rounded
                            >
                                <div class="white--text">{{$t('stakeforgas.left_crude')}}{{ estimateUsagePercent }}%</div>
                            </v-progress-linear>
                        </v-list-item-title>
                        
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>
                            <v-progress-linear
                                :value="userDeposit.availableTime"
                                height="20"
                                readonly
                                rounded
                            >
                                <div class="white--text">{{$t('stakeforgas.vesting_status')}} {{ userDeposit.availableTime }}%</div>
                            </v-progress-linear>
                        </v-list-item-title>
                        
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>
                            <v-btn
                                tile
                                small
                                color="success"
                                class="mr-4"
                                :disabled="userDeposit.availableTime!=100"
                                @click="handleWithdraw()"
                                >
                                {{$t('stakeforgas.withdraw')}}
                            </v-btn>
                            <v-btn
                                tile
                                small
                                color="success"
                                class="mr-4"
                                @click="deposit()"
                                >
                                {{$t('stakeforgas.stake_more')}}
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item>
                </v-col>
            </v-row>
        <!-- </v-card> -->
        
      </v-col>
    </v-row>

    <v-dialog v-model="depositDialog" width="500">
      <v-card class="start_unstake" style="padding-bottom:4px">
          <div class="dialog-validator"> 
                <v-card-title class="dialog-title">{{$t('stakeforgas.stake_info')}}</v-card-title>
                <v-btn @click="cancelStaking" depressed class="close-btn">
                    <v-icon style="margin-right:12px">mdi-close</v-icon> 
                </v-btn>   
            </div> 
          <!-- <v-card-title>{{$t('stakeforgas.stake_info')}}</v-card-title>
          <v-divider></v-divider> -->
        <v-list rounded class="ma-4 start_unstake">
          <v-form 
            ref="stakeform"
            lazy-validation
            class="start_unstake"
          >
          <v-row>
              <v-col class="from-voting">
                  <div class="input-title">Address</div>
                        <v-text-field
                            v-model="form.address"
                            readonly
                            :label="$t('stake.address')"
                            outlined
                            background-color="input_other"
                            class="text-filed"
                            color="chips"
                        >
                    </v-text-field>
              </v-col>
          </v-row>
            <div class="pb-1 text-body-1" style="text-align:right">{{$t('stake.wallet_balance')}}: {{ connection.balance | asset(8) }} {{symbol}}</div>
            <v-row>
              <v-col class="from-voting">
                  <div class="input-title">Amount</div>
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
          </v-row>
            <div class="text-center">
                <v-btn 
                color="btn_button"
                @click="cancelStaking"
                class="mr-4">
                {{$t('stake.btn_cancel')}}
                </v-btn>
                <v-btn
                color="vote_button"
                :loading="stakeLoading"
                @click="submitStaking"
                >
                {{$t('stake.btn_submit')}}
                </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="withdrawDialog" width="500">
      <v-card class="start_unstake dialog-card">
          <v-card-title>{{$t('stakeforgas.withdraw_info')}}</v-card-title>
          <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-4 start_unstake">
          <v-form 
            ref="withdrawform"
            lazy-validation
            class="start_unstake"
          >
            <div class="pb-1 text-body-1" style="text-align:right">{{$t('stakeforgas.estimate_withdraw')}}: {{ estimateWithdrawableAmount | asset(8) }} REI</div>
            <v-row>
                <v-col lass="from-voting">
                    <div class="input-title">Amount</div>
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
                @click="cancelWithdraw">
                {{$t('stake.btn_cancel')}}
                </v-btn>
                <v-btn
                color="vote_button"
                :loading="withdrawLoading"
                @click="submitWithdraw"
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

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT

export default {
  filters,
  data() {
    return {
        symbol:'REI',
        isNode: false,
        tab1: null,
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
        nodeList: [
            {
                address:'0x77...Fo21',
                amount:'2,323.00',
                deposit:'2021/12/20 14:12:11',
                withdraw:'2Days:12H:25M:25S'
            },
            {
                address:'0x77...Fo21',
                amount:'2,323.00',
                deposit:'2021/12/20 14:12:11',
                withdraw:'2Days:12H:25M:25S'
            },
            {
                address:'0x77...Fo21',
                amount:'2,323.00',
                deposit:'2021/12/20 14:12:11',
                withdraw:'2Days:12H:25M:25S'
            },
            {
                address:'0x77...Fo21',
                amount:'2,323.00',
                deposit:'2021/12/20 14:12:11',
                withdraw:'2Days:12H:25M:25S'
            },
            {
                address:'0x77...Fo21',
                amount:'2,323.00',
                deposit:'2021/12/20 14:12:11',
                withdraw:'2Days:12H:25M:25S'
            },
            {
                address:'0x77...Fo21',
                amount:'2,323.00',
                deposit:'2021/12/20 14:12:11',
                withdraw:'2Days:12H:25M:25S'
            },
            {
                address:'0x77...Fo21',
                amount:'2,323.00',
                deposit:'2021/12/20 14:12:11',
                withdraw:'2Days:12H:25M:25S'
            },
            {
                address:'0x77...Fo21',
                amount:'2,323.00',
                deposit:'2021/12/20 14:12:11',
                withdraw:'2Days:12H:25M:25S'
            },
            {
                address:'0x77...Fo21',
                amount:'2,323.00',
                deposit:'2021/12/20 14:12:11',
                withdraw:'2Days:12H:25M:25S'
            },
            {
                address:'0x77...Fo21',
                amount:'2,323.00',
                deposit:'2021/12/20 14:12:11',
                withdraw:'2Days:12H:25M:25S'
            },
            {
                address:'0x77...Fo21',
                amount:'2,323.00',
                deposit:'2021/12/20 14:12:11',
                withdraw:'2Days:12H:25M:25S'
            },
            {
                address:'0x77...Fo21',
                amount:'2,323.00',
                deposit:'2021/12/20 14:12:11',
                withdraw:'2Days:12H:25M:25S'
            },
        ],
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
        
        approved: true,
        rateRules: [(v) => !!v || this.$t('msg.please_input_number'), (v) => (v && util.isNumber(v) && v >= 1 && v <= 100) || this.$t('msg.please_input_1_100_num')],
        amountRules: [(v) => !!v || this.$t('msg.please_input_amount'), (v) => (v && util.isNumber(v)) || this.$t('msg.please_input_correct_num'), (v) => (v && v>0) || this.$t('msg.please_input_not_zero')],
        addressRules: [(v) => !!v || this.$t('msg.please_input_address')]
    };
  },
  watch: {
    '$store.state.finishedTxs': function() {
      this.init()
    }
  },
  mounted() {
      this.connect()
      this.init()
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
        
        let contract = new web3.eth.Contract(abiConfig,config_contract);
        
        let freeFeeContractAddress = await contract.methods.freeFee().call();
        let feeContractAddress = await contract.methods.fee().call();

        let userFreeFeeLimit = await contract.methods.userFreeFeeLimit().call();
        this.userFreeFeeLimit = web3.utils.fromWei(web3.utils.toBN(userFreeFeeLimit))

        console.log('userFreeFeeLimit',userFreeFeeLimit)

        this.freeFeeContract = new web3.eth.Contract(abiFreeFee,freeFeeContractAddress);
        this.feeContract = new web3.eth.Contract(abiFee,feeContractAddress);

        let userUsage = await this.freeFeeContract.methods.userUsage(this.connection.address).call()
        this.userUsage = userUsage.usage
        console.log('userUsage',userUsage)
        let totalUsage = await this.freeFeeContract.methods.totalUsage().call()
        console.log('totalUsage',totalUsage)

        let globalTimestamp = await this.freeFeeContract.methods.globalTimestamp().call()
        console.log('globalTimestamp',globalTimestamp)

        let estimateTotalLeft = await this.freeFeeContract.methods.estimateTotalLeft(Math.ceil(Date.now()/1000)).call()
        console.log('estimateTotalLeft',estimateTotalLeft)

        let estimateFreeFee = await this.freeFeeContract.methods.estimateFreeFee(this.connection.address, Math.ceil(Date.now()/1000)).call()
        this.estimateFreeFee = web3.utils.fromWei(web3.utils.toBN(estimateFreeFee))
        console.log('estimateFreeFee',this.estimateFreeFee)

        this.usagePercent = util.numberPrecision(estimateFreeFee/userFreeFeeLimit*100,2)




        let estimateFee = await this.feeContract.methods.estimateFee(this.connection.address, Math.ceil(Date.now()/1000)).call()
        console.log('estimateFee',estimateFee)
        this.estimateFee = web3.utils.fromWei(web3.utils.toBN(estimateFee))

        let feeUserUsage = await this.feeContract.methods.userUsage(this.connection.address).call()

        let estimateUsage = await this.feeContract.methods.estimateUsage(feeUserUsage,Math.ceil(Date.now()/1000)).call()

        console.log('estimateUsage',estimateUsage)
        this.estimateUsage = web3.utils.fromWei(web3.utils.toBN(estimateUsage))

        this.estimateUsagePercent = util.numberPrecision(estimateFee/(estimateFee*1+estimateUsage*1)*100,2)

        let feeUserDeposit = await this.feeContract.methods.userDeposit(this.connection.address,this.connection.address).call()
        console.log('feeUserDeposit',feeUserDeposit)

        let userTotalAmount = await this.feeContract.methods.userTotalAmount(this.connection.address).call()
        console.log('userTotalAmount',userTotalAmount)


        let nowTime = Date.now();
        let passTime = nowTime - feeUserDeposit.timestamp*1000
        console.log('passTime',passTime)
        let passTimepercent = passTime/(3*24*3600*1000);
        let availableTime = passTimepercent>1 ? 1 : passTimepercent
        this.userDeposit = {
            amount: web3.utils.fromWei(web3.utils.toBN(feeUserDeposit.amount)),
            timestamp: feeUserDeposit.timestamp,
            availableTime: util.numberPrecision(availableTime*100,2)
        }

       let estimateWithdrawableTimestamp =  await this.feeContract.methods.estimateWithdrawableTimestamp(this.connection.address,this.connection.address).call()
        console.log('estimateWithdrawableTimestamp',estimateWithdrawableTimestamp)

    },
    async handleWithdraw(){
        let estimateWithdrawableAmount =  await this.feeContract.methods.estimateWithdrawableAmount(this.connection.address,Math.ceil(Date.now()/1000)).call()
        console.log('estimateWithdrawableAmount',estimateWithdrawableAmount)
        this.estimateWithdrawableAmount = web3.utils.fromWei(web3.utils.toBN(estimateWithdrawableAmount))
        this.withdrawDialog = true;
    },
    async submitWithdraw(){
        try{
            if(!this.$refs.withdrawform.validate()) return;
            this.withdrawLoading = true;
            const withdrawRes = await this.feeContract.methods.withdraw(this.connection.address,web3.utils.toWei(this.withdrawForm.amount),web3.utils.toWei(this.withdrawForm.amount)).send({
            from: this.connection.address
        })
            if(withdrawRes.transactionHash){
                console.log(withdrawRes)
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
    deposit(){
        this.form.address = this.connection.address;
        this.depositDialog = true;
    },
    async submitStaking(){
         try{
            if(!this.$refs.stakeform.validate()) return;
            this.stakeLoading = true;
            const stakeRes = await this.feeContract.methods.deposit(this.connection.address).send({
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
                      to: util.addr(this.connection.address)
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
    timeToFormat(val) {
        let str = '';
        let resdays = Math.floor(val/60/60/24)
        if(resdays > 0){
            str = resdays + '天后';
        } else if(Math.floor(val/60/60) > 0){
            str = Math.floor(val/60/60)+'小时后'
        } else {
            str = val/60 + '分后';
        }
        return str;
    }
  },
  computed: {
    ...mapGetters({
      dark: 'dark',
      connection: 'connection'
    })
  }
};
</script>
<style scoped lang="scss">
.dialog-validator{
    display: flex;
    justify-content: space-between;
    .dialog-title{
        margin-left:12px;
    }
    .close-btn{
        margin-top: 12px;
        padding: 0;
        background-color: transparent;
    }
}
.from-voting{
        display: flex;
        justify-content: space-between;
        padding-bottom:0;
        .input-title{
            margin-top: 12px;
            width: 80px;
            text-align: center;
            height:40px;
        }
    }
.v-sheet.v-card{
    padding-bottom: 8px;
}
    @media screen and (max-width: 900px) {
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