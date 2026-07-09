<template>
  <v-card class="bridge-card" rounded="lg">
    <div class="bridge-content">
      <!-- From Section -->
      <div class="bridge-section from-section">
        <div class="from-section-header ">
            <div class="from-section-header-left">
              <div class="section-label">From</div>
              <div class="network-info">
                <img class="network-logo" :src="fromNetworkLogo" width="24" height="24"  />
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
          <div class="token-display-wrap">
            <div class="token-display" @click="showTokenMenu = !showTokenMenu">
              <img class="token-logo" :src="selectedAssetLogo" width="48" height="48"  />
              <span class="token-symbol">{{ selectedAsset }}</span>
              <v-icon size="16" class="dropdown-icon">mdi-chevron-down</v-icon>
            </div>
            <div v-if="showTokenMenu" class="token-menu">
              <div
                v-for="asset in assets"
                :key="asset.symbol"
                class="token-menu-item"
                :class="{ active: selectedAsset === asset.symbol }"
                @click="selectAsset(asset.symbol)"
              >
                <img class="token-logo" :src="asset.logo" width="24" height="24" />
                <span>{{ asset.symbol }}</span>
              </div>
            </div>
          </div>
          <div class="amount-display">
            <span class="amount-value">
              <v-text-field
                v-model="fromAmount"
                :placeholder="amountPlaceholder"
                min="0"
                outlined
                dense
                hide-details
                class="amount-input"
              >
              <template v-slot:append>
                <v-btn text x-small @click="setAll">
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
              <img class="network-logo" :src="toNetworkLogo" width="24" height="24"  />
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
          <div class="token-display">
            <img class="token-logo" :src="selectedAssetLogo" width="48" height="48"  />
            <span class="token-symbol">{{ selectedAsset }}</span>
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
      :disabled="!canBridge || bridgeLoading"
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

import abiBscBridge from '../abis/abiBscBridge';
import abiREIBridge from '../abis/abiREIBridge';
import wrapReiAbi from '../abis/abiWrapRei';
import filters from '../filters';

const REI_Token_Address = process.env.VUE_APP_REI_BSCTOKEN_CONTRACT;
const REI_Bridge_Address = process.env.VUE_APP_REI_BRIDGE_CONTRACT;
const BSC_Bridge_Address = process.env.VUE_APP_BSC_BRIDGE_CONTRACT;
const BSC_USDT_Address = process.env.VUE_APP_BSC_USDT_ADDRESS || '0x55d398326f99059fF775485246999027B3197955';
const REI_USDT_Address = process.env.VUE_APP_REI_USDT_ADDRESS || '0x988a631Caf24E14Bb77EE0f5cA881e8B5dcfceC7';
// REI USDT uses 6 decimals; BSC USDT (BEP20) uses 18 decimals
const REI_USDT_DECIMALS = 6;
const BSC_USDT_DECIMALS = 18;

const REI_LOGO = require('../assets/images/rei.svg');
const USDT_LOGO = require('../assets/images/usdt.svg');
const BNB_LOGO = require('../assets/images/bnbchain.png');

