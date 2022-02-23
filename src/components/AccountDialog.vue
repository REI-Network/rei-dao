<template>
  <div>
    <div class="ops">
      <span class="network mr-1" v-if="connection.network && connection.network != 'mainnet'">{{ connection.network }}</span>
      <v-btn depressed class="grey btn-connect btn-addwallet" color="error" v-if="connection.network && connection.network != 'REI Network' && connection.network != 'REI Testnet' && connection.network != 'REI Devnet'" rounded @click="switchGXChainNet()">
        <v-icon small class="btn-icon">mdi-resistor</v-icon>
        {{$t('msg.neterror')}}
      </v-btn>
      <v-btn v-if="!connection.address" depressed class="grey" :class="dark ? 'darken-2' : 'lighten-2'" rounded @click="connect('metamask')">
        {{ $t('account.unlock') }}
      </v-btn>
      <div class="account-balance grey" :class="dark ? 'darken-2' : 'lighten-2'" v-if="connection.address">
        <span class="amount">
          <v-progress-circular indeterminate size="18" :width="2" v-if="connection.loading"></v-progress-circular>
          <span v-else class="bebas">{{ connection.balance | asset(2) }} {{getSymbol}}</span>
        </span>
        <v-btn depressed rounded @click="dialogAcc = true" class="blue-grey" :class="dark ? 'darken-2' : 'lighten-2'">
          <jazzicon v-if="pendingTxs.length == 0" class="d-flex" :address="connection.address" :diameter="16"></jazzicon>
          <span class="ml-2 bebas" v-if="$vuetify.breakpoint.mdAndUp && pendingTxs.length == 0">&nbsp;{{ connection.address | addr }}</span>
          <v-progress-circular size="18" width="2" class="mr-1" v-if="pendingTxs.length > 0" indeterminate color="primary"></v-progress-circular>
          <span v-if="pendingTxs.length > 0">{{ $tc('account.pending_txs', pendingTxs.length, { count: pendingTxs.length }) }}</span>
        </v-btn>
      </div>
    </div>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-list rounded outlined>
          <v-subheader>{{ $t('account.connect') }}</v-subheader>
          <v-list-item v-for="(item, i) in items" :key="i" @click="connect(item.key)">
            <span v-if="item.key === connection.walletName" class="green-dot" />
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-img :src="item.img" width="20" height="20" />
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAcc" max-width="450" overlay-opacity=".6">
      <v-card color="start_unstake" >
        <v-card-title>{{ $t('account.title') }}</v-card-title>
        <v-divider></v-divider>
        <v-sheet class="ma-4 pa-4 grey" :class="dark ? 'current_wallet' : 'gradient'" rounded v-if="connection.walletName">
          <div class="d-flex stretch">
            <div class="d-flex text--secondary">
              <span>{{ $t('account.connected_with') }}</span>
              <v-img class="mx-2" :src="items.find((item) => item.key == connection.walletName).img" width="20" height="20" />
              <span>{{ connection.walletName }}</span>
            </div>
            <!-- <a class="link-change" @click="dialog = true">Change</a> -->
          </div>
          <div class="d-flex my-2">
            <jazzicon class="identicon" :address="connection.address" :diameter="30"></jazzicon>
            <span class="text-h5 ml-3">
              {{ connection.address | addr }}
            </span>
          </div>
          <v-row class="account-op" no-gutters>
            <v-col>
              <v-btn color="secondary" :text="!dark" depressed small @click="copyAddr">
                <v-icon small>{{ addrCopying ? 'mdi-checkbox-marked-circle-outline' : 'mdi-content-copy' }}</v-icon>
                {{ addrCopying ? $t('account.copied') : $t('account.copy_address') }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="secondary" :text="!dark" depressed small target="_blank" :href="`https://scan-test.rei.network/address/${connection.address}`"><v-icon small>mdi-open-in-new</v-icon>{{ $t('account.view_on_etherscan') }}</v-btn>
            </v-col>
          </v-row>
        </v-sheet>
        <div class="pb-4 px-4">
          <div v-if="txs.length == 0">{{ $t('account.tip') }}</div>
          <div v-if="txs.length > 0">
            <div class="mb-2 d-flex">
              <span>{{ $t('account.rencent_txs') }}</span>
              <v-spacer />
              <a class="text-caption " @click="setTxs({ txs: [] })">({{ $t('account.clear_all') }})</a>
            </div>
            <div class="txs">
              <div class="d-flex align-baseline py-1" v-for="tx in txs" :key="tx.txid">
                <div class="d-flex flex-column">
                  <a class="text-body-2 text-decoration-none" :href="`https://scan-test.rei.network/tx/${tx.txid}`" target="_blank"><v-icon small color="primary" class="mr-1">mdi-open-in-new</v-icon>{{ $t(`txs.${tx.type}`, tx.data) }}</a>
                  <span class="text-caption font-weight-light">({{ new Date(tx.timestamp).format('yyyy-MM-dd hh:mm:ss') }})</span>
                </div>
                <v-spacer />
                <span class="tx-status">
                  <v-icon small v-if="tx.status == 'FINISHED'" color="success">mdi-checkbox-marked-circle-outline</v-icon>
                  <v-icon small v-if="tx.status == 'FAILED'" color="red">mdi-alert-outline</v-icon>
                  <v-progress-circular indeterminate color="primary" size="16" width="2" v-if="tx.status == 'PENDING'"></v-progress-circular>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="staking_record">
          <v-divider />
          <div class="record-content">
            <div>
              <div class="name-pri">
                <div>Staking 10,255,489.00 REI To 0xa5...3d28</div>
                <v-icon small>mdi-open-in-new</v-icon>
              </div>
              <div>2021-12-22 16:17:35</div>
            </div>
            <v-icon dense color="#65BB67">mdi-check-circle</v-icon>
          </div>
        </div>
        <div class="staking_record">
          <v-divider />
          <div class="record-content">
            <div>
              <div class="name-pri">
                <div>Staking 10,255,489.00 REI To 0xa5...3d28</div>
                <v-icon small>mdi-open-in-new</v-icon>
              </div>
              <div>2021-12-22 16:17:35</div>
            </div>
            <v-icon dense color="#65BB67">mdi-check-circle</v-icon>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import Web3 from 'web3';
import { mapGetters, mapActions } from 'vuex';
import WalletConnectProvider from '@walletconnect/web3-provider';
import filters from '../filters';
import Jazzicon from 'vue-jazzicon';
import * as txStatusTask from '../tasks/txStatusTask';

const LAST_CONNECTION = 'LAST_CONNECTION';
const NETWORKS = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  5: 'goerli',
  42: 'kovan',
  12357: 'REI Testnet',
  47805: 'REI Network',
  23579: 'REI Devnet'
};

