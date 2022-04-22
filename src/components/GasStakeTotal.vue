<template>
  <v-container class="stake_background">
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <v-row>
        <v-col cols="12" md="12" sm="12" class="gasStake-total"> 
            <v-card
                class="mx-auto total-progress"
                rounded="4"
                color="background"
            >
                <h3>Resources Of {{ connection.address | addr }}</h3>
                <div class="deposit">Deposit REI Gets Crude</div>
                <v-row >
                    <v-col class="row-circular">
                    <div class="circular">
                        <v-progress-circular
                            :rotate="270"
                            :size="128"
                            :width="22"
                            :value="leftCrudePercent"
                            color="#64B5FF"
                            > 
                            {{connection.address?leftCrudePercent:'-'}}%
                        </v-progress-circular>
                        <h4>{{leftCrude | asset(8) }}</h4>
                        <div class="stake-name">Left Crude</div>
                    </div>
                    <div class="circular">
                        <v-progress-circular
                            :rotate="270"
                            :size="128"
                            :width="22"
                            :value="usedCrudePercent"
                            color="#FF9743"
                            > 
                            {{connection.address?usedCrudePercent:'-'}}%
                        </v-progress-circular>
                        <h4>{{usedCrude  | asset(8) }}</h4>
                        <div class="stake-name">Crude Used</div>                      
                    </div>
                    </v-col>
                </v-row>   
            </v-card>
            <v-card
                class="middle-btn"
                rounded="4"
                color="background"
            >
               <div class="total-rei" v-if="connection.address">{{gasStakeTotalAmount | asset(2)}}<span class="rei">REI</span></div> 
               <div v-if="!connection.address" class="not-connection">-</div>
               <div class="stake-name">Total Staked</div>
               <v-btn
                    tile
                    color='vote_button'
                    class="stake-btn"
                    @click="deposit"
                >
                    Gas stake
                </v-btn>        
            </v-card>
        </v-col>
      </v-row>
     <v-dialog v-model="depositDialog" width="500">
      <v-card :class="dark?'dialog-night':'dialog-daytime'" style="padding-bottom:4px">
          <div class="dialog-validator"> 
                <v-card-title class="dialog-title">{{$t('stakeforgas.stake_info')}}</v-card-title>
                <div @click="cancelStaking" class="close-btn"><v-icon>mdi-close</v-icon></div>  
            </div> 
        <v-list rounded class="ma-2 start_unstake">
          <v-form 
            ref="stakeform"
            lazy-validation
            class="start_unstake"
          >
          <v-row>
              <v-col class="from-voting">
                  <div class="input-title">Address</div>
                        <v-text-field
                            v-model="form.address"
                            :label="$t('stake.address')"
                            outlined
                            background-color="input_other"
                            class="text-filed"
                            color="chips"
                        >
                    </v-text-field>
              </v-col>
          </v-row>
            <div class="pb-1 text-body-1" style="text-align:right">
                <span class="font-color">{{$t('stake.wallet_balance')}}:</span>
                 <span style="font-weight:bold">{{ connection.balance | asset(8) }} </span>
                 <span class="font-color">{{symbol}}</span>
                 </div>
            <v-row>
              <v-col class="from-voting">
                  <div class="input-title">Amount</div>
                        <v-text-field
                        v-model="form.amount"
                        :label="$t('stake.amount')"
                        required
                        :rules="amountRules"
                        outlined
                        background-color="input_other"
                        class="text-filed"
                        height="24"
                    ><template v-slot:append>
                        <v-btn
                        text
                        x-small
                        @click="setAll('form')">
                        {{ $t('stake.max') }}
                        </v-btn>
                    </template>
            </v-text-field>
              </v-col>
          </v-row>
            <div class="text-center">
                <v-btn 
                color="btn_button"
                @click="cancelStaking"
                outlined
                class="mr-4">
                {{$t('stake.btn_cancel')}}
                
                </v-btn>
                <v-btn
                color="vote_button"
                :loading="stakeLoading"
                @click="submitStaking"
                class="font-btn"
                >
                {{$t('stake.btn_submit')}}
                </v-btn>
            </div>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>   
    </v-container>
</template>
<script>
/* eslint-disable no-undef */
import Web3 from 'web3';
import abiConfig from '../abis/abiConfig';
import abiFee from '../abis/abiFee'
import { mapGetters, mapActions } from 'vuex';
import filters from '../filters';
import util from '../utils/util'


const config_contract = process.env.VUE_APP_CONFIG_CONTRACT

