import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboards from '../views/Dashboards.vue';
import MyAccount from '../views/MyAccount.vue';
import Stake from '../views/Stake.vue';
import StakeForGas from '../views/StakeForGas.vue';


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
    name: 'MyAccount',
    component: MyAccount
  },
  {
    path: '/stake',
    name: 'Stake',
    component: Stake
    // component: () => import('../views/Stake.vue')
  },
  {
    path: '/stakeforgas',
    name: 'StakeForGas',
    component: StakeForGas
  }
];

const router = new VueRouter({
  routes
});

Vue.use(VueRouter);

export default router;
