<template>
  <v-container>
    <v-card class="grants-detail">
      <v-row>
        <v-col cols="12" md="2">
          <v-img src="../assets/images/Genesis.png" />
        </v-col>
        <v-col cols="12" md="5">
          <h3>{{ projectDetails.project_name}}</h3>
          <div class="gameFi">
            <span class="game-active">{{ projectDetails.categories}}</span>
            <a target="_blank" href=""><v-img class="img-icon" src="../assets/images/twitter.svg" width="24" height="24"/></a>
            <a target="_blank"><v-img class="img-icon" src="../assets/images/circle-icon.svg" width="24" height="24" /></a>
            <a target="_blank"><v-img class="img-icon" src="../assets/images/telegram.svg" width="24" height="24"/></a>
          </div>
          <div class="font-grey describe">{{ projectDetails.project_desc}}</div>
          <v-btn width="120"> Go </v-btn>
        </v-col>
        <v-col cols="12" md="5">
          <v-img src="../assets/images/Introduction.png" height="250" />
        </v-col>
      </v-row>
    </v-card>
    <v-card class="data-card">
      <v-row>
        <v-col cols="12" sm="4">
          <h2>PB</h2>
          <div class="font-grey">Token</div>
        </v-col>
        <v-col cols="12" sm="4">
          <h2>{{ projectDetails.published_on }}</h2>
          <div class="font-grey">Went live on</div>
        </v-col>
        <v-col cols="12" sm="4">
          <h2>{{ projectDetails.sponsored_amount | asset(0) }}&nbsp;&nbsp;<span class="font-grey">REI</span></h2>
          <div class="font-grey">Sponsored</div>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="payment">
      <v-row justify="space-between">
        <v-col style="margin-bottom:20px">
          <h3>Payment Detail</h3>
        </v-col>
      </v-row>
      <v-data-table :headers="headers" :items="paymentList" class="elevation-0" hide-default-footer :items-per-page="itemsPerPage" :loading="paymentListLoading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="page" @page-count="pageCount = $event">
        <template v-slot:item.hash="{ item }">
          <v-row align="center">
            <div>{{ item.hash | addr }}</div>

          </v-row>
        </template>
        <!-- <template v-slot:item.state="{ item }">
          <span style="color:orange">{{ item.state }}</span>
        </template> -->
      </v-data-table>
      <div class="text-center pt-2" v-if="paymentList.length > 0">
        <v-pagination v-model="page" :length="pageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
      </div>
    </v-card>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { mapActions, mapGetters } from 'vuex';
import filters from '../filters';
import find from 'lodash/find';

const projectsList = require('../../src/grantsInfo/projectList.json')

export default {
  components: {
  },
  filters,
  data() {
    return {
      page: 1,
      pageCount: 1,
      itemsPerPage: 20,
      paymentListLoading:false,
      projectDetails:"",
      headers: [
        { text: 'Rounds', value: 'rounds' },
        { text: 'Txn Hash', value: 'hash' },
        { text: 'Payment time', value: 'time' },
        { text: 'Amount(REI)', value: 'amount' },
        // { text: 'State', value: 'state' },
      ],
      paymentList: [
          {
              rounds:"Round1",
              hash:"0xa85a362b28e9fc4cc77668eebd8e51f1fb7f1633",
              time:"04/06/2022 15:30:26",
              amount:"10,000",
              state:"success"
          },
          {
              rounds:"Round2",
              hash:"0xa85a362b28e9fc4cc77668eebd8e51f1fb7f1633",
              time:"04/06/2022 15:30:26",
              amount:"10,000",
              state:"success"
          }
      ]
    };
  },
  computed: {
    ...mapGetters({
      dark: 'dark',
      connection: 'connection'
    })
  },
  mounted() {
    this.getProjects();
  },
  methods: {
     async getProjects(){
      let list = projectsList.list;
      let detail = find(list, (item) => item.id == this.$route.query.id);
      this.projectDetails = detail
       console.log('list',list)
      console.log('id',this.$route.query.id)
      console.log('details',detail)
    },
  }
};
</script>

<style scoped lang="scss">
.v-btn.v-btn--has-bg {
  background-color: #6979f8;
  color: #fff;
  margin-top: 20px;
}
.font-grey {
  font-size: 14px;
  color: #868e9e;
  font-weight: normal;
}
.grants-detail {
  padding: 30px;
  .gameFi {
    display: flex;
    align-items: center;
    margin-top: 12px;
    margin-bottom: 20px;
    a{
      margin-left:8px;
    }
  }
  .describe {
    line-height: 24px;
  }
  .game-active {
    padding: 2px 12px;
    background: #54bbfc;
    border-radius: 20px;
    color: #fff;
  }
}
.data-card {
  padding: 30px;
  margin-top: 40px;
}
.payment{
    margin-top:40px;
    padding: 20px;
    .title{
        margin-bottom:20px;
    }
}
@media screen and (max-width: 900px) {
}
</style>
