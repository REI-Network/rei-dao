<template>
  <div>
    <div class="ops background">
      <span class="network mr-2" v-if="connection.network && connection.network != 'mainnet'">{{ connection.network }}</span>
      <v-btn depressed class="network btn-connect btn-addwallet" v-if="connection.network && connection.network != 'REI Network' && connection.network != 'REI Testnet' && connection.network != 'REI Devnet'" rounded @click="switchGXChainNet()">
        <v-icon small class="btn-icon">mdi-resistor</v-icon>
        {{$t('msg.neterror')}}
      </v-btn>
      <v-btn v-if="!connection.address" depressed class="grey" :class="dark ? 'darken-2' : 'lighten-2'" rounded>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              class="grey"
              :class="dark ? 'darken-2' : 'lighten-2'"
              v-bind="attrs"
              v-on="on"
            >
              {{ $t('account.unlock') }}
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              @click="connect(item.key)"
            >
              <v-list-item-icon>
                <v-img :src="item.img" width="20" height="20" />
              </v-list-item-icon>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <div class="account-balance" v-if="connection.address">
        <span class="amount">
          <v-progress-circular indeterminate size="18" :width="2" v-if="connection.loading"></v-progress-circular>
          <span v-else class="bebas">{{ connection.balance | asset(4) }} {{getSymbol}}</span>
        </span>
        <v-btn depressed rounded @click="dialogAcc = true" :class="dark ? 'darken-2' : 'lighten-2'">
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
        <v-sheet class="ma-4 pa-4" :class="dark ? 'current' : 'gradient'" rounded v-if="connection.walletName">
          <div class="d-flex stretch">
            <div class="d-flex text--#FFF">
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
                <v-icon class="account-icon" small>{{ addrCopying ? 'mdi-checkbox-marked-circle-outline' : 'mdi-content-copy' }}</v-icon>
                {{ addrCopying ? $t('account.copied') : $t('account.copy_address') }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="secondary" :text="!dark" depressed small target="_blank" :href="`https://scan.rei.network/address/${connection.address}`"><v-icon small class="account-icon">mdi-open-in-new</v-icon>{{ $t('account.view_on_etherscan') }}</v-btn>
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
            <div class="staking_record" v-for="tx in txs" :key="tx.txid">
                <v-divider />
                <div class="record-content">
                    <div>
                    <div class="name-pri">
                        <div>{{ $t(`txs.${tx.type}`, tx.data) }}</div>
                        <a class="text-body-2 text-decoration-none" v-if="tx.data.to != 'REI Network'" :href="`https://scan.rei.network/tx/${tx.txid}`" target="_blank"><v-icon small color="primary" class="mr-1">mdi-open-in-new</v-icon></a>
                        <a class="text-body-2 text-decoration-none" v-if="tx.data.to == 'REI Network'" :href="`https://bscscan.com/tx/${tx.txid}`" target="_blank"><v-icon small color="primary" class="mr-1">mdi-open-in-new</v-icon></a>
                    </div>
                    <div>{{ new Date(tx.timestamp).format('yyyy-MM-dd hh:mm:ss') }}</div>
                    </div>
                    <v-icon dense color="#65BB67">mdi-check-circle</v-icon>
                </div>
            </div>
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
import { getAssetInfo } from '../service/CommonService'
import filters from '../filters';
import Jazzicon from 'vue-jazzicon';
import * as txStatusTask from '../tasks/txStatusTask';

import SignClient from "@walletconnect/sign-client";
import { WalletConnectModal } from "@walletconnect/modal";

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
      apiUrl: 'apiUrl',
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
      ],
      walletInfo: null
    };
  },
  mounted() {
    this.tryLastConnection();
    this.loadAsset();
  },
  methods: {
    ...mapActions({
      setTxs: 'setTxs',
      setConnection: 'setConnection',
      setFinishedTxs: 'setFinishedTxs',
      setAssetInfo: 'setAssetInfo',
      setApiUrl: 'setApiUrl'
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
          this.walletInfo = await this.connectWalletConnect();
          connected = this.walletInfo.account? true : false;
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
        await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xbabd' }],
            });
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
        const provider = await SignClient.init({
          projectId: "32edd8479445f5ebfac9d8af02cd0695",
          metadata: {
            name: "REIDao",
            description: "REI Network Dao",
            url: "https://dao.rei.network/",
            icons: ["https://static.rei.network/imgs/rei.png"],
          },
        });

        const walletConnectModal = new WalletConnectModal({
          projectId: "32edd8479445f5ebfac9d8af02cd0695",
          standaloneChains: ["eip155:47805"],
          themeVariables: {
            "--wcm-background-color": "#735EA1",
            "--wcm-z-index": "1000",
          },
        });

        // 创建新的连接请求
        const { uri, approval } = await provider.connect({
          requiredNamespaces: {
            eip155: {
              methods: [
                "eth_sendTransaction",
                "eth_signTransaction",
                "eth_sign",
                "personal_sign",
                "eth_signTypedData",
                "eth_getBalance",
                "eth_blockNumber",
                "eth_chainId",
                "eth_accounts",
                "eth_requestAccounts",
                "eth_call",
                "eth_estimateGas",
                "eth_gasPrice",
                "eth_getTransactionCount",
                "eth_getTransactionReceipt",
                "eth_getBlockByNumber"
              ],
              chains: ["eip155:47805"],
              events: ["chainChanged", "accountsChanged"],
              rpcMap: {
                "47805": "https://rpc.rei.network"
              }
            }
          },
          optionalNamespaces: {
            eip155: {
              methods: [
                "eth_sendTransaction",
                "eth_signTransaction",
                "eth_sign",
                "personal_sign",
                "eth_signTypedData",
                "eth_getBalance",
                "eth_blockNumber",
                "eth_chainId",
                "eth_accounts",
                "eth_requestAccounts",
                "eth_call",
                "eth_estimateGas",
                "eth_gasPrice",
                "eth_getTransactionCount",
                "eth_getTransactionReceipt",
                "eth_getBlockByNumber"
              ],
              chains: ["eip155:47805"],
              events: ["chainChanged", "accountsChanged"],
              rpcMap: {
                "47805": "https://rpc.rei.network"
              }
            }
          }
        });

        if (uri) {
          walletConnectModal.openModal({ uri });
          
          // 等待用户批准连接
          const session = await approval();
          walletConnectModal.closeModal();
          
          if (session) {
            // 获取账户信息
            const accounts = Object.values(session.namespaces)
              .map(namespace => namespace.accounts)
              .flat()
              .map(account => account.split(':')[2]);

            console.log('accounts', accounts);

            if (accounts.length > 0) {
              // 创建 RPC provider 用于只读方法
              const rpcWeb3 = new Web3('https://rpc.rei.network');
              
              // 只读方法列表 - 直接通过 RPC 调用
              const readOnlyMethods = [
                "eth_getBalance",
                "eth_blockNumber",
                "eth_chainId",
                "eth_call",
                "eth_estimateGas",
                "eth_gasPrice",
                "eth_getTransactionCount",
                "eth_getTransactionReceipt",
                "eth_getBlockByNumber"
              ];
              
              // 需要用户交互的方法 - 通过 WalletConnect 会话调用
              const interactiveMethods = [
                "eth_sendTransaction",
                "eth_signTransaction",
                "eth_sign",
                "personal_sign",
                "eth_signTypedData",
                "wallet_switchEthereumChain"
              ];

              // 创建混合 provider：只读方法用 RPC，交互方法用 WalletConnect
              const requestMethod = async ({ method, params }) => {
                // 只读方法直接通过 RPC 调用
                if (readOnlyMethods.includes(method)) {
                  return new Promise((resolve, reject) => {
                    rpcWeb3.currentProvider.send({
                      jsonrpc: '2.0',
                      method: method,
                      params: params || [],
                      id: Date.now()
                    }, (error, result) => {
                      if (error) {
                        reject(error);
                      } else if (result.error) {
                        reject(new Error(result.error.message));
                      } else {
                        resolve(result.result);
                      }
                    });
                  });
                }
                
                // 账户相关方法
                if (method === 'eth_accounts' || method === 'eth_requestAccounts') {
                  return [accounts[0]];
                }
                
                // 需要用户交互的方法通过 WalletConnect 会话调用
                if (interactiveMethods.includes(method)) {
                  return provider.request({ 
                    topic: session.topic,
                    chainId: "eip155:47805",
                    request: { method, params } 
                  });
                }
                
                throw new Error(`Method ${method} is not supported`);
              };

              const eip1193Provider = {
                request: requestMethod,
                send: (payload, callback) => {
                  // Web3.js 的 send 方法支持回调或 Promise
                  const method = payload.method;
                  const params = payload.params || [];
                  
                  if (callback) {
                    // 回调模式
                    requestMethod({ method, params })
                      .then(result => callback(null, { jsonrpc: '2.0', id: payload.id, result }))
                      .catch(error => callback(error, null));
                  } else {
                    // Promise 模式
                    return requestMethod({ method, params })
                      .then(result => ({ jsonrpc: '2.0', id: payload.id, result }));
                  }
                },
                sendAsync: (payload, callback) => {
                  eip1193Provider.send(payload, callback);
                },
                on: (event, callback) => {
                  provider.on(event, callback);
                },
                removeListener: (event, callback) => {
                  provider.removeListener(event, callback);
                }
              };

              window.web3 = new Web3(eip1193Provider);
              return { session, account: accounts[0], provider: eip1193Provider };
            }
          }
        }
        
        return false;
      } catch (ex) {
        console.error('WalletConnect error:', ex);
        this.$dialog.notify.error(`Failed to connect to WalletConnect: ${ex.message}`);
        return false;
      }
    },
    getApiUrl(){
        let rpcApi = '',graphqlApi = '', chartApi='';
        if(this.connection.network == 'REI Devnet'){
            chartApi = process.env.VUE_APP_DEV_SERVER_API;
            graphqlApi = process.env.VUE_APP_DEV_GRAPHQL_SERVER;
            rpcApi = process.env.VUE_APP_DEV_RPC_SERVER;
        } else if(this.connection.network == 'REI Testnet'){
            chartApi = process.env.VUE_APP_TEST_SERVER_API;
            graphqlApi = process.env.VUE_APP_TEST_GRAPHQL_SERVER;
            rpcApi = process.env.VUE_APP_TEST_RPC_SERVER;
        } else {
            chartApi = process.env.VUE_APP_SERVER_API;
            graphqlApi = process.env.VUE_APP_MAIN_GRAPHQL_SERVER;
            rpcApi = process.env.VUE_APP_MAIN_RPC_SERVER;
        }
        this.setApiUrl({
            apiUrl: {
                rpc: rpcApi, 
                graph: graphqlApi,
                chart: chartApi
            }
        })
    },
    async loadAsset(){
        let { data: { data:chartInfoData}} = await getAssetInfo(this.apiUrl.chart);
        this.setAssetInfo({
            assetInfo: chartInfoData
        })
    },
    async loadAccount(key) {
      try {
        let accounts;
        let provider = null;
        if (key === 'walletconnect') {
          const result = this.walletInfo;
          if (!result) return;
          accounts = [result.account];
          // 设置 web3 提供者
          window.web3 = new Web3(result.provider);
          provider = new Web3(result.provider);
          console.log('accounts', accounts);
        } else {
          accounts = await web3.eth.getAccounts();
          provider = new Web3(window.web3);
        }

        if (accounts.length > 0) {
          let connection = { ...this.connection, loading: true, address: accounts[0], provider: provider.currentProvider };
          this.setConnection({ connection });

          // 设置默认链 ID
          const chainId = 47805;
          connection = {
            address: accounts[0],
            balance: "0", // 初始化为 0，稍后更新
            chainId,
            network: NETWORKS[chainId] || 'unknown',
            walletName: key,
            loading: false,
            provider: provider.currentProvider
          };
          
          this.setConnection({ connection });
          this.getApiUrl();
          this.loadAsset();

          // 获取余额
          try {
            const web3Provider = new Web3(provider);
            const balance = await web3Provider.eth.getBalance(accounts[0]);
            console.log('balance',balance)
            connection.balance = web3Provider.utils.fromWei(web3Provider.utils.toBN(balance));
            this.setConnection({ connection });
          } catch (error) {
            console.error('Error getting balance:', error);
          }
          
          txStatusTask.start((tx, success) => {
            if (success) {
              this.$dialog.notify.success(this.$t(`txs.${tx.type}`, tx.data), {
                position: 'top-right',
                timeout: 5000
              });
              this.setFinishedTxs({finishedTxs:tx});
            } else {
              this.$dialog.notify.error(this.$t(`txs.${tx.type}`, tx.data), {
                position: 'top-right',
                timeout: 5000
              });
            }
          });

          if (web3.currentProvider && web3.currentProvider.on) {
            web3.currentProvider.on('accountsChanged', () => {
              console.log('accountsChanged');
              window.location.reload();
            });
            web3.currentProvider.on('chainChanged', () => {
              //window.location.reload();
            });
            web3.currentProvider.on('message', (payload) => {
              console.log(payload, arguments);
            });
            web3.currentProvider.on('disconnect', (code, reason) => {
              console.log(`Ethereum Provider connection closed: ${reason}. Code: ${code}`);
            });
          }
        }
      } catch (error) {
        console.error('Error loading account:', error);
        this.$dialog.notify.error(this.$t('notify.connect_failed') + ': ' + error.message);
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
.theme--dark.v-sheet{
  background: #403E59 ;
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
  background-color: #6979f8;
.bebas{
  color: #FFF;
}

.v-btn.v-btn--has-bg{
  background-color: #4856C0;
}
  .amount {
    padding-right: 0.5rem;
  }
}
.account-icon{
  color: #FFF;
}
.network {
  background: linear-gradient(135deg, #FAAD5D 0%,#Fc9153  100%);
  color:#FFF;
  line-height: 24px;
  font-size: 14px;
  border-radius: 20px;
  padding: 5px 10px;
  margin-right: 12px;
  text-align: center;
}

.txs {
  max-height: 40vh;
  overflow: auto;
  .tx-status {
    min-width: 30px;
    text-align: center;
  }
}
.current{
  background-color: #403E59;
}
.gradient {
  background: linear-gradient(135deg, #6979F8 0%, #4856C0 100%);
  color: #FFF;
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

