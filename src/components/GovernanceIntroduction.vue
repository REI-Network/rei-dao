<template>
  <v-container class="stake_background">
    <v-card class="Introduction" style="margin-bottom: 40px">
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
    <v-card class="Introduction" style="margin-bottom: 40px">
      <h2 class="title">On-Chain Parameter Governance</h2>
      <v-row justify="space-between">
        <v-col cols="12" sm="4">
          <v-card :class="dark ? 'chip-dark parameter' : 'chip-light elevation-0 parameter'">
            <v-row align="center">
              <v-col cols="12" md="10">
                <h4>What Is The On-Chain Parameter Governance?</h4>
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-subtitle class="font-grey">REI DAO On-Chain Parameterized Governance Allows Community Members To Change REI</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="12" md="2" class="font-grey more"> More> </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card :class="dark ? 'chip-dark parameter' : 'chip-light elevation-0 parameter'"> 
            <v-row align="center">
              <v-col cols="12" md="10">
                <h4>WHow do community users initiate on-chain parameter governance?</h4>
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-subtitle class="font-grey">REI DAO on-chain parameterized governance allows community members to change REI...</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="12" md="2" class="font-grey more"> More> </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card :class="dark ? 'chip-dark parameter' : 'chip-light elevation-0 parameter'"> 
            <v-row align="center">
              <v-col cols="12" md="10">
                <h4>Why launch the on-chain parameter governance model?</h4>
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-subtitle class="font-grey">REI DAO on-chain parameterized governance allows community members to change REI...</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="12" md="2" class="font-grey more"> More> </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
       <v-row class="list-title"  align="center" justify="space-between">
        <h2 class="title">List Of On-Chain Parameter</h2>
        <div class="font-grey">Participate in on-chain proposal governance ></div>
       </v-row>
       <v-row justify="space-between" align="start">
         <v-col cols="12" sm="4" v-for="(item, index) in list" :key="index">
          <v-card :class="dark ? 'chip-dark chain-list' : 'chip-light elevation-0 chain-list'"> 
            <v-row justify="space-between">
              <v-col cols="12" align-self="start" md="4"  style="padding:0;">
                <div class="font-grey">Parameter</div>
                <h4> {{item.parameter}} </h4>
              </v-col>
              <v-col cols="12" align-self="start" md="5" style="padding:0;">
                <div class="font-grey">Default parameter</div>
                <h4>{{ item.default }}</h4>
              </v-col>
              <v-col cols="12" align-self="start" md="3" style="padding:0;">
                <div class="font-grey">Interval</div>
                <h4>{{ item.interval }}</h4>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
       </v-row>
    </v-card>
    <v-card class="Introduction">
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
import filters from '../filters';
/* eslint-disable no-undef */
export default {
  filters,
  data() {
    return {
      width: '',
      list:[
        {
            parameter:"Voting threshold",
            default:"6%",
            interval:"6%~10%"
        },
        {
            parameter:"Voting threshold",
            default:"6%",
            interval:"6%~10%"
        },
        {
            parameter:"Voting threshold",
            default:"6%",
            interval:"6%~10%"
        },
        {
            parameter:"Voting threshold",
            default:"6%",
            interval:"6%~10%"
        },
        {
            parameter:"Voting threshold",
            default:"6%",
            interval:"6%~10%"
        },
        {
            parameter:"Voting threshold",
            default:"6%",
            interval:"6%~10%"
        },
        {
            parameter:"Voting threshold",
            default:"6%",
            interval:"6%~10%"
        },
        {
            parameter:"Voting threshold",
            default:"6%",
            interval:"6%~10%"
        },
        {
            parameter:"Voting threshold",
            default:"6%",
            interval:"6%~10%"
        },
      ],
    };
  },
  watch: {},
  mounted() {
    this.windowWidth();
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
.font-grey {
  font-size: 14px;
  color: #868e9e;
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
.Introduction {
  padding: 30px 20px;
}
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
.parameter {
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  height: 180px;
  .more {
    padding: 20px 0;
  }
}
.v-list-item{
    padding: 0;
}
.chip-dark {
  background-color: #13112b;
}
.chip-light {
  background-color: #f5f5f7;
}
.chain-list{
    // margin-top: 20px;
    border-radius: 8px;
    padding:20px 12px;
}
.list-title{
    margin-top: 40px;
    padding: 0 12px;
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
  .theme--light.step-content {
    background-color: #f7f8ff;
  }
  .theme--dark.step-content {
    background: #5c5a7a;
  }
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
.expansion {
  background-color: #100d22 !important;
  opacity: 0.6;
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
