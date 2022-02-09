<template>
  <v-container class="stake_background">
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <v-row>
        <v-col cols="12" md="12" sm="12" class="gasStake-total"> 
            <v-card
                class="mx-auto total-progress"
                tile
                color="background"
            >
                <h3>Resources Of 0x69...sb2B</h3>
                <div class="stake-name">Deposit REI Gets Crude</div>
                <v-row >
                    <v-col class="row-circular">
                        <div class="circular">
                        <v-progress-circular
                            :rotate="270"
                            :size="128"
                            :width="22"
                            :value="value"
                            color="#4CC7B6"
                            > 
                            {{value}}
                        </v-progress-circular>
                        <h4>0.025</h4>
                        <div class="stake-name">Daily Free Fee(Crude)</div>
                    </div>
                    <div class="circular">
                        <v-progress-circular
                            :rotate="270"
                            :size="128"
                            :width="22"
                            :value="45"
                            color="#64B5FF"
                            
                            > 
                            {{value1}}
                        </v-progress-circular>
                        <h4>2.722</h4>
                        <div class="stake-name">Left Crude</div>
                    </div>
                    <div class="circular">
                        <v-progress-circular
                            :rotate="270"
                            :size="128"
                            :width="22"
                            :value="10.78"
                            color="#FF9743"
                            > 
                            {{value2}}
                        </v-progress-circular>
                        <h4>0.000047</h4>
                        <div class="stake-name">Crude Used</div>
                    </div>
                    </v-col>
                </v-row>  
                <div class="update-time">
                    <v-icon
                        color="primary"
                        size="12"
                    >
                       mdi-clock-time-ten-outline
                    </v-icon>
                    1h Ago
                </div>  
            </v-card>
            <v-card
                class="middle-btn"
                tile
                color="background"
            >
               <div class="total-rei">11112.200<span class="rei">REI</span></div> 
               <div class="stake-name">Total Staked</div>
               <v-btn
                    tile
                    color='vote_button'
                    class="stake-btn"
                >
                    Gas stake
                </v-btn>        
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
        value:'100%',
        value1:'45%',
        value2:'10.78%',
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
.v-progress-circular {
  margin: 1rem;
}
.row-circular{
        display:flex;
        // justify-content: space-around;
    }
.circular{
    text-align: center;
    margin-top: 24px;
    // margin-left: 16px;
    // margin-right: 16px;
}
.stake-name{
    font-size: 12px;

}
.total-progress{
   padding:28px;
   margin:0;
   width:62%;
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
}
@media screen and (max-width: 900px) {
    .total-progress{
        overflow-x: scroll;
        width: 100%;
    }
    .row-circular{
        display:flex;
        flex-direction: row !important;
        max-width: 100%;
    }
    .gasStake-total{
        display: flex;
        flex-direction: column;
        justify-content:space-between;
        padding: 0;
    }
    .circular{
        margin-left: 60px !important;
        margin-right: 50px !important;
    }
    .middle-btn{
        width: 100%;
        margin-top: 20px;
        padding:20px 0;
    }
}
</style>
