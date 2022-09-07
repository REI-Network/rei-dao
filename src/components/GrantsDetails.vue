<template>
  <v-container :class="dark ? 'night stake' : 'daytime stake'">
    <div class="header-title">
      <h1>Grants</h1>
       <span class="font-grey" @click="routeLink()">Grants</span> / <span class="info-name">Pokemon battle</span>
    </div>
    <v-row>
        <v-col>
            <GrantsDetailsPay></GrantsDetailsPay>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <GrantsEvaluation></GrantsEvaluation>
        </v-col>
    </v-row>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { mapActions, mapGetters } from 'vuex';
import filters from '../filters';
import GrantsDetailsPay from '../components/GrantsDetailsPay';
import GrantsEvaluation from '../components/GrantsEvaluation';

export default {
  components: {
      GrantsDetailsPay,
      GrantsEvaluation
  },
  filters,
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      dark: 'dark',
      connection: 'connection'
    })
  },
  methods:{
      routeLink() {
      this.$router.back();
    }
  }
  
};
</script>

<style scoped lang="scss">
.daytime {
  background: linear-gradient(180deg, #d6e3ff 0%, rgba(255, 255, 255, 0) 50%);
}
.night {
  background-color: #100d22;
}
 .font-grey {
    font-size: 14px;
    color: #868e9e;
  }
.header-title {
  margin: 1.5rem 0;
}
.stake {
  padding-left: 40px;
  padding-right: 40px;
}
.info-name{
    font-weight: 500;
}
@media screen and (max-width: 900px) {
  .stake {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
