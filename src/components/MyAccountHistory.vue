<template>
  <v-container class="stake_background" style="padding: 0">
    <v-row justify="space-between">
      <v-col cols="12" md="3">
        <v-card outlined class="select-card">
          <v-menu ref="startMenu" v-model="startMenu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="startFormatted" label="Start Time" outlined dense v-bind="attrs" v-on="on" style="border-radius: 20px" class="font-grey"></v-text-field>
            </template>
            <v-date-picker v-model="startDate" no-title @input="startMenu = false">{{ startDate }}</v-date-picker>
          </v-menu>
          <v-icon class="right-icon">mdi-menu-right</v-icon>
          <v-menu ref="endMenu" v-model="endMenu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="endFormatted" label="End Time" outlined dense v-bind="attrs" v-on="on" style="border-radius: 20px" class="font-grey"></v-text-field>
            </template>
            <v-date-picker v-model="endDate" no-title @input="endMenu = false"></v-date-picker>
          </v-menu>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-row>
          <v-col cols="12" sm="6">
            <v-card outlined class="select-card">
              <v-select class="d-select" :items="typeItems" label="All Types" item-text="state" item-value="val" outlined dense style="border-radius: 20px" v-model="typeFilter" @change="changeStateType"></v-select>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card outlined class="select-card">
              <v-select class="d-select" :items="tokenItems" label="All Tokens" item-text="state" outlined item-value="val" dense style="border-radius: 20px" v-model="tokenFilter" @change="changeStateToken"></v-select>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div>
      <v-data-iterator :items="list" hide-default-footer :loading="loading" no-data-text="No data" loading-text="" :class="this.historyList.length !== 0 ? 'data-this.list' : 'data-nft'">
        <template v-slot:item="{ item }">
          <h3>{{ item.date }}</h3>
          <v-card class="card-item" v-for="(info, index) in item.result" :key="item.date + '-' + index" @click="openDetails(info)">
            <v-row>
              <v-col cols="12" sm="3" class="left-item">
                <div class="img" v-if="info.type == 'Send'">
                  <v-img src="../assets/images/history-4.png" width="40" />
                </div>
                <div class="img" v-else>
                  <v-img src="../assets/images/history-2.png" width="40" />
                </div>
                <div>
                  <div class="font-grey">{{ info.type }}</div>
                  <h4>{{ (info.timeStamp * 1000) | dateFormat('hh:ss:mm') }}</h4>
                </div>
              </v-col>
              <v-col cols="12" sm="3" v-if="info.type == 'Send'">
                <div class="font-grey">To</div>
                <h4 v-if="info.addressName">{{ info.addressName }}</h4>
                <h4 v-else>{{ info.to | addr }}</h4>
              </v-col>
              <v-col cols="12" sm="3" v-else>
                <div class="font-grey">From</div>
                <h4 v-if="info.addressName">{{ info.addressName }}</h4>
                <h4 v-else>{{ info.from | addr }}</h4>
              </v-col>
              <v-col cols="12" sm="3">
                <h4>{{ info.value | asset(5) }}</h4>
                <div class="font-grey token-symbol" v-if="info.tokenSymbol">{{ info.tokenSymbol }}</div>
                <div class="font-grey" v-else>REI</div>
              </v-col>
              <v-col cols="12" sm="3">
                <div class="font-grey gas-fee">
                  <span>Gas Fee</span>
                  <div class="img">
                    <v-img src="../assets/images/history-3.png" width="20" />
                  </div>
                </div>
                <h4>{{ info.gasUsed }} REI</h4>
              </v-col>
            </v-row>
          </v-card>
        </template>
      </v-data-iterator>
      <v-card v-if="skeletonLoading == true" style="padding: 20px; margin-top: 20px">
        <v-row justify="space-between">
          <v-col cols="12" sm="2" v-for="n in 4" :key="n">
            <v-skeleton-loader class="skeleton" :loading="skeletonLoading" type="text@2"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-card>
      <v-card v-if="skeletonLoading == true" style="padding: 20px; margin-top: 28px">
        <v-row justify="space-between">
          <v-col cols="12" sm="2" v-for="n in 4" :key="n">
            <v-skeleton-loader class="skeleton" :loading="skeletonLoading" type="text@2"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <v-dialog v-model="dialog" width="600" class="dialog-card">
      <v-card :class="dark ? 'dialog-night' : 'dialog-daytime'">
        <v-row justify="space-between" align="center" no-gutters>
          <div class="gas-fee">
            <h3>Transaction Details</h3>
            <a :href="`https://scan.rei.network/tx/${details.hash}`" target="_blank" class="img">
              <v-img src="../assets/images/history-1.png" width="20" />
            </a>
          </div>
          <div @click="cancelDetails" class="close-dialog">
            <v-icon size="22">mdi-close</v-icon>
          </div>
        </v-row>
        <div class="font-grey">{{ (details.timeStamp * 1000) | dateFormat('YYYY-MM-dd hh:ss:mm') }}</div>
        <v-card :class="dark ? 'chip-dark' : 'chip-light elevation-0 '">
          <v-row justify="space-between" no-gutter class="item-content">
            <div class="item-name">Block number</div>
            <div class="item-data">{{ details.blockNumber }}</div>
          </v-row>
          <v-row justify="space-between" v-if="details.from == address" no-gutter class="item-content">
            <div class="item-name">To</div>
            <div class="item-data">{{ details.to }}</div>
          </v-row>
          <v-row justify="space-between" v-else no-gutter class="item-content">
            <div class="item-name">From</div>
            <div class="item-data">{{ details.from }}</div>
          </v-row>
          <v-row justify="space-between" no-gutter class="item-content">
            <div class="item-name">Transaction fee</div>
            <div class="item-data">{{ details.gasUsed }} REI</div>
          </v-row>
          <v-row justify="space-between" no-gutter class="item-content" v-if="details.gasPrice">
            <div class="item-name">Gas Price</div>
            <div class="item-data">{{ details.gasPrice }} Gwei</div>
          </v-row>
          <v-row justify="space-between" no-gutter class="item-content" v-if="details.nonce">
            <div class="item-name">Nonce</div>
            <div class="item-data">{{ details.nonce }}</div>
          </v-row>
        </v-card>
        <div class="receive">
          <div class="font-grey">{{ details.type }}</div>
          <v-row align="center" class="value-symbol" no-gutters>
            <div class="price">{{ details.value | asset(5) }}</div>
            <div class="token-symbol" v-if="details.tokenSymbol">&nbsp;&nbsp;{{ details.tokenSymbol }}</div>
            <div v-else>&nbsp;&nbsp;REI</div>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Web3 from 'web3';
