<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" sm="12">
            <v-card-actions>
                <v-card-title>{{$t('unstake.list_title')}}</v-card-title>
            </v-card-actions>   
          <v-divider />
         <v-simple-table>
            <template v-slot:default>
            <thead>
                <tr>
                 <th class="text-left">
                    {{$t('unstake.node')}}
                </th> 
                <th class="text-left">
                    {{$t('unstake.create_time')}}
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
                <td>{{ item.createdAt | dateFormat('YYYY-MM-dd hh:mm:ss') }}</td>
                <td>{{ item.timestamp*1000 | dateFormat('YYYY-MM-dd hh:mm:ss') }}</td>
                <td>{{ formatAsset(item.unstakeShares) | asset(2)  }}</td>
                <td>{{ formatAsset(item.value) | asset(2)  }}</td>
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
import { getUnstake } from '../service/CommonService'
import util from '../utils/util'

const config_contract = process.env.VUE_APP_CONFIG_CONTRACT

export default {
  filters,
  data() {
    return {
        dialog: false,
        form:{
            amount:0
        },
        claimLoading: false,
        currentItem:'',
        stakeManagerContract:'',
        statusMap:{
            0: this.$t('unstake.not_retrieve'),
            1: this.$t('unstake.retrieve')
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
        let res = await getUnstake({
            to: this.connection.address
        });
        if(res && res.data){
            this.nodeList = res.data.result
        }

        console.log(this.nodeList)
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
      connection: 'connection'
    })
  }
};
</script>
