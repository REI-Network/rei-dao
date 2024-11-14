<template>
  <v-container class="stake_background">
    <v-card class="Introduction">
      <v-row justify="space-between">
        <v-col cols="12" md="8">
          <h2>Introduction to REI Governance</h2>
          <div class="introduction-text">$REI holders are responsible for managing the REI network, including adjusting the verification node incentive parameters, daily free gas parameters, etc., and improving the governance process itself. Anyone can become a $REI holder, and all are welcome to join us in creating the future of the REI network.</div>
          <v-btn color="#6979F8" class="introduction-btn" height="44" href="https://docs.rei.network/rei-dao/guides/governance" target="_blank"> Learn More > </v-btn>
        </v-col>
        <v-col cols="12" md="4" align-self="end">
          <v-img class="img" style="float: right" src="../assets/images/Introduction.png" width="336" height="209" />
        </v-col>
      </v-row>
    </v-card>
    <v-card class="Introduction" style="margin: 40px 0">
      <h2 class="title">On-Chain Parameter Governance</h2>
      <v-row>
        <v-col cols="12" sm="6">
          <v-card class="step-content elevation-0 committee">
            <v-row no-gutters align="center">
              <div class="img-size">
                <v-img v-if="!dark" src="../assets/images/organization.png" width="50" />
                <v-img v-else src="../assets/images/organization-dark.png" width="50" />
              </div>
              <a target="_blank" href="https://forum.rei.network/t/what-is-the-on-chain-parameter-governance/134">What is the on-chain parameter governance?</a>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card class="step-content elevation-0 committee">
            <v-row no-gutters align="center" style="flex-wrap:nowrap">
              <div class="img-size">
                <v-img v-if="!dark" src="../assets/images/apply.png" width="50" />
                <v-img v-else src="../assets/images/apply-dark.png" width="50" />
              </div>
              <a target="_blank" href="https://forum.rei.network/t/how-to-initiate-on-chain-parameter-governance-changes/135">How to initiate on-chain parameter governance changes?</a>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="list-title" align="center" justify="space-between">
        <h2 class="title">On-Chain Parameter</h2>
        <!-- <div class="font-grey">Participate in on-chain proposal governance ></div> -->
      </v-row>
      <v-row justify="start" align="start">
        <v-col cols="12" sm="4" v-for="(item, index) in parameterList" :key="index">
          <v-card :class="dark ? 'chip-dark chain-list' : 'chip-light elevation-0 chain-list'">
            <v-row justify="space-between">
              <v-col cols="12" align-self="start" md="6" style="padding: 0 0 0 12px">
                <div class="font-grey">Parameter</div>
                <div class="parameter-data">
                  <!-- <div style="margin-bottom:8px;">{{ item.parameter }} </div> -->
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="param-name" v-bind="attrs" v-on="on">
                        <span class="overflow" style="margin-bottom: 16px">{{ item.parameter }} </span>
                      </v-btn>
                    </template>
                    <span>
                      {{ item.parameter }}
                    </span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon size="14" style="margin-bottom: 16px">mdi-help-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>
                      {{ item.description }}
                    </span>
                  </v-tooltip>
                </div>
              </v-col>
              <v-col cols="12" align-self="start" md="3" style="padding: 0">
                <div class="font-grey">Default</div>
                <v-tooltip top v-if="index == 5 || index == 9">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="param-name" v-bind="attrs" v-on="on">
                      <span class="overflow" style="width: 68px">{{ item.default }}
                        <v-skeleton-loader
                          v-if="!item.default"
                          height="20"
                          width="50"
                          type="text"
                        ></v-skeleton-loader>
                      </span>
                    </v-btn>
                  </template>
                  <span>
                    {{ item.default }}
                  </span>
                </v-tooltip>
                <div class="parameter-data item-default" v-else>{{ item.default }}
                  <v-skeleton-loader
                    v-if="!item.default"
                    height="20"
                    width="50"
                    type="text"
                  ></v-skeleton-loader>
                </div>
              </v-col>
              <!-- <v-col cols="12" align-self="start" md="3" style="padding: 0">
                <div class="font-grey">Interval</div>
                <div class="parameter-data">{{ item.interval }}</div>
              </v-col> -->
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="Introduction" style="margin-top: 40px">
      <h2 class="title">REI DAO Governance Committee</h2>
      <v-row>
        <v-col cols="12" sm="6">
          <v-card class="step-content elevation-0 committee">
            <v-row no-gutters align="center">
              <div class="img-size">
                <v-img v-if="!dark" src="../assets/images/organization.png" width="50" />
                <v-img v-else src="../assets/images/organization-dark.png" width="50" />
              </div>
              <a target="_blank" href="https://medium.com/gxchain-project/committee-of-governance-applications-now-open-an-opportunity-to-transform-rei-network-d46b46cc9ae1">Committee of Governance Applications Now Open!</a>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card class="step-content elevation-0 committee">
            <v-row no-gutters align="center">
              <div class="img-size">
                <v-img v-if="!dark" src="../assets/images/apply.png" width="50" />
                <v-img v-else src="../assets/images/apply-dark.png" width="50" />
              </div>
              <a target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSeSHh8YwQnf27HLeAQ_GKT_mHnF3GNxaaXJY6Z0GOTBRlPx7Q/viewform">REI Network Committee registration ></a>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <h2 class="members-title title">Governance Committee Members<span class="progress">In progress</span></h2>
      <v-row justify="space-between">
        <v-col align-self="center" v-for="n in 10" :key="n">
          <v-card class="step-content elevation-0 members">
            <img src="../assets/images/active.png" width="72" />
            <h4>Daviod</h4>
            <span class="indonesia">Indonesia</span>
            <v-row justify="space-between" class="icon-img" no-gutters>
              <img src="../assets/images/telegram.png" width="24" />
              <img src="../assets/images/twitter 2.png" width="24" />
              <img src="../assets/images/discord 2.png" width="24" />
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="Introduction" style="margin-top: 40px">
      <h2 class="title">Governance Process</h2>
      <v-row class="process">
        <v-col cols="12" v-if="this.width > 900">
          <v-tabs vertical hide-slider>
            <div class="step">
              <v-tab class="step-tab">
                <div class="step-left process_step">
                  <span class="iconfont">&#xe60b;</span>
                  <div>STEP 1: Community consensus</div>
                </div>
                <div class="triangle"></div>
              </v-tab>
              <v-tab class="step-tab">
                <div class="step-left process_step">
                  <span class="iconfont">&#xe617;</span>
                  STEP 2: Consensus check
                </div>
                <div class="triangle"></div>
              </v-tab>
              <v-tab class="step-tab">
                <div class="step-left process_step">
                  <span class="iconfont">&#xe60a;</span>
                  STEP 3: Proposal review
                </div>
                <div class="triangle"></div>
              </v-tab>
              <v-tab class="step-tab">
                <div class="step-left process_step">
                  <span class="iconfont">&#xe609;</span>
                  STEP 4: Snapshot voting
                </div>
                <div class="triangle"></div>
              </v-tab>

              <v-tab class="step-tab">
                <div class="step-left process_step">
                  <span class="iconfont">&#xe608;</span>
                  STEP 5: Security mechanisms
                </div>
                <div class="triangle"></div>
              </v-tab>
            </div>
            <v-tab-item>
              <v-card flat class="step-content">
                <h2>Community Consensus</h2>
                <v-card-text> The first step in participating in governance is to initiate a proposal that will benefit the REI network and build influence in the community so that more people will agree with your proposal. Get in touch with the REI Network Discord administrator and discuss your proposal on TG, forums, community calls and Twitter space. </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat class="step-content">
                <h2>Consensus check</h2>
                <v-card-text> You will need to create a forum proposal thread in the Consensus Check section while adhering to the forum rules, use your influence to let more community members know about your idea, create a poll in the proposal feedback, and receive timely community feedback to get the final proposal. </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat class="step-content">
                <h2>Proposal review</h2>
                <v-card-text> Proposals will be reviewed by REI DAO Council. </v-card-text>
                <h4>What is the REI DAO Council?</h4>
                <v-card-text> The Council is composed of 21 deliberators, and the first members will be invited from nodes, community members, pioneers, and project parties who have contributed to REI Network before, and later will be decided by the Council itself. The discussion process will be moderated and recorded by the council members in three sessions: motion presentation, motion review, and motion vote. </v-card-text>
                <a style="margin-left: 20px" href="https://forum.rei.network/t/introducing-the-governance-committee/41" target="_blank">Learn more ></a>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat class="step-content">
                <h2>Snapshot voting</h2>
                <v-card-text> Provide voting tools and multiple voting strategies for surveying community sentiment on specific proposals or parameters, allowing every coin holder to participate more fairly in community governance. </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat class="step-content">
                <h2>Security mechanisms</h2>
                <v-card-text> The governance security mechanism mitigates or eliminates the negative impact of harmful proposals on the REI Network or REI DAO community by setting a time delay before formal implementation of the proposal. </v-card-text>
                <v-card-text style="padding-top: 0"> New code is reserved for a 24-hour public notice period before deployment to REI Network, during which time all community members can review the code to confirm the security of REI Network. If the code is reviewed and is deemed to have any negative impact on REI Network, the deployment will be immediately cancelled. </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-col>
        <v-expansion-panels accordion v-else class="process_step elevation-0">
          <v-expansion-panel :class="dark ? 'expansion' : ''">
            <v-expansion-panel-header>STEP 1: Community consensus</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card flat class="step-content">
                <!-- <h2>Community Consensus</h2> -->
                <v-card-text> The first step in participating in governance is to initiate a proposal that will benefit the REI network and build influence in the community so that more people will agree with your proposal. Get in touch with the REI Network Discord administrator and discuss your proposal on TG, forums, community calls and Twitter space. </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel :class="dark ? 'expansion' : ''">
            <v-expansion-panel-header>STEP 2: Consensus check</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card flat class="step-content">
                <!-- <h2>Consensus check</h2> -->
                <v-card-text> You will need to create a forum proposal thread in the Consensus Check section while adhering to the forum rules, use your influence to let more community members know about your idea, create a poll in the proposal feedback, and receive timely community feedback to get the final proposal. </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel :class="dark ? 'expansion' : ''">
            <v-expansion-panel-header>STEP 3: Proposal review</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card flat class="step-content">
                <!-- <h2>proposal review</h2> -->
                <v-card-text> Proposals will be reviewed by REI DAO Council. </v-card-text>
                <h4>What is the REI DAO Council?</h4>
                <v-card-text> The Council is composed of 21 deliberators, and the first members will be invited from nodes, community members, pioneers, and project parties who have contributed to REI Network before, and later will be decided by the Council itself. The discussion process will be moderated and recorded by the council members in three sessions: motion presentation, motion review, and motion vote. </v-card-text>
                <a style="margin-left: 20px" href="https://forum.rei.network/t/introducing-the-governance-committee/41" target="_blank">Learn more ></a>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel :class="dark ? 'expansion' : ''">
            <v-expansion-panel-header>STEP 4: Snapshot voting</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card flat class="step-content">
                <!-- <h2>voting off-chain</h2> -->
                <v-card-text>
                  <v-card-text> Provide voting tools and multiple voting strategies for surveying community sentiment on specific proposals or parameters, allowing every coin holder to participate more fairly in community governance. </v-card-text>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel :class="dark ? 'expansion' : ''">
            <v-expansion-panel-header>STEP 5: Security mechanisms</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card flat class="step-content">
                <!-- <h2>Security mechanisms</h2> -->
                <v-card-text> The governance security mechanism mitigates or eliminates the negative impact of harmful proposals on the REI Network or REI DAO community by setting a time delay before formal implementation of the proposal. </v-card-text>
                <v-card-text> New code is reserved for a 24-hour public notice period before deployment to REI Network, during which time all community members can review the code to confirm the security of REI Network. If the code is reviewed and is deemed to have any negative impact on REI Network, the deployment will be immediately cancelled. </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
      <h2 class="title">Governance Tools</h2>
      <v-row class="tools" justify="space-between">
        <v-col cols="12" sm="6">
          <v-card outlined class="tool">
            <v-img v-if="dark" class="img" src="../assets/images/discord-dark.png" width="120" height="120" />
            <v-img v-else class="img" src="../assets/images/Discord.png" width="120" height="120" />
            <div class="right-content">
              <v-list three-line>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title> <h3>Discord</h3></v-list-item-title>
                    <v-list-item-subtitle class="tools-text"> Join our discord, let us know your idea, build influence in the community, and talk to our community governance coordinator. </v-list-item-subtitle>
                    <a href="https://discord.com/invite/zhwWkXYtJt" target="_blank"><div class="tools-link">Join REI DAO Discord ></div></a>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
          <v-card outlined class="tool">
            <v-img v-if="dark" class="img" src="../assets/images/forum-dark.png" width="120" height="120" />
            <v-img v-else class="img" src="../assets/images/Forum.png" width="120" height="120" />
            <div class="right-content">
              <v-list three-line>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title> <h3>Snapshot</h3></v-list-item-title>
                    <v-list-item-subtitle class="tools-text"> Participate and follow the latest developments of the proposal, express your opinion and exercise your right to vote </v-list-item-subtitle>
                    <a href="https://snapshot.org/#/rei-network.eth" target="_blank"><div class="tools-link">View All Proposals On Snapshot ></div></a>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card outlined class="tool tool-forum">
            <v-img v-if="dark" class="img" src="../assets/images/snapshot-dark.png" width="120" height="120" />
            <v-img v-else class="img" src="../assets/images/Snapshot.png" width="120" height="120" />
            <div class="right-content">
              <v-list three-line>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title> <h3>Governance Forum</h3></v-list-item-title>
                    <v-list-item-subtitle class="tools-text"> Proposal discussion, the venue for debate. Let everyone hear your ideas and interact with the community. </v-list-item-subtitle>
                    <a href="https://forum.rei.network/" target="_blank"><div class="tools-link">Enter The Forum ></div></a>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import abiConfig from '../abis/abiConfig';
