<template>
  <v-card class="bridge-card" rounded="lg">
    <!-- <div class="bridge-header" >
      <h2 class="bridge-title">Bridge</h2>
      <v-icon class="settings-icon" size="20">mdi-dots-vertical</v-icon>
    </div> -->

    <div class="bridge-content">
      <!-- From Section -->
      <div class="bridge-section from-section">
        <div class="from-section-header ">
            <div class="from-section-header-left">
              <div class="section-label">From</div>
              <div class="network-info">
                <img class="network-logo" :src="fromTokenLogo" width="24" height="24"  />
                <span class="network-name">{{ fromNetwork }}</span>
              </div>
            </div>
            <div class="balance-info">
              <div class="balance-info">
                <v-icon size="16" class="wallet-icon">mdi-wallet</v-icon>
                <span class="balance-text">{{ fromBalance | asset(4) }}</span>
              </div>
            </div>
        </div>
        <div class="token-selector">
          <div class="token-display" @click="showFromTokenMenu = !showFromTokenMenu">
            <img class="token-logo" src="../assets/images/rei.svg" width="48" height="48"  />
            <span class="token-symbol">REI</span>
            <!-- <v-icon size="16" class="dropdown-icon">mdi-chevron-down</v-icon> -->
          </div>
          <div class="amount-display">
            
            <span class="amount-value">
              <v-text-field
                v-model="fromAmount"
                placeholder="Minimum 1 REI"
                min="1"
                outlined
                dense
                hide-details
                class="amount-input"
              >
              <template v-slot:append>
                <v-btn text x-small @click="setAll('fromAmount', 'fromBalance')">
                  {{ $t('stake.max') }}
                </v-btn>
              </template>
            </v-text-field>
            </span>
          </div>
        </div>
      </div>

      <!-- Swap Button -->
      <div class="swap-button-container">
        <v-btn
          icon
          class="swap-button"
          @click="swapNetworks"
        >
          <v-icon>mdi-swap-vertical</v-icon>
        </v-btn>
      </div>

      <!-- To Section -->
      <div class="bridge-section to-section">
        <div class="from-section-header ">
          <div class="from-section-header-left">
            <div class="section-label">To</div>
            <div class="network-info">
              <img class="network-logo" :src="toTokenLogo" width="24" height="24"  />
              <span class="network-name">{{ toNetwork }}</span>
            </div>
          </div>
          <div class="balance-info">
            <v-icon size="16" class="wallet-icon">mdi-wallet</v-icon>
            <span class="balance-text">{{ toBalance | asset(4) }}</span>
            <v-progress-circular size="18" width="2" v-if="loading" class="mr-1" indeterminate color="primary"></v-progress-circular>
            <v-btn text x-small @click="handleAddToken" v-if="!alreadyAddedToken && toNetwork === 'BNB Chain'">
              Add Token
            </v-btn>
          </div>
        </div>
        <div class="token-selector">
          <div class="token-display" @click="showToTokenMenu = !showToTokenMenu">
            <img class="token-logo" src="../assets/images/rei.svg" width="48" height="48"  />
            <span class="token-symbol">REI</span>
            <!-- <v-icon size="16" class="dropdown-icon">mdi-chevron-down</v-icon> -->
          </div>
          <span class="amount-value">{{ fromAmount }}</span>
        </div>
        
      </div>
    </div>

    <!-- Bridge Button -->
    <v-btn
      class="bridge-button"
      block
      large
      :disabled="!canBridge || bridgeLoading || fromAmount < 1"
      @click="handleBridge"
      :loading="bridgeLoading"
    >
      {{ bridgeLoading ? 'Bridging...' : 'Bridge' }}
      <v-progress-circular v-if="bridgeLoading" size="20" width="2" indeterminate color="white"></v-progress-circular>
    </v-btn>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Web3 from 'web3';

