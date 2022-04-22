<template>
   <v-container class="stake_background">
     <v-card class="proposal">
        <h2 class="proposal-title">Proposal Overview</h2> 
        <v-row justify="space-between" align="start">
            <v-col cols="12" md="5" class="overview">
                <v-row align="center" justify="flex-start">
                    <v-col cols="12" sm="3" align="center" style="padding-bottom:0;">
                        <v-img src="../assets/images/totalProposal.png" width="60px"/>
                    </v-col>
                    <v-col class="proposal-number" style="padding-top:0;">
                        <h1 v-if='connection.address'>{{this.length}}</h1>
                        <h1 v-else> —</h1>
                        <div class="total">Total proposal ></div>
                    </v-col>
                </v-row>
                <v-row align="center" justify="flex-start" style="margin-top:26px">
                    <v-col cols="12" sm="3" align="center" style="padding-bottom:0;">
                        <v-img src="../assets/images/amount.png" width="60px"/>
                    </v-col>
                    <v-col class="proposal-number" style="padding-top:0;">
                        <h1 v-if='connection.address'>151,611,651</h1>
                        <h1 v-else class="pending"> —</h1>
                        <div class="total">Amount Of Voting Addresses</div>
                    </v-col>
                </v-row>
            </v-col>
             <v-col cols="12" md="7" class="active-core">
                <v-row justify="space-between">
                    <v-col cols="12" sm="6" style="padding-right:0;">
                        <v-card outlined class="overview-card">
                            <v-row align="center" justify="center"  class="active-row">
                                <v-col cols="12" sm="3" align="center" style="padding-bottom:0;">
                                    <v-img v-if="dark" src="../assets/images/active-dark.png" width="45px"/>
                                    <v-img v-else src="../assets/images/active.png" width="45px"/>
                                </v-col>
                                <v-col class="proposal-number">
                                    <h1 v-if='connection.address' class="active">{{this.activeNumber}}</h1>
                                    <h1 v-else class="active"> —</h1>
                                    <div class="number">Active ></div>
                                </v-col>
                            </v-row>
                        </v-card>
                        <v-card outlined class="overview-card">
                            <v-row align="center" justify="flex-start" class="active-row">
                                <v-col cols="12" sm="3" align="center" style="padding-bottom:0;">
                                    <v-img v-if="dark" src="../assets/images/pending-dark.png" width="45px"/>
                                    <v-img v-else src="../assets/images/pending.png" width="45px"/>
                                </v-col>
                                <v-col class="proposal-number">                                   
                                    <h1 v-if='connection.address' class="pending">{{this.pendingNumber}}</h1>
                                    <h1 v-else class="pending"> —</h1>
                                    <div class="number">Pending ></div>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                    <v-col cols="12" sm="6" style="padding-right:0;">
                        <v-card outlined class="overview-card">
                            <v-row align="center" justify="flex-start" class="active-row">
                                <v-col cols="12" sm="3" align="center" style="padding-bottom:0;">
                                    <v-img v-if="dark" src="../assets/images/closed-dark.png" width="45px"/>
                                    <v-img v-else src="../assets/images/closed.png" width="45px"/>
                                </v-col>
                                <v-col class="proposal-number">
                                    <h1 v-if='connection.address' class="closed">{{this.closedNumber}}</h1>
                                    <h1 v-else class="closed"> —</h1>
                                    <div class="number">Closed ></div>
                                </v-col>
                            </v-row>
                        </v-card>
                        <v-card outlined class="overview-card">
                            <v-row align="center" justify="flex-start" class="active-row">
                                <v-col cols="12" sm="3" align="center" style="padding-bottom:0;">
                                    <v-img v-if="dark" src="../assets/images/core-dark.png" width="45px"/>
                                    <v-img v-else src="../assets/images/core.png" width="45px"/>
                                </v-col>
                                <v-col class="proposal-number">
                                    <h1 v-if='connection.address' class="core">{{this.coreNumber}}</h1>
                                    <h1 v-else class="core"> —</h1>
                                    <div class="number">Core ></div>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row> 
        <h3 class="title proposal-title">Recently Proposed</h3>
        <template  v-for="(item, i) in proposalList">
        <v-card 
            outlined 
            class="recently-proposal"             
            :key="i"
            :href="`https://snapshot.org/#/gitcoindao.eth/proposal/`+item.id" 
            target="_blank"
            v-if="i < 4"
            >
            <v-row align="center">
                <v-col cols="12" md="11">
                    <v-row align="center" style="margin-left:20px;">
                        <v-avatar size="24">
                            <img
                                src="https://cdn.vuetifyjs.com/images/john.jpg"
                                alt="John"
                            >
                        </v-avatar>
                        <h5>{{item.author | addr}}</h5>
                        <div class="active" v-if="item.state=='active'">Active</div>
                        <div class="active closed" v-else-if="item.state=='closed'">Closed</div>
                         <div class="active pending" v-else-if="item.state=='pending'">Pending</div>
                          <div class="active pending" v-else>Pending</div>
                    </v-row>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="list-title">{{item.title}}</v-list-item-title>
                            <v-list-item-subtitle class="list-content">
                                {{item.body}}
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
        </template>
        <div class="footer-all"><a href="https://snapshot.org/#/rei-network.eth" target="_blank">View ALL Proposals On Snapshot ></a></div>
     </v-card>
   </v-container>
