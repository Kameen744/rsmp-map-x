<template>
  <template
    class="min-[3rem]: flex justify-start"
    v-show="selectedData == 'LGA'"
  >
    <div
      class="dropdown dropdown-bottom"
      @click="toggleDroped"
      @mouseleave="dropped = false"
    >
      <SelectBadge title="State" v-if="selectedState[view]"></SelectBadge>
      <div
        tabindex="0"
        role="button"
        class="inline-flex justify-between shadow-sm p-3 py-1 m-1 pl-3 text-lg rounded border-2 border-rsmp-sec min-w-36"
      >
        <div class="inline-flex max-w-28 overflow-hidden">
          {{ selectedState[view][0] ? selectedState[view][0] : "State" }}
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
        <!-- <li class="rounded-none border-b-2 border-blue-50">
          <a href="" @click.prevent="SelectState(null)" class="hover:rounded-none text-lg">
            State
          </a>
        </li> -->
        <li
          class="rounded-none border-b-2 border-blue-50"
          v-for="state in sortedStates"
        >
          <a
            href=""
            @click.prevent="SelectState(state)"
            class="hover:rounded-none text-lg"
            :class="selectedState[view][0] == state.state ? 'bg-slate-300' : ''"
          >
            {{ state.state }}
          </a>
        </li>
      </ul>
    </div>
  </template>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useMainStore } from "./../storage/store";
import { storeToRefs } from "pinia";
import SelectBadge from "./SelectBadge.vue";
import CheckPlusIcon from "./CheckPlusIcon.vue";
import CheckIcon from "./CheckIcon.vue";
import CloseIcon from "./CloseIcon.vue";

const store = useMainStore();

const { selectedState, selectedLga, selectedData, view, states, mapType } =
  storeToRefs(store);

const dropped = ref(false);

const toggleDroped = () => {
  dropped.value = !dropped.value;
};

const sortedStates = computed(() => {
  if (!Array.isArray(states.value)) {
    return [];
  }
  return [...states.value].sort((a, b) => a.state.localeCompare(b.state));
});

const SelectState = async (state) => {
  let sspt = selectedState.value[view.value];
  // let ssptLength = sspt.length;
  // if (ssptLength == states.value.length) {
  //   selectedState.value[view.value] = [];
  //   selectedState.value[view.value].push(state.state);
  // } else {
  //   if (!sspt.includes(state.state)) {
  //     selectedState.value[view.value].push(state.state);
  //   } else {
  //     selectedState.value[view.value] = sspt.filter(
  //       (item) => item !== state.state
  //     );
  //   }
  // }

  // if (selectedState.value[view.value].length == 1) {
  //   store.launchAappLga();
  // }
  if (sspt.includes(state.state)) {
    selectedState.value[view.value] = sspt.filter(
      (item) => item !== state.state
    );

    if (selectedState.value[view.value].length === 0) {
      if (view.value != "map") {
        store.updateApp();
      } else {
        view.value = "map";
        store.launchAapp();
      }
      return;
    }
  } else {
    selectedState.value[view.value] = [];
    selectedState.value[view.value].push(state.state);
  }

  if (view.value != "map") {
    store.updateApp();
  } else {
    store.launchAappLga();
  }
  // console.log(selectedState.value[view.value]);
  //
};

const selectAllStates = async () => {
  mapType.value = "states";
  if (selectedState.value[view.value].length < states.value.length) {
    selectedState.value[view.value] = [];
    for (let i = 0; i < states.value.length; i++) {
      selectedState.value[view.value].push(states.value[i].state);
    }
    // store.launchAapp();
    store.updateApp();
  } else {
    selectedState.value[view.value] = [];
  }

  // states.value.forEach((s) => {
  //   selectAllStates.value[view.value].push(s.state);
  // });
};

// onMounted(() => {
//   console.log("sorted");
//   selectedState.value[view.value] = selectedState.value[view.value].toSorted();
// });

// const SelectState = async (state) => {
//   state
//     ? (selectedState.value[view.value] = state.state)
//     : (selectedState.value[view.value] = state);
//   selectedLga.value = {};
//   await store.fetchLgas();
//   await store.fetchFacilities();
//   store.updateApp();
// };
</script>
