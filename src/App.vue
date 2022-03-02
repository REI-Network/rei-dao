<template>
  <v-app dark id="app">
    <nav-header />
    <side-menu />
    <v-main class="grey" :class="dark ? 'stake_background' : 'lighten-3'">
      <router-view />
    </v-main>
    <bottom-nav />
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import NavHeader from './components/NavHeader';
import SideMenu from './components/SideMenu';
import BottomNav from './components/BottomNav';

export default {
  name: 'App',
  components: {
    NavHeader,
    SideMenu,
    BottomNav
  },
  computed: {
    ...mapGetters({
      dark: 'dark',
      darkMode: 'darkMode'
    })
  },
  mounted() {
    let media = window.matchMedia('(prefers-color-scheme: dark)');
    if (media) {
      media.onchange = (event) => {
        console.log(event.matches);
        if (this.darkMode == 2 && this.dark != event.matches) {
          this.switchDarkMode({ darkMode: 0 });
          this.switchDarkMode({ darkMode: 2 });
        }
      };
    }
    this.switchDarkMode({ darkMode: Number(localStorage.getItem('darkMode') || '2') });
  },
  methods: {
    ...mapActions({
      switchDarkMode: 'switchDarkMode'
    })
  }
};
</script>
<style>
@font-face {
  font-family: Bebas-Regular;
  src: url(./assets/fonts/Bebas-Regular.ttf);
  font-weight: 400;
  font-style: normal;
}

.bebas {
  font-family: Bebas-Regular;
}
#app {
    background-color: var(--v-background-base) !important;
}
.theme--dark.v-pagination .v-pagination__navigation{
  background-color: #393560;
}
.theme--dark.v-pagination .v-pagination__item{
  background-color: #393560;
}
a{
  text-decoration:none;
  color:transparent;
}
.theme--light.sub-title{
  color: #000;
}
.theme--dark.sub-title{
  color: #FFF;
}
</style>
