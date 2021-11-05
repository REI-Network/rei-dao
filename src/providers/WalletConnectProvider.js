import WalletConnectProvider from '@walletconnect/web3-provider';

//  Create WalletConnect Provider
const provider = new WalletConnectProvider({
  infuraId: '27e484dcd9e3efcfd25a83a78777cdf1' // Required
});

// Subscribe to accounts change
provider.on('accountsChanged', (accounts) => {
  console.log(accounts);
});

// Subscribe to chainId change
provider.on('chainChanged', (chainId) => {
  console.log(chainId);
});

// Subscribe to networkId change
provider.on('networkChanged', (networkId) => {
  console.log(networkId);
});

// Subscribe to session connection/open
provider.on('open', () => {
  console.log('open');
});

// Subscribe to session disconnection/close
provider.on('close', (code, reason) => {
  console.log(code, reason);
});

export default provider;
