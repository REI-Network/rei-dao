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

