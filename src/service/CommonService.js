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
    url:'https://gateway.rei.network/api/validator/details',
    params
});

export const getReiSatistic = (params) => http({
  method: 'GET',
  url:'https://gateway.rei.network/api/reistats',
  params
});


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
