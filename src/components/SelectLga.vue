<template>
  <template
    class="min-[3rem]: flex justify-start"
    v-if="selectedState[view].length == 1"
  >
    <div class="dropdown dropdown-bottom">
      <SelectBadge
        title="Support Types"
        v-if="selectedLga[view].length > 0"
      ></SelectBadge>
      <div
        tabindex="0"
        role="button"
        class="inline-flex justify-between shadow-sm p-3 m-1 pl-3 text-lg py-1 rounded-md border-2 border-rsmp-sec min-w-36"
      >
        <div class="inline-flex max-w-28 overflow-hidden">
          <div class="text-nowrap" v-if="selectedLga[view].length <= 0">
            LGA
          </div>
          <div v-else class="text-nowrap" v-for="lga in lgas">
            {{ lga.lga }}
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
        class="dropdown-content z-[99999] menu p-2 shadow-lg bg-base-100 rounded-none max-h-[70vh] grid overflow-x-auto border-2 border-rsmp-sec"
      >
        <li
          class="rounded-none border-b-2 border-blue-50"
          v-for="lga in lgas"
          :class="
            store.selected(selectedLga[view], lga.lga) ? 'bg-blue-300' : ''
          "
        >
          <a
            href=""
            @click.prevent="SelectLga(lga)"
            class="hover:rounded-none text-lg inline-flex justify-between"
          >
            <span>{{ lga.lga }}</span>
            <b
              class="w-8 h-8 rounded-full pr-1 bg-blue-200 text-center text-xs text-blue-900"
            >
              <CheckIcon v-if="selectedLga[view].includes(lga.lga)"></CheckIcon>
              <CloseIcon v-else></CloseIcon>
            </b>
          </a>
        </li>
      </ul>
    </div>
  </template>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useMainStore } from "./../storage/store";
import { storeToRefs } from "pinia";
import SelectBadge from "./SelectBadge.vue";
import CheckPlusIcon from "./CheckPlusIcon.vue";
import CheckIcon from "./CheckIcon.vue";
import CloseIcon from "./CloseIcon.vue";

const store = useMainStore();
const { selectedState, selectedLga, view, lgas } = storeToRefs(store);
const dropped = ref(false);

// const toggleDroped = () => {
//   dropped.value = !dropped.value;
// };

// const SelectLga = (state) => {
//   let sspt = selectedLga.value[view.value];

//   if (!sspt.includes(lga.lga)) {
//     selectedLga.value[view.value].push(lga.lga);
//   } else {
//     selectedLga.value[view.value] = sspt.filter((item) => item !== lga.lga);
//   }

//   // store.updateApp();
// };

const SelectLga = (lga) => {
  let spt = selectedLga.value[view.value];

  if (!spt.includes(lga.lga)) {
    selectedLga.value[view.value].push(lga.lga);
  } else {
    selectedLga.value[view.value] = spt.filter((item) => item !== lga.lga);
  }

  // console.log(selectedLga.value[view.value]);
  store.updateApp();
};

// const SelectLga = (lga) => {
//   lga
//     ? (selectedLga.value[view.value] = lga.lga)
//     : (selectedLga.value[view.value] = lga);

//   store.updateApp();
// };
</script>
