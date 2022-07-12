export default {
  app: {
    name: 'REI DAO',
    desc: 'staking to node'
  },
  notify: {
    install: 'Install',
    ok: 'OK',
    no: 'NO',
    install_metamask: 'Metamask is not installed',
    connect_failed: 'Failed to connect wallet',
    wrong_network: 'The network which connected with the wallet could not match the current network, please switch the network to ',
    login: 'Connection to wallet is required'
  },
  code: {
    showAll: 'Show All'
  },
  settings: {
    language: 'Language',
    darkMode: 'Dark Mode',
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto'
  },
  account: {
    title: 'Account',
    unlock: 'Connect Wallet',
    connect: 'Select A Wallet',
    connected_with: 'Connected with ',
    copy_address: 'Copy Address',
    copied: 'Copied',
    pending_txs: '{count} Pending|{count} Pendings',
    view_on_etherscan: 'View on Block Explorer',
    tip: 'Your transactions will appear here...',
    rencent_txs: 'Rencent Transactions',
    clear_all: 'clear all'
  },
  txs: {
    stake: 'Staking {amount}{symbol} to {to}',
    startunstake: 'Start Unstake {amount}{symbol} to {to}',
    startclaim: 'Start claim reward {amount}{symbol} to {to}',
    setrate: 'Set CommissionRate to {amount}%',
    unstake: 'Unstake {amount}{symbol} to {to}',
    deposit: 'Staking {amount}{symbol} to {to}',
    withdraw: 'withdraw {amount}{symbol} to {to}',
    grantRole: 'Grant {role} for {to}',
    revokeRole: 'Revoke {role} for {to}',
    setMintCap: 'Set Mint Cap to {to}',
    issue: 'Issue a new contract {name}',
  },
  stake: {
    node_list: 'Validator List',
    set_commission_rate: 'Set Commission Rate',
    stake_to_other_node: 'Voting to Validator',
    index: 'Index',
    node: 'Validator',
    voting_power: 'Voting Power',
    share_balance: 'Commission Share',
    operation: 'Operation',
    staking: 'Voting',
    claim: 'Start Unstake',
    get_reward: 'Get Reward',
    staking_info: 'Voting info',
    amount: 'Amount',
    address: 'Address',
    btn_submit: 'Submit',
    btn_cancel: 'Cancel',
    claim_info: 'Unstake info',
    commonnsion_share_balance:'Commission share balance: ',
    estimate_receive: 'Estimate receive ',
    reward_info: 'Reward info',
    reward_balance: 'Reward balance: ',
    commission_rate: 'Commission Rate',
    last_update_time: 'Last update time: ',
    active_nodelist: 'Active Validator',
    not_active_nodelist: 'My Voted Validator',
    max: 'Max',
    approve: 'Approve',
    wallet_balance: 'Balance',
    tips_voting_to_invalidate: 'Nodes that have more than {minIndexVotingPower} votes will be included in the inactive list',
    tips_claim_info: 'Note: {unstakeDelay} after the redemption operation is initiated, you can receive it on the redemption page',
    tips_commission_rate: 'The next time you can set is after {commissionRateInterval}',
    status: 'Status',
    isActive: 'Active',
    notActive: 'Inactive'
  },
  msg: {
    please_input_number: 'Please enter the number',
    please_input_1_100_num: 'Please enter an integer from 1-100',
    please_input_amount: 'Please enter amount',
    please_input_correct_num: 'Please enter the correct number',
    please_input_address: 'Please enter the address',
    please_input_not_zero: 'Please enter a number greater than 0',
    days: ' days',
    hour: ' hour',
    minute: 'minute',
    neterror:'Switch to REI Network',
    loading: 'Loading... Please wait',
    nodatatext: 'No data'
  },
  unstake:{
    title: 'Pending Unstaked',
    list_title: 'Pending Unstake list',
    node: 'Node',
    create_time: 'Create time',
    unstake_available: 'Available Time',
    shares: 'Unstaked Shares',
    get_value: 'Unstaked Value',
    status: 'Status',
    operation: 'Operation',
    gettitle: 'Unstake',
    retrieve: 'Retrieved',
    not_retrieve: 'Not retrieved'
  },
  stakeforgas:{
    title: 'Gas Stake',
    list_title: 'Resources',
    address_resource: 'Resources of {address}',
    daily_free_fee: 'Daily Free Fee',
    left_crude: 'Left CRUDE',
    usage_crude: 'CRUDE used',
    stake_coin: 'Total Staked',
    left_free_fee: 'Left Free Fee',
    vesting_status: 'Vesting status',
    withdraw: 'Withdraw',
    stake_more: 'Stake more',
    stake_info: 'Stake Info',
    withdraw_info: 'Withdraw Info',
    estimate_withdraw: 'Estimated coin withdrawal'
  },
  dashborad:{
    trends:'Trends',
    total_stake:'Total Stake',
    voting_stake:'Total Voting Staked',
    gas_stake:'Total Gas Stake',
    amount_user:'Amount Of Gas Saved For Users',
    price:'Price',
    price_market:'Price And Market Stats',
    more:'More',
    current_price:'Current Price',
    market_cap:'Market Cap',
    total_volume:'Total Volume',
    total_supply:'Total Supply',
    high:'24h High',
    low:'24h Low',
    price_change:'Price Change 24h(%)',
    circulating_supply:'Circulating Supply',
    token_dis:'Token Distribution',
    faq_title1:'What is REI DAO?',
    faq_content1:'Introduction to REI DAO,about Vision and more...',
    faq_title2:'What is REI NETWORK?',
    faq_content2:'REI Network is not a new project, but an upgraded version of GXChain.',
    faq_title3:'What is the trends chart showing ?',
    faq_content3:'The graph of total stake shows nodal voting stats for the following time periods: hourly, daily, weekly, monthly.',
    faq_title4:'Detailed explanation of token distribution.',
    faq_content4:'Get more information about token distribution, etc.',
    circulate:'Circulated',
    rei_system:'REIecosystem',
    marketing:'Maketing',
    node_rewards:'Node Rewards'

  },
  my_account:{
    balance:'balance',
    balance_tip:'Freely Usable REI,Excluding Stakes In Vote,Gas Stake',
    voting:'Voting',
    validator:'Validator Voting Stake',
    validator_tip:'If You Cancel The Vote,You Need To Wait 7 Days To Withdraw REI',
    pend:'Pending Unstake',
    pend_tip:'Stake REIs And Earn More',
    total_stake:'Total Stake',
    stake_tip:'Stake REI,Earn Crude As Gas',
    left_crude:'Left Crude',
    crude_tip:'Daily Available Crude Oil Does Not Accumulate And Resets To 0 Every Day',
  },
  voting:{
    stake_radios:'Total Voting Staked',
    faq_title1:'How to become a node validator?',
    faq_content1:'A validator is a participant in the network who runs validator nodes to run and secure the network.',
    faq_title2:'How to vote for a node validator?',
    faq_content2:'Once you login you will find this on the Validator of the Staking Dashboard. Here you will see an Unstake button for each of the validators.',
    faq_title3:'Introduction to the total voting stake chart？',
    faq_content3:'He graph of total voting stake shows nodal voting data for the following time periods: hourly, daily, weekly, monthly.',
  },
  gas_stake:{
    account:'Resources Of',
    deposit:'Deposit REI Gets Crude',
    left_crude:'Left Crude',
    crude_uesd:'Crude Used',
    total_stake:'Total Staked',
    gas_stake:'Gas stake',
    withdraw:'Withdraw',
    stake_more:'Stake more',
    address:'Address',
    amount:'Amount'
  }
};