import filters from '../filters';

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT

/* eslint-disable no-undef */
export default {
  filters,
  data() {
    return {
      width: '',
      stepDialog1: false,
      parameterList: [
        {
          parameter: 'UnstakeDelay',
          description: 'The lock time required to withdraw the staked',
          default: '',
          interval: '6%~10%'
        },
        {
          parameter: 'WithdrawDelay',
          description: 'The lock time required to withdraw the staked to get free gas',
          default: '',
          interval: '6%~10%'
        },
        {
          parameter: 'CommissionRateInterval',
          description: 'Validator setting allocation ratio interval',
          default: '',
          interval: '6%~10%'
        },
        {
          parameter: 'FeePoolInterval',
          description: ' 	The interval for reward distribution by the gas pool',
          default: '',
          interval: '6%~10%'
        },
        {
          parameter: 'Forfeit',
          description: ' The amount of penalty required for the validator to come out of the jail',
          default: '',
          interval: '6%~10%'
        },
        {
          parameter: 'JailThreshold',
          description: 'The block loss threshold for being locked in the jail',
          default: '',
          interval: '6%~10%'
        },
        {
          parameter: 'MaxValidatorsCount',
          description: 'Maximum number of validators',
          default: '',
          interval: '6%~10%'
        },

        {
          parameter: 'MinValidatorsCount',
          description: 'Minimum number of validators',
          default: '',
          interval: '6%~10%'
        },
        {
          parameter: 'MinTotalLockedAmount',
          description: '	Total minimum staked',
          default: '',
          interval: '6%~10%'
        },
        {
          parameter: 'MinerReward',
          description: 'Miner rewards',
          default: '',
          interval: '6%~10%'
        },
        {
          parameter: 'DailyFee',
          description: 'The total amount of free gas per day',
          default: '',
          interval: '6%~10%'
        },
        {
          parameter: 'MinerRewardFactor',
          description: 'Proportion of rewards for block producers',
          default: '',
          interval: '6%~10%'
        }
      ]
    };
  },
  watch: {},
  mounted() {
    this.windowWidth();
    this.init();
  },
  computed: {
    ...mapGetters({
      connection: 'connection',
      apiUrl: 'apiUrl',
      dark: 'dark'
    })
  },
  methods: {
    ...mapActions({
      addTx: 'addTx'
    }),
    async init() {
        let contract = new web3.eth.Contract(abiConfig,config_contract);
        // get parameter from contract
        let unstakeDelay = await contract.methods.unstakeDelay().call();
        let withdrawDelay = await contract.methods.withdrawDelay().call();
        let setCommissionRateInterval = await contract.methods.setCommissionRateInterval().call();
        let feePoolInterval = await contract.methods.feePoolInterval().call();
        let forfeit = await contract.methods.forfeit().call();
        let jailThreshold = await contract.methods.jailThreshold().call();
        let maxValidatorsCount = await contract.methods.maxValidatorsCount().call();
        let minValidatorsCount = await contract.methods.minValidatorsCount().call();
        let minTotalLockedAmount = await contract.methods.minTotalLockedAmount().call();
        let minerReward = await contract.methods.minerReward().call();
        let dailyFee = await contract.methods.dailyFee().call();
        let minerRewardFactor = await contract.methods.minerRewardFactor().call();
        // set and format parameter to parameterList
        this.parameterList[0].default = unstakeDelay/86400 + ' Days';
        this.parameterList[1].default = withdrawDelay/86400 + ' Days';
        this.parameterList[2].default = setCommissionRateInterval/86400 +' Days';
        this.parameterList[3].default = feePoolInterval/86400 +' Days';
        this.parameterList[4].default = forfeit/1e18 +' REI';
        this.parameterList[5].default = jailThreshold +' every 21,600 blocks';
        this.parameterList[6].default = maxValidatorsCount;
        this.parameterList[7].default = minValidatorsCount;
        this.parameterList[8].default = minTotalLockedAmount/1e24 +' million';
        this.parameterList[9].default = minerReward/1e18 +' REI';
        this.parameterList[10].default = dailyFee/1e18 +' REI';
        this.parameterList[11].default = minerRewardFactor +' %';
    },
    stepClick1() {
      this.stepDialog1 = true;
    },
    cancelStepClick1() {
      this.stepDialog1 = false;
    },
    windowWidth() {
      const that = this;
      that.width = window.innerWidth;
    }
  }
};
</script>

