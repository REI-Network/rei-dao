<template>
  <v-container>
    <v-row>
      <v-col>
          <v-row justify="space-between" align="center" class="warn-tip">
             <v-subheader :class="dark?'dark-tip':'sub-tip'">
                <!-- <v-icon
                    color="primary"
                    dark
                    dense
                    style="margin-left:8px"
                    size="16"
                  >
                    mdi-alert-circle-outline
              </v-icon>  -->
              <div class="warn">Note: Redemption is available after 7 days on the redemption page</div>
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
                class="elevation-0 data-margin"
                hide-default-footer
                :items-per-page="itemsPerPage"
                :no-data-text="$t('msg.nodatatext')"
                :loading="unStakeListLoading"
                :loading-text="$t('msg.loading')"
                :page.sync="page"
                @click:row="validatorDetails"
                @page-count="pageCount = $event"
            >
                <template v-slot:item.validator="{ item }">
                    <v-img v-if="item.logo" :src="$IpfsGateway(item.logo)" width="24" height="24" class="logo-image"></v-img>
                    <v-img v-else src="../assets/images/rei.svg" width="24" height="24" class="logo-image"></v-img>
                    <span class="nodeName name-hover" v-if="item.nodeName">{{ item.nodeName }}</span>
                    <span class="nodeName name-hover" v-else>{{ item.validator | addr }}</span>
                    <!-- <Address :val="item.validator"></Address> -->
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
                        small
                        color="vote_button"
                        :disabled="claimStatus(item)"
                        @click.stop="unstake(item)"
                        height="32"
                        style="color:#FFF"
                    >
                    {{ $t('unstake.gettitle')}}
                    </v-btn>
                </template>
            </v-data-table>
            <div class="text-center pt-2" v-if="nodeList.length > 0">
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
     <v-dialog v-model="validatorDialog" width="600">
      <v-card class="validator-info">
        <v-row justify="space-between" class="title-info">
          <v-card-title style="margin-left:-12px;margin-top:-20px">Validator info</v-card-title>
          <div @click="closeDetails">
            <v-icon>mdi-close</v-icon>
          </div>
        </v-row>
          <v-list>
            <v-list-item class="info-item" v-if="detailsItem.nodeName" >
            <v-list-item-content>
              <v-list-item-subtitle>
                <v-img src="../assets/images/nodeName.svg" class="logo-image" width="20" height="20"/>
                <span>Node Name</span>
              </v-list-item-subtitle>
              <h5> 
                {{ detailsItem.nodeName }}
              </h5>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="info-item">
            <v-list-item-content>
              <v-list-item-subtitle>
                <v-img src="../assets/images/validator-ic.svg" class="logo-image" width="20" height="20"/>
                <span>Validator Address</span>
              </v-list-item-subtitle>
              <h5 v-if="width > 900"> 
                {{ detailsItem.validator }}
                <v-btn @click="copyAddr(detailsItem.validator)">
                  <v-icon small color="#868E9E">{{ addrCopying ? 'mdi-checkbox-marked-circle-outline' : 'mdi-content-copy' }}</v-icon>
                </v-btn>
              </h5>
               <h5 v-else><Address :val="detailsItem.validator"></Address></h5>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="info-item" three-line v-if="detailsItem.nodeDesc" >
            <v-list-item-content>
              <v-list-item-subtitle>
                <v-img src="../assets/images/description.svg" class="logo-image" width="20" height="20"/>
                <span>Description</span>
              </v-list-item-subtitle>
              <h5 style="line-height:20px"> 
                {{ detailsItem.nodeDesc }}
              </h5>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="info-item" v-if="detailsItem.website" >
            <v-list-item-content>
              <v-list-item-subtitle>
                <v-img src="../assets/images/website.svg" class="logo-image" width="20" height="20"/>
                <span>Website</span>
                <v-btn depressed small target="_blank" :href="detailsItem.website"><v-icon small color="#868E9E">mdi-open-in-new</v-icon></v-btn>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          </v-list>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */

