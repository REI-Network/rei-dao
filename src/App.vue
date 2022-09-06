<template>
  <v-app dark id="app">
    <nav-header />
    <side-menu />
    <v-main :class="dark ? 'night' : 'daytime'">
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
.daytime{
  background-color: #f3f4fa;
}
.night{
  background-color: #100D22;
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
.theme--dark.v-pagination .v-pagination__item--active{
  background-color: #6979F8;
}
.theme--light.v-pagination .v-pagination__item--active{
  background-color: #6979F8;
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
.theme--dark.v-card{
  background: #1D1a36;
  border-radius: 4px;
}
.theme--dark.v-sheet{
  background: #1D1a36;
  border-color: #504985;
}
.theme--dark.v-navigation-drawer{
  background: #1D1a36;
}
.theme--dark.v-data-table{
  background: #1D1a36;
}
.theme--dark.v-tabs > .v-tabs-bar{
  background: #1D1a36;
}
.theme--dark.v-list{
  background-color: transparent;
}
.theme--dark.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset{
  border-color: #504985;
}
.theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset{
  border-color: #D3D6DB;
}
.theme--dark.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th{
  border: none;
  background-color:#252243;
}
/* .theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th{
  border: none;
} */
.theme--dark.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row), .theme--dark.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:not(.v-data-table__mobile-row){
  border-color: #504985;
}
.v-text-field--outlined.v-input--dense .v-label{
    font-size: 13px !important;
    }
.theme--light.v-sheet.v-card:not(.v-sheet--outlined){
  box-shadow:rgb(0 0 0 / 10%) 0px 0px 20px;
}
.v-pagination.v-pagination{
  display: flex;
  justify-content: flex-end;
}
.v-tabs:not(.v-tabs--vertical):not(.v-tabs--right) > .v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes) .v-slide-group__prev{
  display:none;
}
.theme--dark.v-icon{
  color:#5c5a7a;
}
.theme--light.v-icon{
  color:#868E9E;
}
.v-application--is-ltr .v-list-item__action:first-child, .v-application--is-ltr .v-list-item__icon:first-child{
  margin-right:12px;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table > .v-data-table__wrapper > table > thead > tr > td, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td{
  height: 64px;
}
.v-data-table > .v-data-table__wrapper .v-data-table__mobile-table-row{
  padding-top: 20px;
}
.theme--light.v-data-table>.v-data-table__wrapper>table>thead>tr:last-child>th{
  background-color:#E2E4EA;
  border: none;
}
.v-list.v-select-list.v-sheet.theme--dark.theme--dark{
  background-color: #595777 !important;
}
.theme--dark.v-tabs-items{
    background-color: transparent !important;
}
 .v-expansion-panel-content__wrap{
        padding: 12px !important;
    }
    .v-btn--is-elevated{
      box-shadow: none;
    }
    .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot{
      text-shadow: none !important;
    }
     .theme--dark.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper){
      background-color: #2B274A !important;
      opacity: 0.7;
    }
    .v-slider--horizontal .v-slider__track-container{
    height: 8px !important;
    border-radius: 10px;
}

.calculate-input .theme--light.v-input input, .theme--light.v-input textarea{
  color:#6979F8 !important;
}
.tab-dark .v-slide-group__content{
  background-color: #100D22 !important;
}
@media screen and (max-width: 900px) {
    .v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:last-child, .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:last-child{
      padding-bottom: 20px;
    }
    .theme--light.v-data-table>.v-data-table__wrapper>table>thead>tr:last-child>th{
      background-color: #FFF !important;
    }
    .v-data-table__mobile-row__header{
      font-weight:normal;
      color: #767272 !important;
    }
    .v-application--is-ltr .v-data-table__mobile-row__cell{
      font-weight: 600;
    }
   .v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper){
      background-color: transparent !important;
    }
}
</style>
