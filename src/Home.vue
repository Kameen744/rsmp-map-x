<template>
  <template v-if="ready">
    <TopNavBar></TopNavBar>
    <FiltersContainer v-if="view != 'ptins'"></FiltersContainer>
    <div
      class="bg-slate-100 max-h-[82vh] overflow-hidden overflow-y-auto c-scroll"
      :class="view == 'map' ? '' : 'pt-2'"
      v-on:scroll="store.scrollDataContainer"
    >
      <!-- <StatusContainer
        :key="chartCleanedData"
        v-if="view == 'chart'"
      ></StatusContainer> -->
      <MapContainer v-show="view == 'map'"></MapContainer>

      <!-- <PartnerInsContainer v-if="view == 'ptins'"></PartnerInsContainer> -->
      <SummaryTable v-if="view == 'ptins'"></SummaryTable>

      <DashboardView
        v-if="view == 'dashboard' && chartDataLoaded"
        :key="chartDataLoaded"
      ></DashboardView>
      <!-- <DashboardViewSec v-if="view == 'dashboard'"></DashboardViewSec> -->
      <!-- <TestMap v-show="view == 'map'"></TestMap> -->
      <!-- <MapContainerLga
        v-show="view == 'map' && mapType == 'lgas'"
      ></MapContainerLga> -->
      <!-- <PartnerContainer v-if="view == 'chart'"></PartnerContainer> -->
      <!-- <CsoContainer v-if="view == 'cso'"></CsoContainer> -->
    </div>
  </template>
</template>

<script setup>
import { useMainStore } from "./storage/store";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import TopNavBar from "./components/TopNavBar.vue";
import FiltersContainer from "./components/FiltersContainer.vue";
import StatusContainer from "./components/StatusContainer.vue";
import MapContainer from "./components/MapContainer.vue";
// import PartnerContainer from "./components/PartnerContainer.vue";
// import CsoContainer from "./components/CsoContainer.vue";
import PartnerInsContainer from "./components/PartnerInsContainer.vue";
import DashboardView from "./components/DashboardView.vue";
import DashboardViewSec from "./components/DashboardViewSec.vue";
import SummaryTable from "./components/SummaryTable.vue";
// import MapContainerLga from "./components/MapContainerLga.vue";
// import TestMap from "./components/TestMap.vue";

import "vue-loading-overlay/dist/css/index.css";

const store = useMainStore();
const ready = ref(false);

const {
  selectedState,
  selectedPrograms,
  selectedLga,
  statusContRef,
  selectedPartners,
  selectedSupports,
  selectedThematicAreas,
  chartCleanedData,
  view,
  selectedStatus,
  mapType,
  isLaoding,
  chartDataLoaded,
} = storeToRefs(store);

onMounted(() => {
  // selectedState.value[view.value] = "Niger";
  // selectedLga.value[view.value] = "";
  selectedState.value[view.value] = [];
  selectedLga.value[view.value] = [];
  selectedPrograms.value[view.value] = [];
  selectedPartners.value[view.value] = [];
  selectedSupports.value[view.value] = [];
  selectedStatus.value[view.value] = [];
  selectedThematicAreas.value[view.value] = [];
  // selectedStatus.value[view.value] = ["Ongoing"];
  // "AFENET", "McKinsey", "UNICEF", "WHO"
  ready.value = true;
});
</script>
