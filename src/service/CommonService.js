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

  let url = '';
  if(!ipfsgateway){
    if(process.env.VUE_APP_IPFS_GATEWAY.toUpperCase() == '4EVERLAND'){
      url = `https://ipfs.4everland.xyz/ipfs/${cid}`;
    } else if(process.env.VUE_APP_IPFS_GATEWAY.toUpperCase() == 'IPFS'){
      url = `https://ipfs.io/ipfs/${cid}`;
    } else if(process.env.VUE_APP_IPFS_GATEWAY.toUpperCase() == 'PINATA'){
      url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    }
  } else {
    url = `${decodeURIComponent(ipfsgateway)}${cid}`;
    console.log(url)
  }
  return url;
};
export const getIpfsGatewayUrl = () => {
  let ipfsgateway = localStorage.getItem('ipfsGatewayUrl');
  let url = '';
  if(!ipfsgateway){
    if(process.env.VUE_APP_IPFS_GATEWAY.toUpperCase() == '4EVERLAND'){
      url = `https://ipfs.4everland.xyz/ipfs/`;
    } else if(process.env.VUE_APP_IPFS_GATEWAY.toUpperCase() == 'IPFS'){
      url = `https://ipfs.io/ipfs/`;
    } else if(process.env.VUE_APP_IPFS_GATEWAY.toUpperCase() == 'PINATA'){
      url = `https://gateway.pinata.cloud/ipfs/`;
    }
  } else {
    url = decodeURIComponent(ipfsgateway);
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
