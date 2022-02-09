<template>
  <v-container class="background">
    <v-row>
      <v-col cols="12" md="12" sm="12">   
            <!-- <v-card-actions>
                <v-card-title>{{$t('stake.node_list')}}
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
            </v-card-actions>    -->
            <v-tabs v-model="tab1" align-with-title class="vote-list" background-color="background">
                    <v-tab key="11" class="v-tab-left">{{$t('stake.active_nodelist')}}</v-tab>
                    <v-tab key="12">{{$t('unstake.title')}}</v-tab> 
            </v-tabs>
            <div class="btn-div">
                <v-btn
                    class="v-btn"
                    text
                    outlined
                    color="primary"
                    v-if="connection.address"
                    @click="stakeToNode"
                >
                {{$t('stake.stake_to_other_node')}}
                    <v-icon
                        color="primary"
                        >
                        mdi-plus-circle-outline
                    </v-icon>
                </v-btn>
            </div>
            
          <v-divider />
          <v-tabs-items v-model="tab1">
                <v-tab-item key="11" >
                    <v-row class="background">
                        <v-tabs v-model="tab2"    
                            hide-slider 
                            class="my-voted-validator" 
                            background-color="background"
                            height="36">
                            <v-card outlined class="card-tab">
                                <v-tab key="111" style="font-size:12px">{{$t('stake.active_nodelist')}}</v-tab>
                                <v-tab key="122" style="font-size:12px">{{$t('stake.not_active_nodelist')}}</v-tab>
                            </v-card> 
                        </v-tabs>
                        <v-col class="right-outline">
                        <v-card outlined  class="select-card">
                            <v-select
                                class="d-select"
                                :items="items"
                                label="Active Validator"
                                outlined
                                item-color="vote_button"
                                dense
                            ></v-select>
                        </v-card>
                        <v-card outlined class="select-card">
                            <v-select
                                class="d-select"
                                :items="itemsPages"
                                label="10"
                                outlined
                                item-color="vote_button"
                                dense
                            ></v-select>
                         </v-card>
                       </v-col>
                    </v-row>
                    <v-tabs-items v-model="tab2">
                    <v-tab-item key="111">
                    <v-data-table
                        :headers="headers"
                        :items="nodeList"
                        class="elevation-1"
                        hide-default-footer
                        :items-per-page="itemsPerPage"
                        :loading="stakeListLoading"
                        :loading-text="$t('msg.loading')"
                        :page.sync="page"
                        @page-count="pageCount = $event"
                    >
                        <template v-slot:item.address="{ item }">
                            <Address :val="item.address"></Address>
                            <span :class=" status[item.isActive]=='Active'?'active':'not-active'">{{ status[item.isActive] }}</span>
                        </template>
                        <template v-slot:item.power="{ item }">
                            {{ item.power | asset(2)  }}
                        </template>
                        <template v-slot:item.commissionRate="{ item }">
                            {{ item.commissionRate }}%
                        </template>
                        <template v-slot:item.balannceOfShare="{ item }">
                            {{ item.balannceOfShare | asset(2)  }}
                        </template>
                        <!-- <template v-slot:item.isActive="{ item }">
                            {{ status[item.isActive] }}
                        </template> -->
                        <template v-slot:item.actions="{ item }">
                            <v-btn
                            tile
                            small
                            color='vote_button'
                            class="mr-4"
                            v-if='connection.address'
                            @click="handleStaking(item)"
                            style="border-radius:4px"
                            >
                               {{$t('stake.staking')}}
                            </v-btn>
                            <v-btn
                            tile
                            small
                            color="start_unstake"
                            class="mr-4"
                            v-if='connection.address'
                            @click="handleClaim(item)"
                            style="border-radius:4px"
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
                        </template>
                    </v-data-table>
                </v-tab-item>
                        <v-tab-item key="122">
                            <v-data-table
                                :headers="myStakeHeaders"
                                :items="myStakeList"
                                :items-per-page="21"
                                class="elevation-1"
                                hide-default-footer
                                :loading="myStakeListLoading"
                                :loading-text="$t('msg.loading')"
                            >
                            <template v-slot:item.address="{ item }">
                                <Address :val="item.address"></Address>
                            </template>
                            <template v-slot:item.power="{ item }">
                                {{ item.power | asset(2)  }}
                            </template>
                            <template v-slot:item.balannceOfShare="{ item }">
                                {{ item.balannceOfShare | asset(2)  }}
                            </template>
                    
                            <template v-slot:item.actions="{ item }">
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
                                <span v-if='!connection.address'>
                                    -
                                </span>
                            </template>
                    </v-data-table> 
                </v-tab-item>
            </v-tabs-items>
                </v-tab-item>
                <v-tab-item key="12">
                    <UnstakeToValidator></UnstakeToValidator>
                </v-tab-item>
          </v-tabs-items>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500">
      <v-card class="start_unstake" style="padding:12px;">
          <div class="dialog-validator">
            <v-card-title class="dialog-title">{{$t('stake.staking_info')}}</v-card-title>
            <v-btn @click="cancelStaking" depressed class="close-btn">
                <v-icon style="margin-right:12px">mdi-close</v-icon> 
            </v-btn> 
          </div>   
          <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-4 start_unstake">
          <v-form 
            ref="stakeform"
            lazy-validation
          >
            <div class="pb-1 text-body-1">{{$t('stake.node')}}: <Address :val="currentItem.address"></Address></div>
            <div class="pb-1 text-body-1 text-bod">{{$t('stake.wallet_balance')}}: {{ connection.balance | asset(2) }} REI</div>
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
                    >
                        <template v-slot:append>
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
                <v-btn @click="cancelStaking"
                    class="mr-4"
                    outlined
                    color="btn_button">
                {{$t('stake.btn_cancel')}}
                </v-btn>
                <v-btn
                :loading="stakeLoading"
                @click="submitStaking"
                color="vote_button"
                >
                {{$t('stake.btn_submit')}}
                </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="stakeToNodeDialog" width="500">
      <v-card class="start_unstake" style="padding:12px">
            <div class="dialog-validator">
                <v-card-title class="dialog-title">Voting To Other Validator</v-card-title>
                <v-btn @click="cancelStakingToNode" depressed class="close-btn">
                    <v-icon style="margin-right:12px">mdi-close</v-icon> 
                </v-btn>                     
            </div>
            <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-4 start_unstake">
          <v-form
            ref="stakeToNodeform"
            lazy-validation
          >
            <v-row>
                <v-col class="from-voting">
                    <div class="input-title">Validator</div>
                        <v-text-field
                            v-model="stakeForm.address"
                            :label="$t('stake.address')"
                            required
                            clearable
                            :rules="addressRules"
                            outlined
                            background-color="input_other"
                            class="text-filed"
                            color="chips"
                        ></v-text-field>
                </v-col>
            </v-row>        
            <div class="text-bod">{{$t('stake.wallet_balance')}}: {{ connection.balance | asset(2) }} REI</div>
            <v-row justify="space-between" style="margin-top:12px">
                <v-col class="from-voting from-amount">
                    <div class="input-title">Amount</div>
                       <v-text-field
                            v-model="stakeForm.amount"
                            :label="$t('stake.amount')"
                            required
                            :rules="amountRules"
                            outlined
                            background-color="input_other"
                            class="text-filed"
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
                </v-col>
            </v-row> 
            <div class="text-center">
                <v-btn @click="cancelStakingToNode" 
                        outlined 
                        color="btn_button"
                        class="mr-4">
                {{$t('stake.btn_cancel')}}
                </v-btn>
                <v-btn
                    color="vote_button"
                    :loading="stakeToNodeLoading"
                    @click="submitStakingToNode"
                    >
                {{$t('stake.btn_submit')}}
                </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="claimDialog" width="500">
      <v-card class="start_unstake">
            <div class="dialog-validator"> 
                <v-card-title class="dialog-title">{{$t('stake.claim_info')}}</v-card-title>
                <v-btn @click="cancelClaim" depressed class="close-btn">
                    <v-icon style="margin-right:12px">mdi-close</v-icon> 
                </v-btn>   
            </div>          
          <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-4 start_unstake">
          <v-form
            ref="claimform"
            lazy-validation
          >
            <div class="pb-1 text-body-1">{{$t('stake.node')}}: <Address :val="currentItem.address"></Address></div>
            <div class="pb-1 text-body-1 share-rei">{{$t('stake.commonnsion_share_balance')}}{{currentItem.balannceOfShare | asset(2)}}REI</div>
            <v-row>
                <v-col class="from-voting">
                <div class="input-title">Amount</div>
                    <v-text-field
                        v-model="claimForm.amount"
                        :label="$t('stake.amount')"
                        v-on:keyup="calculateAmount"
                        required
                        :rules="amountRules"
                        outlined
                        background-color="input_other"
                        class="text-filed"
                        height="24"
                    >
                        <template v-slot:append>
                            <v-btn 
                                text
                                x-small
                                @click="claimAll()">
                                {{ $t('stake.max') }}
                            </v-btn>
                        </template>
                    </v-text-field>
                </v-col>  
            </v-row> 
            
            <!-- <div class="pb-3 text-caption">{{$t('stake.estimate_receive')}}: {{receiveBalance}} REI</div> -->
            <!-- <div class="pb-3 text-caption"><strong class="text--secondary">{{$t('stake.tips_claim_info',{unstakeDelay: timeToFormat(unstakeDelay)})}}</strong></div> -->
            
            <div class="text-center">
                <!-- <v-btn
                class="mr-4"
                color="vote_button"
                v-if="!approved"
                :loading="approveLoading"
                @click="submitApprove"
                >
                {{$t('stake.approve')}}
                </v-btn> -->
                <v-btn @click="cancelClaim" 
                        color="btn_button"
                        class="mr-4">
                {{$t('stake.btn_cancel')}}
                </v-btn>
                <v-btn
                    color="vote_button"
                    :disabled="!approved"
                    :loading="claimLoading"
                    @click="submitClaim"
                >
                {{$t('stake.btn_submit')}}
                </v-btn>
            </div>
             <div class="pb-3 text-caption"><strong class="text--secondary">{{$t('stake.tips_claim_info',{unstakeDelay: timeToFormat(unstakeDelay)})}}</strong></div>
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
              <div class="pb-1 text-body-1">{{$t('stake.reward_balance')}}: {{rewardBalance | asset(2)}} REI</div>
            <v-text-field
                v-model="rewardForm.amount"
                :label="$t('stake.amount')"
                required
                :rules="amountRules"
            ><template v-slot:append>
                    <v-btn text @click="setAllReward()">
                    {{ $t('stake.max') }}
                    </v-btn>
                </template>
            </v-text-field>
            <div class="pb-3 text-caption"><strong class="text--secondary">{{$t('stake.tips_claim_info',{unstakeDelay: timeToFormat(unstakeDelay)})}}</strong></div>
            
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
            <div class="pb-1 text-body-1">{{$t('stake.commission_rate')}}: {{currentAddress.commissionRate}}% </div>
             <div class="pb-1 text-body-1" v-if="currentAddress.updateTimestamp!=0">{{$t('stake.last_update_time')}}: {{currentAddress.updateTimestamp*1000 | dateFormat('YYYY-MM-dd hh:mm:ss')}}
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
                    <span>{{$t('stake.tips_commission_rate',{commissionRateInterval: dateFormat((currentAddress.updateTimestamp*1+commissionRateInterval*1)*1000)} )}}</span>
                </v-tooltip>
             </div>
            <v-text-field
                v-model="rateForm.amount"
                :label="$t('stake.commission_rate')"

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
    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
        color="vote_button"
        background-color="start_unstake"
        class="v-pagination"
        total-visible="6"
      ></v-pagination>
      <!-- <v-text-field
        :value="itemsPerPage"
        label="Items per page"
        type="number"
        min="-1"
        max="15"
        @input="itemsPerPage = parseInt($event, 10)"
      ></v-text-field> -->
    </div>
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
import { getMyStake } from '../service/CommonService'
import Address from '../components/Address';
import filters from '../filters';
import find from 'lodash/find';
import util from '../utils/util'
import UnstakeToValidator from './UnstakeToValidator';

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT

