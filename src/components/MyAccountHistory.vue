<template>
  <v-container class="stake_background" style="padding: 0">
    <v-row>
      <v-col cols="12" md="2">
        <v-card outlined class="select-card">
          <v-select class="d-select" :items="items" label="All Types" outlined dense style="border-radius: 20px"></v-select>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card outlined class="select-card">
          <v-select class="d-select" :items="items2" label="All Tokens" outlined dense style="border-radius: 20px"></v-select>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card outlined class="select-card">
          <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="dateFormatted" label="Start Time" outlined dense v-bind="attrs" v-on="on"  style="border-radius: 20px" class="font-grey"></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
          </v-menu>
          <v-icon class="right-icon">mdi-menu-right</v-icon>
          <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="dateFormatted2" label="End Time" outlined dense v-bind="attrs" v-on="on"  style="border-radius: 20px" class="font-grey"></v-text-field>
            </template>
            <v-date-picker v-model="date2" no-title @input="menu2= false"></v-date-picker>
          </v-menu>
        </v-card>
      </v-col>
    </v-row>
    <div>
      <h3>2022-05-12</h3>
      <v-card class="card-item">
        <v-row>
          <v-col cols="12" sm="4" class="left-item">
            <div class="img">
                <v-img src="../assets/images/history-icon.png" width="40"/>
            </div>
           <div>
                <div class="font-grey">Receive</div>
                <h4>05:45</h4>
           </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="font-grey">Form</div>
            <h4>0xe2fs...48as</h4>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="font-grey">60.49 BUSD</div>
            <h4>$60.60</h4>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="card-item">
        <v-row>
          <v-col cols="12" sm="4" class="left-item">
            <div class="img">
                <v-img src="../assets/images/history-icon.png" width="40"/>
            </div>
           <div>
                <div class="font-grey">Receive</div>
                <h4>05:45</h4>
           </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="font-grey">Form</div>
            <h4>0xe2fs...48as</h4>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="font-grey">1000REI</div>
            <h4>$1000.20</h4>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <div class="content">
      <h3>2022-05-12</h3>
      <v-card class="card-item">
        <v-row>
          <v-col cols="12" sm="4" class="left-item">
            <div class="img">
                <v-img src="../assets/images/history-icon.png" width="40"/>
            </div>
           <div>
                <div class="font-grey">Receive</div>
                <h4>05:45</h4>
           </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="font-grey">Form</div>
            <h4>0xe2fs...48as</h4>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="font-grey">60.49 BUSD</div>
            <h4>$60.60</h4>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="card-item">
        <v-row>
          <v-col cols="12" sm="4" class="left-item">
            <div class="img">
                <v-img src="../assets/images/history-icon.png" width="40"/>
            </div>
           <div>
                <div class="font-grey">Receive</div>
                <h4>05:45</h4>
           </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="font-grey">Form</div>
            <h4>0xe2fs...48as</h4>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="font-grey">1000REI</div>
            <h4>$1000.20</h4>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import filters from '../filters';
// import util from '../utils/util';
/* eslint-disable no-undef */
export default {
  filters,
  data: (vm) => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)),
    date2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    dateFormatted2: vm.formatDate(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)),
    menu1: false,
    menu2: false,
    items:[],
    items2:[],
  }),
  mounted() {
      this.historyData()
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
    }
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
    },
    date2() {
      this.dateFormatted2 = this.formatDate2(this.date2);
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
    async historyData(){
        const { data } = await this.$axios.get(`https://scan.rei.network/api?module=account&action=txlist&address=${this.connection.address}`);
        let historyList = data.result;
        for (let i = 0; i < historyList.length; i++) {
           //
        }
        console.log('---',historyList)
    }
  }
};
</script>

<style scoped lang="scss">
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
  .img{
      margin-right: 10px;
  }
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
