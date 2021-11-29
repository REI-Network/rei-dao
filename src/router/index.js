import Vue from 'vue';
import VueRouter from 'vue-router';
import Stake from '../views/Stake.vue';
import StakeForGas from '../views/StakeForGas.vue';

const routes = [
  {
    path: '/',
    name: 'Index',
    //component: Index
    redirect: '/stake'
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