import { mapActions, mapGetters } from 'vuex';
import abiConfig from '../abis/abiConfig';
import abiStakeManager from '../abis/abiStakeManager'
import filters from '../filters';
import Address from '../components/Address';
import find from 'lodash/find';
//import { getUnstake } from '../service/CommonService'
import util from '../utils/util'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core'
import { getValidatorDetails } from '../service/CommonService'

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
            { text: this.$t('unstake.operation'), value: 'actions', sortable: false }
        ],
        validatorDialog:false,
        detailsItem:'',
        width:'',
        nodeList: [],
        addrCopying: false,
        detailsList:[],
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
    this.init();
    this.windowWidth();
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
        let Details = await getValidatorDetails();
        // console.log('Details',Details)
        this.detailsList = Details.data.data;
        this.nodeList = this.nodeList.map((item) => {
        let detail = find(this.detailsList, (items) => web3.utils.toChecksumAddress(items.nodeAddress) == web3.utils.toChecksumAddress(item.validator));
        if(detail){
          var nodeName = detail.nodeName;
          var logo = detail.logo;
          var website = detail.website;
          var nodeDesc = detail.nodeDesc;
        }
        return{
          ...item,
          nodeName:nodeName,
          logo:logo,
          website:website,
          nodeDesc:nodeDesc
        }
      })
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
                      amount: this.formatAsset(item.values),
                      symbol: 'REI',
                      to: util.addr(this.connection.address)
                    },
                    timestamp: new Date().getTime()
                  }
                });
            }   
        } catch (e){
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
        return item.timestamp*1000 >= now || item.state==true
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
    },   
     async validatorDetails(value){
      // this.validatorDialog = true;
      this.detailsItem = value;
      this.$router.push({
        name:'StakeInfo',
        query:{
          id:value.validator,
        },
      })
    },
     windowWidth() {
      const that = this;
      that.width = window.innerWidth;
    },
    closeDetails(){
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
      })
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
.v-btn.v-btn--has-bg{
  color: #FFF;
  background:#6979F8;
  text-transform: none;
}
.warn-tip{
  margin-top: 1px;
  margin-bottom: 1px;
  height:50px;
}
.sub-tip{
  // height:36px;
  // display:flex;
  // align-items: flex-start;
    padding:1px 12px;
    border: 1px #FB7E36 solid;
    color:#FB7E36;
    margin:0 12px;
    margin-top:-24px;
    height:36px;
    border-radius: 4px;
}
.dark-tip{
    padding:1px 12px;
    border: 1px #9F9DB9 solid;
    color:#9F9DB9;
    margin:0 12px;
    margin-top:-24px;
    height:36px;
    border-radius: 4px;
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
.logo-image{
  display: inline-block;
  vertical-align: middle;
  margin-right:8px;
  border-radius: 20px;
}
.nodeName{
  margin: 0 8px;
  cursor: pointer;
}
.theme--dark.validator-info{
    padding: 20px;
    background-color: #595777;
     .v-btn.v-btn--has-bg{
    background-color: transparent;
    padding-left:0 !important;
  }
  }
  .theme--light.validator-info{
    padding: 20px;
    .v-btn.v-btn--has-bg{
    background-color: transparent;
  }
  }
  .info-item{
    padding:0;
    h5{
    padding-left:28px;
  }
  }
  .info-icon{
    margin-right:8px;
  }
  .title-info{
    margin:10px 0 0 1px;
  }
  .name-hover:hover{
  color:#4856C0;
}
@media screen and (max-width: 900px){
  .warn-tip{
  margin-top:30px;
}
.sub-tip{
 height:68px;
 margin-bottom: 20px;
}
.dark-tip{
 height:68px;
 margin-bottom: 20px;
}
.data-margin{
  margin-top:80px
}
  .select-card{
    width: 94% !important; 
    margin-bottom: 28px;
    margin-left:3%;
    }
  .d-select{
    width:100% !important;
  }
  .title-info{
    margin:12px 0;
  }
}
</style>
