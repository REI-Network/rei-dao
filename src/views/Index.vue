<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="6" sm="12">
        <v-card class="ma-2">
          <v-list>
            <v-subheader>{{ $t('index.menu') }}</v-subheader>
            <v-list-item v-for="link in links" link :to="link.link" :key="link.link">
              <v-list-item-icon>
                <v-icon>{{ link.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ $t(link.text) }}</v-list-item-title>
                <v-list-item-subtitle>{{ $t(link.desc) }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      links: [
        {
          icon: 'mdi-console',
          text: 'issue.title',
          desc: 'issue.desc',
          link: '/stake'
        },
        {
          icon: 'mdi-sack',
          text: 'mint.title',
          desc: 'mint.desc',
          link: '/unstake'
        }
      ]
    };
  }
};
</script>
