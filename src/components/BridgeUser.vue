<template>
  <v-container style="padding: 0">
    <v-card class="bridge-user">
      <h3>Bridge asset Management on REI Network</h3>
      <v-tabs v-model="tab" align-with-title hide-slider class="vote-list" background-color="background">
        <v-radio-group v-model="radios" mandatory row dense style="margin-top: 0" class="trend-tab">
          <v-tab key="1"> <v-radio label="Cbridge" value="1" class="trends-radio"> </v-radio></v-tab>
          <v-tab key="2"> <v-radio label="Multichain" value="2" class="trends-radio"> </v-radio></v-tab>
        </v-radio-group>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item key="1" >
          <v-row class="background">
            <v-col>
               <v-data-table
                  :headers="headers"
                  :items="bridgeList"
                  class="background elevation-0"
                  hide-default-footer
                  :items-per-page="itemsPerPage"
                  :loading="stakeListLoading"
                  :loading-text="$t('msg.loading')"
                  :page.sync="page"
                  @page-count="pageCount = $event"
                >
                  <template v-slot:item.label="{ item }">
                    <div class="bridge-label">
                        <div class="left-img">
                          <v-img src="../assets/images/rei.svg" class="logo-img"  height="24" width="24"/>
                        </div>
                        <span class="label-text">{{ item.label }}</span>
                        <v-icon size="16">mdi-open-in-new</v-icon>
                    </div>
                  </template>
                  <template v-slot:item.target="{ item }">
                     <div class="bridge-label">
                        <div class="left-img">
                          <v-img src="../assets/images/total.png" class="logo-img"  height="24" width="24"/>
                        </div>
                        <span class="label-text">{{ item.target }}</span>
                    </div>
                  </template>
                  <template v-slot:item.minter="{ item }">
                    <v-row justify="space-between" class="minter-cap">
                      <span>Used Amount: 360,510.69</span>
                      <span>Max: 10M USDT</span>
                    </v-row>
                    <v-progress-linear color="#6979F8" rounded background-color="#F5F5F5" :value="item.minter"></v-progress-linear>
                    <div class="process">
                      <div>0</div>
                      <div :style="{marginLeft:item.menuUp+'%'}">
                        <v-icon color="#6979F8">mdi-menu-up</v-icon>
                        <span>{{item.minter}}%</span>
                      </div>
                    </div>
                  </template>
                  <!-- <template v-slot:item="{ item }">
     
                  </template> -->
                </v-data-table>
                <div class="text-pagination pt-2" v-if="bridgeList.length > 0">
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
        </v-tab-item>
        <v-tab-item key="2" >
          <v-row class="background">
            <v-col>
               <v-data-table
                  :headers="headers"
                  :items="bridgeList"
                  class="background elevation-0"
                  hide-default-footer
                  :items-per-page="itemsPerPage"
                  :loading="stakeListLoading"
                  :loading-text="$t('msg.loading')"
                  :page.sync="page"
                  @page-count="pageCount = $event"
                >
                  <template v-slot:item.label="{ item }">
                    <div class="bridge-label">
                        <div class="left-img">
                          <v-img src="../assets/images/rei.svg" class="logo-img"  height="24" width="24"/>
                        </div>
                        <span class="label-text">{{ item.label }}</span>
                        <v-icon size="16">mdi-open-in-new</v-icon>
                    </div>
                  </template>
                  <template v-slot:item.target="{ item }">
                     <div class="bridge-label">
                        <div class="left-img">
                          <v-img src="../assets/images/total.png" class="logo-img"  height="24" width="24"/>
                        </div>
                        <span class="label-text">{{ item.target }}</span>
                    </div>
                  </template>
                  <template v-slot:item.minter="{ item }">
                    <v-row justify="space-between" class="minter-cap">
                      <span>Used Amount: 360,510.69</span>
                      <span>Max: 10M USDT</span>
                    </v-row>
                    <v-progress-linear color="#6979F8" rounded background-color="#F5F5F5" :value="item.minter"></v-progress-linear>
                    <div class="process">
                      <div>0</div>
                      <div :style="{marginLeft:item.menuUp+'%'}">
                        <v-icon color="#6979F8">mdi-menu-up</v-icon>
                        <span>{{item.minter}}%</span>
                      </div>
                    </div>
                  </template>
                </v-data-table>
                <div class="text-pagination pt-2" v-if="bridgeList.length > 0">
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
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

export default {
  data() {
    return {
      tab: '1',
      radios: null,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      menuUp:0,
      stakeListLoading: false,
      headers: [
            {text:'Label', value: 'label'},
            { text: 'Target Chain', value: 'target' },
            { text: 'Minter Cap', value: 'minter' },
        ],
        bridgeList:[
          {
            label:"USDT",
            target:"Binance Smart Chain",
            minter:60,
          },
          {
            label:"USDT",
            target:"Binance Smart Chain",
            minter:88,
          }
        ]
    };
  },
  watch: {},
  mounted() {
    this.getBridgeList()
  },
  computed: {},
  methods: {
    getBridgeList(){
      this.bridgeList = this.bridgeList.map((item) => {
        let menuUp = item.minter-5
        return{
          ...item,
          menuUp:menuUp
        }
      })
    }
  }
};
</script>

<style scoped lang="scss">
.vote-list{
  margin-top:30px;
}
.bridge-user {
  padding: 20px;
  .v-tab {
    text-transform: none !important;
    margin-left: 0 !important;
  }
  .theme--dark.v-application .text-pagination[data-v-b6724c44][data-v-b6724c44]{
    background-color:#1d1a36;
  }
  .bridge-label{
    display: flex;
    align-items: center;
    .left-img{
      height: 24px;
      width: 24px;
    }
    .label-text{
      margin-left: 13px;
      margin-right: 38px;
    }
  }
  .minter-cap{
    padding: 12px;
    font-size: 12px;
  }
  .process{
    font-size: 12px;
    display: flex;
  }
}
@media screen and (max-width: 900px) {
}
</style>