</template>
<script>

import { mapGetters, mapActions } from 'vuex';
import filters from '../filters';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core'
let client = null;
/* eslint-disable no-undef */
export default {
  filters,
  data() {
    return {   
       proposalList:[],
       closedNumber:0,
       activeNumber:0,
       pendingNumber:0,
       coreNumber:0,
       length:0,
    }
  },
  watch: {

  },
  mounted() {
      this.getProposalList()
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
    async getProposalList(){
         let url = "https://hub.snapshot.org/graphql";
        client = new ApolloClient({
            uri: `${url}`,
            cache: new InMemoryCache(),
        })
        const proposal = gql`
         query {
            proposals (
                first: 20,
                 skip: 0,
                where: {
                    space_in: ["rei-network.eth"],
                    state: "closed"
                },
                orderBy: "created",
                orderDirection: desc
            ) {
                id
                title
                body
                choices
                start
                end
                snapshot
                state
                author
                space {
                    id
                    name
                }
            }
        }
        `
        const {data:{proposals}} = await client.query({
            query: proposal,
            variables: {
            },
            fetchPolicy: 'cache-first',
        })
        this.proposalList = proposals;
        console.log('proposalList',this.proposalList)
        this.length = this.proposalList.length;
        this.proposalList.map(item => {
            if(item.state=="active"){
                this.activeNumber++;
            }else if(item.state=="closed"){
                 this.closedNumber++;
            }else if(item.state=="pending"){
                 this.pendingNumber++;
            }else{
                 this.coreNumber++;
            }
        });
    }
  },
};
</script>

<style scoped lang="scss">
a:hover{
        text-decoration: underline;
    }
    .proposal-title{
        margin-left: -12px;
    }
.proposal{
    margin-top: 20px;
    padding: 40px;
    .overview{
        background-color: #6979F8;
        margin-top: 30px;
        border-radius: 6px;
        padding: 24px 0;
        height: 206px;
    }
    .proposal-number{
            color: #FFF;
            .total{
                font-size: 14px;
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
        margin-top: 40px;
    }
    .recently-proposal:hover{
        text-decoration: none;
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
        a{
            text-decoration: none;
        }
    }
}
.footer-all{
    color: #6979F8;
    text-align: center;
    margin-top: 20px;
}
@media screen and (max-width: 900px) {
    .proposal{
        padding: 40px 30px;
    }
     .proposal-number{
            text-align: center;
            padding-top: 0 !important;
        }
        .active-row{
            padding: 12px 0 !important;
        }
    .active-core{
        padding-left:0 !important;
    }
    .title{
        margin-top: 40px !important;
    }
    .overview{
        height: 342px !important;
    }
    .overview-card{
        padding:24px 0;
    }
    .right-arrow{
        text-align: right;
        padding-right: 30px !important;
        margin-top: -60px;
    }
}
</style>