//import batchAbi from '../abis/batch';
import abiBscBridge from '../abis/abiBscBridge';
import abiREIBridge from '../abis/abiREIBridge';
import wrapReiAbi from '../abis/abiWrapRei';
import filters from '../filters';
const REI_Token_Address = process.env.VUE_APP_REI_BSCTOKEN_CONTRACT;
const REI_Bridge_Address = process.env.VUE_APP_REI_BRIDGE_CONTRACT;
const BSC_Bridge_Address = process.env.VUE_APP_BSC_BRIDGE_CONTRACT;


export default {
  filters,
  name: 'BridgeAsset',
  data() {
    return {
      fromNetwork: 'REI Network',
      toNetwork: 'BNB Chain',
      fromTokenLogo: require('../assets/images/rei.svg'),
      toTokenLogo: require('../assets/images/bnbchain.png'),
      fromToken: 'REI',
      toToken: 'REI',
      fromAmount: '0',
      toAmount: '0.0',
      fromBalance: '0',
      toBalance: '0',
      bscProviderUrl: 'https://bsc-dataseed1.bnbchain.org',
      bscChainId: '0x38',
      reiProviderUrl: 'https://rpc.rei.network',
      bscWeb3: null,
      reiWeb3: null,
      toAddress: '',
      showFromTokenMenu: false,
      showToTokenMenu: false,
      bridgeLoading: false,
      loading: false,
      alreadyAddedToken: localStorage.getItem('addToken') == 'true' ? true : false
    };
  },
  computed: {
    ...mapGetters({
      txs: 'txs',
      pendingTxs: 'pendingTxs',
      connection: 'connection',
      apiUrl: 'apiUrl',
      dark: 'dark'
    }),
    canBridge() {
      return parseFloat(this.fromAmount) > 0 ;
    },
    addTokened(){
      return localStorage.getItem('addToken') === 'true';
    }
  },
  mounted() {
   this.fromBalance = (this.connection && this.connection.balance) || '0';
   this.switchToREINetwork();
   //this.fetchBscBalance();
  },
  watch: {
    async 'connection.balance'(newBalance) {
      if (typeof newBalance !== 'undefined') {
        if (this.fromNetwork === 'REI Network') {
          this.fromBalance = newBalance;
        }else {
        //   const web3Bsc = this.getBscWeb3();
        // const contract = new web3Bsc.eth.Contract(wrapReiAbi, REI_Token_Address);
        // console.log('connection.address',this.connection.address);
        // const balanceWei = await contract.methods.balanceOf(this.connection.address).call();
        //   this.toBalance = balanceWei;
        }
      }
    },
    'connection.address': {
      immediate: true,
      handler(newAddress) {
        console.log('newAddress',newAddress);
        if (newAddress) {
          this.fetchBscBalance();
        } else {
          this.toBalance = '0';
        }
      }
    },
  },
  methods: {
    ...mapActions({
      addTx: 'addTx',
      setConnection: 'setConnection',
    }),

    getBscWeb3() {
      if (!this.bscWeb3) {
        this.bscWeb3 = new Web3(this.bscProviderUrl);
      }
      return this.bscWeb3;
    },
    getREIWeb3() {
      if (!this.reiWeb3) {
        this.reiWeb3 = new Web3(this.reiProviderUrl);
      }
      return this.reiWeb3;
    },
    async setAll(){
      this.fromAmount = this.fromBalance;
    },
    async fetchBscBalance() {
      try {
        if (!this.connection || !this.connection.address) {
          this.toBalance = '0';
          return;
        }
        const web3Bsc = this.getBscWeb3();
        const contract = new web3Bsc.eth.Contract(wrapReiAbi, REI_Token_Address);
        console.log('connection.address',this.connection.address);
        const balanceWei = await contract.methods.balanceOf(this.connection.address).call();
        this.toBalance = web3Bsc.utils.fromWei(balanceWei);
        console.log('toBalance',this.toBalance);
      } catch (error) {
        console.error('Error fetching BSC balance:', error);
      }
    },

    swapNetworks() {
      const tempNetwork = this.fromNetwork;
      const tempToken = this.fromToken;
      const tempBalance = this.fromBalance;

      this.fromNetwork = this.toNetwork;
      this.fromToken = this.toToken;

      this.toNetwork = tempNetwork;

      this.toToken = tempToken;
      
      this.fromBalance = this.toBalance;
      this.toBalance = tempBalance;
      
      const tempTokenLogo = this.fromTokenLogo;
      this.fromTokenLogo = this.toTokenLogo;
      this.toTokenLogo = tempTokenLogo;
      this.fromAmount = '0';
      
      this.toAmount = '0';
    },
    async switchToBscNetwork() {
      if (!window.ethereum) {
        throw new Error('Metamask is not installed');
      }

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: this.bscChainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: this.bscChainId,
                chainName: 'BSC Smart Chain',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18
                },
                rpcUrls: [this.bscProviderUrl],
                blockExplorerUrls: ['https://bscscan.com']
              }],
            });
          } catch (addError) {
            console.error('Failed to switch to BSC network:', addError);
            throw new Error('Failed to switch to BSC network');
          }
        } else {
          throw switchError;
        }
      }
    },
    async switchToREINetwork() {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or other supported wallets');
      }

      try {
        
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xbabd' }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xbabd',
                chainName: 'REI Network',
                nativeCurrency: {
                  name: 'REI',
                  symbol: 'REI',
                  decimals: 18
                },
                rpcUrls: ['https://rpc.rei.network'],
                blockExplorerUrls: ["https://scan.rei.network/"]
              }],
            });
          } catch (addError) {
            console.error( addError);
            throw new Error('Failed to switch to REI network');
          }
        } else {
          throw switchError;
        }
      }
    },
    getWeb3WithWallet() {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or other supported wallets');
      }
      return new Web3(window.ethereum);
    },
    async handleBridge() {
      console.log('handleBridge', this.fromNetwork);
      if (this.fromNetwork === 'REI Network') {
         await this.handleBridgeToBsc();
      } else {
         await this.handleBridgeToREI();
      }
    },
    async handleBridgeToBsc() {
        try {
          // Handle bridge action
          console.log('Bridging...', {
            from: { network: this.fromNetwork, token: this.fromToken, amount: this.fromAmount },
            to: { network: this.toNetwork, token: this.toToken, address: this.toAddress }
          });
          this.bridgeLoading = true;
          await this.switchToREINetwork();

          const web3Bsc = this.getWeb3WithWallet();
          const contract = new web3Bsc.eth.Contract(abiREIBridge, REI_Bridge_Address);
          
          console.log(contract,this.connection.address, web3Bsc.utils.toWei(this.fromAmount));
          const res = await contract.methods.lockforBsc(
            this.connection.address
          ).send({
            from: this.connection.address,
            value: web3Bsc.utils.numberToHex(web3Bsc.utils.toWei(this.fromAmount))
          });
          if (res.transactionHash) {
            this.addTx({
              tx: {
                txid: res.transactionHash,
                type: 'bridge',
                status: 'PENDING',
                data: {
                  amount: this.fromAmount,
                  symbol: this.fromToken,
                  to: 'BNB Chain'
                },
                timestamp: new Date().getTime()
              }
            });
            this.bridgeLoading = false;
          }
          
          console.log(res);
          const balance = await web3Bsc.eth.getBalance(this.connection.address);
            console.log('balance',balance)
            const connection = { ...this.connection, balance: web3Bsc.utils.fromWei(web3Bsc.utils.toBN(balance)) };
            this.fromBalance = web3Bsc.utils.fromWei(web3Bsc.utils.toBN(balance));
            this.setConnection({ connection });
          
          this.loading = true;
          await this.sleep(20000);
          this.fetchBscBalance();
          this.loading = false;
        } catch (e) {
          console.log(e);
          this.$dialog.notify.warning(e.message);
          this.bridgeLoading = false;
        }
      
    },
    
    async handleBridgeToREI() {
      if (this.canBridge) {
        try {
          await this.switchToBscNetwork();
          this.bridgeLoading = true;
          const web3Bsc = this.getWeb3WithWallet();
          const gasPrice = await web3Bsc.eth.getGasPrice();
          const legacyTxOptions = {
            from: this.connection.address,
            gasPrice
          };
          console.log('BSC_Bridge_Address',await web3Bsc.eth.getChainId());
          const contract = new web3Bsc.eth.Contract(abiBscBridge, BSC_Bridge_Address);

          const erc20Contract = new web3Bsc.eth.Contract(wrapReiAbi, REI_Token_Address);
          const allowance = await erc20Contract.methods.allowance(this.connection.address, BSC_Bridge_Address).call();
          const amountWei = web3Bsc.utils.toWei(this.fromAmount);
          console.log('allowance',allowance, amountWei);

          if (web3Bsc.utils.toBN(allowance).lt(web3Bsc.utils.toBN(amountWei))) {
            await erc20Contract.methods.approve(BSC_Bridge_Address, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').send(legacyTxOptions);
          }
          
          console.log('Bridging...', {
            from: { network: this.fromNetwork, token: this.fromToken, amount: this.fromAmount,'wei': web3Bsc.utils.toWei(this.fromAmount) },
            to: { network: this.toNetwork, token: this.toToken, address: this.toAddress }
          });

          const res = await contract.methods.burnForRei(
            this.connection.address,
            web3Bsc.utils.toWei(this.fromAmount)
          ).send(legacyTxOptions);

          if (res.transactionHash) {
            this.addTx({
              tx: {
                txid: res.transactionHash,
                type: 'bridge',
                status: 'PENDING',
                data: {
                  amount: this.fromAmount,
                  symbol: this.fromToken,
                  to: 'REI Network'
                },
                timestamp: new Date().getTime()
              }
            });
            this.bridgeLoading = false;
          }
          
          console.log(res);

          const reiContract = new web3Bsc.eth.Contract(wrapReiAbi, REI_Token_Address);
        console.log('connection.address',this.connection.address);
        const balanceWei = await reiContract.methods.balanceOf(this.connection.address).call();
        this.fromBalance = web3Bsc.utils.fromWei(balanceWei);
          this.loading = true;
          await this.sleep(20000);
          this.fetchREIBalance();
          this.loading = false;
          //this.fetchBscBalance();
        } catch (e) {
          console.log(e);
          this.$dialog.notify.warning(e.message);
        }
        this.bridgeLoading = false;
      }
    },
    async fetchREIBalance() {
      try {
        const web3REI = this.getREIWeb3();
        const balance = await web3REI.eth.getBalance(this.connection.address);
        console.log('balance',balance)
        const connection = { ...this.connection, balance: web3REI.utils.fromWei(web3REI.utils.toBN(balance)) };
        this.toBalance = web3REI.utils.fromWei(web3REI.utils.toBN(balance));
        this.setConnection({ connection });
      } catch (error) {
        console.error('Error fetching REI balance:', error);
      }
    },
    sleep(timestamp) {
      return new Promise((resolve) => {
        setTimeout(resolve, timestamp);
      });
    },
    async handleAddToken() {
      try {
        await this.switchToBscNetwork();
        await window.ethereum.request({
              method: "wallet_watchAsset",
              params: {
                type: "ERC20",
                options: {
                  address: REI_Token_Address,
                  symbol: "wREI",
                  decimals: 18,
                  image: require('../assets/images/rei.svg'),
                },
              },
            }
        ) 
        localStorage.setItem('addToken', 'true');
        this.alreadyAddedToken = true;
        console.log('alreadyAddedToken',this.alreadyAddedToken);
        } catch (error) {
          console.error('Error adding token:', error);
        }
      
    },
  }
};
</script>

