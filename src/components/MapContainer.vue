<template>
  <div v-show="view == 'map'" class="relative">
    <div
      ref="mapContainerRef"
      class="min-h-[80vh] max-h-[80vh] overflow-hidden"
    >
    </div>
    <div class="w-20 h-5 bg-white absolute bottom-0 right-0 z-[9999]"> </div>
    <div
      class="absolute top-[5px] align-middle self-center left-[10%] z-[991] bg-transparent"
    >
      <div class="flex">
        <!-- <button
          v-if="currentSupports[view]"
          class="font-bold text-[15px] p-2 shadow bg-white rounded cursor-pointer max-w-[45px]"
          @click="showSupportTypes = !showSupportTypes"
        >
          <h6 class="p-0 m-0">KEY</h6>
        </button> -->
        <!-- <button
          v-if="currentSupports[view]"
          class="font-bold text-[15px] ml-2 p-2 shadow bg-white rounded cursor-pointer max-w-[150px]"
          @click="showNationalData = !showNationalData"
        >
          <h6 class="p-0 m-0">National Data</h6>
        </button> -->
        <button
          v-if="mapType == 'lgas'"
          class="font-bold text-[15px] ml-2 p-2 shadow bg-white rounded cursor-pointer max-w-[70px]"
          @click="store.backToStatesData"
        >
          <div class="flex p-0 m-0">
            <svg
              class="w-6 h-6 text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m15 19-7-7 7-7"
              />
            </svg>
            <div> Back</div>
          </div>
        </button>
      </div>

      <!-- v-if="showSupportTypes" -->
      <!-- <div
        class="bg-white font-bold text-[15px] shadow max-w-[75vw] overflow-auto mt-2"
      >
        <h3 class="p-2">STATUS</h3>
        <div class="flex justify-start p-2">
          <div class="mr-3">
            <div
              class="mx-auto shadow-sm w-8 h-8 rounded-full bg-yellow-400"
            ></div>
            <b>Ongoing</b>
          </div>
          <div class="mr-3">
            <div class="mx-auto shadow-sm w-8 h-8 bg-green-400"></div>
            <b>Completed</b>
          </div>
          <div class="mr-3">
            <div
              class="mx-auto w-0 h-0 border-l-[20px] border-l-transparent border-b-[32px] border-red-400 border-r-[20px] border-r-transparent"
            >
            </div>
            <b>Pending</b>
          </div>
        </div>
      </div> -->
      <!-- show National data -->
      <div
        v-if="showNationalData"
        class="bg-white font-bold rounded-md text-[15px] shadow max-w-[75vw] overflow-auto mt-2"
      >
        <NationalDataShow></NationalDataShow>
      </div>
    </div>

    <!-- status -->
    <div class="absolute top-[11vh] left-[10px] z-[991] bg-transparent">
      <!-- <div class="flex">
        <button
          v-if="currentSupports[view]"
          class="font-bold text-[15px] p-2 shadow bg-white rounded cursor-pointer max-w-[45px]"
          @click="showSupportTypes = !showSupportTypes"
        >
          <h6 class="p-0 m-0">KEY</h6>
        </button>
      </div> -->

      <!-- v-if="showSupportTypes" -->
      <div
        class="bg-white font-bold text-[15px] rounded-md shadow max-w-[75vw] overflow-auto mt-2"
      >
        <!-- <h3 class="p-2">TYPE OF SUPPORT</h3> -->
        <!-- <div class="flex justify-start pr-4 mr-4">
          <div
            class="p-3 py-2 text-cyan-50 m-2"
            v-for="(val, key) in currentSupports[view]"
            :style="`background: ${val.bg};`"
          >
            {{ key }}
          </div>
        </div>
        <hr /> -->
        <h3 class="text-center mt-2 mb-1">STATUS</h3>
        <hr />
        <div class="p-2">
          <div class="">
            <div
              class="mx-auto shadow-sm w-8 h-8 rounded-full bg-yellow-400"
            ></div>
            <h4 class="text-center text-sm font-mono">Ongoing</h4>
          </div>
          <div class="divider"></div>
          <div class="">
            <div class="mx-auto shadow-sm w-8 h-8 bg-green-400"></div>
            <h4 class="text-center text-sm font-mono">Completed</h4>
          </div>
          <div class="divider"></div>
          <div class="">
            <div
              class="mx-auto w-0 h-0 border-l-[20px] border-l-transparent border-b-[32px] border-red-400 border-r-[20px] border-r-transparent"
            >
            </div>
            <h4 class="text-center text-sm font-mono">Pending</h4>
          </div>
        </div>
      </div>
    </div>
    <MarkerPopup v-if="selectedLgaMarker || selectedMarker"></MarkerPopup>
  </div>
</template>

<script setup>
import { useMainStore } from "./../storage/store";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import MarkerPopup from "./MarkerPopup.vue";
import NationalDataShow from "./NationalDataShow.vue";

const store = useMainStore();
const showSupportTypes = ref(false);
// const showNationalData = ref(false);
const {
  mapContainerRef,
  selectedLgaMarker,
  currentSupports,
  mapData,
  selectedMarker,
  showNationalData,
  // mapContainerRefMain,
  view,
  mapType,
} = storeToRefs(store);

onMounted(async () => {
  // mapContainerRefMain.value = mapContainerRef.value;
  await store.launchAapp();
});

const markerSelected = () => {
  if (selectedLgaMarker.value || selectedMarker.value) {
    return true;
  } else {
    return false;
  }
};
</script>

<style>
div.leaflet-marker-icon {
  border: 0px;
  background: transparent;
}
#layer-name-label {
  margin-left: 2px;
  margin-right: 2px;
  padding: 1px;
  padding-top: 0px;
  color: rgb(251, 251, 251);
  background: balck;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  z-index: 9;
  /* background-color: rgb(12, 47, 47); */
}
.info {
  position: absolute;
  z-index: 991;
  font: 14px/16px Arial, Helvetica, sans-serif;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  margin: 0 0 5px;
  max-width: 200px;
}

.r-info {
  top: 10px;
  left: 100px;
}
.facilities-marker div {
  width: 8px;
  height: 8px;
}
</style>
