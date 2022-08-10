import {
  rlp,
  rlphash,
  ecrecover,
  toBuffer,
  BN,
  Address,
  intToBuffer,
} from "ethereumjs-util";

/**
 * Recover miner address from block info
 * @param number - Block number, hex encode
 * @param hash - Block hash
 * @param extraData - Block extra data
 * @returns Miner address
 */
export function recoverMinerAddress(number,hash,extraData) {
  // decode extra data
  const decoded = rlp.decode(
    toBuffer(extraData).slice(32)
  )
  if (decoded.length < 3) {
    throw new Error("invalid rei header");
  }

  // get round and POLRound
  const roundAndPOLRound = decoded[1];
  if (roundAndPOLRound.length < 2) {
    throw new Error("invalid round");
  }
  const round = roundAndPOLRound[0];
  const POLRound = roundAndPOLRound[1];

  // get r, s, v
  const signature = decoded[2];
  if (signature.length !== 65) {
    throw new Error("invalid signature");
  }
  const r = signature.slice(0, 32);
  const s = signature.slice(32, 64);
  const v = new BN(signature.slice(64, 65)).addn(27);

  // calculate message hash
  const msgHash = rlphash([
    // proposal vote type
    intToBuffer(0),
    toBuffer(number),
    round,
    POLRound,
    toBuffer(hash),
  ]);

  // recover miner address
  return Address.fromPublicKey(ecrecover(msgHash, v, r, s)).toString();
}


