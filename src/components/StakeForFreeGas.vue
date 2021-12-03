<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-card-actions>
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
        <v-divider />
        <v-card
            elevation="2"
        >
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
        </v-card>
        
      </v-col>
    </v-row>

    <v-dialog v-model="depositDialog" width="500">
      <v-card>
          <v-card-title>{{$t('stakeforgas.stake_info')}}</v-card-title>
          <v-divider></v-divider>
        <v-list rounded class="ma-4">
          <v-form 
            ref="stakeform"
            lazy-validation
          >
            <v-text-field
                v-model="form.address"
                readonly
                :label="$t('stake.address')"
            >
            </v-text-field>
            <div class="pb-1 text-body-1">{{$t('stake.wallet_balance')}}: {{ connection.balance | asset(8) }} {{symbol}}</div>
            <v-text-field
                v-model="form.amount"
                :label="$t('stake.amount')"
                required
                :rules="amountRules"
            ><template v-slot:append>
                <v-btn
                  text
                  x-small
                  @click="setAll('form')">
                  {{ $t('stake.max') }}
                </v-btn>
                    
                </template>
            </v-text-field>
            <div class="text-center">
                <v-btn
                class="mr-4"
                color="primary"
                :loading="stakeLoading"
                @click="submitStaking"
                >
                {{$t('stake.btn_submit')}}
                </v-btn>
                <v-btn @click="cancelStaking">
                {{$t('stake.btn_cancel')}}
                </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="withdrawDialog" width="500">
      <v-card>
          <v-card-title>{{$t('stakeforgas.withdraw_info')}}</v-card-title>
          <v-divider></v-divider>
        <v-list rounded class="ma-4">
          <v-form 
            ref="withdrawform"
            lazy-validation
          >
            <div class="pb-1 text-body-1">{{$t('stakeforgas.estimate_withdraw')}}: {{ estimateWithdrawableAmount | asset(8) }} REI</div>
            <v-text-field
                v-model="withdrawForm.amount"
                :label="$t('stake.amount')"
                required
                :rules="amountRules"
            ><template v-slot:append>
                <v-btn
                  text
                  x-small
                  @click="setWithdrawAll()">
                  {{ $t('stake.max') }}
                </v-btn>
                    
                </template>
            </v-text-field>
            <div class="text-center">
                <v-btn
                class="mr-4"
                color="primary"
                :loading="withdrawLoading"
                @click="submitWithdraw"
                >
                {{$t('stake.btn_submit')}}
                </v-btn>
                <v-btn @click="cancelWithdraw">
                {{$t('stake.btn_cancel')}}
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
