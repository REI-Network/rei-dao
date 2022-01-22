<template>
   <v-container class="stake_background">
  <!-- 为 ECharts 准备一个定义了宽高的 DOM --> 
       <v-row>
            <v-col class="accout-item">
                <v-card style="padding-bottom:20px" color="background">
                    <v-subheader><h3>Proposals</h3></v-subheader>
                    <v-card class="balance-card" outlined color="background">
                        <v-card
                            class="ma-4 voting-stake"
                            outlined
                        >
                            <div class="content-left">
                                <v-subheader class="total-rei">3</v-subheader>
                                <v-subheader>Core Votes</v-subheader>
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
                            outlined
                        >
                            <div class="content-left">
                                <v-subheader class="total-rei" >9</v-subheader>
                                <v-subheader>All Votes</v-subheader>
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
                   <v-subheader><h3>Particpated</h3><span class="particpate">2</span></v-subheader>
                   <v-card outlined class="part-card">
                       <v-subheader>
                           <v-avatar
                                color="indigo"
                                size="28"
                                >
                                <img
                                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                                    alt="John"
                                >
                            </v-avatar>
                            <h3 style="margin-left:12px">Particpated</h3>
                           <span class="particpate" style="background-color:#5FAD62;">Core</span>
                           <span class="particpate" style="background-color:#FC9354;">Active</span>
                        </v-subheader>
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title><h3>Governance Proposal From Form GXChain 2.0 To REI Nework</h3></v-list-item-title>
                                <v-list-item-subtitle style="margin-top:12px">In 2017,Gxchain(Credible Chain)WasnLaunched On The Main Website,Aiming To Build A Value Network Of...</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                   </v-card>
                   <v-card outlined class="part-card" style="margin-top:20px;">
                       <v-subheader>
                           <v-avatar
                                color="indigo"
                                size="28"
                                >
                                <img
                                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                                    alt="John"
                                >
                            </v-avatar>
                            <h3 style="margin-left:12px">Particpated</h3>
                           <span class="particpate" style="background-color:#5FAD62;">Core</span>
                           <span class="particpate" style="background-color:#FC9354;">Active</span>
                        </v-subheader>
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title><h3>Governance Proposal From Form GXChain 2.0 To REI Nework</h3></v-list-item-title>
                                <v-list-item-subtitle style="margin-top:12px">In 2017,Gxchain(Credible Chain)WasnLaunched On The Main Website,Aiming To Build A Value Network Of...</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
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
    border:none;
  }
  .total-rei{
    font-size: 28px;
    font-weight: 700;
    margin-top: 20px;
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
  .part-card{
      width:97%;
      margin-left: 1.5%;
      padding: 16px 0;
      background-color: transparent !important;
  }
  .particpate{
      height: 16px;
      line-height: 16px;
      background-color: #4856C0;
      border-radius: 10px;
      color: #FFF;
      padding: 0 12px;
      margin-left: 8px;
  }
  
}
@media screen and (max-width: 900px) {
    .accout-item{
    flex-direction: column;
    .balance-card{
      width: 100%;
    }
    .balance-card{
        display: flex;
        flex-direction: column;
    }
    .voting-stake{
        width: 94% !important;
    }
    .part-card{
      width:94% !important;
      margin-left: 3%;
  }
    
  }
}
</style>
