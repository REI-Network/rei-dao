<template>
  <v-container style="padding: 0">
    <v-card class="flex-column mt-2 overview">
      <v-row justify="space-between" align="center">
        <h3>Projects have been supported</h3>
        <v-col style="text-align: right">
          <v-icon size="16" class="wallet-icon">mdi-arrow-up-thin-circle-outline</v-icon>
          <span class="font-grey"><a target="_blank" href="https://form.typeform.com/to/q7cU4ewA?typeform-source=rei.network" class="font-grey">Apply for grants</a></span>
        </v-col>
      </v-row>
      <v-data-iterator :items="list" :page.sync="page" @page-count="pageCount = $event" :items-per-page.sync="itemsPerPage" hide-default-footer :loading="loading" :loading-text="$t('msg.loading')">
        <template v-slot:item="{ item }">
          <v-card :class="dark ? 'chip-dark projects' : 'chip-light projects elevation-0'" @click="openGrants(item)">
            <v-row justify="space-between">
              <v-col cols="12" md="11" class="left-content">
                <div class="image">
                  <v-img :src="`https://ipfs.io/ipfs/${item.project_logo}`" width="120" />
                </div>
                <div class="supported">
                  <div><span class="name">{{item.project_name}}</span><span class="game-active">{{item.categories}}</span></div>
                  <div class="font-grey detail">{{item.project_desc}}</div>
                  <v-row justify="space-between">
                    <v-col cols="12" md="3">
                      <h2>{{item.project_token.symbol }}</h2>
                      <div class="font-grey">Token</div>
                    </v-col>
                    <v-col cols="12" md="5">
                      <h2>{{item.published_on}}</h2>
                      <div class="font-grey">Went live on</div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <h2>{{ item.sponsored_amount }}&nbsp;<span class="font-grey">REI</span></h2>
                      <div class="font-grey">Sponsored</div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="12" md="1" class="right-icon" align-self="center">
                <v-icon size="22"> mdi-arrow-right-circle-outline </v-icon>
              </v-col>
            </v-row>
          </v-card>
        </template>
      </v-data-iterator>
      <div class="pagination" v-if="list.length>6">
        <v-pagination v-model="page" :length="pageCount" total-visible="7" color="vote_button"></v-pagination>
      </div>
    </v-card>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import filters from '../filters';

const projectsList = require('../../src/grantsInfo/projectList.json')

export default {
  filters,
  data() {
    return {
      page: 1,
      pageCount: 1,
      itemsPerPage: 6,
      pageSize: 6,
      loading: false,
      list: [
        {
          img: require('../assets/images/Genesis.png')
        },
        {
          img: require('../assets/images/Genesis.png')
        }
      ]
    };
  },
  watch: {},
  computed: {
    ...mapGetters({
      connection: 'connection',
      dark: 'dark',
      assetInfo: 'assetInfo'
    })
  },
  mounted() {
    this.getProjects();
  },
  methods: {
    openGrants(value) {
      this.$router.push({
        name: 'GrantsDetails',
        query:{
          id:value.id,
        }
      });
    },
    async getProjects(){
      this.list = projectsList.list;
    },
  }
};
</script>

<style scoped lang="scss">
.overview {
  padding: 20px;
  h3{
      margin-left:12px;
  }
}
.chip-dark {
  background-color: #13112b;
}
.chip-light {
  background-color: #f5f5f7;
}
.font-grey {
  color: #868e9e;
  font-size: 14px;
  font-weight: normal;
}
.projects {
  padding: 20px;
  margin-top: 20px;
  border-radius: 5px;
  .left-content {
    display: flex;
    justify-content: flex-start;
    .image {
      padding: 0;
      border-radius: 5px;
    }
    .supported {
      margin-left: 20px;
      .name {
        font-weight: 500;
      }
      .detail {
        margin-top: 8px;
        margin-bottom: 12px;
      }
      .game-active {
        padding: 2px 12px;
        background: #54bbfc;
        border-radius: 20px;
        color: #fff;
        margin-left: 12px;
      }
    }
  }
  .right-icon {
    text-align: right;
    vertical-align: middle;
  }
}
</style>
