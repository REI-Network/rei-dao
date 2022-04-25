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
                    <v-tab key="11" class="v-tab-left">Validator List</v-tab>
                    <v-tab key="12">{{$t('unstake.title')}}</v-tab> 
            </v-tabs>
            <div class="btn-div" v-if="this.width>900">
                <v-btn
                    text
                    outlined
                    color="validator"
                    v-if="isNode"
                    @click="setRate"
                    >
                    {{$t('stake.set_commission_rate')}}
                     <span class="iconfont">&#xe618;</span>
                </v-btn>
                <v-btn
                    class="v-btn"
                    text
                    outlined
                    color="validator"
                    v-if="connection.address"
                    @click="stakeToNode"
                >
                {{$t('stake.stake_to_other_node')}}
                    <span class="iconfont">&#xe601;</span>
                </v-btn>
            </div>
            <div v-else>
            <v-divider class="faq_border" />
            <v-row @click="stakeToNode" class="iphone-btn" justify="space-between" align="center">
                <div>
                    <span class="iconfont">&#xe601;</span>
                    <!-- <v-btn
                        text
                        outlined
                        color="validator"
                        v-if="isNode"
                        @click="setRate"
                        >
                        {{$t('stake.set_commission_rate')}}
                    </v-btn> -->


                    <v-btn
                        class="v-btn"
                        text
                        outlined
                        color="validator"
                        v-if="connection.address"
                        @click="stakeToNode"
                    >
                    {{$t('stake.stake_to_other_node')}}
                    </v-btn>
                </div>
                 <div>></div>
            </v-row>
            <v-divider v-if="isNode"/>
            <v-row @click="setRate" v-if="isNode" class="iphone-btn" justify="space-between" align="center">
                <div>
                    <span class="iconfont">&#xe618;</span>
                    <v-btn
                        text
                        outlined
                        color="validator"
                        
                        @click="setRate"
                        >
                        {{$t('stake.set_commission_rate')}}
                    </v-btn>
                    <!-- <v-btn
                        class="v-btn"
                        text
                        outlined
                        color="validator"
                        v-if="connection.address"
                        @click="stakeToNode"
                    >
                    {{$t('stake.stake_to_other_node')}}
                    </v-btn> -->
                </div>
                 <div>></div>
            </v-row>
            </div>
          <v-divider class="faq_border" />
          <v-tabs-items v-model="tab1">
                <v-tab-item key="11" >
                    <v-row class="background" style="margin-top:0px;">
                        <v-tabs v-model="tab2"    
                            hide-slider 
                            class="my-voted-validator" 
                            background-color="background"
                            height="42">
                            <v-card outlined class="card-tab" >
                                <v-tab key="111" style="font-size:12px">Validator</v-tab>
                                <v-tab key="122" style="font-size:12px">{{$t('stake.not_active_nodelist')}}</v-tab>
                            </v-card> 
                        </v-tabs>
                        <v-col class="right-outline" v-if="this.tab2==0">
                            <v-card outlined  class="select-card">
                                <v-select
                                    class="d-select"
                                    :items="items"
                                    item-text="state"
                                    item-value="val"
                                    outlined
                                    item-color="vote_button"
                                    dense
                                    style="margin-left: 18px;"
                                    height="28"
                                    v-model="listFilter"
                                    @change="changeState"
                                ></v-select>
                            </v-card>
                            <v-card outlined class="select-card select-second">
                                <v-select
                                    class="d-select number"
                                    :items="itemsPages"
                                    label=""
                                    outlined
                                    item-color="vote_button"
                                    v-model="itemsPerPage"
                                    dense
                                ></v-select>
                            </v-card>
                        </v-col>
                        <v-col class="right-outline" v-if="this.tab2==1">
                            <v-card outlined class="select-card select-second">
                                <v-select
                                    class="d-select number"
                                    :items="itemsPages"
                                    label=""
                                    outlined
                                    item-color="vote_button"
                                    v-model="itemsMyVotedPerPage"
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
                                class="elevation-0"
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
                                    class="mr-4 font-btn btn-radius"
                                    v-if='connection.address'
                                    @click="handleStaking(item)"
                                    height="32"
                                    >
                                    {{$t('stake.staking')}}
                                    </v-btn>
                                    <v-btn
                                    tile
                                    small
                                    color="start_unstake"
                                    class="mr-4 unstake_btn btn-radius"
                                    v-if='connection.address'
                                    @click="handleClaim(item)"
                                    height="32"
                                    >
                                    {{$t('stake.claim')}}
                                    </v-btn>
                                    <v-btn
                                    v-if="item.address==connection.address"
                                    tile
                                    small
                                    color="vote_button btn-radius"
                                    class="mr-4 get-reward"
                                    @click="handleReward(item)"
                                    height="32"
                                    style="color:#FFF"
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
                        </v-tab-item>
                        <v-tab-item key="122">
                            <v-data-table
                                :headers="myStakeHeaders"
                                :items="myStakeList"
                                :items-per-page="itemsMyVotedPerPage"
                                class="elevation-0"
                                hide-default-footer
                                :loading="myStakeListLoading"
                                :loading-text="$t('msg.loading')"
                                :page.sync="pageMyVoted"
                                @page-count="pageMyVotedCount = $event"
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
                                    <template v-slot:item.apy="{ item }">
                                    {{ item.apy | asset(2)  }}
                                </template>
                        
                                <template v-slot:item.actions="{ item }">
                                    <v-btn
                                        tile
                                        small
                                        color="vote_button"
                                        class="mr-4 btn-radius"
                                        style="color:#FFF"
                                        @click="handleStaking(item)"
                                        height="32"
                                        >
                                        {{$t('stake.staking')}}
                                    </v-btn>
                                    <v-btn
                                        tile
                                        small
                                        color="start_unstake"
                                        class="mr-4 btn-radius"
                                        @click="handleClaim(item)"
                                        height="32"
                                    >
                                        {{$t('stake.claim')}}
                                    </v-btn>
                                    <span v-if='!connection.address'>
                                        -
                                    </span>
                                </template>
                            </v-data-table> 
                            <div class="text-center pt-2">
                                <v-pagination
                                    v-model="pageMyVoted"
                                    :length="pageMyVotedCount"
                                    color="vote_button"
                                    background-color="start_unstake"
                                    class="v-pagination"
                                    total-visible="6"
                                ></v-pagination>
                            </div>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tab-item>
                <v-tab-item key="12">
                    <UnstakeToValidator></UnstakeToValidator>
                </v-tab-item>
          </v-tabs-items>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500" class="dialog-card">
      <v-card :class="dark?'dialog-night':'dialog-daytime'">
          <div class="dialog-validator">
            <v-card-title class="dialog-title">{{$t('stake.staking_info')}}</v-card-title>
                <div @click="cancelStaking" class="close-btn"><v-icon>mdi-close</v-icon></div>  
          </div>   
          <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-dialog start_unstake">
          <v-form 
            ref="stakeform"
            lazy-validation
          >
            <div class="pb-1 text-body-1" style="padding-left:12px;"><span class="font-color">{{$t('stake.node')}}</span>: <Address :val="currentItem.address"></Address></div>
            <div class="pb-1 text-body-1 text-bod">
                <span class="font-color">{{$t('stake.wallet_balance')}}:</span> 
                <span style="font-weight:bold">{{ connection.balance | asset(2) }}</span>
                <span class="font-color"> REI</span>
                 </div>
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
                    class="mr-4 cancel-btn"
                    outlined
                    color="btn_button">
                {{$t('stake.btn_cancel')}}
                </v-btn>
                <v-btn
                :loading="stakeLoading"
                @click="submitStaking"
                color="vote_button"
                class="font-btn"
                >
                {{$t('stake.btn_submit')}}
                </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="stakeToNodeDialog" width="500" class="dialog-card">
      <v-card :class="dark?'dialog-night':'dialog-daytime'" style="padding:12px">
            <div class="dialog-validator">
                <v-card-title class="dialog-title">Voting To Validator</v-card-title>
                <div @click="cancelStakingToNode" class="close-btn"><v-icon>mdi-close</v-icon> </div>                     
            </div>
            <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-dialog start_unstake">
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
            <div class="text-bod">
                <span class="font-color">{{$t('stake.wallet_balance')}}:</span>
                 <span style="font-weight:bold;">{{ connection.balance | asset(2) }} </span>
                 <span class="font-color">REI</span>
                 </div>
            <v-row justify="space-between" style="margin-top:20px">
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
                    class="font-btn"
                    >
                {{$t('stake.btn_submit')}}
                </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="claimDialog" width="500" class="dialog-card">
      <v-card :class="dark?'dialog-night':'dialog-daytime'">
            <div class="dialog-validator"> 
                <v-card-title class="dialog-title">{{$t('stake.claim_info')}}</v-card-title>
                <div @click="cancelClaim" class="close-btn"> <v-icon>mdi-close</v-icon></div>  
            </div>          
          <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-dialog start_unstake">
          <v-form
            ref="claimform"
            lazy-validation
          >
            <div class="pb-1 text-body-1" style="padding-left:12px;">
                <span class="font-color">{{$t('stake.node')}}:</span> 
                <Address :val="currentItem.address"></Address>
                </div>
            <div class="pb-1 text-body-1 share-rei">
                <span class="font-color">{{$t('stake.commonnsion_share_balance')}}</span>
                <span style="font-weight:bold">{{currentItem.balannceOfShare | asset(2)}}</span>
                <span class="font-color">REI</span>
             </div>
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
                <v-btn
                class="mr-4 font-btn"
                color="vote_button"
                v-if="!approved"
                :loading="approveLoading"
                @click="submitApprove"
                >
                {{$t('stake.approve')}}
                </v-btn>
                <v-btn @click="cancelClaim" 
                        color="btn_button"
                        outlined
                        class="mr-4 cancel-btn">
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
             <div :class="dark?'pb-3 text-day':'pb-3 text-caption'"><strong>{{$t('stake.tips_claim_info',{unstakeDelay: timeToFormat(unstakeDelay)})}}</strong></div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <!-- reward -->
    <v-dialog v-model="rewardDialog" width="500" class="dialog-card">
      <v-card :class="dark?'dialog-night':'dialog-daytime'">
          <div class="dialog-validator">
            <v-card-title>{{$t('stake.reward_info')}}</v-card-title>
            <div @click="cancelReward" class="close-btn"><v-icon>mdi-close</v-icon></div>  
          </div>
          <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-dialog start_unstake">
          <v-form
            ref="claimRewardForm"
            lazy-validation
          >
              <div class="pb-1 text-body-1" style="text-align:right">
                  <span class="font-color">{{$t('stake.reward_balance')}} </span>
                  <span style="font-weight:bold">{{rewardBalance | asset(2)}} </span>
                 <span class="font-color"> REI</span>
            </div>
             <v-row>
                <v-col class="from-voting">
                    <div class="input-title">Amount</div>
                    <v-text-field
                        v-model="rewardForm.amount"
                        :label="$t('stake.amount')"
                        required
                        :rules="amountRules"
                        outlined
                        background-color="input_other"
                        class="text-filed"
                    ><template v-slot:append>
                        <v-btn text x-small @click="setAllReward()">
                            {{ $t('stake.max') }}
                        </v-btn>
                    </template>
                    </v-text-field> 
                </v-col>
            </v-row> 
            <div :class="dark?'pb-3 text-day':'pb-3 text-caption'"><strong>{{$t('stake.tips_claim_info',{unstakeDelay: timeToFormat(unstakeDelay)})}}</strong></div>
            
            <div class="text-center" style="margin-top:20px">
                <v-btn
                    color="btn_button"
                    outlined
                    class="mr-4 cancel-btn"
                    @click="cancelReward"
                 >
                {{$t('stake.btn_cancel')}}
                </v-btn>
                <v-btn
                class="font-btn"
                color="vote_button"
                :loading="rewardLoading"
                @click="submitClaimReward"
                >
                {{$t('stake.btn_submit')}}
                </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="setCommissionRateDialog" width="500">
      <v-card class="dialog-card" :class="dark?'dialog-night':'dialog-daytime'">
           <div class="dialog-validator"> 
                <v-card-title>{{$t('stake.set_commission_rate')}}</v-card-title>
                <div @click="cancelSetRate" class="close-btn"> <v-icon>mdi-close</v-icon></div>  
            </div>  
          <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-dialog">
          <v-form
            ref="form"
            lazy-validation
          >
            <div class="pb-1 text-body-1" style="text-align:right">
                <span class="font-color">{{$t('stake.commission_rate')}}: </span>
                <span style="font-weight:bold">{{currentAddress.commissionRate}}%</span>
            </div>
             <div class="pb-1 text-body-1" v-if="currentAddress.updateTimestamp!=0">{{$t('stake.last_update_time')}} {{currentAddress.updateTimestamp*1000 | dateFormat('YYYY-MM-dd hh:mm:ss')}}
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                        color="primary"
                        dark
                        v-bind="attrs"
                        v-on="on"
                        >
                         mdi-alert-circle-outline
                        </v-icon>
                    </template>
                    <span>{{$t('stake.tips_commission_rate',{commissionRateInterval: dateFormat((currentAddress.updateTimestamp*1+commissionRateInterval*1)*1000)} )}}</span>
                </v-tooltip>
             </div>
              <v-row>
                <v-col class="from-voting">
                <!-- <div class="input-title">{{$t('stake.commission_rate')}}</div> -->
                    <v-text-field
                        v-model="rateForm.amount"
                        :label="$t('stake.commission_rate')"
                        :rules="rateRules"
                        suffix="%"
                        persistent-hint
                        required
                        outlined
                        background-color="input_other"
                        class="text-filed"
                        height="24"
                    ></v-text-field>
                </v-col>  
            </v-row>       
            <div class="text-center">
                <v-btn 
                    @click="cancelSetRate"
                    color="btn_button"
                    outlined
                    class="mr-4 cancel-btn"
                >
                {{$t('stake.btn_cancel')}}
                </v-btn>
                <v-btn
                class="font-btn"
                color="vote_button"
                :loading="setRateLoading"
                @click="submitSetRate"
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
import abiStakeManager from '../abis/abiStakeManager'
import abiCommissionShare from '../abis/abiCommissionShare'
import abiValidatorRewardPool from '../abis/abiValidatorRewardPool'
import Address from '../components/Address';
import filters from '../filters';
import find from 'lodash/find';
import util from '../utils/util'
import UnstakeToValidator from './UnstakeToValidator';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core'

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT
let client = null;

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
        pageMyVoted:1,
        pageMyVotedCount:0,
        itemsMyVotedPerPage: 10,
        listFilter:'',
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
        width:'',  
        items: [{ state: 'All', val: '' },{ state: 'Active Validator', val: '1' },{ state: 'Unactive Validator', val: '2' }],
        itemsPages:[10, 20, 50],
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
            { text: 'Apy', value: 'apy' },
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
        activeList:[],
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
      this.windowWidth();
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
        this.activeList = activeList;
        this.indexedNodeList = indexedNodeList;
        this.nodeList = activeList.concat(notActiveList);
        this.notActiveList = notActiveList;
        this.stakeListLoading = false;
        this.getMyStakeList();
    },
    async getMyStakeList() {
        this.myStakeListLoading = true;
        let url = this.apiUrl.graph;
        client = new ApolloClient({
            uri: `${url}chainmonitor`,
            cache: new InMemoryCache(),
        })
        const getStakeinfos = gql`
         query stakeInfos {
            stakeInfos(where: { from: "${this.connection.address}" }) {
                id
                from
                timestamp
                validator
            }
        }
        `
        const {data:{stakeInfos}} = await client.query({
            query: getStakeinfos,
            variables: {
            },
            fetchPolicy: 'cache-first',
        })
        let myStakeList = stakeInfos;
        if(myStakeList.length>0){

            let validatorPowerMap = myStakeList.map(item => {
                return this.stakeManageInstance.methods.getVotingPowerByAddress(item.validator).call()
            })
            let validatorMap = myStakeList.map(item => {
                return this.stakeManageInstance.methods.validators(item.validator).call()
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
                    address: myStakeList[i].validator,
                    power: web3.utils.fromWei(web3.utils.toBN(validatorPower[i])),
                    balannceOfShare: web3.utils.fromWei(web3.utils.toBN(balanceOfShare[i].balance)),
                    commissionShare: balanceOfShare[i].commissionShare,
                })
            }
            this.myStakeList = arr
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
    },
    changeState() {
        if(this.listFilter == '1'){
            this.nodeList = this.activeList.concat(this.notActiveList);
        } else if(this.listFilter == '2'){
            this.nodeList = this.notActiveList
        } else {
            this.nodeList = this.activeList.concat(this.notActiveList);
        }
    },
     windowWidth(){
        const that = this;  
        that.width = window.innerWidth;
        console.log('屏幕宽度',) // 屏幕宽度 
     }
   
  },
  computed: {
    ...mapGetters({
      dark: 'dark',
      connection: 'connection',
      apiUrl: 'apiUrl'
    })
  }
};
</script>