<style scoped lang="scss">
.v-tab {
  display: flex;
  justify-content: flex-start;
  padding-left: 0 !important;
  text-transform: none !important;
  height: 60px !important;
}
a:hover {
  text-decoration: underline;
  color: #6979f8;
}
.step-left {
  padding-left: 16px;
  height: 100%;
  line-height: 60px;
  width: 300px;
  text-align: left;
  display: flex;
  align-items: center;
}
.iconfont {
  font-size: 24px;
  margin-right: 12px;
}
.v-tab--active {
  .step-left {
    color: #fff;
    background-color: #6979f8 !important;
  }
  .v-icon {
    color: #fff;
  }
  .triangle {
    width: 0;
    height: 0;
    transform: rotate(135deg);
    border-width: 21.6px;
    border-color: #6979f8 transparent transparent #6979f8;
    border-style: solid;
    border-top-left-radius: 6px;
    margin-left: -22px;
  }
}
.right-arrow {
  display: flex;
}
.theme--light.v-tabs-items {
  background: #f7f8ff !important;
}
.font-grey {
  color: #868e9e;
}
.Introduction {
  padding: 30px 20px;
  .introduction-text {
    margin: 20px 0;
    font-size: 14px;
    color: #868e9e;
    line-height: 28px;
  }
  .introduction-btn {
    color: #fff;
    text-transform: none !important;
  }
  .img {
    border-radius: 4px;
  }
  .title {
    font-size: 24px;
    font-weight: bold;
  }
  .parameter {
    padding: 20px;
    margin-top: 20px;
    border-radius: 8px;
    height: 180px;
    .more {
      padding: 20px 0;
    }
  }
  .step-dialog {
    padding: 28px;
  }
  .step-content {
    margin-top: 28px;
    a{
      color: #868e9e !important;
    }
    a:hover{
      color:#6979f8 !important;
    }
  }
  .v-list-item {
    padding: 0;
  }
  .chip-dark {
    background-color: #252243;
  }
  .chip-light {
    background-color: #f5f5f7;
  }
  .chain-list {
    border-radius: 8px;
    padding: 28px 12px;
  }
  .parameter-data {
    font-size: 14px;
    font-weight: bold;
    margin-top: 6px;
    display: flex;
    align-items: flex-end;
  }
  .item-default {
    width: 72px;
  }
  .param-name {
    .overflow {
      // width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .param-name.v-btn {
    font-weight: 700;
    text-transform: inherit;
    text-align: left;
    padding: 0;
  }
  .list-title {
    margin-top: 40px;
    padding: 0 12px;
  }
  .members-title {
    margin-top: 40px;
  }
  .process {
    margin-top: 30px;
    .step {
      height: 300px;
      border-radius: 8px;
    }
    .theme--light.step {
      background: #f7f8ff;
    }
    .theme--dark.step {
      background: #f7f8ff !important;
    }
    .step-content {
      height: 350px;
      padding-top: 20px;
      padding-left: 20px;
      h2 {
        padding-left: 12px;
      }
      h4 {
        padding-left: 12px;
      }
    }
  }
  .theme--light.step-content {
    background-color: #f7f8ff;
  }
  .theme--dark.step-content {
    background: #252243;
  }
  a {
    color: #6979f8;
  }
  .tools {
    .tool {
      margin-top: 28px;
      display: flex;
      align-items: center;
      .img {
        margin: 20px;
      }
      .tools-text {
        font-size: 14px;
        color: #868e9e;
        line-height: 20px;
        margin-top: 20px;
      }
      .right-content {
        margin: 15px;
      }
      .tools-link {
        font-size: 14px;
        color: #6979f8;
        line-height: 20px;
        margin-top: 12px;
      }
    }
  }
}
.expansion {
  background-color: #100d22 !important;
  opacity: 0.6;
}
.committee {
  padding: 20px;
  margin-top: 20px;
  //   height: 180px;
  .img-size {
    width: 75px;
    height: 75px;
    text-align: center;
    padding-top: 10px;
  }
}
.members {
  filter: blur(4px);
  width: 184px !important;
  height: 220px;
  margin-top: 20px;
  padding: 20px;
  text-align: center;
  .indonesia {
    font-size: 10px;
    color: #ff8c41;
    border: 1px #ff8c41 solid;
    padding: 0 10px;
    border-radius: 10px;
  }
  .icon-img {
    margin-top: 20px;
  }
}
.progress{
  background-color: #FAAD5D;
  color:#FFF;
  font-weight: normal;
  padding: 4px 12px;
  font-size: 14px;
  border-radius: 4px;
  margin-left: 12px
}
@media screen and (max-width: 900px) {
  .v-list-item {
    padding: 0 !important;
  }
  .step-content {
    height: auto !important;
    padding: 0 !important;
  }
  .title {
    margin-top: 40px !important;
  }
  .tools {
    .img {
      width: 80px !important;
      height: 80px !important;
      margin: 32px 8px !important;
    }
    .tools-text {
      margin-top: 8px !important;
    }
    .tools-link {
      margin-top: 8px !important;
    }
  }
  .right-content {
    margin: 0 8px 0 0 !important;
  }
  .tool-forum {
    margin-top: 8px !important;
  }
}
</style>
