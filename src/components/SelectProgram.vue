<template>
  <template class="min-[3rem]: flex justify-start">
    <div class="dropdown dropdown-bottom">
      <SelectBadge
        title="Campaign Focus"
        v-if="selectedPrograms[view].length > 0"
      ></SelectBadge>
      <div
        tabindex="0"
        role="button"
        class="inline-flex justify-between shadow-sm p-3 m-1 pl-3 text-lg py-1 rounded-md border-2 border-rsmp-sec min-w-36"
      >
        <div class="inline-flex max-w-28 overflow-hidden">
          <div class="text-nowrap" v-if="selectedPrograms[view].length <= 0">
            Campaign Focus
          </div>
          <div
            v-else
            class="text-nowrap"
            v-for="program in selectedPrograms[view].slice(-2)"
          >
            {{ program }}
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
          v-for="program in programAreas"
          :class="
            store.selected(selectedPrograms[view], program.service)
              ? 'bg-blue-300'
              : ''
          "
        >
          <a
            href=""
            @click.prevent="SelectProgram(program)"
            class="hover:rounded-none text-lg inline-flex justify-between"
          >
            <span>{{ program.service }}</span>
            <b
              class="w-8 h-8 rounded-full pr-1 bg-blue-200 text-center text-xs text-blue-900"
            >
              <CheckIcon
                v-if="selectedPrograms[view].includes(program.service)"
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
import { onMounted, ref } from "vue";
import { useMainStore } from "./../storage/store";
import { storeToRefs } from "pinia";
import SelectBadge from "./SelectBadge.vue";
import CheckPlusIcon from "./CheckPlusIcon.vue";
import CheckIcon from "./CheckIcon.vue";
import CloseIcon from "./CloseIcon.vue";

const store = useMainStore();
// const dropped = ref(false);

const { selectedPrograms, view, programAreas } = storeToRefs(store);
// const toggleDroped = () => {
//   dropped.value = !dropped.value;
// };

const SelectProgram = (program) => {
  let sspt = selectedPrograms.value[view.value];

  if (!sspt.includes(program.service)) {
    selectedPrograms.value[view.value].push(program.service);
  } else {
    selectedPrograms.value[view.value] = sspt.filter(
      (item) => item !== program.service
    );
  }
  console.log(selectedPrograms.value[view.value]);
  // store.updateApp();
};
</script>
