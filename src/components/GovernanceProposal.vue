<template>
   <v-container class="stake_background">
     <v-card class="proposal">
        <h2>Proposal Overview</h2> 
        <v-row justify="space-between" align="start">
            <v-col cols="12" md="5" class="overview">
                <v-row align="center" justify="flex-start">
                    <v-col cols="12" sm="3" align="center">
                        <v-img src="../assets/images/totalProposal.png" width="60px"/>
                    </v-col>
                    <v-col class="proposal-number">
                        <h1>8</h1>
                        <div class="total">Total proposal ></div>
                    </v-col>
                </v-row>
                <v-row align="center" justify="flex-start" style="margin-top:26px">
                    <v-col cols="12" sm="3" align="center">
                        <v-img src="../assets/images/amount.png" width="60px"/>
                    </v-col>
                    <v-col class="proposal-number">
                        <h1>151,611,651</h1>
                        <div class="total">Amount Of Voting Addresses ></div>
                    </v-col>
                </v-row>
            </v-col>
             <v-col cols="12" md="7" class="active-core">
                <v-row justify="space-between">
                    <v-col cols="12" sm="6" style="padding-right:0;">
                        <v-card outlined class="overview-card">
                            <v-row align="center" justify="flex-start" >
                                <v-col cols="12" sm="3" align="center">
                                    <v-img v-if="dark" src="../assets/images/active-dark.png" width="45px"/>
                                    <v-img v-else src="../assets/images/active.png" width="45px"/>
                                </v-col>
                                <v-col class="proposal-number">
                                    <h1 class="active">1</h1>
                                    <div class="number">Active ></div>
                                </v-col>
                            </v-row>
                        </v-card>
                        <v-card outlined class="overview-card">
                            <v-row align="center" justify="flex-start">
                                <v-col cols="12" sm="3" align="center">
                                    <v-img v-if="dark" src="../assets/images/pending-dark.png" width="45px"/>
                                    <v-img v-else src="../assets/images/pending.png" width="45px"/>
                                </v-col>
                                <v-col class="proposal-number">
                                    <h1 class="pending">1</h1>
                                    <div class="number">Pending ></div>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                    <v-col cols="12" sm="6" style="padding-right:0;">
                        <v-card outlined class="overview-card">
                            <v-row align="center" justify="flex-start">
                                <v-col cols="12" sm="3" align="center">
                                    <v-img v-if="dark" src="../assets/images/closed-dark.png" width="45px"/>
                                    <v-img v-else src="../assets/images/closed.png" width="45px"/>
                                </v-col>
                                <v-col class="proposal-number">
                                    <h1 class="closed">6</h1>
                                    <div class="number">closed ></div>
                                </v-col>
                            </v-row>
                        </v-card>
                        <v-card outlined class="overview-card">
                            <v-row align="center" justify="flex-start">
                                <v-col cols="12" sm="3" align="center">
                                    <v-img v-if="dark" src="../assets/images/core-dark.png" width="45px"/>
                                    <v-img v-else src="../assets/images/core.png" width="45px"/>
                                </v-col>
                                <v-col class="proposal-number">
                                    <h1 class="core">2</h1>
                                    <div class="number">Core ></div>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row> 
        <h3 class="title">Recently Proposal</h3>
        <v-card outlined class="recently-proposal">
            <v-row align="center">
                <v-col cols="12" md="11">
                    <v-row align="center" style="margin-left:20px;">
                        <v-avatar size="24">
                            <img
                                src="https://cdn.vuetifyjs.com/images/john.jpg"
                                alt="John"
                            >
                        </v-avatar>
                        <h5>Reidao by reidao.eth</h5>
                        <div class="active">Active</div>
                    </v-row>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="list-title">Governance Proposal From GXChain 2.0 To REI Nework</v-list-item-title>
                            <v-list-item-subtitle class="list-content">
                                Governnance Proposal From GXChain 2.0 TO REI Network, Governnance Proposal From GXChain 2.0 TO RE…134dnfgj  hgtgt tu  gfdt csbclopyqwo ngjgo
                            </v-list-item-subtitle>
                            <v-list-item-subtitle class="list-time">
                                end in 4 days
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-col>
                <v-col cols="12" md="1" class="right-arrow">
                    <v-icon  size="22"> mdi-arrow-right-circle-outline</v-icon>
                </v-col>
            </v-row>
        </v-card>
         <v-card outlined class="recently-proposal">
            <v-row align="center">
                <v-col cols="12" md="11">
                    <v-row align="center" style="margin-left:20px;">
                        <v-avatar size="24">
                            <img
                                src="https://cdn.vuetifyjs.com/images/john.jpg"
                                alt="John"
                            >
                        </v-avatar>
                        <h5>Reidao by reidao.eth</h5>
                        <div class="active pending">Pending</div>
                    </v-row>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="list-title">Governance Proposal From GXChain 2.0 To REI Nework</v-list-item-title>
                            <v-list-item-subtitle class="list-content">
                                Governnance Proposal From GXChain 2.0 TO REI Network, Governnance Proposal From GXChain 2.0 TO RE…134dnfgj  hgtgt tu  gfdt csbclopyqwo ngjgo
                            </v-list-item-subtitle>
                            <v-list-item-subtitle class="list-time">
                                end in 4 days
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-col>
                <v-col cols="12" md="1" class="right-arrow">
                    <v-icon  size="22"> mdi-arrow-right-circle-outline</v-icon>
                </v-col>
            </v-row>
        </v-card>
         <v-card outlined class="recently-proposal">
            <v-row align="center">
                <v-col cols="12" md="11">
                    <v-row align="center" style="margin-left:20px;">
                        <v-avatar size="24">
                            <img
                                src="https://cdn.vuetifyjs.com/images/john.jpg"
                                alt="John"
                            >
                        </v-avatar>
                        <h5>Reidao by reidao.eth</h5>
                        <div class="active closed">Closed</div>
                    </v-row>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="list-title">Governance Proposal From GXChain 2.0 To REI Nework</v-list-item-title>
                            <v-list-item-subtitle class="list-content">
                                Governnance Proposal From GXChain 2.0 TO REI Network, Governnance Proposal From GXChain 2.0 TO RE…134dnfgj  hgtgt tu  gfdt csbclopyqwo ngjgo
                            </v-list-item-subtitle>
                            <v-list-item-subtitle class="list-time">
                                end in 4 days
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-col>
                <v-col cols="12" md="1" class="right-arrow">
                    <v-icon  size="24"> mdi-arrow-right-circle-outline</v-icon>
                </v-col>
            </v-row>
        </v-card>
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
       
    }
  },
  watch: {

  },
  mounted() {

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
  },
};
</script>