export default {
  filters,
  components: {
    [Jazzicon.name]: Jazzicon
  },
  computed: {
    ...mapGetters({
      txs: 'txs',
      pendingTxs: 'pendingTxs',
      connection: 'connection',
      dark: 'dark'
    }),
    networkPrefix() {
      return this.connection.network == 'mainnet' ? '' : `${this.connection.network}.`;
    },
    getSymbol() {
      return 'REI'
    },
  },
  data() {
    return {
      selected: 0,
      addrCopying: false,
      dialog: false,
      dialogAcc: false,
      items: [
        {
          key: 'metamask',
          img: require('../assets/images/metamask.png'),
          text: 'MetaMask'
        },
        {
          key: 'walletconnect',
          img: require('../assets/images/walletconnect.svg'),
          text: 'WalletConnect'
        }
      ]
    };
  },
  mounted() {
    this.tryLastConnection();
  },
  methods: {
    ...mapActions({
      setTxs: 'setTxs',
      setConnection: 'setConnection',
      setFinishedTxs: 'setFinishedTxs'
    }),
    tryLastConnection() {
      let lastConect = localStorage.getItem(LAST_CONNECTION);
      let item = this.items.find((item) => item.key == lastConect);
      if (item) {
        this.connect(lastConect);
      }
    },
    sleep(timestamp) {
      return new Promise((resolve) => {
        setTimeout(resolve, timestamp);
      });
    },
    copyToClipboard(str) {
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
    },
    async copyAddr() {
      try {
        window.navigator.clipboard.writeText(this.connection.address);
        this.copyToClipboard(this.connection.address);
      } catch (ex) {
        console.log(ex);
      } finally {
        this.addrCopying = true;
        await this.sleep(500);
        this.addrCopying = false;
      }
    },
    async connect(key) {
      if (web3.currentProvider && web3.currentProvider.disconnect) {
        await web3.currentProvider.disconnect();
      }
      let connected = false;
      switch (key) {
        case 'metamask':
          connected = await this.connectMetaMask();
          break;
        case 'walletconnect':
          connected = await this.connectWalletConnect();
          break;
        default:
          console.warn('Unknow connection');
      }
      this.dialog = false;
      if (connected) {
        this.loadAccount(key);
      }
    },
    async connectMetaMask() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        // await window.ethereum.enable();
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          return true;
        } catch (error) {
          this.$dialog.notify.warning(this.$t('notify.connect_failed') + ': ' + error.message);
          // User denied account access...
          return false;
        }
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        return true;
      } else {
        this.$dialog.warning({
          title: '',
          text: this.$t('notify.install_metamask'),
          actions: {
            No: this.$t('notify.no'),
            Yes: {
              color: 'red',
              text: this.$t('notify.install'),
              handle: () => {
                window.open('https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn');
              }
            }
          }
        });
        return false;
      }
    },
    async connectWalletConnect() {
      try {
        //  Create WalletConnect Provider
        const provider = new WalletConnectProvider({
          infuraId: '939c76fc756341f389051729d8a2f13a' // Required
        });
        //  Enable session (triggers QR Code modal)
        await provider.enable();
        //  Create Web3
        window.web3 = new Web3(provider);
        return true;
      } catch (ex) {
        console.error(ex);
        this.$dialog.notify.error(`Failed to connect to WalletConnect:${ex.message}`);
        return false;
      }
    },
    async loadAccount(key) {
      let accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        let connection = { ...this.connection, loading: true, address: accounts[0] };
        this.setConnection({
          connection
        });
        let balance = await web3.eth.getBalance(accounts[0]);
        let chainId = await web3.eth.getChainId();
        localStorage.setItem(LAST_CONNECTION, key);
        connection = {
          address: accounts[0],
          balance: web3.utils.fromWei(web3.utils.toBN(balance)),
          chainId,
          network: NETWORKS[chainId] || 'unknown',
          walletName: key,
          loading: false
        };
        this.setConnection({
          connection
        });
        txStatusTask.start((tx, success) => {
          if (success) {
            this.$dialog.notify.success(this.$t(`txs.${tx.type}`, tx.data), {
              position: 'top-right',
              timeout: 5000
            });
            this.setFinishedTxs({finishedTxs:tx})
          } else {
            this.$dialog.notify.error(this.$t(`txs.${tx.type}`, tx.data), {
              position: 'top-right',
              timeout: 5000
            });
          }
        });
        web3.currentProvider.on('accountsChanged', () => {
          // console.log(accounts);
          window.location.reload();
        });
        web3.currentProvider.on('chainChanged', () => {
          // console.log(chainId);
          window.location.reload();
        });
        web3.currentProvider.on('message', (payload) => {
          console.log(payload, arguments);
        });
        web3.currentProvider.on('disconnect', (code, reason) => {
          console.log(`Ethereum Provider connection closed: ${reason}. Code: ${code}`);
        });
      }
    },
    async addREI() {
        try {
            await window.ethereum.request({
                method:'wallet_addEthereumChain',
                params:[{
                "chainId": "0xbabd",
                "chainName": "REI Network",
                "rpcUrls": ["https://rpc.rei.network"],
                "nativeCurrency": {
                    "name": "REINetwork",
                    "symbol": "REI",
                    "decimals": 18
                },
                "blockExplorerUrls": ["https://scan.rei.network/"],
                }],
                
            },this.connection.address)
        } catch (addError) {
            console.log('res',addError)
        }
    },
    async switchGXChainNet() {
        
        try {
            this.addREI()
            let res = await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xbabd' }],
            });
            console.log('res',res)
            if(res && res.error){
                this.addREI()
            }
        } catch (error) {
            console.log('error',error)
            if (error.code === 4902) {
                this.addREI()
            }
        }
    },
  }
};
</script>
<style scoped lang="scss">
.ops {
  display: flex;
  white-space: nowrap;
}
.green-dot {
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background: green;
  margin-right: 15px;
}
.account-balance {
  padding: 0 0 0 0.75rem;
  line-height: 0;
  border-radius: 20px;
  display: flex;
  align-items: center;
  .amount {
    padding-right: 0.5rem;
  }
}
.network {
  background-color: rgba(243, 132, 30, 0.05);
  color: rgb(243, 132, 30);
  font-weight: 500;
  border-radius: 20px;
  padding: 6px 10px;
}

.txs {
  max-height: 40vh;
  overflow: auto;
  .tx-status {
    min-width: 30px;
    text-align: center;
  }
}
.gradient {
  background: linear-gradient(135deg, #6979F8 0%, #4856C0 100%);
  }
  .staking_record{
    padding: 0 20px 12px 20px;
    font-size: 14px;
    color:#868E9E;
    .record-content{
      display: flex;
      justify-content: space-between;
      margin-top:12px;
    }
    .name-pri{
      display: flex;
      justify-content: flex-start;
    }
  }
</style>
