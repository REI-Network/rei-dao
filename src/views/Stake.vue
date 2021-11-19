<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-card class="flex-column mt-2">
            <v-card-actions>
                <v-card-title>{{$t('stake.node_list')}}
                    <v-tooltip bottom>
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
                        <span>节点获得投票超过{{minIndexVotingPower | asset(2)}}票，才会被列入未激活列表</span>
                    </v-tooltip>
                </v-card-title>
                <v-spacer></v-spacer>
                <v-btn
                    text
                    outlined
                    color="primary"
                    v-if="isNode"
                    @click="setRate"
                    >
                    {{$t('stake.set_commission_rate')}}
                </v-btn>
                <v-btn
                    text
                    outlined
                    color="primary"
                    v-if="connection.address"
                    @click="stakeToNode"
                >
                {{$t('stake.stake_to_other_node')}}
            </v-btn>
            </v-card-actions>   
            <v-tabs v-model="tab1" align-with-title>
                <v-tab key="1">{{$t('stake.active_nodelist')}}</v-tab>
                <v-tab key="2">{{$t('stake.not_active_nodelist')}}</v-tab> 
            </v-tabs>
          <v-divider />
          <v-tabs-items v-model="tab1">
                <v-tab-item key="1">
                  <v-simple-table>
                    <template v-slot:default>
                    <thead>
                        <tr>
                        <th class="text-left">
                            {{$t('stake.node')}}
                        </th>
                        <th class="text-left">
                        {{$t('stake.voting_power')}}
                        </th>
                        <th class="text-left">
                            {{$t('stake.share_balance')}}
                        </th>
                        <th class="text-left">
                            {{$t('stake.operation')}}
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="(item,index) in nodeList"
                        :key="index"
                        >
                        <td>{{ item.address | addr }}</td>
                        <td>{{ item.power | asset(2)  }}</td>
                        <td>{{ item.balannceOfShare | asset(2)  }}</td>
                        <td>
                            <v-btn
                            tile
                            small
                            color="success"
                            class="mr-4"
                            v-if='connection.address'
                            @click="handleStaking(item)"
                            >
                            {{$t('stake.staking')}}
                            </v-btn>
                            <v-btn
                            tile
                            small
                            color="success"
                            class="mr-4"
                            v-if='connection.address'
                            @click="handleClaim(item)"
                            >
                            {{$t('stake.claim')}}
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
                        </td>
                        </tr>
                    </tbody>
                    </template>
                  </v-simple-table>
                </v-tab-item>
                <v-tab-item key="2">
                  <v-simple-table>
                    <template v-slot:default>
                    <thead>
                        <tr>
                        <th class="text-left">
                            {{$t('stake.node')}}
                        </th>
                        <th class="text-left">
                        {{$t('stake.voting_power')}}
                        </th>
                        <th class="text-left">
                            {{$t('stake.share_balance')}}
                        </th>
                        <th class="text-left">
                            {{$t('stake.operation')}}
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="(item,index) in notActiveList"
                        :key="index"
                        >
                        <td>{{ item.address | addr }}</td>
                        <td>{{ item.power | asset(2)  }}</td>
                        <td>{{ item.balannceOfShare | asset(2)  }}</td>
                        <td>
                            <v-btn
                            tile
                            small
                            color="success"
                            class="mr-4"
                            @click="handleStaking(item)"
                            >
                            {{$t('stake.staking')}}
                            </v-btn>
                            <v-btn
                            tile
                            small
                            color="success"
                            class="mr-4"
                            @click="handleClaim(item)"
                            >
                            {{$t('stake.claim')}}
                            </v-btn>
                        </td>
                        </tr>
                    </tbody>
                    </template>
                  </v-simple-table>
                </v-tab-item>
          </v-tabs-items>
        
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500">
      <v-card>
          <v-card-title>{{$t('stake.staking_info')}}</v-card-title>
          <v-divider></v-divider>
        <v-list rounded class="ma-4">
          <v-form 
            ref="stakeform"
            lazy-validation
          >
            <div class="pb-1 text-body-1">{{$t('stake.wallet_balance')}}: {{ connection.balance | asset(2) }}</div>
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
    <v-dialog v-model="stakeToNodeDialog" width="500">
      <v-card>
          <v-card-title>{{$t('stake.staking_info')}}</v-card-title>
          <v-divider></v-divider>
        <v-list rounded class="ma-4">
          <v-form
            ref="stakeToNodeform"
            lazy-validation
          >
              <v-text-field
                v-model="stakeForm.address"
                :label="$t('stake.address')"
                required
                clearable
                :rules="addressRules"
            ></v-text-field>
            <v-text-field
                v-model="stakeForm.amount"
                :label="$t('stake.amount')"
                required
                :rules="amountRules"
            >
                <template v-slot:append>
                    <v-btn
                        text
                        x-small
                        @click="setAll('stakeForm')">
                        {{ $t('stake.max') }}
                    </v-btn>
                </template>
            </v-text-field>
            <div class="text-center">
                <v-btn
                class="mr-4"
                color="primary"
                :loading="stakeToNodeLoading"
                @click="submitStakingToNode"
                >
                {{$t('stake.btn_submit')}}
                </v-btn>
                <v-btn @click="cancelStakingToNode">
                {{$t('stake.btn_cancel')}}
                </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="claimDialog" width="500">
      <v-card>
          <v-card-title>{{$t('stake.claim_info')}}
          </v-card-title>
          <v-divider></v-divider>
        <v-list rounded class="ma-4">
          <v-form
            ref="claimform"
            lazy-validation
          >
              <div class="pb-1 text-body-1">{{$t('stake.commonnsion_share_balance')}}: {{currentItem.balannceOfShare | asset(2)}}</div>
            <v-text-field
                v-model="claimForm.amount"
                :label="$t('stake.amount')"
                v-on:keyup="calculateAmount"
                required
                :rules="amountRules"
            ><template v-slot:append>
                    <v-btn 
                    text
                    x-small
                    @click="claimAll()">
                    {{ $t('stake.max') }}
                    </v-btn>
                </template>
            </v-text-field>
            <div class="pb-3 text-caption">{{$t('stake.estimate_receive')}}: {{receiveBalance}} REI</div>
            <div class="pb-3 text-caption"><strong class="text--secondary">须知：发起赎回操作{{timeToFormat(unstakeDelay)}}，可以在赎回页面领取</strong></div>
            
            <div class="text-center">
                <v-btn
                class="mr-4"
                color="primary"
                v-if="!approved"
                :loading="approveLoading"
                @click="submitApprove"
                >
                {{$t('stake.approve')}}
                </v-btn>
                <v-btn
                class="mr-4"
                color="primary"
                :disabled="!approved"
                :loading="claimLoading"
                @click="submitClaim"
                >
                {{$t('stake.btn_submit')}}
                </v-btn>
                <v-btn @click="cancelClaim">
                {{$t('stake.btn_cancel')}}
                </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <!-- reward -->
    <v-dialog v-model="rewardDialog" width="500">
      <v-card>
          <v-card-title>{{$t('stake.reward_info')}}</v-card-title>
          <v-divider></v-divider>
        <v-list rounded class="ma-4">
          <v-form
            ref="claimRewardForm"
            lazy-validation
          >
              <div class="pb-1 text-body-1">{{$t('stake.reward_balance')}}: {{rewardBalance | asset(2)}}</div>
            <v-text-field
                v-model="rewardForm.amount"
                :label="$t('stake.amount')"
                outlined
                required
                :rules="amountRules"
            ><template v-slot:append>
                    <v-btn text @click="setAllReward()">
                    {{ $t('stake.max') }}
                    </v-btn>
                </template>
            </v-text-field>
            
            <div class="text-center">
                <v-btn
                class="mr-4"
                color="primary"
                :loading="rewardLoading"
                @click="submitClaimReward"
                >
                {{$t('stake.btn_submit')}}
                </v-btn>
                <v-btn @click="cancelReward">
                {{$t('stake.btn_cancel')}}
                </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="setCommissionRateDialog" width="500">
      <v-card>
          <v-card-title>{{$t('stake.set_commission_rate')}}</v-card-title>
          <v-divider></v-divider>
        <v-list rounded class="ma-4">
          <v-form
            ref="form"
            lazy-validation
          >
            <div class="pb-1 text-body-1">{{$t('stake.commission_rate')}}: {{currentAddress.commissionRate}}%</div>
             <div class="pb-1 text-body-1" v-if="currentAddress.updateTimestamp!=0">{{$t('stake.last_update_time')}}: {{currentAddress.updateTimestamp*1000 | dateFormat('YYYY-MM-dd hh:mm:ss')}}</div>
            <v-text-field
                v-model="rateForm.amount"
                :label="$t('stake.commission_rate')"
                solo
                :rules="rateRules"
                clearable
                suffix="%"
                persistent-hint
                required
            ></v-text-field>
            
            <div class="text-center">
                <v-btn
                class="mr-4"
                color="primary"
                :loading="setRateLoading"
                @click="submitSetRate"
                >
                {{$t('stake.btn_submit')}}
                </v-btn>
                <v-btn @click="cancelSetRate">
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
import abiStakeManager from '../abis/abiStakeManager'
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
        isNode: false,
        tab1: null,
        dialog: false,
        claimDialog: false,
        stakeToNodeDialog: false,
        rewardDialog: false,
        setCommissionRateDialog: false,
        form:{
            amount:0
        },
        claimForm:{
            amount:0
        },
        stakeForm: {
            address:'',
            amount: 0
        },
        rewardForm: {
            amount: 0
        },
        rateForm:{
            amount: 0
        },
        currentItem:'',
        currentAddress: {},
        stakeManagerContract:'',
        stakeManageInstance: '',
        validatorRewardPoolContract:'',
        stakeLoading: false,
        claimLoading: false,
        approveLoading: false,
        stakeToNodeLoading: false,
        rewardLoading: false,
        setRateLoading: false,
        rewardBalance: 0,
        nodeList: [],
        notActiveList: [],
        indexedNodeList: [],
        receiveBalance: 0,
        commissionShare:'',
        commissionRateInterval:0,
        minIndexVotingPower:0,
        unstakeDelay:0,
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
        
        this.stakeManagerContract = await contract.methods.stakeManager().call();
        this.commissionRateInterval = await contract.methods.setCommissionRateInterval().call();
        console.log(this.commissionRateInterval)
        this.unstakeDelay = await contract.methods.unstakeDelay().call();
        console.log('unstakeDelay',this.unstakeDelay)
        let minIndexVotingPower = await contract.methods.minIndexVotingPower().call();
        this.minIndexVotingPower = web3.utils.fromWei(web3.utils.toBN(minIndexVotingPower))
        console.log('minIndexVotingPower',this.minIndexVotingPower)
        let validatorRewardPool = await contract.methods.validatorRewardPool().call();
        
        this.validatorRewardPoolContract = new web3.eth.Contract(abiValidatorRewardPool,validatorRewardPool);

        let stake_contract = new web3.eth.Contract(abiStakeManager,this.stakeManagerContract);
        this.stakeManageInstance = stake_contract;
        const activeValidatorsLength = await this.stakeManageInstance.methods.activeValidatorsLength().call()
        const indexedValidatorsLength = await this.stakeManageInstance.methods.indexedValidatorsLength().call()


        let indexedValidatorsArr = Array.from(new Array(Number(indexedValidatorsLength)), (n,i) => i)

        let activeValidatorsArr = Array.from(new Array(Number(activeValidatorsLength)), (n,i) => i)

        let activeValidateList = await Promise.all(activeValidatorsArr.map(item => {
                return stake_contract.methods.activeValidators(item).call()
            }))

        let indexedNodeList = await Promise.all(indexedValidatorsArr.map(item => {
                return stake_contract.methods.indexedValidatorsByIndex(item).call()
            })).then(async (data) => {

            let validator_address = data;
            let validator_addressMap = indexedValidatorsArr.map(item => {
                return stake_contract.methods.getVotingPowerByIndex(item).call()
            })
            let validatorMap = validator_address.map(item => {
                return stake_contract.methods.validators(item).call()
            })
            let validatorPower = await Promise.all(validator_addressMap);
            let validators = await Promise.all(validatorMap);
            let balanceOfShareMap = validators.map(item => {
                return this.getBalanceOfShare(item);
            })
            let balanceOfShare = await Promise.all(balanceOfShareMap);
            let arr = []
            for(let i = 0;i < validator_address.length;i++){
                arr.push({
                    address: validator_address[i],
                    power: web3.utils.fromWei(web3.utils.toBN(validatorPower[i])),
                    balannceOfShare: web3.utils.fromWei(web3.utils.toBN(balanceOfShare[i].balance)),
                    commissionShare: balanceOfShare[i].commissionShare,
                    contractAddress: validators[i][1],
                    commissionRate: validators[i].commissionRate,
                    updateTimestamp: validators[i].updateTimestamp
                })
            }
            return arr;
        })
        let activeList = []
        let notActiveList = []
        for(let i = 0; i < indexedNodeList.length; i++) {
            let validate = find(activeValidateList, item => item[0]==indexedNodeList[i].address)
           if(validate){
                activeList.push(indexedNodeList[i])
           } else {
                notActiveList.push(indexedNodeList[i])
           }
        }

        let validate_node = this.connection.address != null? find(indexedNodeList, item => item.address==this.connection.address) : false;
        if(validate_node) {
            this.isNode = true;
        } else {
            this.isNode = false;
        }
        this.indexedNodeList = indexedNodeList;
        this.nodeList = activeList;
        this.notActiveList = notActiveList;
    },
    
    async getBalanceOfShare(activeValidatorsShare) {
        let commissionShare = new web3.eth.Contract(abiCommissionShare,activeValidatorsShare[1]);
        let balance = 0;
        if(this.connection.address){
            balance = await commissionShare.methods.balanceOf(this.connection.address).call();
        }
        return {
            balance,
            commissionShare
        };
    },
    handleStaking(item){
        this.currentItem = item;
        this.$refs.stakeform&&this.$refs.stakeform.reset();
        this.form.amount = 0;
        this.dialog = true;
        
    },
    async handleClaim(item) {
        this.currentItem = item;
        this.$refs.claimform&&this.$refs.claimform.reset();
        this.receiveBalance = 0;
        this.claimForm.amount = 0;
        const allowance = await this.currentItem.commissionShare.methods.allowance(this.connection.address, this.stakeManagerContract).call();
        if(allowance != 0){
            this.approved = true;
        } else {
            this.approved = false;
        }
        this.claimDialog = true;
        
    },
    setAll(obj){
        this[obj].amount = this.connection.balance;
    },
    claimAll() {
        this.claimForm.amount = this.currentItem.balannceOfShare;
        this.calculateAmount()
    },
    setAllReward() {
        this.rewardForm.amount = this.rewardBalance;
    },
    async submitStaking() {
        try{
            if(!this.$refs.stakeform.validate()) return;
            this.stakeLoading = true;
            const stakeRes = await this.stakeManageInstance.methods.stake(this.currentItem.address,this.connection.address).send({ 
                from: this.connection.address,
                value: web3.utils.numberToHex(web3.utils.toWei(this.form.amount))
            })
            if(stakeRes.transactionHash){
                console.log(stakeRes)
                this.addTx({
                  tx: {
                    txid: stakeRes.transactionHash,
                    type: 'stake',
                    status: 'PENDING',
                    data: {
                      amount: this.form.amount,
                      symbol: 'GXC',
                      to: util.addr(this.currentItem.address)
                    },
                    timestamp: new Date().getTime()
                  }
                });
                this.dialog = false;
            }
        } catch (e){
            this.dialog = false;
            console.log(e)
            this.$dialog.notify.warning(e.message);
        }
        this.stakeLoading = false;
    },
    cancelStaking() {
        this.$refs.stakeform&&this.$refs.stakeform.reset();
        this.dialog = false;
    },
    cancelClaim(){
        this.$refs.claimform&&this.$refs.claimform.reset();
        this.claimDialog = false;
    },
    async submitApprove() {
        this.approveLoading = true;
        await this.currentItem.commissionShare.methods.approve(this.stakeManagerContract, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').send({ from: this.connection.address});
        this.approveLoading = false;
        this.approved = true;
    },
    async submitClaim() {
        this.startUnstake();
    },
    async startUnstake() {
        try {
            if(!this.$refs.claimform.validate()) return;
            this.claimLoading = true;
            const claimRes = await this.stakeManageInstance.methods.startUnstake(this.currentItem.address, this.connection.address, web3.utils.toWei(this.claimForm.amount)).send({ 
                from: this.connection.address
            })
            console.log(claimRes)
            if(claimRes.transactionHash){
                this.addTx({
                  tx: {
                    txid: claimRes.transactionHash,
                    type: 'startunstake',
                    status: 'PENDING',
                    data: {
                      amount: this.claimForm.amount,
                      symbol: 'GXC',
                      to: util.addr(this.connection.address)
                    },
                    timestamp: new Date().getTime()
                  }
                });
                this.claimDialog = false;
            }
        } catch (e){
            this.claimDialog = false;
            console.log(e)
            this.$dialog.notify.warning(e.message);
        }
        this.claimLoading = false;
    },
    async calculateAmount() {
        if(util.isNumber(this.claimForm.amount)&&this.claimForm.amount>0) {
            const amount = await this.stakeManageInstance.methods.estimateSharesToAmount(this.currentItem.address, web3.utils.toWei(this.claimForm.amount)).call()
            this.receiveBalance = web3.utils.fromWei(web3.utils.toBN(amount))
            console.log(amount)
        }
    },
    stakeToNode() {
        this.stakeToNodeDialog = true;
    },
    async submitStakingToNode() {
        try{
            if(!this.$refs.stakeToNodeform.validate()) return;
            this.stakeToNodeLoading = true;
            const stakeRes = await this.stakeManageInstance.methods.stake(this.stakeForm.address,this.connection.address).send({ 
                from: this.connection.address,
                value: web3.utils.numberToHex(web3.utils.toWei(this.stakeForm.amount))
            })
            if(stakeRes.transactionHash){
                console.log(stakeRes)
                this.addTx({
                  tx: {
                    txid: stakeRes.transactionHash,
                    type: 'stake',
                    status: 'PENDING',
                    data: {
                      amount: this.stakeForm.amount,
                      symbol: 'GXC',
                      to: util.addr(this.stakeForm.address)
                    },
                    timestamp: new Date().getTime()
                  }
                });
                this.stakeToNodeDialog = false;
            }
        } catch (e){
            this.stakeToNodeDialog = false;
            console.log(e)
            this.$dialog.notify.warning(e.message);
        }
        this.stakeToNodeLoading = false;
    },
    cancelStakingToNode() {
        this.stakeToNodeDialog = false;
    },
    async handleReward(item) {
        this.currentItem = item;
        let rewardBalance = await this.validatorRewardPoolContract.methods.balanceOf(this.connection.address).call();
        this.rewardBalance = web3.utils.fromWei(web3.utils.toBN(rewardBalance))
        this.rewardDialog = true;
    },
    cancelReward(){
        this.rewardDialog = false;
    },
    async submitClaimReward(){
        try {
            if(!this.$refs.claimRewardForm.validate()) return;
            this.rewardLoading = true;
            const rewardRes = await this.stakeManageInstance.methods.startClaim(this.connection.address, web3.utils.toWei(this.rewardForm.amount)).send({ 
                from: this.connection.address
            })
            console.log('rewardRes',rewardRes)
            if(rewardRes.transactionHash){
                this.addTx({
                  tx: {
                    txid: rewardRes.transactionHash,
                    type: 'startclaim',
                    status: 'PENDING',
                    data: {
                      amount: this.rewardForm.amount,
                      symbol: 'GXC',
                      to: util.addr(this.connection.address)
                    },
                    timestamp: new Date().getTime()
                  }
                });
                this.rewardDialog = false;
            }
        } catch (e){
            this.rewardDialog = false;
            console.log(e)
            this.$dialog.notify.warning(e.message);
        }
        this.rewardLoading = false;
    },
    setRate(){
        for(let i = 0; i< this.indexedNodeList.length; i++) {
            if(this.indexedNodeList[i].address == this.connection.address){
                this.currentAddress = this.indexedNodeList[i];
                break;
            }
        }
        this.rateForm.amount = this.currentAddress.commissionRate
        this.setCommissionRateDialog = true;
    },
    async submitSetRate() {
        try {
            if(!this.$refs.form.validate()) return;
            this.setRateLoading = true;
            const setRateRes = await this.stakeManageInstance.methods.setCommissionRate(Number(this.rateForm.amount)).send({ 
                from: this.connection.address
            })
            console.log('setRateRes',setRateRes)
            if(setRateRes.transactionHash){
                this.addTx({
                  tx: {
                    txid: setRateRes.transactionHash,
                    type: 'setrate',
                    status: 'PENDING',
                    data: {
                      amount: this.rateForm.amount,
                    },
                    timestamp: new Date().getTime()
                  }
                });
                this.setCommissionRateDialog = false;
            }
        } catch (e){
            this.setCommissionRateDialog = false;
            console.log(e)
            this.$dialog.notify.warning(e.message);
        }
        this.setRateLoading = false;
    },
    cancelSetRate() {
        this.setCommissionRateDialog = false;
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
