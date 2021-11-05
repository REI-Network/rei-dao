/* eslint-disable no-undef */
import store from '../store';

const TASK_INTERVAL = 3000;
var stoped = false;

const _task = async (onFinish) => {
  let txs = store.getters.pendingTxs;
  let finishedTxs = {};
  let failedTxs = {};
  for (var tx of txs) {
    if (tx.status === 'PENDING') {
      let receipt = await web3.eth.getTransactionReceipt(tx.txid);
      console.log('tx', receipt);
      if (receipt && receipt.blockHash && receipt.blockNumber) {
        onFinish && onFinish(tx, receipt.status);
        if (receipt.status) {
          finishedTxs[tx.txid] = true;
        } else {
          failedTxs[tx.txid] = true;
        }
      }
    }
  }
  let latestTxs = store.getters.txs;

  latestTxs = latestTxs.map((tx) => {
    if (finishedTxs[tx.txid]) {
      tx.status = 'FINISHED';
    }
    if (failedTxs[tx.txid]) {
      tx.status = 'FAILED';
    }
    return tx;
  });
  store.commit('setTxs', { txs: latestTxs });
  if (!stoped) {
    setTimeout(() => {
      _task(onFinish);
    }, TASK_INTERVAL);
  }
};

const start = (onFinish) => {
  _task(onFinish);
};

const stop = () => {
  stoped = true;
};

export { start, stop };