<style scoped lang="scss">
.proposal{
    margin-top: 20px;
    padding: 40px;
    .overview{
        background-color: #6979F8;
        margin-top: 30px;
        border-radius: 6px;
        // height: 214px;
        .proposal-number{
            color: #FFF;
            .total{
                font-size: 14px;
            }
        }
    }
    .number{
        font-size: 14px;
        color: #868E9E;
        line-height: 20px;
    }
    .active-core{
        .overview-card{
            padding:12px;
            margin-top: 18px;
            .active{
                color:#FF9224;
            }
            .pending{
                color:#7A7AB3;
            }
            .closed{
                color:#258ABE;
            }
            .core{
                color: #E95767;
            }
        }
    }
    .title{
        margin-top: 100px;
    }
    .recently-proposal{
        margin-top: 30px;
        padding-top: 30px;
        h5{
            font-size: 16px;
            font-weight: bold;
            color: #868E9E;
            margin: 0 15px;
        }
        .list-title{
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
        }
        .list-content{
            margin-top: 10px;
            font-size: 16px;
        }
        .list-time{
            margin-top: 20px;
            line-height: 22px;
            font-weight: 400;
            font-size: 16px;
        }
        .theme--light.list-time{
            color: #101C34;
        }
        .theme--dark.list-time{
            color: #5c5a7a;
        }
        .active{
            color: #FFF;
            background-color: #FF9224;
            font-size: 12px;
            text-align: center;
            width: 50px;
            height: 16px;
            border-radius: 20px;
        }
        .pending{
            background-color: #7A7AB3;
        }
        .closed{
            background-color: #258ABE;
        }
    }
    .right-arrow{
        margin-bottom: 20px;
    }
}
@media screen and (max-width: 900px) {
}
</style>
