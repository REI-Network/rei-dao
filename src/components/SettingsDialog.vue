<template>
<div>
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
        <v-row cols="4">
          <v-col>
            <div class="mb-1">IPFS Gateway</div>
          </v-col>
           <v-spacer></v-spacer>
          <v-col class="text-right">
            <v-icon small @click="openSetGatewayDialog()">mdi-cog-outline</v-icon>
            <v-icon small @click="openGatewayDialog()">mdi-sticker-plus-outline</v-icon>
          </v-col>
        </v-row>
        
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
  
  <v-dialog width="400" v-model="addGatewayDialog">
    <v-card color="start_unstake">
      
      <v-sheet class="pa-8 start_unstake">
        <v-row cols="4">
          <v-col>
            <div class="mb-1">Add IPFS Gateway</div>
          </v-col>
           <v-spacer></v-spacer>
          
        </v-row>
        <v-form ref="form" lazy-validation>
        <v-row class="mt-2 mb-2">
          <v-col
            class="d-flex "
            cols="24"
            sm="12"
          >
            <v-text-field
              label="Please enter IPFS Gateway"
              :rules="rules"
              v-model="inputGateway"
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="text-center">
          <v-btn @click="cancelAddGateway" class="mr-4 cancel-btn" outlined color="btn_button">
            {{ $t('stake.btn_cancel') }}
          </v-btn>
          <v-btn  @click="submitAddGateway" color="vote_button" class="font-btn">
            {{ $t('stake.btn_submit') }}
          </v-btn>
        </div>
        </v-form>
      </v-sheet>
    </v-card>
  </v-dialog>
  <v-dialog width="400" v-model="setGatewayDialog">
    <v-card color="start_unstake">
      
      <v-sheet class="pa-8 start_unstake">
        <v-row cols="4">
          <v-col>
            <div class="mb-1">Manage IPFS Gateway</div>
          </v-col>
           <v-spacer></v-spacer>
          
        </v-row>
        
        <v-row>
          <v-col
            class="d-flex"
            cols="24"
            sm="12"
          >
            <v-select
              :items="myItems"
              v-model="delGateway"
              @change="changeMyGateway()"
            >
            </v-select>
          </v-col>
        </v-row>
        <div class="text-center">
          <v-btn @click="cancelSetGateway" class="mr-4 cancel-btn" outlined color="btn_button">
            {{ $t('stake.btn_cancel') }}
          </v-btn>
          <v-btn @click="submitDelGateway" :disabled="!this.delGateway" color="vote_button" class="font-btn">
            Delete
          </v-btn>
        </div>
      </v-sheet>
    </v-card>
  </v-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { getResponseTime } from '../service/CommonService';
import util from '../utils/util';
export default {
  data() {
    return {
      dialog: false,
      addGatewayDialog: false,
      setGatewayDialog: false,
      inputGateway:'',
      items: [],
      gatawayList:[
        'https://4everland.io',
        'https://ipfs.io',
        'https://ipfs-gateway.cloud',
        'https://dweb.link'
      ],
      gateway:'',
      myGateway:'',
      delGateway:'',
      myItems:[],
      rules:[(v) => !!v || this.$t('msg.please_input_url'), (v) => (v && util.isUrl(v)) || this.$t('msg.please_input_correct_url')]
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
    this.init();
    this.getMyGateway();
  },
  methods: {
    ...mapActions({
      switchDarkMode: 'switchDarkMode',
      switchLanguage: 'switchLanguage'
    }),
    async init(){
      let ipfsgateway = localStorage.getItem('ipfsGatewayUrl');
      let url = '';
      if(!ipfsgateway){
        url = `https://4everland.io`;
      } else {
        url = decodeURIComponent(ipfsgateway);
      }
      
      this.gateway = url;
      this.items = this.gatawayList.map(item=>{
        return {
          url: item,
          time: 0
        }
      });
      let _items = [];
      for(let i = 0; i < this.gatawayList.length; i++){
        let item = this.gatawayList[i];
        let time = await this.getResponse(item)
        _items.push({
          url: item,
          time: time
        })
      }
      this.items = _items;

      
    },
    async getMyGateway(){
      let gateway = localStorage.getItem('myIpfsGatewayUrl') || '[]';
      let _gateway = JSON.parse(gateway);
      this.myItems = _gateway;
    },
    async getResponse(url){
      let startTime = new Date().getTime();
      let totalTime = 0;
      try{
        await getResponseTime(`${url}/ipfs/bafkreie7q3iidccmpvszul7kudcvvuavuo7u6gzlbobczuk5nqk3b4akba#x-ipfs-companion-no-redirect`);
        totalTime = new Date().getTime() - startTime;
      }catch(e){
        totalTime = 0;
      }
      return totalTime
    },
    changeGateway(){
      localStorage.setItem('ipfsGatewayUrl', encodeURIComponent(this.gateway));
      window.location.reload();
    },
    openGatewayDialog() {
      this.addGatewayDialog = true;
    },
    submitAddGateway(){
      if (!this.$refs.form.validate()) return;
      let gateway = localStorage.getItem('myIpfsGatewayUrl') || '[]';
      let _gateway = JSON.parse(gateway);
      _gateway.push(this.inputGateway);
      localStorage.setItem('myIpfsGatewayUrl', JSON.stringify(_gateway));
      this.addGatewayDialog = false;
      this.getMyGateway();
    },
    cancelAddGateway(){
      this.addGatewayDialog = false;
    },
    changeMyGateway(){

    },
    openSetGatewayDialog(){
      this.setGatewayDialog = true;
    },
    cancelSetGateway(){
      this.setGatewayDialog = false;
    },
    submitDelGateway(){
      if(!this.delGateway) return;
      let gateway = localStorage.getItem('myIpfsGatewayUrl');
      let _gateway = JSON.parse(gateway);
      let index = _gateway.findIndex((val)=>{return val==this.delGateway});
      _gateway.splice(index, 1);

      localStorage.setItem('myIpfsGatewayUrl', JSON.stringify(_gateway));
      this.setGatewayDialog = false;
      this.getMyGateway();
    },
  }
};
</script>
<style scoped>
.font-btn.v-btn.v-btn--has-bg {
  color: #fff;
  background: #6979f8;
  font-size: 12px;
}
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
