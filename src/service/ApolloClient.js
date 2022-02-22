import { ApolloClient, InMemoryCache } from '@apollo/client/core'

export const client = new ApolloClient({
    uri: 'https://api-dao-devnet.rei.network/chainmonitor',
    cache: new InMemoryCache(),
})