<style scoped lang="scss">
.bridge-card {
  padding: 24px;
  border-radius: 12px;
  max-width: 500px;
  margin: 0 auto 28px;
}

.bridge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.bridge-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.settings-icon {
  color: #868e9e;
  cursor: pointer;
}

.bridge-content {
  position: relative;
}

.bridge-section {
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
  margin-bottom: 16px;
}

.to-section {
  margin-bottom: 0;
}

.section-label {
  font-size: 16px;
  color: #868e9e;
  margin-bottom: 12px;
}

.network-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.network-logo {
  width: 16px !important;
  height: 16px !important;
  border-radius: 50%;
  margin-right: 4px;
  background-size: cover;
  background-position: center;
}
.token-logo {
  width: 24px !important;
  height: 24px !important;
  border-radius: 50%;
  margin-right: 8px;
  background-size: cover;
  background-position: center;
}

.ethereum-logo {
  background: linear-gradient(135deg, #627EEA 0%, #8B5CF6 100%);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    border: 2px solid white;
    border-radius: 50%;
    background: transparent;
  }
}

.solana-logo {
  background: linear-gradient(135deg, #14F195 0%, #9945FF 100%);
  position: relative;
  
  &::after {
    content: 'S';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 10px;
    font-weight: bold;
  }
}

.network-name {
  font-size: 16px;
  font-weight: 500;
}

.token-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.token-display {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.5);
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
}
.from-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.from-section-header-left {
  display: flex;

  gap: 12px;
  justify-content: flex-start;
}
.balance-info {
  display: flex;
  align-items: center;
  gap: 4px;
}
.token-logo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
  background-size: cover;
  background-position: center;
}

