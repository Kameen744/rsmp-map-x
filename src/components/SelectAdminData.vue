<template>
  <template class="min-[3rem]: flex justify-start">
    <div
      class="dropdown dropdown-bottom"
      @click="toggleDroped"
      @mouseleave="dropped = false"
    >
      <!-- <SelectBadge title="Admin" v-if="selectedState[view]"></SelectBadge> -->
      <div
        tabindex="0"
        role="button"
        class="inline-flex justify-between shadow-sm p-3 py-1 m-1 pl-3 text-lg rounded border-2 border-rsmp-sec min-w-36"
      >
        <div class="inline-flex max-w-28 overflow-hidden">
          {{ showNationalData ? "National Data" : "Admin Level" }}
        </div>
        <b
          class="ml-4 w-8 h-8 rounded-full bg-blue-200 text-center text-xs text-blue-900"
        >
          <svg
            v-if="dropped"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mt-1 ml-1 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mt-1 ml-1 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </b>
      </div>
      <ul
        tabindex="0"
        class="dropdown-content z-[99999] menu p-2 shadow-lg bg-base-100 rounded-none max-h-[70vh] grid overflow-x-auto border-2 border-rsmp-sec"
        v-if="dropped"
      >
        <li
          class="rounded-none border-b-2 border-blue-50"
          v-for="level in adminDataOptions"
        >
          <a
            href=""
            @click.prevent="SelectLevel(level)"
            class="hover:rounded-none text-lg"
            :class="selectedData == level ? 'bg-slate-300' : ''"
          >
            {{ level }}
          </a>
        </li>
      </ul>
    </div>
  </template>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useMainStore } from "./../storage/store";
import { storeToRefs } from "pinia";
import SelectBadge from "./SelectBadge.vue";

const store = useMainStore();
const dropped = ref(false);
const { selectedState, selectedData, showNationalData, mapType, view, states } =
  storeToRefs(store);

const toggleDroped = () => {
  dropped.value = !dropped.value;
};

const adminDataOptions = ["National", "State", "LGA"];

const SelectLevel = (level) => {
  // state
  //   ? (selectedState[view.value].value = state.state)
  //   : (selectedState.value[view.value] = state);
  selectedData.value = level;
  if (level == "National") {
    showNationalData.value = true;
  } else if (level == "State") {
    showNationalData.value = false;
    mapType.value = "states";
    store.launchAapp();
    // store.updateApp();
  } else if (level == "LGA") {
    showNationalData.value = false;
  }

  // store.updateApp();
};
</script>
