import axios from './http';

import { cacheAdapterEnhancer } from 'axios-extensions';

const http = axios.create({
	adapter: cacheAdapterEnhancer(axios.defaults.adapter)
});

export const getUnstake = (apiurl, params) => http(`${apiurl}api/Unstake`,{
  params
});

export const getMyStake = (apiurl,params) => http(`${apiurl}api/MyStakeAddress`,{
  params
});

export const getAssetPrice = (apiurl,params) => http(`${apiurl}market/asset/chart`, {
  params
});

export const getAssetInfo = (apiurl, params) => http(`${apiurl}market/asset/info`,{
  params
});

export const getPrice = (params) => http('https://api-market-main.rei.network/market/asset/price',{
  params
});

export const getValidatorList = (params) => http('https://gateway.rei.network/api/validator',{
  params
});
export const getValidatorDetails = (params) => http('/data/validator/validator-list.json',{
  params
});

export const getReiSatistic = (params) => http.get('https://gateway.rei.network/api/reistats',
{
  params
});

export const getNftHolder = (params) => http('https://gateway.rei.network/api/nft/holder',{
  params
});

export const getValidatorMinedInfo = (params) => http.get('https://gateway.rei.network/api/miner',
{
  params
});


export const getHistoryData = (params) => http(`https://scan.rei.network/api?module=token&action=getTokenHolders`,{
  params
});
export const getTokenHolder = (params) => http(`https://gateway.rei.network/api/rei/holder`,{
  params
});
export const getTokenTransfer = (params) => http(`https://gateway.rei.network/api/token/transfer`,{
  params
});
export const getAssetTokenList = (params) => http(`https://gateway.rei.network/api/nft/tokenlist/`,{
  params
});
export const getSlashRecords= (params) => http(`https://gateway.rei.network/api/slashRecords`,{
  params
});
export const getAddressTag = (params) => http('/data/address/address-tag-list.json',{
  params
});

export const getIpfsGateway = (cid) => {
  let ipfsgateway = localStorage.getItem('ipfsGatewayUrl');
  let _cid = cid;
  if(!_cid) return '';
  if(_cid.indexOf('ipfs/')==0){
    _cid = _cid.replace('ipfs/', '');
  }

  let url = '';
  if(!ipfsgateway){
    url = `https://ipfs.rei.network/ipfs/${_cid}`;
  } else {
    url = `${decodeURIComponent(ipfsgateway)}/ipfs/${_cid}`;
  }
  return url;
};

export const postRpcRequest = (apiurl,params) => http({
    method: 'POST',
    url: `${apiurl}`,
    data:{
        "jsonrpc": "2.0",
         "id": 1,
         method:params.method,
         params:params.params
    }
});


export const getResponseTime = (url,params) => http(url,{
  params
});