export default {
  filters,
  name: 'BridgeAsset',
  data() {
    return {
      fromNetwork: 'REI Network',
      toNetwork: 'BNB Chain',
      fromNetworkLogo: REI_LOGO,
      toNetworkLogo: BNB_LOGO,
      selectedAsset: 'REI',
      assets: [
        { symbol: 'REI', logo: REI_LOGO },
        { symbol: 'USDT', logo: USDT_LOGO },
      ],
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
      showTokenMenu: false,
      bridgeLoading: false,
      loading: false,
      alreadyAddedToken: false,
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
    selectedAssetLogo() {
      return this.selectedAsset === 'USDT' ? USDT_LOGO : REI_LOGO;
    },
    amountPlaceholder() {
      return this.selectedAsset === 'REI' ? 'Minimum 1 REI' : 'Enter USDT amount';
    },
    canBridge() {
      const amount = parseFloat(this.fromAmount);
      if (!(amount > 0)) return false;
      if (this.selectedAsset === 'REI') return amount >= 1;
      return true;
    },
    addTokenStorageKey() {
      return this.selectedAsset === 'USDT' ? 'addToken_USDT' : 'addToken';
    },
  },
  mounted() {
    this.alreadyAddedToken = localStorage.getItem(this.addTokenStorageKey) === 'true';
    this.switchToREINetwork().catch(() => {});
    this.refreshBalances();
  },
  watch: {
    async 'connection.balance'(newBalance) {
      if (typeof newBalance === 'undefined') return;
      if (this.selectedAsset === 'REI' && this.fromNetwork === 'REI Network') {
        this.fromBalance = newBalance;
      }
    },
    'connection.address': {
      immediate: true,
      handler(newAddress) {
        if (newAddress) {
          this.refreshBalances();
        } else {
          this.fromBalance = '0';
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
    getWeb3WithWallet() {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or other supported wallets');
      }
      return new Web3(window.ethereum);
    },
    async selectAsset(symbol) {
      if (this.selectedAsset === symbol) {
        this.showTokenMenu = false;
        return;
      }
      this.selectedAsset = symbol;
      this.showTokenMenu = false;
      this.fromAmount = '0';
      this.fromBalance = '0';
      this.toBalance = '0';
      this.alreadyAddedToken = localStorage.getItem(this.addTokenStorageKey) === 'true';
      await this.refreshBalances();
    },
    async setAll() {
      this.fromAmount = this.fromBalance;
    },
    formatUnits(value, decimals) {
      const bn = Web3.utils.toBN(value || '0');
      const base = Web3.utils.toBN(10).pow(Web3.utils.toBN(decimals));
      const whole = bn.div(base).toString();
      let fraction = bn.mod(base).toString().padStart(decimals, '0');
      fraction = fraction.replace(/0+$/, '');
      return fraction ? `${whole}.${fraction}` : whole;
    },
    parseUnits(amount, decimals) {
      const value = String(amount || '0').trim();
      if (!value || Number.isNaN(Number(value))) {
        throw new Error('Invalid amount');
      }
      const [wholePart, fractionPart = ''] = value.split('.');
      if (fractionPart.length > decimals) {
        throw new Error(`Amount exceeds ${decimals} decimals`);
      }
      const fraction = fractionPart.padEnd(decimals, '0');
      return Web3.utils.toBN(wholePart || '0')
        .mul(Web3.utils.toBN(10).pow(Web3.utils.toBN(decimals)))
        .add(Web3.utils.toBN(fraction || '0'))
        .toString();
    },
    async getErc20Balance(web3, tokenAddress, account, decimals = 18) {
      if (!tokenAddress) {
        throw new Error('Token address is not configured');
      }
      const contract = new web3.eth.Contract(wrapReiAbi, tokenAddress);
      const balanceRaw = await contract.methods.balanceOf(account).call();
      return this.formatUnits(balanceRaw, decimals);
    },
    async refreshBalances() {
      if (!this.connection || !this.connection.address) {
        this.fromBalance = '0';
        this.toBalance = '0';
        return;
      }
      const requestId = (this._balanceRequestId = (this._balanceRequestId || 0) + 1);
      const asset = this.selectedAsset;
      this.loading = true;
      try {
        const [reiBalance, bscBalance] = await Promise.all([
          this.fetchREISideBalance(),
          this.fetchBscSideBalance(),
        ]);
        // Ignore stale responses when asset/network changed mid-flight
        if (requestId !== this._balanceRequestId || asset !== this.selectedAsset) {
          return;
        }
        if (this.fromNetwork === 'REI Network') {
          this.fromBalance = reiBalance;
          this.toBalance = bscBalance;
        } else {
          this.fromBalance = bscBalance;
          this.toBalance = reiBalance;
        }
      } catch (error) {
        console.error('Error refreshing balances:', error);
      } finally {
        if (requestId === this._balanceRequestId) {
          this.loading = false;
        }
      }
    },
    async fetchREISideBalance() {
      const web3REI = this.getREIWeb3();
      if (this.selectedAsset === 'USDT') {
        return this.getErc20Balance(
          web3REI,
          REI_USDT_Address,
          this.connection.address,
          REI_USDT_DECIMALS
        );
      }
      const balance = await web3REI.eth.getBalance(this.connection.address);
      return web3REI.utils.fromWei(web3REI.utils.toBN(balance));
    },
    async fetchBscSideBalance() {
      const web3Bsc = this.getBscWeb3();
      if (this.selectedAsset === 'USDT') {
        return this.getErc20Balance(
          web3Bsc,
          BSC_USDT_Address,
          this.connection.address,
          BSC_USDT_DECIMALS
        );
      }
      return this.getErc20Balance(web3Bsc, REI_Token_Address, this.connection.address, 18);
    },
    async fetchBscBalance() {
      try {
        if (!this.connection || !this.connection.address) {
          if (this.toNetwork === 'BNB Chain') this.toBalance = '0';
          else this.fromBalance = '0';
          return;
        }
        const balance = await this.fetchBscSideBalance();
        if (this.toNetwork === 'BNB Chain') {
          this.toBalance = balance;
        } else {
          this.fromBalance = balance;
        }
      } catch (error) {
        console.error('Error fetching BSC balance:', error);
      }
    },
    async fetchREIBalance() {
      try {
        const balance = await this.fetchREISideBalance();
        if (this.toNetwork === 'REI Network') {
          this.toBalance = balance;
        } else {
          this.fromBalance = balance;
        }
        if (this.selectedAsset === 'REI') {
          const connection = { ...this.connection, balance };
          this.setConnection({ connection });
        }
      } catch (error) {
        console.error('Error fetching REI balance:', error);
      }
    },

    async swapNetworks() {
      const tempNetwork = this.fromNetwork;
      this.fromNetwork = this.toNetwork;
      this.toNetwork = tempNetwork;

      const tempLogo = this.fromNetworkLogo;
      this.fromNetworkLogo = this.toNetworkLogo;
      this.toNetworkLogo = tempLogo;

      const tempBalance = this.fromBalance;
      this.fromBalance = this.toBalance;
      this.toBalance = tempBalance;

      this.fromAmount = '0';
      this.toAmount = '0';
      this.showTokenMenu = false;

      if (this.fromNetwork === 'BNB Chain') {
        await this.switchToBscNetwork().catch(() => {});
      } else {
        await this.switchToREINetwork().catch(() => {});
      }
      this.refreshBalances();
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
    async ensureAllowance(web3, tokenAddress, owner, spender, amountWei, txOptions) {
      const erc20Contract = new web3.eth.Contract(wrapReiAbi, tokenAddress);
      const allowance = await erc20Contract.methods.allowance(owner, spender).call();
      if (web3.utils.toBN(allowance).lt(web3.utils.toBN(amountWei))) {
        await erc20Contract.methods.approve(
          spender,
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        ).send(txOptions);
      }
    },
    async handleBridge() {
      if (this.fromNetwork === 'REI Network') {
        await this.handleBridgeToBsc();
      } else {
        await this.handleBridgeToREI();
      }
    },
    async handleBridgeToBsc() {
      try {
        this.bridgeLoading = true;
        await this.switchToREINetwork();

        const web3 = this.getWeb3WithWallet();
        const contract = new web3.eth.Contract(abiREIBridge, REI_Bridge_Address);
        let res;

        if (this.selectedAsset === 'USDT') {
          const amountRaw = this.parseUnits(this.fromAmount, REI_USDT_DECIMALS);
          await this.ensureAllowance(
            web3,
            REI_USDT_Address,
            this.connection.address,
            REI_Bridge_Address,
            amountRaw,
            { from: this.connection.address }
          );
          res = await contract.methods.lockforBscUSDT(
            this.connection.address,
            amountRaw
          ).send({
            from: this.connection.address,
          });
        } else {
          const amountWei = web3.utils.toWei(this.fromAmount);
          res = await contract.methods.lockforBsc(
            this.connection.address
          ).send({
            from: this.connection.address,
            value: web3.utils.numberToHex(amountWei)
          });
        }

        if (res.transactionHash) {
          this.addTx({
            tx: {
              txid: res.transactionHash,
              type: 'bridge',
              status: 'PENDING',
              data: {
                amount: this.fromAmount,
                symbol: this.selectedAsset,
                to: 'BNB Chain'
              },
              timestamp: new Date().getTime()
            }
          });
        }

        await this.refreshBalances();
        if (this.selectedAsset === 'REI') {
          const balance = await web3.eth.getBalance(this.connection.address);
          const connection = { ...this.connection, balance: web3.utils.fromWei(web3.utils.toBN(balance)) };
          this.setConnection({ connection });
        }

        this.loading = true;
        await this.sleep(20000);
        await this.fetchBscBalance();
        this.loading = false;
      } catch (e) {
        console.log(e);
        this.$dialog.notify.warning(e.message);
      } finally {
        this.bridgeLoading = false;
        this.loading = false;
      }
    },
    
    async handleBridgeToREI() {
      if (!this.canBridge) return;
      try {
        await this.switchToBscNetwork();
        this.bridgeLoading = true;
        const web3Bsc = this.getWeb3WithWallet();
        const gasPrice = await web3Bsc.eth.getGasPrice();
        const legacyTxOptions = {
          from: this.connection.address,
          gasPrice
        };
        const contract = new web3Bsc.eth.Contract(abiBscBridge, BSC_Bridge_Address);
        const amountRaw = this.selectedAsset === 'USDT'
          ? this.parseUnits(this.fromAmount, BSC_USDT_DECIMALS)
          : web3Bsc.utils.toWei(this.fromAmount);
        const tokenAddress = this.selectedAsset === 'USDT' ? BSC_USDT_Address : REI_Token_Address;

        await this.ensureAllowance(
          web3Bsc,
          tokenAddress,
          this.connection.address,
          BSC_Bridge_Address,
          amountRaw,
          legacyTxOptions
        );

        let res;
        if (this.selectedAsset === 'USDT') {
          res = await contract.methods.burnForUsdt(
            this.connection.address,
            amountRaw
          ).send(legacyTxOptions);
        } else {
          res = await contract.methods.burnForRei(
            this.connection.address,
            amountRaw
          ).send(legacyTxOptions);
        }

        if (res.transactionHash) {
          this.addTx({
            tx: {
              txid: res.transactionHash,
              type: 'bridge',
              status: 'PENDING',
              data: {
                amount: this.fromAmount,
                symbol: this.selectedAsset,
                to: 'REI Network'
              },
              timestamp: new Date().getTime()
            }
          });
        }

        this.fromBalance = await this.fetchBscSideBalance();
        this.loading = true;
        await this.sleep(20000);
        await this.fetchREIBalance();
        this.loading = false;
      } catch (e) {
        console.log(e);
        this.$dialog.notify.warning(e.message);
      } finally {
        this.bridgeLoading = false;
        this.loading = false;
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
        const isUsdt = this.selectedAsset === 'USDT';
        await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: isUsdt ? BSC_USDT_Address : REI_Token_Address,
              symbol: isUsdt ? "USDT" : "wREI",
              decimals: 18,
              image: isUsdt ? USDT_LOGO : REI_LOGO,
            },
          },
        });
        localStorage.setItem(this.addTokenStorageKey, 'true');
        this.alreadyAddedToken = true;
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

.token-display-wrap {
  position: relative;
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

.token-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 10;
  min-width: 140px;
  padding: 4px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.token-menu-item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover,
  &.active {
    background-color: rgba(105, 121, 248, 0.1);
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

  .token-menu {
    background: #2a2a2a;
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
