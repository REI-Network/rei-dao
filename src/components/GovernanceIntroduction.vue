<template>
   <v-container class="stake_background">
     <v-card class="Introduction">
         <v-row justify="space-between">
            <v-col cols="12" md="8">
                <h2>Introduction To REI Governance</h2>
                <div class="introduction-text">$REI holders are responsible for managing the REI network, including adjusting the verification node incentive parameters, daily free gas parameters, etc., and improving the governance process itself. Anyone can become a $REI holder, and all are welcome to join us in creating the future of the REI network.
                </div>
                <v-btn 
                    color="#6979F8"
                    class="introduction-btn"
                    height="44"
                >
                    Learn More >
                </v-btn>
            </v-col>
            <v-col cols="12" md="4" align-self="end">
                <v-img class="img" style="float:right" src="../assets/images/Introduction.png" width="336" height="209"/>
            </v-col>
        </v-row>
        <h2 class="title">Governance Process</h2>
        <v-row class="process">
            <v-col cols="12" v-if="this.width>900">
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
                                 STEP 4: Voting
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
                                <v-card-text>
                                    The first step in participating in governance is to initiate a proposal that benefits the REI Network and building influence in the community will make more people agree with your proposal.
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card flat class="step-content">
                                <h2>Consensus check</h2>
                                <v-card-text>
                                    Once initial proposals are generated, further proposal discussions
                                     can be initiated in the REI forum, and the Council of Deliberators 
                                     will provide proposal templates, and all proposals will need to 
                                     follow the format of the proposal template for publication;
                                      the quality of the proposal and the logic behind it will be very 
                                      important, and is one of the main indicators for a proposal to make 
                                      it to the voting chain on the chain.
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card flat class="step-content">
                                <h2>proposal review</h2>
                                <v-card-text>
                                    The Council of Councillors has a very democratic and fair process of 
                                    proceedings, contains：
                                </v-card-text>
                                <h4>Motion Triage</h4>
                                <v-card-text>
                                    Adopted proposals are categorized, those involving on-chain parameter
                                     changes will generate REINetwork Improvement Proposals (GIP) and the 
                                     core team will initiate an on-chain vote; those not involving on-chain 
                                     parameter changes will be categorized as off-chain activity programs.
                                </v-card-text>
                                <h4>Review Process</h4>
                                <v-card-text>
                                    The process is: Eligibility Review - Format Review - Content Discussion - Voting. 
                                    Community proposals can only be qualified for on-chain voting if they 
                                    are approved by a majority vote.
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card flat class="step-content">
                                <h2>voting off-chain</h2>
                                <v-card-text>
                                    Provide voting tools and multiple voting strategies for surveying community
                                     sentiment on specific proposals or parameters, allowing every coin holder
                                      to participate more fairly in community governance.
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card flat class="step-content">
                                <h2>Security mechanisms</h2>
                                <v-card-text>
                                    The governance security mechanism mitigates or eliminates the negative
                                     impact of harmful proposals on the REI Network or REI DAO community by
                                      setting a time delay before formal implementation of the proposal.
                                </v-card-text>
                                <v-card-text>
                                    New code is reserved for a 24-hour public notice period before deployment
                                     to REI Network, during which time all community members can review the
                                      code to confirm the security of REI Network. If the code is reviewed 
                                      and is deemed to have any negative impact on REI Network, the deployment
                                       will be immediately cancelled.
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
            </v-col>
            <v-expansion-panels accordion v-else class="process_step">
                <v-expansion-panel>
                    <v-expansion-panel-header>STEP 1: Community consensus</v-expansion-panel-header>
                    <v-expansion-panel-content>
                         <v-card flat class="step-content">
                                <!-- <h2>Community Consensus</h2> -->
                                <v-card-text>
                                    The first step in participating in governance is to initiate a proposal that benefits the REI Network and building influence in the community will make more people agree with your proposal.
                                </v-card-text>
                            </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                 <v-expansion-panel>
                    <v-expansion-panel-header>STEP 2: Consensus check</v-expansion-panel-header>
                    <v-expansion-panel-content>
                         <v-card flat class="step-content">
                                <!-- <h2>Consensus check</h2> -->
                                <v-card-text>
                                    Once initial proposals are generated, further proposal discussions
                                     can be initiated in the REI forum, and the Council of Deliberators 
                                     will provide proposal templates, and all proposals will need to 
                                     follow the format of the proposal template for publication;
                                      the quality of the proposal and the logic behind it will be very 
                                      important, and is one of the main indicators for a proposal to make 
                                      it to the voting chain on the chain.
                                </v-card-text>
                            </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                 <v-expansion-panel>
                    <v-expansion-panel-header>STEP 3: Proposal review</v-expansion-panel-header>
                    <v-expansion-panel-content>
                         <v-card flat class="step-content">
                                <!-- <h2>proposal review</h2> -->
                                <v-card-text>
                                    The Council of Councillors has a very democratic and fair process of 
                                    proceedings, contains：
                                </v-card-text>
                                <h4>Motion Triage</h4>
                                <v-card-text>
                                    Adopted proposals are categorized, those involving on-chain parameter
                                     changes will generate REINetwork Improvement Proposals (GIP) and the 
                                     core team will initiate an on-chain vote; those not involving on-chain 
                                     parameter changes will be categorized as off-chain activity programs.
                                </v-card-text>
                                <h4>Review Process</h4>
                                <v-card-text>
                                    The process is: Eligibility Review - Format Review - Content Discussion - Voting. 
                                    Community proposals can only be qualified for on-chain voting if they 
                                    are approved by a majority vote.
                                </v-card-text>
                            </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                 <v-expansion-panel>
                    <v-expansion-panel-header>STEP 4: Voting</v-expansion-panel-header>
                    <v-expansion-panel-content>
                         <v-card flat class="step-content">
                                <!-- <h2>voting off-chain</h2> -->
                                <v-card-text>
                                    <v-card-text>
                                    Provide voting tools and multiple voting strategies for surveying community
                                     sentiment on specific proposals or parameters, allowing every coin holder
                                      to participate more fairly in community governance.
                                </v-card-text>
                                </v-card-text>
                            </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                 <v-expansion-panel>
                    <v-expansion-panel-header>STEP 5: Security mechanisms</v-expansion-panel-header>
                    <v-expansion-panel-content>
                         <v-card flat class="step-content">
                                <!-- <h2>Security mechanisms</h2> -->
                                <v-card-text>
                                    The governance security mechanism mitigates or eliminates the negative
                                     impact of harmful proposals on the REI Network or REI DAO community by
                                      setting a time delay before formal implementation of the proposal.
                                </v-card-text>
                                <v-card-text>
                                    New code is reserved for a 24-hour public notice period before deployment
                                     to REI Network, during which time all community members can review the
                                      code to confirm the security of REI Network. If the code is reviewed 
                                      and is deemed to have any negative impact on REI Network, the deployment
                                       will be immediately cancelled.
                                </v-card-text>
                            </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-row>
        <h2 class="title">Governance Tools</h2>
        <v-row  class="tools" justify="space-between">
            <v-col cols="12" sm="6">
                <v-card outlined class="tool">
                    <v-img v-if="dark" class="img" src="../assets/images/discord-dark.png" width="120" height="120"/>
                    <v-img v-else class="img" src="../assets/images/Discord.png" width="120" height="120"/>
                    <div class="right-content">
                        <v-list three-line>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title> <h3>Discord</h3></v-list-item-title>
                                    <v-list-item-subtitle class="tools-text">
                                        Join our discord, let us know your idea,  build influence in the
                                        community, and talk to our community governance coordinator.
                                    </v-list-item-subtitle>
                                    <a href="https://discord.com/invite/zhwWkXYtJt" target="_blank"><div class="tools-link">Join REI DAO Discord ></div></a>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </div>
                </v-card>
                <v-card outlined class="tool">
                    <v-img v-if="dark" class="img" src="../assets/images/forum-dark.png" width="120" height="120"/>
                     <v-img v-else class="img" src="../assets/images/Forum.png" width="120" height="120"/>
                     <div class="right-content">
                          <v-list three-line>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title> <h3>Snapshot</h3></v-list-item-title>
                                    <v-list-item-subtitle class="tools-text">
                                        Participate and follow the latest developments of the proposal,
                                        express your opinion and exercise your right to vote
                                    </v-list-item-subtitle>
                                    <a href="https://snapshot.org/#/rei-network.eth" target="_blank"><div class="tools-link">Vote On Snapshot With REI ></div></a>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                     </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6">
                <v-card outlined class="tool tool-forum">
                    <v-img v-if="dark" class="img" src="../assets/images/snapshot-dark.png" width="120" height="120"/>
                    <v-img v-else class="img" src="../assets/images/Snapshot.png" width="120" height="120"/>
                    <div class="right-content">
                        <v-list three-line>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title> <h3>Governance Forum</h3></v-list-item-title>
                                    <v-list-item-subtitle class="tools-text">
                                       Proposal discussion, the venue for debate. Let everyone hear
                                        your ideas and interact with the community.
                                    </v-list-item-subtitle>
                                    <div class="tools-link">Enter The Forum ></div>
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
       width:'', 
    }
  },
  watch: {

  },
  mounted() {
      this.windowWidth();
  },
  computed: {


...mapGetters({
      connection: 'connection',
      apiUrl: 'apiUrl',
      dark: 'dark'
    }),
  },
  methods: {
    ...mapActions({
      addTx: 'addTx',
    }),
     windowWidth(){
        const that = this;  
        that.width = window.innerWidth;
     }
  },
};
</script>

