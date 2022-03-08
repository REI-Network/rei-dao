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
              label="10"
              outlined
              item-color="vote_button"
              dense
              height="28"
              ></v-select>
          </v-card>
          </v-row>
         <v-simple-table class="list_title">
            <template v-slot:default>
            <thead>
                <tr>
                 <th class="text-left">
                    {{$t('unstake.node')}}
                </th> 
                <th class="text-left">
                    {{$t('unstake.unstake_available')}}
                </th>
                <th class="text-left">
                    {{$t('unstake.shares')}}
                </th>
                <th class="text-left">
                    {{$t('unstake.get_value')}}
                </th>
                <th class="text-left">
                    {{$t('unstake.status')}}
                </th>
                <th class="text-left">
                    {{$t('unstake.opertion')}}
                </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="(item,index) in nodeList"
                :key="index"
                >
                <td>{{ item.validator | addr }}</td>
                <td>{{ item.timestamp*1000 | dateFormat('YYYY-MM-dd hh:mm:ss') }}</td>
                <td>{{ formatAsset(item.shares) | asset(2)  }}</td>
                <td>{{ formatAsset(item.values) | asset(2)  }}</td>
                <td>{{ statusMap[item.state]  }}</td>
                <td>
                    <v-btn
                    tile
                    small
                    color="success"
                    :disabled="claimStatus(item)"
                    @click="unstake(item)"
                    >
                    {{ $t('unstake.gettitle')}}
                    </v-btn>
                </td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>
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
//import { getUnstake } from '../service/CommonService'
import util from '../utils/util'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core'

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT
let client = null;

export default {
  filters,
  data() {
    return {
        itemsPages:['10','20'],
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
        return item.timestamp*1000 >= now || item.state==1
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
