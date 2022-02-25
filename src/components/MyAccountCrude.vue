<template>
   <v-container class="stake_background">
  <!-- 为 ECharts 准备一个定义了宽高的 DOM --> 
       <v-row>
            <v-col class="accout-item">
              <v-card color="background">
                <v-subheader><h3>Gas stake</h3></v-subheader>
                <v-card class="balance-card" outlined color="background">
                     <v-card
                        class="voting-stake"
                        label
                        outlined
                    >
                        <div class="content-left">
                            <v-subheader class="total-rei" v-if='connection.address'>423.00<span class="rei">REI</span></v-subheader>
                             <div v-if='!connection.address' class="not-connection">
                                 —
                            </div>
                            <v-subheader v-if='connection.address'>
                                <div class="add-price" style="border-right:2px solid;padding-right:12px">
                                    <div>$13,434.00</div>
                                    <div style="color:#65BB67;">+15.16%</div>
                                </div>
                                <div class="time-price" style="margin-left:12px">
                                    <div>24H</div>
                                    <div class="update-time">
                                        <v-icon
                                            color="right_icon"
                                            size="12"
                                        >
                                        mdi-clock-time-ten-outline
                                    </v-icon>
                                        1h Ago
                                    </div>
                                </div>
                            </v-subheader>
                             <div v-if='!connection.address' class="not-connection">
                                -
                            </div>
                            <v-subheader>
                                Total Stake
                                <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                            color="right_icon"
                                            dark
                                            v-bind="attrs"
                                            v-on="on"
                                            dense
                                            style="margin-left:8px"
                                        >
                                         mdi-help-circle-outline
                                        </v-icon>
                                    </template>
                                    <span>Stake REI,Earn Crude As Gas</span>
                                </v-tooltip>
                            </v-subheader>
                            </div>
                            <v-icon
                                color="right_icon"
                                dark
                                size="22"
                                class="icon-right"
                                v-if='connection.address'
                            >
                            mdi-arrow-right-circle-outline
                            </v-icon>
                            <div v-if='!connection.address'></div>
                    </v-card>
                    <v-card
                        class="voting-stake"
                        label
                        outlined
                    >
                        <div class="content-left">
                            <v-subheader class="total-rei" style="margin-top:28px" v-if='connection.address'>164.00<span class="rei">REI</span></v-subheader>
                            <div v-if='!connection.address' class="not-connection">
                                —
                            </div>
                            <v-subheader class="">
                                LEft Crude
                                <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                            color="right_icon"
                                            dark
                                            v-bind="attrs"
                                            v-on="on"
                                            dense
                                            style="margin-left:8px"
                                        >
                                            mdi-help-circle-outline
                                        </v-icon>
                                    </template>
                                    <span>Daily Available Crude Oil Does Not Accumulate And Resets To 0 Every Day</span>
                                </v-tooltip>
                             </v-subheader>
                            </div>
                            <v-icon
                                color="right_icon"
                                dark
                                size="22"
                                class="icon-right"
                                v-if='connection.address'
                            >
                            mdi-arrow-right-circle-outline
                            </v-icon>
                            <div v-if='!connection.address'></div>
                    </v-card>
                </v-card>
             </v-card>
          </v-col>
       </v-row>  
   </v-container>
</template>
<script>

import { mapGetters, mapActions } from 'vuex';
/* eslint-disable no-undef */
export default {
  data() {
    return {
        
    };
  },
  watch: {
  
  },
  mounted() {
  },
  destroyed() {
    
  },
   computed: {
   ...mapGetters({
      connection: 'connection',
      dark: 'dark'
    }),
  },
  methods: {
      ...mapActions({
      addTx: 'addTx'
    }),
  },
};
</script>

<style scoped lang="scss">
.accout-item{
  padding: 0;
  .balance-card{
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    border:none;
  }
  .total-rei{
    font-size: 28px;
    font-weight: 700;
    .rei{
       font-size: 12px;
       font-weight: normal;
       margin-left: 8px;
    }
  }
  .voting-stake{
    width: 48%;
    height:150px;
    display: inline-flex;
    justify-content: space-between !important;
    background-color: transparent !important;
    margin: 0 16px 16px 16px;
      .content-left{
        width:350px;
        // margin:12px 0; 
      }
      .icon-right{
        margin-right:20px;
      }
    }
  .add-price{
      width: 56%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .time-price{
      width: 44%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  .update-time{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    font-size: 12px;
    // margin-right: 20px;
  }
  .not-connection{
    margin: 12px 36px;
    font-weight: 500;
  }
}
@media screen and (max-width: 900px) {
    .accout-item{
    flex-direction: column;
    .balance-card{
        display: flex;
        flex-direction: column;
    }
    .voting-stake{
        width: 91% !important;
    }
    .content-left{
        width:350px;
        margin:12px 0;
      }
  }
}
</style>
