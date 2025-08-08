<template>
  <template v-if="ready">
    <!-- <div class="vl-parent">
      
:on-cancel="onCancel"
      <label><input type="checkbox" v-model="fullPage" />Full page?</label>
      <button @click.prevent="doAjax">fetch Data</button>
    </div> -->
    <loading
      v-model:active="isLaoding"
      :can-cancel="false"
      :is-full-page="true"
      loader="dots"
      :z-index="99999999999"
      color="#1F3559"
    />
    <TopNavBar></TopNavBar>
    <FiltersContainer></FiltersContainer>
    <div
      class="bg-slate-100 max-h-[80vh] overflow-hidden overflow-y-auto c-scroll"
      :class="view == 'map' ? '' : 'pt-2'"
      v-on:scroll="store.scrollDataContainer"
    >
      <StatusContainer
        :key="chartCleanedData"
        v-if="view == 'chart'"
      ></StatusContainer>
      <MapContainer v-show="view == 'map'"></MapContainer>
      <!-- <TestMap v-show="view == 'map'"></TestMap> -->
      <!-- <MapContainerLga
        v-show="view == 'map' && mapType == 'lgas'"
      ></MapContainerLga> -->
      <PartnerContainer v-if="view == 'chart'"></PartnerContainer>
      <CsoContainer v-if="view == 'cso'"></CsoContainer>
      <PartnerInsContainer v-if="view == 'ptins'"></PartnerInsContainer>
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
import PartnerContainer from "./components/PartnerContainer.vue";
import CsoContainer from "./components/CsoContainer.vue";
import PartnerInsContainer from "./components/PartnerInsContainer.vue";
import MapContainerLga from "./components/MapContainerLga.vue";
// import TestMap from "./components/TestMap.vue";
import Loading from "vue-loading-overlay";
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
  chartCleanedData,
  view,
  selectedStatus,
  mapType,
  isLaoding,
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
  // selectedStatus.value[view.value] = ["Ongoing"];
  // "AFENET", "McKinsey", "UNICEF", "WHO"
  ready.value = true;
});
</script>
