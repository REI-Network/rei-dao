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
  language: localStorage.getItem('language') || (navigator.language ? navigator.language.split('-')[0] : 'en'),
  languages: [
    { key: 'zh', text: '中文' },
    { key: 'en', text: 'EN' }
  ],
  modes: [
    { key: 0, text: 'settings.light', icon: 'mdi-white-balance-sunny' },
    { key: 1, text: 'settings.dark', icon: 'mdi-weather-night' },
    { key: 2, text: 'settings.auto', icon: 'mdi-autorenew' }
  ],
  totalStakes: []
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
  totalStakes: (state) => state.totalStakes
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
};

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});

export default store;
