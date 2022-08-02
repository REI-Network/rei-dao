<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-tabs v-model="tab1" align-with-title class="vote-list" background-color="background">
          <v-tab key="11" class="v-tab-left">All Delegators</v-tab>
          <v-tab key="12">My votes</v-tab>
          <v-tab key="13">My Withdrawals</v-tab>
        </v-tabs>
        <v-divider class="faq_border" />
        <v-tabs-items v-model="tab1">
          <v-tab-item key="11">
              <v-data-table 
                :headers="headers" 
                :items="delegatorList" 
                class="elevation-0" 
                hide-default-footer 
                :items-per-page="itemsPerPage" 
                :loading="stakeListLoading" 
                :no-data-text="$t('msg.nodatatext')" 
                :loading-text="$t('msg.loading')"
                page.sync="page" 
                @page-count="pageCount = $event">
                <template v-slot:item.delegator="{ item }">
                    <v-img :src="item.img" weight="24" height="24" />
                    <span>{{ item.delegator }}</span>
                    <span class="mine">mine</span>
                </template>
              </v-data-table>
              <div class="text-center pt-2" v-if="delegatorList.length > 0">
                  <v-pagination 
                    v-model="page" 
                    :length="pageCount" 
                    color="vote_button" 
                    background-color="start_unstake" 
                    class="v-pagination" 
                    total-visible="6">
                    </v-pagination>
                </div>
          </v-tab-item>
          <v-tab-item key="12">
              <v-data-table 
                :headers="myVotesHeaders" 
                :items="myVotesList" 
                class="elevation-0" 
                hide-default-footer 
                :items-per-page="itemsPerPage" 
                :loading="stakeListLoading" 
                :no-data-text="$t('msg.nodatatext')" 
                :loading-text="$t('msg.loading')"
                page.sync="page" 
                @page-count="pageCount = $event">
                <template v-slot:item.time="{ item }">
                    <span>{{ item.time }}</span>
                </template>
                <template v-slot:item.amount="{ item }">
                    <span>+{{ item.amount | asset(2) }}</span>
                </template>
              </v-data-table>
              <div class="text-center pt-2" v-if="myVotesList.length > 0">
                  <v-pagination 
                    v-model="page" 
                    :length="pageCount" 
                    color="vote_button" 
                    background-color="start_unstake" 
                    class="v-pagination" 
                    total-visible="6">
                    </v-pagination>
                </div>
          </v-tab-item>
          <v-tab-item key="13">
              <v-data-table 
                :headers="myWithHeaders" 
                :items="myWithdrawalsList" 
                class="elevation-0" 
                hide-default-footer 
                :items-per-page="itemsPerPage" 
                :loading="stakeListLoading" 
                :no-data-text="$t('msg.nodatatext')" 
                :loading-text="$t('msg.loading')"
                page.sync="page" 
                @page-count="pageCount = $event">
                <template v-slot:item.time="{ item }">
                    <v-img :src="item.img" weight="24" height="24" />
                    <span>{{ item.time }}</span>
                </template>
                 <template v-slot:item.amount="{ item }">
                    - <span>{{ item.amount }}</span>
                </template>
              </v-data-table>
              <div class="text-center pt-2" v-if="myWithdrawalsList.length > 0">
                  <v-pagination 
                    v-model="page" 
                    :length="pageCount" 
                    color="vote_button" 
                    background-color="start_unstake" 
                    class="v-pagination" 
                    total-visible="6">
                    </v-pagination>
                </div>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import filters from '../filters';
export default {
    filters,
  data() {
    return {
     tab1:null,
     page: 1,
     pageCount: 0,
     itemsPerPage: 20,
     stakeListLoading: false,
     headers:[
        { text: "Delegators", value: 'delegator' },
        { text: "Amount ($REI)", value: 'amount' },
     ],
     delegatorList:[
         {
            img:"../assets/images/closed.png",
            delegator:"0xADbBf74bc8d9CFfeC78526169cd81FdcBbA35eC2",
            amount:487.23
         },
          {
            img:"../assets/images/core.png",
            delegator:"0xADbBf74bc8d9CFfeC78526169cd81FdcBbA35eC2",
            amount:487.23
         }
     ],
     myVotesHeaders:[
        { text: "Time", value: 'time' },
        { text: "Amount ($REI)", value: 'amount' },
     ],
     myVotesList:[
         {
            time:"2022-12-19 12:30",
            amount:121545.00
         },
          {
            time:"2022-12-19 12:30",
            amount:121545.00
         }
     ],
     myWithHeaders:[
        { text: "Time", value: 'time' },
        { text: "Amount ($REI)", value: 'amount' },
     ],
     myWithdrawalsList:[
         {
            time:"2022-12-19 12:30",
            amount:121545.00
         },
          {
            time:"2022-12-19 12:30",
            amount:121545.00
         }
     ]
    };
  },
  computed: {
    ...mapGetters({
        connection: 'connection',
        dark: 'dark'
    })
  },
  mounted(){
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.vote-list {
  position: relative;
  .v-tab-left {
    margin-left: 0 !important;
  }
}
.v-tab {
  text-transform: none !important;
}
.v-pagination {
  display: inline-flex !important;
  justify-content: flex-end !important;
}
.v-application .text-center {
  text-align: right !important;
}
.mine{
    background-color: #FC9354;
    padding: 1px 8px;
    color: #fff;
    border-radius: 12px;
}
</style>
