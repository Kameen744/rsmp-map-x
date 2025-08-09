<template>
  <template class="min-[3rem]: flex justify-start">
    <div class="dropdown dropdown-bottom">
      <SelectBadge
        title="States"
        v-if="selectedState[view].length > 0"
      ></SelectBadge>

      <div
        tabindex="0"
        role="button"
        class="inline-flex justify-between shadow-sm p-3 py-1 m-1 pl-3 text-lg rounded-md border-2 border-rsmp-sec min-w-36"
      >
        <div class="inline-flex max-w-28 overflow-hidden">
          <div>
            <div class="text-nowrap" v-if="selectedState[view].length <= 0">
              State
            </div>
            <!-- v-for="state in states" -->
            <div v-else class="text-nowrap">
              <!-- {{ state.state }} -->
              {{ selectedState[view].length }} Selected
            </div>
          </div>
        </div>
        <b
          class="ml-4 w-8 h-8 rounded-full bg-blue-200 text-center text-xs text-blue-900"
        >
          <CheckPlusIcon></CheckPlusIcon>
        </b>
      </div>

      <ul
        tabindex="0"
        class="dropdown-content z-[99999] menu p-2 shadow-lg bg-base-100 rounded-md max-h-[70vh] grid overflow-x-auto border-2 border-rsmp-sec"
      >
        <li class="rounded-md border-b-2 border-blue-50">
          <a
            href=""
            @click.prevent="selectAllStates()"
            class="hover:rounded-md text-lg inline-flex justify-between"
          >
            <span>Select All</span>
          </a>
        </li>
        <li
          class="rounded-md border-b-2 border-blue-50"
          v-for="state in sortedStates"
          :class="
            store.selected(selectedState[view], state.state)
              ? 'bg-blue-300'
              : ''
          "
        >
          <a
            href=""
            @click.prevent="SelectState(state)"
            class="hover:rounded-md text-lg inline-flex justify-between"
          >
            <span>{{ state.state }}</span>
            <b
              class="w-8 h-8 rounded-full pr-1 text-center text-xs text-blue-900"
            >
              <CheckIcon
                v-if="selectedState[view].includes(state.state)"
              ></CheckIcon>
              <CloseIcon v-else></CloseIcon>
            </b>
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

const { selectedState, selectedLga, view, states, mapType } =
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
  // let sspt = selectedState.value[view.value];
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

  selectedState.value[view.value] = [];
  selectedState.value[view.value].push(state.state);
  store.launchAappLga();
  // console.log(selectedState.value[view.value]);
  // store.updateApp();
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
