<template>
  <v-dialog width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn small class="mx-1" icon v-bind="attrs" v-on="on"><span class="iconfont">&#xe624;</span></v-btn>
    </template>
    <v-card color="start_unstake">
      
      <v-sheet class="pa-8 start_unstake">
        <div class="mb-1">{{ $t('settings.darkMode') }}</div>
        <v-row>
          <v-col cols="4" v-for="mode in modes" :key="mode.key">
            <v-btn block small :class="{ 'change_btn': darkMode == mode.key }" @click="switchDarkMode({ darkMode: mode.key })">
              {{ $t(mode.text) }}
              <v-icon small>{{ mode.icon }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
      
      <v-sheet class="pa-8 start_unstake">
        <div class="mb-1">IPFS Gateway</div>
        <v-row>
          <v-col
            class="d-flex"
            cols="24"
            sm="12"
          >
            <v-select
              :items="items"
              v-model="gateway"
              item-text="url"
              item-value="url"
              @change="changeGateway()"
            >
              <template v-slot:selection="data">
                  <div>{{ data.item.url}}</div>
                </template>
                <template v-slot:item="data">
                  <div>{{ data.item.url}} - Latency:({{ data.item.time }}ms)</div>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-sheet>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { getIpfsGatewayUrl,getResponseTime } from '../service/CommonService';
export default {
  data() {
    return {
      dialog: false,
      items: [],
      gatawayList:[
        'https://ipfs.4everland.xyz/ipfs/',
        'https://ipfs.io/ipfs/',
        'https://gateway.pinata.cloud/ipfs/'
      ],
      gateway:''
    };
  },
  computed: {
    ...mapGetters({
      language: 'language',
      languages: 'languages',
      darkMode: 'darkMode',
      modes: 'modes'
    })
  },
  mounted(){
    this.init()
  },
  methods: {
    ...mapActions({
      switchDarkMode: 'switchDarkMode',
      switchLanguage: 'switchLanguage'
    }),
    async init(){
      let url = getIpfsGatewayUrl();
      this.gateway = url;
      this.items = [];
      for(let i = 0; i<this.gatawayList.length;i++){
        let item = this.gatawayList[i];
        let time = await this.getResponse(item)
        this.items.push({
          url:item,
          time: time
        })
      }
    },
    async getResponse(url){
      let ajaxTime = new Date().getTime();
      await getResponseTime(`${url}bafkreie7q3iidccmpvszul7kudcvvuavuo7u6gzlbobczuk5nqk3b4akba`);
      let totalTime = new Date().getTime()-ajaxTime;
      return totalTime
    },
    changeGateway(){
      localStorage.setItem('ipfsGatewayUrl', encodeURIComponent(this.gateway));
      window.location.reload();
    }
  }
};
</script>
<style scoped>
.theme--dark.v-btn.v-btn--has-bg{
  background: #4C4A68;
}
.v-btn:not(.v-btn--round).v-size--default--active{
  color: #FFF;
  background-color: #6979F8 !important;
}
.change_btn{
  color: #FFF;
  background-color: #6979F8 !important;
}
.iconfont{
  font-size: 24px;
}
</style>