<style scoped lang="scss">
.v-tab{
    display: flex;
    justify-content: flex-start;
    padding-left:0 !important;
    text-transform: none !important;
    height: 60px !important;
}
a:hover{
        text-decoration: underline;
        color:#6979f8;
    }
 .step-left{
        padding-left: 16px;
        height: 100%;
        line-height: 60px;
        width: 300px;
        text-align: left;
        display: flex;
        align-items: center;
    }
    .iconfont{
        font-size: 24px;
        margin-right: 12px;
    }
.v-tab--active{
    .step-left{
        color: #FFF;
        background-color:#6979f8 !important;

    }
    .v-icon{
        color: #FFF;
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
.right-arrow{
    display: flex;
}
.theme--light.v-tabs-items{
    background:#F7F8FF !important;
}
.Introduction{
    padding: 30px 20px;
    .introduction-text{
        margin: 20px 0;
        font-size: 14px;
        color: #868E9E;
        line-height: 28px;
    }
    .introduction-btn{
        color: #FFF;
        text-transform: none !important;
    }
    .img{
        border-radius: 4px;
    }
    .title{
        margin-top: 60px;
    }
    .process{
        margin-top: 30px;
        .step{
            height: 300px;
            border-radius: 8px;
        }
        .theme--light.step{
            background: #F7F8FF;
        }
        .theme--dark.step{
            background: #F7F8FF !important;
        }
        .step-content{
            height:350px;
            padding-top: 20px;
            padding-left:20px;
            h2{
                padding-left: 12px;
            }
            h4{
                padding-left: 12px;
            }
        }
        .theme--light.step-content{
            background-color:#F7F8FF;
        }
        .theme--dark.step-content{
            background: #5C5A7A;
        }
    }
    .tools{
        .tool{
            margin-top:28px;
            display: flex;
            align-items: center;
            .img{
                margin: 20px;
            }
            .tools-text{
                font-size: 14px;
                color: #868E9E;
                line-height: 20px;
                margin-top: 20px;
            }
            .right-content{
                margin: 15px;
            }
            .tools-link{
                font-size: 14px;
                color: #6979F8;
                line-height: 20px;
                margin-top: 12px;
            }
        }
    }
}
@media screen and (max-width: 900px) {
    .v-list-item{
        padding: 0 !important;
    }
    .step-content{
        height: auto !important;
        padding: 0 !important;
    }
    .title{
        margin-top: 40px !important;
    }
    .tools{
        .img{
            width: 80px !important;
            height: 80px !important;
            margin: 32px 8px !important;
        }
        .tools-text{
            margin-top: 8px !important;
        }
        .tools-link{
             margin-top: 8px !important;
        }
    }
     .right-content{
        margin:0 8px 0 0 !important;
    }
    .tool-forum{
        margin-top: 8px !important;
    }
}

</style>
