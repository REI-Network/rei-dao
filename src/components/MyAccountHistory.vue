<template>
  <v-container class="stake_background" style="padding: 0">
    <v-row>
      <!-- <v-col cols="12" md="2">
        <v-card outlined class="select-card">
          <v-select class="d-select" :items="items" label="All Types" outlined dense style="border-radius: 20px"></v-select>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card outlined class="select-card">
          <v-select class="d-select" :items="items2" label="All Tokens" outlined dense style="border-radius: 20px"></v-select>
        </v-card>
      </v-col> -->
      <v-col cols="12" md="3">
        <v-card outlined class="select-card">
          <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="dateFormatted" label="Start Time" outlined dense v-bind="attrs" v-on="on" style="border-radius: 20px" class="font-grey"></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
          </v-menu>
          <v-icon class="right-icon">mdi-menu-right</v-icon>
          <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="dateFormatted2" label="End Time" outlined dense v-bind="attrs" v-on="on" style="border-radius: 20px" class="font-grey"></v-text-field>
            </template>
            <v-date-picker v-model="date2" no-title @input="menu2 = false"></v-date-picker>
          </v-menu>
        </v-card>
      </v-col>
    </v-row>
    <div>
      <v-data-iterator :items="list" hide-default-footer :loading="loading" :loading-text="$t('msg.loading')" :class="this.historyList.length !== 0 ? 'data-this.list' : 'data-nft'">
        <template v-slot:item="{ item }">
          <h3>{{ item.date }}</h3>
          <v-card class="card-item" v-for="(info,index) in item.result" :key="item.date+'-'+index" @click="openDetails(info)">
            <v-row>
              <v-col cols="12" sm="3" class="left-item">
                <div class="img" v-if="info.from.toUpperCase() == connection.address.toUpperCase()">
                  <v-img src="../assets/images/history-4.png" width="40" />
                </div>
                <div class="img" v-else>
                  <v-img src="../assets/images/history-2.png" width="40" />
                </div>
                <div>
                  <div class="font-grey" v-if="info.from.toUpperCase() == connection.address.toUpperCase()">Send</div>
                  <div class="font-grey" v-else>Receive</div>
                  <h4>{{ (info.timeStamp * 1000) | dateFormat('hh:ss:mm') }}</h4>
                </div>
              </v-col>
              <v-col cols="12" sm="3" v-if="info.from.toUpperCase() == connection.address.toUpperCase()">
                <div class="font-grey">To</div>
                <h4>{{ info.to | addr }}</h4>
              </v-col>
              <v-col cols="12" sm="3" v-else>
                <div class="font-grey">From</div>
                <h4>{{ info.from | addr }}</h4>
              </v-col>
              <v-col cols="12" sm="3">
                <h4>{{ info.value | asset(2) }}</h4>
                <div class="font-grey token-symbol" v-if="info.tokenSymbol">{{ info.tokenSymbol}}</div>
                <div class="font-grey" v-else>REI</div>
              </v-col>
              <v-col cols="12" sm="3">
                <div class="font-grey gas-fee" >
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
          <v-row justify="space-between" no-gutter class="item-content">
            <div class="item-name">Gas Price</div>
            <div class="item-data">{{ details.gasPrice }} Gwei</div>
          </v-row>
          <v-row justify="space-between" no-gutter class="item-content">
            <div class="item-name">Nonce</div>
            <div class="item-data">{{ details.nonce }}</div>
          </v-row>
        </v-card>
        <div class="receive">
          <div class="font-grey" v-if="details.from == address">Send</div>
          <div class="item-name" v-else>Received</div>
          <v-row align="center" class="value-symbol" no-gutters>
            <div class="price">{{ details.value | asset(2) }}</div>
            <div class="token-symbol" v-if="details.tokenSymbol">&nbsp;&nbsp;{{ details.tokenSymbol}}</div>
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
import util from '../utils/util';
// import find from 'lodash/find';
export default {
  filters,
  data: (vm) => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)),
    date2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    dateFormatted2: vm.formatDate(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)),
    menu1: false,
    menu2: false,
    items: [],
    items2: [],
    loading: false,
    setData: [],
    sortDescVote:true,
    transactionsList: [],
    dialog: false,
    historyList: [],
    list: [],
    rawDataList:[],
    details: '',
    address:'',
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
      return this.formatDate(this.date);
    },
    computedDateFormatted2() {
      return this.formatDate2(this.date2);
    },
    listenChange() {
      const { date,date2} = this;
      return {
        date,
        date2,
      };
    }
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
    },
    date2() {
      this.dateFormatted2 = this.formatDate2(this.date2);
    },
    listenChange(date,date2) {
      let startDate = Date.parse(this.date);
      let endDate = Date.parse(this.date2);
      this.list = [].concat(this.rawDataList)
      this.list = this.list.filter((item) => {
        return Date.parse(item.date) >= startDate && Date.parse(item.date) <= endDate;
      })
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${month}/${day}/${year}`;
    },
    formatDate2(date2) {
      if (!date2) return null;
      const [year, month, day] = date2.split('-');
      return `${month}/${day}/${year}`;
    },
    async getData() {
      const { data } = await this.$axios.get(`https://scan.rei.network/api?module=account&action=tokentx&address=${this.connection.address}`);
      this.transferList = data.result;
      this.transferList = this.transferList.filter((item) => {
        return item.value != 0;
      })
      this.historyData();
    },
    async historyData() {
      this.address = this.connection.address.toLowerCase();
      const { data } = await this.$axios.get(`https://scan.rei.network/api?module=account&action=txlist&address=${this.connection.address}`);
      this.transactionsList = data.result;
      this.transactionsList = this.transactionsList.filter((item) => {
        return item.value != 0;
      })
      this.historyList = this.transferList.concat(this.transactionsList);
      this.historyList = this.historyList.map((item) => {
        let timestamp = item.timeStamp * 1000;
        let date = util.dateFormat(timestamp, 'YYYY-MM-dd');
        let gasUsed = web3.utils.fromWei(item.gasUsed,'Gwei');
        let gasPrice = item.gasPrice/1e9;
        let value = 0;
        if(item.tokenSymbol){
          value = item.value/10**item.tokenDecimal;
        }else{
          value = item.value/1e18;
        }
        return {
          ...item,
          date: date,
          gasUsed: gasUsed,
          gasPrice:gasPrice,
          value: value
        };
      });
      function sortArr(attr){
          return function(a,b){
            return b[attr]-a[attr]
          }
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
      console.log('list',this.list)
      this.rawDataList = this.list;
    },
    openDetails(value) {
      this.dialog = true;
      this.details = value;
      console.log('value',value)
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
.token-symbol{
  width:100px;
   overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}
.value-symbol{
  margin-left: 2px;
  font-weight: bold;
  margin-top:2px;
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