export default {
  components:{
      Address,
      UnstakeToValidator
  },
  filters,
  data() {
    return {
        page: 1,
        pageCount: 0,
        itemsPerPage: 10,
        isNode: false,
        tab1: null,
        tab2: null,
        stakeListLoading: false,
        myStakeListLoading: false,
        dialog: false,
        claimDialog: false,
        stakeToNodeDialog: false,
        rewardDialog: false,
        setCommissionRateDialog: false,
        myStakeList: [],
        items: ['All', 'Active Validator', 'Unactive Validator'],
        itemsPages:['10','20'],
        headers: [
            {
                text: this.$t('stake.node'),
                align: 'start',
                sortable: false,
                value: 'address',
            },
            { text: this.$t('stake.voting_power'), value: 'power' },
            { text: this.$t('stake.commission_rate'), value: 'commissionRate' },
            { text: this.$t('stake.share_balance'), value: 'balannceOfShare' },
            // { text: this.$t('stake.status'), value: 'isActive' },
            { text: this.$t('stake.operation'), value: 'actions', sortable: false }
        ],
        myStakeHeaders: [
            {
                text: this.$t('stake.node'),
                align: 'start',
                sortable: false,
                value: 'address',
            },
            { 
                text: this.$t('stake.voting_power'),value: 'power'
            },
            { text: this.$t('stake.share_balance'), value: 'balannceOfShare' },
            { text: this.$t('stake.operation'), value: 'actions', sortable: false }
        ],
        status:{
            'true': this.$t('stake.isActive'),
            'false': this.$t('stake.notActive')
        },
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
    },
  },
  mounted() {
      this.connect();
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
    getApiUrl(){
        return this.connection.network == 'REI Network' ? process.env.VUE_APP_SERVER_API : process.env.VUE_APP_TEST_SERVER_API;
    },
    async init() {
        
        this.stakeListLoading = true;
        let contract = new web3.eth.Contract(abiConfig,config_contract);
        
        this.stakeManagerContract = await contract.methods.stakeManager().call();
        this.commissionRateInterval = await contract.methods.setCommissionRateInterval().call();
        this.unstakeDelay = await contract.methods.unstakeDelay().call();
        let minIndexVotingPower = await contract.methods.minIndexVotingPower().call();
        this.minIndexVotingPower = web3.utils.fromWei(web3.utils.toBN(minIndexVotingPower))
        let validatorRewardPool = await contract.methods.validatorRewardPool().call();
        
        this.validatorRewardPoolContract = new web3.eth.Contract(abiValidatorRewardPool,validatorRewardPool);

        let stake_contract = new web3.eth.Contract(abiStakeManager,this.stakeManagerContract);
        this.stakeManageInstance = stake_contract;
        const activeValidatorsLength = await this.stakeManageInstance.methods.activeValidatorsLength().call()
        let indexedValidatorsLength = await this.stakeManageInstance.methods.indexedValidatorsLength().call()
        let indexedFlag = true;
        if(indexedValidatorsLength == 0){
            indexedFlag = false;
            indexedValidatorsLength = activeValidatorsLength;
        }
        let indexedValidatorsArr = Array.from(new Array(Number(indexedValidatorsLength)), (n,i) => i)

        let activeValidatorsArr = Array.from(new Array(Number(activeValidatorsLength)), (n,i) => i)

        let activeValidateList = await Promise.all(activeValidatorsArr.map(item => {
                return stake_contract.methods.activeValidators(item).call()
            }))
        let indexedNodeList = await Promise.all(indexedValidatorsArr.map(item => {
                if(indexedFlag) {
                    return stake_contract.methods.indexedValidatorsByIndex(item).call()
                } else {
                    return stake_contract.methods.activeValidators(item).call()
                }
            })).then(async (data) => {
            let validator_address = data;
            let validator_addressMap;
            if(indexedFlag){
                validator_addressMap = indexedValidatorsArr.map(item => {
                    return stake_contract.methods.getVotingPowerByIndex(item).call() 
                })
            } else {
                validator_addressMap = validator_address.map(item => {
                    return stake_contract.methods.getVotingPowerByAddress(item.validator).call() 
                })
            }
            
            let validatorMap = validator_address.map(item => {
                let _item = indexedFlag ? item : item.validator;
                return stake_contract.methods.validators(_item).call()
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
                    address: indexedFlag?validator_address[i]:validator_address[i].validator,
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
                let obj = {
                    isActive: 'true'
                }
                let _obj = Object.assign(obj,indexedNodeList[i])
                activeList.push(_obj)
           } else {
               let obj = {
                    isActive: 'false'
                }
                let _obj = Object.assign(obj,indexedNodeList[i])
                notActiveList.push(_obj)
           }
        }

        let validate_node = this.connection.address != null? find(indexedNodeList, item => item.address==this.connection.address) : false;
        if(validate_node) {
            this.isNode = true;
        } else {
            this.isNode = false;
        }
        this.indexedNodeList = indexedNodeList;
        this.nodeList = activeList.concat(notActiveList);
        console.log(this.nodeList)
        this.notActiveList = notActiveList;
        this.stakeListLoading = false;
        this.getMyStakeList();
    },
    async getMyStakeList() {
        this.myStakeListLoading = true;
        let apiUrl = this.getApiUrl();
        let res = await getMyStake(apiUrl,{
            from: this.connection.address
        });
        if(res && res.data){
            let myStakeList = res.data.validators
            if(myStakeList.length>0){

                let validatorPowerMap = myStakeList.map(item => {
                    return this.stakeManageInstance.methods.getVotingPowerByAddress(item).call()
                })
                let validatorMap = myStakeList.map(item => {
                    return this.stakeManageInstance.methods.validators(item).call()
                })

                let validatorPower = await Promise.all(validatorPowerMap);
                let validators = await Promise.all(validatorMap);

                let balanceOfShareMap = validators.map(item => {
                    return this.getBalanceOfShare(item);
                })
                let balanceOfShare = await Promise.all(balanceOfShareMap);
                let arr = []
                for(let i = 0;i < myStakeList.length;i++){
                    arr.push({
                        address: myStakeList[i],
                        power: web3.utils.fromWei(web3.utils.toBN(validatorPower[i])),
                        balannceOfShare: web3.utils.fromWei(web3.utils.toBN(balanceOfShare[i].balance)),
                        commissionShare: balanceOfShare[i].commissionShare,
                    })
                }
                this.myStakeList = arr
            }
        }
        this.myStakeListLoading = false;
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
                      symbol: 'REI',
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
                      symbol: 'REI',
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
                      symbol: 'REI',
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
                      symbol: 'REI',
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
            str = resdays + this.$t('msg.days');
        } else if(Math.floor(val/60/60) > 0){
            str = Math.floor(val/60/60)+ this.$t('msg.hour');
        } else {
            str = val/60 + this.$t('msg.minute'); 
        }
        return str;
    },
    assetFormat(value,precision) {
        return util.asset(value,precision)
    },
    dateFormat(val) {   
       return util.dateFormat(val, 'YYYY-MM-dd hh:mm:ss')
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
.vote-list{
    position: relative;
    .v-tab-left{
        margin-left: 0 !important;
    }
}
.btn-div{
    text-align:right;
    text-transform: none !important;
    .v-btn{
        border:none;
        margin-top: -80px;
    }
}
.card-tab{
    display:flex;
    flex-direction: row;
    border-radius:20px;
    background-color: transparent;
}
    .v-tab{
       text-transform: none !important;
   }
    .active{
       width:30px;
       height: 20px;
       background-color: #FC9354;
       border-radius:15px;
       margin-left: 16px;
       padding:2px 12px;
    } 
    .not-active{
       width:30px;
       height: 20px;
       background-color: #5F82AD;
       border-radius:10px;
       margin-left: 16px;
       padding:2px 12px;
    }
   .v-application .text-center{
        text-align: right !important;
    }
    .my-voted-validator{
        width:120px;
        border-radius: 30px;
        margin: 1.5rem;
    }
    .right-outline{
        display: flex;
        flex-direction: row; 
        justify-content: flex-end;
    }
    .select-card{
        border:none;
        background-color: transparent;
        width: 120px; 
        margin-top:12px;
    }
    .d-select{
            border-radius: 30px;
            margin-right:20px
        }
    .theme--dark.v-data-table{
        background-color:transparent;
    }
    .v-pagination{
        display: inline-flex !important;
        justify-content: flex-end !important;
    }
    .theme--dark.v-tabs-items{
        background-color:transparent;
        
    }
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
        // padding:0;
        .input-title{
            margin-top: 12px;
            width: 80px;
            text-align: center;
            height:40px;
        }
    }
    .text-body{
        text-align:right; 
        margin-bottom:12px;
    }
    .text-caption{
        margin-top:12px;
    }
    .share-rei{
        text-align:right;
        margin:12px 0;
    }
    .text-filed{
        width:360px;
    }
    .text-bod{
        text-align: right;
    }
    @media screen and (max-width: 900px) {
        .vote-list{
            position: static !important;
            display: flex;
            flex-direction: column;
        }
        .btn-div{
            text-align:left !important;
        }
        .v-btn{
            border:none;
            margin-top: 0 !important;
        }
         .right-outline{
            display: flex;
            flex-direction: row !important; 
            justify-content: flex-start !important;
            margin-top:-28px;
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
