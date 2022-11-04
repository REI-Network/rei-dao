<template>
  <v-container :class="dark ? 'night stake' : 'daytime stake'">
    <div class="header-title">
      <h1>Asset</h1>
      <a class="title-detailed" target="_blank" href=""> REI Network. Including ERC20, ERC1155, ERC721</a>
    </div>
    <v-row>
      <v-col>
        <v-card class="asset-card">
          <h3>Total Token Assets</h3>
          <v-row>
            <v-tabs v-model="tab1" align-with-title class="erc-tabs" background-color="background">
              <v-tab style="margin-left:0;" key="11">ERC20</v-tab>
              <v-tab key="12">ERC721</v-tab>
              <v-tab key="13">ERC1155</v-tab>
            </v-tabs>
          </v-row>
          <v-tabs-items v-model="tab1">
            <v-row>
              <v-col>
                <v-tab-item key="11">
                  <v-data-table :headers="headers" :items="assetList" class="elevation-0" hide-default-footer :items-per-page="itemsPerPage" :loading="getListLoading" @click:row="walletDetails" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="page" @page-count="pageCount = $event">
                    <template v-slot:item.assets="{ item }">
                      <v-row align="center">
                        <div class="asset-logo">
                          <v-img :src="$IpfsGateway(item.logo)" width="30" height="30"></v-img>
                        </div>
                        <div>{{ item.symbol }}</div>
                      </v-row>
                    </template>
                    <template v-slot:item.price="{ item }">
                      <span>${{ item.price | asset(5) }}</span>
                    </template>
                    <template v-slot:item.balance="{ item }">
                      <span
                        >{{ item.balance | asset(4) }}
                        <v-tooltip right v-if="item.symbol == 'REI'">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                              <v-icon size="14">mdi-help-circle-outline</v-icon>
                            </v-btn>
                          </template>
                          <span>
                            Wallet: {{ assetFromWei(reiBalance) | asset(4) }}<br />
                            Voting: {{ assetFromWei(myTotalStake) | asset(4) }}<br />
                            Gas stake: {{ assetFromWei(totalGasAmount) | asset(4) }}
                          </span>
                        </v-tooltip>
                      </span>
                    </template>
                    <template v-slot:item.value="{ item }">
                      <span>${{ item.value | asset(5) }}</span>
                    </template>
                  </v-data-table>
                  <div class="text-center pt-2" v-if="assetList.length > 10">
                    <v-pagination v-model="page" :length="pageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
                  </div>
                </v-tab-item>
              </v-col>
            </v-row>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col> </v-col>
    </v-row>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { mapActions, mapGetters } from 'vuex';
import filters from '../filters';

export default {
  components: {},
  filters,
  data() {
    return {
      tab1: null,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      getListLoading: false,
      headers: [
        { text: 'Token', value: 'token' },
        { text: 'Price($)', value: 'price' },
        { text: 'Contract Address', value: 'address' },
        { text: 'Total Supply', value: 'total' },
        { text: 'Market Cap($)', value: 'market' },
        { text: 'Address Count', value: 'count' },
      ],
      assetList:[]
    };
  },
  computed: {
    ...mapGetters({
      dark: 'dark',
      connection: 'connection'
    })
  }
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
}
.daytime {
  //   background-color: #f3f4fa;
  // background: linear-gradient(180deg, #d6e3ff 0%, rgba(255, 255, 255, 0) 50%);
}
.night {
  background-color: #100d22;
}
.header-title {
  margin: 1.5rem 0;
  .title-detailed {
    font-size: 14px;
    color: #868e9e;
  }
  .title-detailed:hover {
    color: #6979f8;
    text-decoration: underline;
  }
}
.stake {
  padding-left: 40px;
  padding-right: 40px;
}
.asset-card {
  padding: 24px;
  .erc-tabs{
      margin:20px 0;
  }
}
@media screen and (max-width: 900px) {
  .stake {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
