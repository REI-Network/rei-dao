<template>
    <span>
        <span v-if="addressName">{{ addressName }}({{ val | addr }})</span>
        <span v-if="contractName">{{ contractName }}({{ val | addr }})</span>
        <span v-if="!addressName && !contractName">{{val | addr}}</span>
    </span>
  
</template>

<script>
import filters from '../filters';
import { mapGetters } from 'vuex';
import web3 from 'web3';
export default {
    filters,
    props: {
        val: {
          type: String,
          required: true
        },
        brackets: {
          type: Boolean,
          required: false
        },
        contractName: {
          type: String,
          required: false
        }
    },
    data(){
        return {
            addrCopying: false
        }
    },
    computed: {
      ...mapGetters({
        connection: 'connection',
        dark: 'dark',
        addressTags: 'addressTags'
      }),
      addressName(){
        let _address = web3.utils.toChecksumAddress(this.val);
        let addressTags = this.addressTags[_address];  
        return addressTags ? addressTags.addressName : '';
      }
    },
    methods: {
    }
}
</script>

<style>

</style>
