<template>
    <span>
        {{val | addr}}
        <v-btn color="secondary" :text="!dark" depressed small @click="copyAddr(val)">
            <v-icon small>{{ addrCopying ? 'mdi-checkbox-marked-circle-outline' : 'mdi-content-copy' }}</v-icon>
            
        </v-btn>
    </span>
  
</template>

<script>
import filters from '../filters';
import { mapGetters } from 'vuex';
export default {
    filters,
    props: {
        val: {
            type: String,
            required: true
        },
    },
    data(){
        return {
            addrCopying: false,
        }
    },
    computed: {
    ...mapGetters({
        connection: 'connection',
        dark: 'dark'
        })
    },
    methods: {
        sleep(timestamp) {
      return new Promise((resolve) => {
        setTimeout(resolve, timestamp);
      });
    },
    copyToClipboard(str) {
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
    },
    async copyAddr(addr) {
      try {
        window.navigator.clipboard.writeText(addr);
        this.copyToClipboard(addr);
      } catch (ex) {
        console.log(ex);
      } finally {
        this.addrCopying = true;
        await this.sleep(500);
        this.addrCopying = false;
      }
    },
    }
}
</script>

<style>

</style>