.usdt-logo {
  background: linear-gradient(135deg, #26A17B 0%, #00A86B 100%);
  position: relative;
  
  &::after {
    content: 'T';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
  }
}

.token-symbol {
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
}

.dropdown-icon {
  color: #868e9e;
}

.amount-display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.balance-info {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #868e9e;
  margin-bottom: 8px;
}

.wallet-icon {
  margin-right: 4px;
  color: #868e9e;
}

.balance-text {
  font-size: 16px;
}

.amount-value {
  font-size: 18px;
  color: #868e9e;
  font-weight: 500;
}

.swap-button-container {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.swap-button {
  background-color: rgba(255, 255, 255, 0.9) !important;
  border: 2px solid rgba(0, 0, 0, 0.1);
  width: 40px;
  height: 40px;
  
  .v-icon {
    color: #868e9e;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 1) !important;
    border-color: rgba(0, 0, 0, 0.2);
  }
}

.address-input-container {
  margin-top: 12px;
}

.address-input {
  ::v-deep .v-input__control {
    min-height: 40px;
  }
  
  ::v-deep .v-input__slot {
    background-color: rgba(255, 255, 255, 0.5) !important;
    border-radius: 8px;
  }
  
  ::v-deep input {
    font-size: 14px;
    color: #868e9e;
  }
  
  ::v-deep .v-text-field__slot input::placeholder {
    color: #868e9e;
    opacity: 0.6;
  }
}

.bridge-button {
  margin-top: 24px;
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  background-color: #E2E4EA !important;
  color: #868e9e !important;
  
  &:not(.v-btn--disabled) {
    background-color: #6979F8 !important;
    color: #fff !important;
  }
  
  &.v-btn--disabled {
    opacity: 0.5;
  }
}

// Dark theme support
.theme--dark {
  .bridge-section {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .token-display {
    background-color: rgba(255, 255, 255, 0.1);
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }
  }
  
  .swap-button {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(255, 255, 255, 0.2);
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.15) !important;
    }
  }
  
  .address-input {
    ::v-deep .v-input__slot {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }
  }
  
  .bridge-button {
    background-color: rgba(255, 255, 255, 0.1) !important;
    
    &:not(.v-btn--disabled) {
      background-color: #6979F8 !important;
    }
  }
}

@media screen and (max-width: 600px) {
  .bridge-card {
    padding: 20px;
  }
  
  .bridge-title {
    font-size: 18px;
  }
  
  .token-selector {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .amount-display {
    margin-top: 12px;
    align-items: flex-start;
  }
}
</style>

