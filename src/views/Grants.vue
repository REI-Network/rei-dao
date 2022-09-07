<template>
  <v-container :class="dark ? 'night stake' : 'daytime stake'">
    <div class="header-title">
      <h1>Grants</h1>
      <a class="title-detailed">What are Grants?</a>
    </div>
    <v-row>
      <v-col>
        <GrantsOverview></GrantsOverview>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <GrantsProjects></GrantsProjects>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { mapActions, mapGetters } from 'vuex';
import filters from '../filters';
import GrantsOverview from '../components/GrantsOverview';
import GrantsProjects from '../components/GrantsProjects';

export default {
  components: {
    GrantsOverview,
    GrantsProjects
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
  }
};
</script>

<style scoped lang="scss">
.daytime {
  //   background-color: #f3f4fa;
  background: linear-gradient(180deg, #d6e3ff 0%, rgba(255, 255, 255, 0) 50%);
}
.night {
  background-color: #100d22;
}
.header-title {
  margin: 1.5rem 0;
  .title-detailed {
    font-size: 14px;
    color: #868e9e;
  }
  .title-detailed:hover {
    color: #6979f8;
    text-decoration: underline;
  }
}
.stake {
  padding-left: 40px;
  padding-right: 40px;
}
@media screen and (max-width: 900px) {
  .stake {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
