<template>
  <v-container :class="dark ? 'night stake' : 'daytime stake'">
    <div class="header-title">
      <h1>Grants</h1>
      <span class="font-grey pointer" @click="routeLink()">Grants</span> / <span class="info-name">{{ projectDetails.project_name }}</span>
    </div>
    <v-row>
      <v-col>
        <v-card class="grants-detail">
          <v-row>
            <v-col cols="12" md="2">
              <v-img class="image" :src="`https://ipfs.io/ipfs/${projectDetails.project_logo}`" 
              lazy-src="../assets/images/logo_bg.png"
              aspect-ratio="1"
              />
              <template v-slot:placeholder>
                <v-row class="fill-height" align="center" justify="center">
                  <v-progress-circular indeterminate></v-progress-circular>
                </v-row>
              </template>
            </v-col>
            <v-col cols="12" md="5">
              <h3>{{ projectDetails.project_name }}</h3>
              <div class="gameFi">
                <span class="game-active">{{ projectDetails.categories }}</span>
                <a target="_blank" v-if="projectDetails.links && projectDetails.links.twitter" :href="projectDetails.links.twitter"><v-img class="img-icon" src="../assets/images/twitter.svg" width="24" height="24" /></a>
                <a target="_blank" v-if="projectDetails.links && projectDetails.links.discord" :href="projectDetails.links.discord"><v-img class="img-icon" src="../assets/images/circle-icon.svg" width="24" height="24" /></a>
                <a target="_blank" v-if="projectDetails.links && projectDetails.links.telegram" :href="projectDetails.links.telegram"><v-img class="img-icon" src="../assets/images/telegram.svg" width="24" height="24" /></a>
              </div>
              <div class="font-grey describe">{{ projectDetails.project_desc }}</div>
              <v-btn width="120" target="_blank" v-if="projectDetails.links && projectDetails.links.website" :href="projectDetails.links.website"> Go </v-btn>
            </v-col>
            <v-col cols="12" md="5">
              <v-img class="image" :src="`https://ipfs.io/ipfs/${projectDetails.screenshot}`" height="250" 
              lazy-src="../assets/images/Detail_bg.png"
              />
            </v-col>
          </v-row>
        </v-card>
        <v-card class="data-card">
          <v-row>
            <v-col cols="12" sm="4">
              <v-row justify="start" align="center">
                <v-col cols="12" md="2" style="padding-right: 0">
                  <v-img src="../assets/images/grants-token.png" height="40" width="40"></v-img>
                </v-col>
                <v-col>
                  <a 
                  v-if="projectDetails.project_token && projectDetails.project_token.contract_address"
                  :class="dark?'dark-token':'light-token'"
                  target="_blank"
                  :href="`https://scan.rei.network/address/${projectDetails.project_token.contract_address}`">
                    <h2 v-if="projectDetails.project_token && projectDetails.project_token.symbol">{{ projectDetails.project_token.symbol }}</h2>
                  </a>
                  <div class="font-grey">Token</div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="4">
              <v-row justify="start" align="center">
                <v-col cols="12" md="2" style="padding-right: 0">
                  <v-img src="../assets/images/grants-went.png" height="40" width="40"></v-img>
                </v-col>
                <v-col>
                  <h2>{{ projectDetails.published_on }}</h2>
                  <div class="font-grey">Went live on</div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="4">
              <v-row justify="start" align="center">
                <v-col cols="12" md="2" style="padding-right: 0">
                  <v-img src="../assets/images/grants-sponsored.png" height="40" width="40"></v-img>
                </v-col>
                <v-col>
                  <h2>{{ sponsored | asset(2) }}&nbsp;<span class="font-grey">REI</span></h2>
                  <div class="font-grey">Sponsored</div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
        <v-card class="payment">
          <v-row justify="space-between">
            <v-col style="margin-bottom: 20px">
              <h3>Payment Detail</h3>
            </v-col>
          </v-row>
          <v-data-table :headers="headers" :items="paymentList" class="elevation-0" hide-default-footer :items-per-page="itemsPerPage" :loading="paymentListLoading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="page" @page-count="pageCount = $event">
            <template v-slot:item.hash="{ item }">
              <v-row align="center">
                <a target="_blank" :class="dark?'dark-token':'light-token'" :href="`https://scan.rei.network/tx/${item.hash}`">
                  <div>{{ item.hash | addr }}</div>
                </a>
              </v-row>
            </template>
            <template v-slot:item.time="{ item }">
              <span>{{ (item.timeStamp * 1000) | dateFormat('YYYY-MM-dd hh:mm:ss') }}</span>
            </template>
          </v-data-table>
          <div class="text-center pt-2" v-if="paymentList.length > 6">
            <v-pagination v-model="page" :length="pageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
          </div>
        </v-card>
        <v-card class="evaluation-card">
          <h3>Assessment</h3>
          <div class="font-grey evaluation">{{ projectDetails.project_comments }}</div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <GrantsEvaluation></GrantsEvaluation>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Web3 from 'web3';
