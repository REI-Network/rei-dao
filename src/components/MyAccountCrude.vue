<template>
   <v-container class="stake_background">
  <!-- 为 ECharts 准备一个定义了宽高的 DOM --> 
       <v-row>
            <v-col class="accout-item">
                <v-card class="balance-card" color="background">
                     <v-card
                        class="ma-4 voting-stake"
                        label
                        outlined
                    >
                        <div class="content-left">
                            <v-subheader class="total-rei">423.00<span class="rei">REI</span></v-subheader>
                            <v-subheader>
                                <div class="add-price" style="border-right:2px solid;padding-right:12px">
                                    <div>$13,434.00</div>
                                    <div style="color:#65BB67;">+15.16%</div>
                                </div>
                                <div class="add-price" style="margin-left:12px">
                                    <div>24H</div>
                                    <div class="update-time">
                                        <v-icon
                                            color="primary"
                                            size="12"
                                        >
                                        mdi-clock-time-ten-outline
                                    </v-icon>
                                        1h Ago
                                    </div>
                                </div>
                            </v-subheader>
                            <v-subheader>
                                Validator Voting Stake
                                <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                            color="primary"
                                            dark
                                            v-bind="attrs"
                                            v-on="on"
                                            dense
                                            style="margin-left:8px"
                                        >
                                         mdi-help-circle-outline
                                        </v-icon>
                                    </template>
                                    <span>Freely Usable REI,Excluding Stakes IN Vote,Gas Stake</span>
                                </v-tooltip>
                            </v-subheader>
                            </div>
                            <v-icon
                                color="primary"
                                dark
                                size="22"
                                class="icon-right"
                            >
                            mdi-arrow-right-circle
                            </v-icon>
                    </v-card>
                    <v-card
                        class="ma-4 voting-stake"
                        label
                        outlined
                    >
                        <div class="content-left">
                            <v-subheader class="total-rei" style="margin-top:12px">164.00<span class="rei">REI</span></v-subheader>
                            <v-subheader>
                                Validator Voting Stake
                                <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                            color="primary"
                                            dark
                                            v-bind="attrs"
                                            v-on="on"
                                            dense
                                            style="margin-left:8px"
                                        >
                                            mdi-help-circle-outline
                                        </v-icon>
                                    </template>
                                    <span>Freely Usable REI,Excluding Stakes IN Vote,Gas Stake</span>
                                </v-tooltip>
                             </v-subheader>
                            </div>
                            <v-icon
                                color="primary"
                                dark
                                size="22"
                                class="icon-right"
                            >
                            mdi-arrow-right-circle
                            </v-icon>
                    </v-card>
                </v-card>
            </v-col>
       </v-row>  
   </v-container>
</template>
<script>
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
  methods: {
      
  },
  computed: {
   
  }
};
</script>

<style scoped lang="scss">
.accout-item{
  padding: 0;
  .balance-card{
    width: 100%;
    // height: 200px;
    display: inline-flex;
    justify-content: space-between;
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
      .content-left{
        width:350px;
        margin:12px 0;
      }
      .icon-right{
        margin-right:20px;
      }
    }
  .add-price{
      width: 50%;
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
}
@media screen and (max-width: 900px) {
    .accout-item{
    flex-direction: column;
    .balance-card{
        display: flex;
        flex-direction: column;
    }
    .voting-stake{
        width: 94% !important;
    }
  }
}
</style>
