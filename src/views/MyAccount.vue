<template>
  <v-container class="stake_background" style="padding: 0">
    <!-- <div class="header-title">
      <h1>My Account</h1>
      <div class="title-detailed">Details about your account, balances, and voting</div>
    </div> -->
    <v-card :class="dark ? 'night account-header' : 'daytime account-header'">
      <v-row>
        <v-col cols="12" md="7">
          <div class="left-address">
            <div>
              <v-img src="../assets/images/rei.svg" width="80" height="80"></v-img>
            </div>
            <div class="my-address">{{ this.connection.address }}</div>
            <v-icon size="16">mdi-content-copy</v-icon>
          </div>
        </v-col>
        <v-col cols="12" md="4" class="balance">
          <div class="title">
            <div>balance</div>
            <v-icon color="#FFF">mdi-sync</v-icon>
          </div>
          <h2>$756,841.69</h2>
        </v-col>
      </v-row>
      <v-tabs v-model="tab1" align-with-title class="vote-list" background-color="background">
        <v-tab key="11">Portfolio</v-tab>
        <v-tab key="12">NFTs</v-tab>
        <v-tab key="13">DAOs</v-tab>
      </v-tabs>
    </v-card>
    <v-tabs-items v-model="tab1">
      <v-row :class="dark ? 'night' : 'daytime'">
        <v-col class="myAccount">
          <v-tab-item key="11">
            <v-card class="wallet-table">
              <v-row justify="space-between">
                <v-col>
                  <span class="title">Wallet</span>
                  <v-icon size="16" class="wallet-icon" style="margin-bottom: 6px">mdi-help-circle-outline</v-icon>
                </v-col>
                <v-col style="text-align: right">
                  <v-icon size="16" class="wallet-icon">mdi-arrow-up-thin-circle-outline</v-icon>
                  <span class="font-grey">Submit a token support here</span>
                </v-col>
              </v-row>
              <v-data-table :headers="headers" :items="folderList" class="elevation-0" hide-default-footer :items-per-page="itemsPerPage" :loading="stakeListLoading" :no-data-text="$t('msg.nodatatext')" :loading-text="$t('msg.loading')" :page.sync="page" @page-count="pageCount = $event">
                <template v-slot:item.assets="{ item }">
                  <v-row align="center">
                    <div class="asset-logo">
                      <v-img src="../assets/images/rei.svg" width="30" height="30"></v-img>
                    </div>
                    <div>{{ item.assets }}</div>
                  </v-row>
                </template>
                <template v-slot:item.price="{ item }">
                  <span>${{ item.price | asset(2) }}</span>
                </template>
                <template v-slot:item.balance="{ item }">
                  <span>{{ item.balance | asset(2) }}</span>
                </template>
                <template v-slot:item.value="{ item }">
                  <span>${{ item.value | asset(2) }}</span>
                </template>
              </v-data-table>
              <div class="text-center pt-2" v-if="folderList.length > 0">
                <v-pagination v-model="page" :length="pageCount" color="vote_button" background-color="start_unstake" class="v-pagination" total-visible="6"> </v-pagination>
              </div>
            </v-card>
          </v-tab-item>
          <v-tab-item key="12">
            <v-row>
              <v-col>
                <MyAccountNFT></MyAccountNFT>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item key="13">
            <v-row>
              <v-col>
                <MyAccountBalance></MyAccountBalance>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <MyAccountCrude></MyAccountCrude>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-col>
      </v-row>
    </v-tabs-items>
    <!-- <v-row>
      <v-col>
          <MyAccountBalance></MyAccountBalance>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <MyAccountCrude></MyAccountCrude>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <MyAccountNFT></MyAccountNFT>
      </v-col>
    </v-row> -->
  </v-container>
</template>
<script>
import MyAccountBalance from '../components/MyAccountBalance';
import MyAccountCrude from '../components/MyAccountCrude';
import MyAccountNFT from '../components/MyAccountNFT';
import { mapGetters } from 'vuex';
// import MyAccountProposals from '../components/MyAccountProposals';

import filters from '../filters';
export default {
  components: {
    MyAccountBalance,
    MyAccountCrude,
    MyAccountNFT
  },
  filters,
  data() {
    return {
      tab1: null,
      page: 1,
      pageCount: 0,
      itemsPerPage: 6,
      stakeListLoading: false,
      headers: [
        { text: 'Assets', value: 'assets' },
        { text: 'Price', value: 'price' },
        { text: 'Balance', value: 'balance' },
        { text: 'Value', value: 'value' }
      ],
      folderList: [
        {
          logo: '../assets/images/rei.svg',
          assets: 'REI',
          price: 1,
          balance: 100000000,
          value: 100000000
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      connection: 'connection',
      dark: 'dark'
    })
  }
};
</script>

<style scoped lang="scss">
.v-tab {
  text-transform: none !important;
  
}
.daytime {
  background-color: #f3f4fa;
}
.night {
  background-color: #100d22;
}
.theme--light.v-slide-group__content {
  background-color: #f3f4fa !important;
}
.v-application--is-ltr .v-tabs--align-with-title > .v-tabs-bar:not(.v-tabs-bar--show-arrows):not(.v-slide-group--is-overflowing) > .v-slide-group__wrapper > .v-tabs-bar__content > .v-tab:first-child,
.v-application--is-ltr .v-tabs--align-with-title > .v-tabs-bar:not(.v-tabs-bar--show-arrows):not(.v-slide-group--is-overflowing) > .v-slide-group__wrapper > .v-tabs-bar__content > .v-tabs-slider-wrapper + .v-tab {
  margin-left: 0 !important;
}
.header-title {
  margin: 1.5rem 0;
  .title-detailed {
    font-size: 14px;
    color: #868e9e;
  }
}
.myAccount {
  padding: 52px;
}
.account-header {
  padding-top: 60px;
  padding-left: 40px;
  .left-address {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .my-address {
      font-weight: bold;
      margin: 0 10px;
    }
  }
  .balance {
    padding: 26px;
    color: #fff;
    background-color: #6979f8;
    .title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
    }
  }
}
.font-grey {
  font-size: 14px;
  color: #868e9e;
}
.wallet-table {
  padding: 40px;
  .title {
    font-weight: 500;
  }
  .wallet-icon {
    margin: 0 8px;
  }
}
.asset-logo{
    margin: 0 12px;
}
@media screen and (max-width: 900px) {
  .myAccount {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