import { mapGetters } from 'vuex';
import filters from '../filters';
import { getHistoryData } from '../service/CommonService';
import util from '../utils/util';
import { getAddressTag } from '../service/CommonService';
import find from 'lodash/find';

export default {
  filters,
  data: (vm) => ({
    startDate: '2022-01-01',
    startFormatted: '01/01/2022',
    endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    endFormatted: vm.formatDate(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)),
    skeletonLoading: true,
    startMenu: false,
    endMenu: false,
    typeFilter: '',
    tokenFilter: '',
    sendList: [],
    receiveList: [],
    reiList: [],
    usdtList: [],
    sendTokenList: [],
    receiveTokenList: [],
    sendTypeList: [],
    receiveTypeList: [],
    totalList: [],
    typeItems: [
      { state: 'All', val: '' },
      { state: 'Receive', val: 'Receive' },
      { state: 'Send', val: 'Send' }
    ],
    tokenItems: [
      { state: 'All', val: '' },
      { state: 'REI', val: 'REI' },
      { state: 'USDT', val: 'USDT' }
    ],
    loading: false,
    setData: [],
    sortDescVote: true,
    transactionsList: [],
    dialog: false,
    historyList: [],
    list: [],
    rawDataList: [],
    internalList: [],
    details: '',
    address: '',
    detailsList: []
  }),
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters({
      connection: 'connection',
      apiUrl: 'apiUrl',
      dark: 'dark'
    }),
    computedDateFormatted() {
      return this.formatDate(this.startDate);
    },
    computedDateFormatted2() {
      return this.formatDate2(this.endDate);
    },
    listenChange() {
      const { startDate, endDate } = this;
      return {
        startDate,
        endDate
      };
    },
  },
  watch: {
    startDate() {
      this.startFormatted = this.formatDate(this.startDate);
    },
    endDate() {
      this.endFormatted = this.formatDate2(this.endDate);
    },
    listenChange(newDate, oldDate) {
       var _this = this;
       let obj = JSON.parse(JSON.stringify(_this.$router.currentRoute.query));
          Object.assign(obj, { startTime: this.startDate,endTime: this.endDate });
      _this.$router.push({
        query: obj
      });
      let startDate = Date.parse(this.startDate);
      let endDate = Date.parse(this.endDate);
      this.list = this.list.filter((item) => {
        return Date.parse(item.date) >= startDate && Date.parse(item.date) <= endDate;
      });
      this.changeStateType();
    },
  },
  methods: {
    formatDate(startDate) {
      if (!startDate) return null;
      const [year, month, day] = startDate.split('-');
      return `${month}/${day}/${year}`;
    },
    formatDate2(endDate) {
      if (!endDate) return null;
      const [year, month, day] = endDate.split('-');
      return `${month}/${day}/${year}`;
    },
    async getData() {
      let params = {
        module: 'account',
        action: 'tokentx',
        address: this.connection.address
      };
      let data = await getHistoryData(params);
      this.transferList = data.data.result || [];
      this.getInternal();
      // console.log('transferList',this.transferList)
    },
    async getInternal() {
      let params = {
        module: 'account',
        action: 'txlistinternal',
        address: this.connection.address
      };
      let data = await getHistoryData(params);
      let internalData = data.data.result || [];
      this.internalList = this.transferList.concat(internalData);
      // console.log('internalList',this.internalList)
      this.historyData();
    },
    async historyData() {
      this.address = this.connection.address.toLowerCase();
      let params = {
        module: 'account',
        action: 'txlist',
        address: this.connection.address
      };
      let data = await getHistoryData(params);
      this.transactionsList = data.data.result || [];
      this.historyList = this.internalList.concat(this.transactionsList);
      this.historyList = this.historyList.filter((item) => {
        return item.value && item.value != 0;
      });
      this.historyList = this.historyList.map((item) => {
        let name = '';
        let type = '';
        let symbol = '';
        if (this.address == item.from.toLowerCase()) {
          let detail = find(this.detailsList, (items) => web3.utils.toChecksumAddress(items.address) == web3.utils.toChecksumAddress(item.to));
          if (detail) {
            name = detail.addressName;
          }
          type = 'Send';
        } else {
          let detail = find(this.detailsList, (items) => web3.utils.toChecksumAddress(items.address) == web3.utils.toChecksumAddress(item.from));
          if (detail) {
            name = detail.addressName;
          }
          type = 'Receive';
        }
        if (item.tokenSymbol) {
          symbol = item.tokenSymbol;
        } else {
          symbol = 'REI';
        }
        let timestamp = item.timeStamp * 1000;
        let date = util.dateFormat(timestamp, 'YYYY-MM-dd');
        let gasUsed = web3.utils.fromWei(item.gasUsed, 'Gwei');
        let gasPrice = item.gasPrice / 1e9;
        let value = 0;
        if (item.tokenSymbol) {
          value = item.value / 10 ** item.tokenDecimal;
        } else {
          value = item.value / 1e18;
        }
        let hash = '';
        if (item.hash) {
          hash = item.hash;
        } else {
          hash = item.transactionHash;
        }
        return {
          ...item,
          date: date,
          gasUsed: gasUsed,
          gasPrice: gasPrice,
          value: value,
          addressName: name,
          type: type,
          symbol: symbol,
          hash: hash
        };
      });
      this.totalList = this.historyList;
      this.getSortData();
      let parameter = Object.keys(this.$route.query).length;
      if(parameter > 0 ){
        this.typeFilter = this.$route.query.type;
        this.tokenFilter = this.$route.query.token;
      }
      let addressTag = await getAddressTag();
      this.detailsList = addressTag.data.data;
      this.skeletonLoading = false;
    },
    getSortData() {
      function sortArr(attr) {
        return function (a, b) {
          return b[attr] - a[attr];
        };
      }
      this.historyList = this.historyList.sort(sortArr('timeStamp'));
      let tempArr = [];
      for (let i = 0; i < this.historyList.length; i++) {
        let item = this.historyList[i];
        if (tempArr.indexOf(item.date) == -1) {
          this.list.push({
            date: item.date,
            result: [item]
          });
          tempArr.push(item.date);
        } else {
          for (let j = 0; j < this.list.length; j++) {
            let index = this.list[j];
            if (index.date == item.date) {
              index.result.push(item);
              break;
            }
          }
        }
      }
      this.rawDataList = this.list;
      this.list = [].concat(this.rawDataList);
    },
    changeStateType() {
      let startDate = Date.parse(this.startDate);
      let endDate = Date.parse(this.endDate);
      this.list = [];
      let dateList = [];
      this.historyList = this.totalList;
      dateList = this.historyList.filter((item) => {
        return Date.parse(item.date) >= startDate && Date.parse(item.date) <= endDate;
      });
      if (this.tokenFilter == '') {
        if (this.typeFilter == '') {
          this.historyList = dateList;
        } else {
          this.historyList = dateList.filter((item) => {
            return item.type == this.typeFilter;
          });
        }
      } else {
        if (this.typeFilter != '') {
          this.historyList = dateList.filter((item) => {
            return item.type == this.typeFilter && item.symbol == this.tokenFilter;
          });
        } else {
          this.historyList = dateList.filter((item) => {
            return item.symbol == this.tokenFilter;
          });
        }
      }
      this.getSortData();
       var _this = this;
        let obj = JSON.parse(JSON.stringify(_this.$router.currentRoute.query));
        if(this.typeFilter){
          Object.assign(obj, { type: this.typeFilter });
        }else{
          Object.assign(obj, { type: 'all' });
        }
      _this.$router.push({
        query: obj
      });
    },
    changeStateToken() {
      let startDate = Date.parse(this.startDate);
      let endDate = Date.parse(this.endDate);
      this.list = [];
      let dateList = [];
      this.historyList = this.totalList;
      dateList = this.historyList.filter((item) => {
        return Date.parse(item.date) >= startDate && Date.parse(item.date) <= endDate;
      });
      if (this.typeFilter == '') {
        if (this.tokenFilter == '') {
          this.historyList = dateList;
        } else {
          this.historyList = dateList.filter((item) => {
            return item.symbol == this.tokenFilter;
          });
        }
      } else {
        if (this.tokenFilter != '') {
          this.historyList = dateList.filter((item) => {
            return item.type == this.typeFilter && item.symbol == this.tokenFilter;
          });
        } else {
          this.historyList = dateList.filter((item) => {
            return item.type == this.typeFilter;
          });
        }
      }
      this.getSortData();
      var _this = this;
       let obj = JSON.parse(JSON.stringify(_this.$router.currentRoute.query));
        if(this.tokenFilter){
      Object.assign(obj, { token: this.tokenFilter });
        }else{
          Object.assign(obj, { token: 'all' });
        }
      _this.$router.push({
        query: obj
      });
    },
    openDetails(value) {
      this.dialog = true;
      this.details = value;
      console.log('value', value);
    },
    cancelDetails() {
      this.dialog = false;
    }
  }
};
</script>

