<template>
  <v-container>
    <v-row>
      <v-col>
            <!-- <v-card-actions>
                <v-card-title>{{$t('unstake.list_title')}}</v-card-title>
            </v-card-actions>    -->
          <!-- <v-divider /> -->
          <v-row justify="space-between" align="center" class="warn-tip">
             <v-subheader class="sub-tip">
                <v-icon
                    color="primary"
                    dark
                    dense
                    style="margin-left:8px"
                    size="16"
                  >
                    mdi-alert-circle-outline
              </v-icon> 
              <div class="warn">7 Days After Initiating A Redemption Operation,You Can Receive It On The Receive It On The Redemption Page</div>
          </v-subheader>
          <v-card outlined class="select-card">
            <v-select
              class="d-select"
              :items="itemsPages"
              label=""
              outlined
              item-color="vote_button"
              dense
              height="28"
              v-model="itemsPerPage"
              ></v-select>
          </v-card>
          </v-row>
          <v-data-table
                :headers="headers"
                :items="nodeList"
                class="elevation-1"
                hide-default-footer
                :items-per-page="itemsPerPage"
                :loading="unStakeListLoading"
                :loading-text="$t('msg.loading')"
                :page.sync="page"
                @page-count="pageCount = $event"
            >
                <template v-slot:item.validator="{ item }">
                    <Address :val="item.validator"></Address>
                </template>
                <template v-slot:item.timestamp="{ item }">
                    {{ item.timestamp*1000 | dateFormat('YYYY-MM-dd hh:mm:ss')  }}
                </template>
                <template v-slot:item.shares="{ item }">
                    {{ formatAsset(item.shares) | asset(2)  }}
                </template>
                <template v-slot:item.values="{ item }">
                    {{ formatAsset(item.values) | asset(2)   }}
                </template>
                <template v-slot:item.state="{ item }">
                    {{ statusMap[item.state]  }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-btn
                        tile
                        small
                        color="success"
                        :disabled="claimStatus(item)"
                        @click="unstake(item)"
                    >
                    {{ $t('unstake.gettitle')}}
                    </v-btn>
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
      </v-col>
    </v-row>
    
  </v-container>
</template>
<script>
/* eslint-disable no-undef */

import { mapActions, mapGetters } from 'vuex';
import abiConfig from '../abis/abiConfig';
import abiStakeManager from '../abis/abiStakeManager'
import filters from '../filters';
import Address from '../components/Address';
//import { getUnstake } from '../service/CommonService'
import util from '../utils/util'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core'

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT
let client = null;

export default {
  filters,
  components:{
      Address
  },
  data() {
    return {
        page: 1,
        pageCount: 0,
        itemsPerPage: 10,
        unStakeListLoading: false,
        itemsPages:[10, 20],
        dialog: false,
        form:{
            amount:0
        },
        claimLoading: false,
        currentItem:'',
        stakeManagerContract:'',
        statusMap:{
            false: this.$t('unstake.not_retrieve'),
            true: this.$t('unstake.retrieve')
        },
        headers: [
            {
                text: this.$t('unstake.node'),
                align: 'start',
                sortable: false,
                value: 'validator',
            },
            { 
                text: this.$t('unstake.unstake_available'),value: 'timestamp'
            },
            { text: this.$t('unstake.shares'), value: 'shares' },
            { text: this.$t('unstake.get_value'), value: 'values' },
            { text: this.$t('unstake.status'), value: 'state' },
            { text: this.$t('unstake.opertion'), value: 'actions', sortable: false }
        ],
        nodeList: [
        ],
        receiveBalance: 0,
        commissionShare:'',
        rules: {
          required: value => !!value || 'Required',
        },
    };
  },
  watch: {
    '$store.state.finishedTxs': function() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    
  },
  methods: {
    ...mapActions({
      addTx: 'addTx'
    }),
    async init() {
        this.unStakeListLoading = true;
        let url = this.apiUrl.graph;
        client = new ApolloClient({
            uri: `${url}chainmonitor`,
            cache: new InMemoryCache(),
        })
        const getUnStakeinfos = gql`
         query unStakeInfos {
            unStakeInfos(where: { from: "${this.connection.address}" }) {
                id
                from
                to
                txHash
                values
                shares
                validator
                timestamp
                state
                amount
            }
        }
        `
        const {data:{unStakeInfos}} = await client.query({
            query: getUnStakeinfos,
            variables: {
            },
            fetchPolicy: 'cache-first',
        })
        this.nodeList = unStakeInfos
        this.unStakeListLoading = false;

    },
    cancelClaim() {

    },
    async unstake(item){
        try {
            this.currentItem = item;

            let contract = new web3.eth.Contract(abiConfig,config_contract);
            this.stakeManagerContract = await contract.methods.stakeManager().call();
            let stake_contract = new web3.eth.Contract(abiStakeManager,this.stakeManagerContract);

            const res =  await stake_contract.methods.unstake(item.id).send({ 
                    from: this.connection.address,
                })
             if(res.transactionHash){
                this.addTx({
                  tx: {
                    txid: res.transactionHash,
                    type: 'unstake',
                    status: 'PENDING',
                    data: {
                      amount: this.formatAsset(item.value),
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
        //console.log(res)
    },
    formatAsset(val) {
        return web3.utils.fromWei(web3.utils.toBN(val))
    },
    claimStatus(item) {
        let now = Date.now();
        return item.timestamp*1000 >= now || item.state==false
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
      connection: 'connection',
      apiUrl: 'apiUrl'
    })
  }
};
</script>

<style lang="scss" scoped>
.theme--dark.v-list{
  background: #595777 !important;
}
.warn-tip{
  margin-top: 1px;
  margin-bottom: 1px;
  height:50px
}
.sub-tip{
  height:36px;
  display:flex;
  align-items: flex-start;
}
.warn{
  margin-left: 6px;
  font-size: 12px;
}

.select-card{
  border:none;
  background-color: transparent;
  width: 90px; 
    }
.d-select{
  width:80px;
  border: none;
}
@media screen and (max-width: 900px){
  .warn-tip{
  margin-bottom:62px;
}
  .select-card{
    width: 90% !important; 
    margin-top: 28px;
    margin-left:5%;
    }
  .d-select{
    width:100% !important;
  }
}
</style>
