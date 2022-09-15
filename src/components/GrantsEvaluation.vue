<template>
  <v-container style="padding-top: 0">
    <v-card class="Evaluation-card">
      <h3>Evaluation Details</h3>
      <div class="font-grey evaluation">1.DeFi Kingdoms is a game, a DEX, a liquidity pool opportunity, a market of rare utility driven NFTs, and it all plays out seamlessly in the incredibly badass form of fantasy pixel art. We’re excited to release the DeFi Kingdoms universe to the world. Come join our lovely community!</div>
      <div class="font-grey evaluation">2.DeFi Kingdoms is a game, a DEX, a liquidity pool opportunity, a market of rare utility driven NFTs, and it all plays out seamlessly in the incredibly badass form of fantasy pixel art. We’re excited to release the DeFi Kingdoms universe to the world. Come join our lovely community!</div>
      <div class="font-grey evaluation">3.DeFi Kingdoms is a game, a DEX, a liquidity pool opportunity, a market of rare utility driven NFTs, and it all plays out seamlessly in the incredibly badass form of fantasy pixel art. We’re excited to release the DeFi Kingdoms universe to the world. Come join our lovely community!</div>
    </v-card>
    <v-row class="distribution">
      <v-col cols="12" md="4">
        <h2>Distribution principles of Grants</h2>
        <div class="font-grey">During the Grants distribution, if any issue is encountered, REI Network Foundation reserves the right of final interpretation of the Grants distribution.</div>
      </v-col>
      <v-col cols="12" md="8">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h4>1.How is the fund allocation cycle calculated?</h4>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="font-grey">
                  Distribution in installments, a total of 6 periods (30 days/period), the distribution will be finished within 6 periods. During the distribution period, the project team needs to be stable without significant changes, and the product needs to operate stably, otherwise, REI Network will consider reducing or canceling Grants.
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-expansion-panels class="step-card">
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h4>2. What is the product priority principle？</h4>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="font-grey">
                  The principle of product priority. For products deployed on the REI Network chain for the first time, 50% of the Grants can be obtained when the product is launched, and all Grants can be obtained after 90 days of steady operation.
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-expansion-panels class="step-card">
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h4>3. What is the final right of interpretation？</h4>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="font-grey">
                  During the Grants distribution, if any issue is encountered, REI Network Foundation reserves the right of final interpretation of the Grants distribution.
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { mapActions, mapGetters } from 'vuex';
import filters from '../filters';

export default {
  components: {},
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
  methods: {}
};
</script>

<style scoped lang="scss">
.container{
    width: 100%;
}
.Evaluation-card {
  padding: 20px;
}
.font-grey {
  color: #868e9e;
  font-size: 14px;
  line-height: 28px;
}
.evaluation{
   margin-top: 20px; 
}
.distribution {
  margin-top: 40px;
}
.step-card {
  margin-top: 20px;
}
.theme--dark.v-expansion-panels .v-expansion-panel{
    background-color: #1D1a36;
}
.theme--light.v-expansion-panels .v-expansion-panel{
    box-shadow: 0 0 20px #ddd !important;
}
@media screen and (max-width: 900px) {
}
</style>
