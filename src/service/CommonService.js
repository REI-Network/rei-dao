import http from './http';
export const getUnstake = (params) => http({
    method: 'GET',
    url: `${process.env.VUE_APP_SERVER_API}api/Unstake`,
    params
});

export const getMyStake = (params) => http({
    method: 'GET',
    url: `${process.env.VUE_APP_SERVER_API}api/MyStakeAddress`,
    params
});
