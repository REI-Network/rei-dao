import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboards from '../views/Dashboards.vue';
import MyAccount from '../views/MyAccount.vue';
import Stake from '../views/Stake.vue';
import StakeForGas from '../views/StakeForGas.vue';
import Governance from '../views/Governance.vue';
import Bridge from '../views/Bridge.vue';
import Grants from '../views/Grants.vue';
import GrantsDetails from '../components/GrantsDetails.vue';
import StakeValidator from '../components/StakeValidator.vue';
import MyNftDetails from '../components/MyNftDetails.vue';
import MyNftCollection from '../components/MyAccountNFTCollections.vue';
import MyAccountWallet from '../components/MyAccountWallet.vue';


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
    path: '/stake',
    name: 'Stake',
    component: Stake,
    // component: () => import('../views/Stake.vue')
  },
  {
    path: '/stake/validator',
    name: 'StakeInfo',
    component: StakeValidator,
    // component: () => import('../views/Stake.vue')
  },
  {
    path: '/stakeforgas',
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
    path: '/myAccount/details',
    name: 'NftDetails',
    component: MyNftDetails
  },
  {
    path: '/myAccount/collection',
    name: 'NftCollection',
    component: MyNftCollection
  },
  {
    path: '/myAccount/wallet',
    name: 'MyAccountWallet',
    component: MyAccountWallet
  }
];

const router = new VueRouter({
  routes
});

Vue.use(VueRouter);

export default router;
