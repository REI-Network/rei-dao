import Vue from 'vue';
import Vuex from 'vuex';
import i18n from '../i18n';
import vuetify from '../plugins/vuetify';

Vue.use(Vuex);

const state = {
  connection: {
    loading: true,
    address: '',
    chainId: '',
    network: '',
    walletName: '',
    balance: 0
  },
  txs: [],
  finishedTxs: [],
  darkMode: Number(localStorage.getItem('darkMode') || '2'),
  language: 'en',
  languages: [
    { key: 'en', text: 'EN' }
  ],
  modes: [
    { key: 0, text: 'settings.light', icon: 'mdi-white-balance-sunny' },
    { key: 1, text: 'settings.dark', icon: 'mdi-weather-night' },
    { key: 2, text: 'settings.auto', icon: 'mdi-autorenew' }
  ],
  totalStakes: [],
  gasStakeTotalAmount: 0,
  leftCrude:0, 
  usedCrude:0,
  leftCrudePercent:0,
  usedCrudePercent:0,
  assetInfo:'',
  apiUrl: {
    rpc:'https://rpc.rei.network', 
    graph:'https://api-graphql-main.rei.network/',
    chart: 'https://api-market-main.rei.network/'
  },
  scanUrl:'https://scan.rei.network/',
  nftInfo:[],
  nftCollect:{},
  addressTags:{}
};
const getters = {
  connection: (state) => state.connection,
  language: (state) => state.language,
  darkMode: (state) => state.darkMode,
  modes: (state) => state.modes,
  languages: (state) => state.languages,
  txs: (state) => state.txs,
  pendingTxs: (state) => {
    return state.txs.filter((tx) => tx.status == 'PENDING');
  },
  finishedTxs: (state) => state.finishedTxs,
  dark: (state) => {
    if (state.darkMode < 2) {
      return !!state.darkMode;
    } else {
      if (window.matchMedia) {
        let media = window.matchMedia('(prefers-color-scheme: dark)');
        if (media) {
          return !!media.matches;
        }
        return false;
      } else {
        return false;
      }
    }
  },
  totalStakes: (state) => state.totalStakes,
  gasStakeTotalAmount: (state) => state.gasStakeTotalAmount,
  leftCrude: (state) => state.leftCrude,
  usedCrude: (state) => state.usedCrude,
  leftCrudePercent: (state) => state.leftCrudePercent,
  usedCrudePercent: (state) => state.usedCrudePercent,
  assetInfo: (state) => state.assetInfo,
  apiUrl: (state) => state.apiUrl,
  scanUrl: (state) => state.scanUrl,
  nftInfo:  (state) => state.nftInfo,
  nftCollect: (state) => state.nftCollect,
  addressTags: (state) => state.addressTags
};

const mutations = {
  setConnection: (state, payload) => {
    state.connection = payload.connection;
  },
  switchLanguage: (state, payload) => {
    state.language = payload.language;
    i18n.locale = payload.language;
    localStorage.setItem('language', payload.language);
  },
  switchDarkMode: (state, payload) => {
    let darkMode = 0;
    if (payload.darkMode == 2) {
      if (window.matchMedia) {
        let media = window.matchMedia('(prefers-color-scheme: dark)');
        darkMode = media.matches;
      }
    } else {
      darkMode = !!payload.darkMode;
    }
    vuetify.framework.theme.dark = darkMode;
    state.darkMode = payload.darkMode;
    localStorage.setItem('darkMode', payload.darkMode);
  },
  addTx: (state, payload) => {
    let exist = state.txs.find((tx) => tx.txid == payload.tx.txid);
    if (!exist) {
      state.txs.unshift(payload.tx);
      let key = `${state.connection.network}_${state.connection.address.substr(2, 7)}_txs`;
      localStorage.setItem(key, JSON.stringify(state.txs));
    }
  },
  loadTxs: (state) => {
    let key = `${state.connection.network}_${state.connection.address.substr(2, 7)}_txs`;
    let item = localStorage.getItem(key);
    if (item && item.indexOf('[') > -1) {
      item = JSON.parse(item);
    } else {
      item = [];
    }
    state.txs = item;
  },
  setTxs: (state, payload) => {
    state.txs = payload.txs;
    let key = `${state.connection.network}_${state.connection.address.substr(2, 7)}_txs`;
    localStorage.setItem(key, JSON.stringify(state.txs));
  },
  setFinishedTxs: (state, payload) => {
    state.finishedTxs = payload.finishedTxs;
  },
  setTotalStakes: (state, payload) => {
    state.totalStakes = payload.totalStakes;
  },
  setGasStakeTotalAmount: (state, payload) => {
    state.gasStakeTotalAmount = payload.gasStakeTotalAmount;
  },
  setLeftCrude: (state, payload) => {
    state.leftCrude = payload.leftCrude;
  },
  setUsedCrude: (state, payload) => {
    state.usedCrude = payload.usedCrude;
  },
  setLeftCrudePercent: (state, payload) => {
    state.leftCrudePercent = payload.leftCrudePercent;
  },
  setUsedCrudePercent: (state, payload) => {
    state.usedCrudePercent = payload.usedCrudePercent;
  },
  setAssetInfo: (state, payload) => {
    state.assetInfo = payload.assetInfo;
  },
  setApiUrl: (state, payload) => {
    state.apiUrl = payload.apiUrl;
  },
  setScanUrl: (state, payload) => {
    state.scanUrl = payload.scanUrl;
  },
  setNftInfo: (state, payload) => {
    state.nftInfo = payload.nftInfo;
  },
  setNftCollect: (state, payload) => {
    state.nftCollect = payload.nftCollect;
  },
  setAddressTags: (state, payload) => {
    state.addressTags = payload.addressTags;
  }

};

const actions = {
  setConnection({ commit }, payload) {
    commit('setConnection', payload);
    commit('loadTxs', payload);
  },
  switchDarkMode({ commit }, payload) {
    commit('switchDarkMode', payload);
  },
  switchLanguage({ commit }, payload) {
    commit('switchLanguage', payload);
  },
  addTx: ({ commit }, payload) => {
    commit('addTx', payload);
  },
  setTxs: ({ commit }, payload) => {
    commit('setTxs', payload);
  },
  setFinishedTxs: ({ commit }, payload) => {
    commit('setFinishedTxs', payload);
  },
  setTotalStakes: ({ commit }, payload) => {
    commit('setTotalStakes', payload);
  },
  setGasStakeTotalAmount: ({ commit }, payload) => {
    commit('setGasStakeTotalAmount', payload);
  },
  setLeftCrude: ({ commit }, payload) => {
    commit('setLeftCrude', payload);
  },
  setUsedCrude: ({ commit }, payload) => {
    commit('setUsedCrude', payload);
  },
  setLeftCrudePercent: ({ commit }, payload) => {
    commit('setLeftCrudePercent', payload);
  },
  setUsedCrudePercent: ({ commit }, payload) => {
    commit('setUsedCrudePercent', payload);
  },
  setAssetInfo: ({ commit }, payload) => {
    commit('setAssetInfo', payload);
  },
  setApiUrl: ({ commit }, payload) => {
    commit('setApiUrl', payload);
  },
  setScanUrl: ({ commit }, payload) => {
    commit('setScanUrl', payload);
  },
  setNftInfo: ({ commit }, payload) => {
    commit('setNftInfo', payload);
  },
  setNftCollect: ({ commit }, payload) => {
    commit('setNftCollect', payload);
  },
  setAddressTags: ({ commit }, payload) => {
    commit('setAddressTags', payload);
  },
};

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});

export default store;
