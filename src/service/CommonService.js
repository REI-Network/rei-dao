import http from './http';
export const getUnstake = (apiurl, params) => http({
    method: 'GET',
    url: `${apiurl}api/Unstake`,
    params
});

export const getMyStake = (apiurl,params) => http({
    method: 'GET',
    url: `${apiurl}api/MyStakeAddress`,
    params
});

export const getAssetPrice = (apiurl,params) => http({
    method: 'GET',
    url: `${apiurl}market/asset/chart`,
    params
});

export const getAssetInfo = (apiurl,params) => http({
    method: 'GET',
    url: `${apiurl}market/asset/info`,
    params
});

export const getPrice = (params) => http({
  method: 'GET',
  url: `https://api-market-main.rei.network/market/asset/price`,
  params
});

export const getValidatorList = (params) => http({
    method: 'GET',
    url:'https://gateway.rei.network/api/validator',
    params
});
export const getValidatorDetails = (params) => http({
    method: 'GET',
    url:'/data/validator/validator-list.json',
    params
});

export const getReiSatistic = (params) => http({
  method: 'GET',
  url:'https://gateway.rei.network/api/reistats',
  params
});

export const getNftHolder = (params) => http({
  method: 'GET',
  url:'https://gateway.rei.network/api/nft/holder',
  params
});

export const getValidatorMinedInfo = (params) => http({
  method: 'get',
  url:'https://gateway.rei.network/api/miner',
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
    url = `https://4everland.io/ipfs/${_cid}`;
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


export const getResponseTime = (url,params) => http({
  method: 'get',
  url:url,
  params
});
