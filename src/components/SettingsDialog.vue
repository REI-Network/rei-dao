<template>
  <v-dialog width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn small class="mx-1" icon v-bind="attrs" v-on="on"><v-icon>mdi-cog-outline</v-icon></v-btn>
    </template>
    <v-card>
      <v-sheet class="pa-4">
        <div class="mb-1">{{ $t('settings.language') }}</div>
        <v-row>
          <v-col cols="6" v-for="item in languages" :key="item.key">
            <v-btn block :color="language == item.key ? 'blue-grey' : undefined" @click="switchLanguage({ language: item.key })">
              {{ item.text }}
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
      <v-divider />
      <v-sheet class="pa-4">
        <div class="mb-1">{{ $t('settings.darkMode') }}</div>
        <v-row>
          <v-col cols="4" v-for="mode in modes" :key="mode.key">
            <v-btn block small :class="{ 'blue-grey': darkMode == mode.key }" @click="switchDarkMode({ darkMode: mode.key })">
              {{ $t(mode.text) }}
              <v-icon small>{{ mode.icon }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    ...mapGetters({
      language: 'language',
      languages: 'languages',
      darkMode: 'darkMode',
      modes: 'modes'
    })
  },
  methods: {
    ...mapActions({
      switchDarkMode: 'switchDarkMode',
      switchLanguage: 'switchLanguage'
    })
  }
};
</script>