<style scoped lang="scss">
.dialog-night {
  background-color: #595777;
  padding: 20px;
}
.dialog-daytime {
  background-color: #fff;
  padding: 20px;
}
.chip-dark {
  background-color: #13112b;
  padding: 20px;
  margin: 20px 0;
}
.chip-light {
  background-color: #f5f5f7;
  padding: 20px;
  margin: 20px 0;
}
.card-item {
  padding: 20px;
  margin-top: 16px;
  margin-bottom: 10px;
}
.font-grey {
  font-size: 14px;
  color: #868e9e;
}
.select-card {
  display: flex;
  border: none;
  background-color: transparent;
  justify-content: space-between !important;
}
.left-item {
  display: flex;
  align-items: center;
  .img {
    margin-right: 10px;
  }
}
.gas-fee {
  display: flex;
  align-items: center;
  .img {
    margin-left: 10px;
  }
}

.item-content {
  margin: 8px 0;
  .item-data {
    font-weight: 500;
  }
}
.item-name {
  color: grey;
}
.receive {
  margin-top: 20px;
  .price {
    font-size: 20px;
    font-weight: bold;
  }
}
.token-symbol {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.value-symbol {
  margin-left: 2px;
  font-weight: bold;
  margin-top: 2px;
}
.close-dialog {
  cursor: pointer;
}
.content {
  margin-top: 40px;
}
.right-icon {
  margin-bottom: 20px;
}
.theme--light.v-text-field--filled > .v-input__control > .v-input__slot {
  border-radius: 30px;
}
@media screen and (max-width: 900px) {
}
</style>