export default {
  filters,
  data() {
    return {
        symbol:'REI',
        value:'100%',
        value1:'45%',
        value2:'10.78%',
        depositDialog: false,
        form:{
            address: '',
            amount: 0
        },
        stakeLoading: false,
        amountRules: [(v) => !!v || this.$t('msg.please_input_amount'), (v) => (v && util.isNumber(v)) || this.$t('msg.please_input_correct_num'), (v) => (v && v>0) || this.$t('msg.please_input_not_zero')],
        addressRules: [(v) => !!v || this.$t('msg.please_input_address')]
    };
  },
  watch: {
  
  },
  mounted() {
      this.connect();
      this.init();
  },
  destroyed() {
    
  },
  computed: {
   ...mapGetters({
      connection: 'connection',
      gasStakeTotalAmount: 'gasStakeTotalAmount',
      leftCrude: 'leftCrude',
      usedCrude: 'usedCrude',
      leftCrudePercent:'leftCrudePercent',
      usedCrudePercent: 'usedCrudePercent',
      dark: 'dark'
    }),
    // leftCrudePercent:function(){
    //     console.log('this.usedCrude',this.usedCrude)
    //     let usedCrude = this.usedCrude==0 ? 0 : web3.utils.toBN(web3.utils.toWei(this.usedCrude));
    //     let leftCrude = this.leftCrude==0 ? 0: web3.utils.toBN(web3.utils.toWei(this.leftCrude));
    //     let total = web3.utils.toBN(web3.utils.toWei(this.leftCrude)).add(leftCrude);
    //     let leftPercent = web3.utils.toBN(web3.utils.toWei(this.leftCrude)).div(total);
    //     return leftPercent;
    // }
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
        let contract = new web3.eth.Contract(abiConfig,config_contract);
        let feeContractAddress = await contract.methods.fee().call();
        this.feeContract = new web3.eth.Contract(abiFee,feeContractAddress);
    },
    deposit(){
        this.form.address = this.connection.address;
        this.depositDialog = true;
    },
    setAll(obj) {
        this[obj].amount = this.connection.balance;
    },
    async submitStaking(){
         try{
            if(!this.$refs.stakeform.validate()) return;
            this.stakeLoading = true;
            const stakeRes = await this.feeContract.methods.deposit(this.form.address).send({
            from: this.connection.address,
            value: web3.utils.numberToHex(web3.utils.toWei(this.form.amount))
        })
            if(stakeRes.transactionHash){
                console.log(stakeRes)
                this.addTx({
                  tx: {
                    txid: stakeRes.transactionHash,
                    type: 'deposit',
                    status: 'PENDING',
                    data: {
                      amount: this.form.amount,
                      symbol: this.symbol,
                      to: util.addr(this.form.address)
                    },
                    timestamp: new Date().getTime()
                  }
                });
                this.depositDialog = false;
            }
        } catch (e){
            this.depositDialog = false;
            console.log(e)
            this.$dialog.notify.warning(e.message);
        }
        this.stakeLoading = false;
    },
    cancelStaking() {
        this.depositDialog = false;
    },
  },
};
</script>

<style scoped lang="scss">
.v-progress-circular {
  margin: 1rem;
}
.font-btn{
    color: #FFF;
}
.row-circular{
        display:flex;
        justify-content: space-around;
    }
.circular{
    text-align: center;
    margin-top: 24px;
    width:280px;
}
.stake-name{
    font-size: 12px;
    color: #868e9e;
}
.deposit{
    font-size: 12px;
    color: #868e9e;
}
.from-voting{
    display: flex;
    justify-content: space-between;
    padding-bottom:0;
    padding-top:0;
    .input-title{
        width: 80px;
        text-align: center;
        height:40px;
        color:#868E9E;
    }
 }
 .font-color{
        color:#868E9E;
    }
  .text-body-1{
        margin-bottom: 20px;
    }
.dialog-night{
    background-color:#595777 ;
}
.dialog-daytime{
    background-color: #FFF;
}
.dialog-validator{
    display: flex;
    justify-content: space-between;
    .close-btn{
        margin-top: 20px;
        margin-right:20px;
        padding: 0;
        background-color: transparent;
        cursor: pointer;
    }
}
.total-progress{
   padding:28px;
   margin:0;
   width:60.5%;
}
.update-time{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    font-size: 12px;
    margin-top: 20px;
}
.gasStake-total{
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    padding: 0;
}
.mx-auto{
    // width: 500px;
    margin: 0px !important;
}
.v-application .text-center{
    text-align: right !important;
}
.middle-btn{
    width:36% ;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.total-rei{
    text-align: center;
    font-size: 36px;
    font-weight: 700;
    .rei{
       font-size: 12px;
       font-weight: normal;
       margin-left: 8px;
    }
}
.stake-name{
    font-size: 12px;
    margin:12px 0;
    text-align: center;
}
.stake-btn{
    margin:24px 0;
    padding: 12px 20px;
    border-radius:20px;
    color:#FFF;
}
.not-connection{
    margin: 12px 36px;
    font-weight: 500;
  }
  .v-btn.v-btn--has-bg{
      background-color: #6979F8;
  }
@media screen and (max-width: 900px) {
    .total-progress{
        overflow-x: scroll;
        width: 100%;
    }
    .row-circular{
        display:flex;
        flex-direction: row;
        justify-content: initial;
        max-width: 100%;
    }
    .from-voting{
            display: flex;
            flex-direction: column;
            .input-title{
                margin-top: 0;
                height:24px;
            }
        }
    .text-body-1{
        margin-bottom: 0px;
    }
    .gasStake-total{
        display: flex;
        flex-direction: column;
        justify-content:space-between;
        padding: 0;
    }
    .circular{
        margin-left: 50px !important;
        margin-right: 50px !important;
    }
    .middle-btn{
        width: 100%;
        margin-top: 20px;
        padding:20px 0;
    }
    .update-time{
        margin-right: 20px;
   }
}
</style>