<style scoped lang="scss">
.ma-dialog{
    padding:16px;
}
.theme--dark .v-pagination .v-pagination__item{
        background-color: #393560;
    }
.v-btn.v-btn--outlined.v-btn--text{
    border:none;
}
.dialog-night{
    background-color:#595777 ;
}
.dialog-daytime{
    background-color: #FFF;
}
.theme--dark.v-list{
  background-color: #595777;
}
.vote-list{
    position: relative;
    .v-tab-left{
        margin-left: 0 !important;
    }
}
.get-reward.theme--light.v-btn.v-btn--has-bg{
    background-color: #6979f8;
}
.btn-div{
    position: absolute;
    right:0;
    top:0;
    margin-top:12px;
    margin-right: 12px;
    color:#FFF;
}
.font-btn.v-btn.v-btn--has-bg{
    color: #FFF;
    background: #6979f8;
}
.unstake_btn.theme--dark.v-btn.v-btn--has-bg{
    background: #595777;
}
.cancel-btn{
    color:'#868e9e'
}
.card-tab{
    display:flex;
    flex-direction: row;
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
       color:#FFF;
    } 
    .not-active{
       width:30px;
       height: 20px;
       background-color: #5F82AD;
       border-radius:10px;
       margin-left: 16px;
       padding:2px 12px;
       color:#FFF;
    }
   .v-application .text-center{
        text-align: right !important;
    }
    .my-voted-validator{
        width:120px;
        border-radius: 30px;
        margin:1.5rem;
    }
    .right-outline{
        display: flex;
        flex-direction: row; 
        justify-content: flex-end;
    }

    .theme--dark.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset{
      height: 42px !important;
    }
    .select-card{
        border:none;
        background-color: transparent;
        width: 130px;
    }
    .select-second{
            width: 90px;
            margin-right:12px;
        }
    .d-select{
            margin-left:20px;
            margin-top:12px;
            width:120px
        }
        .number{
            width: 80px;
        }
    .theme--dark.v-data-table{
        background-color:transparent;
    }
    .v-pagination{
        display: inline-flex !important;
        justify-content: flex-end !important;
    }
    .v-btn{
        text-transform: none !important;
    }
    .btn-radius{
        border-radius: 4px;
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
            margin-right:16px;
            padding: 0;
            background-color: transparent;
            cursor: pointer;
        }
    }
    .from-voting{
        display: flex;
        justify-content: space-between;
        padding-bottom:0;
        // padding-top:8;  
        .input-title{
            color:#868E9E;
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
    .font-color{
        color:#868E9E;
    }
    .text-caption{
        margin-top:12px;
        margin-left:12px;
        padding:12px;
        // background-color:#FFF5DB;
        border: 1px #FB7E36 solid;
        color:#FB7E36;
        border-radius: 4px;
    }
    .text-day{
        margin-top:12px;
        padding:12px;
        background-color:transparent;
        border: 1px #FFA4A4 solid;
        color:#C2C1D6;
        border-radius: 4px;
        font-size:12px;
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
    .iphone-btn{
        // margin-top:20px;
        // border-top:1px solid grey;
        padding:20px;
        color:#868E9E;
    }
    @media screen and (max-width: 900px) {
        .vote-list{
            position: static !important;
            display: flex;
            flex-direction: column;
        }
        .theme--light .btn-div{
            text-align:left !important;
            padding: 4px 0;
            border-top: 1px solid rgb(235,235,235);
        }
         .theme--dark .btn-div{
            text-align:left !important;
            padding: 4px 0;
            border-top: 1px solid rgb(50,48,69);
        }
        .btn-div{
            position: static;
        }
        .v-btn{
            border:none;
        }
        .my-voted-validator{
            width:auto;
            margin:20px 16px;
        }
         .right-outline{
            display: flex;
            flex-direction: row ; 
            justify-content:flex-start !important;
            // margin-top:-16px;
            padding: 0;
        }
        .get-reward{
            width: 196px !important;
            margin-top:12px;
        }
        .dialog-validator{
            padding-left: 12px;
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
            width:46%;
            margin-top:-10px;
            display: flex;
            // background: red;
            justify-content: space-between !important;
        }
        .select-second{
            margin-left:12px;
            // background: blue($color: #000000);
        }
        .d-select{
            margin-left:0;
            width: 80%;
        }
        .text-filed{
            width:300px !important;
        }
        .card-tab{
            width:100% !important;
        }
        .v-tabs:not(.v-tabs--vertical) .v-tab{
            width: 50%;
            padding-left: 12px;
            padding-right:12px;
        }
    }
</style>
