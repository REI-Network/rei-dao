<template>
  <v-container class="background">
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-tabs v-model="tab1" align-with-title class="vote-list" background-color="background">
          <v-tab key="11" class="v-tab-left">Validator List</v-tab>
          <v-tab key="12">Jail</v-tab>
          <v-tab key="13">{{ $t('unstake.title') }}</v-tab>
          <v-tab key="14">My Voted Validators</v-tab>
        </v-tabs>
        <v-row class="btn-div" v-if="this.width > 900" style="margin-top: 15px">
          <v-btn text outlined color="validator" v-if="isNode" @click="setRate">
            {{ $t('stake.set_commission_rate') }}
            <span class="iconfont">&#xe618;</span>
          </v-btn>
          <v-btn class="v-btn" text outlined color="validator" v-if="connection.address" @click="stakeToNode">
            {{ $t('stake.stake_to_other_node') }}
            <span class="iconfont">&#xe601;</span>
          </v-btn>
          <div class="right-outline" v-if="this.tab1 == 0" style="margin-top: -14px">
            <v-card outlined class="select-card">
              <v-select class="d-select" :items="items" item-text="state" outlined item-value="val" item-color="vote_button" dense style="margin-left: 18px" v-model="listFilter" @change="changeState"></v-select>
            </v-card>
          </div>
        </v-row>
        <div v-else>
          <v-divider class="faq_border" />
          <v-row @click="stakeToNode" class="iphone-btn" justify="space-between" align="center">
            <div>
              <span class="iconfont">&#xe601;</span>
              <v-btn class="v-btn" text outlined color="validator" v-if="connection.address" @click="stakeToNode">
                {{ $t('stake.stake_to_other_node') }}
              </v-btn>
            </div>
            <div>></div>
          </v-row>
          <v-divider v-if="isNode" />
          <v-row @click="setRate" v-if="isNode" class="iphone-btn" justify="space-between" align="center">
            <div>
              <span class="iconfont">&#xe618;</span>
              <v-btn text outlined color="validator" @click="setRate">
                {{ $t('stake.set_commission_rate') }}
              </v-btn>
            </div>
            <div>></div>
          </v-row>
        </div>
        <v-divider class="faq_border" />
        <v-tabs-items v-model="tab1">
          <v-tab-item key="11">
            <v-data-table :headers="headers" :items="nodeList" class="elevation-0" hide-default-footer @click:row="validatorDetails" :items-per-page="itemsPerPage" :loading="stakeListLoading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="page" @page-count="pageCount = $event">
              <template v-slot:item.address="{ item }">
                <v-lazy class="logoWrap">
                  <v-img v-if="item.logo" :src="$IpfsGateway(item.logo)" lazy-src="../assets/images/logo_bg_small.png" width="24" height="24" class="logo-image"></v-img>
                  <v-img v-else src="../assets/images/rei.svg" width="24" height="24" class="logo-image"></v-img>
                </v-lazy>
                <span class="nodeName name-hover" v-if="item.nodeName">{{ item.nodeName }}</span>
                <span class="nodeName name-hover" v-else>{{ item.address | addr }}</span>
                <span :class="status[item.active] == 'Active' ? 'active' : 'not-active'">{{ status[item.active] }}</span>
                <v-btn v-if="item.active" text outlined color="validator" @click.stop="setCalculation(item)">
                  <span class="iconfont">&#xe619;</span>
                </v-btn>
              </template>
              <template v-slot:item.apr="{ item }"> {{ item.apr | asset(2) }}% </template>
              <template v-slot:item.responseRate="{ item }">
                <span v-if="item.minerInfo">
                  {{ item.responseRate }}%
                  <v-tooltip right v-if="item.minerInfo">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon size="14">mdi-help-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>
                      Block produced: {{ item.minerInfo.minerMessage.minedNumber }}<br />
                      Block missed(All): {{ item.minerInfo.minerMissRecordNumber }}<br />
                      Block missed(7day): {{ item.minerInfo.minerMissRecordNumberDay7 }}<br />
                      Block missed(1day): {{ item.minerInfo.minerMissRecordNumberDay1 }}
                    </span>
                  </v-tooltip>
                </span>
                <span v-if="!item.minerInfo"> - </span>
              </template>
              <template v-slot:item.power="{ item }">
                {{ item.power | asset(2) }}
                <v-tooltip right v-if="item.votingPowerPercent">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon size="14">mdi-help-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span> Voting Power Rate: {{ item.votingPowerPercent }}% </span>
                </v-tooltip>
              </template>
              <template v-slot:item.commissionRate="{ item }"> {{ item.commissionRate }}% </template>
              <!-- <template v-slot:item.balanceOfShare="{ item }">
                {{ item.balanceOfShare | asset(2) }}
              </template> -->
              <template v-slot:item.actions="{ item }">
                <v-btn tile small color="vote_button" class="mr-4 font-btn btn-radius" v-if="connection.address" :class="{ 'btn-opacity': inDefaultList(item) }" :disabled="inDefaultList(item)" @click.stop="handleStaking(item)" height="32">
                  {{ $t('stake.staking') }}
                </v-btn>
                <v-btn tile small color="start_unstake" class="mr-4 unstake_btn btn-radius" v-if="connection.address" @click.stop="handleClaim(item)" height="32">
                  {{ $t('stake.claim') }}
                </v-btn>
                <v-btn v-if="checkRewardState(item.address)" small class="mr-4 get-reward" @click.stop="handleReward(item)" height="32">
                  {{ $t('stake.get_reward') }}
                </v-btn>
                <span v-if="!connection.address"> - </span>
              </template>
            </v-data-table>
            <v-row justify="end" align="center" v-if="nodeList.length > 0">
              <div class="text-center pt-2">
                <v-pagination v-model="page" :length="pageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"></v-pagination>
              </div>
              <div class="right-outline" v-if="this.tab1 == 0" style="padding-top: 16px">
                <v-card outlined class="select-card select-second">
                  <v-select class="d-select number" :items="itemsPages" label="" solo item-color="vote_button" v-model="itemsPerPage" dense></v-select>
                </v-card>
              </div>
            </v-row>
          </v-tab-item>
          <v-tab-item key="12">
            <v-data-table :headers="jailHeaders" :items="jailList" :items-per-page="jailPerPage" class="elevation-0" hide-default-footer :no-data-text="$t('msg.nodatatext')" :loading="jailLoading" :loading-text="$t('msg.loading')" :page.sync="jailPage" @page-count="jailPageCount = $event">
              <template v-slot:item.validators="{ item }">
                <v-row align="center" @click="getJailRecords(item.address)" class="jail-head">
                  <v-lazy class="logoWrap">
                  <v-img v-if="item.logo" :src="$IpfsGateway(item.logo)" lazy-src="../assets/images/logo_bg_small.png" width="24" height="24" class="logo-image"></v-img>
                  <v-img v-else src="../assets/images/rei.svg" width="24" height="24" class="logo-image"></v-img>
                </v-lazy>
                <span class="nodeName name-hover" v-if="item.nodeName">{{ item.nodeName }}</span>
                <span class="nodeName name-hover" v-else>{{ item.address | addr }}</span>
                  <div :class="dark ? 'dark-nodes on-jail' : 'light-nodes on-jail'">Jail</div>
                </v-row>
              </template>
              <template v-slot:item.power="{ item }">
                <div>{{ item.power | asset(2) }}</div>
              </template>
              <template v-slot:item.timestamp="{ item }">
                <div>{{ item.timestamp * 1000 | dateFormat('YYYY-MM-dd hh:ss:mm') }}</div>
              </template>
              <template v-slot:item.operation="{ item }">
                <div v-if="item.address.toUpperCase() == connection.address.toUpperCase()">
                  <v-btn tile small color="vote_button" class="mr-4 font-btn btn-radius" @click.stop="getPayFine(item)" height="32"> Pay Fine </v-btn>
                </div>
                <div v-else> - </div>
              </template>
            </v-data-table>
            <v-row justify="end" align="center" v-if="jailList.length > 10" style="margin-bottom:20px;">
              <div class="text-center pt-2">
                <v-pagination v-model="jailPage" :length="jailPageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"></v-pagination>
              </div>
            </v-row>
          </v-tab-item>
          <v-tab-item key="13">
            <UnstakeToValidator></UnstakeToValidator>
          </v-tab-item>
          <v-tab-item key="14">
            <v-data-table :headers="myStakeHeaders" :items="myStakeList" :items-per-page="itemsMyVotedPerPage" @click:row="myVoteDetails" class="elevation-0" hide-default-footer :no-data-text="$t('msg.nodatatext')" :loading="myStakeListLoading" :loading-text="$t('msg.loading')" :page.sync="pageMyVoted" @page-count="pageMyVotedCount = $event">
              <template v-slot:item.address="{ item }">
                <v-lazy class="logoWrap">
                  <v-img v-if="item.logo" :src="$IpfsGateway(item.logo)" lazy-src="../assets/images/logo_bg_small.png" width="24" height="24" class="logo-image"></v-img>
                  <v-img v-else src="../assets/images/rei.svg" width="24" height="24" class="logo-image"></v-img>
                </v-lazy>
                <span class="nodeName name-hover" v-if="item.nodeName">{{ item.nodeName }}</span>
                <span class="nodeName name-hover" v-else>{{ item.address | addr }}</span>
                <!-- <Address :val="item.address"></Address> -->
              </template>
              <template v-slot:item.power="{ item }">
                {{ item.power | asset(2) }}
              </template>
              <template v-slot:item.balanceOfShare="{ item }">
                {{ item.balanceOfShare | asset(2) }}
              </template>
              <template v-slot:item.rewards="{ item }">
                {{ item.rewards | asset(5) }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn tile small color="vote_button" class="mr-4 btn-radius font-btn" :class="{ 'btn-opacity': inDefaultList(item) }" :disabled="inDefaultList(item)" style="color: #fff" @click.stop="handleStaking(item)" height="32">
                  {{ $t('stake.staking') }}
                </v-btn>
                <v-btn tile small color="start_unstake" class="mr-4 btn-radius" @click.stop="handleClaim(item)" height="32">
                  {{ $t('stake.claim') }}
                </v-btn>
                <span v-if="!connection.address"> - </span>
              </template>
            </v-data-table>
            <v-row justify="end" align="center" v-if="myStakeList.length > 0">
              <div class="text-center pt-2">
                <v-pagination v-model="pageMyVoted" :length="pageMyVotedCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"></v-pagination>
              </div>
              <div class="right-outline" v-if="this.tab1 == 2" style="padding-top: 16px">
                <v-card outlined class="select-card select-second vote-select">
                  <v-select class="d-select number" :items="itemsPages" label="" solo item-color="vote_button" v-model="itemsMyVotedPerPage" dense></v-select>
                </v-card>
              </div>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
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
              >: <Address :val="currentItem.address"></Address>
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
    <v-dialog v-model="stakeToNodeDialog" width="500" class="dialog-card">
      <v-card :class="dark ? 'dialog-night' : 'dialog-daytime'" style="padding: 12px">
        <div class="dialog-validator">
          <v-card-title class="dialog-title">Voting To Validator</v-card-title>
          <div @click="cancelStakingToNode" class="close-btn"><v-icon>mdi-close</v-icon></div>
        </div>
        <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-dialog start_unstake">
          <v-form ref="stakeToNodeform" lazy-validation>
            <v-row>
              <v-col class="from-voting">
                <div class="input-title">Validator</div>
                <v-text-field v-model="stakeForm.address" :label="$t('stake.address')" required clearable :rules="addressRules" outlined background-color="input_other" class="text-filed" color="chips"></v-text-field>
              </v-col>
            </v-row>
            <div class="text-bod">
              <span class="font-color">{{ $t('stake.wallet_balance') }}:</span>
              <span style="font-weight: bold">{{ connection.balance | asset(2) }} </span>
              <span class="font-color">REI</span>
            </div>
            <v-row justify="space-between" style="margin-top: 20px">
              <v-col class="from-voting from-amount">
                <div class="input-title">Amount</div>
                <v-text-field v-model="stakeForm.amount" :label="$t('stake.amount')" required :rules="amountRules" outlined background-color="input_other" class="text-filed">
                  <template v-slot:append>
                    <v-btn text x-small @click="setAll('stakeForm')">
                      {{ $t('stake.max') }}
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <div class="text-center">
              <v-btn @click="cancelStakingToNode" outlined color="btn_button" class="mr-4">
                {{ $t('stake.btn_cancel') }}
              </v-btn>
              <v-btn color="vote_button" :loading="stakeToNodeLoading" @click="submitStakingToNode" class="font-btn">
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
        <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-dialog start_unstake">
          <v-form ref="claimform" lazy-validation>
            <div class="pb-1 text-body-1">
              <span class="font-color">{{ $t('stake.node') }}:</span>
              <Address :val="currentItem.address"></Address>
            </div>
            <div class="pb-1 text-body-1 share-rei">
              <span class="font-color">{{ $t('stake.commonnsion_share_balance') }}</span>
              <span style="font-weight: bold">{{ currentItem.balanceOfShare | asset(2) }}</span>
              <span class="font-color"></span>
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

            <!-- <div class="pb-3 text-caption"><strong class="text--secondary">{{$t('stake.tips_claim_info',{unstakeDelay: timeToFormat(unstakeDelay)})}}</strong></div> -->

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
            <div class="pb-3 text-caption">{{ $t('stake.estimate_receive') }}: {{ receiveBalance }} REI</div>
            <div :class="dark ? 'pb-3 text-day' : 'pb-3 text-caption'">
              <strong>{{ $t('stake.tips_claim_info', { unstakeDelay: timeToFormat(unstakeDelay) }) }}</strong>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <!-- reward -->
    <v-dialog v-model="rewardDialog" width="500" class="dialog-card">
      <v-card :class="dark ? 'dialog-night' : 'dialog-daytime'">
        <div class="dialog-validator">
          <v-card-title>{{ $t('stake.reward_info') }}</v-card-title>
          <div @click="cancelReward" class="close-btn"><v-icon>mdi-close</v-icon></div>
        </div>
        <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-dialog start_unstake">
          <v-form ref="claimRewardForm" lazy-validation>
            <div class="pb-1 text-body-1" style="text-align: right">
              <span class="font-color">{{ $t('stake.reward_balance') }} </span>
              <span style="font-weight: bold">{{ rewardBalance | asset(2) }} </span>
              <span class="font-color"> REI</span>
            </div>
            <v-row>
              <v-col class="from-voting">
                <div class="input-title">Amount</div>
                <v-text-field v-model="rewardForm.amount" :label="$t('stake.amount')" required :rules="amountRules" outlined background-color="input_other" class="text-filed"
                  ><template v-slot:append>
                    <v-btn text x-small @click="setAllReward()">
                      {{ $t('stake.max') }}
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <div :class="dark ? 'pb-3 text-day' : 'pb-3 text-caption'">
              <strong>{{ $t('stake.tips_claim_info', { unstakeDelay: timeToFormat(unstakeDelay) }) }}</strong>
            </div>

            <div class="text-center" style="margin-top: 20px">
              <v-btn color="btn_button" outlined class="mr-4 cancel-btn" @click="cancelReward">
                {{ $t('stake.btn_cancel') }}
              </v-btn>
              <v-btn class="font-btn" color="vote_button" :loading="rewardLoading" @click="submitClaimReward">
                {{ $t('stake.btn_submit') }}
              </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="setCommissionRateDialog" width="500">
      <v-card class="dialog-card" :class="dark ? 'dialog-night' : 'dialog-daytime'">
        <div class="dialog-validator">
          <v-card-title>{{ $t('stake.set_commission_rate') }}</v-card-title>
          <div @click="cancelSetRate" class="close-btn"><v-icon>mdi-close</v-icon></div>
        </div>
        <!-- <v-divider></v-divider> -->
        <v-list rounded class="ma-dialog">
          <v-form ref="form" lazy-validation>
            <div class="pb-1 text-body-1" style="text-align: right">
              <span class="font-color">{{ $t('stake.commission_rate') }}: </span>
              <span style="font-weight: bold">{{ currentAddress.commissionRate }}%</span>
            </div>
            <div class="pb-1 text-body-1" v-if="currentAddress.updateTimestamp != 0">
              {{ $t('stake.last_update_time') }} {{ (currentAddress.updateTimestamp * 1000) | dateFormat('YYYY-MM-dd hh:mm:ss') }}
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on"> mdi-alert-circle-outline </v-icon>
                </template>
                <span>{{ $t('stake.tips_commission_rate', { commissionRateInterval: dateFormat((currentAddress.updateTimestamp * 1 + commissionRateInterval * 1) * 1000) }) }}</span>
              </v-tooltip>
            </div>
            <v-row>
              <v-col class="from-voting">
                <!-- <div class="input-title">{{$t('stake.commission_rate')}}</div> -->
                <v-text-field v-model="rateForm.amount" :label="$t('stake.commission_rate')" :rules="rateRules" suffix="%" persistent-hint required outlined background-color="input_other" class="text-filed" height="24"></v-text-field>
              </v-col>
            </v-row>
            <div class="text-center">
              <v-btn @click="cancelSetRate" color="btn_button" outlined class="mr-4 cancel-btn">
                {{ $t('stake.btn_cancel') }}
              </v-btn>
              <v-btn class="font-btn" color="vote_button" :loading="setRateLoading" @click="submitSetRate">
                {{ $t('stake.btn_submit') }}
              </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="calculationDialog" width="580">
      <v-card class="calculation-card">
        <v-row justify="space-between">
          <v-col cols="12" md="10">
            <h3>
              <span class="iconfont">&#xe619;&nbsp;&nbsp;</span>Calculate Voting Rewards
              <v-tooltip right color="start_unstake">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="right_icon" v-bind="attrs" v-on="on" dense size="16" style="margin-left: 4px"> mdi-alert-circle-outline </v-icon>
                </template>
                <span
                  >This calculation of earnings is for reference only<br />
                  and does not represent the final earnings, please<br />
                  refer to the actual results.</span
                >
              </v-tooltip>
            </h3>
          </v-col>
          <v-col cols="12" md="1" @click="cancelCalculation()" class="close-dialog">
            <v-icon>mdi-close</v-icon>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card outlined :class="dark ? 'dark-nodes node-details' : 'light-nodes node-details'">
              <v-row align="center" class="node-name">
                <h3>{{ nodeInfoList.nodeName }}</h3>
                <div v-if="nodeInfoList.active" class="active">Active</div>
                <div v-else class="not-active">Inactive</div>
                <div class="font-grey">&nbsp;&nbsp;Commission Rate: {{ nodeInfoList.commissionRate }}%</div>
              </v-row>
              <v-row>
                <div class="calculate-address">{{ nodeInfoList.address }}</div>
                <v-btn @click="copyAddr(nodeInfoList.address)" style="margin-top: 8px">
                  <v-icon small color="#868E9E">{{ addrCopying ? 'mdi-checkbox-marked-circle-outline' : 'mdi-content-copy' }}</v-icon>
                </v-btn>
              </v-row>
            </v-card>
            <v-row class="calculate-input" style="margin-top: 30px">
              <span class="subheading mr-1" style="margin-left: 12px">Vote</span>
              <!-- <span :class="dark ? 'dark-amount' : 'light-amount'">{{ stake | asset() }}</span> -->
              <div style="width: 200px"><v-text-field v-model="stake" color="#6979F8" :class="dark ? 'dark-amount' : 'light-amount'"></v-text-field></div>
              <span class="subheading mr-1"> REI</span>
            </v-row>
            <!-- <v-slider v-model="stake" track-color="#F5F5F5" track-fill-color="#6979F8" thumb-color="#6979F8" tick-size="10" loader-height="10" always-dirty min="0" max="2000000"> </v-slider> -->
            <!-- <v-row justify="space-between" class="slider-num font-grey">
              <v-col>0</v-col>
              <v-col style="text-align: right">2M</v-col>
            </v-row> -->
            <v-row class="" justify="space-between">
              <v-col class="text-left">
                <span class="mr-1">Locking $REI for</span>
                <span :class="dark ? 'dark-amount' : 'light-amount'">{{ this.days }}</span>
                <span class="mr-1"> days</span>
              </v-col>
            </v-row>
            <v-slider v-model="days" track-color="#F5F5F5" track-fill-color="#6979F8" thumb-color="#6979F8" always-dirty min="0" max="365" tick-size="8"> </v-slider>
            <v-row justify="space-between" class="slider-num">
              <v-col>0 D</v-col>
              <v-col style="text-align: right">365D</v-col>
            </v-row>
            <v-row justify="space-between">
              <v-col>
                <div>Estimated rewards</div>
                <div>
                  <span :class="dark ? 'dark-amount' : 'light-amount'">{{ userRewardsYear | asset(2) }}</span> REI
                </div>
              </v-col>
              <v-col style="text-align: right">
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
    <v-dialog v-model="payFineDialog" width="580">
      <v-card class="dialog-card" :class="dark ? 'dialog-night' : 'dialog-daytime'">
        <div class="dialog-validator">
          <v-card-title>Pay Fine</v-card-title>
          <div class="close-btn" @click="closePayFine"><v-icon>mdi-close</v-icon></div>
        </div>
        <v-card outlined :class="dark ? 'dark-pay pay-tips' : 'light-pay pay-tips'">
          <div class="font-grey">
            Tips:<br />
            During this period, block production will be prohibited, and the validator needs to pay a fine of {{ unJailAmount | asset(0) }} REI to re-participate in block production. The fined {{ unJailAmount | asset(0) }} REI will be directly locked in the black hole address, and permanently cannot be withdrawn.
          </div>
        </v-card>
        <v-row class="pay-btn" align="center">
          <v-col>
            <v-row align="center">
              <h3>{{ unJailAmount | asset(0) }}</h3>
              <span style="margin-left:8px;">REI</span>
            </v-row>
          </v-col>
          <v-col style="text-align:right;">
            <v-btn tile small color="vote_button" :loading="unjailLoading" @click="submitPay" class="mr-4 font-btn btn-radius" height="32" width="100"> Pay </v-btn>
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
import abiConfig from '../abis/abiConfig';
import abiStakeManager from '../abis/abiStakeManager';
import abiCommissionShare from '../abis/abiCommissionShare';
import abiValidatorRewardPool from '../abis/abiValidatorRewardPool';
import Address from '../components/Address';
import filters from '../filters';
import dayjs from 'dayjs';
import find from 'lodash/find';
import util from '../utils/util';
import UnstakeToValidator from './UnstakeToValidator';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { getValidatorDetails, getValidatorMinedInfo } from '../service/CommonService';

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT;

const ONE_DAY_UNIX = 24 * 60 * 60;

let client = null;

export default {
  components: {
    Address,
    UnstakeToValidator
  },
  filters,
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      pageMyVoted: 1,
      pageMyVotedCount: 0,
      itemsMyVotedPerPage: 10,
      jailPage: 1,
      jailPageCount: 0,
      jailPerPage: 20,
      listFilter: '',
      payFineDialog: false,
      isNode: false,
      tab1: null,
      tab2: null,
      stakeListLoading: false,
      jailLoading: false,
      myStakeListLoading: false,
      dialog: false,
      claimDialog: false,
      stakeToNodeDialog: false,
      rewardDialog: false,
      setCommissionRateDialog: false,
      calculationDialog: false,
      validatorDialog: false,
      myStakeList: [],
      myStakeListRawData: [],
      width: '',
      stake: 0,
      days: 0,
      interval: null,
      isPlaying: false,
      userRewardsYear: 0,
      current: 0,
      totalAmount: 0,
      calculationItems: [],
      nodeInfoList: [],

      items: [
        { state: 'All', val: '' },
        { state: 'Active Validator', val: '1' },
        { state: 'Inactive Validator', val: '2' }
      ],
      itemsPages: [10, 20, 50],
      headers: [
        {
          text: this.$t('stake.node'),
          align: 'start',
          sortable: false,
          value: 'address'
        },
        { text: 'APR', value: 'apr' },
        { text: 'Response Rate', value: 'responseRate' },
        { text: this.$t('stake.voting_power'), value: 'power' },
        { text: this.$t('stake.commission_rate'), value: 'commissionRate' },
        // { text: this.$t('stake.share_balance'), value: 'balanceOfShare' },
        { text: this.$t('stake.operation'), value: 'actions', sortable: false }
      ],
      myStakeHeaders: [
        {
          text: this.$t('stake.node'),
          align: 'start',
          sortable: false,
          value: 'address'
        },
        {
          text: this.$t('stake.voting_power'),
          value: 'power'
        },
        { text: this.$t('stake.share_balance'), value: 'balanceOfShare' },
        { text: 'Estimate Reward', value: 'rewards' },
        { text: this.$t('stake.operation'), value: 'actions', sortable: false }
      ],
      jailHeaders: [
        { text: 'Validators', value: 'validators' },
        { text: 'Voting Power', value: 'power' },
        { text: 'Time in Jail', value: 'timestamp' },
        { text: 'Operation', value: 'operation' }
      ],
      jailList: [
      ],
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
      stakeForm: {
        address: '',
        amount: 0
      },
      rewardForm: {
        amount: 0
      },
      rateForm: {
        amount: 0
      },
      currentItem: '',
      currentAddress: {},
      stakeManagerContract: '',
      stakeManageInstance: '',
      validatorRewardPoolContract: '',
      stakeLoading: false,
      claimLoading: false,
      approveLoading: false,
      stakeToNodeLoading: false,
      rewardLoading: false,
      setRateLoading: false,
      unjailLoading: false,
      rewardBalance: 0,
      nodeList: [],
      nodeListRaw: [],
      activeList: [],
      notActiveList: [],
      indexedNodeList: [],
      detailsItem: '',
      addrCopying: false,
      detailsList: [],
      receiveBalance: 0,
      commissionShare: '',
      commissionRateInterval: 0,
      minIndexVotingPower: 0,
      unstakeDelay: 0,
      unJailPayAmount:'20000',
      unJailAmount:0,
      approved: true,
      calculateRules: [(v) => !!v || this.$t('msg.please_input_number')],
      rateRules: [(v) => !!v || this.$t('msg.please_input_number'), (v) => (v && util.isNumber(v) && v >= 1 && v <= 100) || this.$t('msg.please_input_1_100_num')],
      amountRules: [(v) => !!v || this.$t('msg.please_input_amount'), (v) => (v && util.isNumber(v)) || this.$t('msg.please_input_correct_num'), (v) => (v && v > 0) || this.$t('msg.please_input_not_zero')],
      addressRules: [(v) => !!v || this.$t('msg.please_input_address')],
      defaultValidatorList: ['0x0efe0da2b918412f1009337FE86321d88De091fb', '0x1b0885d33B43A696CD5517244A4Fcb20B929F79D', '0x2957879B3831b5AC1Ef0EA1fB08Dd21920f439b4', '0xaA714ecc110735B4E114C8B35F035fc8706fF930', '0xb7a19F9b6269C26C5Ef901Bd128c364Dd9dDc53a']
    };
  },
  watch: {
    '$store.state.finishedTxs': function () {
      this.init();
    },
    listenChange(stake, days) {
      this.Calculation();
    }
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
      let contract = new web3.eth.Contract(abiConfig, config_contract);

      this.stakeManagerContract = await contract.methods.stakeManager().call();
      this.stakeManageInstance = new web3.eth.Contract(abiStakeManager, this.stakeManagerContract);

      let blockHeight = await web3.eth.getBlockNumber();
      let url = this.apiUrl.graph;
      client = new ApolloClient({
        uri: `${url}chainMonitorBetterPos`,
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
      if (this.connection.address) {
        await this.getMyStakeListData();
      }

      let validatorList = validators[0].Validator;
      let validatorArr = [];

      let activeList = [];
      let notActiveList = [];
      for (let i = 0; i < validatorList.length; i++) {
        let _validator = {
          address: validatorList[i].address,
          power: web3.utils.fromWei(web3.utils.toBN(validatorList[i].votingPower)),
          balanceOfShare: 0,
          commissionShare: null,
          commissionAddress: validatorList[i].commissionAddress,
          commissionRate: validatorList[i].commissionRate,
          active: validatorList[i].active
        };

        let _stakedValidator = find(this.myStakeListRawData, (item) => web3.utils.toChecksumAddress(item.validator) == web3.utils.toChecksumAddress(validatorList[i].address));
        if (_stakedValidator) {
          let _balanceOfShare = await this.getBalanceOfShare(validatorList[i].commissionAddress);
          _validator.balanceOfShare = web3.utils.fromWei(web3.utils.toBN(_balanceOfShare.balance));
          _validator.commissionShare = _balanceOfShare.commissionShare;
        }

        if (this.connection.address && web3.utils.toChecksumAddress(validatorList[i].address) == web3.utils.toChecksumAddress(this.connection.address)) {
          let validatorInfo = await this.stakeManageInstance.methods.validators(validatorList[i].address).call();
          _validator.updateTimestamp = validatorInfo.updateTimestamp;
        }

        validatorArr.push(_validator);
        if (_validator.active) {
          activeList.push(_validator);
        } else {
          notActiveList.push(_validator);
        }
      }

      let validate_node = this.connection.address != '' ? find(validatorArr, (item) => web3.utils.toChecksumAddress(item.address) == web3.utils.toChecksumAddress(this.connection.address)) : false;
      if (validate_node) {
        this.isNode = true;
      } else {
        this.isNode = false;
      }
      this.activeList = activeList;
      this.indexedNodeList = validatorArr;
      this.nodeList = activeList.concat(notActiveList);
      this.notActiveList = notActiveList;

      this.stakeListLoading = false;
      let nodeArr = activeList.map((item) => {
        return item.address;
      });
      let _details = await getValidatorDetails();
      this.detailsList = _details.data.data;
      this.getJailList();

      // get validator response rate;
      const endTimestamp = dayjs().unix();
      const startTimestampDay1 = endTimestamp - ONE_DAY_UNIX;
      const startTimestampDay7 = endTimestamp - ONE_DAY_UNIX * 7;

      let minedInfo = await getValidatorMinedInfo({ miner: nodeArr.join() });
      let minedInfoDay1 = await getValidatorMinedInfo({ miner: nodeArr.join(), starttimestamp: startTimestampDay1 });
      let minedInfoDay7 = await getValidatorMinedInfo({ miner: nodeArr.join(), starttimestamp: startTimestampDay7 });

      let minedInfoMap = {};
      for (let i = 0; i < minedInfo.data.length; i++) {
        let _data = minedInfo.data[i];
        let _address = web3.utils.toChecksumAddress(_data.minerMessage.miner);
        let obj = {
          ..._data,
          minerMissRecordNumberDay1: minedInfoDay1.data[i].minerMissRecordNumber,
          minerMissRecordNumberDay7: minedInfoDay7.data[i].minerMissRecordNumber,
          minerMintedBlockNumberDay1: minedInfoDay1.data[i].minerMintedBlockNumber,
          minerMintedBlockNumberDay7: minedInfoDay7.data[i].minerMintedBlockNumber
        };
        minedInfoMap[_address] = obj;
      }
      
      this.totalAmount = 0;
      for (let i = 0; i < this.activeList.length; i++) {
        let item = this.activeList[i];
        this.totalAmount += parseFloat(item.power);
      }

      this.nodeList = this.nodeList.map((item) => {
        let detail = find(this.detailsList, (items) => web3.utils.toChecksumAddress(items.nodeAddress) == web3.utils.toChecksumAddress(item.address));
        if (detail) {
          var nodeName = detail.nodeName;
          var logo = detail.logo;
          var website = detail.website;
          var nodeDesc = detail.nodeDesc;
        }
        let apr = 0;
        let votingPowerPercent = 0;

        if (item.active) {
          apr = (100000000 / this.totalAmount) * 0.1 * (item.commissionRate / 100) * 100;
          votingPowerPercent = ((item.power / this.totalAmount) * 100).toFixed(2);
        } else {
          apr = 0;
        }
        let _miner = web3.utils.toChecksumAddress(item.address);

        return {
          ...item,
          nodeName: nodeName,
          logo: logo,
          website: website,
          nodeDesc: nodeDesc,
          apr: apr,
          minerInfo: minedInfoMap[_miner],
          votingPowerPercent,
          responseRate: this.calResponseRate(minedInfoMap[_miner])
        };
      });
      this.nodeListRaw = [].concat(this.nodeList);
      
      this.unJailPayAmount = await contract.methods.forfeit().call();
      console.log(this.unJailPayAmount);
      this.commissionRateInterval = await contract.methods.setCommissionRateInterval().call();
      this.unstakeDelay = await contract.methods.unstakeDelay().call();
      let minIndexVotingPower = await contract.methods.minIndexVotingPower().call();
      this.minIndexVotingPower = web3.utils.fromWei(web3.utils.toBN(minIndexVotingPower));
      let validatorRewardPool = await contract.methods.validatorRewardPool().call();
      this.validatorRewardPoolContract = new web3.eth.Contract(abiValidatorRewardPool, validatorRewardPool);
      this.getMessage();
      this.getMyStakeList();
      this.Calculation();
    },
    async getMinedInfo() {},
    async getMyStakeListData() {
      let url = this.apiUrl.graph;
      let client = new ApolloClient({
        uri: `${url}chainMonitorOnlyForStake`,
        cache: new InMemoryCache()
      });
      const getStakeinfos = gql`
         query stakeInfos {
            stakeInfos(where: { from: "${this.connection.address}" }) {
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
      this.myStakeListRawData = stakeInfos;
    },
    async getMyStakeRewardList() {
      let url = this.apiUrl.graph;
      let client = new ApolloClient({
        uri: `${url}voteReward`,
        cache: new InMemoryCache()
      });
      const getVoterInfos = gql`
        query voterInfos($arrId: [String]) {
          voterInfos(where: { id_in: $arrId }) {
            id
            cost
            timestamp
            commissionAddress
          }
        }
      `;
      let arrId = [];
      for (let i = 0; i < this.myStakeListRawData.length; i++) {
        let _item = this.myStakeListRawData[i];
        arrId.push(_item.id);
      }
      const {
        data: { voterInfos }
      } = await client.query({
        query: getVoterInfos,
        variables: {
          arrId
        },
        fetchPolicy: 'cache-first'
      });
      return voterInfos;
    },
    async getMyStakeList() {
      this.myStakeListLoading = true;
      let voterInfos = await this.getMyStakeRewardList();
      let myStakeList = this.myStakeListRawData;
      if (myStakeList.length > 0) {
        let validatorPowerMap = myStakeList.map((item) => {
          return this.stakeManageInstance.methods.getVotingPowerByAddress(item.validator).call();
        });
        let validatorMap = myStakeList.map((item) => {
          return this.stakeManageInstance.methods.validators(item.validator).call();
        });

        let validatorPower = await Promise.all(validatorPowerMap);
        let validators = await Promise.all(validatorMap);

        let balanceOfShareMap = validators.map((item) => {
          return this.getBalanceOfShare(item[1]);
        });
        let balanceOfShare = await Promise.all(balanceOfShareMap);
        let arr = [];
        for (let i = 0; i < myStakeList.length; i++) {
          let rewardInfo = {},
            reward = 0;
          if (balanceOfShare[i].balance > 0) {
            rewardInfo = await this.stakeManageInstance.methods.estimateSharesToAmount(myStakeList[i].validator, balanceOfShare[i].balance).call();
            reward = web3.utils.fromWei(web3.utils.toBN(rewardInfo).sub(web3.utils.toBN(voterInfos[i].cost)));
          } else {
            reward = 0;
          }

          arr.push({
            address: myStakeList[i].validator,
            power: web3.utils.fromWei(web3.utils.toBN(validatorPower[i])),
            balanceOfShare: web3.utils.fromWei(web3.utils.toBN(balanceOfShare[i].balance)),
            commissionShare: balanceOfShare[i].commissionShare,
            rewards: reward
          });
        }
        this.myStakeList = arr;
      }
      this.myStakeList = this.myStakeList.map((item) => {
        let detail = find(this.detailsList, (items) => web3.utils.toChecksumAddress(items.nodeAddress) == web3.utils.toChecksumAddress(item.address));
        if (detail) {
          var nodeName = detail.nodeName;
          var logo = detail.logo;
          var website = detail.website;
          var nodeDesc = detail.nodeDesc;
        }
        return {
          ...item,
          nodeName: nodeName,
          logo: logo,
          website: website,
          nodeDesc: nodeDesc
        };
      });
      this.myStakeListLoading = false;
    },
    async getBalanceOfShare(activeValidatorsShare) {
      let commissionShare = new web3.eth.Contract(abiCommissionShare, activeValidatorsShare);
      let balance = 0;
      if (this.connection.address) {
        balance = await commissionShare.methods.balanceOf(this.connection.address).call();
      }
      return {
        balance,
        commissionShare
      };
    },
    handleStaking(item) {
      this.currentItem = item;
      this.$refs.stakeform && this.$refs.stakeform.reset();
      this.form.amount = 0;
      this.dialog = true;
    },
    async handleClaim(item) {
      this.currentItem = item;
      this.$refs.claimform && this.$refs.claimform.reset();
      this.receiveBalance = 0;
      this.claimForm.amount = 0;
      let commissionShare = this.currentItem.commissionShare;
      if (!this.currentItem.commissionShare) {
        commissionShare = new web3.eth.Contract(abiCommissionShare, item.commissionAddress);
      }
      const allowance = await commissionShare.methods.allowance(this.connection.address, this.stakeManagerContract).call();
      if (allowance != 0) {
        this.approved = true;
      } else {
        this.approved = false;
      }
      this.claimDialog = true;
    },
    setAll(obj) {
      this[obj].amount = this.connection.balance;
    },
    claimAll() {
      this.claimForm.amount = this.currentItem.balanceOfShare;
      this.calculateAmount();
    },
    setAllReward() {
      this.rewardForm.amount = this.rewardBalance;
    },
    async submitStaking() {
      try {
        if (!this.$refs.stakeform.validate()) return;
        this.stakeLoading = true;
        const stakeRes = await this.stakeManageInstance.methods.stake(this.currentItem.address, this.connection.address).send({
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
                to: util.addr(this.currentItem.address)
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
    cancelStaking() {
      this.$refs.stakeform && this.$refs.stakeform.reset();
      this.dialog = false;
    },
    cancelClaim() {
      this.$refs.claimform && this.$refs.claimform.reset();
      this.claimDialog = false;
    },
    async submitApprove() {
      this.approveLoading = true;
      let commissionShare = this.currentItem.commissionShare;
      if (!this.currentItem.commissionShare) {
        commissionShare = new web3.eth.Contract(abiCommissionShare, this.currentItem.commissionAddress);
      }
      await commissionShare.methods.approve(this.stakeManagerContract, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').send({ from: this.connection.address });
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
        const claimRes = await this.stakeManageInstance.methods.startUnstake(this.currentItem.address, this.connection.address, web3.utils.toWei(this.claimForm.amount)).send({
          from: this.connection.address
        });
        if (claimRes.transactionHash) {
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
      } catch (e) {
        this.claimDialog = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
      this.claimLoading = false;
    },
    async calculateAmount() {
      if (util.isNumber(this.claimForm.amount) && this.claimForm.amount > 0) {
        const amount = await this.stakeManageInstance.methods.estimateSharesToAmount(this.currentItem.address, web3.utils.toWei(this.claimForm.amount)).call();
        this.receiveBalance = web3.utils.fromWei(web3.utils.toBN(amount));
      }
    },
    stakeToNode() {
      this.stakeToNodeDialog = true;
    },
    async submitStakingToNode() {
      try {
        if (!this.$refs.stakeToNodeform.validate()) return;
        this.stakeToNodeLoading = true;
        const stakeRes = await this.stakeManageInstance.methods.stake(this.stakeForm.address, this.connection.address).send({
          from: this.connection.address,
          value: web3.utils.numberToHex(web3.utils.toWei(this.stakeForm.amount))
        });
        if (stakeRes.transactionHash) {
          console.log(stakeRes);
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
      } catch (e) {
        this.stakeToNodeDialog = false;
        console.log(e);
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
      this.rewardBalance = web3.utils.fromWei(web3.utils.toBN(rewardBalance));
      this.rewardDialog = true;
    },
    cancelReward() {
      this.rewardDialog = false;
    },
    async submitClaimReward() {
      try {
        if (!this.$refs.claimRewardForm.validate()) return;
        this.rewardLoading = true;
        const rewardRes = await this.stakeManageInstance.methods.startClaim(this.connection.address, web3.utils.toWei(this.rewardForm.amount)).send({
          from: this.connection.address
        });
        if (rewardRes.transactionHash) {
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
      } catch (e) {
        this.rewardDialog = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
      this.rewardLoading = false;
    },
    setRate() {
      for (let i = 0; i < this.indexedNodeList.length; i++) {
        if (web3.utils.toChecksumAddress(this.indexedNodeList[i].address) == web3.utils.toChecksumAddress(this.connection.address)) {
          this.currentAddress = this.indexedNodeList[i];
          break;
        }
      }
      this.rateForm.amount = this.currentAddress.commissionRate;
      this.setCommissionRateDialog = true;
    },
    async submitSetRate() {
      try {
        if (!this.$refs.form.validate()) return;
        this.setRateLoading = true;
        const setRateRes = await this.stakeManageInstance.methods.setCommissionRate(Number(this.rateForm.amount)).send({
          from: this.connection.address
        });
        if (setRateRes.transactionHash) {
          this.addTx({
            tx: {
              txid: setRateRes.transactionHash,
              type: 'setrate',
              status: 'PENDING',
              data: {
                amount: this.rateForm.amount
              },
              timestamp: new Date().getTime()
            }
          });
          this.setCommissionRateDialog = false;
        }
      } catch (e) {
        this.setCommissionRateDialog = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
      this.setRateLoading = false;
    },
    cancelSetRate() {
      this.setCommissionRateDialog = false;
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
    assetFormat(value, precision) {
      return util.asset(value, precision);
    },
    dateFormat(val) {
      return util.dateFormat(val, 'YYYY-MM-dd hh:mm:ss');
    },
    changeState() {
      let activeList = [];
      let notActiveList = [];
      for (let i = 0; i < this.nodeListRaw.length; i++) {
        let _node = this.nodeListRaw[i];
        if (_node.active) {
          activeList.push(_node);
        } else {
          notActiveList.push(_node);
        }
      }
      this.activeList = activeList;
      this.notActiveList = notActiveList;
      if (this.listFilter == '1') {
        this.nodeList = this.activeList;
      } else if (this.listFilter == '2') {
        this.nodeList = this.notActiveList;
      } else {
        this.nodeList = this.activeList.concat(this.notActiveList);
      }
    },
    windowWidth() {
      const that = this;
      that.width = window.innerWidth;
    },
    setCalculation(item) {
      this.stake = 0;
      this.days = 0;
      this.userRewardsYear = 0;
      this.current = 0;
      this.calculationDialog = true;
      this.nodeInfoList = item;
    },
    cancelCalculation() {
      this.calculationDialog = false;
    },
    async myVoteDetails(value) {
      // this.validatorDialog = true;
      this.detailsItem = value;
      this.$router.push({
        name: 'StakeInfo',
        query: {
          id: value.address
        }
      });
    },

    Calculation() {
      let votingRewardsYear = 10000000 * ((parseFloat(this.nodeInfoList.power) + this.stake) / (this.totalAmount + this.stake)) * (this.nodeInfoList.commissionRate / 100);
      this.userRewardsYear = ((votingRewardsYear * this.stake) / (parseFloat(this.nodeInfoList.power) + this.stake) / 365) * this.days;
      this.current = (this.userRewardsYear / (this.stake * 365)) * this.days * 100;
    },
    async validatorDetails(value) {
      // this.validatorDialog = true;
      this.detailsItem = value;
      this.$router.push({
        name: 'StakeInfo',
        query: {
          id: value.address
        }
      });
    },

    closeDetails() {
      this.validatorDialog = false;
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
    inDefaultList(item) {
      return this.defaultValidatorList.includes(web3.utils.toChecksumAddress(item.address));
    },
    checkRewardState(address) {
      if (!this.connection.address) return false;
      return web3.utils.toChecksumAddress(address) == web3.utils.toChecksumAddress(this.connection.address);
    },
    calResponseRate(item) {
      if (!item) return 0;
      let totalBlock = item.minerMessage.minedNumber * 1 + item.minerMissRecordNumber * 1;
      let percent = (item.minerMessage.minedNumber / totalBlock) * 100;
      return percent.toFixed(2);
    },
    getMessage() {
      this.$emit('send', this.nodeList);
    },
    async getJailList() {
      this.jailLoading = true;
      let url = this.apiUrl.graph;

      client = new ApolloClient({
        uri: `${url}chainMonitorBetterPos`,
        cache: new InMemoryCache()
      });

      const getJailInfos = gql`
        query jailRecords {
          jailRecords(where:{unjailedBlockNumber:null}) {
            id
            address
            blockNumber
            timestamp
            unjailedBlockNumber
            unjailedTimestamp
            unjailedForfeit
          }
        }
      `;
      const { data: { jailRecords } } = await client.query({
            query: getJailInfos,
            fetchPolicy: 'cache-first'
          });
          console.log(this.nodeList)
      this.jailList = jailRecords;
      let jailListMap = jailRecords.map((item) => {
        return this.stakeManageInstance.methods.getVotingPowerByAddress(item.address).call();
      });
      let validatorPower = await Promise.all(jailListMap);
      let list = []
      for(let i = 0; i < validatorPower.length; i++){
       let power = web3.utils.fromWei(web3.utils.toBN(validatorPower[i]))
       let detail = find(this.detailsList, (items) => web3.utils.toChecksumAddress(items.nodeAddress) == web3.utils.toChecksumAddress(this.jailList[i].address));
        let nodeName,logo;
        if (detail) {
          nodeName = detail.nodeName;
          logo = detail.logo;
        }
       list.push({
        ...this.jailList[i],
        power,
        nodeName,
        logo
       })
      }
      

      this.jailList = list;
      console.log(this.jailList)
      this.unJailAmount = web3.utils.fromWei(web3.utils.toBN(this.unJailPayAmount));
      this.jailLoading = false;
    },
    getPayFine() {
      this.payFineDialog = true;
    },
    closePayFine() {
      this.payFineDialog = false;
    },
    async submitPay() {
      try {
        this.unjailLoading = true;
        const unjailRes = await this.stakeManageInstance.methods.unjail().send(
          { from: this.connection.address,
            value: web3.utils.numberToHex(this.unJailPayAmount)
          }
        );
        if (unjailRes.transactionHash) {
          console.log(unjailRes);
          this.addTx({
            tx: {
              txid: unjailRes.transactionHash,
              type: 'unjail',
              status: 'PENDING',
              data: {
                amount: web3.utils.fromWei(web3.utils.toBN(this.unJailPayAmount)),
                symbol: 'REI',
              },
              timestamp: new Date().getTime()
            }
          });
          this.payFineDialog = false;
        }
      } catch (e) {
        this.payFineDialog = false;
        console.log(e);
        this.$dialog.notify.warning(e.message);
      }
      this.unjailLoading = false;
    },
    getJailRecords(value){
      this.$router.push({
        name: 'StakeInfo',
        query: {
          id: value,
        }
      });
    }
  },

  computed: {
    ...mapGetters({
      dark: 'dark',
      connection: 'connection',
      apiUrl: 'apiUrl'
    }),
    listenChange() {
      const { stake, days } = this;
      return {
        stake,
        days
      };
    }
  }
};
</script>

<style scoped lang="scss">
.ma-dialog {
  padding: 16px;
}
.theme--dark .v-pagination .v-pagination__item {
  background-color: #393560;
}
.v-btn.v-btn--outlined.v-btn--text {
  border: none;
}
.dialog-night {
  background-color: #595777;
  padding: 20px 0;
}
.dialog-daytime {
  background-color: #fff;
  padding: 20px 0;
}
.theme--dark.v-list {
  background-color: #595777;
}
.vote-list {
  position: relative;
  .v-tab-left {
    margin-left: 0 !important;
  }
}
.get-reward.v-btn.v-btn--has-bg {
  background-color: #fc884a;
  color: #fff !important;
}
.btn-div {
  position: absolute;
  right: 0;
  top: 0;
  margin-top: 12px;
  margin-right: 12px;
  color: #fff;
}
.font-btn.v-btn.v-btn--has-bg {
  color: #fff;
  background: #6979f8;
}
.unstake_btn.theme--dark.v-btn.v-btn--has-bg {
  background: #595777;
}
.cancel-btn {
  color: '#868e9e';
}
.card-tab {
  display: flex;
  flex-direction: row;
  background-color: transparent;
}
.v-tab {
  text-transform: none !important;
}
.active {
  // width: 30px;
  // height: 20px;
  line-height: 20px;
  background-color: #43c06d;
  border-radius: 15px;
  margin-left: 8px;
  padding: 2px 8px;
  color: #fff;
}
.not-active {
  // width: 30px;
  // height: 20px;
  line-height: 20px;
  background-color: #5f82ad;
  border-radius: 10px;
  margin-left: 2px;
  padding: 2px 10px;
  color: #fff;
}
.v-application .text-center {
  text-align: right !important;
}
.my-voted-validator {
  width: 120px;
  border-radius: 30px;
  margin: 1.5rem;
}
.right-outline {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 12px;
  // padding-top:16px;
}
.theme--dark.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset {
  height: 42px !important;
}
.select-card {
  border: none;
  background-color: transparent;
  width: 130px;
}
.select-second {
  width: 90px;
  margin-right: 12px;
}
.d-select {
  margin-left: 20px;
  margin-top: 12px;
  width: 120px;
}
.number {
  width: 80px;
}
.theme--dark.v-data-table {
  background-color: transparent;
}
.v-pagination {
  display: inline-flex !important;
  justify-content: flex-end !important;
}
.v-btn {
  text-transform: none !important;
}
.btn-radius {
  border-radius: 4px;
}
.logo-image {
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  border-radius: 20px;
}
.nodeName {
  margin: 0 8px;
  cursor: pointer;
}
.name-hover:hover {
  color: #4856c0;
}
.theme--dark.v-tabs-items {
  background-color: transparent;
}
.dialog-validator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .dialog-title {
    // margin-left: 12px;
  }
  .close-btn {
    margin-right: 16px;
    padding: 0;
    background-color: transparent;
    cursor: pointer;
  }
}
.subheading {
  height: 30px;
  margin-top: 20px;
  // margin-left:8px;
}
.theme--light.v-input input,
.theme--light.v-input textarea {
  color: #6979f8 !important;
}
.from-voting {
  display: flex;
  justify-content: space-between;
  padding-bottom: 0;
  // padding-top:8;
  .input-title {
    color: #868e9e;
    margin-top: 12px;
    width: 80px;
    text-align: center;
    height: 40px;
  }
}
.text-body {
  text-align: right;
  margin-bottom: 12px;
}
.font-color {
  color: #868e9e;
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
.text-filed {
  width: 360px;
}
.text-bod {
  text-align: right;
}
.iphone-btn {
  // margin-top:20px;
  // border-top:1px solid grey;
  padding: 20px;
  color: #868e9e;
}
.calculation-card {
  padding: 40px;
}
.calculation-card.theme--dark.v-sheet {
  background-color: #595777;
}
.font-grey {
  font-size: 14px;
  color: #7e7e7e;
}
.stake-text {
  font-size: 32px;
  font-weight: bolder;
}
.stake-right {
  .slider-stake {
    background-color: transparent;
  }
}
.light-amount {
  color: #6979f8;
  font-weight: bolder !important;
  font-size: 22px;
}
.dark-amount {
  color: #fff;
  font-weight: bolder !important;
  font-size: 22px;
}
.slider-num {
  padding: 0 12px;
  margin-top: -40px;
}
.select-rate {
  margin-top: 20px;
}
.font-blue {
  font-size: 24px;
  font-weight: bolder;
  color: #2116e5;
}
.close-dialog {
  cursor: pointer;
}
.item-list {
  color: black;
}
.theme--dark.validator-info {
  padding: 20px;
  background-color: #595777;
  .v-btn.v-btn--has-bg {
    background-color: transparent;
    padding-left: 0 !important;
  }
}
.theme--light.validator-info {
  padding: 20px;
  .v-btn.v-btn--has-bg {
    background-color: transparent;
  }
}
.info-item {
  padding: 0;
  h5 {
    padding-left: 28px;
  }
}
.info-icon {
  margin-right: 8px;
}
.title-info {
  margin: 10px 0 0 1px;
}
.light-nodes {
  background-color: #f5f9fd;
}
.dark-nodes {
  background-color: #4c4a68;
  // opacity: 0.5;
}
.btn-opacity {
  opacity: 0;
  cursor: default;
}
.node-details {
  padding-top: 12px;
  border-radius: 8px;
  border: none;
  .node-name {
    margin-top: 10px;
    margin-left: 20px;
  }
  .calculate-address {
    margin-top: 12px;
    margin-left: 34px;
    margin-bottom: 24px;
  }
  .theme--dark.v-btn.v-btn--has-bg {
    background-color: transparent;
  }
}
.logoWrap {
  display: inline;
}

.on-jail {
  font-size: 12px;
  color: #868e9e;
  padding: 2px 12px;
  border-radius: 12px;
  margin-left: 8px;
}
.pay-tips {
  padding: 20px;
  margin: 10px 20px;
  border: none;
}
.dark-pay {
  background-color: #393560;
}
.light-pay {
  background-color: #ffedd9;
}
.pay-btn {
  margin: 28px 20px;
}
.jail-head:hover{
  cursor: pointer;
}
@keyframes metronome-example {
  from {
    transform: scale(0.5);
  }

  to {
    transform: scale(1);
  }
}
@media screen and (max-width: 900px) {
  .vote-list {
    position: static !important;
    display: flex;
    flex-direction: column;
  }
  .theme--light .btn-div {
    text-align: left !important;
    padding: 4px 0;
    border-top: 1px solid rgb(235, 235, 235);
  }
  .theme--dark .btn-div {
    text-align: left !important;
    padding: 4px 0;
    border-top: 1px solid rgb(50, 48, 69);
  }
  .btn-div {
    position: static;
  }
  .v-btn {
    border: none;
  }
  .my-voted-validator {
    width: auto;
    margin: 20px 16px;
  }
  .right-outline {
    display: flex;
    flex-direction: row;
    justify-content: flex-start !important;
    margin-top: -16px;
    padding: 0;
  }
  .get-reward {
    width: 196px !important;
    margin-top: 12px;
  }
  .dialog-validator {
    padding-left: 12px;
    .v-card__subtitle,
    .v-card__text,
    .v-card__title {
      padding: 0;
    }
    .v-card__title {
      font-size: 1rem;
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
  .select-card {
    width: 46%;
    margin-top: -10px;
    display: flex;
    // background: red;
    justify-content: space-between !important;
  }
  .select-second {
    margin-left: 12px;
    // background: blue($color: #000000);
  }
  .vote-select {
    margin-left: 18px;
  }
  .d-select {
    margin-left: 0;
    width: 80%;
  }
  .text-filed {
    width: 320px !important;
  }
  .card-tab {
    width: 100% !important;
  }
  .v-tabs:not(.v-tabs--vertical) .v-tab {
    width: 50%;
    padding-left: 12px;
    padding-right: 12px;
  }
  .title-info {
    margin: 12px 0;
  }
}
</style>