import { mapActions, mapGetters } from 'vuex';
import filters from '../filters';
import GrantsEvaluation from '../components/GrantsEvaluation';
import find from 'lodash/find';

const projectsList = require('../../src/grantsInfo/projectList.json');

export default {
  components: {
    GrantsEvaluation
  },
  filters,
  data() {
    return {
      page: 1,
      pageCount: 1,
      itemsPerPage: 20,
      paymentListLoading: false,
      projectDetails: '',
      sponsored: 0,
      headers: [
        { text: 'Rounds', value: 'rounds' },
        { text: 'Txn Hash', value: 'hash' },
        { text: 'Payment time', value: 'time' },
        { text: 'Amount(REI)', value: 'amount' }
        // { text: 'State', value: 'state' },
      ],
      paymentList: []
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
    routeLink() {
      this.$router.back();
    },
    async getProjects() {
      let list = projectsList.list;
      let detail = find(list, (item) => item.id == this.$route.query.id);
      this.projectDetails = detail;
      let transferList = this.projectDetails.transfer_record;
      this.paymentList = [];
      for (let i = 0; i < transferList.length; i++) {
        const { data } = await this.$axios.get(`https://scan.rei.network/api?module=transaction&action=gettxinfo&txhash=${transferList[i].tx_id}`);
        let result = data.result;
        (result.rounds = transferList[i].name), this.paymentList.push(result);
        (this.sponsored = 0),
          (this.paymentList = this.paymentList.map((item) => {
            let amount = web3.utils.fromWei(web3.utils.toBN(item.value));
            this.sponsored += Number(amount);
            // console.log('paymentList',this.paymentList)
            return {
              ...item,
              amount: amount
            };
          }));
      }
    }
  }
};
</script>

<style scoped lang="scss">
.daytime {
  // background: linear-gradient(180deg, #d6e3ff 0%, rgba(255, 255, 255, 0) 50%);
}
.night {
  background-color: #100d22;
}
.font-grey {
  font-size: 14px;
  color: #868e9e;
  font-weight: normal;
}
.pointer {
  cursor: pointer;
}
.dark-token{
  color: #fff;
}
.light-token{
  color:#000;
}
a:hover{
  color: #6979f8;
  text-decoration: underline;
}
.pointer:hover {
  color: #6979f8;
  text-decoration: underline;
}
.header-title {
  margin: 1.5rem 0;
}
.stake {
  padding-left: 40px;
  padding-right: 40px;
}
.info-name {
  font-weight: 500;
}
.v-btn.v-btn--has-bg {
  background-color: #6979f8;
  color: #fff;
  margin-top: 20px;
}
.grants-detail {
  margin-top: 20px;
  padding: 30px;
  .gameFi {
    display: flex;
    align-items: center;
    margin-top: 12px;
    margin-bottom: 20px;
    a {
      margin-left: 8px;
    }
  }
  .image{
    border-radius: 4px;
  }
  // .describe {
  //   line-height: 24px;
  // }
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
.payment {
  margin-top: 40px;
  padding: 20px;
  .title {
    margin-bottom: 20px;
  }
}
.evaluation-card {
  padding: 20px;
  margin-top: 40px;
}
.evaluation {
  margin-top: 20px;
  line-height: 28px;
}
@media screen and (max-width: 900px) {
  .stake {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
