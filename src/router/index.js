import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboards from '../views/Dashboards.vue';
import MyAccount from '../views/MyAccount.vue';
import Stake from '../views/Stake.vue';
import StakeForGas from '../views/StakeForGas.vue';
import Governance from '../views/Governance.vue';
import Bridge from '../views/Bridge.vue';
import Grants from '../views/Grants.vue';
import Asset from '../views/Asset.vue';
import GrantsDetails from '../components/GrantsDetails.vue';
import StakeValidator from '../components/StakeValidator.vue';
import MyNftDetails from '../components/MyAccountNftInfo.vue';
import MyNftCollection from '../components/MyAccountNFTCollections.vue';
import MyAccountWallet from '../components/MyAccountWallet.vue';
import AssetsInfo from '../components/AssetsInfo.vue';
import AssetNft from '../components/AssetNft.vue';
import AssetsCollections from '../components/AssetsCollections.vue';
import AssetsTokenList from '../components/AssetsTokenList.vue';


const routes = [
  {
    path: '/',
    name: 'Index',
    //component: Index
    redirect: '/dashboards'
  },
  {
    path: '/dashboards',
    name: 'Dashboards',
    component: Dashboards
  },
  {
    path: '/myAccount',
    name: 'My Account',
    component: MyAccount
  },
  {
    path: '/myAccount/:type',
    name: 'My Account',
    component: MyAccount
  },
  {
    path: '/stake',
    name: 'Stake',
    component: Stake,
    // component: () => import('../views/Stake.vue')
  },
  {
    path: '/stake/:type',
    name: 'Stake',
    component: Stake,
  },
  {
    path: '/stake/validator/:id/:address',
    name: 'StakeInfo',
    component: StakeValidator,
  },
  {
    path: '/stake/validator/:id/:address/:token',
    name: 'StakeInfo',
    component: StakeValidator,
  },
  {
    path: '/stakeforgas',
    name: 'StakeForGas',
    component: StakeForGas
  },
  {
    path: '/stakeforgas/:type',
    name: 'StakeForGas',
    component: StakeForGas
  },
  {
    path: '/governance',
    name: 'Governance',
    component: Governance
  },
  {
    path: '/bridge',
    name: 'Bridge',
    component: Bridge
  },
  {
    path: '/bridge/:type',
    name: 'Bridge',
    component: Bridge
  },
  {
    path: '/grants',
    name: 'Grants',
    component: Grants
  },
  {
    path: '/grants/details',
    name: 'GrantsDetails',
    component: GrantsDetails
  },
  {
    path: '/stakeValidator',
    name: 'stake',
    component: StakeValidator
  },
  {
    path: '/myAccount/nfts',
    name: 'NftDetails',
    component: MyNftDetails
  },
  {
    path: '/myAccount/collection',
    name: 'NftCollection',
    component: MyNftCollection
  },
  {
    path: '/myAccount/portfolio/:token',
    name: 'MyAccountWallet',
    component: MyAccountWallet
  },
  {
    path: '/myAccount/portfolio/:token/:type',
    name: 'MyAccountWallet',
    component: MyAccountWallet
  },
  {
    path: '/asset',
    name: 'Asset',
    component: Asset
  },
  {
    path: '/asset/assetNft',
    name: 'AssetNft',
    component: AssetNft
  },
  {
    path: '/asset/collection',
    name: 'AssetsCollections',
    component: AssetsCollections
  },
  {
    path: '/asset/details',
    name: 'AssetsTokenList',
    component: AssetsTokenList
  },
  {
    path: '/asset/erc20/:token',
    name: 'AssetsInfo',
    component: AssetsInfo
  },
  {
    path: '/asset/:type',
    name: 'Asset',
    component: Asset
  },
  
];

const router = new VueRouter({
  routes
});

Vue.use(VueRouter);

export default router;
